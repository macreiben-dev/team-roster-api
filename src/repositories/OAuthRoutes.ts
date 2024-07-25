import { EnvironmentConfiguration } from "./EnvironmentConfiguration";
import ServerConfigurationFactory from "./ServerConfigurationFactory";

class OAuthRoutesConfiguration {
  private _environmentConfig: EnvironmentConfiguration;
  constructor(
    _environmentConfig = ServerConfigurationFactory.createEnvironmentConfiguration();
  );

  logoutUrl(): string {
    return `http://${this._serverName}:${this._port}/oauth2/logout?client_id=${this._clientId}`;
  }
  authorizeUrl(stateValue: string): string {
    return `http://${process.env.FUSIONAUTH_SERVERNAME}:${process.env.FUSIONAUTH_PORT}/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&state=${stateValue}`;
  }
}
