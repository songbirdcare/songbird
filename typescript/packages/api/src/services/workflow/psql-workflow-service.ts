import type { Stage, Workflow } from "@songbird/precedent-iso";
import { DatabasePool, sql, DatabaseTransactionConnection } from "slonik";
import type { S } from "vitest/dist/types-bae746aa";
import { z } from "zod";

import type {
  GetOrCreateWorkflowOptions,
  WorkflowService,
} from "./workflow-service";

const FIELDS = sql.fragment`
id,
sb_user_id,
child_id,
workflow_slug,
version,
stages,
current_stage_idx
`;
const CURRENT_VERSION = 1 as const;
const INITIAL_SLUG = "onboarding";
const INITIAL_STAGES: Stage[] = [
  {
    type: "create_account",
    blockingTasks: [],
  },
  {
    type: "check_insurance_coverage",
    blockingTasks: [
      {
        type: "form_blocking",
        formId: "hi",
      },
    ],
  },
  {
    type: "submit_records",
    blockingTasks: [
      {
        type: "form_blocking",
        formId: "bye",
      },
    ],
  },
  {
    type: "commitment_to_care",
    blockingTasks: [
      {
        type: "signature",
      },
    ],
  },
];

export class PsqWorkflowService implements WorkflowService {
  constructor(private readonly pool: DatabasePool) {}

  //async getAndTryToAdvanced({userId, childId}: GetOrCreateWorkflowOptions) {

  //const workflow =
  //}

  async getOrCreateInitial({
    userId,
    childId,
  }: GetOrCreateWorkflowOptions): Promise<Workflow> {
    const workflow = await this.pool.connect(async (connection) =>
      connection.transaction(async (trx) => {
        const workflow = await this.#getOrCreate(trx, { userId, childId });
      })
    );

    return fromSQL(workflow);
  }

  async #getOrCreate(
    trx: DatabaseTransactionConnection,

    { userId, childId }: GetOrCreateWorkflowOptions
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
    AND workflow_slug = ${INITIAL_SLUG}
`
    );

    const [workflow] = workflows.rows;

    if (workflow === undefined) {
      return trx.one(
        sql.type(ZWorkflowFromSql)`
INSERT INTO workflow (sb_user_id, child_id, workflow_slug, version, stages, current_stage_idx)
    VALUES (${userId}, ${childId}, ${INITIAL_SLUG}, ${CURRENT_VERSION}, ${JSON.stringify(
          INITIAL_STAGES
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

  async #update(
    trx: DatabaseTransactionConnection,

    { id, stages, currentStageIndex }: UpdateWorkflow
  ): Promise<WorkflowFromSql> {
    const workflows = await trx.one(
      sql.type(ZWorkflowFromSql)`
UPDATE
stages=${stages}, current_stage_idx=${currentStageIndex}
FROM workflow
WHERE
id =${id}
RETURNING ${FIELDS}
`
    );

    return workflows;
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
}: WorkflowFromSql): Workflow {
  console.log({ stages });
  return {
    id,
    userId: sb_user_id,
    childId: child_id,
    slug: workflow_slug,
    version,
    stages,
    currentStageIndex: current_stage_idx,
  };
}

export type WorkflowFromSql = z.infer<typeof ZWorkflowFromSql>;

interface UpdateWorkflow {
  id: string;
  stages: Stages[];
  currentStageIndex: number;
}

const ZWorkflowFromSql = z.object({
  id: z.string(),
  sb_user_id: z.string(),
  child_id: z.string(),
  workflow_slug: z.string(),
  version: z.string(),
  stages: z.any(),
  current_stage_idx: z.number(),
});
