const { Farm } = require('../../models');

const getActiveFarms = async (req, res) => {
  try {
    const search = req.query.query ? req.query.query : '';
    const sort = req.query.sort && req.query.sort === 'z-a' ? 'desc' : 'asc';

    let filter = []; 

    if (req.query.filter) {
      filter = req.query.filter && req.query.filter.includes(',') ?
        req.query.filter.split(',') : [req.query.filter];
    }
    
    const farms = await Farm.fetchActiveFarms(sort, search, filter);
    res.status(201).json(farms);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
}

module.exports = getActiveFarms;
