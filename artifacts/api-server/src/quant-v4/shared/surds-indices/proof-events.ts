export type SriProofEventKind =
  | "STATE_CONSTRUCTED"
  | "DOMAIN_CHECK"
  | "NORMALIZE"
  | "TRANSFORM"
  | "SOLVE"
  | "INDEPENDENT_VERIFY"
  | "EXTRANEOUS_CHECK"
  | "ANSWER_FORMAT";

export interface SriProofEvent {
  readonly kind: SriProofEventKind;
  readonly rule: string;
  readonly input: Readonly<Record<string, string>>;
  readonly output: Readonly<Record<string, string>>;
}

export function proofEvent(
  kind: SriProofEventKind,
  rule: string,
  input: Readonly<Record<string, string>>,
  output: Readonly<Record<string, string>>,
): SriProofEvent {
  return { kind, rule, input: { ...input }, output: { ...output } };
}

export function assertProofHasIndependentVerification(events: readonly SriProofEvent[]): void {
  if (!events.some((event) => event.kind === "INDEPENDENT_VERIFY")) {
    throw new Error("SRI proof trace must contain an independent-verification event");
  }
}
