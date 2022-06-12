const { Data, Farm } = require('../../models');

const getDataByFarmId = async (req, res) => {
  const { farmId } = req.params;

  try {
    const farm = await Farm.fetchFarmByUuid(farmId);

    
    if (!farm) {
      res.status(401).json({ error: 'The farm could not be found' });
      return;
    };
    
    const farmProducts = farm.products.sort((a, b) => a.farmProducts.retrievedOrder - b.farmProducts.retrievedOrder);
    const productOrder = farmProducts.map(product => product.productName)

    const data = await Data.fetchDataByFarmId(farmId, productOrder);

    if (data) {
      res.status(201).json({ data });
    } else {
      res.status(401).json({ error: 'Could not retrieve data for this farm' });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  };
};

module.exports = getDataByFarmId;
