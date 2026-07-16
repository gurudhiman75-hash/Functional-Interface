import { type Request, type Response, type NextFunction } from "express";
import { auth } from "../lib/firebase-admin";
import type { AdminSession } from "../lib/admin-rbac";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        displayName?: string;
        emailVerified?: boolean;
      };
      adminSession?: AdminSession;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!auth) {
    return void res.status(500).json({ error: "Authentication not configured" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return void res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.substring(7);
  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      displayName: typeof decodedToken.name === "string" ? decodedToken.name : undefined,
      emailVerified: decodedToken.email_verified,
    };
    next();
    return;
  } catch {
    return void res.status(401).json({ error: "Invalid token" });
  }
};
