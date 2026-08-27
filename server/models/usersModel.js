const db = require("../db/myPool");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class UserModel {
  // create new user record
  async create(data) {
    try {
      // Generate SQL statement
      const statement = pgp.helpers.insert(data, null, "users") + "RETURNING *";

      // Execute SQL statement
      const result = await db.query(statement);

      // Ensure if rows are undefined or zero, doesn't crash server
      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Update a user record
  async update(data) {
    try {
      const { id, ...params } = data;

      // Generate SQL Statement to update
      const condition = pgp.as.format("WHERE id = ${id} RETURNING *", { id });
      const statement = pgp.helpers.update(params, null, "users") + condition;

      // EXECUTE SQL STATEMENT
      const result = await db.query(statement);

      // Ensure if rows are undefined or zero, doesn't crash server
      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Find user record by email
  async findUserByEmail(email) {
    try {
        const statement = 'SELECT * FROM users WHERE email = $1';
        const values = [email];

        // Execute SQL statement
        const result = await db.query(statement, values);

        // Ensure if rows are undefined or zero, doesn't crash server
        if (result.rows?.length) {
            return result.rows[0];
        }

        return null;

    } catch(err) {
        throw new Error(err); 
    }
  }

  async findUserById(id) {
    try {
        const statement = 'SELECT * FROM users WHERE id = $1';
        const values = [id];

        // Execute SQL statement
        const result = await db.query(statement, values);

        // Ensure if rows are undefined or zero, doesn't crash server
        if (result.rows?.length) {
            return result.rows[0];
        }

        return null;

    } catch(err) {
        throw new Error(err);
    }
  };
};
