import { DatabasePool, sql } from "slonik";

export class PsqlCalendarSubmissionsService {
  constructor(private readonly pool: DatabasePool) {}

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
}

export interface InsertPayload {
  raw: Record<string, unknown>;
  eventCreatedAt: string;
  eventTypeName: string;
  eventTypeSlug: string;
  inviteeEmail: string;
}
