
const jwt = require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']; 
  console.log("Authorization header:", token); // Log the token from the request header

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Remove 'Bearer ' prefix before verifying the token
  const tokenWithoutBearer = token.split(' ')[1];

  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err); // Log error if token is invalid
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
    req.userId = decoded.userId; // Attach user info to request
    next();
  });
}


module.exports = authenticateToken;
