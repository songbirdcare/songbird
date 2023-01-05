export interface Stage {
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
