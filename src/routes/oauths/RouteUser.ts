import { Request, Response } from "express";
import axios from "axios";
import { IRequestSession } from "../IRequestSession";
import qs from "qs";
import { createOAuthConfiguration } from "../../repositories/ServerConfigurationFactory";

const handler = (request: Request, response: Response) => {
  const config = createOAuthConfiguration();

  const session = request.session as IRequestSession;
  if (session.token) {
    axios
      .post(
        config.introspecRoute(),
        qs.stringify({
          client_id: process.env.CLIENT_ID,
          token: session.token,
        })
      )
      .then((result) => {
        let introspectResponse = result.data;
        // valid token -> get more user data and send it back to the Vue app
        if (introspectResponse) {
          // GET request to /registration endpoint
          axios
            .get(config.registrationRoute(introspectResponse.sub), {
              headers: {
                Authorization: process.env.API_KEY,
              },
            })
            .then((axiosResponse) => {
              response.send({
                // Idea: do not used introspect since a concept from OAuth2
                introspectResponse: introspectResponse,
                body: axiosResponse.data.registration,
              });
            });
        }
        // expired token -> send nothing
        else {
          request.session.destroy(() => {});
          response.send({});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // no token -> send nothing
  else {
    response.send({});
  }
};

export default handler;
