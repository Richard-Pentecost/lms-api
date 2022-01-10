const dayjs = require('dayjs');

const formatData = (data, previousData, specificGravity) => {
  const { 
    date, 
    meterReading: currentMeterReading, 
    noOfCows: cows, 
    floatBeforeDelivery,
  } = data;

  const { 
    date: previousDate, 
    meterReading: lastMeterReading, 
    floatAfterDelivery: lastFloatReading 
  } = previousData;

  const days = dayjs(date).endOf('day').diff(dayjs(previousDate).endOf('day'), 'days');

  const waterIntake = averageWaterIntake(currentMeterReading, lastMeterReading, cows, days);
  const feedRate = actualFeedRate(floatBeforeDelivery, lastFloatReading, specificGravity, cows, days);
  
  return {
    ...data,
    averageWaterIntake: waterIntake,
    actualFeedRate: feedRate,
  }
  
}

const averageWaterIntake = (currentMeterReading, lastMeterReading, cows, days) => {
  const averageWaterIntake = (currentMeterReading - lastMeterReading) * 1000 / cows / days;

  return Math.round(averageWaterIntake * 10) / 10;
};

const actualFeedRate = (floatBeforeDelivery, lastFloatReading, specGravity, cows, days) => {
  const actualFeedRate = (lastFloatReading - floatBeforeDelivery) * specGravity / cows / days * 1000;

  return Math.round(actualFeedRate);
};

module.exports = { formatData, averageWaterIntake, actualFeedRate }; 
