import { createPool, sql } from "slonik";
import { beforeEach, expect, test } from "vitest";

import { PsqlChildService } from "../../services/child/psql-child-service";
import { PsqlUserService } from "../../services/psql-user-service";
import { TEST_SETTINGS } from "../test-settings";

async function setup() {
  const pool = await createPool(TEST_SETTINGS.sqlUri);
  const userService = new PsqlUserService(pool);
  const childService = new PsqlChildService(pool);
  return {
    pool,
    userService,
    childService,
  };
}

beforeEach(async () => {
  const { pool } = await setup();

  await pool.query(sql.unsafe`TRUNCATE TABLE sb_user, child CASCADE`);
});

test("create", async () => {
  const { childService, userService } = await setup();
  const user = await userService.upsert({
    sub: "test",
    email: "test@gmail.com",
  });

  await childService.createIfNotExists(user.id, {
    type: "qualified",
  });

  await Promise.all(
    new Array(20).fill(undefined).map(() =>
      childService.createIfNotExists(user.id, {
        type: "unknown",
      })
    )
  );

  const child = await childService.get(user.id);
  expect(child.qualified.type).toEqual("qualified");
});
