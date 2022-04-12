const dayjs = require('dayjs');

const formatData = (data, specificGravity, previousData) => {
  const { 
    date, 
    meterReading: currentMeterReading, 
    noOfCows: cows, 
    floatBeforeDelivery,
  } = data;

  const kilos = kgActual(specificGravity, floatBeforeDelivery);

  let dataObj = {
    ...data,
    kgActual: kilos,
    averageWaterIntake: null,
    actualFeedRate: null,
  };

  let waterIntake;
  let feedRate;

  if (previousData) {
    const { 
      date: previousDate, 
      meterReading: lastMeterReading, 
      floatAfterDelivery: lastFloatReading 
    } = previousData;
  
    const days = dayjs(date).endOf('day').diff(dayjs(previousDate).endOf('day'), 'days');
  
    waterIntake = averageWaterIntake(currentMeterReading, lastMeterReading, cows, days);
    feedRate = actualFeedRate(floatBeforeDelivery, lastFloatReading, specificGravity, cows, days);
    
    dataObj = {
      ...dataObj,
      averageWaterIntake: waterIntake,
      actualFeedRate: feedRate,
    };
  };

  return dataObj;
}

const averageWaterIntake = (currentMeterReading, lastMeterReading, cows, days) => {
  const averageWaterIntake = (currentMeterReading - lastMeterReading) * 1000 / cows / days;

  return Math.round(averageWaterIntake * 10) / 10;
};

const actualFeedRate = (floatBeforeDelivery, lastFloatReading, specGravity, cows, days) => {
  const actualFeedRate = (lastFloatReading - floatBeforeDelivery) * specGravity / cows / days * 1000;

  return Math.round(actualFeedRate);
};

const kgActual = (specGravity, floatBeforeDelivery) => {
  return Math.round(specGravity * floatBeforeDelivery * 10) / 10;
};

module.exports = { formatData, averageWaterIntake, actualFeedRate, kgActual }; 
