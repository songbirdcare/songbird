import { Bucket, Storage } from "@google-cloud/storage";
import { promises } from "fs";

export class GCSObjectWriter implements ObjectWriter {
  #bucket: Bucket;

  constructor(bucketName: string) {
    const storage = new Storage();
    this.#bucket = storage.bucket(bucketName);
  }

  async writeFile({
    pathToFile,
    destination,
  }: WriteFileArguments): Promise<void> {
    await this.#bucket.upload(pathToFile, {
      destination,
    });
  }
}

export class LocalObjectWriter implements ObjectWriter {
  writeFile({ pathToFile, destination }: WriteFileArguments): Promise<void> {
    return promises.writeFile(pathToFile, destination);
  }
}

export interface ObjectWriter {
  writeFile(args: WriteFileArguments): Promise<void>;
}

export interface WriteFileArguments {
  pathToFile: string;
  destination: string;
}
