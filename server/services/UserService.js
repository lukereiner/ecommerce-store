const createError = require("http-errors");
const UserModel = require("../models/usersModel");
const UserModelInstance = new UserModel();

module.exports = class UserService {
  async get(data) {
    const { id } = data;

    try {
      // Check if user already exists
      const user = await UserModelInstance.findUserById(id);

      const { password, created, modified, ...cleanUser } = user;

      // If user doesn't exist, reject
      if (!user) {
        throw createError(404, "User record not found");
      }

      return cleanUser;
    } catch (err) {
      throw err;
    }
  }

  async findByEmail(data) {
    const { email } = data;

    try {
      // Check if email exists
      const email = await UserModelInstance.findUserByEmail(email);

      // If email doesn't exist, reject
      if (!email) {
        throw createError(404, "Email not found");
      }

      return email;
    } catch (err) {
      throw err;
    }
  }

  async update(data) {
    try {
      // Check if user already exists
      const user = await UserModelInstance.update(data);

      const { id, password, created, modified, ...cleanUser } = user;

      return cleanUser;
    } catch (err) {
      throw err;
    }
  }
};
