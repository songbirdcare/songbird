import express from "express";

import type { FormSubmissionService } from "../services/form-submission-service";

export class FormSubmissionRouter {
  constructor(private readonly svc: FormSubmissionService) {}

  init() {
    const router = express.Router();

    router.post(
      "/callback",
      async (req: express.Request, res: express.Response) => {
        const body = req.body;
        try {
          await this.svc.insert({ raw: body });

          res.json({ status: "OK" });
        } catch (e: any) {
          console.error(e);
          res.status(400).json({ status: "ERROR", message: e.message });
          res.end();
        }
      }
    );

    return router;
  }
}
