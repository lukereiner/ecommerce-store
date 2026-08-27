const express = require("express");
const router = express.Router();
const AuthService = require("../services/AuthService");
const AuthServiceInstance = new AuthService();
const passport = require("passport");

module.exports = (app) => {
  app.use("/auth", router);

  // Create a user
  router.post("/register", async (req, res, next) => {
    try {
      const { email, password, firstname, lastname } = req.body;

      // Check if email and password were provided
      if (!email || !password || !firstname || !lastname) {
        return res
          .status(400)
          .json({ message: "Email, firstname, lastname, and password are required!" });
      }

      const newUser = await AuthServiceInstance.register({ email, password, firstname, lastname });

      // Created HTTP response
      return res.status(201).json({
        message: "User created successfully!",
      });
    } catch (err) {
      next(err);
    }
  });

  // User Login
  router.post("/login", passport.authenticate("local"), (req, res) => {
    // if this code executes, auth success
    // Passport auto established the session, attached the user to req.user
    const { password, ...cleanUser } = req.user;
    res.status(200).json({
      message: "Logged in successfully",
      user: cleanUser,
    });
  });

  router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }

            res.clearCookie('connect.sid'); // Default express-session cookie name

            return res.status(200).json({
                message: "Logged out successfully"
            })
        })
    })
  })
};