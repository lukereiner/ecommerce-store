const userRouter = require('./users');
const productRouter = require('./products');
const cartRouter = require('./carts');
const orderRouter = require('./orders');
const authRouter = require('./auth')
const refundRouter = require('./refunds');

module.exports = (app) => {
    userRouter(app);
    productRouter(app);
    cartRouter(app);
    orderRouter(app);
    authRouter(app);
    refundRouter(app);
}