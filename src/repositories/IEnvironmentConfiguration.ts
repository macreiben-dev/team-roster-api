interface IEnvironmentConfiguration {
  OAuthServerName: string;
  OAuthInternalServerName: string;
  Port: string;
  ClientId: string;
  ClientSecret: string;
  RedirectUri: string;
  ApplicationId: string;
  FrontAppRootUrl: string;
}

export { IEnvironmentConfiguration };
