const { Reader } = require('../models');

const removePassword = obj => {
  if (obj.hasOwnProperty('password')) {
    delete obj.password;
  };
  return obj;
}

exports.create = async (req, res) => {
  try {
    const newReader = await Reader.create(req.body);

    const readerWithoutPassword = removePassword(newReader.dataValues);
    res.status(201).json(readerWithoutPassword);
  } catch (err) {
    res.status(401).json({ error: err });
  }
};

exports.list = async (req, res) => {
  try {
    const readers = await Reader.findAll();
    const readersWithoutPasswords = readers.map(reader => {
      return removePassword(reader.dataValues);
    });

    res.status(200).json(readersWithoutPasswords);
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
      const readerWithoutPassword = removePassword(reader.dataValues);
      res.status(200).json(readerWithoutPassword);
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
