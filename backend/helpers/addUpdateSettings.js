const addUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};

export default addUpdateSettings;
