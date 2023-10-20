import { Logging } from "@google-cloud/logging";
import express from "express";
import env from "./env";

const port = 3000;

const app = express();

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  const logging = new Logging({
    keyFilename: env.keyFilename,
  });

  await logging.setProjectId(env.projectId);
  const log = logging.log("my-log");
  const entry = logging.entry({ resource: { type: "global" } });
  log.write(entry);

  console.log(`Example app listening on port ${port}`);
});
