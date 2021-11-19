import timestampConverter from "./timestampConverter";

test("greet returns a string, greeting the passed name", () => {
  expect(timestampConverter(0)).toMatch("years ago");
  expect(timestampConverter(-100)).toMatch("years ago");
  expect(timestampConverter(1637319601)).toMatch("ago");
});
