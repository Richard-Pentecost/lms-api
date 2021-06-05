const { Farm } = require('../models');

const updateFarmById = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const [ updatedRows ] = await Farm.update(updateData, { where: { id } });
    if (updatedRows > 0) {
      res.sendStatus(201);
    } else {
      res.status(401).json({ error: 'The farm could not be found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'There was an error connecting to the database.' });
  }
};

module.exports = updateFarmById;