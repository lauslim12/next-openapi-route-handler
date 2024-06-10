import type { ZodType } from "zod";

function convertStringToNumber(input: Record<string, unknown>, keys: string[]) {
  return keys.reduce((mutation, key) => {
    return { ...mutation, [key]: parseInt(mutation[key] as string) } as Record<string, unknown>;
  }, input);
}

function getTrueBoolean(input: string) {
  if (input === "true") return true;
  if (input === "false") return false;
  return null;
}

function convertStringToBoolean(input: Record<string, unknown>, keys: string[]) {
  return keys.reduce((mutation, key) => {
    return { ...mutation, [key]: getTrueBoolean(mutation[key] as string) } as Record<string, unknown>;
  }, input);
}

export function safeParse<T>(schema: ZodType<T>, input: Record<string, unknown>) {
  const result = schema.safeParse(input);
  if (!result.success) {
    for (const issue of result.error.issues) {
      if (issue.code === "invalid_type" && issue.expected === "number" && issue.received === "string") {
        return safeParse(schema, convertStringToNumber(input, issue.path as string[]));
      }
      if (issue.code === "invalid_type" && issue.expected === "boolean" && issue.received === "string") {
        return safeParse(schema, convertStringToBoolean(input, issue.path as string[]));
      }
    }
    throw result.error;
  }
  return result.data;
}
