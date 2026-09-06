import { createHash } from "node:crypto";

export const ARG_CP015_COMBO_STATEMENT_AUTHORITY = "ARG_CP015_COMBO_STATEMENT_NATURALIZATION_V1" as const;

type Question = Readonly<Record<string, any>>;

type Captured = Readonly<{ a: string; b: string }>;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function pickIndex(seed: string): number {
  return Number.parseInt(createHash("sha256").update(seed).digest("hex").slice(0, 8), 16) % 4;
}

function captureEnglish(qlId: string, statement: string): Captured | undefined {
  let match: RegExpMatchArray | null = null;
  if (qlId === "ARG-QL-001") {
    match = statement.match(/^Should (.+) display (.+) clearly after the relevant process is complete\?$/);
  } else if (qlId === "ARG-QL-002") {
    match = statement.match(/^Should (.+) require independent verification before changing (.+)\?$/);
  } else if (qlId === "ARG-QL-003") {
    match = statement.match(/^Should (.+) introduce scheduled time slots for (.+)\?$/);
  } else if (qlId === "ARG-QL-004") {
    match = statement.match(/^Should heavy vehicles be restricted on (.+) during (.+)\?$/);
  } else if (qlId === "ARG-QL-005") {
    match = statement.match(/^Should an employer inform (.+) before introducing (.+)\?$/);
  } else if (qlId === "ARG-QL-006") {
    match = statement.match(/^Should (.+) impose a permanent penalty immediately after (.+)\?$/);
  }
  return match?.[1] && match?.[2] ? Object.freeze({ a: match[1], b: match[2] }) : undefined;
}

function mediumVariants(qlId: string, { a, b }: Captured): readonly string[] {
  switch (qlId) {
    case "ARG-QL-001": return Object.freeze([
      `After the relevant process is complete, should ${a} clearly display ${b}?`,
      `Once the process has concluded, should ${a} make ${b} clearly visible?`,
      `Should ${b} be displayed clearly by ${a} after the process is over?`,
      `When the process ends, should ${a} make ${b} clearly available to users?`,
    ]);
    case "ARG-QL-002": return Object.freeze([
      `Before changing ${b}, should ${a} require independent verification?`,
      `Should ${a} permit a change to ${b} only after independent verification?`,
      `Is independent verification necessary before ${a} changes ${b}?`,
      `Should a request to change ${b} at ${a} be independently verified first?`,
    ]);
    case "ARG-QL-003": return Object.freeze([
      `Should ${a} use scheduled time slots for ${b}?`,
      `Would scheduled appointment slots be appropriate for ${b} at ${a}?`,
      `Should ${b} at ${a} be organised through scheduled time slots?`,
      `Is it advisable for ${a} to introduce appointment slots for ${b}?`,
    ]);
    case "ARG-QL-004": return Object.freeze([
      `During ${b}, should heavy vehicles face restrictions on ${a}?`,
      `Should ${a} restrict heavy-vehicle movement during ${b}?`,
      `Would a heavy-vehicle restriction on ${a} during ${b} be justified?`,
      `Should heavy-vehicle access to ${a} be limited during ${b}?`,
    ]);
    case "ARG-QL-005": return Object.freeze([
      `Before introducing ${b}, should an employer inform ${a}?`,
      `Should ${a} be informed before an employer starts ${b}?`,
      `Is prior notice to ${a} necessary before an employer introduces ${b}?`,
      `Should an employer notify ${a} in advance of introducing ${b}?`,
    ]);
    case "ARG-QL-006": return Object.freeze([
      `After ${b}, should ${a} immediately impose a permanent penalty?`,
      `Should ${a} impose an irreversible penalty as soon as ${b} occurs?`,
      `Is an immediate permanent penalty justified for ${a} after ${b}?`,
      `Should ${b} lead ${a} directly to a permanent penalty?`,
    ]);
    default: return Object.freeze([]);
  }
}

function hardThreeVariants(qlId: string, { a, b }: Captured): readonly string[] {
  switch (qlId) {
    case "ARG-QL-001": return Object.freeze([
      `Once the relevant process is finished, is ${a} justified in clearly publishing ${b}?`,
      `Should ${a} provide a clear public display of ${b} after completion of the process?`,
      `After completing the process, should ${a} ensure that ${b} is clearly shown?`,
      `Is there a case for ${a} to make ${b} clearly visible once the process has ended?`,
    ]);
    case "ARG-QL-002": return Object.freeze([
      `Should ${a} independently verify a request before allowing ${b} to be changed?`,
      `Before accepting any change to ${b}, should ${a} carry out a separate verification?`,
      `Is a separate verification step warranted when ${b} is changed at ${a}?`,
      `Should ${a} insist on an independent check before approving a change to ${b}?`,
    ]);
    case "ARG-QL-003": return Object.freeze([
      `Should ${a} move ${b} to a scheduled-slot system?`,
      `Would ${a} be justified in assigning fixed time slots for ${b}?`,
      `Should visitors use pre-arranged time slots for ${b} at ${a}?`,
      `Is a scheduled appointment system suitable for ${b} at ${a}?`,
    ]);
    case "ARG-QL-004": return Object.freeze([
      `Is a time-bound restriction on heavy vehicles warranted on ${a} during ${b}?`,
      `Should movement of heavy vehicles on ${a} be curtailed specifically during ${b}?`,
      `Would ${a} benefit from limiting heavy vehicles for the duration of ${b}?`,
      `Should a temporary heavy-vehicle restriction apply on ${a} during ${b}?`,
    ]);
    case "ARG-QL-005": return Object.freeze([
      `Should an employer give ${a} advance notice before deploying ${b}?`,
      `Before ${b} begins, should ${a} receive clear notice from the employer?`,
      `Is an employer expected to tell ${a} before putting ${b} in place?`,
      `Should prior disclosure to ${a} be required when an employer introduces ${b}?`,
    ]);
    case "ARG-QL-006": return Object.freeze([
      `Would ${a} be justified in imposing a permanent penalty immediately on receiving ${b}?`,
      `Should ${a} move straight to an irreversible penalty after ${b}?`,
      `Is ${b} sufficient for ${a} to impose a permanent penalty without delay?`,
      `Should a permanent sanction follow immediately when ${a} receives ${b}?`,
    ]);
    default: return Object.freeze([]);
  }
}

