const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'NO TOKEN, AUTHORIZATION DENIED' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'neural_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'TOKEN IS NOT VALID' });
  }
};
