const express = require("express");
const router = express.Router();
const { checkAuthentication } = require("../middleware/auth")
const RefundService = require("../services/RefundService")

const RefundServiceInstance = new RefundService();

module.exports = (app) => {
    app.use(express.json());
    app.use("/refunds", router);

    router.get("/", async (req, res, next) => {
        try {
            const response = await RefundServiceInstance.getAll();
            res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    })

    router.post("/:orderId", async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const items = req.body;

            const response = await RefundServiceInstance.refund({ orderId, items });

            res.status(201).send(response);
        } catch (err) {
            next(err);
        }
    })
}