import { Request, Response } from "express";
import { IRequestSession } from "../IRequestSession";
import axios from "axios";
import createServerConfiguration from "../../repositories/ServerConfigurationFactory";
import createTokenRequest from "./CreateTokenRequest";

const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

const HTTPCODE_TEMPORARY_REDIRECT = 302;

const handler = async (request: Request, response: Response) => {
  const appConfig = createServerConfiguration();

  // Here we will receive the code such as:
  // http://localhost:9000/oauth-callback?code=SSXVv3xkNTKEhnY4XzjUVvRZp7eyhgCuuREAgSeByrw&locale=en&userState=Authenticated

  console.info("oauth-callback called");

  const url = `http://${process.env.FUSIONAUTH_SERVERNAME}:${process.env.FUSIONAUTH_PORT}/oauth2/token`;

  const stateFromServer = readQueryState(request);

  const sessionStateValue = readSessionState(request);

  if (stateFromServer !== sessionStateValue) {
    console.warn("State doesn't match. uh-oh.");
    console.warn(`Saw: ${stateFromServer}, but expected: ${sessionStateValue}`);
    response.redirect(HTTPCODE_TEMPORARY_REDIRECT, "/");
    return;
  }

  const data = createTokenRequest(appConfig, request.query.code as string);

  //post request to /token endpoint
  axios
    .post(url, data, config)
    .then((result) => {
      const session = request.session as IRequestSession;

      // save token to session
      session.token = result.data.access_token;

      //redirect to Vue app ==============================
      response.redirect(appConfig.FrontAppRootUrl());
      // =================================================
    })
    .catch((err) => {
      console.error(err);
    });
};

const readQueryState = (request: Request): string =>
  request.query.state as string;

const readSessionState = (request: Request): string => {
  const session = request.session as IRequestSession;
  const sessionStateValue = session.stateValue;
  return sessionStateValue as string;
};

export default handler;
