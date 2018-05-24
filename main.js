let { XforY, XorMore, Flat } = require('./PricingRules');
let Checkout = require('./Checkout');
let Product = require('./Product');

var classic = new Product('classic', 'Classic Ad', 269.99);
var standout = new Product('standout', 'Standout Ad', 322.99);
var premium = new Product('premium', 'Premium Ad', 394.99);

let co_ford = new Checkout([new XforY(classic.id, 5, 4), new Flat(standout.id, 309.99), new XorMore(premium.id, 3, 389.99)]);
co_ford.add(classic);
co_ford.add(classic);
co_ford.add(classic);
co_ford.add(classic);
co_ford.add(classic);
co_ford.add(standout);
co_ford.add(standout);
co_ford.add(premium)
co_ford.add(premium)
co_ford.add(premium)
co_ford.add(premium)

console.assert(co_ford.total() === 3259.9, 'Ford failed');
console.log(`Ford: ${co_ford.total()}`);
