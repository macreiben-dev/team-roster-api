import { Request, Response } from "express";
import createServerConfiguration from "../../repositories/ServerConfigurationFactory";

const handler = async (request: Request, response: Response) => {
  const config = createServerConfiguration();

  // delete the session
  request.session.destroy(() => {
    console.info("Session destroyed");
  });

  // end FusionAuth session
  response.redirect(config.logoutUrl());
};
