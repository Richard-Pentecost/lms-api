const { Data } = require('../../models');

const updateDataByDataId = async (req, res) => {
  const { dataId } = req.params;
  const updatedData = req.body.data

  try {
    const [ updatedRows ] = await Data.update(updatedData, { where: { uuid: dataId } });
    if (updatedRows > 0) {
      res.sendStatus(201);
    } else {
      res.status(401).json({ error: 'There was an error updating the data' });
    }
  } catch (error) {
    console.error(error);
    if (error.errors) {
      res.status(401).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
}

module.exports = updateDataByDataId;
