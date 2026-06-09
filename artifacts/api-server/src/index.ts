import app from "./app";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// An uncaught exception leaves the process in an undefined state, so we must not
// keep serving traffic from it. Log the cause (the previous silent termination
// left no trace), stop accepting new connections, then exit so the supervisor can
// start a fresh process. A short timer guards against a hung drain.
process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
  server.close(() => process.exit(1));
  setTimeout(() => process.exit(1), 1000).unref();
});

// Unhandled rejections are less likely to corrupt process state; log them so a
// recurrence is always diagnosable instead of vanishing silently.
process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
});
