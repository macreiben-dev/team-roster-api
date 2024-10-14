import { LogLevel } from "typescript-logging";
import { CategoryProvider, Category } from "typescript-logging-category-style";

let logLevel = LogLevel.Debug;

if (process.env.NODE_ENV === "production") {
  logLevel = LogLevel.Info;
}

const provider = CategoryProvider.createProvider("Logger", {
  level: logLevel,
});

export function getLogger(name: string): Category {
  return provider.getCategory(name);
}
