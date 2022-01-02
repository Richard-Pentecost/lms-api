const { Product } = require('../../models');

const getAllProducts = async (req, res) => {

  try {
    const products = await Product.fetchProducts();
    res.status(201).json(products);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'There was an error connecting to the database' });
  }
}

module.exports = getAllProducts;
