let assert = require('assert');
let Product = require('../Product');
let { Default, XforY, XorMore, Flat } = require('../PricingRules');

describe('PricingRules', () => {
  let product, items;

  beforeEach(() => {
    product = new Product('productId', 'productName', 123.12)
    items = [product, product, product, product];
  });

  describe('Default', () => {
    describe('calculate()', () => {
      it('should have a calculate() method', () => {
        let defaultPricingRule = new Default();
  
        assert.equal(typeof defaultPricingRule.calculate, 'function');
      });

      it('should return the calculated price by (numItems * price)', () => {
        let defaultPricingRule = new Default();

        assert.equal(defaultPricingRule.calculate(items), 492.48);
      });
    });
  });

  describe('XforY', () => {
    it('should have a calculate() method', () => {
      let xForYPricingRule = new XforY(product.id, 4, 3);

      assert.equal(typeof xForYPricingRule.calculate, 'function');
    });

    it('should return the discounted price of 3 items', () => {
      let xForYPricingRule = new XforY(product.id, 4, 3);

      assert.equal(xForYPricingRule.calculate(items), 369.36);
    });

    it('should return the discounted price of 2 items plus 1 item', () => {
      let xForYPricingRule = new XforY(product.id, 3, 2);

      assert.equal(xForYPricingRule.calculate(items), 369.36);
    });

    it('should return an undiscounted price', () => {
      let xForYPricingRule = new XforY(product.id, 5, 2);

      assert.equal(xForYPricingRule.calculate(items), 492.48);
    });

    it('should return an 0 if no items are passed', () => {
      let xForYPricingRule = new XforY(product.id, 5, 2);

      assert.equal(xForYPricingRule.calculate([]), 0);
    });
  });

  describe('XorMore', () => {
    it('should have a calculate() method', () => {
      let xOrMorePricingRule = new XorMore();

      assert.equal(typeof xOrMorePricingRule.calculate, 'function');
    });

    it('should return the discounted price', () => {
      let xOrMorePricingRule = new XorMore(product.id, 2, 50);

      assert.equal(xOrMorePricingRule.calculate(items), 200);
    });

    it('should return the default price', () => {
      let xOrMorePricingRule = new XorMore(product.id, 10, 50);

      assert.equal(xOrMorePricingRule.calculate(items), 492.48);
    });

    it('should return an 0 if no items are passed', () => {
      let xOrMorePricingRule = new XorMore(product.id, 10, 50);

      assert.equal(xOrMorePricingRule.calculate([]), 0);
    });
  });

  describe('Flat', () => {
    it('should have a calculate() method', () => {
      let flatPricingRule = new Flat(product.id, 50);

      assert.equal(typeof flatPricingRule.calculate, 'function');
    });

    it('should return a flat discounted price', () => {
      let flatPricingRule = new Flat(product.id, 50);

      assert.equal(flatPricingRule.calculate(items), 200);
    });

    it('should return an 0 if no items are passed', () => {
      let flatPricingRule = new Flat(product.id, 50);

      assert.equal(flatPricingRule.calculate([]), 0);
    });
  });
});
