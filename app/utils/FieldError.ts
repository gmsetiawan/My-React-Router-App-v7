import type { ZodIssue } from "zod";

export function fieldError(fieldName: string, errors: ZodIssue[]) {
  return errors
    ?.filter((item) => item.path.includes(fieldName))
    .map((item) => item.message)
    .toString();
}
