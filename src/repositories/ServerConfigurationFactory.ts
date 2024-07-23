import { IAuthConfiguration } from "./IAuthConfiguration";
import { OAuthConfiguration } from "./ServerConfiguration";

const createServerConfiguration = (): IAuthConfiguration => {
  return new OAuthConfiguration();
};

export default createServerConfiguration;
