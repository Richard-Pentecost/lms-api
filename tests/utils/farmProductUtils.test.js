const { expect } = require('chai');
const { productsToAdd, productsToRemove, productsToUpdate } = require('../../src/utils/farmProductUtils');

describe('farmProductUtils.js', () => {
  const product1 = { 
    id: 1,
    order: 1,
  };

  const product2 = { 
    id: 2,
    order: 2, 
  };

  const product3 = { 
    id: 3,
    order: 3,
  };
  const product4 = { 
    id: 4,
    order: 4,
  };

  const farmId = 1;

  describe('productsToAdd', () => {
    const existingAssociations = [
      { id: 1, farmId, productId: 1, retrievedOrder: 1, },
      { id: 2, farmId, productId: 2, retrievedOrder: 2, },
    ];

    it('should return empty arrays if the products have not been changed', () => {
      const products = [product1, product2];
  
      const result = productsToAdd(products, existingAssociations, farmId);
      expect(result).to.deep.equal([]);
    });

    it('should return the products that need to be added to a farm', () => {
      const products = [product1, product2, product3];

      const result = productsToAdd(products, existingAssociations, farmId);
      expect(result).to.deep.equal([product3]);
    });

    it('should return products that need to be added even if the number of products is the same', () => {
      const products = [product1, product3];

      const result = productsToAdd(products, existingAssociations, farmId);
      expect(result).to.deep.equal([product3]);
    });

    it('should return multiple products that need to be added when multiple products need to be added', () => {
      const products = [product1, product3, product4];

      const result = productsToAdd(products, existingAssociations, farmId);
      expect(result).to.deep.equal([product3, product4]);
    });
  });

  describe('productsToUpdate', () => {
    const existingAssociations = [
      { id: 1, farmId, productId: 1, retrievedOrder: 1 },
      { id: 2, farmId, productId: 2, retrievedOrder: 2 },
      { id: 3, farmId, productId: 3, retrievedOrder: 3 },
      { id: 4, farmId, productId: 4, retrievedOrder: 4 },
    ];

    it('should return an empty array if none of the products need updating', () => {
      const products = [product1, product2, product3, product4];

      const result = productsToUpdate(products, existingAssociations, farmId);
      expect(result).to.deep.equal([]);
    });

    it('should return an array of the products that need to be updated', () => {
      const newProduct3 = { ...product3, order: 4 };
      const newProduct4 = { ...product4, order: 3 };
      const products = [product1, product2, newProduct3, newProduct4];
      
      const result = productsToUpdate(products, existingAssociations, farmId);
      expect(result).to.deep.equal([{ ...newProduct3, associationId: 3 }, { ...newProduct4, associationId: 4 }]);
    });

    it('should return an array of just the products that need to be updated when there are fewer products than existing associations', () => {
      const newProduct3 = { ...product4, order: 3 };
      const products = [product1, product2, newProduct3];

      const result = productsToUpdate(products, existingAssociations, farmId);
      expect(result).to.deep.equal([{ ...newProduct3, associationId: 4 }]);
    })
  });

  describe('productsToDelete', () => {
    const existingAssociations = [
      { id: 1, farmId, productId: 1, retrievedOrder: 1,},
      { id: 2, farmId, productId: 2, retrievedOrder: 2 },
      { id: 3, farmId, productId: 3, retrievedOrder: 3 },
    ];

    it('should return empty arrays if the products have not been changed', () => {
      const products = [product1, product2, product3];
      
      const result = productsToRemove(products, existingAssociations, farmId);
      expect(result).to.deep.equal([]);
    });

    it('should return the products that need to be removed from a farm', () => {
      const products = [product1, product2];

      const result = productsToRemove(products, existingAssociations, farmId);
      expect(result).to.deep.equal([existingAssociations[2]]);
    });

    it('should return products that need to be removed even if the number of products is the same', () => {
      const products = [product1, product3, product4];

      const result = productsToRemove(products, existingAssociations, farmId);
      expect(result).to.deep.equal([existingAssociations[1]]);
    });

    it('should return multiple products that need to be removed when multiple products need to be added', () => {
      const products = [product1, product4];

      const result = productsToRemove(products, existingAssociations, farmId);
      expect(result).to.deep.equal([existingAssociations[1], existingAssociations[2]]);
    });
  });
});
