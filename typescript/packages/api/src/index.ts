import * as dotenv from "dotenv";

dotenv.config();
import "./tracer"; // eslint-disable-line
import { SETTINGS } from "./settings";

import express from "express"; // eslint-disable-line
import "express-async-errors"; // eslint-disable-line

import cors from "cors";
import { expressjwt } from "express-jwt";
import { expressJwtSecret } from "jwks-rsa";

import { UserInformationMiddleware } from "./middleware/user-information-middleware";
import { FormSubmissionRouter } from "./routers/form-submission";
import { HealthRouter } from "./routers/health";
import { TokenRouter } from "./routers/token";
import { UserRouter } from "./routers/user";
import { Auth0Service } from "./services/auth0/auth0-service";
import { PsqlFormSubmissionService } from "./services/form/form-submissions-service";
import { HealthService } from "./services/health-service";
import { PsqlUserService } from "./services/psql-user-service";
import { dataBasePool } from "./sql";
import { errorLogger } from "./middleware/error-logger";
import { errorResponder } from "./middleware/error-responder";
import { invalidPathHandler } from "./middleware/invalid-path-handler";
import { WorkflowRouter } from "./routers/workflow";
import { PsqlChildService } from "./services/child/psql-child-service";
import { PsqlWorkflowService } from "./services/workflow/psql-workflow-service";
import { CalendarRouter } from "./routers/calender";
import { SignatureRouter } from "./routers/signature";
import { PsqlCalendarSubmissionsService } from "./services/calendar-submissions-service";

import { PsqlSignatureSubmissionService } from "./services/signature-submission-service";
import { WorkflowActionService } from "./services/workflow/workflow-action-service";
import { AdminUserRouter } from "./routers/admin-user";
//import pino from "pino-http";
import { LOGGER } from "./logger";
import { DeviceTrackingMiddleware } from "./middleware/device-tracking-middleware";
import { ChildRouter } from "./routers/child";
import { PsqlProviderService } from "./services/provider/provider-service";
import { Auth0Router } from "./routers/auth0-router";

LOGGER.info("Server starting ...");

const jwtCheck = expressjwt({
  secret: expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: SETTINGS.auth.jwksUri,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any,
  audience: SETTINGS.auth.audience,
  issuer: SETTINGS.auth.issuer,
  algorithms: ["RS256"],
});

async function start() {
  const app = express();
  app.enable("trust proxy");

  const pool = await dataBasePool(SETTINGS.sql.uri);

  LOGGER.info({ test: 1 }, "info test");
  LOGGER.warn({ test: 1 }, "warning test");
  LOGGER.error({ test: 1 }, "error test");

  app.use(DeviceTrackingMiddleware.setMiddleware);

  app.use(
    express.json({
      verify: function (req, _, buf) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).rawBody = buf;
      },
    })
  );
  app.use(cors({ origin: "*" }));

  const healthService = new HealthService(pool);
  const formSubmissionService = new PsqlFormSubmissionService(pool);

  const auth0Service = new Auth0Service(
    SETTINGS.auth.issuerBaseUrl,
    SETTINGS.auth.machineSecret,
    SETTINGS.auth.machineClientId,
    SETTINGS.auth.machineAudience,
    SETTINGS.auth.domain
  );

  const userService = new PsqlUserService(pool);
  const calendarService = new PsqlCalendarSubmissionsService(pool);
  const signatureSubmissionService = new PsqlSignatureSubmissionService(pool);

  const providerService = new PsqlProviderService(pool);

  const childService = new PsqlChildService(pool);
  const workflowService = new PsqlWorkflowService(pool);
  const workflowActionService = new WorkflowActionService(
    calendarService,
    userService,
    workflowService,
    signatureSubmissionService,
    childService
  );

  const healthRouter = new HealthRouter(healthService).init();
  const formSubmissionRouter = new FormSubmissionRouter(
    formSubmissionService
  ).init();

  const auth0Router = new Auth0Router(userService).init();

  app.use("/api/v1/health", healthRouter);
  app.use("/api/v1/form-submission", formSubmissionRouter);
  app.use("/api/v1/auth0", auth0Router);

  const userInformationMiddleware = new UserInformationMiddleware(
    userService,
    childService,
    auth0Service,
    formSubmissionService
  );

  const userIsVerified = userInformationMiddleware.ensureUserVerified();
  const ensureIsAdmin = userInformationMiddleware.ensureAdmin();
  const addUser = userInformationMiddleware.addUser();

  app.use(
    "/api/v1/users",
    jwtCheck,
    addUser,
    new UserRouter(auth0Service).init()
  );
  app.use(
    "/api/v1/token",
    jwtCheck,
    addUser,
    userIsVerified,
    new TokenRouter().init()
  );

  app.use(
    "/api/v1/workflows",
    jwtCheck,
    addUser,
    userIsVerified,
    new WorkflowRouter(
      childService,
      workflowService,
      workflowActionService
    ).init()
  );

  app.use(
    "/api/v1/child",
    jwtCheck,
    addUser,
    userIsVerified,
    new ChildRouter(childService).init()
  );

  app.use(
    "/api/v1/admin",
    jwtCheck,
    addUser,
    userIsVerified,
    ensureIsAdmin,
    new AdminUserRouter(
      userService,
      providerService,
      workflowService,
      childService
    ).init()
  );

  app.use("/api/v1/calendar", new CalendarRouter(calendarService).init());

  app.use(
    "/api/v1/signature",
    new SignatureRouter(signatureSubmissionService).init()
  );

  app.use(errorLogger);
  app.use(errorResponder);
  app.use(invalidPathHandler);

  app.listen(SETTINGS.port, SETTINGS.host);
}

start();
