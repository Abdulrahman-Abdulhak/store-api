import express from "express";
import dotenv from "dotenv";

import { poolHostDB } from "./db/index.js";
import { errorHandler, notFound } from "./middleware/index.js";

dotenv.config();
const app = express();
const port = parseInt(process.env.SERVER_PORT ?? 3000);

//* middlewares
app.use(express.json());

//* routes
app.use(notFound);
app.use(errorHandler);

try {
  const pool = await poolHostDB();
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
} catch (e) {
  console.error(e);
}
