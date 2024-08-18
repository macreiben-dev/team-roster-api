interface IOAuthRoutesConfiguration {
  logoutUrl(): string;
  authorizeUrl(stateValue: string): string;
  introspecRoute(): string;
  registrationRoute(sub: string): string;
  tokenRoute(): string;
  jwksDiscorveryRoute(): string;
}
export default IOAuthRoutesConfiguration;
