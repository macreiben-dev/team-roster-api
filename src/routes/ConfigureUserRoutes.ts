import { Router } from "express";

const configureRoutes = (router: Router): Router => {
  router.get("/api/v1/users/1", (request, response) => {
    response.send({
      user: {
        email: "dinesh@fusionauth.io",
      },
    });
  });

  return router;
};

export default configureRoutes;
