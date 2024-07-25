import { Router } from "express";
import { IRequestSession } from "./IRequestSession";
import RouteOAuthCallback from "./oauths/RouteOAuthCallback";
import RouteLogin from "./oauths/RouteLogin";

const configureRoutes = (router: Router): Router => {
  router.get("/login", (request, response) => {
    RouteLogin(request, response);
  });

  router.get("/oauth-callback", (request, response) => {
    RouteOAuthCallback(request, response);
  });

  return router;
};

export default configureRoutes;
