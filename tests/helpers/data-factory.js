const faker = require('faker');

exports.user = (options = {}) => ({
  uuid: options.uuid || faker.datatype.uuid(),
  name: options.firstName || faker.name.findName(),
  email: options.email || faker.internet.email(),
  password: options.password || faker.internet.password(),
});

exports.farm = (options = {}) => ({
  uuid: options.uuid || faker.datatype.uuid(),
  farmName: options.farmName || faker.random.word(),
  postcode: options.postcode || faker.address.zipCode(),
  contactName: options.contactName || faker.name.findName(),
  contactNumber: options.contactNumber || faker.phone.phoneNumber('07#########'), 
});

exports.data = (options = {}) => {
  const floatBeforeDelivery = faker.datatype.number();
  const floatAfterDelivery = floatBeforeDelivery + 100;
  const data = {
    farmFk: options.farmFk,
    uuid: options.uuid || faker.datatype.uuid(),
    date: options.date || faker.date.recent(),
    noOfCows: options.noOfCows || faker.datatype.number(),
    product: options.product || faker.random.word(),
    quantity: options.quantity || faker.datatype.number(),
    meterReading: options.meterReading || faker.datatype.number(),
    waterUsage: options.waterUsage || faker.datatype.number(),
    pumpDial: options.pumpDial || faker.datatype.number(),
    floatBeforeDelivery: options.floatBeforeDelivery || floatBeforeDelivery,
    kgActual: options.kgActual || faker.datatype.number(),
    targetFeedRate: options.targetFeedRate || faker.datatype.number(),
    floatAfterDelivery: options.floatAfterDelivery || floatAfterDelivery,
    comments: options.comments || faker.lorem.sentence(),
  };
  
  return data;  
};