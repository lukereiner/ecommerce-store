const express = require("express");
const router = express.Router();
const CartService = require("../services/CartService");
const { checkAuthentication } = require("../middleware/auth")

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

  router.get("/user/:userId", checkAuthentication, async (req, res, next) => {
    try {
      const { userId } = req.params; 
      const passportId = req.user.id;

      const response = await CartServiceInstance.getCartByUser({ userId, passportId });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id", checkAuthentication, async (req, res, next) => {
    try {
      const { id } = req.params;
      const passportId = req.user.id;

      const response = await CartServiceInstance.getCartById({ id, passportId });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  // CART ITEMS MODEL

  // Add items for user's cart
  router.post("/user/:userId/items", checkAuthentication, async (req, res, next) => {
    try {
      const { userId } = req.params;
      const passportId = req.user.id;
      const data = { ...req.body, userId, passportId };

      // Passing as a clean object
      const response = await CartServiceInstance.addItems(data);

      res.status(201).send(response);
    } catch (err) {
      next(err);
    }
  });

  // Update select item by item ID
  router.patch("/user/:userId/items/:cartItemId", checkAuthentication, async (req, res, next) => {
    try {
      const { cartItemId, userId } = req.params;
      const passportId = req.user.id;
      const data = req.body;

      const response = await CartServiceInstance.updateItems({
        userId,
        cartItemId,
        passportId,
        ...data,
      });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  // Delete select item by item ID
  router.delete("/user/:userId/items/:cartItemId", checkAuthentication, async (req, res, next) => {
    const { cartItemId, userId } = req.params;
    const passportId = req.user.id;
    try {
      const response = await CartServiceInstance.deleteItems({ cartItemId, userId, passportId });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // Delete all items in cart
  router.delete("/user/:userId/items", checkAuthentication, async (req, res, next) => {
    const { userId } = req.params;
    const passportId = req.user.id;

    try {
      await CartServiceInstance.deleteMyCart({ userId, passportId });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // Checkout
  router.post("/user/:userId/checkout", checkAuthentication, async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { paymentInfo } = req.body;
      const passportId = req.user.id;

      const response = await CartServiceInstance.cartCheckout(userId, passportId, paymentInfo);

      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};
