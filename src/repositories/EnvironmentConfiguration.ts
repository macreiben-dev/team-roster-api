import { IEnvironmentConfiguration } from "./IEnvironmentConfiguration";

class EnvironmentConfiguration implements IEnvironmentConfiguration {
  private _serverName: string;
  private _port: string;

  private _clientId: string;
  private _clientSecret: string;
  private _redirectUri: string;
  private _applicationId: string;
  private _frontAppRootUrl: string;
  private _baseUrl: string;

  constructor() {
    this._serverName = process.env.FUSIONAUTH_SERVERNAME as string;
    this._port = process.env.FUSIONAUTH_PORT as string;
    this._clientId = process.env.CLIENT_ID as string;
    this._clientSecret = process.env.CLIENT_SECRET as string;
    this._redirectUri = process.env.REDIRECT_URI as string;
    this._applicationId = process.env.APPLICATION_ID as string;
    this._frontAppRootUrl = process.env.FRONT_APP_ROOT_URL as string;
    this._baseUrl = process.env.BASE_URL as string;
  }

  get OAuthServerName(): string {
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

  get baseUrl(): string {
    return this._baseUrl;
  }
}

export { EnvironmentConfiguration };
