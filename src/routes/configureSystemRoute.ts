import { Router } from "express";
import { IRequestSession } from "./IRequestSession";
import RouteOAuthCallback from "./RouteOAuthCallback";

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

  router.get("/oauth-callback", (request, response) => {
    // Here we will receive the code such as:
    // http://localhost:9000/oauth-callback?code=SSXVv3xkNTKEhnY4XzjUVvRZp7eyhgCuuREAgSeByrw&locale=en&userState=Authenticated

    RouteOAuthCallback(request, response);
  });

  return router;
};

export default configureRoutes;
