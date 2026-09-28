const db = require("../db/myPool");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class RefundItemsModel {
  constructor(data = {}) {
    this.refundId = data.refundId;
    this.itemId = data.itemId;
    this.quantity = data.quantity;
    this.amount = data.amount;
  }

  async create(data) {
    try {
      const columnSet = new pgp.helpers.ColumnSet(
        [
          { name: "refund_id", prop: "refundId" },
          { name: "order_item_id", prop: "itemId" },
          { name: "quantity", prop: "quantity" },
          { name: "amount", prop: "amount" },
        ],
        { table: "refund_items" },
      );

      const statement = pgp.helpers.insert(data, columnSet) + " RETURNING *";

      const result = await db.query(statement);

      if (result.rows?.length) {
        return result.rows;
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }
};
