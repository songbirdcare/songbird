import * as http from "http";
import { HAMLET } from "@songbird/precedent-iso";

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((_, res) => {
  res.statusCode = 201;
  res.setHeader("Content-Type", "text/plain");
  res.end(HAMLET);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
