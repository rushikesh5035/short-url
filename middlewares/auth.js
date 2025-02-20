const { getUser } = require("../service/auth");

// Authentication
function checkForAuthectication(req, res, next) {
  const tokenCookie = req.cookies?.token;
  req.user = null;

  if (!tokenCookie) return next();

  const token = tokenCookie;
  const user = getUser(token);

  req.user = user;
  next();
}

// Authorization
function restrictTo(role = []) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");

    if (!role.includes(req.user.role)) return res.end("Unauthorized");

    return next();
  };
}

module.exports = {
  checkForAuthectication,
  restrictTo,
};
