import * as http from "http";
import { SETTINGS } from "./settings";

const QUOTES = [
  "The lady protests to much, methinks.",
  "To be or not to be, that is the question.",
  "To thine own self be true.",
  "Though this be madness, yet there is method in ‘t.",
  "The play’s the thing…",
  "Brevity is the soul of wit.",
  "There are more things in Heaven and Earth, Horatio, than are dreamt of in your philosophy.",
  "Something is rotten in the state of Denmark.",
  "Alas, poor Yorick, I knew him Horatio.",
];

http
  .createServer((_, res) => {
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/plain");

    // #TODO deal w/ CORS later
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    res.end(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  })
  .listen(SETTINGS.port, SETTINGS.host, () => {
    console.log(`Server running at http://${SETTINGS.host}:${SETTINGS.port}/`);
  });
