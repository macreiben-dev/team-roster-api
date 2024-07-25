import { IEnvironmentConfiguration } from "./IEnvironmentConfiguration";
import { EnvironmentConfiguration } from "./EnvironmentConfiguration";
import IOAuthRoutesConfiguration from "./IOAuthRoutesConfiguration";
import OAuthRoutesConfiguration from "./OAuthRoutesConfiguration";

const createEnvironmentConfiguration = (): IEnvironmentConfiguration => {
  return new EnvironmentConfiguration();
};

const createOAuthConfiguration = (): IOAuthRoutesConfiguration => {
  return new OAuthRoutesConfiguration(createEnvironmentConfiguration());
};

export { createEnvironmentConfiguration, createOAuthConfiguration };
