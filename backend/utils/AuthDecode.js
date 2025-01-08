
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'SHY23FDA45G2G1K89KH5sec4H8KUTF85r23456ge2s6j5det';

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']; 
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
        }
        req.userId = decoded.userId; 
        next();
    });
}


module.exports = authenticateToken;
