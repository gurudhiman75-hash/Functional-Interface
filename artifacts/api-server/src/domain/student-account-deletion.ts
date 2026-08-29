export const ACCOUNT_DELETION_CONFIRMATION = "DELETE MY ACCOUNT";
export const RECENT_AUTH_MAX_AGE_SECONDS = 10 * 60;

export function isRecentFirebaseAuthentication(
  authTimeSeconds: unknown,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  const authTime = Number(authTimeSeconds);
  if (!Number.isFinite(authTime) || authTime <= 0) return false;

  const age = nowSeconds - authTime;
  return age >= -60 && age <= RECENT_AUTH_MAX_AGE_SECONDS;
}

export function accountDeletionTombstoneEmail(userId: string): string {
  const compact = userId.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!compact) throw new Error("A canonical user ID is required for account deletion");
  return `deleted+${compact}@deleted.examtree.invalid`;
}
