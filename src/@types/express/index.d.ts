import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      verifiedToken?: string;
      token?: string;
    }
  }
}
