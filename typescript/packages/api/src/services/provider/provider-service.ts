import type { Provider } from "@songbird/precedent-iso";
import { DatabasePool, sql } from "slonik";
import { z } from "zod";

export class PsqlProviderService implements ProviderService {
  constructor(private readonly pool: DatabasePool) {}
  async getAll(): Promise<Provider[]> {
    const providers = await this.pool.connect(async (connection) =>
      connection.many(
        sql.type(ZFromSqlProvider)`
SELECT
    id,
    first_name,
    last_name
FROM
    providers
`
      )
    );
    return providers as Provider[];
  }
}

export interface ProviderService {
  getAll(): Promise<Provider[]>;
}

const ZFromSqlProvider = z
  .object({
    id: z.string(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
  })
  .transform((val) => ({
    id: val.id,
    firstName: val.first_name,
    lastName: val.last_name,
  }));
