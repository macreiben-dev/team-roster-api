import { beforeEach, describe, expect, test } from "@jest/globals";
import { OAuthConfiguration } from "../../repositories/EnvironmentConfiguration";

describe("OAuthConfiguration", () => {
  const INITAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...INITAL_ENV };
  });

  describe("client informations", () => {
    test("should return the client id", () => {
      process.env.CLIENT_ID = "client_id";
      const oauthConfiguration = new OAuthConfiguration();
      expect(oauthConfiguration.ClientId).toBe("client_id");
    });

    test("should return the client secreit", () => {
      process.env.CLIENT_SECRET = "client_secret01";
      const oauthConfiguration = new OAuthConfiguration();
      expect(oauthConfiguration.ClientSecret).toBe("client_secret01");
    });
  });

  describe("Fusion auth informations", () => {
    test("should return the fusion auth server name", () => {
      process.env.FUSIONAUTH_SERVERNAME = "fusionauth_server";
      const oauthConfiguration = new OAuthConfiguration();
      expect(oauthConfiguration.ServerName).toBe("fusionauth_server");
    });

    test("should return the fusion auth port", () => {
      process.env.FUSIONAUTH_PORT = "8080";
      const oauthConfiguration = new OAuthConfiguration();
      expect(oauthConfiguration.Port).toBe("8080");
    });
  });

  describe("authentication informations", () => {
    test("should return the redirect uri", () => {
      process.env.REDIRECT_URI = "http://localhost:3000";
      const oauthConfiguration = new OAuthConfiguration();
      expect(oauthConfiguration.RedirectUri).toBe("http://localhost:3000");
    });

    test("should return the application id", () => {
      process.env.APPLICATION_ID = "application_id";
      const oauthConfiguration = new OAuthConfiguration();
      expect(oauthConfiguration.ApplicationId).toBe("application_id");
    });
  });
});
