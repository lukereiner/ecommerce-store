const express = require("express");
const router = express.Router();
const ProductService = require("../services/ProductService");

const ProductServiceInstance = new ProductService();

module.exports = (app) => {
  app.use(express.json());
  app.use("/products", router);

  router.get("/", async (req, res, next) => {
    try {
      const response = await ProductServiceInstance.findAll();
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;

      const response = await ProductServiceInstance.get({ id: id });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};
