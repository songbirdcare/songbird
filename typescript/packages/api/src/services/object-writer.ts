import { promises } from "fs";

export class LocalObjectWriter implements ObjectWriter {
  writeFile(path: string, data: string): Promise<void> {
    return promises.writeFile(path, data);
  }
}

export interface ObjectWriter {
  writeFile(path: string, data: string): Promise<void>;
}
