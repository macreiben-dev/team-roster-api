interface IOAuthRoutesConfiguration {
  logoutUrl(): string;
  authorizeUrl(stateValue: string): string;
  introspecRoute(): string;
}
export default IOAuthRoutesConfiguration;
