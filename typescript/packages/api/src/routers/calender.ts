import express from "express";

export class CalendarRouter {
  init() {
    const router = express.Router();

    router.post(
      "/event",
      async (req: express.Request, res: express.Response) => {
        console.log("Calendar event");
        console.log(req.body);

        res.send("ok");
      }
    );

    return router;
  }
}
