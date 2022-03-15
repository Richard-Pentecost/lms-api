const { expect } = require('chai');
const DataFactory = require('../helpers/data-factory');
const { formatData, actualFeedRate, averageWaterIntake, kgActual } = require('../../src/utils/formatData');

describe('formatData.js', () => {
  describe('formatData', () => {
    it('should return the data object with calculated values', () => {
      const farmFk = DataFactory.uuid;
      const data = DataFactory.data({
        farmFk,
        meterReading: 1995,
        noOfCows: 120,
        date: new Date('10/01/2021'),
        floatBeforeDelivery: 106, 
        floatAfterDelivery: 120,
      });

      const previousData = { 
        date: new Date('09/16/2021'), 
        meterReading: 1880, 
        floatAfterDelivery: 131, 
      };

      const specificGravity = 2.8;

      const formattedDataObj = formatData(data, previousData, specificGravity);

      const expectedDataObj = {
        farmFk,
        date: new Date('10/01/2021'),
        noOfCows: 120,
        product: data.product,
        quantity: data.quantity,
        meterReading: 1995,
        waterUsage: data.waterUsage,
        averageWaterIntake: 63.9,
        pumpDial: data.pumpDial,
        floatBeforeDelivery: 106,
        kgActual: 296.8,
        targetFeedRate: data.targetFeedRate,
        actualFeedRate: 39,
        floatAfterDelivery: 120,
        comments: data.comments,
      }

      expect(formattedDataObj).to.deep.equal(expectedDataObj);
    });
  });

  describe('averageWaterIntake', () => {
    it('should calculate the correct average water intake', () => {
      const currentMeterReading = 1995;
      const lastMeterReading = 1880;
      const cows = 120;
      const days = 15;

      const result = averageWaterIntake(currentMeterReading, lastMeterReading, cows, days);
      expect(result).to.equal(63.9);
    });
  });

  describe('actualFeedRate', () => {
    it('should calculate the correct actual feed rate', () => {
      const floatBeforeDelivery = 106;
      const lastFloatDelivery = 131;
      const specGravity = 2.8;
      const cows = 120;
      const days = 15;

      const result = actualFeedRate(floatBeforeDelivery, lastFloatDelivery, specGravity, cows, days);
      expect(result).to.equal(39);
    });
  });

  describe('kgActual', () => {
    it('should calculate the correct kg actual', () => {
      const floatBeforeDelivery = 106;
      const specGravity = 2.8;

      const result = kgActual(floatBeforeDelivery, specGravity);
      expect(result).to.equal(296.8);
    });
  });
});
