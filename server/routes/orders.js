const express = require("express");
const router = express.Router();
const OrderService = require("../services/OrderService");
const { checkAuthentication } = require("../middleware/auth")

const OrderServiceInstance = new OrderService();

module.exports = (app) => {
  app.use(express.json());
  app.use("/orders", router);

  router.get("/", checkAuthentication, async (req, res, next) => {
    try {
      const passportId = req.user.id;

      const response = await OrderServiceInstance.getAllOrders({passportId});
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.get("/user/:userId", checkAuthentication, async (req, res, next) => {
    try {
      const { userId } = req.params;
      const passportId = req.user.id;

      const response = await OrderServiceInstance.listUserOrders({ userId, passportId });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", checkAuthentication, async (req, res, next) => {
    try {
      const { id } = req.params;
      const passportId = req.user.id;

      const response = await OrderServiceInstance.getByOrderId({ id, passportId });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  })
};
