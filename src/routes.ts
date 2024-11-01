import { Router } from "express";
import configureUserRoutes from "./routes/ConfigureUserRoutes";
import configureSystemRoute from "./routes/configureSystemRoute";
import { getLogger } from "./logging/loggerFactory";

const logger = getLogger("routes");

const router = Router();

const configureRoute = (router: Router): Router => {
  configureUserRoutes(router);

  configureSystemRoute(router);

  logger.info("Routes configured");

  return router;
};

configureRoute(router);

router.stack.forEach((r: any) => {
  const loggerRouteConfiguration =
    logger.getChildCategory("routeConfiguration");

  if (r.route && r.route.path) {
    loggerRouteConfiguration.info(
      `Route {route} is up and running`,
      r.route.path
    );
  }
});

export default router;
