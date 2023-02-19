import { readFileSync } from "fs";
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
  const ids = readFileSync(
    "/Users/nasrmaswood/code/songbird/typescript/packages/api/src/tests/greenhouse/ids.txt",
    "utf-8"
  ).split("\n");

  return ids.map((id) => id.trim()).filter((id) => id.length > 0);
}

test("getSignupForm", async () => {
  if (!TEST_SETTINGS.greenhouseApiKey || !TEST_SETTINGS.enableGreenhouseTest) {
    console.info("Skipping greenhouse test");
    return;
  }

  const { impl } = await setup();
  const ids = getIds().slice(1, 3);
  console.log(`Total: ${ids.length}`);

  //const data = await impl.getStageData(ids);

  //await impl.export({ path: "mydata.xlsx", stageData: data.stageData });

  //writeFileSync("greenhouse-activity-feed.json", JSON.stringify(data));
  //
  const foo = await impl.getCanditateIds();
  console.log(foo);
}, 60_000_000);
