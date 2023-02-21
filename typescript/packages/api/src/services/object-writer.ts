import { Bucket, Storage } from "@google-cloud/storage";
import { promises } from "fs";

export class GCSObjectWriter implements ObjectWriter {
  #bucket: Bucket;

  constructor(bucketName: string) {
    const storage = new Storage();
    this.#bucket = storage.bucket(bucketName);
  }

  writeFromMemory({ destination, contents }: WriteFromMemory): Promise<void> {
    return this.#bucket.file(destination).save(contents);
  }

  async writeFromDisk({ destination, src }: WriteFromDisk): Promise<void> {
    await this.#bucket.upload(src, {
      destination,
    });
  }
}

export class LocalObjectWriter implements ObjectWriter {
  writeFromMemory({ destination, contents }: WriteFromMemory): Promise<void> {
    return promises.writeFile(destination, contents);
  }

  writeFromDisk({ destination, src }: WriteFromDisk): Promise<void> {
    return promises.copyFile(src, destination);
  }
}

export interface ObjectWriter {
  writeFromMemory(args: WriteFromMemory): Promise<void>;
  writeFromDisk(args: WriteFromDisk): Promise<void>;
}

export interface WriteFromMemory {
  contents: string;
  destination: string;
}

export interface WriteFromDisk {
  src: string;
  destination: string;
}
