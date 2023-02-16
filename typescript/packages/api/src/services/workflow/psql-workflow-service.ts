import {
  ALL_WORKFLOW_SLUGS,
  assertNever,
  Stage,
  StagesWithSlug,
  WorkflowModel,
  WorkflowSlug,
  ZCarePlanStage,
  ZCareTeamStage,
  ZOnboardingStage,
  ZWorkflowSlug,
} from "@songbird/precedent-iso";
import { DatabasePool, DatabaseTransactionConnection, sql } from "slonik";
import { z } from "zod";

import {
  CreateInitialWorkflow,
  CURRENT_VERSION,
} from "./create-initial-workflow";
import type {
  GetAllArguments,
  GetBySlugArguments,
  WorkflowService,
} from "./workflow-service";

const FIELDS = sql.fragment`
id,
sb_user_id,
child_id,
workflow_slug,
version,
stages,
current_stage_idx,
status
`;
export class PsqlWorkflowService implements WorkflowService {
  constructor(private readonly pool: DatabasePool) {}

  async deleteAllForUser(userId: string): Promise<void> {
    await this.pool.connect(async (cnx) =>
      cnx.query(sql.unsafe`DELETE FROM workflow where sb_user_id = ${userId}`)
    );
  }

  async getById(id: string): Promise<WorkflowModel> {
    return this.pool.connect(async (cnx) => {
      const workflow = await cnx.one(
        sql.type(ZWorkflowFromSql)`
SELECT
    ${FIELDS}
FROM
    workflow
WHERE
    id = ${id}
`
      );

      return fromSQL(workflow);
    });
  }

  getBySlug = async (args: GetBySlugArguments): Promise<WorkflowModel> => {
    const all = await this.getAll(args);
    return all[args.slug];
  };

  async getAll(
    args: GetAllArguments
  ): Promise<Record<WorkflowSlug, WorkflowModel>> {
    return this.pool.connect(async (cnx) =>
      cnx.transaction((trx) => this.#getAll(trx, args))
    );
  }

  async #getAll(
    trx: DatabaseTransactionConnection,
    { userId, childId }: GetAllArguments
  ): Promise<Record<WorkflowSlug, WorkflowModel>> {
    const slugResponse = await trx.query(
      sql.type(ZWorkflowSlugFromSql)`
SELECT
    workflow_slug
FROM
    workflow
WHERE
    sb_user_id = ${userId}
    AND child_id = ${childId}
`
    );

    const missing = Array.from(
      slugResponse.rows.reduce((acc, row) => {
        acc.delete(row.workflow_slug);
        return acc;
      }, new Set(ALL_WORKFLOW_SLUGS))
    );

    if (missing.length) {
      await trx.query(
        sql.type(ZWorkflowFromSql)`

INSERT INTO workflow (sb_user_id, child_id, workflow_slug, version, stages, current_stage_idx)
SELECT
    *
FROM
    ${sql.unnest(
      missing.map((slug) => [
        userId,
        childId,
        slug,
        CURRENT_VERSION,
        JSON.stringify(CreateInitialWorkflow.forSlug(slug)),
        0,
      ]),
      ["uuid", "uuid", "text", "int4", "jsonb", "int4"]
    )}
ON CONFLICT (sb_user_id,
    child_id,
    workflow_slug)
    DO NOTHING;

`
      );
    }

    const workflows = await trx.query(
      sql.type(ZWorkflowFromSql)`
SELECT
    ${FIELDS}
FROM
    workflow
WHERE
    sb_user_id = ${userId}
    AND child_id = ${childId}
`
    );

    const acc: Partial<Record<WorkflowSlug, WorkflowModel>> = {};

    for (const workflow of workflows.rows) {
      acc[workflow.workflow_slug] = fromSQL(workflow);
    }
    return acc as Record<WorkflowSlug, WorkflowModel>;
  }

  update = async (args: UpdateWorkflow): Promise<WorkflowModel> => {
    const response = await this.pool.connect(async (connection) =>
      connection.transaction(async (trx) => this.#update(trx, args))
    );

    return fromSQL(response);
  };

  async #update(
    trx: DatabaseTransactionConnection,

    { id, stages, currentStageIndex, status }: UpdateWorkflow
  ): Promise<WorkflowFromSql> {
    return trx.one(
      sql.type(ZWorkflowFromSql)`
UPDATE
    workflow
SET
    stages = ${JSON.stringify(stages)},
    current_stage_idx = ${currentStageIndex},
    status = ${status}
WHERE
    id = ${id}
RETURNING
    ${FIELDS}
`
    );
  }
}

function fromSQL({
  id,
  sb_user_id,
  child_id,
  workflow_slug,
  version,
  stages,
  current_stage_idx,
  status,
}: WorkflowFromSql): WorkflowModel {
  const stagesWithSlug = (): StagesWithSlug => {
    switch (workflow_slug) {
      case "onboarding":
        return {
          slug: "onboarding",
          stages: ZOnboardingStage.array().parse(stages),
        };
      case "care_plan":
        return {
          slug: "care_plan",
          stages: ZCarePlanStage.array().parse(stages),
        };
      case "care_team":
        return {
          slug: "care_team",
          stages: ZCareTeamStage.array().parse(stages),
        };
      default:
        assertNever(workflow_slug);
    }
  };

  return {
    id,
    userId: sb_user_id,
    childId: child_id,
    slug: workflow_slug,
    version,
    stages,
    currentStageIndex: current_stage_idx,
    status,
    stagesWithSlug: stagesWithSlug(),
  };
}

export type WorkflowFromSql = z.infer<typeof ZWorkflowFromSql>;

interface UpdateWorkflow {
  id: string;
  stages: Stage[];
  currentStageIndex: number;
  status: WorkflowStatus;
}

export type WorkflowStatus = z.infer<typeof ZWorkflowStatus>;

const ZWorkflowStatus = z.union([z.literal("pending"), z.literal("completed")]);

const ZWorkflowSlugFromSql = z.object({
  workflow_slug: ZWorkflowSlug,
});

const ZWorkflowFromSql = z.object({
  id: z.string(),
  sb_user_id: z.string(),
  child_id: z.string(),
  workflow_slug: ZWorkflowSlug,
  version: z.literal(1),
  stages: z.any(),
  current_stage_idx: z.number(),
  status: ZWorkflowStatus,
});
