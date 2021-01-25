//midddlere is  func that has access to d req and res cycle and req n res object
//anytime we hit a n end point we can fire off the middleware and we check to see if theres a token in a server

const jwt = require("jsonwebtoken");
//jwt is to verify d token

const config = require("config");
// cause  we need acces to the secret

module.exports = function (req, res, next) {
  // wen u create a middleware func , u need to call it, next() param is d call function which says more on to the next middleware
  //1. Get the token from the header
  const token = req.header("x-auth-token");
  //'x-auth-token' is d key to the token inside the header

  //2. check if not token

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtsecret"));

    
    req.user = decoded.user;
    next();
  } catch (error) {
    req.status(401).json({ msg: "Token is not valid" });
  }
};
