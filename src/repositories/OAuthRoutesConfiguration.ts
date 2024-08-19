import { IEnvironmentConfiguration } from "./IEnvironmentConfiguration";
import IOAuthRoutesConfiguration from "./IOAuthRoutesConfiguration";

class OAuthRoutesConfiguration implements IOAuthRoutesConfiguration {
  private _environmentConfig: IEnvironmentConfiguration;
  constructor(environmentConfiguration: IEnvironmentConfiguration) {
    this._environmentConfig = environmentConfiguration;
  }

  private serverName(): string {
    return `${this._environmentConfig.OAuthServerName}:${this._environmentConfig.Port}`;
  }

  private internalServerName(): string {
    return `${this._environmentConfig.OAuthInternalServerName}:${this._environmentConfig.Port}`;
  }

  logoutUrl(): string {
    return `http://${this.serverName()}/oauth2/logout?client_id=${
      this._environmentConfig.ClientId
    }`;
  }

  authorizeUrl(stateValue: string): string {
    return `http://${this.serverName()}/oauth2/authorize?client_id=${
      this._environmentConfig.ClientId
    }&redirect_uri=${
      this._environmentConfig.RedirectUri
    }&response_type=code&state=${stateValue}`;
  }

  introspecRoute(): string {
    return `http://${this.serverName()}/oauth2/introspect`;
  }

  registrationRoute(sub: string): string {
    return `http://${this.serverName()}/api/user/registration/${sub}/${
      this._environmentConfig.ApplicationId
    }`;
  }

  tokenRoute(): string {
    return `http://${this.internalServerName()}/oauth2/token`;
  }
}

export default OAuthRoutesConfiguration;
