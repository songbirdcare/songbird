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

  "By the pricking of my thumbs, something wicked this way comes.",
  "Infirm of purpose!",
  "More is thy due than more than all can pay.",
  "I have bought golden opinions from all sorts of people.",
  "The attempt and not the deed confounds us.",
  "Out damned spot!",
  "Will all great Neptune's ocean wash this blood clean from my hand?",
  "",
  "The bell invites me. Hear it not, Duncan; for it is a knell that summons thee to heaven or to hell.",
  "There are daggers in men’s smiles.g",
  "There's no art to find the mind's construction in the face.",
  "That which hath made them drunk hath made me bold, what hath quenched them hath given me fire.",
  "Methought I heard a voice cry, ‘Sleep no more! Macbeth does murder sleep’g",
  "Look like th’ innocent flower, but be the serpent under ‘t.g",
  "It was the owl that shrieked, the fatal bellman, which gives the stern'st good-night.",
  "Double, double, toil and trouble, fire burn and cauldron bubbleg",
  "He died as one that had been studied in his death to throw away the dearest thing he owed, as 't were a careless trifle.",
  "Screw your courage to the sticking place.g",
  "All the perfumes of Arabia will not sweeten this little hand.g",
  "What's done cannot be undone.",
];

http
  .createServer((_, res) => {
    res.statusCode = 201;
    res.setHeader("Content-Type", "text/plain");

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
