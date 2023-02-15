import type { Flags } from "../hooks/use-flags";

declare global {
  interface Window {
    Intercom?: (...args: unknown[]) => void;
    _flags?: Flags;
  }
}

export {};
