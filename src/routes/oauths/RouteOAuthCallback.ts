import { Request, Response } from "express";
import { IRequestSession } from "../IRequestSession";
import axios from "axios";
import {
  createEnvironmentConfiguration,
  createOAuthConfiguration,
} from "../../repositories/ServerConfigurationFactory";
import HttpStatusCodes from "../../repositories/HttpStatusCodeConfiguration";

import createTokenRequest from "./CreateTokenRequest";

const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

const handler = (request: Request, response: Response) => {
  const appConfig = createEnvironmentConfiguration();

  const oAuthConfiguration = createOAuthConfiguration();

  console.info("retrieving token ...");

  const stateFromServer = readQueryState(request);

  const sessionStateValue = readSessionState(request);

  if (stateFromServer !== sessionStateValue) {
    redirectAndWarn(stateFromServer, sessionStateValue, response);
    return;
  }

  const data = createTokenRequest(appConfig, request.query.code as string);

  const url = oAuthConfiguration.tokenRoute();

  console.info("contacting token endpoint [url], [data] -", url, data);

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

const redirectAndWarn = (
  stateFromServer: string,
  sessionStateValue: string,
  response: Response<any, Record<string, any>>
) => {
  console.warn("State doesn't match. uh-oh.");
  console.warn(`Saw: ${stateFromServer}, but expected: ${sessionStateValue}`);
  response.redirect(HttpStatusCodes.TEMPORARY_REDIRECT, "/");
};

export default handler;
