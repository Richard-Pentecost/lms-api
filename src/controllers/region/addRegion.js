const { Region } = require('../../models');

const addRegion = async (req, res) => {
  try {
    const region = await Region.create(req.body.region);
    res.status(201).json({ region });
  } catch (error) {
    console.error(error);
    if (error.errors) {
      res.status(401).json({ error });
    } else {
      res.status(500).json({ error: 'There was an error connecting to the database' });
    }
  }
} 

module.exports = addRegion;
