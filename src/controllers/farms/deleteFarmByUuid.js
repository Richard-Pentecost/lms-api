const { Farm } = require('../../models');

const deleteFarmById = async (req, res) => {
  const { uuid } = req.params;
  
  try {
    const deletedRow = await Farm.destroy({ where: { uuid }});
    if (deletedRow !== 0) {
      res.sendStatus(204);
    } else {
      res.status(401).json({ error: 'The farm could not be found' });
    };
  } catch (err) {
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
};

module.exports = deleteFarmById;
