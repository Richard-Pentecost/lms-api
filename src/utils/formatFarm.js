
const formatFarm = farm => {
  const formattedPostcode = farm.postcode && formatPostcode(farm.postcode);
  const formattedContactNumber = farm.contactNumber && formatPhoneNumber(farm.contactNumber);

  return {
    ...farm,
    postcode: formattedPostcode,
    contactNumber: formattedContactNumber,
  }; 
}

const formatPostcode = postcode => {
  const postcodeArr = postcode.toUpperCase().replace(/\s+/g, '').split('');
  
  let index;
  switch(postcodeArr.length) {
    case 5:
      index = 2;
      break;
    case 6:
      index = 3;
      break;
    case 7:
      index = 4;
      break;
  } 

  postcodeArr.splice(index, 0, ' ');
  return postcodeArr.join('');
};

const formatPhoneNumber = number => {
  const numberArr = number.replace(/\s+/g, '').split('');
  numberArr.splice(5, 0, ' ');
  return numberArr.join('');
}

module.exports = { formatFarm, formatPostcode, formatPhoneNumber };