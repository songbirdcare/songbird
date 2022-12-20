import express from "express";

export class UserRouter {
  init() {
    const router = express.Router();
    router.get("/", async (_: express.Request, res: express.Response) => {
      res.json({ status: "OK" });
    });

    return router;
  }
}
