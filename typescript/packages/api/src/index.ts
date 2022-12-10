import * as http from "http";
import { HAMLET } from "@songbird/precedent-iso";
import { SETTINGS } from "./settings";

http
  .createServer((_, res) => {
    res.statusCode = 201;
    res.setHeader("Content-Type", "text/plain");
    res.end(HAMLET);
  })
  .listen(SETTINGS.port, SETTINGS.host, () => {
    console.log(`Server running at http://${SETTINGS.host}:${SETTINGS.port}/`);
  });
