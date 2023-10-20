import { RequestHandler } from "express";
import Logger from "./log";

export const attachLogger: RequestHandler = (req, res, next) => {
  // @ts-ignore
  req.logger = new Logger({
    endpoint_name: req.path,
    http_method: req.method,
  });
  // @ts-ignore

  req.logger.log("info", `Route: ${req.method} => ${req.path}`);
  next();
};
