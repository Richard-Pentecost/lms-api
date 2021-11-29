const faker = require('faker');
const farm = require('../../src/models/farm');

exports.user = (options = {}) => ({
  name: options.firstName || faker.name.findName(),
  email: options.email || faker.internet.email(),
  password: options.password || faker.internet.password(),
  permissionLevel: options.permissionLevel || 'admin',
});

exports.farm = (options = {}) => {
  if (!options.hasOwnProperty('isActive')) {
    options.isActive = true;
  }

  const farm = {
    farmName: options.farmName || faker.random.word(),
    postcode: options.postcode || faker.address.zipCode(),
    contactName: options.contactName || faker.name.findName(),
    contactNumber: options.contactNumber || faker.phone.phoneNumber('07#########'),
    isActive: options.isActive,
    region: options.region || null,
    accessCodes: options.accessCodes || faker.lorem.sentence(),
    comments: options.comments || faker.lorem.sentence(),
  };
  
  return farm;
};

exports.data = (options = {}) => {
  const floatBeforeDelivery = faker.datatype.number();
  const floatAfterDelivery = floatBeforeDelivery + 100;
  const data = {
    farmFk: options.farmFk,
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