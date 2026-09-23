const { SquareClient, SquareEnvironment } = require("square");
const randomUUID = require("crypto").randomUUID;

const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment: SquareEnvironment.Sandbox,
});

module.exports = { squareClient, randomUUID };