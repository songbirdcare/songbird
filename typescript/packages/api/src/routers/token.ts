import express from "express";

export class TokenRouter {
  init() {
    const router = express.Router();

    router.get("/", async (req: express.Request, res: express.Response) => {
      const headers = req["headers"]["authorization"];
      res.json({ headers });
    });

    return router;
  }
}
