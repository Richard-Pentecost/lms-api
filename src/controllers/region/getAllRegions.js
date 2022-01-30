const { Region } = require('../../models');

const getAllRegions = async (req, res) => {

  try {
    const regions = await Region.fetchRegions();

    res.status(201).json(regions);
  } catch (error) {
    // console.error(error);
    res.status(501).json({ error: 'There was an error connecting to the database' });
  }
};

module.exports = getAllRegions;
