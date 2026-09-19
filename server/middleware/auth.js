function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    error: "Unauthorized access",
    message: "You must be logged in to perform this action",
  });
}

module.exports = { checkAuthentication };
