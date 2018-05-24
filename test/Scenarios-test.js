// Tests of the provided example scenarios

let assert = require("assert");
let { XforY, XorMore, Flat } = require("../PricingRules");
let Checkout = require("../Checkout");
let Product = require("../Product");

let classic = new Product("classic", "Classic Ad", 269.99);
let standout = new Product("standout", "Standout Ad", 322.99);
let premium = new Product("premium", "Premium Ad", 394.99);

describe("Scenarios", () => {
  describe("Customer: default => ID added: classic, standout, premium", () => {
    it("should return $987.97", () => {
      let co_default = new Checkout();
      co_default.add(classic);
      co_default.add(standout);
      co_default.add(premium);

      assert.equal(co_default.total(), 987.97);
    });
  });

  describe("Customer: Unilever => SKUs Scanned: classic, classic, classic, premium", () => {
    it("should return $934.97", () => {
      let co_unilever = new Checkout([new XforY(classic.id, 3, 2)]);

      co_unilever.add(classic);
      co_unilever.add(classic);
      co_unilever.add(classic);
      co_unilever.add(premium);

      assert.equal(co_unilever.total(), 934.97);
    });
  });

  describe("Customer: Apple => SKUs Scanned: standout, standout, standout, premium", () => {
    it("should return $1294.96", () => {
      let co_apple = new Checkout([new Flat(standout.id, 299.99)]);
      co_apple.add(standout);
      co_apple.add(standout);
      co_apple.add(standout);
      co_apple.add(premium);

      assert.equal(co_apple.total(), 1294.96);
    });
  });

  describe("Customer: Nike => SKUs Scanned: premium, premium, premium, premium", () => {
    it("should return $1519.96", () => {
      let co_nike = new Checkout([new XorMore(premium.id, 4, 379.99)]);
      co_nike.add(premium);
      co_nike.add(premium);
      co_nike.add(premium);
      co_nike.add(premium);

      assert.equal(co_nike.total(), 1519.96);
    });
  });

  describe("Customer: Ford => SKUs Scanned: classic, classic, classic, classic, classic, standout, standout, premium, premium, premium, premium", () => {
    it("should return $3259.9", () => {
      let co_ford = new Checkout([
        new XforY(classic.id, 5, 4),
        new Flat(standout.id, 309.99),
        new XorMore(premium.id, 3, 389.99)
      ]);
      co_ford.add(classic);
      co_ford.add(classic);
      co_ford.add(classic);
      co_ford.add(classic);
      co_ford.add(classic);
      co_ford.add(standout);
      co_ford.add(standout);
      co_ford.add(premium);
      co_ford.add(premium);
      co_ford.add(premium);
      co_ford.add(premium);

      assert.equal(co_ford.total(), 3259.9);
    });
  });
});
