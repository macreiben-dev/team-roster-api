interface IOAuthRoutesConfiguration {
  logoutUrl(): string;
  authorizeUrl(stateValue: string): string;
  introspecRoute(): string;
  registrationRoute(sub: string): string;
}
export default IOAuthRoutesConfiguration;
