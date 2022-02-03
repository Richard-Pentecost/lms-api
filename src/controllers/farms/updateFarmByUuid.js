const { Farm, Product, Region, FarmProduct } = require('../../models');

const updateFarmByUuid = async (req, res) => {
  const { uuid } = req.params;
  const { farm, products }= req.body;

  !farm.regionFk && (farm.regionFk = null);

  try {

    // const foundFarm = await Farm.scope('withId').fetchFarmByUuid(uuid);

    // if (!foundFarm) {
    //   return res.status(401).json({ error: 'The farm could not be found' });
    // }
    
    // const existingAssociations = await FarmProduct.fetchAssociationsByFarmId(foundFarm.id);
    
    // await Promise.all(products.map(async itemUuid => {
    //   const product = await Product.scope('withId').fetchProductByUuid(itemUuid);

    //   const checkExistingAssociations = existingAssociations.find(existingAssociation => {
    //     return existingAssociation.productId === product.id && existingAssociation.farmId === foundFarm.id;
    //   });

    //   if (!checkExistingAssociations) {
    //     const association = {
    //       farmId: foundFarm.id,
    //       productId: product.id,
    //     };
  
    //     await FarmProduct.create(association);
    //   }
    // }));

    // Check to see if an existing association needs to be delete
    // const productArrWithId = await Promise.all(products.map(async itemUuid => {
    //   return await Product.scope('withId').fetchProductByUuid(itemUuid);
    // }));

    // await Promise.all(existingAssociations.map(async association => {

    //   const exists = productArrWithId.find(async product => {
    //     console.log(association.productId);
    //     console.log(product.id);
    //     console.log(association.farmId);
    //     console.log(foundFarm.id);
    //     const bool = association.productId === product.id && association.farmId === foundFarm.id;
    //     console.log(bool);
    //     return bool;
    //   });
      // const exists = products.find(async itemUuid => {
      //   const product = await Product.scope('withId').fetchProductByUuid(itemUuid);
      //   console.log(product);
      //   console.log(association);
      //   return association.productId === product.id && association.farmId === foundFarm.id;
      // });

    //   console.log("**********");
    //   console.log(exists);
    //   if (!exists) {
    //     await FarmProduct.destroy({ where: { id: association.id } });
    //   }
    // }));

    const [ updatedRows ] = await Farm.update(farm, { where: { uuid } });

    if (updatedRows > 0) {
      res.sendStatus(201);
    } else {
      res.status(401).json({ error: 'The farm could not be found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
};

module.exports = updateFarmByUuid;
