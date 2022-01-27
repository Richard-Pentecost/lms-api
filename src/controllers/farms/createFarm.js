const { Farm, Region, Product, FarmProduct } = require('../../models');
const { formatFarm } = require('../../utils/formatFarm');

const createFarm = async (req, res) => {
  try {

    if (req.body.farm.regionFk) {
      const region = await Region.findOne({ where: { uuid: req.body.farm.regionFk }})
      if (!region) {
        return res.status(401).json({ error: 'The region is invalid' });
      }
    }

    const formattedFarm = formatFarm(req.body.farm);

    const farm = await Farm.scope('withId').create(formattedFarm);

    const { products } = req.body;
    if (!products) {
      return res.status(401).json({ error: 'There are no products associated with this farm' });
    }

    await Promise.all(products.map(async uuid => {
      const product = await Product.scope('withId').fetchProductByUuid(uuid);

      if (!product) {
        return res.status(401).json({ error: 'The product could not be found' });
      }

      const association = { 
        farmId: farm.id, 
        productId: product.id 
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
