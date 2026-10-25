export const options = {
  Size: [
    { name: "6 inch", price: 0 },
    { name: "8 inch", price: 18 },
    { name: "10 inch", price: 36 },
  ],
  Flavour: [
    { name: "Belgian dark", price: 0 },
    { name: "Roasted hazelnut", price: 6 },
    { name: "Salted caramel", price: 4 },
  ],
  Frosting: [
    { name: "Dark ganache", price: 0 },
    { name: "Chocolate mousse", price: 5 },
  ],
  Topping: [
    { name: "Chocolate curls", price: 0 },
    { name: "Gold leaf", price: 8 },
    { name: "Cocoa nibs", price: 3 },
  ],
};
export const defaultSelection = Object.fromEntries(
  Object.entries(options).map(([key, values]) => [key, values[0].name]),
);
export function priceFor(selection) {
  return (
    48 +
    Object.entries(options).reduce(
      (sum, [key, values]) =>
        sum + (values.find((x) => x.name === selection[key])?.price || 0),
      0,
    )
  );
}
