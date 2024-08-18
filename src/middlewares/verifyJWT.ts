import { readToken } from "../lib/tokenUtil";

import { Request, Response, NextFunction } from "express";

import {
  createEnvironmentConfiguration,
  createOAuthConfiguration,
} from "../repositories/ServerConfigurationFactory";
import { IEnvironmentConfiguration } from "../repositories/IEnvironmentConfiguration";

// import { JOSEError } from "jose/dist/types/util/errors";
// import jose from "jose";
const jose = require("jose");

const logContext = { middleware: "verifyJWT" };

const ROUTE_LOGIN = "/login";
const ROUTE_CALLBACK = "/oauth-callback";

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const currentLogContext = { ...logContext, originalUrl: req.originalUrl };

  const config = createEnvironmentConfiguration();

  const queryString = req.originalUrl;

  // --------------------------------------------

  if (queryString == ROUTE_LOGIN) {
    console.info(
      `Skipping token verification for "${ROUTE_LOGIN}" route`,
      currentLogContext
    );
    next();

    return;
  }

  if (queryString.startsWith(ROUTE_CALLBACK)) {
    console.info(
      `Skipping token verification for "${ROUTE_CALLBACK}" route`,
      currentLogContext
    );
    next();

    return;
  }

  // --------------------------------------------

  const currentToken = readToken(req);

  if (!currentToken) {
    send401AndMessage(res, currentLogContext);

    return;
  }

  try {
    await verifyToken(currentToken, config);

    req.verifiedToken = currentToken;

    next();
  } catch (e) {
    // if (e instanceof JOSEError) {
    //   send401AndAddError(res, e);
    //   return;
    // }
    send500AndError(e, res, logContext);
  }
};
const jwksClient = (): any => {
  const discoveryRoute = createOAuthConfiguration().jwksDiscorveryRoute();
  const currentLogContext = {
    ...logContext,
    function: "jwksClient",
    discoveryRoute,
  };

  try {
    const discoveryURL = new URL(discoveryRoute);
    const remoteJWKSet = jose.createRemoteJWKSet(discoveryURL);

    console.info("Created remote JWK set", currentLogContext);

    return remoteJWKSet;
  } catch (e) {
    throw e;
  }
};

const verifyToken = async (
  access_token: string,
  environmentConfiguration: IEnvironmentConfiguration
) => {
  const configuration = {
    issuer: environmentConfiguration.issuerUrl,
    audience: environmentConfiguration.ClientId,
  };

  const jwksClientInstance = jwksClient();

  const _ = await jose.jwtVerify(
    access_token,
    jwksClientInstance,
    configuration
  );
};
function send500AndError(
  e: unknown,
  res: Response<any, Record<string, any>>,
  logContext: Record<string, any>
) {
  const message = `Internal server error: ${e}`;

  const contextPayload = { ...logContext, error: message };

  console.error(message, contextPayload);
  res.status(500);
  res.send(contextPayload);
}

function send401AndAddError(res: Response<any, Record<string, any>>, e: any) {
  res.status(401);
  res.send({ error: e.message, code: e.code });
}

function send401AndMessage(
  res: Response<any, Record<string, any>>,
  logContext: Record<string, any>
) {
  const message = "Missing token cookie and Authorization header";
  const contextPayload = { ...logContext, error: message };
  console.info(message, contextPayload);
  res.status(401);
  res.send(contextPayload);
}

export default verifyJWT;
