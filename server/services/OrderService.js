const createError = require("http-errors");
const OrderModel = require("../models/ordersModel");
const OrderItemsModel = require("../models/orderItemsModel");
const { user } = require("pg/lib/defaults");

const OrderModelInstance = new OrderModel();
const OrderItemsModelInstance = new OrderItemsModel();

module.exports = class OrderService {
  // Retrieve all orders from ORDERS table
  async getAllOrders() {
    try {
      const order = await OrderModelInstance.getAllOrders();

      if (!order) {
        throw createError(404, "No orders in database");
      }

      return order;
    } catch (err) {
      throw err;
    }
  }

  // Get all user's orders with items within each order
  async listUserOrders(data) {
    const { userId } = data;
    try {
      const ordersWithItems =
        await OrderModelInstance.findByUserWithItems(userId);

      if (!ordersWithItems || ordersWithItems.length === 0) {
        throw createError(404, "No orders found for this user.");
      }

      return ordersWithItems;
    } catch (err) {
      throw err;
    }
  }

  async getByOrderId(data) {
    const { id } = data;

    try {
      const orderItems = await OrderModelInstance.findByOrderId(id);

      if (!orderItems) {
        throw createError(404, 'Order not found');
      }

      return orderItems;
    } catch (err) {
      throw err;
    }
  }
};
