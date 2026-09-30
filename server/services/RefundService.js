const createError = require("http-errors");
const { squareClient, randomUUID } = require("../utils/squareClient");
const RefundModel = require("../models/refundsModel");
const OrderModel = require("../models/ordersModel");
const RefundItemModel = require("../models/refundItemsModel");

const RefundModelInstance = new RefundModel();
const OrderModelInstance = new OrderModel();
const RefundItemModelInstance = new RefundItemModel();

module.exports = class RefundService {
  async getAll() {
    try {
      const refunds = await RefundModelInstance.allRefunds();

      if (!refunds) {
        throw createError(404, "No refunds in database");
      }

      return refunds;
    } catch (err) {
      throw err;
    }
  }

  async refund(data) {
    const { orderId, items } = data;

    try {
        // Fetch user ID for order to use for Square details
        const getUserId = await OrderModelInstance.findByOrderId(orderId);

      // 1. Fetch order details (handles array or single object return)
      const searchOrderResult = await OrderModelInstance.findByOrderWithItems(
        Number(orderId),
      );

      console.log('searchOrderResult: ', searchOrderResult)

      const order = Array.isArray(searchOrderResult)
        ? searchOrderResult[0]
        : searchOrderResult;

      if (!order) {
        throw createError(404, "Order not found");
      }

      const orderItems = order.items || [];

      // 2. Format refund items and match price from original order items
      const itemsToRefund = Object.entries(items).map(([itemId, quantity]) => {
        const cleanItemId = Number(itemId);
        const cleanQty = Number(quantity);

        // Find matching item from order.items where item.id matches the incoming key
        const matchedOrderItem = orderItems.find((oi) => oi.id === cleanItemId);

        if (!matchedOrderItem) {
          throw createError(
            400,
            `Item #${cleanItemId} is not part of order #${orderId}`,
          );
        }

        // Extract price from matched order item
        const itemPrice = Number(matchedOrderItem.price);

        return {
          itemId: cleanItemId,
          quantity: cleanQty,
          price: itemPrice,
          priceCents: Math.round(itemPrice * 100),
        };
      });

      // 3. Calculate financial totals using cents
      const subtotalCents = itemsToRefund.reduce((sum, item) => {
        return sum + item.priceCents * item.quantity;
      }, 0);

      const TAX_RATE = 0.07;
      const taxCents = Math.round(subtotalCents * TAX_RATE);
      const totalCents = subtotalCents + taxCents;

      const refundAmountDollars = totalCents / 100;

      const Refund = new RefundModel({
        orderId: Number(orderId),
        amount: refundAmountDollars,
      });
      Refund.addItems(itemsToRefund);
      const savedRefund = await Refund.createRefund();
      Refund.id = savedRefund.id;

      // Refund customer via Square API
      let refundResult;
      try {
        const response = await squareClient.refunds.refundPayment({
            idempotencyKey: randomUUID(),
            amountMoney: {
                amount: BigInt(totalCents),
                currency: "USD",
            },
            reason: "Didn't want items",
            //customerId: String(getUserId.userid),
            paymentId: searchOrderResult.square_payment_id,
        })

        refundResult = response.refund;
      } catch (sqErr) {
        console.error("[Square Error]", sqErr)
        throw createError(
            400,
            sqErr.errors?.[0]?.detail ||
            sqErr.message ||
            "Refund processing failed.",
        );
      }

      // Simulating payment processing
      console.log(
        `[Refund] Initializing charge of $${refundAmountDollars} for User...`,
      );

      // 3 second delay
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(2000);

      // Complete simulation of payment processing
      console.log(`[Refund] Charge successful via simulated gateway.`);

      const updatedRefund = await Refund.update({
        id: Refund.id,
        status: "COMPLETE",
        reason: refundResult.reason,
      });

      const refundItemsData = itemsToRefund.map((item) => ({
        refundId: updatedRefund.id,
        quantity: item.quantity,
        amount: item.price,
        itemId: item.itemId,
      }));

      await RefundItemModelInstance.create(refundItemsData);
    } catch (err) {
      throw err;
    }
  }
};
