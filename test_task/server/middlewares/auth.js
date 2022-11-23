const jwt = require('jsonwebtoken');

function userAuth(req, res, next) {
  const token = req.header('x-auth-token');
  // console.log('token', token)
  if (!token) {
    return res.status(401).json('No token available, authorization denied!');
  }
  try {
    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      req.user = decoded;
      return next();
    }
    return res.status(401).json('Authorization denied!');
  } catch (e) {
    return res.status(401).send(e.message);
  }
}

module.exports = {
  userAuth
};
