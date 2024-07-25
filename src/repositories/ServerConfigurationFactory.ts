import { IEnvironmentConfiguration } from "./IEnvironmentConfiguration";
import { EnvironmentConfiguration } from "./EnvironmentConfiguration";

const createEnvironmentConfiguration = (): IEnvironmentConfiguration => {
  return new EnvironmentConfiguration();
};

export default createEnvironmentConfiguration;
