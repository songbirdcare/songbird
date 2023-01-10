import express from "express";
import { z } from "zod";

import type { CalendarSubmissionService } from "../services/calendar-submissions-service";

export class CalendarRouter {
  constructor(private readonly svc: CalendarSubmissionService) {}
  init() {
    const router = express.Router();

    router.post(
      "/event",
      async (req: express.Request, res: express.Response) => {
        const parsed = ZCalendarWebookPayload.parse(req.body);
        await this.svc.insert({
          raw: req.body,
          eventCreatedAt: parsed.event.created_at,
          eventTypeName: parsed.event_type.name,
          eventTypeSlug: parsed.event_type.slug,
          inviteeEmail: parsed.invitee.email,
        });

        res.send("ok");
      }
    );

    return router;
  }
}

export const ZCalendarEventType = z.object({
  duration: z.string(),
  kind: z.string(),
  name: z.string(),
  owner: z.object({
    type: z.string(),
    uuid: z.string(),
  }),
  slug: z.string(),
  uuid: z.string(),
});

export const ZCalendarInvitee = z.object({
  cancel_reason: z.string(),
  canceled: z.string(),
  canceled_at: z.string(),
  canceler_name: z.string(),
  created_at: z.string(),
  email: z.string(),
  first_name: z.string(),
  is_reschedule: z.string(),
  last_name: z.string(),
  name: z.string(),
  payments: z.string(),
  text_reminder_number: z.string(),
  timezone: z.string(),
  uuid: z.string(),
});

export const ZCalendarEvent = z.object({
  assigned_to: z.string(),
  cancel_reason: z.string(),
  canceled: z.string(),
  canceled_at: z.string(),
  canceler_name: z.string(),
  created_at: z.string(),
  end_time: z.string(),
  end_time_pretty: z.string(),
  extended_assigned_to: z.string(),
  invitee_end_time: z.string(),
  invitee_end_time_pretty: z.string(),
  invitee_start_time: z.string(),
  invitee_start_time_pretty: z.string(),
  location: z.string(),
  start_time: z.string(),
  start_time_pretty: z.string(),
  uuid: z.string(),
});

export const ZCalendarWebookPayload = z.object({
  event: ZCalendarEvent,
  event_type: ZCalendarEventType,
  invitee: ZCalendarInvitee,
});
