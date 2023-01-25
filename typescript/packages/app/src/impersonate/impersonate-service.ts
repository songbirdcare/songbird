import { getCookie, setCookie, removeCookie } from "typescript-cookie";

export const KEY = "X-Impersonate";

export class ImpersonateService {
  static get() {
    return getCookie(KEY);
  }
  static set(id: string) {
    setCookie(KEY, id, { expires: 1 });
  }
  static clear() {
    removeCookie(KEY);
  }
}
