import { DatabasePool, sql } from "slonik";
import { z } from "zod";

import type {
  GetOrCreateWorkflowOptions,
  Workflow,
  WorkflowService,
} from "./workflow-service";

const CURRENT_VERSION = 1 as const;
export class PsqWorkflowService implements WorkflowService {
  constructor(private readonly pool: DatabasePool) {}

  async getOrCreate({
    userId,
    childId,
    slug,
  }: GetOrCreateWorkflowOptions): Promise<Workflow> {
    const workflow = await this.pool.connect(async (connection) => {
      const workflows = await connection.many(
        sql.type(ZWorkflowFromSql)`
SELECT
    id,
    sb_user_id,
    child_id,
    workflow_slug,
    version,
    stages
FROM
    workflow
WHERE
    sb_user_id = ${userId}
    AND child_id = ${childId}
    AND workflow_slug = ${slug}
`
      );

      const [workflow] = workflows;

      if (workflow === undefined) {
        return connection.one(
          sql.type(ZWorkflowFromSql)`
INSERT INTO workflow (sb_user_id, child_id, workflow_slug, version, stages)
    VALUES (${userId}, ${childId}, ${slug}, ${CURRENT_VERSION}, '{}')
RETURNING
    id, sb_user_id, child_id, workflow_slug, version, stages
`
        );
      } else if (workflows.length > 1) {
        throw new Error(
          `Multiple workflows found for user=${userId} child=${childId} slug=${slug}`
        );
      }

      return workflow;
    });

    return fromSQL(workflow);
  }
}

function fromSQL({
  id,
  sb_user_id,
  child_id,
  workflow_slug,
  version,
  stages,
}: WorkflowFromSql): Workflow {
  return {
    id,
    userId: sb_user_id,
    childId: child_id,
    slug: workflow_slug,
    version,
    stages: JSON.parse(stages),
  };
}

export type WorkflowFromSql = z.infer<typeof ZWorkflowFromSql>;

const ZWorkflowFromSql = z.object({
  id: z.string(),
  sb_user_id: z.string(),
  child_id: z.string(),
  workflow_slug: z.string(),
  version: z.string(),
  stages: z.string(),
});
