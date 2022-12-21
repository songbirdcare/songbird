import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { expressjwt } from "express-jwt";
import { expressJwtSecret } from "jwks-rsa";

import { UserInformationMiddleware } from "./middleware/user-information-middleware";
import { FormSubmissionRouter } from "./routers/form-submission";
import { HealthRouter } from "./routers/health";
import { TokenRouter } from "./routers/token";
import { UserRouter } from "./routers/user";
import { PsqlFormSubmissionService } from "./services/form-submission-service";
import { HealthService } from "./services/health-service";
import { PsqlUserService } from "./services/psql-user-service";
import { SETTINGS } from "./settings";
import { POOL } from "./sql";

console.log("Booting application");

const jwtCheck = expressjwt({
  secret: expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: SETTINGS.auth.jwksUri,
  }) as any,
  audience: SETTINGS.auth.audience,
  issuer: SETTINGS.auth.issuer,
  algorithms: ["RS256"],
});

async function start() {
  const app = express();

  const pool = await POOL;

  app.use(express.json());
  app.use(cors({ origin: "*" }));

  const userService = new PsqlUserService(pool);
  const healthService = new HealthService(pool);
  const formSubmissionService = new PsqlFormSubmissionService(pool);

  const healthRouter = new HealthRouter(healthService).init();
  const formSubmissionRouter = new FormSubmissionRouter(
    formSubmissionService
  ).init();

  app.use("/api/v1/health", healthRouter);
  app.use("/api/v1/form-submission", formSubmissionRouter);

  app.use(jwtCheck);

  app.use("/api/v1/token", new TokenRouter().init());

  const userInformationMiddleware = new UserInformationMiddleware(
    userService
  ).init();

  app.use(userInformationMiddleware);

  const userRouter = new UserRouter().init();

  app.use("/api/v1/users", userRouter);

  app.listen(SETTINGS.port, SETTINGS.host);
}

start();
