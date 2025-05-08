import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userSchema";

interface ExtendRequest extends Request {
  user?: any;
}

const validatJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
  const authorizationHeader = req.get("authorization");
  // check in authorization ?
  if (!authorizationHeader) {
    res.status(403).send("authorization is not found");
    return;
  }
  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    res.status(403).send("bearer token not found");
    return;
  }

  jwt.verify(
    token,
    "c2hjhDS7yDBYeYM4j45wMg7hcY5vovlpFVkrkG9xlLExgf8WUsYbLuTdei760LP1",
    async (err, payload) => {
      if (err) {
        res.status(403).send("invalid token");
        return;
      }

      const userPayload = payload as {
        email: string;
        firstName: string;
        lastName: string;
      };

      const user = await userModel.findOne({ email: userPayload.email });

      req.user = user;

      next();
    }
  );
};

export default validatJWT;
