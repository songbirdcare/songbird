import { test } from "vitest";

import { GCSObjectWriter } from "../../services/object-writer";
import { TEST_SETTINGS } from "../test-settings";

async function setup() {
  const impl = new GCSObjectWriter("tmp", TEST_SETTINGS.bucket);

  return {
    impl,
  };
}

test("writeFile", async () => {
  const { impl } = await setup();

  await impl.writeFile({
    contents: "foo",
    destination: "nasr.txt",
  });
}, 60_000_000);
