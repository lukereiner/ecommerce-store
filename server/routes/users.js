const express = require("express");
const router = express.Router();
const UserService = require("../services/UserService");
const { checkAuthentication } = require("../middleware/auth")

const UserServiceInstance = new UserService();

module.exports = (app) => {
  app.use(express.json());
  app.use("/users", router);

  router.get("/:id", checkAuthentication, async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const response = await UserServiceInstance.get({ id, userId });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.put("/:id", checkAuthentication, async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const data = req.body;

      const response = await UserServiceInstance.update({ id, userId, ...data });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};
