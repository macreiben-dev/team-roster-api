import { Session } from "express-session";

export interface IRequestSession extends Session {
  stateValue: string;
  token: string;
}
