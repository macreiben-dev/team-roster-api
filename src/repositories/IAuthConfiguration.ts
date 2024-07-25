interface IAuthConfiguration {
  get ServerName(): any;
  get Port(): any;
  get ClientId(): any;
  get ClientSecret(): any;
  get RedirectUri(): any;
  get ApplicationId(): any;
  get FrontAppRootUrl(): any;
  logoutUrl(): string;
  authorizeUrl(stateValue: string): string;
}

export { IAuthConfiguration };
