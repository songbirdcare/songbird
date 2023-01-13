export class PasswordValidationService {
  static MIN_LENGTH = 8;
  static validate(password: string): PasswordValidationResult {
    if (password.length < PasswordValidationService.MIN_LENGTH) {
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
