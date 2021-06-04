const removePassword = obj => {
  if (obj.hasOwnProperty('password')) {
    delete obj.password;
  };
  return obj;
};

module.exports = { removePassword };