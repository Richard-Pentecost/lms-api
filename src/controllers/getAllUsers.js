const { User } = require('../models');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(201).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
}

module.exports = getAllUsers;