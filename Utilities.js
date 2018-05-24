module.exports = {
  groupBy: function(input, key) {
    return input.reduce(function(accum, value) {
      (accum[value[key]] = accum[value[key]] || []).push(value);
      return accum;
    }, {});
  }
};
