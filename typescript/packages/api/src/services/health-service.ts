import { DatabasePool, sql } from "slonik";

export class HealthService {
  constructor(private readonly pool: DatabasePool) {}
  public async pingSql(): Promise<string> {
    const [row] = (await this.pool.query(sql.unsafe`SELECT 1 as data`)).rows;
    return String(row.data);
  }
}
