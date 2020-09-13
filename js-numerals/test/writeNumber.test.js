import {getWrittenNumber} from "../src/writeNumber.js";

test("initial setup test", () => {
    expect(getWrittenNumber("")).toBe("Hello there!");
});