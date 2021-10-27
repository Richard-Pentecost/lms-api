const { Farm } = require('../../models');

const createFarm = async (req, res) => {
  try {
    const farm = await Farm.create(req.body.farm);
    res.status(201).json({ farm });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error });
  }
}

module.exports = createFarm;
