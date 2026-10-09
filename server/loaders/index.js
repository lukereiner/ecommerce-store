const routeLoader = require("../routes");
const session = require("express-session");
const passportLeader = require("./passport");
const { SESSION_SECRET } = require("../config");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

module.exports = async (app) => {
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://sandbox.web.squarecdn.com",
          "https://web.squarecdn.com",
        ],
        scriptSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "https://sandbox.web.squarecdn.com",
          "https://web.squarecdn.com",
        ],
        frameSrc: [
          "'self'",
          "https://sandbox.web.squarecdn.com",
          "https://web.squarecdn.com",
        ],
        connectSrc: [
          "'self'",
          "https://sandbox.web.squarecdn.com",
          "https://web.squarecdn.com",
          "https://connect.squareupsandbox.com",
          "https://connect.squareup.com",
        ],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
      },
    }),
  );
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }),
  );

  app.use(express.json());

  // Express session middleware
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true if HTTPS
        httpOnly: true, // Prevents client-side JS from reading cookie
        sameSite: "lax", // prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );

  await passportLeader(app);

  await routeLoader(app);
};
