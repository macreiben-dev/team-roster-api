interface IAuthConfiguration {
  ServerName: string;
  Port: string;
  ClientId: string;
  ClientSecret: string;
  RedirectUri: string;
  ApplicationId: string;
  FrontAppRootUrl: string;
  logoutUrl(): string;
  authorizeUrl(stateValue: string): string;
}

export { IAuthConfiguration };
