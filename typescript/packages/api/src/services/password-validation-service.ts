const MIN_LENGTH = 8;
export class PasswordValidationService {
  validate(password: string) {
    if (password.length < MIN_LENGTH) {
      return {
        type: "error",
        code: "too_short",
      };
    }
    return { type: "ok" };
  }
}

export type ValidationResult =
  | { type: "ok" }
  | { type: "error"; code: "too_short" };
