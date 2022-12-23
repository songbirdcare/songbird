import express from "express";

export class UserRouter {
  init() {
    const router = express.Router();
    router.get("/me", async (req: express.Request, res: express.Response) => {
      res.json(req.user);
    });

    return router;
  }
}
