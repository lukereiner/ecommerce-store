const createError = require("http-errors");
const CartModel = require("../models/cartsModel");
const CartItemsModel = require("../models/cartItemsModel");
const OrderModel = require("../models/ordersModel");
const OrderItemsModel = require("../models/orderItemsModel");

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

      await CartItemsModelInstance.deleteCart({userId});
    } catch (err) {
      throw err;
    }
  }

  // Checkout - create order
  async cartCheckout(userId, passportId, paymentInfo) {
    try {

      if (String(userId) !== String(passportId)) {
        throw createError(403, "Access denied: You cannot checkout for another user")
      }

      // Use userId to look up cartId to pass to cartItems below
      const cartId = await CartModelInstance.getCartByUser({ userId });

      // Retrieve cart items
      const cartItems =
        await CartItemsModelInstance.getCartItemsWithProducts(cartId);

      // Check for items before proceeding with order
      if (!cartItems || cartItems.length === 0) {
        throw createError(400, "Cannot proceed to checkout: cart is empty.");
      }

      // Generate a price for entire cart
      const subtotalCents = cartItems.reduce((sum, item) => {
        const itemPriceCents = Math.round(Number(item.price) * 100);
        const itemQty = Number(item.qty) || 1;
        return sum + itemPriceCents * itemQty;
      }, 0);

      const taxRate = 0.07;
      const taxCents = Math.round(subtotalCents * taxRate);

      // Convert grand total back to dollars
      const totalPrice = (subtotalCents + taxCents) / 100;

      // Generate the order
      const Order = new OrderModel({ totalPrice, userId });
      Order.addItems(cartItems);

      // Capture created order object from DB
      const savedOrder = await Order.createOrder();

      // Assign new generated db ID to active order
      Order.id = savedOrder.id;

      // Simulating payment processing
      console.log(
        `[Payment] Initializing charge of $${totalPrice} for User ${userId}...`,
      );

      // 3 second delay
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(2000);

      // Complete simulation of payment processing
      console.log(`[Payment] Charge successful via simulated gateway.`);

      const updatedOrder = await Order.update({
        id: Order.id,
        status: "COMPLETE",
      });

      if (updatedOrder.status === "COMPLETE") {
        // Map array elements to fit database model
        const orderItemsData = cartItems.map((item) => ({
          orderId: updatedOrder.id,
          productId: item.productid,
          quantity: item.qty,
          price: Number(item.price),
        }));

        const generateOrderItems =
          await OrderItemsModelInstance.create(orderItemsData);
      }

      const isCartCleared = await CartItemsModelInstance.deleteCart({ userId });

      return updatedOrder;
    } catch (err) {
      throw err;
    }
  }
};
