import express from "express";
import dotenv from "dotenv";

import { poolHostDB, testConnectionDB } from "./db/index.js";
import { errorHandler, notFound } from "./middleware/index.js";
import { productsRouter } from "./routes/index.js";

dotenv.config();
const app = express();

//* roots
app.get("/", (req, res, next) => {
  return res
    .status(200)
    .send("Correct, Go to <a href='/api/v1/products'>Products</a>");
});

//* middlewares
//* routes
app.use(express.json());

app.use("/api/v1/products", productsRouter);
app.use(notFound);
app.use(errorHandler);

const port = parseInt(process.env.SERVER_PORT ?? 3000);

try {
  const pool = await poolHostDB();
  console.log(await testConnectionDB());

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
} catch (e) {
  console.error(e);
}
