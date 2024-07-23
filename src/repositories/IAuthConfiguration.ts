interface IAuthConfiguration {
  get Port(): any;
  get ClientId(): any;
  get ClientSecret(): any;
  get RedirectUri(): any;
  get ApplicationId(): any;
}

export { IAuthConfiguration };
