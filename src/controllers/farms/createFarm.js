const { Farm, Region, Product, FarmProduct } = require('../../models');

const createFarm = async (req, res) => {
  try {

    if (req.body.farm.regionFk) {
      const region = await Region.findOne({ where: { uuid: req.body.farm.regionFk }})
      if (!region) {
        return res.status(401).json({ error: 'The region is invalid' });
      }
    }

    const farm = await Farm.create(req.body.farm);

    const { products } = req.body;
    if (!products) {
      return res.status(401).json({ error: 'There are no products associated with this farm' });
    }

    await Promise.all(products.map(async item => {
      const product = await Product.findOne({ where: { uuid: item.uuid } });

      if (!product) {
        return res.status(401).json({ error: 'The product could not be found' });
      }

      const association = { 
        farmId: farm.uuid, 
        productId: product.uuid 
      };
      await FarmProduct.create(association);
    }));

    res.status(201).json({ farm });
  } catch (error) {
    // console.error(error);
    if (error.errors) {
      res.status(401).json({ error });
    } else {
      res.status(500).json({ error: 'There was an error connecting to the database' });
    }
  }
}

module.exports = createFarm;
