import { Router } from "express";
import handlerRouteUserMe from "./oauths/RouteUser";

const configureRoutes = (router: Router): Router => {
  router.get("/api/v1/users/1", (request, response) => {
    response.send({
      user: {
        email: "dinesh@fusionauth.io",
      },
    });
  });

  router.get("/api/v1/users/me", async (request, response) => {
    await handlerRouteUserMe(request, response);
  });

  return router;
};

export default configureRoutes;
