import { Request, Response } from "express";
import { IRequestSession } from "../IRequestSession";
import axios from "axios";
import {
  createEnvironmentConfiguration,
  createOAuthConfiguration,
} from "../../repositories/ServerConfigurationFactory";
import HttpStatusCodes from "../../repositories/HttpStatusCodeConfiguration";
import createTokenRequestData from "./CreateTokenRequest";
import { IEnvironmentConfiguration } from "../../repositories/IEnvironmentConfiguration";

const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

const handler = (request: Request, response: Response) => {
  console.info("retrieving token ...");

  const stateFromServer = readQueryState(request);

  const currentSessionStateValue = readSessionState(request);

  if (stateFromServer !== currentSessionStateValue) {
    redirectAndWarn(stateFromServer, currentSessionStateValue, response);
    return;
  }

  const environment = createEnvironmentConfiguration();

  const tokenRetrievalContext = createTokenRetrievalContext(
    environment,
    request.query.code as string
  );

  axios
    .post(
      tokenRetrievalContext.url,
      tokenRetrievalContext.data,
      tokenRetrievalContext.config
    )
    .then((result) => {
      const session = request.session as IRequestSession;

      // save token to session
      session.token = result.data.access_token;

      console.info("token retrieved successfully, redirecting to [vueApp] -", {
        vueApp: environment.FrontAppRootUrl,
      });

      //redirect to Vue app ==============================

      /**
       * idea: the token should be returned to the vue app
       * and the vue app should store it somewhere.
       */
      response.redirect(environment.FrontAppRootUrl);

      // =================================================
    })
    .catch((err) => {
      console.error("====================================");
      console.error("error retrieving token");
      console.error(err);
    });
};

function createTokenRetrievalContext(
  envConfiguration: IEnvironmentConfiguration,
  requestQueryCode: string
) {
  const data = createTokenRequestData(envConfiguration, requestQueryCode);

  const url = createTokenUrl();

  const context = { url, data, config };

  console.info("token retrieval context [url], [data], [config]", context);

  return context;
}

const createTokenUrl = () => {
  const oAuthConfiguration = createOAuthConfiguration();

  const url = oAuthConfiguration.tokenRoute();

  return url;
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
