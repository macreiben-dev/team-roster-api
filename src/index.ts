import express from "express";
import dotenv from "dotenv";
import configureRoute from "./routes";
import session from "express-session";
import verifyJWT from "./middlewares/verifyJWT";
import { getLogger } from "./logging/loggerFactory";

const logger = getLogger("index");

logger.info("Starting server ...");

const cors = require("cors");

dotenv.config();

logger.info("dotenv loaded");

const app = express();

logger.info("express app created");

app.use(cors());

const PORT = process.env.SERVER_PORT;

logger.info("port set to ", PORT);

const middleWareLogger = logger.getChildCategory("middleware");

app.use(
  session({
    secret: "1234567890", // don't use this secret in prod :)
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: "auto",
      httpOnly: true,
      maxAge: 3600000,
    },
  })
);

middleWareLogger.info("session middleware set");

app.use(verifyJWT);

middleWareLogger.info("verifyJWT middleware set");

app.use("/", configureRoute);

middleWareLogger.info("configureRoute middleware set");

app.use(express.json());

middleWareLogger.info("express middleware set");

app
  .listen(PORT, () => {
    logger.info("Server running at PORT: ", PORT);
  })
  .on("error", (error: any) => {
    logger.error("Error occured on server {error}", error);
    // gracefully handle error
    throw new Error(error.message);
  });
