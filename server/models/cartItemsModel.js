const db = require("../db/myPool");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class CartItemsModel {
  // Add items to cart - will reject attempt if item already in cart
  async addToCart(data) {
    const { userId, productId, qty } = data;

    try {
      const statement = `
      INSERT INTO cart_items (cartid, productid, qty)
      SELECT c.cartid, $2, $3
      FROM carts c
      WHERE c.userid = $1
      AND NOT EXISTS (
        SELECT 1
        FROM cart_items ci
        WHERE ci.cartid = c.cartid
        AND ci.productid = $2
      )
        RETURNING cartid, productid, qty;
      `;

      const result = await db.query(statement, [userId, productId, qty]);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      console.log('db error: cart already has this product - will not be re-added')
      throw new Error(err);
    }
  }

  // get cart items with product details
  async getCartItemsWithProducts(cartId) {
    try {
      const statement = `
            SELECT 
                ci.qty, ci.productid,
                p.name, p.price, p.description
            FROM cart_items ci
            INNER JOIN products p ON ci.productid = p.id
            WHERE ci.cartid = $1
        `;
      const result = await db.query(statement, [cartId]);
      return result.rows;
    } catch (err) {
      throw new Error(err);
    }
  }

  // update cart
  async update(data) {
    const { cartItemId, ...body } = data;

    try {
      const condition = pgp.as.format(" WHERE id = ${cartItemId} RETURNING *", {
        cartItemId,
      });
      const statement =
        pgp.helpers.update(body, null, "cart_items") + condition;

      const result = await db.query(statement);

      if (result.rows?.length) {
        const row = result.rows[0];

        // Format the dates specifically to America/New_York
        const easternFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          fractionalSecondDigits: 3,
          hour12: false,
        });

        // Override the raw Date objects with Eastern string formats if they exist
        if (row.created)
          row.created = easternFormatter.format(new Date(row.created));
        if (row.modified)
          row.modified = easternFormatter.format(new Date(row.modified));

        return row;
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  // delete items in cart
  async delete(data) {
    const { cartItemId } = data;

    try {
      const statement =
        "DELETE FROM cart_items WHERE id = $1 RETURNING *";

      const result = await db.query(statement, [cartItemId]);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Delete all items in cart - used to clear cart items after an order has been completed
  async deleteCart(data) {
    const { userId } = data;

    try {
      const statement = `
      DELETE FROM cart_items
      USING carts
      WHERE cart_items.cartid = carts.cartId
      AND carts.userid = $1
      `;

      const result = await db.query(statement, [userId]);

      // returns true if items were deleted, false if the cart was already empty, as result.rowCount tells how many records were actually deleted
      return result.rowCount > 0;

    } catch (err) {
      throw new Error(err);
    }
  }
};
