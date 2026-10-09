const express = require("express");
const router = express.Router();
const { checkAuthentication } = require("../middleware/auth");
const RefundService = require("../services/RefundService");
const { rateLimiter } = require("../middleware/rateLimiters")

const RefundServiceInstance = new RefundService();

module.exports = (app) => {
  app.use(express.json());
  app.use("/api/refunds", rateLimiter, router);

  router.get("/", checkAuthentication, async (req, res, next) => {
    try {
        const passportId = req.user.id;

      const response = await RefundServiceInstance.getAll(passportId);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:refundId", checkAuthentication, async (req, res, next) => {
    try {
      const { refundId } = req.params;
      const passportId = req.user.id;

      const response = await RefundServiceInstance.getRefundById({refundId, passportId});

      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.post("/:orderId", checkAuthentication, async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { items, reason } = req.body;
      const passportId = req.user.id;

      const response = await RefundServiceInstance.refund({
        orderId,
        items,
        reason,
        passportId,
      });

      res.status(201).send(response);
    } catch (err) {
      next(err);
    }
  });
};
