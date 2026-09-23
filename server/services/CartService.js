const createError = require("http-errors");
const CartModel = require("../models/cartsModel");
const CartItemsModel = require("../models/cartItemsModel");
const OrderModel = require("../models/ordersModel");
const OrderItemsModel = require("../models/orderItemsModel");
const { squareClient, randomUUID } = require("../utils/squareClient");

const CartModelInstance = new CartModel();
const CartItemsModelInstance = new CartItemsModel();
const OrderItemsModelInstance = new OrderItemsModel();

module.exports = class CartService {
  async create(data) {
    try {
      const cart = await CartModelInstance.create(data);

      if (!cart) {
        throw createError(404, "No cart in database");
      }

      return cart;
    } catch (err) {
      throw err;
    }
  }

  async getCartByUser(data) {
    const { userId, passportId } = data;

    try {
      if (String(userId) !== String(passportId)) {
        throw createError(
          403,
          "Access denied: You cannot access another user's cart",
        );
      }

      const cart = await CartModelInstance.getCartUser(data);

      if (!cart) {
        throw createError(404, "No cart for this user");
      }

      const { created, modified, ...cleanCart } = cart;

      const itemsWithProducts =
        await CartItemsModelInstance.getCartItemsWithProducts(cart.cartid);

      cleanCart.items = itemsWithProducts;

      return cleanCart;
    } catch (err) {
      throw err;
    }
  }

  async getCartById(data) {
    const { id, passportId } = data;

    try {
      const cart = await CartModelInstance.getCartId(id);

      if (!cart) {
        throw createError(404, "Cart not found");
      }

      if (cart.userid !== passportId) {
        throw createError(
          403,
          "Access denied: You cannot access another user's cart",
        );
      }

      const itemsWithProducts =
        await CartItemsModelInstance.getCartItemsWithProducts(cart.cartid);

      cart.items = itemsWithProducts;

      return cart;
    } catch (err) {
      throw err;
    }
  }

  // CART ITEMS MODEL
  // add items to cart
  async addItems(data) {
    const { userId, passportId, ...rest } = data;

    try {
      if (String(userId) !== String(passportId)) {
        throw createError(
          403,
          "Access denied: Cannot add items to another user's cart",
        );
      }

      const itemsToAdd = await CartItemsModelInstance.addToCart({
        userId,
        ...rest,
      });

      if (!itemsToAdd) {
        throw createError(
          400,
          "No item(s) to add. Check to make sure you do not already have the product you are trying to add.",
        );
      }

      return itemsToAdd;
    } catch (err) {
      throw err;
    }
  }

  // update select items in cart
  async updateItems(data) {
    const { userId, passportId, ...rest } = data;
    try {
      if (String(userId) !== String(passportId)) {
        throw createError(
          403,
          "Access denied: You cannot update another user's cart",
        );
      }

      const itemsToUpdate = await CartItemsModelInstance.update({ ...rest });

      if (!itemsToUpdate) {
        throw createError(404, "Cannot update item");
      }

      return itemsToUpdate;
    } catch (err) {
      throw err;
    }
  }

  // delete select items in cart
  async deleteItems(data) {
    const { userId, passportId, ...rest } = data;

    try {
      if (String(userId) !== String(passportId)) {
        throw createError(
          403,
          "Access denied: You do not have permission to delete an item from another user's cart",
        );
      }

      const itemsToDelete = await CartItemsModelInstance.delete({ ...rest });

      if (!itemsToDelete) {
        throw createError(404, "Cannot delete item");
      }

      return itemsToDelete;
    } catch (err) {
      throw err;
    }
  }

  // Delete all items in cart
  async deleteMyCart(data) {
    const { userId, passportId } = data;

    try {
      if (String(userId) !== String(passportId)) {
        throw createError(
          403,
          "Access denied: You do not have permission to delete an item from another user's cart",
        );
      }

      await CartItemsModelInstance.deleteCart({ userId });
    } catch (err) {
      throw err;
    }
  }

  // Checkout - create order
  async cartCheckout(userId, passportId, paymentInfo) {
    try {
      if (String(userId) !== String(passportId)) {
        throw createError(
          403,
          "Access denied: You cannot checkout for another user",
        );
      }

      const { sourceId } = paymentInfo;
      if (!sourceId) {
        throw createError(400, "Missing payment source token (sourceId).");
      }

      // 1. Look up user cart and items
      const cartId = await CartModelInstance.getCartByUser({ userId });
      const cartItems =
        await CartItemsModelInstance.getCartItemsWithProducts(cartId);

      if (!cartItems || cartItems.length === 0) {
        throw createError(400, "Cannot proceed to checkout: cart is empty.");
      }

      // 2. Calculate subtotal & tax in cents
      const subtotalCents = cartItems.reduce((sum, item) => {
        const itemPriceCents = Math.round(Number(item.price) * 100);
        const itemQty = Number(item.qty) || 1;
        return sum + itemPriceCents * itemQty;
      }, 0);

      const taxRate = 0.07;
      const taxCents = Math.round(subtotalCents * taxRate);
      const totalCents = subtotalCents + taxCents;
      const totalPrice = totalCents / 100;

      // 3. Create initial order in pending status
      const Order = new OrderModel({ totalPrice, userId });
      Order.addItems(cartItems);
      const savedOrder = await Order.createOrder();
      Order.id = savedOrder.id;

      // 4. Charge payment via Square API
      let paymentResult;
      try {
        const response = await squareClient.payments.create({
          sourceId, // Payment token generated by frontend
          idempotencyKey: randomUUID(), // Prevents duplicate charges
          amountMoney: {
            amount: BigInt(totalCents),
            currency: "USD",
          },
          note: `Order #${Order.id} for User ${userId}`,
          referenceId: String(Order.id),
        });

        paymentResult = response.payment || response.result?.payment;
      } catch (sqErr) {
        console.error("[Square Error]", sqErr);
        throw createError(
          400,
          sqErr.errors?.[0]?.detail ||
            sqErr.message ||
            "Payment processing failed.",
        );
      }

      // 5. If payment succeeds, update order status and clear cart
      if (paymentResult && paymentResult.status === "COMPLETED") {
        const updatedOrder = await Order.update({
          id: Order.id,
          status: "COMPLETE",
        });

        const orderItemsData = cartItems.map((item) => ({
          orderId: updatedOrder.id,
          productId: item.productid,
          quantity: item.qty,
          price: Number(item.price),
        }));

        await OrderItemsModelInstance.create(orderItemsData);
        await CartItemsModelInstance.deleteCart({ userId });

        return {
          order: updatedOrder,
          transactionId: String(paymentResult.id),
        };
      } else {
        throw createError(
          400,
          `Payment status unresolved: ${paymentResult?.status || "UNKNOWN"}`,
        );
      }
    } catch (err) {
      throw err;
    }
  }
};
