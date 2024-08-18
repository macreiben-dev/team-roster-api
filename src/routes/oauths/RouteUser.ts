import { Request, Response } from "express";
import axios from "axios";
import qs from "qs";
import {
  createOAuthConfiguration,
  createEnvironmentConfiguration,
} from "../../repositories/ServerConfigurationFactory";
import { readToken } from "../../lib/tokenUtil";
import IOAuthRoutesConfiguration from "../../repositories/IOAuthRoutesConfiguration";
import { ConnectedUser } from "../../models/authentications/ConnectedUser";
import { IEnvironmentConfiguration } from "../../repositories/IEnvironmentConfiguration";

const logContext = { middleware: "routeUser" };

const handler = async (request: Request, response: Response) => {
  const config = createOAuthConfiguration();
  const envConfig = createEnvironmentConfiguration();

  const currentToken = readToken(request);

  const currentLogContext = {
    ...logContext,
    originalUrl: request.originalUrl,
    currentToken,
  };

  if (!currentToken) {
    console.info("No token found", currentLogContext);
    send401(response);
  }

  const userId = await readUserIdFromIntroSpec(envConfig, config, currentToken);

  const userApiResponse = await readUserFromApi(envConfig, config, userId);

  const user = new ConnectedUser(userApiResponse.data);

  console.info("connected user created [user]", user.toJson(), userApiResponse);

  response.status(200).send(user.toJson());
};

async function readUserFromApi(
  envConfig: IEnvironmentConfiguration,
  config: IOAuthRoutesConfiguration,
  userId: any
) {
  const apiUserRoute = config.apiUserRoute(userId);

  const apiCallLogContext = {
    ...logContext,
    function: "readUserFromApi",
    tenantId: envConfig.tenantId,
    apiUserRoute: apiUserRoute,
  };

  const configApiUser = {
    headers: {
      "X-FusionAuth-TenantId": envConfig.tenantId,
      Authorization: envConfig.apiKey,
    },
  };

  try {
    const userApiResponse = await axios.get(apiUserRoute, configApiUser);

    console.info("user information read from API", apiCallLogContext);

    return userApiResponse;
  } catch (error) {
    console.error("Error reading user from api", error, apiCallLogContext);
    throw error;
  }
}

async function readUserIdFromIntroSpec(
  envConfig: IEnvironmentConfiguration,
  config: IOAuthRoutesConfiguration,
  currentToken: string
) {
  const configIntrospecRoute = {
    client_id: envConfig.ClientId,
    token: currentToken,
  };

  const currentLogContext = {
    ...logContext,
    function: "getUserIdFromIntroSpec",
    introspecRoute: config.introspecRoute(),
    configIntrospecRoute,
  };

  try {
    const instropecResponse = await axios.post(
      config.introspecRoute(),
      qs.stringify(configIntrospecRoute)
    );

    if (!instropecResponse) {
      throw new IntrospecResponseNullError();
    }

    const sub = instropecResponse.data.sub;

    console.info(`introspection response received ${sub}`, currentLogContext);

    return sub;
  } catch (error) {
    console.error("Error introspecting token", error, currentLogContext);
    throw error;
  }
}

function send401(response: Response<any, Record<string, any>>) {
  response.status(401).send("Unauthorized");
}

class IntrospecResponseNullError extends Error {
  constructor() {
    super(
      "Introspec response is null or undefined, no response received from tenant."
    );
  }
}

export default handler;
