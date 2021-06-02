const { Reader } = require('../models');

exports.create = async (req, res) => {
  try {
    const newReader = await Reader.create(req.body);
    res.status(201).json(newReader);
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err });
  }
};

exports.list = async (req, res) => {
  try {
    const readers = await Reader.findAll();
    res.status(200).json(readers);
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err });
  }
};

exports.findById = async (req, res) => {
  try {
    const { id } = req.params;
    const reader = await Reader.findByPk(id);

    if (reader) {
      res.status(200).json(reader);
    } else {
      res.status(404).json({ error: 'The reader could not be found.' });
    };
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'There was an error connecting to the database.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = req.body;
    const [ updatedRows ] = await Reader.update(updateData, { where: { id } });
  
    if (updatedRows !== 0) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: 'The reader could not be found.'})
    };
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'There was an error connecting to the database.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRow = await Reader.destroy({ where: { id }});
    if (deletedRow !== 0) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'The reader could not be found.' });
    };
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
}; 
