import { Request, Response } from "express";
import { IRequestSession } from "../IRequestSession";
import axios from "axios";
import { createEnvironmentConfiguration } from "../../repositories/ServerConfigurationFactory";
import createTokenRequest from "./CreateTokenRequest";

const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

const HTTPCODE_TEMPORARY_REDIRECT = 302;

const handler = (request: Request, response: Response) => {
  const appConfig = createEnvironmentConfiguration();

  console.info("retrieving token ...");

  const url = `http://${process.env.FUSIONAUTH_SERVERNAME_FOR_TOKEN}:${process.env.FUSIONAUTH_PORT}/oauth2/token`;

  const stateFromServer = readQueryState(request);

  const sessionStateValue = readSessionState(request);

  if (stateFromServer !== sessionStateValue) {
    console.warn("State doesn't match. uh-oh.");
    console.warn(`Saw: ${stateFromServer}, but expected: ${sessionStateValue}`);
    response.redirect(HTTPCODE_TEMPORARY_REDIRECT, "/");
    return;
  }

  const data = createTokenRequest(appConfig, request.query.code as string);

  console.info("contacting token endpoint [url], [data]", url, data);

  //post request to /token endpoint
  axios
    .post(url, data, config)
    .then((result) => {
      const session = request.session as IRequestSession;

      // save token to session
      session.token = result.data.access_token;

      console.info("token retrieved successfully");

      //redirect to Vue app ==============================
      response.redirect(appConfig.FrontAppRootUrl);
      // =================================================
    })
    .catch((err) => {
      console.error("====================================");
      console.error("error retrieving token");
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
