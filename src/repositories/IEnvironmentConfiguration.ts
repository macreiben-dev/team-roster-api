interface IEnvironmentConfiguration {
  OAuthServerName: string;
  Port: string;
  ClientId: string;
  ClientSecret: string;
  RedirectUri: string;
  ApplicationId: string;
  FrontAppRootUrl: string;
  baseUrl: string;
}

export { IEnvironmentConfiguration };
