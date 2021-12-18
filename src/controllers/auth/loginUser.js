const { User } = require('../../models');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Incorrect email' });
    } 
    
    if (!await user.validatePassword(password)) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    
    const { isAdmin, uuid } = user;
    const payload = { isAdmin, uuid };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });;
    
    if (!token) {
      return res.sendStatus(500);
    }
    res.status(201).json({ token });
  } catch (error) {
    // console.error(error);
    res.sendStatus(500);
  }
}

module.exports = loginUser;
