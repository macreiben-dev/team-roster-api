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
import { getLogger } from "../../logging/loggerFactory";
import { Category } from "typescript-logging-category-style";

const logger = getLogger("routeUser");

const handler = async (request: Request, response: Response) => {
  const config = createOAuthConfiguration();
  const envConfig = createEnvironmentConfiguration();

  const currentToken = readToken(request);

  const currentLogContext = {
    originalUrl: request.originalUrl,
    currentToken,
  };

  if (!currentToken) {
    notifyNoTokenFound(currentLogContext);
    send401(response);
  }

  try {
    const userId = await readUserIdFromIntroSpec(
      envConfig,
      config,
      currentToken
    );

    const userApiResponse = await readUserFromApi(envConfig, config, userId);

    const user = new ConnectedUser(userApiResponse.data);

    console.info("connected user created", {
      user: user.toJson(),
      apiResponseStats: userApiResponse,
      apiResponseHEader: userApiResponse.headers,
    });

    response.status(200).send(user.toJson());
  } catch (error) {
    console.error(
      "Unable to read connected user details",
      error,
      currentLogContext
    );
    send500(response, error);
  }
};

function notifyNoTokenFound(currentLogContext: {
  originalUrl: string;
  currentToken: any;
}) {
  logger.info(
    "No token found {originalUrl}, {currentToken}",
    currentLogContext.originalUrl,
    currentLogContext.currentToken
  );
}

async function readUserFromApi(
  envConfig: IEnvironmentConfiguration,
  config: IOAuthRoutesConfiguration,
  userId: any
) {
  const apiUserRoute = config.apiUserRoute(userId);

  const apiCallLogContext = {
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
  const loggerReadUserIdFromIntroSpec = logger.getChildCategory(
    "readUserIdFromIntroSpec"
  );

  const configIntrospecRoute = {
    client_id: envConfig.ClientId,
    token: currentToken,
  };

  const currentLogContext = {
    introspecRoute: config.introspecRoute(),
    configIntrospecRoute,
  };

  try {
    notifyStartReadingIntrospecConfiguration(
      loggerReadUserIdFromIntroSpec,
      currentLogContext
    );

    const instropecResponse = await axios.post(
      config.introspecRoute(),
      qs.stringify(configIntrospecRoute)
    );

    if (!instropecResponse) {
      notifyErrorIntrospecResponseNull(
        loggerReadUserIdFromIntroSpec,
        currentLogContext
      );
      throw new IntrospecResponseNullError();
    }

    const sub = instropecResponse.data.sub;

    notifyIntrospecResponseReceived(
      loggerReadUserIdFromIntroSpec,
      sub,
      config,
      configIntrospecRoute
    );

    return sub;
  } catch (error) {
    logger.error("Error introspecting token", error, currentLogContext);
    throw error;
  }
}

function notifyIntrospecResponseReceived(
  loggerReadUserIdFromIntroSpec: Category,
  sub: any,
  config: IOAuthRoutesConfiguration,
  configIntrospecRoute: { client_id: string; token: string }
) {
  loggerReadUserIdFromIntroSpec.info(
    `introspection response received {sub}, {introspecRoute}, {configIntrospecRoute}`,
    sub,
    config.introspecRoute(),
    configIntrospecRoute
  );
}

function send401(response: Response<any, Record<string, any>>) {
  response.status(401).send("Unauthorized");
}

function send500(response: Response<any, Record<string, any>>, error: any) {
  response.status(500).send(error.message);
}

function notifyStartReadingIntrospecConfiguration(
  loggerReadUserIdFromIntroSpec: Category,
  currentLogContext: {
    introspecRoute: string;
    configIntrospecRoute: { client_id: string; token: string };
  }
) {
  loggerReadUserIdFromIntroSpec.info(
    "Retrieving introspection response {introspecRoute}, {client_id}, {token} ...",
    currentLogContext.introspecRoute,
    currentLogContext.configIntrospecRoute.client_id,
    currentLogContext.configIntrospecRoute.token
  );
}

function notifyErrorIntrospecResponseNull(
  loggerReadUserIdFromIntroSpec: Category,
  currentLogContext: {
    introspecRoute: string;
    configIntrospecRoute: { client_id: string; token: string };
  }
) {
  loggerReadUserIdFromIntroSpec.error(
    "Introspec response is null {introspecRoute}, {client_id}, {token}",
    currentLogContext.introspecRoute,
    currentLogContext.configIntrospecRoute.client_id,
    currentLogContext.configIntrospecRoute.token
  );
}

class IntrospecResponseNullError extends Error {
  constructor() {
    super(
      "Introspec response is null or undefined, no response received from tenant."
    );
  }
}

export default handler;
