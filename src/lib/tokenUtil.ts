import { Request } from "express";

const readToken = (req: Request) => {
  const authHeader = req.headers.authorization;

  const tokenFromHeader = authHeader ? authHeader.split(" ")[1] : null;

  const cookieAuthorizationToken = req.cookies ? req.cookies["app.at"] : null;

  const currentToken = cookieAuthorizationToken || tokenFromHeader;

  return currentToken;
};

export { readToken };
