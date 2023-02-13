import { readFileSync, writeFileSync } from "fs";
import { test } from "vitest";

import { GreenhouseServiceImpl } from "../../services/greenhouse/greenhouse-service";
import { TEST_SETTINGS } from "../test-settings";

async function setup() {
  const impl = new GreenhouseServiceImpl(TEST_SETTINGS.greenhouseApiKey!);
  return {
    impl,
  };
}

export function getIds(): string[] {
  return readFileSync(
    "/Users/nasrmaswood/code/songbird/typescript/packages/api/src/tests/greenhouse/ids.txt",
    "utf-8"
  ).split("\n");
}

test("getSignupForm", async () => {
  if (!TEST_SETTINGS.greenhouseApiKey) {
    console.info("Skipping greenhouse test");
  }

  const { impl } = await setup();
  const ids = getIds();
  console.log(`Total: ${ids.length}`);

  const data = await impl.getStageData(ids);

  writeFileSync("greenhouse-activity-feed.json", JSON.stringify(data));
}, 60_000_000);
