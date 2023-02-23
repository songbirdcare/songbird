import { sql } from "slonik";
import { beforeEach, expect, test } from "vitest";

import { PsqlUserService } from "../../services/psql-user-service";
import { dataBasePool } from "../../sql";
import { TEST_SETTINGS } from "../test-settings";

async function setup() {
  const pool = await dataBasePool(TEST_SETTINGS.sqlUri);
  const userService = new PsqlUserService(pool);

  return {
    pool,
    userService,
  };
}

beforeEach(async () => {
  const { pool } = await setup();

  await pool.query(sql.unsafe`TRUNCATE TABLE sb_user CASCADE`);
});

test("updates to last login are correct", async () => {
  const { userService } = await setup();
  const sub = "fake|last_login";
  const email = "fake@fake.com";

  const user = await userService.upsert({
    sub,
    email,
  });

  expect(user.lastLogin).not.toBeUndefined();
  const lastLogin = user.lastLogin;

  await Promise.all(
    new Array(20).fill(undefined).map(() =>
      userService.upsert({
        sub,
        email,
      })
    )
  );

  const userAgain = await userService.upsert({
    sub,
    email,
  });

  expect(userAgain.lastLogin).toEqual(lastLogin);

  const date = new Date(2020, 0, 0);

  await userService.updateLastLogin([
    {
      email,
      date,
    },
  ]);

  //const userAgainAgain = await userService.getById(user.id);

  //expect(userAgainAgain.lastLogin).toEqual(date);
});
