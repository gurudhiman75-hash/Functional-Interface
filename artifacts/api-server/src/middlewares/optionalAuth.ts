import { type Request, type Response, type NextFunction } from "express";
import { auth } from "../lib/firebase-admin";

export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!auth) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.substring(7);
  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch {
    // Ignore invalid tokens for optional auth
  }
  next();
};
