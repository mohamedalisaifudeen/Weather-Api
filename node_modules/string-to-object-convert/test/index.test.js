const Assert = require("assert");
const Converter = require("../lib/index");

describe("Converter test", () => {
  it("Should return simple json object", () => {
    Assert.deepEqual(
      Converter.convertJson('{ app_data: { value: 1 }, app_id: "MOB0006" }'),
      { app_data: { value: 1 }, app_id: "MOB0006" }
    );
  });
});
