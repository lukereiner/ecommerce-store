const createError = require("http-errors");
const bcrypt = require("bcrypt")
const UserModel = require('../models/usersModel');
const UserModelInstance = new UserModel();

module.exports = class AuthService {
    async register(data) {
        const { email, password, firstname, lastname } = data;

        try {
            // Check if user exists
            const userExists = await UserModelInstance.findUserByEmail(email);
            if (userExists) {
                // Throw conflict error
                throw createError(409, "Email is already registered")
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Prep data, save to DB
            const newUser = await UserModelInstance.create({
                email,
                password: hashedPassword,
                firstname,
                lastname
            });

            if (newUser) {
                return { id: newUser.id};
            }
        } catch (err) {
            throw err;
        }
    }
}