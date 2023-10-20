import express from "express";

import env from "./env";
import { attachLogger } from "./helpers";
import Logger from "./log";

const app = express();

app.use(attachLogger);

app.get("/", (req, res) => {
  const logger = new Logger({ user_id: "1234" });
  const query = req.query;
  logger.log(`welcome`);

  // @ts-ignore
  req.logger.log(`info`, { query });

  res.send("Hello World!");
});

app.listen(env.port, async () => {
  console.log(`Example app listening on port ${env.port}`);
});
