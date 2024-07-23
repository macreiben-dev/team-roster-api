import { Router } from "express";
import configureUserRoutes from "./routes/ConfigureUserRoutes";
import configureSystemRoute from "./routes/configureSystemRoute";

const router = Router();

const configureRoute = (router: Router): Router => {
  configureUserRoutes(router);

  configureSystemRoute(router);

  console.info("Routes configured");

  return router;
};

configureRoute(router);

router.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    console.info(`Route ${r.route.path} is up and running`);
  }
});

export default router;
