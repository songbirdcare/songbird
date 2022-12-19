const username = encodeURIComponent("<TODO>");
const password = encodeURIComponent("<TODO>");
// example
//
("/cloudsql/proud-amphora-371018:us-central1:songbird-first");
const socketPath = encodeURIComponent("<TODO>");
const dbName = encodeURIComponent("<TODO>");
const connectionUri = `socket://${username}:${password}@${socketPath}/${dbName}`;
console.log({
  run: connectionUri,
  job: `postgres://${username}:${password}@/${dbName}?socket=${socketPath}`,
});
