// Backend/server.ts
import "dotenv/config";

import app from "./src/app.js";

console.log("JWT_SECRET =", process.env.JWT_SECRET);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});