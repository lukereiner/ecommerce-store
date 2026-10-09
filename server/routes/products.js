const express = require("express");
const router = express.Router();
const ProductService = require("../services/ProductService");
const { rateLimiter } = require("../middleware/rateLimiters");
const { checkAuthentication } = require("../middleware/auth")

const ProductServiceInstance = new ProductService();

module.exports = (app) => {
  app.use(express.json());
  app.use("/api/products", rateLimiter, router);

  router.get("/", checkAuthentication, async (req, res, next) => {
    try {
      const response = await ProductServiceInstance.findAll();
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", checkAuthentication, async (req, res, next) => {
    try {
      const { id } = req.params;

      const response = await ProductServiceInstance.get({ id: id });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};
