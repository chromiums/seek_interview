let { Default } = require('./PricingRules');
let { groupBy } = require('./Utilities');

class Checkout {
  constructor(pricingRules = []) {
    // Check if multiple discounts have been applied to the same product
    if(pricingRules.map((val) => val.productId).filter((value, index, input) => input.indexOf(value) !== index).length) {
      throw new Error('Can\'t have multiple discounts for the same product')
    }

    // Creating a map of { [productId] => pricingRule }
    this.pricingRules = pricingRules.reduce((accum, val) => Object.assign(accum, { [val.productId]: val }), {});
    
    this.items = [];
    this.defaultPricingRule = new Default();
  }

  add(item) {
    this.items = [...this.items, item];
  }

  total() {
    let itemGroups = groupBy(this.items, 'id');
    let total = 0;

    for (var itemId in itemGroups) {
      if (itemGroups.hasOwnProperty(itemId)) {
        // Retrieving the pricing rule for the product or default pricing rule
        let pricingRule = this.pricingRules[itemId] || this.defaultPricingRule;

        total += pricingRule.calculate(itemGroups[itemId]);
      }
    }

    return total;
  }
}

module.exports = Checkout;
