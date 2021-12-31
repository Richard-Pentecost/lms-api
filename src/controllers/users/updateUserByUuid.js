const { User } = require('../../models');

const updateUserByUuid = async (req, res) => {
  const { uuid } = req.params;
  const { user } = req.body;

  try {
    const [ updatedRows ] = await User.update(user, { where: { uuid } });
    if (updatedRows > 0) {
      res.sendStatus(201);
    } else {
      res.status(401).json({ error: 'The user could not be found' });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
} 

module.exports = updateUserByUuid;
