const { Farm } = require('../../models');

const getActiveFarms = async (req, res) => {
  try {
    const searchString = req.query.query ? req.query.query : '';
  
    const farms = await Farm.fetchActiveFarms(searchString);
    res.status(201).json(farms);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
}

module.exports = getActiveFarms;
