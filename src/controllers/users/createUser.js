const { User } = require('../../models');

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body.user);
    res.status(201).json({ user });
  } catch (err) {
    res.status(401).json({ error: err });
  };
};

module.exports = createUser;
