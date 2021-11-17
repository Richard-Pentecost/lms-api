const { User } = require('../../models');

const updatePasswordByUuid = async (req, res) => {
  const { existingPassword, newPassword } = req.body;
  const { uuid } = req.params;
  try {
    const user = await User.scope('withPassword').findOne({ where: { uuid } });
    
    if (!user) {
      return res.status(401).json({ error: 'The user could not be found' });
    }

    if (!await user.validatePassword(existingPassword)) {
      return res.status(401).json({ error: 'Existing password given is incorrect' });
    }

    const [ updatedRows ]= await User.updatePassword(uuid, { password: newPassword });

    if (updatedRows > 0) {
      res.sendStatus(201);
    } else {
      res.status(401).json({ error: 'There was an error updating your password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database'});
  }
  
};

module.exports = updatePasswordByUuid;