let assert = require('assert');
let Product = require('../Product');
let sinon = require('sinon');
let { Default, Flat } = require('../PricingRules');
let Checkout = require('../Checkout');

describe('Checkout', () => {
  describe('constructor()', () => {
    it('should create an empty items array', () => {
      let co = new Checkout();

      assert.notEqual(co.items, null);
      assert.deepStrictEqual(co.items, []);
    });

    it('should convert the input pricingRules into a { [productId] => pricingRule } map', () => {
      let pricingRule = new Flat('classic');
      let co = new Checkout([pricingRule]);

      let expectedResult = {
        [pricingRule.productId]: pricingRule
      };

      assert.deepStrictEqual(co.pricingRules, expectedResult);
    });

    it('should throw an error if multiple discounts added for the same product', () => {
      assert.throws(
        () => new Checkout([new Flat('classic'), new Flat('classic')]),
        'Multiple discounts on the same product'
      );
    });
  });

  describe('add()', () => {
    it('should add an item to the list', () => {
      let co = new Checkout();
      
      co.add(new Product());

      assert.equal(co.items.length, 1);
    });
  });

  describe('total()', () => {
    let sandbox;

    before(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    after(() => {
      sandbox.restore();
    });

    it('should call calculate for the price rule associated with each product', () => {
      let item1 = new Product('productId1', 123);
      let item2 = new Product('productId2', 456);
      let flatPricingRule1 = new Flat(item1.id, 50);
      let flatPricingRule2 = new Flat(item2.id, 100);

      sinon.spy(flatPricingRule1, 'calculate');
      sinon.spy(flatPricingRule2, 'calculate');

      let co = new Checkout([flatPricingRule1, flatPricingRule2]);

      co.add(item1);
      co.add(item2);
      co.total();

      // Check that the correct price rule was called per product
      assert.equal(flatPricingRule1.calculate.calledOnce, true);
      assert.equal(flatPricingRule1.calculate.calledWith([item1]), true);

      assert.equal(flatPricingRule2.calculate.calledOnce, true);
      assert.equal(flatPricingRule2.calculate.calledWith([item2]), true);
    });

    it('should call the default pricing rule calculate if no price rule exists for the product', () => {
      let co = new Checkout([new Flat('otherProductId', 123)]);

      sinon.spy(Default.prototype, 'calculate');

      co.add(new Product('productId', 'productName', 101));
      co.total();

      assert.equal(Default.prototype.calculate.called, true);
    });

    it('should sum up the values returned from the price rules', () => {
      let item1 = new Product('productId1', 123);
      let item2 = new Product('productId2', 456);
      let flatPricingRule1 = new Flat(item1.id, 50);
      let flatPricingRule2 = new Flat(item2.id, 100);

      sinon.stub(flatPricingRule1, 'calculate').callsFake(() => 50);
      sinon.stub(flatPricingRule2, 'calculate').callsFake(() => 100);

      let co = new Checkout([flatPricingRule1, flatPricingRule2]);

      co.add(item1);
      co.add(item2);
      
      assert.equal(co.total(), 150);
    });
  });
});
