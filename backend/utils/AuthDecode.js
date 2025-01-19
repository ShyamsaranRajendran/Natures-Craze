
const jwt = require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']; 
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const tokenWithoutBearer = token.split(' ')[1];

  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
}


module.exports = authenticateToken;
