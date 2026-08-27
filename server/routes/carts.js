const express = require("express");
const router = express.Router();
const CartService = require("../services/CartService");

const CartServiceInstance = new CartService();

module.exports = (app) => {
  app.use(express.json());
  app.use("/carts", router);

  router.post("/user/:userId", async (req, res, next) => {
    try {
      const { userId } = req.params;

      const response = await CartServiceInstance.create({ userId });
      res.status(201).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.get("/user/:userId", async (req, res, next) => {
    try {
      const { userId } = req.params; // this will change to use auth so other user's carts cannot by viewed by anyone - this doesn't work bc body is data to be sent. Needs to be cleaned up in three files for when auth is added

      const response = await CartServiceInstance.getCartByUser({ userId });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;

      const response = await CartServiceInstance.getCartById({ id });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  // CART ITEMS MODEL

  // Add items for user's cart
  router.post("/user/:userId/items", async (req, res, next) => {
    try {
      const { userId } = req.params;
      const data = { ...req.body, userId };

      // Passing as a clean object
      const response = await CartServiceInstance.addItems(data);

      res.status(201).send(response);
    } catch (err) {
      res
        .status(400)
        .send(
          "No item(s) to add. Check to make sure you do not already have the product you are trying to add.",
        );
      next(err);
    }
  });

  // Update select item by item ID
  router.patch("/user/:userId/items/:cartItemId", async (req, res, next) => {
    try {
      const { cartItemId } = req.params;
      const data = req.body;

      const response = await CartServiceInstance.updateItems({
        cartItemId,
        ...data,
      });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  // Delete select item by item ID
  router.delete("/user/:userId/items/:cartItemId", async (req, res, next) => {
    const { cartItemId } = req.params;
    try {
      const response = await CartServiceInstance.deleteItems({ cartItemId });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // Delete all items in cart
  router.delete("/user/:userId/items", async (req, res, next) => {
    const { userId } = req.params;

    try {
      const response = await CartServiceInstance.deleteMyCart({ userId });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // Checkout
  router.post("/user/:userId/checkout", async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { paymentInfo } = req.body;

      const response = await CartServiceInstance.cartCheckout(userId, paymentInfo);

      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};
