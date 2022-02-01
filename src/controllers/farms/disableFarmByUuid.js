const { Farm } = require('../../models');

const disableFarmByUuid = async (req, res) => {
  const { uuid } = req.params;
  const { farm } = req.body;

  try {

    const [ updatedRows ] = await Farm.update(farm, { where: { uuid } });

    if (updatedRows > 0) {
      res.sendStatus(201);
    } else {
      res.status(401).json({ error: 'The farm could not be found' });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
}

module.exports = disableFarmByUuid;
