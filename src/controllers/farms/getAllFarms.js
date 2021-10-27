const { Farm } = require('../../models');

const getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.findAll();
    res.status(201).json(farms);
  } catch (err) {
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
};

module.exports = getAllFarms;