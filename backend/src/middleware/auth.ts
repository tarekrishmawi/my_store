import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const tokenSecret = env.tokenSecret;

    if (!authorizationHeader) {
      return res.status(401).json({
        error: "Access denied, token is missing",
      });
    }

    // token format check
    const parts = authorizationHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const token = parts[1];

    if (!tokenSecret) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    jwt.verify(token, tokenSecret);

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

export default verifyAuthToken;
