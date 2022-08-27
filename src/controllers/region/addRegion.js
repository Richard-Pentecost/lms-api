const { Region } = require('../../models');

const addRegion = async (req, res) => {
  try {
    const { region } = req.body;

    if (!region) {
      return res.status(401).json({ error: 'The region must be given' })
    }

    const formattedRegion = { regionName: region.regionName.trim() };
    const createdRegion = await Region.create(formattedRegion);

    res.status(201).json({ region: createdRegion });
  } catch (error) {
    // console.error(error);
    if (error.errors) {
      res.status(401).json({ error });
    } else {
      res.status(500).json({ error: 'There was an error connecting to the database' });
    }
  }
} 

module.exports = addRegion;
