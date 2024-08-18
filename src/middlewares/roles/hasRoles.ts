import { Request, Response, NextFunction } from "express";

import jose from "jose";

function hasRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentToken = req.verifiedToken;

    if (!currentToken) {
      send401AndMessage(res);
    }

    const decodedToken = jose.decodeJwt(currentToken as string);

    const roles = decodedToken["roles"] as string[];

    if (roles.some((role) => roles.includes(role))) {
      return next();
    }

    send401AndNoPermission(res);
  };
}

function send401AndNoPermission(res: Response<any, Record<string, any>>) {
  res.status(403);
  res.send({ error: `You do not have a role with permissions to do this.` });
}

function send401AndMessage(res: Response<any, Record<string, any>>) {
  const message = "Missing token in given request";

  console.info(message);

  res.status(401);
  res.send({ error: message });
}

export default { hasRole };
