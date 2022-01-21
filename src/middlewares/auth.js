const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  const token = req.get('Authorization');

  try {
    const authorizer = await jwt.verify(token, process.env.JWT_SECRET);
    req.authorizer = authorizer;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'You must be logged to do this' });
  }
};

const admin = async (req, res, next) => {
  const token = req.get('Authorization');

  try {
    const authorizer = await jwt.verify(token, process.env.JWT_SECRET);
    if (!authorizer.isAdmin) {
      return res.status(401).json({ error: 'You must be an admin to do this '});
    }
    req.authorizer = authorizer;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'You must be an admin to do this' });
  }
}

module.exports = { auth, admin };
