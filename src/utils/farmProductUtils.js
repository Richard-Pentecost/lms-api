const productsToAdd = (products, existingAssociations, farmId) => {
  const productsForAdding = products.filter(product => {
    return !existingAssociations.find(association => association.productId === product.id && association.farmId === farmId);
  });
    
  return productsForAdding;
};

const productsToRemove = (products, existingAssociations, farmId) => {
  const productsForRemoving = existingAssociations.filter(association => {
    return !products.find(product => product.id === association.productId && association.farmId === farmId);
  });

  return productsForRemoving;
};

module.exports.productsToAdd = productsToAdd;
module.exports.productsToRemove = productsToRemove;
