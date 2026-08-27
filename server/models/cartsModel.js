const db = require("../db/myPool");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class CartModel {
  // create new cart
  async create(data) {
    const { userId } = data;
    try {
      const statement = `
            INSERT INTO carts (userid)
            VALUES ($1)
            RETURNING cartid, userid, created, modified
            `;

      const result = await db.query(statement, [userId]);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  // find cart by userID
  async getCartUser(data) {
    const { userId } = data;
    try {
      const statement = "SELECT * FROM carts WHERE userid = $1";
      const values = [userId];

      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getCartByUser(data) {
    const { userId } = data;

    try {
      const statement = `
            SELECT cartid
            FROM carts
            WHERE userid = $1
            `;
      const value = [userId];

      const result = await db.query(statement, value);

      if (result.rows?.length) {
        return result.rows[0].cartid;
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  // find cart by cartID
  async getCartId(id) {
    try {
      const statement = "SELECT * FROM carts WHERE cartid = $1";
      const values = [id];

      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }
};
