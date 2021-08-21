const { Farm } = require('../models');

const createFarm = async (req, res) => {
  console.log(req.body.farm);
  try {
    const farm = await Farm.create(req.body.farm);
    res.status(201).json(farm);
  } catch (err) {
    res.status(401).json({ error: err });
  }
}

module.exports = createFarm;