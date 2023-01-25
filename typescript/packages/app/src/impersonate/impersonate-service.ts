import { getCookie, removeCookie,setCookie } from "typescript-cookie";

export const KEY = "X-Impersonate";
const IS_BROWSER = isBrowser();

export class ImpersonateService {
  static get() {
    if (!IS_BROWSER) {
      return undefined;
    }
    return getCookie(KEY);
  }
  static set(id: string) {
    if (!IS_BROWSER) {
      throw new Error("cannot set cookie on server");
    }
    setCookie(KEY, id, { expires: 1 });
  }
  static clear() {
    if (!IS_BROWSER) {
      throw new Error("cannot clear cookie on server");
    }
    removeCookie(KEY);
  }
}
function isBrowser() {
  return typeof document !== "undefined";
}
