import { LogLevel } from "typescript-logging";
import { CategoryProvider, Category } from "typescript-logging-category-style";

const provider = CategoryProvider.createProvider("Logger", {
  level: LogLevel.Debug,
});

export function getLogger(name: string): Category {
  return provider.getCategory(name);
}
