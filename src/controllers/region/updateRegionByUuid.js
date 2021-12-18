const { Region } = require('../../models');

const updateRegionByUuid = async (req, res) => {
  const { uuid } = req.params;
  const updatedData = req.body.region;
  
  try {
    const [ updatedRows ] = await Region.update(updatedData, { where: { uuid } });
    
    if (updatedRows > 0) {
      res.sendStatus(201);
    } else {
      res.status(401).json({ error: 'The region could not be found' });
    }
  } catch(error) {
    // console.error(error);
    if (error.errors) {
      res.status(401).json({ error: 'The region already exists' });
    } else {
      res.status(500).json({ error: 'There was an error connecting to the database' });
    }
  }
};

module.exports = updateRegionByUuid;
