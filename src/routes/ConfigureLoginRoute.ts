import { Router } from "express";
import { IRequestSession } from "../internals/IRequestSession";

const configureRoutes = (router: Router): Router => {
  router.get("/login", (request, response) => {
    const stateValue =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const currentSession = request.session as IRequestSession;

    currentSession.stateValue = stateValue;

    response.redirect(
      `http://${process.env.FUSIONAUTH_SERVERNAME}:${process.env.FUSIONAUTH_PORT}/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&state=${stateValue}`
    );
  });

  return router;
};

export default configureRoutes;
