const createError = require("http-errors");
const UserModel = require("../models/usersModel");
const UserModelInstance = new UserModel();

module.exports = class UserService {
  async get(data) {
    const { id, userId } = data;

    console.log('userId: ', userId, 'id param: ', id);
    

    try {
      const user = await UserModelInstance.findUserById(id);

      // 1. First check if user exists
      if (!user) {
        throw createError(404, "User record not found");
      }

      // 2. Check ownership BEFORE returning data
      if (user.id !== userId) {
        throw createError(
          403,
          "Access denied: You do not have permission to view this user",
        );
      }

      const { password, modified, ...cleanUser } = user;
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
    const { id, userId, firstname, lastname, email } = data;

    try {

      const existingUser = await UserModelInstance.findUserById(id);

      if (!existingUser) {
        throw createError(404, "User record not found");
      }

      // 2. Check authorization BEFORE making changes in DB
      if (existingUser.id !== userId) {
        throw createError(
          403,
          "Access denied: You do not have permission to update this user"
        );
      }

     // 3. Execute update with whitelisted data only
      const updatedUser = await UserModelInstance.update({
        id: userId, // Ensure DB operation targets authenticated ID
        firstname,
        lastname,
        email
      });

      const { password, created, modified, ...cleanUser } = updatedUser;

      return cleanUser;
    } catch (err) {
      throw err;
    }
  }
};
