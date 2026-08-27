const createError = require("http-errors");
const CartModel = require("../models/cartsModel");
const CartItemsModel = require("../models/cartItemsModel");
const OrderModel = require("../models/ordersModel");
const { user } = require("pg/lib/defaults");
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
    try {
      const cart = await CartModelInstance.getCartUser(data);
      if (!cart) {
        throw createError(404, "No cart for this user");
      }

      const { created, modified, ...cleanCart } = cart;

      const itemsWithProducts = await CartItemsModelInstance.getCartItemsWithProducts(cart.cartid);

      cleanCart.items = itemsWithProducts;

      return cleanCart;
    } catch (err) {
      throw err;
    }
  }

  async getCartById(data) {
    const { id } = data;

    try {
      const cart = await CartModelInstance.getCartId(id);

      if (!cart) {
        throw createError(404, "Cart not found");
      }

      const itemsWithProducts = await CartItemsModelInstance.getCartItemsWithProducts(cart.cartid);

      cart.items = itemsWithProducts;

      return cart;
    } catch (err) {
      throw err;
    }
  }

  // CART ITEMS MODEL
  // add items to cart
  async addItems(data) {
    try {
      const itemsToAdd = await CartItemsModelInstance.addToCart(data);

      if (!itemsToAdd) {
        throw createError(400, "No item(s) to add. Check to make sure you do not already have the product you are trying to add.");
      }

      return itemsToAdd;
    } catch (err) {
      throw err;
    }
  }

  // update select items in cart
  async updateItems(data) {
    try {
      const itemsToUpdate = await CartItemsModelInstance.update(data);

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
    try {
      const itemsToDelete = await CartItemsModelInstance.delete(data);

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
    try {
      const cartToDelete = await CartItemsModelInstance.deleteCart(data);

      if (!cartToDelete) {
        throw createError(404, "Cannot delete cart")
      }
    } catch (err) {
      throw err;
    }
  }

  // Checkout - create order
  async cartCheckout(userId, paymentInfo) {
    try {
      // Use userId to look up cartId to pass to cartItems below
      const cartId = await CartModelInstance.getCartByUser({userId});

      // Retrieve cart items
      const cartItems = await CartItemsModelInstance.getCartItemsWithProducts(cartId);

      // Check for items before proceeding with order
      if (!cartItems || cartItems.length === 0) {
        throw createError(400, 'Cannot proceed to checkout: cart is empty.')
      }
      
      // Generate a price for entire cart
      const totalPrice = cartItems.reduce((total, item) => {
        return total += Number(item.price);
      },0)

      // Generate the order
      const Order = new OrderModel({totalPrice, userId});
      Order.addItems(cartItems);

      // Capture created order object from DB
      const savedOrder = await Order.createOrder();

      // Assign new generated db ID to active order
      Order.id = savedOrder.id;

      // Simulating payment processing
      console.log(`[Payment] Initializing charge of $${totalPrice} for User ${userId}...`);
      
      // 3 second delay
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(2000);

      // Complete simulation of payment processing
      console.log(`[Payment] Charge successful via simulated gateway.`);

      const updatedOrder = await Order.update({ id: Order.id, status: 'COMPLETE'});

      if (updatedOrder.status === 'COMPLETE') {
        // Map array elements to fit database model
        const orderItemsData = cartItems.map(item => ({
          orderId: updatedOrder.id,
          productId: item.productid,
          quantity: item.qty,
          price: Number(item.price)
        }));

        const generateOrderItems = await OrderItemsModelInstance.create(orderItemsData);
      }

      const isCartCleared = await CartItemsModelInstance.deleteCart({userId});

      return updatedOrder;

    } catch (err) {
      throw err;
    }
  }
};
