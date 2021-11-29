const { Data } = require('../../models');

const deleteDataByDataId = async (req, res) => {
  const { dataId } = req.params;
  try {
    const deletedRows = await Data.destroy({ where: { uuid: dataId } });

    if (deletedRows === 0) {
      res.status(401).json({ error: 'There was an error deleting the data' });
    } else {
      res.sendStatus(201);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
}

module.exports = deleteDataByDataId;
