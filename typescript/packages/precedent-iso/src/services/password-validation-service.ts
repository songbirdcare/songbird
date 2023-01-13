const MIN_LENGTH = 8;
export class PasswordValidationService {
  static validate(password: string): PasswordValidationResult {
    if (password.length < MIN_LENGTH) {
      return {
        type: "error",
        code: "too_short",
      };
    }
    return { type: "ok" };
  }
}

export type PasswordValidationError = "too_short";
export type PasswordValidationResult =
  | { type: "ok" }
  | { type: "error"; code: PasswordValidationError };
