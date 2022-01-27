const { expect } = require('chai');
const DataFactory = require('../helpers/data-factory');
const { formatFarm, formatPostcode, formatPhoneNumber } = require('../../src/utils/formatFarm');

describe('formatFarm.js', () => {
  describe('formatFarm', () => {
    it('should return the farm object with the correct formatting', () => {
      const farm = DataFactory.farm({ postcode: 'ab12de', contactNumber: '01234567 890' });

      const formattedFarm = formatFarm(farm);
      const expectedFarmObj = {
        farmName: farm.farmName,
        postcode: 'AB1 2DE',
        contactName: farm.contactName,
        contactNumber: '01234 567890',
        isActive: true,
        regionFk: null,
        accessCodes: null,
        comments: null,
      }
      expect(formattedFarm).to.deep.equal(expectedFarmObj);
    });
  });

  describe('formatPostcode', () => {
    it('should format a 5 letter postcode, so that it has a space after 3 letters', () => {
      const formattedPostcode = formatPostcode('A1 2CD');
      expect(formattedPostcode).to.equal('A1 2CD');
    });

    it('should format a 5 letter postcode, so that it has a space after 3 letters when no space in value given', () => {
      const formattedPostcode = formatPostcode('A12CD');
      expect(formattedPostcode).to.equal('A1 2CD');
    });

    it('should format a 6 letter postcode, so that it is uppercase', () => {
      const formattedPostcodeNoSpaces = formatPostcode('a12CD');
      const formattedPostcodeSpaces = formatPostcode('z 90 y w');

      expect(formattedPostcodeNoSpaces).to.equal('A1 2CD');
      expect(formattedPostcodeSpaces).to.equal('Z9 0YW');
    });

    it('should format a 6 letter postcode, so that it has a space after 3 letters', () => {
      const formattedPostcode = formatPostcode('AB1 2CD');
      expect(formattedPostcode).to.equal('AB1 2CD');
    });

    it('should format a 6 letter postcode, so that it has a space after 3 letters when no space in value given', () => {
      const formattedPostcode = formatPostcode('AB12CD');
      expect(formattedPostcode).to.equal('AB1 2CD');
    });

    it('should format a 6 letter postcode, so that it is uppercase', () => {
      const formattedPostcodeNoSpaces = formatPostcode('ab12CD');
      const formattedPostcodeSpaces = formatPostcode('z X90 y w');

      expect(formattedPostcodeNoSpaces).to.equal('AB1 2CD');
      expect(formattedPostcodeSpaces).to.equal('ZX9 0YW');
    });

    it('should format 7 letter postcode, so that it has a space after 4 letters', () => {
      const formattedPostcode = formatPostcode('AB10 2CD');
      expect(formattedPostcode).to.equal('AB10 2CD');
    });

    it('should format 7 letter postcode, so that it has a space after 4 letters when no space in value given', () => {
      const formattedPostcode = formatPostcode('AB102CD');
      expect(formattedPostcode).to.equal('AB10 2CD');
    });

    it('should format a 7 letter postcode, so that it is uppercase', () => {
      const formattedPostcodeNoSpaces = formatPostcode('ab123CD');
      const formattedPostcodeSpaces = formatPostcode(' z X90 4y w    ');

      expect(formattedPostcodeNoSpaces).to.equal('AB12 3CD');
      expect(formattedPostcodeSpaces).to.equal('ZX90 4YW');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format the number to have a space after 5 numbers', () => {
      const formattedNumber = formatPhoneNumber('01234 567890');
      expect(formattedNumber).to.equal('01234 567890');
    });

    it('should format the number to have a space after 5 numbers when there are no spaces given', () => {
      const formattedNumber = formatPhoneNumber('01234567890');
      expect(formattedNumber).to.equal('01234 567890');
    });

    it('should format the number correctly when there are random spaces', () => {
      const formattedNumber = formatPhoneNumber('  012 345 67 89 0   ');
      expect(formattedNumber).to.equal('01234 567890');
    })
  });
});