import { ALL_WORKFLOW_SLUGS } from "@songbird/precedent-iso";
import { sql } from "slonik";
import { beforeEach, expect, test } from "vitest";

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

test("getAll does not create duplicate workflows child", async () => {
  const { user, child, workflowService } = await setup();

  await Promise.all(
    new Array(20).fill(undefined).map(() =>
      workflowService.getAll({
        userId: user.id,
        childId: child.id,
      })
    )
  );

  const workflows = await workflowService.getAll({
    userId: user.id,
    childId: child.id,
  });

  expect(Object.keys(workflows).length).toBe(ALL_WORKFLOW_SLUGS.length);
});

test("getAll does not overwrite workflows that exist", async () => {
  const { user, child, workflowService } = await setup();
  const onboarding = await workflowService.getBySlug({
    userId: user.id,
    childId: child.id,
    slug: "onboarding",
  });

  expect(onboarding.status).toEqual("pending");
  expect(onboarding.currentStageIndex).toEqual(0);

  await workflowService.getBySlug({
    userId: user.id,
    childId: child.id,
    slug: "onboarding",
  });

  const postUpdate = await workflowService.update({
    id: onboarding.id,
    stages: onboarding.stages,
    currentStageIndex: 1,
    status: "completed",
  });

  expect(postUpdate.status).toEqual("completed");
  expect(postUpdate.currentStageIndex).toEqual(1);

  await Promise.all(
    new Array(20).fill(undefined).map(() =>
      workflowService.getAll({
        userId: user.id,
        childId: child.id,
      })
    )
  );

  const postGetAll = await workflowService.getBySlug({
    userId: user.id,
    childId: child.id,
    slug: "onboarding",
  });

  expect(postGetAll.status).toEqual("completed");
  expect(postGetAll.currentStageIndex).toEqual(1);
});
