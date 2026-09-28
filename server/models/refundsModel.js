const db = require("../db/myPool");
const pgp = require("pg-promise")({ capSQL: true });
const RefundItem = require("./refundItemsModel");

module.exports = class RefundModel {
  constructor(data = {}) {
    this.items = data.items || [];
    this.order_id = data.orderId || null;
    this.square_refund_id = data.squareRefundId || null;
    this.square_payment_id = data.squarePaymentId || null;
    this.amount = data.amount || null;
    this.currency = data.currency || "USD";
    this.status = data.status || "PENDING";
    this.reason = data.reason || null;
  }

  addItems(items) {
    this.items = items.map((item) => new RefundItem(item));
  }

  // Retrieve all refunds
  async allRefunds() {
    try {
      const statement = "SELECT * FROM refunds";
      const result = await db.query(statement);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Create refund from order detail
  async createRefund() {
    const { items, ...refund } = this;

    console.log('refund model this: ', this);
    

    try {
      const statement =
        pgp.helpers.insert(refund, null, "refunds") + " RETURNING *";

      const result = await db.query(statement);

      if (result.rows?.length) {
        Object.assign(this, result.rows[0]);
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Update refund - await square successful processing
  async update(data) {
    try {
      const condition = pgp.as.format("WHERE id = ${id} RETURNING *", {
        id: data.id,
      })

      const { id, ...updateFields } = data;

      const statement = pgp.helpers.update(updateFields, null, "refunds") + condition;

      const result = await db.query(statement);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }
};
