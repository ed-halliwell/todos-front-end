import timestampConverter from "./timestampConverter";

test("greet returns a string, greeting the passed name", () => {
  // expect(timestampConverter(0)).toMatch("years ago");
  // expect(timestampConverter(-100)).toMatch("years ago");
  // expect(timestampConverter(1637319601)).toMatch("ago");
  expect(timestampConverter("2021-11-26 13:50:01.884572")).toMatch("ago");
  expect(timestampConverter("2021-11-25 13:50:01.884572")).toMatch("day ago");
});
