const { Farm } = require('../../models');

const getActiveFarms = async (req, res) => {
  try {
    const isActive = true;
    const farms = await Farm.fetchFarms(isActive);
    // console.log("***********")
    // console.log(farms);
    res.status(201).json(farms);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
}

module.exports = getActiveFarms;
