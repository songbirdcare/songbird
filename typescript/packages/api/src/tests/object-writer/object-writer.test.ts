import { test } from "vitest";

import { GCSObjectWriter } from "../../services/object-writer";
import { TEST_SETTINGS } from "../test-settings";

async function setup() {
  const impl = new GCSObjectWriter(TEST_SETTINGS.bucket);

  return {
    impl,
  };
}

test("writeFile", async () => {
  const { impl } = await setup();

  await impl.writeFromMemory({
    contents: "foo",
    destination: "nasr.txt",
  });
}, 60_000_000);
