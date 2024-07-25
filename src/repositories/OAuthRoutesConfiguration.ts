import { IEnvironmentConfiguration } from "./IEnvironmentConfiguration";
import IOAuthRoutesConfiguration from "./IOAuthRoutesConfiguration";

class OAuthRoutesConfiguration implements IOAuthRoutesConfiguration {
  private _environmentConfig: IEnvironmentConfiguration;
  constructor(environmentConfiguration: IEnvironmentConfiguration) {
    this._environmentConfig = environmentConfiguration;
  }

  logoutUrl(): string {
    return `http://${this._environmentConfig.OAuthServerName}:${this._environmentConfig.Port}/oauth2/logout?client_id=${this._environmentConfig.ClientId}`;
  }

  authorizeUrl(stateValue: string): string {
    return `http://${this._environmentConfig.OAuthServerName}:${this._environmentConfig.Port}/oauth2/authorize?client_id=${this._environmentConfig.ClientId}&redirect_uri=${this._environmentConfig.RedirectUri}&response_type=code&state=${stateValue}`;
  }

  introspecRoute(): string {
    return `http://${this._environmentConfig.OAuthServerName}:${this._environmentConfig.Port}/oauth2/introspect`;
  }
}

export default OAuthRoutesConfiguration;
