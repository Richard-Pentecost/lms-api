const { Product } = require('../../models');

const deleteProductByUuid = async (req, res) => {
  const { uuid } = req.params;
  try {
    const deletedRows = await Product.destroy({ where: { uuid } });
    if (deletedRows === 0) {
      res.status(401).json({ error: 'There was an error deleting the product' });
    } else {
      res.sendStatus(201);
    }
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'There was a problem connecting to the database' });
  }
}

module.exports = deleteProductByUuid;
