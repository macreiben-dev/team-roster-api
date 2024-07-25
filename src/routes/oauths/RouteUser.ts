import { Request, Response } from "express";
import axios from "axios";
import { IRequestSession } from "../IRequestSession";
import qs from "qs";

const handler = (request: Request, response: Response) => {
  const session = request.session as IRequestSession;
  if (session.token) {
    axios
      .post(
        `http://localhost:${process.env.FUSIONAUTH_PORT}/oauth2/introspect`,
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
            .get(
              `http://localhost:${process.env.FUSIONAUTH_PORT}/api/user/registration/${introspectResponse.sub}/${process.env.APPLICATION_ID}`,
              {
                headers: {
                  Authorization: process.env.API_KEY,
                },
              }
            )
            .then((response) => {
              response.send({
                introspectResponse: introspectResponse,
                body: response.data.registration,
              });
            });
        }
        // expired token -> send nothing
        else {
          session.destroy();
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
