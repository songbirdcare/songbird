import type { Stage, WorkflowModel } from "@songbird/precedent-iso";
import { DatabasePool, DatabaseTransactionConnection, sql } from "slonik";
import { z } from "zod";

import { WorkflowEngineImpl } from "./workflow-engine";
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

  async getOrCreateInitial({
    userId,
    childId,
  }: GetOrCreateWorkflowOptions): Promise<WorkflowModel> {
    return this.pool.connect(async (connection) =>
      connection.transaction(async (trx) => {
        const workflow = fromSQL(
          await this.#getOrCreateSql(trx, { userId, childId })
        );
        const result = WorkflowEngineImpl.tryAdvanceWorkflow(workflow);
        if (!result.hasChanged) {
          return workflow;
        }
        const updated = await this.#update(trx, {
          id: workflow.id,
          currentStageIndex: result.workflow.currentStageIndex,
          stages: result.workflow.stages,
        });
        return fromSQL(updated);
      })
    );
  }

  async #getOrCreateSql(
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
    return trx.one(
      sql.type(ZWorkflowFromSql)`
UPDATE
    workflow
SET
    stages = ${JSON.stringify(stages)},
    current_stage_idx = ${currentStageIndex}
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
}: WorkflowFromSql): WorkflowModel {
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
  stages: Stage[];
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
