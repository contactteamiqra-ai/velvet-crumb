import test from "node:test";
import assert from "node:assert/strict";
import { defaultSelection, options, priceFor } from "../src/product.js";
test("signature base price and all premium options", () => {
  assert.equal(priceFor(defaultSelection), 48);
  assert.equal(
    priceFor({
      Size: "8 inch",
      Flavour: "Roasted hazelnut",
      Frosting: "Chocolate mousse",
      Topping: "Gold leaf",
    }),
    85,
  );
});
test("all 54 configurations have finite additive prices", () => {
  let count = 0;
  for (const size of options.Size)
    for (const flavor of options.Flavour)
      for (const frosting of options.Frosting)
        for (const topping of options.Topping) {
          const selection = {
            Size: size.name,
            Flavour: flavor.name,
            Frosting: frosting.name,
            Topping: topping.name,
          };
          assert.equal(
            priceFor(selection),
            48 + size.price + flavor.price + frosting.price + topping.price,
          );
          count++;
        }
  assert.equal(count, 54);
});
