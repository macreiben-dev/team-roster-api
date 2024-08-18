import { beforeEach, describe, expect, test } from "@jest/globals";
import {
  data,
  originalEmail,
  originalUsername,
} from "./standards/StandardUserFromApi";
import {
  ConnectedUser,
  UserFromApiNullError,
} from "../../../models/authentications/ConnectedUser";

describe("ConnectedUser", () => {
  let responseFromApi = {};
  beforeEach(() => {
    responseFromApi = data;
  });
  test("should map the user mail", () => {
    const target = new ConnectedUser(responseFromApi);

    expect(target.email).toBe(originalEmail);
  });
  test("should map the user name", () => {
    const target = new ConnectedUser(responseFromApi);

    expect(target.userName).toBe(originalUsername);
  });

  describe("should fail ", () => {
    test("when user from api is undefined", () => {
      expect(() => new ConnectedUser(undefined)).toThrowError(
        UserFromApiNullError
      );
    });
  });
  describe("should generate json", () => {
    test("should generate json with email and username", () => {
      const target = new ConnectedUser(responseFromApi);

      expect(target.toJson()).toStrictEqual({
        email: originalEmail,
        userName: originalUsername,
      });
    });
  });
});
