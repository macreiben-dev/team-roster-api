interface IEnvironmentConfiguration {
  OAuthServerName: string;
  Port: string;
  ClientId: string;
  ClientSecret: string;
  RedirectUri: string;
  ApplicationId: string;
  FrontAppRootUrl: string;
  issuerUrl: string;
  tenantId: string;
  apiKey: string;
}

export { IEnvironmentConfiguration };
