let brand = "Nike";
let color = "red";
let size = "27";

// exports = module.exports = {};

function showBrand() {
  return brand;
}
function showColor() {
  return color;
}

function showSize() {
  return size;
}

module.exports = {
  showBrand,
  showColor,
};

// return module.exports;
