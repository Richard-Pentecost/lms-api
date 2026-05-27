const { faker } = require('@faker-js/faker');

exports.uuid = faker.string.uuid();

exports.user = (options = {}) => {
  return {
    name: options.firstName || faker.person.fullName(),
    email: options.email || faker.internet.email(),
    password: options.password || faker.internet.password(),
    isAdmin: options.isAdmin,
  }
};
  

exports.farm = (options = {}) => {
  if (!options.hasOwnProperty('isActive')) {
    options.isActive = true;
  }

  const farm = {
    farmName: options.farmName || faker.word.sample(),
    postcode: options.postcode || 'AB1 2CD',
    contactName: options.contactName || faker.person.fullName(),
    contactNumber: options.contactNumber || faker.phone.number({ style: 'national' }),
    isActive: options.isActive,
    regionFk: options.region || null,
    accessCodes: options.accessCodes || null,
    comments: options.comments || null,
  };
  
  return farm;
};

exports.data = (options = {}) => {
  const floatBeforeDelivery = faker.number.int({ max: 99999 });
  const floatAfterDelivery = floatBeforeDelivery + 100;
  const data = {
    farmFk: options.farmFk,
    date: options.date || faker.date.recent(),
    noOfCows: options.noOfCows || faker.number.int({ max: 99999 }),
    product: options.product || faker.word.sample(),
    quantity: options.quantity || faker.number.int({ max: 99999 }),
    meterReading: options.meterReading || faker.number.int({ max: 99999 }),
    waterUsage: options.waterUsage || faker.number.int({ max: 99999 }),
    pumpDial: options.pumpDial || faker.number.int({ max: 99999 }),
    floatBeforeDelivery: options.floatBeforeDelivery || floatBeforeDelivery,
    targetFeedRate: options.targetFeedRate || faker.number.int({ max: 99999 }),
    floatAfterDelivery: options.floatAfterDelivery || floatAfterDelivery,
    comments: options.comments || faker.lorem.sentence(),
  };
  
  return data;  
};

exports.fullData = (options = {}) => {
  const data = {
    farmFk: options.farmFk,
    date: options.date || faker.date.recent(),
    noOfCows: options.noOfCows || faker.number.int({ max: 99999 }),
    product: options.product || faker.word.sample(),
    quantity: options.quantity || faker.number.int({ max: 99999 }),
    meterReading: options.meterReading || faker.number.int({ max: 99999 }),
    waterUsage: options.waterUsage || faker.number.int({ max: 99999 }),
    pumpDial: options.pumpDial || faker.number.int({ max: 99999 }),
    kgActual: options.kgActual,
    floatBeforeDelivery: options.floatBeforeDelivery,
    targetFeedRate: options.targetFeedRate || faker.number.int({ max: 99999 }),
    averageWaterIntake: options.averageWaterIntake,
    actualFeedRate: options.actualFeedRate,
    floatBeforeDelivery: options.floatBeforeDelivery,
    floatAfterDelivery: options.floatAfterDelivery,
    deliveryDate: options.deliveryDate,
    comments: options.comments || faker.lorem.sentence(),
  };
  
  return data;
}

exports.product = (options = {}) => {
  return {
    productName: options.productName || faker.word.sample(),
    specificGravity: options.specificGravity || faker.number.int({ max: 99999 }),
  };
};
