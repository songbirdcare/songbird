import { sql } from "slonik";
import { beforeEach, test } from "vitest";

import { PsqlChildService } from "../../services/child/psql-child-service";
import { PsqlUserService } from "../../services/psql-user-service";
import { PsqlWorkflowService } from "../../services/workflow/psql-workflow-service";
import { dataBasePool } from "../../sql";
import { TEST_SETTINGS } from "../test-settings";

async function setup() {
  const pool = await dataBasePool(TEST_SETTINGS.sqlUri);
  const userService = new PsqlUserService(pool);
  const childService = new PsqlChildService(pool);
  const workflowService = new PsqlWorkflowService(pool);

  const user = await userService.upsert({
    sub: "test",
    email: "test@gmail.com",
  });

  await childService.createIfNotExists(user.id, {
    type: "unknown",
  });

  const child = await childService.get(user.id);

  return {
    pool,
    user,
    child,
    workflowService,
  };
}

beforeEach(async () => {
  const { pool } = await setup();

  await pool.query(sql.unsafe`TRUNCATE TABLE sb_user, child, workflow CASCADE`);
});

test("TODO", async () => {
  //
});
