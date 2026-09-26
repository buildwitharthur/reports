import "dotenv/config";

import express from "express";

const app = express();

app.use(express.json());

const port = Number(process.env.PORT) || 3333;

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
  });
});

app.listen(port, () => {
  console.log(`HTTP server running on http://localhost:${port}`);
});
