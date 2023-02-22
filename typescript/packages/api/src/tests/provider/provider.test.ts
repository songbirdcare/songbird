import { createPool } from "slonik";
import { expect, test } from "vitest";
import { PsqlProviderService } from "../../services/provider/provider-service";

import { TEST_SETTINGS } from "../test-settings";

async function setup() {
  const pool = await createPool(TEST_SETTINGS.sqlUri);
  const providerService = new PsqlProviderService(pool);

  return {
    providerService,
  };
}

test("getAll does not overwrite workflows that exist", async () => {
  const { providerService } = await setup();

  const providers = await providerService.getAll();

  expect(providers.length).toBeGreaterThan(0);
});
