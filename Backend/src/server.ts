// Backend/src/server.ts

import "dotenv/config";

import app from "./app.js";

const PORT = Number(process.env.PORT) || 5000;

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle server errors
server.on("error", (error) => {
  console.error("Server error:", error);
});

// Handle unexpected application errors
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Handle rejected promises that were not caught
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

// Detect unexpected process termination
process.on("exit", (code) => {
  console.log(`Node process is exiting with code: ${code}`);
});