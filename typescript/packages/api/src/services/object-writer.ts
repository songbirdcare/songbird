import { Bucket, Storage } from "@google-cloud/storage";
import { promises } from "fs";

export class GCSObjectWriter implements ObjectWriter {
  writeFile(_: string, __: string): Promise<void> {
    throw new Error("not implemented");
  }
}

export class LocalObjectWriter implements ObjectWriter {
  writeFile(path: string, data: string): Promise<void> {
    return promises.writeFile(path, data);
  }
}

export interface ObjectWriter {
  writeFile(path: string, data: string): Promise<void>;
}
