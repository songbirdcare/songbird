const username = encodeURIComponent("sb-writer");
const password = encodeURIComponent("baldeagleduckfishtoadmushroommousefood");

const socketPath = encodeURIComponent(
  "production-371018:us-central1:songbird-prod"
);
const dbName = encodeURIComponent("songbird");
const connectionUri = `socket://${username}:${password}@${socketPath}/${dbName}`;
console.log({
  run: connectionUri,
  job: `postgres://${username}:${password}@/${dbName}?socket=${socketPath}`,
});
