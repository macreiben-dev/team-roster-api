import { Request, Response } from "express";
import { createOAuthConfiguration } from "../../repositories/ServerConfigurationFactory";

const handler = async (request: Request, response: Response) => {
  const config = createOAuthConfiguration();

  // delete the session
  request.session.destroy(() => {
    console.info("Session destroyed");
  });

  // end FusionAuth session
  response.redirect(config.logoutUrl());
};

export default handler;
