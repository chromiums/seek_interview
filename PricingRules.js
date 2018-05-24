// Base class for clarity
class PricingRule {
  constructor() {
    if(this.constructor === PricingRule) {
      throw new Error('Can\'t instantiate abstract class!');
    }
  }
}

class ProductPricingRule extends PricingRule {
  constructor(productId) {
    super();
    this.productId = productId;
  }
}

class Default extends PricingRule {
  constructor() {
    super();
  }
  
  calculate(items) {
    let price = items[0].price;
    return items.length * price;
  }
}

class XforY extends ProductPricingRule {
  constructor(productId, numItems, reducedNumItems) {
    super(productId);
    
    this.numItems = numItems;
    this.reducedNumItems = reducedNumItems;
  }

  calculate(items) {
    if(items.length === 0) {
      return 0;
    }

    let price = items[0].price;
    let numDiscountGroups = Math.trunc(items.length / this.numItems);
    let numRemainingItems = items.length % this.numItems;

    let discountedItemsPrice = numDiscountGroups * this.reducedNumItems * price;
    let remainingItemsPrice = numRemainingItems * price;

    return discountedItemsPrice + remainingItemsPrice;
  }
}

class XorMore extends ProductPricingRule {
  constructor(productId, numItems, discountedPrice) {
    super(productId);

    this.numItems = numItems;
    this.discountedPrice = discountedPrice;
    this.defaultPricingRule = new Default();
  }

  calculate(items) {
    if(items.length === 0) {
      return 0;
    }

    let originalPrice = items[0].price;

    if(items.length >= this.numItems) {
      return items.length * this.discountedPrice;
    }

    return this.defaultPricingRule.calculate(items);
  }
}

class Flat extends ProductPricingRule {
  constructor(productId, discountedPrice) {
    super(productId);

    this.discountedPrice = discountedPrice;
  }

  calculate(items) {
    if(items.length === 0) {
      return 0;
    }

    return items.length * this.discountedPrice;
  }
}

module.exports = {
  Default,
  XforY,
  XorMore,
  Flat
};
