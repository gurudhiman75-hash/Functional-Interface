/** Keep Firebase verification failures actionable without exposing phone numbers or tokens. */
export function profileVerificationError(code: string | undefined): string | null {
  const messages: Record<string, string> = {
    "auth/captcha-check-failed": "CAPTCHA verification failed or expired. Choose Send OTP again to load a fresh challenge. If it repeats, contact support with code auth/captcha-check-failed.",
    "auth/missing-app-credential": "CAPTCHA verification could not start. Reload the page and try again. If it repeats, contact support with code auth/missing-app-credential.",
    "auth/invalid-app-credential": "Firebase could not verify this website for phone verification. Contact support with code auth/invalid-app-credential.",
    "auth/unauthorized-domain": "Phone verification is not configured for this website. Contact support with code auth/unauthorized-domain.",
    "auth/app-not-authorized": "Firebase has not authorized this website for phone verification. Contact support with code auth/app-not-authorized.",
    "auth/quota-exceeded": "The SMS verification quota has been reached. Please try later or contact support.",
    "auth/billing-not-enabled": "SMS verification is unavailable because its billing configuration needs attention. Please contact support.",
    "auth/invalid-phone-number": "Enter a valid mobile number, including its country code.",
    "auth/network-request-failed": "Verification could not connect. Check your connection and try again.",
    "auth/internal-error": "Firebase could not complete verification. Please contact support with code auth/internal-error.",
  };
  return code ? messages[code] ?? null : null;
}
