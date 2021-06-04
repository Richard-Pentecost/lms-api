const { User } = require('../models');
// const removePassword = require('./utils/helpers');

const removePassword = obj => {
  if (obj.hasOwnProperty('password')) {
    delete obj.password;
  };
  return obj;
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const userWithoutPassword = removePassword(user.dataValues);
    
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(401).json({ error: err });
  };
};

module.exports = createUser;