import { type NextFunction, type Request, type Response } from "express";

import { isRecentFirebaseAuthentication } from "../domain/student-account-deletion";
import { auth } from "../lib/firebase-admin";

export async function requireRecentFirebaseAuthentication(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Sign in again before deleting your account.",
      code: "REAUTH_REQUIRED",
    });
    return;
  }

  try {
    const decoded = (await auth.verifyIdToken(authHeader.substring(7), true)) as {
      auth_time?: unknown;
    };
    if (!isRecentFirebaseAuthentication(decoded.auth_time)) {
      res.status(401).json({
        error: "Sign in again before deleting your account.",
        code: "REAUTH_REQUIRED",
      });
      return;
    }
    next();
  } catch {
    res.status(401).json({
      error: "Sign in again before deleting your account.",
      code: "REAUTH_REQUIRED",
    });
  }
}
