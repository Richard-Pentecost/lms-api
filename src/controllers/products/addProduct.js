const { Product } = require('../../models');

const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body.product)
    res.status(201).json({ product });
  } catch (error) {
    // console.error(error);
    if (error.errors) {
      res.status(401).json({ error });
    } else {
      res.status(500).json({ error: 'There was an error connecting to the database' });
    }
  }
}

module.exports = addProduct;
