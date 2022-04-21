const productsToAdd = (products, existingAssociations, farmId) => {
  const productsForAdding = products.filter(product => {
    return !existingAssociations.find(association => association.productId === product.id && association.farmId === farmId);
  });
    
  return productsForAdding;
};

const productsToUpdate = (products, existingAssociations, farmId) => {
  const productsForUpdating = products.map(product => {
    const correspondingAssociation = existingAssociations.find(association => (
      association.productId === product.id && association.farmId === farmId && product.order !== association.retrievedOrder
    ))
    return correspondingAssociation && { ...product, associationId: correspondingAssociation.id };
  }).filter(product => !!product);

  return productsForUpdating;
}

const productsToRemove = (products, existingAssociations, farmId) => {
  const productsForRemoving = existingAssociations.filter(association => {
    return !products.find(product => product.id === association.productId && association.farmId === farmId);
  });

  return productsForRemoving;
};

module.exports.productsToAdd = productsToAdd;
module.exports.productsToUpdate = productsToUpdate;
module.exports.productsToRemove = productsToRemove;
