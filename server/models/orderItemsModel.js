const db = require("../db/myPool");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class OrderItemsModel {
  constructor(data = {}) {
    this.name = data.name;
    this.quantity = data.quantity || null;
    this.price = data.price || 0;
    this.orderId = data.orderId || null;
    this.productId = data.productId;
    this.description = data.description;
  }

  async create(data) {
    try {
      const columnSet = new pgp.helpers.ColumnSet(
        [
          { name: "orderid", prop: "orderId" },
          { name: "productid", prop: "productId" },
          { name: "quantity", prop: "quantity" },
          { name: "price", prop: "price" },
        ],
        { table: "order_items" },
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
