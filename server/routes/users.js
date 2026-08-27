const express = require("express");
const router = express.Router();
const UserService = require("../services/UserService");

const UserServiceInstance = new UserService();

module.exports = (app) => {
  app.use(express.json());
  app.use("/users", router);

  router.get("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;

      const response = await UserServiceInstance.get({ id: id });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;

      const response = await UserServiceInstance.update({ id: id, ...data });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};
