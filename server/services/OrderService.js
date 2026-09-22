const createError = require("http-errors");
const OrderModel = require("../models/ordersModel");

const OrderModelInstance = new OrderModel();

module.exports = class OrderService {
  // Retrieve all orders from ORDERS table
  async getAllOrders(data) {
    const { passportId } = data;

    try {
      
      if (passportId !== 19) {
        // using id of 19 as an admin to test only this account can access all orders

        throw createError(
          403,
          "Access denied: you are not the admin and cannot view all orders",
        );
      }

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
    const { userId, passportId } = data;
    
    try {
      const convertedPassportId = String(passportId);

      if (userId !== convertedPassportId) {
        throw createError(
          403,
          "Access denied: You do not have permission to view this order"
        )
      }

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
    const { id, passportId } = data;

    try {
      const orderItems = await OrderModelInstance.findByOrderId(id);

      if (!orderItems) {
        throw createError(404, "Order not found");
      }

      if (orderItems.userid !== passportId) {
        throw createError(
          403,
          "Access denied: You do not have permission to view this order"
        )
      }

      return orderItems;
    } catch (err) {
      throw err;
    }
  }
};
