import Logger from "./src/log";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      logger: Logger;
    }
  }
}
