const { Farm } = require('../models');

const getFarmById = async (req, res) => {
  const { id } = req.params;
  try{
    const farm = await Farm.findByPk(id);
    if (farm) {
      res.status(201).json(farm);
    } else {
      res.status(401).json({ error: 'The farm could not be found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
};

module.exports = getFarmById;
