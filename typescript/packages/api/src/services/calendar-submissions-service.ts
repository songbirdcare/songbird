import { DatabasePool, sql } from "slonik";
import { z } from "zod";

export class PsqlCalendarSubmissionsService
  implements CalendarSubmissionService
{
  constructor(private readonly pool: DatabasePool) {}

  async exists({ email }: ExistsArguments): Promise<boolean> {
    const lowered = email.toLowerCase();
    return this.pool.connect(async (connection) =>
      connection.exists(sql.type(ZExistsPayload)`
SELECT
    1
FROM
    calendar_submissions
WHERE
    LOWER(invitee_email) = ${lowered}
`)
    );
  }

  async insert({
    raw,
    eventCreatedAt,
    eventTypeName,
    eventTypeSlug,
    inviteeEmail,
  }: InsertPayload): Promise<void> {
    await this.pool.connect(async (connection) => {
      connection.query(sql.unsafe`
INSERT INTO calendar_submissions (raw, event_created_at, event_type_name, event_type_slug, invitee_email)
    VALUES (${JSON.stringify(
      raw
    )}, ${eventCreatedAt}, ${eventTypeName}, ${eventTypeSlug}, ${inviteeEmail})
`);
    });
  }
}

export interface CalendarSubmissionService {
  insert(payload: InsertPayload): Promise<void>;
  exists(args: ExistsArguments): Promise<boolean>;
}

export interface ExistsArguments {
  email: string;
}

const ZExistsPayload = z.object({
  exists: z.boolean(),
});

export interface InsertPayload {
  raw: Record<string, unknown>;
  eventCreatedAt: string;
  eventTypeName: string;
  eventTypeSlug: string;
  inviteeEmail: string;
}
