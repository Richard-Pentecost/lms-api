const { User } = require("../../models");

const getUserByUuid = async (req, res) => {
  const { uuid } = req.params;
  try {
    const user = await User.findByUuid(uuid);
    if (user) {
      res.status(201).json({ user });
    } else {
      res.status(401).json({ error: 'User could not be found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
}

module.exports = getUserByUuid;
