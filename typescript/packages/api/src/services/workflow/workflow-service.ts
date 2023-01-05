export interface WorkflowService {
  getOrCreate({
    userId,
    childId,
  }: GetOrCreateWorkflowOptions): Promise<Workflow>;
}

export interface GetOrCreateWorkflowOptions {
  userId: string;
  childId: string;
  slug: string;
}

interface Stage {
  stageName: string;
}

export interface Workflow {
  id: string;
  userId: string;
  childId: string;
  slug: string;
  version: string;
  stages: Stage[];
}
