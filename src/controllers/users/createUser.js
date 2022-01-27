const { User } = require('../../models');

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body.user);
    res.status(201).json({ user });
  } catch (error) {
    // console.error(error);
    res.status(401).json({ error });
  };
};

module.exports = createUser;
