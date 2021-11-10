const { User } = require('../../models');
const { removePassword } = require('../../utils/helpers');

const createUser = async (req, res) => {

  try {
    const user = await User.create(req.body.user);
    // const userWithoutPassword = removePassword(user.dataValues);

    res.status(201).json({ user });
  } catch (err) {
    res.status(401).json({ error: err });
  };
};

module.exports = createUser;
