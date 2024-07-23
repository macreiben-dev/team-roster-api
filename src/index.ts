import express from "express";
import dotenv from "dotenv";
import configureRoute from "./routes";
import configureSystemRoute from "./routes/configureSystemRoute";

import session from "express-session";

const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());

const PORT = process.env.SERVER_PORT;

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

app.use("/", configureRoute);

app.use(express.json());

app
  .listen(PORT, () => {
    console.info("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });
