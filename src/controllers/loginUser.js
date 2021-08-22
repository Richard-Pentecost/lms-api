const { User } = require('../models');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ error: 'Incorrect email' });
    } 

    if (!await user.validatePassword(password)) {
      res.status(401).json({ error: 'Incorrect password' });
    }
    
    const { permissionLevel, uuid } = user;
    const payload = { permissionLevel, uuid };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });;
    
    if (!token) {
      res.sendStatus(500);
    }
    res.status(201).json({ token });
  } catch (err) {
    console.log(error);
    res.sendStatus(500);
  }
}

module.exports = loginUser;