function hardFourVariants(qlId: string, { a, b }: Captured): readonly string[] {
  switch (qlId) {
    case "ARG-QL-001": return Object.freeze([
      `After the process has concluded, should users be able to see ${b} clearly from ${a}?`,
      `Should ${a} make ${b} clearly accessible once the relevant process is complete?`,
      `On completion of the process, should ${a} clearly publish ${b} for users?`,
      `Should clear access to ${b} be provided by ${a} after the process concludes?`,
    ]);
    case "ARG-QL-002": return Object.freeze([
      `Should an independent check be completed before ${a} approves any change to ${b}?`,
      `When ${b} is to be changed, should ${a} first verify the request independently?`,
      `Should changing ${b} through ${a} depend on a separate verification step?`,
      `Before ${b} can be altered, should ${a} require an independent confirmation?`,
    ]);
    case "ARG-QL-003": return Object.freeze([
      `Should ${a} allocate scheduled appointments for people seeking ${b}?`,
      `For ${b}, should ${a} operate through pre-booked time slots?`,
      `Should a fixed-slot appointment system be introduced by ${a} for ${b}?`,
      `Would it be appropriate for ${a} to schedule ${b} through assigned time slots?`,
    ]);
    case "ARG-QL-004": return Object.freeze([
      `Should heavy vehicles be kept off ${a} for the limited period of ${b}?`,
      `During ${b}, should access for heavy vehicles on ${a} be curtailed?`,
      `Should ${a} have a temporary limit on heavy-vehicle movement during ${b}?`,
      `Is limiting heavy vehicles on ${a} during ${b} a reasonable measure?`,
    ]);
    case "ARG-QL-005": return Object.freeze([
      `When an employer plans to introduce ${b}, should ${a} be told beforehand?`,
      `Should an employer disclose ${b} to ${a} before the monitoring begins?`,
      `Before using ${b}, should an employer clearly notify ${a}?`,
      `Should ${a} receive advance information from the employer about the introduction of ${b}?`,
    ]);
    case "ARG-QL-006": return Object.freeze([
      `Should ${a} treat ${b} as grounds for an immediate and permanent penalty?`,
      `On receiving ${b}, should ${a} impose an irreversible penalty at once?`,
      `Should ${a} permanently penalise the affected party immediately because of ${b}?`,
      `Is it reasonable for ${a} to impose a permanent sanction immediately after ${b}?`,
    ]);
    default: return Object.freeze([]);
  }
}

function rebuildStem(question: Question, statement: string): string {
  const args = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  const labels = ["I", "II", "III", "IV"] as const;
  return `Statement: ${statement}\nArguments:\n${args.map((argument, index) => `${labels[index]}. ${argument}`).join("\n")}`;
}

export function naturalizeArgCp015ComboStatement(
  question: Question,
  profile: string,
  difficulty: string,
  candidateSeed: string,
): Question {
  if (question.locale !== "en-IN" && question.language !== "en") return question;
  if (profile !== "BANKING_COMBO_3X5" && profile !== "BANKING_COMBO_4X5") return question;

  const statement = text(question.statement);
  const captured = captureEnglish(text(question.qlId), statement);
  if (!captured) return question;

  const variants = profile === "BANKING_COMBO_4X5"
    ? hardFourVariants(text(question.qlId), captured)
    : text(difficulty).toUpperCase() === "HARD"
      ? hardThreeVariants(text(question.qlId), captured)
      : mediumVariants(text(question.qlId), captured);
  if (variants.length !== 4) return question;

  const variantIndex = pickIndex(`${candidateSeed}:${question.seed}:${question.scenarioId}`);
  const naturalizedStatement = variants[variantIndex]!;
  const stem = rebuildStem(question, naturalizedStatement);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_COMBO_STATEMENT_AUTHORITY,
    profile,
    difficulty,
    question.qlId,
    question.scenarioId,
    naturalizedStatement,
    question.arguments,
    question.options,
    question.correctIndex,
    question.explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    statement: naturalizedStatement,
    stem,
    text: stem,
    sourceStatement: statement,
    statementSurfaceAuthority: ARG_CP015_COMBO_STATEMENT_AUTHORITY,
    statementVariantId: `${profile}:${text(difficulty).toUpperCase()}:${variantIndex + 1}`,
    scenarioId: `${question.scenarioId}-CP015-SV${variantIndex + 1}`,
    canonicalItemId: `${question.canonicalItemId}:CP015:SV${variantIndex + 1}`,
    questionId: `ARG-001:${question.qlId}:${profile}:CP015:${contentFingerprint.slice(0, 20)}`,
    contentFingerprint,
    diversitySourceMode: "CP014_APPROVED_SEMANTICS_WITH_CP015_NATURAL_STATEMENT_SURFACE" as const,
  });
}
