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

const logContext = { route: "oauth-callback" };

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
    redirectAndWarn(
      stateFromServer,
      currentSessionStateValue,
      response,
      logContext
    );
    return;
  }

  const environment = createEnvironmentConfiguration();

  const tokenRetrievalContext = createTokenRetrievalContext(
    environment,
    request.query.code as string,
    logContext
  );

  axios
    .post(
      tokenRetrievalContext.url,
      tokenRetrievalContext.data,
      tokenRetrievalContext.config
    )
    .then((result) => {
      const session = request.session as IRequestSession;

      const currentToken = result.data.access_token;

      // save token to session
      session.token = currentToken;

      const logContextRetrieval = {
        ...logContext,
        token: result.data.access_token,
        vueApp: environment.FrontAppRootUrl,
      };

      console.info(
        "token retrieved successfully, redirecting to application",
        logContextRetrieval
      );

      //redirect to Vue app ==============================

      /**
       * idea: the token should be returned to the vue app
       * and the vue app should store it somewhere.
       */
      response.cookie("app.at", currentToken);
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
  requestQueryCode: string,
  logContext: Record<string, any>
) {
  const data = createTokenRequestData(envConfiguration, requestQueryCode);

  const url = createTokenUrl();

  const context = { url, data, config };

  console.info("token retrieval context created", {
    ...logContext,
    url,
    client_id: data.client_id,
  });

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
  response: Response<any, Record<string, any>>,
  logContext: Record<string, any>
) => {
  const message = `State doesn't match. uh-oh. Saw: ${stateFromServer}, but expected: ${sessionStateValue}`;

  const currentLogContext = {
    ...logContext,
    message: message,
    stateFromServer: stateFromServer,
    sessionStateValue: sessionStateValue,
  };

  console.warn(message, currentLogContext);
  response.redirect(HttpStatusCodes.TEMPORARY_REDIRECT, "/");
};

export default handler;
