const { Farm } = require('../models');

const getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.findAll();
    if (farms.length > 0) {
      res.status(201).json(farms);
    } else {
      res.status(401).json({ error: 'There are no farms in the database.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
};

module.exports = getAllFarms;