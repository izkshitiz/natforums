const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || '1a51ab5a8fd4d130ec4e56a922cd4287932ae34a37ced3f5dd76ac71127f94b42c0ab8c492e4d675f83a4e709cbf1d8ea4f038af7d0fc6f30ea1030e758339be';

module.exports = (req, res, next) => {

  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, secret);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  req.username = decodedToken.username;
  req.userId = decodedToken.userId;
  req.weightage = decodedToken.weightage;
  req.isAuth = true;

  next();
};
