export const PASSWORD_RESET_ACCEPTED_MESSAGE =
  'If an ExamTree password account uses this email, reset instructions have been sent.';

export type ManualRecoveryInput = {
  identifier: string;
  contactEmail: string;
  explanation: string;
};

export type ManualRecoveryValidation = {
  identifier?: string;
  contactEmail?: string;
  explanation?: string;
};

export type PasswordResetFailure =
  | 'accepted'
  | 'invalid-email'
  | 'rate-limited'
  | 'network'
  | 'unavailable';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeRecoveryEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validateRecoveryEmail(value: string): string | null {
  const email = normalizeRecoveryEmail(value);
  if (!email) return 'Enter your account email.';
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return 'Enter a valid email address.';
  }
  return null;
}

export function validateManualRecovery(
  input: ManualRecoveryInput,
): ManualRecoveryValidation {
  const errors: ManualRecoveryValidation = {};
  const identifier = input.identifier.trim();
  const contactEmail = normalizeRecoveryEmail(input.contactEmail);
  const explanation = input.explanation.trim().replace(/\s+/g, ' ');

  if (identifier.length < 4) {
    errors.identifier = 'Enter your registered email or registration code.';
  }
  if (contactEmail.length > 254 || !EMAIL_PATTERN.test(contactEmail)) {
    errors.contactEmail = 'Enter a valid contact email.';
  }
  if (explanation.length < 20) {
    errors.explanation = 'Explain the access problem in at least 20 characters.';
  }
  return errors;
}

export function firebaseErrorCode(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string'
  ) {
    return (error as { code: string }).code;
  }
  return '';
}

export function classifyPasswordResetFailure(
  error: unknown,
): PasswordResetFailure {
  switch (firebaseErrorCode(error)) {
    case 'auth/user-not-found':
      return 'accepted';
    case 'auth/invalid-email':
    case 'auth/missing-email':
      return 'invalid-email';
    case 'auth/too-many-requests':
    case 'auth/quota-exceeded':
      return 'rate-limited';
    case 'auth/network-request-failed':
      return 'network';
    default:
      return 'unavailable';
  }
}
