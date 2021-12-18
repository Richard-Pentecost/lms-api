const { Region } = require('../../models');

const getAllRegions = async (req, res) => {

  try {
    const regions = await Region.findAll();

    if (regions) {
      res.status(201).json(regions);
    } else {
      res.status(401).json({ error: 'Could not retrieve regions' });
    }
  } catch (error) {
    // console.error(error);
    res.status(501).json({ error: 'There was an error connecting to the database' });
  }
};

module.exports = getAllRegions;
