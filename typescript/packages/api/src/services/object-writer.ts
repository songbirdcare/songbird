import { Bucket, Storage } from "@google-cloud/storage";
import { promises } from "fs";
import { join } from "path";

export class GCSObjectWriter implements ObjectWriter {
  #bucket: Bucket;

  constructor(private readonly prefix: string, bucketName: string) {
    const storage = new Storage();
    this.#bucket = storage.bucket(bucketName);
  }

  async writeFile({
    destination,
    contents,
  }: WriteFileArguments): Promise<void> {
    await this.#bucket.file(join(this.prefix, destination)).save(contents);
  }
}

export class LocalObjectWriter implements ObjectWriter {
  writeFile({ destination, contents }: WriteFileArguments): Promise<void> {
    return promises.writeFile(destination, contents);
  }
}

export interface ObjectWriter {
  writeFile(args: WriteFileArguments): Promise<void>;
}

export interface WriteFileArguments {
  contents: string;
  destination: string;
}
