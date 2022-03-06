const { expect } = require('chai');
const DataFactory = require('../helpers/data-factory');
const { productsToAdd, productsToRemove } = require('../../src/utils/farmProductUtils');

describe('farmProductUtils.js', () => {

  const product1 = { 
    id: 1,
    uuid: DataFactory.uuid, 
    productName: 'product 1', 
    specificiGravity: '1.08', 
  };

  const product2 = { 
    id: 2,
    uuid: DataFactory.uuid, 
    productName: 'product 2', 
    specificiGravity: '1.01', 
  };

  const product3 = { 
    id: 3,
    uuid: DataFactory.uuid, 
    productName: 'product 3', 
    specificiGravity: '2.05', 
  };
  const product4 = { 
    id: 4,
    uuid: DataFactory.uuid, 
    productName: 'product 4', 
    specificiGravity: '0.85', 
  };

  const farmId = 1;

  describe('productsToAdd', () => {
    const existingAssociations = [
      { id: 1, farmId, productId: 1 },
      { id: 2, farmId, productId: 2 },
    ];

    it('should return empty arrays if the products have not been changed', async () => {
      const products = [product1, product2];
  
      const result = await productsToAdd(products, existingAssociations, farmId);
      expect(result).to.deep.equal([]);
    });

    it('should return the products that need to be added to a farm', async () => {
      const products = [product1, product2, product3];

      const result = await productsToAdd(products, existingAssociations, farmId);
      expect(result).to.deep.equal([product3]);
    });

    it('should return products that need to be added even if the number of products is the same', async () => {
      const products = [product1, product3];

      const result = await productsToAdd(products, existingAssociations, farmId);
      expect(result).to.deep.equal([product3]);
    });

    it('should return multiple products that need to be added when multiple products need to be added', async () => {
      const products = [product1, product3, product4];

      const result = await productsToAdd(products, existingAssociations, farmId);
      expect(result).to.deep.equal([product3, product4]);
    });
  });

  describe('productsToDelete', () => {
    const existingAssociations = [
      { id: 1, farmId, productId: 1 },
      { id: 2, farmId, productId: 2 },
      { id: 3, farmId, productId: 3 },
    ];

    it('should return empty arrays if the products have not been changed', async () => {
      const products = [product1, product2, product3];
      
      const result = await productsToRemove(products, existingAssociations, farmId);
      expect(result).to.deep.equal([]);
    });

    it('should return the products that need to be removed from a farm', async () => {
      const products = [product1, product2];

      const result = await productsToRemove(products, existingAssociations, farmId);
      expect(result).to.deep.equal([existingAssociations[2]]);
    });

    it('should return products that need to be removed even if the number of products is the same', async () => {
      const products = [product1, product3, product4];

      const result = await productsToRemove(products, existingAssociations, farmId);
      expect(result).to.deep.equal([existingAssociations[1]]);
    });

    it('should return multiple products that need to be removed when multiple products need to be added', async () => {
      const products = [product1, product4];

      const result = await productsToRemove(products, existingAssociations, farmId);
      expect(result).to.deep.equal([existingAssociations[1], existingAssociations[2]]);
    });
  });
});
