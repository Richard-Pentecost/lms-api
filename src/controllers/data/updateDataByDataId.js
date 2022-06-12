const { Data, Farm, Product } = require('../../models');
const { formatData } = require('../../utils/formatData');

const updateDataByDataId = async (req, res) => {
  const { dataId } = req.params;
  const { data, previousDataUuid } = req.body

  try {
    const farm = await Farm.fetchFarmByUuid(data.farmFk);

    if (!farm) {
      return res.status(401).json({ error: 'The farm this data is associated with could not be found' });
    }

    const product = await Product.fetchProductByName(data.product);
    if (!product) {
      return res.status(401).json({ error: 'The product does not exist' });
    }

    const previousData = previousDataUuid && await Data.fetchPreviousDataForCalculations(previousDataUuid);

    const dataObj = formatData(data, product.specificGravity, previousData);

    const [ updatedRows ] = await Data.update(dataObj, { where: { uuid: dataId } });
    if (updatedRows > 0) {
      res.sendStatus(201);
    } else {
      res.status(401).json({ error: 'There was an error updating the data' });
    }
  } catch (error) {
    // console.error(error);
    if (error.errors) {
      return res.status(401).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
}

module.exports = updateDataByDataId;
