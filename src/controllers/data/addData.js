const { Farm, Data, Product } = require('../../models');
const { formatData } = require('../../utils/formatData');

const addData = async (req, res) => {
  const { data, previousDataUuid } = req.body;

  try {
    const farm = await Farm.fetchFarmByUuid(data.farmFk);
    if (!farm) {
      return res.status(401).json({ error: 'The farm this data is associated with could not be found' });
    }

    if (!data.product) {
      return res.status(401).json({ error: 'The product must be given' });
    }

    const product = await Product.fetchProductByName(data.product);
    if (!product) {
      return res.status(401).json({ error: 'The product does not exist' });
    }

    const previousData = previousDataUuid && await Data.fetchPreviousDataForCalculations(previousDataUuid)

    const dataObj = formatData(data, product.specificGravity, previousData);

    const dataResponse = await Data.create(dataObj);

    res.status(201).json({ data: dataResponse });
  } catch (error) {
    // console.error(error);
    if (error.errors) {
      res.status(401).json({ error });
    } else {
      if (!data.farmFk) {
        return res.status(401).json({ error: 'Farm foreign key must be given' });
      }
      res.status(500).json({ error: 'There was an error connecting to the database' });
    }
  }
}

module.exports = addData;
