import { Request, Response, NextFunction } from "express";
import jose from "jose";
import {
  createEnvironmentConfiguration,
  createOAuthConfiguration,
} from "../repositories/ServerConfigurationFactory";
import { IEnvironmentConfiguration } from "../repositories/IEnvironmentConfiguration";
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
    verifyToken(currentToken, config);

    req.verifiedToken = currentToken;

    next();
  } catch (e) {
    if (e instanceof jose.errors.JOSEError) {
      send401AndAddError(res, e);
      return;
    }
    send500AndError(e, res, logContext);
  }
};
const jwksClient = (): any => {
  const disocveryRoute = createOAuthConfiguration().jwksDiscorveryRoute();
  return jose.createRemoteJWKSet(new URL(disocveryRoute));
};

const verifyToken = async (
  access_token: string,
  environmentConfiguration: IEnvironmentConfiguration
) => {
  const _ = await jose.jwtVerify(access_token, jwksClient(), {
    issuer: environmentConfiguration.baseUrl,
    audience: environmentConfiguration.ClientId,
  });
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

function send401AndAddError(
  res: Response<any, Record<string, any>>,
  e: jose.errors.JOSEError
) {
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

function readToken(req: Request) {
  const authHeader = req.headers.authorization;

  const tokenFromHeader = authHeader ? authHeader.split(" ")[1] : null;

  const cookieAuthorizationToken = req.cookies ? req.cookies["app.at"] : null;

  const currentToken = cookieAuthorizationToken || tokenFromHeader;

  return currentToken;
}

export default verifyJWT;
