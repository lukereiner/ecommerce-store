const db = require("../db/myPool");
const pgp = require("pg-promise")({ capSQL: true });
const OrderItem = require("./orderItemsModel");

module.exports = class OrderModel {
  constructor(data = {}) {
    this.items = data.items || [];
    this.status = data.status || "PENDING";
    this.total = data.totalPrice || 0;
    this.userid = data.userId || null;
  }

  addItems(items) {
    this.items = items.map((item) => new OrderItem(item));
  }

  // Retrieve all orders
  async getAllOrders() {
    try {
      const statement = "SELECT * FROM orders";

      const result = await db.query(statement);

      if (result.rows?.length) {
        return result.rows;
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  // create order from checkout
  async createOrder() {
    try {
      const { items, ...order } = this;

      const statement =
        pgp.helpers.insert(order, null, "orders") + " RETURNING*";

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

  // Update order from checkout
  async update(data) {
    try {
      const condition = pgp.as.format("WHERE id = ${id} RETURNING *", {
        id: data.id,
      });

      const { id, ...updateFields } = data;

      const statement =
        pgp.helpers.update(updateFields, null, "orders") + condition;

      const result = await db.query(statement);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Find order by User ID with items
  async findByUserWithItems(userId) {
    try {
      const statement = `
      SELECT 
        o.id, 
        o.created, 
        o.modified, 
        o.total, 
        o.status, 
        o.userid,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'productid', oi.productid,
              'quantity', oi.quantity,
              'price', oi.price,
              'name', p.name,
              'description', p.description
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.orderid
      LEFT JOIN products p ON oi.productid = p.id
      WHERE o.userid = $1
      GROUP BY o.id
      ORDER BY o.created DESC;
    `;

      const result = await db.query(statement, [userId]);
      return result.rows || [];
    } catch (err) {
      throw new Error(err);
    }
  }

  async findByOrderId(id) {
    try {
      const statement = 'SELECT * FROM orders WHERE id = $1';

      const result = await db.query(statement, [id]);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }
};
