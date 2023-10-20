import { Logging } from "@google-cloud/logging";
import { LogEntry, LogSeverity } from "@google-cloud/logging/build/src/entry";
import env from "./env";
// import { LogSeverity } from 'firebase-functions/logger';

export type LogLabels = {
  user_id?: string;
  endpoint_name?: string;
  http_method?: string;
};

export type LogParams = {
  message?: string | object | undefined | unknown;
  data?: string | object | undefined | unknown;
  labels?: LogLabels;
};

export type WriteLogParams = LogParams & {
  severity?: LogSeverity;
};
class Logger {
  private metadata: LogEntry = {};

  constructor(labels?: LogLabels) {
    this.metadata = {
      labels,
    };
  }

  private writeLog = ({ message, data, severity }: WriteLogParams) => {
    const logging = new Logging({
      keyFilename: env.keyFilename,
    });
    logging.setProjectId(env.projectId);
    const log = logging.log("default");
    // A json log entry with additional context
    const metadata: LogEntry = {
      severity: severity,
      ...this.metadata,
    };

    let messageData = message; // default to message if message is unknown

    if (message instanceof Error) {
      messageData = {
        message: message.message,
        stack: message.stack,
        ...(typeof data === "object" ? data : { data: data }),
      };
    } else {
      if (typeof message === "string") {
        messageData = message;
      } else if (typeof message === "object") {
        messageData = message;
      }

      if (typeof data === "string") {
        if (typeof messageData === "string") {
          messageData = `${messageData} ${data}`;
        } else if (typeof messageData === "object") {
          messageData = {
            ...messageData,
            data,
          };
        }
      } else if (typeof data === "object") {
        if (typeof messageData === "string") {
          messageData = {
            message: messageData + " " + JSON.stringify(data),
            ...data,
          };
        } else if (typeof messageData === "object") {
          messageData = {
            message: (messageData as any)?.message + " " + JSON.stringify(data),
            ...messageData,
            ...data,
          };
        }
      }
    }

    const entry = log.entry(metadata, messageData ?? "");
    log.write(entry);
  };

  public labels(labels: LogLabels) {
    this.metadata = {
      ...this.metadata,
      labels: {
        ...this.metadata.labels,
        ...labels,
      },
    };
    return this;
  }

  public getLabels() {
    return this.metadata.labels;
  }

  public warn = (
    message?: LogParams["message"],
    data?: LogParams["data"],
    labels?: LogParams["labels"]
  ) => this.writeLog({ message, data, labels, severity: "WARNING" });

  public error = (
    message?: LogParams["message"],
    data?: LogParams["data"],
    labels?: LogParams["labels"]
  ) => this.writeLog({ message, data, labels, severity: "ERROR" });

  public info = (
    message?: LogParams["message"],
    data?: LogParams["data"],
    labels?: LogParams["labels"]
  ) => this.writeLog({ message, data, labels, severity: "INFO" });

  public debug = (
    message?: LogParams["message"],
    data?: LogParams["data"],
    labels?: LogParams["labels"]
  ) => this.writeLog({ message, data, labels, severity: "DEBUG" });

  public log = (
    message?: LogParams["message"],
    data?: LogParams["data"],
    labels?: LogParams["labels"]
  ) => this.writeLog({ message, data, labels });
}

export default Logger;
