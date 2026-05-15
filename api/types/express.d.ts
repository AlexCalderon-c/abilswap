import { UserObject } from "./user.types";

declare global {
  namespace Express {
    interface Request {
      user?: UserObject;
    }
  }
}
