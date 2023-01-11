import type { Stage, WorkflowModel } from "@songbird/precedent-iso";
import { DatabasePool, DatabaseTransactionConnection, sql } from "slonik";
import { z } from "zod";

import {
  createInitialStages,
  CURRENT_VERSION,
  INITIAL_SLUG,
} from "./create-initial-workflow";
import type {
  GetOrCreateWorkflowArguments,
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

  async getOrCreateInitial(
    args: GetOrCreateWorkflowArguments
  ): Promise<WorkflowModel> {
    return this.pool.connect(async (cnx) =>
      cnx.transaction(async (trx) =>
        fromSQL(await this.#getOrCreateSql(trx, args))
      )
    );
  }

  async #getOrCreateSql(
    trx: DatabaseTransactionConnection,

    { userId, childId, slug }: GetOrCreateWorkflowArguments
  ): Promise<WorkflowFromSql> {
    const workflows = await trx.query(
      sql.type(ZWorkflowFromSql)`
SELECT
    ${FIELDS}
FROM
    workflow
WHERE
    sb_user_id = ${userId}
    AND child_id = ${childId}
    AND workflow_slug = ${slug}
`
    );

    const [workflow] = workflows.rows;

    if (workflow === undefined) {
      return trx.one(
        sql.type(ZWorkflowFromSql)`
INSERT INTO workflow (sb_user_id, child_id, workflow_slug, version, stages, current_stage_idx)
    VALUES (${userId}, ${childId}, ${slug}, ${CURRENT_VERSION}, ${JSON.stringify(
          createInitialStages()
        )}, 0)
RETURNING
    ${FIELDS}
`
      );
    } else if (workflows.rows.length > 1) {
      throw new Error(
        `Multiple workflows found for user=${userId} child=${childId} slug=${INITIAL_SLUG}`
      );
    }

    return workflow;
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
    console.log({ status });
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
  return {
    id,
    userId: sb_user_id,
    childId: child_id,
    slug: workflow_slug,
    version,
    stages,
    currentStageIndex: current_stage_idx,
    status,
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

const ZWorkflowFromSql = z.object({
  id: z.string(),
  sb_user_id: z.string(),
  child_id: z.string(),
  workflow_slug: z.string(),
  version: z.string(),
  stages: z.any(),
  current_stage_idx: z.number(),
  status: ZWorkflowStatus,
});
