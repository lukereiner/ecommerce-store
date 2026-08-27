const db = require("../db/myPool");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class ProductModel {
    // find all orders
    async findAll() {
        try {
            const statement = 'SELECT * FROM products';
            const result = await db.query(statement);

            if (result.rows?.length) {
                return result.rows;
            }

            return null;
        } catch (err) {
            throw new Error(err);
        }
    }

    // find Product by ID
    async findProductById(id) {
        try {
            const statement = 'SELECT * FROM products WHERE id = $1';
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
}