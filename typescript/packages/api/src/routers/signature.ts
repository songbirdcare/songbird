import express from "express";

export class SignatureRouter {
  init() {
    const router = express.Router();

    router.post(
      "/event",
      async (req: express.Request, res: express.Response) => {
        console.log("Signature event");
        console.log(req.body);

        res.send("ok");
      }
    );

    return router;
  }
}
