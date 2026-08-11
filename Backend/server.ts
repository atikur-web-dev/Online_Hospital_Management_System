// Backend/server.ts

import "dotenv/config";

import app from "./src/app.js";

const PORT = Number(process.env.PORT) || 5000;

console.log("========================================");
console.log("Starting Hospital Management Backend...");
console.log("========================================");

console.log(
  "JWT_SECRET:",
  process.env.JWT_SECRET ? "FOUND" : "MISSING",
);

console.log(
  "Environment:",
  process.env.NODE_ENV || "development",
);

const server = app.listen(PORT, () => {
  console.log("----------------------------------------");
  console.log(
    `Server is running on http://localhost:${PORT}`,
  );
  console.log(
    `Health check: http://localhost:${PORT}/api/health`,
  );
  console.log("----------------------------------------");
});

/**
 * Handle server errors.
 */
server.on("error", (error) => {
  console.error("❌ Server error:", error);
});

/**
 * Handle unexpected application errors.
 */
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
});

/**
 * Handle rejected promises that were not caught.
 */
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});

/**
 * Detect unexpected process termination.
 */
process.on("exit", (code) => {
  console.log(`⚠️ Node process is exiting with code: ${code}`);
});