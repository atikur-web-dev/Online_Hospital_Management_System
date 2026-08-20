// Backend/server.ts

import "dotenv/config";

import app from "./src/app.js";

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`,
  );
  
});

// Handle server errors.
server.on("error", (error) => {
  console.error(" Server error:", error);
});

// Handle unexpected application errors.
process.on("uncaughtException", (error) => {
  console.error(" Uncaught Exception:", error);
});

// Handle rejected promises that were not caught.
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

// Detect unexpected process termination.
process.on("exit", (code) => {
  console.log(` Node process is exiting with code: ${code}`);
});