import type { Flags } from "../hooks/use-flags";

declare global {
  interface Window {
    Intercom?: (...args: any[]) => void;
    _flags?: Flags;
  }
}

export {};
