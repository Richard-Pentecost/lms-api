const { Farm, Product, Region, FarmProduct } = require('../../models');

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
    
    await Promise.all(products.map(async itemUuid => {
      const product = await Product.scope('withId').fetchProductByUuid(itemUuid);

      if (product) {
        const checkExistingAssociations = existingAssociations.find(existingAssociation => {
          return existingAssociation.productId === product.id && existingAssociation.farmId === foundFarm.id;
        });
  
        if (!checkExistingAssociations) {
          const association = {
            farmId: foundFarm.id,
            productId: product.id,
          };
    
          await FarmProduct.create(association);
        }
      }
    }));

    const productsArrWithId = await Promise.all(products.map(async itemUuid => {
      const product = await Product.scope('withId').fetchProductByUuid(itemUuid);
      return !!product && product;
    }));

    const productsForDeleting = existingAssociations.filter(association => {
      return !productsArrWithId.find(product => product.id === association.productId) && association;
    });

    productsForDeleting.forEach(async product => {
      await FarmProduct.destroy({ where: { id: product.id } });
    })

    await Farm.update(farm, { where: { uuid } });
    res.sendStatus(201);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
};

module.exports = updateFarmByUuid;
