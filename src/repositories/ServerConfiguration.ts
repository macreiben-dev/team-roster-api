import { IAuthConfiguration } from "./IAuthConfiguration";

class OAuthConfiguration implements IAuthConfiguration {
  private _serverName: string;
  private _port: string;

  private _clientId: string;
  private _clientSecret: string;
  private _redirectUri: string;
  private _applicationId: string;
  private _frontAppRootUrl: string;

  constructor() {
    this._serverName = process.env.FUSIONAUTH_SERVERNAME as string;
    this._port = process.env.FUSIONAUTH_PORT as string;
    this._clientId = process.env.CLIENT_ID as string;
    this._clientSecret = process.env.CLIENT_SECRET as string;
    this._redirectUri = process.env.REDIRECT_URI as string;
    this._applicationId = process.env.APPLICATION_ID as string;
    this._frontAppRootUrl = process.env.FRONT_APP_ROOT_URL as string;
  }

  get ServerName() {
    return this._serverName;
  }

  get Port(): string {
    return this._port;
  }

  get ClientId(): string {
    return this._clientId;
  }

  get ClientSecret(): string {
    return this._clientSecret;
  }

  get RedirectUri(): string {
    return this._redirectUri;
  }

  get ApplicationId(): string {
    return this._applicationId;
  }

  get FrontAppRootUrl(): string {
    return this._frontAppRootUrl;
  }

  logoutUrl(): string {
    return `http://${this.ServerName}:${this.Port}/oauth2/logout?client_id=${this.ClientId}`;
  }
  authorizeUrl(stateValue: string): string {
    return `http://${process.env.FUSIONAUTH_SERVERNAME}:${process.env.FUSIONAUTH_PORT}/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&state=${stateValue}`;
  }
}

export { OAuthConfiguration };
