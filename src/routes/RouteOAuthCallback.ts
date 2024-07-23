import { Request, Response } from "express";
import { IRequestSession } from "./IRequestSession";
import axios from "axios";
import qs from "query-string";

const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

const HTTPCODE_TEMPORARY_REDIRECT = 302;

const handler = async (request: Request, response: Response) => {
  // Here we will receive the code such as:
  // http://localhost:9000/oauth-callback?code=SSXVv3xkNTKEhnY4XzjUVvRZp7eyhgCuuREAgSeByrw&locale=en&userState=Authenticated

  console.info("oauth-callback called");

  const url = `http://${process.env.FUSIONAUTH_SERVERNAME}:${process.env.FUSIONAUTH_PORT}/oauth2/token`;

  const stateFromServer = readQueryState(request);

  const sessionStateValue = readSessionState(request);

  if (stateFromServer !== sessionStateValue) {
    console.warn("State doesn't match. uh-oh.");
    console.warn(`Saw: ${stateFromServer}, but expected: ${sessionStateValue}`);
    response.redirect(HTTPCODE_TEMPORARY_REDIRECT, "/");
    return;
  }

  const data = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: request.query.code,
    grant_type: "authorization_code",
    redirect_uri: process.env.REDIRECT_URI,
  };

  //post request to /token endpoint
  axios
    .post(url, data, config)
    .then((result) => {
      const session = request.session as IRequestSession;

      // save token to session
      session.token = result.data.access_token;

      //   console.info(result);

      //redirect to Vue app ==============================
      response.redirect(`http://localhost:5173`);
      // =================================================
    })
    .catch((err) => {
      console.error(err);
    });
};

const readQueryState = (request: Request): string =>
  request.query.state as string;

const readSessionState = (request: Request): string => {
  const session = request.session as IRequestSession;
  const sessionStateValue = session.stateValue;
  return sessionStateValue as string;
};

export default handler;
