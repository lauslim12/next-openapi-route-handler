/* eslint-disable no-console */
import { describe, expect, it, jest } from "@jest/globals";
import z from "zod";
import parsePathParams from "./path-params";

describe("parsePathParams", () => {
  it("should return null when no schema is provided", () => {
    const result = parsePathParams({ param: "value" });
    expect(result).toBeNull();
  });

  it("should throw an error when no source is provided", () => {
    const schema = z.object({ id: z.string() });

    expect(() => parsePathParams(undefined, schema)).toThrowError("UNNECESSARY_PATH_PARAMS");
  });

  it("should successfully parse valid path parameters", () => {
    const schema = z.object({ id: z.string() });

    const result = parsePathParams({ id: "123" }, schema);

    expect(result).toEqual({ id: "123" });
  });

  it("should throw an error for invalid path parameters and log issues in non-production environment", () => {
    const schema = z.object({ id: z.number() });

    const originalLog = console.log;
    console.log = jest.fn(); // Mock console.log to verify error logging

    const invalidPathParams = { id: "abc" } as unknown as z.infer<typeof schema>;

    expect(() => parsePathParams(invalidPathParams, schema)).toThrowError("PARSE_PATH_PARAMS");

    expect(console.log).toHaveBeenCalled();
    console.log = originalLog; // Restore original console.log
  });
});
