import { promises } from "fs";
import { afterEach, test } from "vitest";

import { GCSObjectWriter } from "../../services/object-writer";
import { TEST_SETTINGS } from "../test-settings";

const DIR = "tmp";
async function setup() {
  const impl = new GCSObjectWriter(TEST_SETTINGS.bucket);

  await promises.mkdir(DIR);
  const fileName = `${DIR}/dummy.txt`;

  await promises.writeFile(fileName, "Dummy");

  return {
    impl,
    fileName,
  };
}

afterEach(async () => {
  await promises.rm(DIR, { recursive: true });
});

test.only("writeFile", async () => {
  const { impl, fileName } = await setup();

  await impl.writeFile({
    pathToFile: fileName,
    destination: "test.txt",
  });
}, 60_000_000);
