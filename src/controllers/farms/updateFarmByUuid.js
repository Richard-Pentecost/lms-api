const { Farm, Product, FarmProduct } = require('../../models');
const { productsToAdd, productsToRemove, productsToUpdate } = require('../../utils/farmProductUtils');

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
    
    const productUuids = products.map(p => p.uuid);
    const returnedProducts = await Product.scope('withId').fetchProductsByUuid(productUuids);

    const productsWithId = returnedProducts.map(product => {
      const productWithOrder = products.find(prod => prod.uuid === product.uuid)
      return { id: product.id, order: productWithOrder.order };
    });

    const productsForAdding = productsToAdd(productsWithId, existingAssociations, foundFarm.id);

    productsForAdding.forEach(async product => {
      const association = { 
        farmId: foundFarm.id,
        productId: product.id,
        retrievedOrder: product.order,
      };
      await FarmProduct.create(association);
    });

    const productsForUpdating = productsToUpdate(productsWithId, existingAssociations, foundFarm.id);

    productsForUpdating.forEach(async product => {
      const associationForUpdating = { retrievedOrder: product.order };
      await FarmProduct.update(associationForUpdating, { where: { id: product.associationId } })
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
