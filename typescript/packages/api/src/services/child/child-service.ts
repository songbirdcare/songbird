export interface ChildService {
  getOrCreate(userId: string): Promise<Child>;
}

export interface Child {
  id: string;
  //qualificationStatus: "not_qualified" | "qualified";
}
