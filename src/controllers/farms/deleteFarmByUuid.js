const { Farm } = require('../../models');

const deleteFarmByUuid = async (req, res) => {
  const { uuid } = req.params;
  
  try {
    const deletedRows = await Farm.destroy({ where: { uuid } });
    if (deletedRows === 0) {
      res.status(401).json({ error: 'There was an error deleting the farm' });
    } else {
      res.sendStatus(201);
    };
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
};

module.exports = deleteFarmByUuid;
