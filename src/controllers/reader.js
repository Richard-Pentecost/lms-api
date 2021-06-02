const { Reader } = require('../models');

const create = async (req, res) => {
  try {
    const newReader = await Reader.create(req.body);
    res.status(201).json(newReader);
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err });
  }
};

module.exports = { create };