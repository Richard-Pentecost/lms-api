const { Farm, Region } = require('../../models');

const createFarm = async (req, res) => {
  try {

    if (req.body.farm.regionFk) {
      const region = await Region.findOne({ where: { uuid: req.body.farm.regionFk }})
      if (!region) {
        return res.status(401).json({ error: 'The region is invalid' });
      }
    }
    const farm = await Farm.create(req.body.farm);
    res.status(201).json({ farm });
  } catch (error) {
    // console.error(error);
    if (error.errors) {
      res.status(401).json({ error });
    } else {
      res.status(500).json({ error: 'There was an error connecting to the database' });
    }
  }
}

module.exports = createFarm;
