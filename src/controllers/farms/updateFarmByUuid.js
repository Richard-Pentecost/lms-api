const { Farm, Product, FarmProduct } = require('../../models');
const { productsToAdd, productsToRemove } = require('../../utils/farmProductUtils');

const updateFarmByUuid = async (req, res) => {
  const { uuid } = req.params;
  const { farm, products }= req.body;

  !farm.regionFk && (farm.regionFk = null);

  try {

    if (!products) {
      return res.status(401).json({ error: 'A farm must have products' });
    }; 

    const foundFarm = await Farm.scope('withId').fetchFarmByUuid(uuid);

    if (!foundFarm) {
      return res.status(401).json({ error: 'The farm could not be found' });
    }
  
    const existingAssociations = await FarmProduct.fetchAssociationsByFarmId(foundFarm.id);
    
    const productsWithId = await Product.scope('withId').fetchProductsByUuid(products);

    const productsForAdding = productsToAdd(productsWithId, existingAssociations, foundFarm.id);

    productsForAdding.forEach(async product => {
      const association = { 
        farmId: foundFarm.id,
        productId: product.id,
      };
      await FarmProduct.create(association);
    });

    const productsForRemoving = productsToRemove(productsWithId, existingAssociations, foundFarm.id);

    productsForRemoving.forEach(async product => {
      await FarmProduct.destroy({ where: { id: product.id } });
    });

    await Farm.update(farm, { where: { uuid } });
    res.sendStatus(201);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
};

module.exports = updateFarmByUuid;
