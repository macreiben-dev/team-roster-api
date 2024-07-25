import { Request, Response } from "express";
import { IRequestSession } from "../IRequestSession";
import createServerConfiguration from "../../repositories/ServerConfigurationFactory";

const RouteLogin = (request: Request, response: Response) => {
  const config = createServerConfiguration();

  const stateValue =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  const currentSession = request.session as IRequestSession;

  currentSession.stateValue = stateValue;

  response.redirect(config.authorizeUrl(stateValue));
};

export default RouteLogin;
