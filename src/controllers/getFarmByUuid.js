const { Farm } = require('../models');

const getFarmById = async (req, res) => {
  const { uuid } = req.params;
  try{
    const farm = await Farm.findOne({ where: { uuid }});
    if (farm) {
      res.status(201).json({ farm });
    } else {
      res.status(401).json({ error: 'The farm could not be found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
};

module.exports = getFarmById;
