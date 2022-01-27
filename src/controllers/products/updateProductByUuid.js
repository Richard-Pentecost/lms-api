const { Product } = require('../../models');

const updateProductByUuid = async  (req, res) => {
  const { uuid } = req.params;
  const updatedProduct = req.body.product;
  
  try {
    const [ updatedRows ] = await Product.update(updatedProduct, { where: { uuid } });
    
    if (updatedRows > 0) {
      res.sendStatus(201);
    } else {
      res.status(401).json({ error: 'The product could not be found' });
    }
  } catch (error) {
    // console.error(error);
    if (error.errors) {
      res.status(401).json({ error: 'A product with this name already exists' });
    } else {
      res.status(500).json({ error: 'There was an error connecting to the database' });
    }
  }
}

module.exports = updateProductByUuid;