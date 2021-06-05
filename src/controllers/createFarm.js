const { Farm } = require('../models');

const createFarm = async (req, res) => {
  try {
    const farm = await Farm.create(req.body);
    res.status(201).json(farm);
  } catch (err) {
    res.status(401).json({ error: err });
  }
}

module.exports = createFarm;