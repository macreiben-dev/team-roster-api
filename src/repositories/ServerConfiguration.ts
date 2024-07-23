import { IAuthConfiguration } from "./IAuthConfiguration";

class OAuthConfiguration implements IAuthConfiguration {
  get OAuthServerName() {
    return process.env.FUSIONAUTH_SERVERNAME;
  }

  get Port(): any {
    return process.env.FUSIONAUTH_PORT;
  }

  get ClientId(): any {
    return process.env.CLIENT_ID;
  }

  get ClientSecret(): any {
    return process.env.CLIENT_SECRET;
  }

  get RedirectUri(): any {
    return process.env.REDIRECT_URI;
  }

  get ApplicationId(): any {
    return process.env.APPLICATION_ID;
  }
}

export { OAuthConfiguration };
