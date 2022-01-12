const { Data, Product } = require('../../models');
const { formatData } = require('../../utils/formatData');

const addData = async (req, res) => {
  const { data, previousDataUuid } = req.body;

  try {
    let message = 'success';
    let dataObj = data;
    if (previousDataUuid) {
      const previousData = await Data.fetchPreviousDataForCalculations(previousDataUuid);
      const product = await Product.fetchProductByName(data.product);
      
      if (!previousData || !product) {
        message = 'Data was added, but there was an error with the calculations'
      }

      if (previousData && product) {
        dataObj = formatData(data, previousData, product.specificGravity) 
      } 
    }

    const dataResponse = await Data.create(dataObj);

    res.status(201).json({ data: dataResponse, message });
  } catch (error) {
    // console.error(error);
    if (error.errors) {
      res.status(401).json({ error });
    } else {
      res.status(500).json({ error: 'There was an error connecting to the database' });
    }
  }
}

module.exports = addData;
