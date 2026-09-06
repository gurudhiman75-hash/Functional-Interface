import { createHash } from "node:crypto";

export const ARG_CP015_COMBO_STATEMENT_AUTHORITY = "ARG_CP015_COMBO_STATEMENT_NATURALIZATION_V1" as const;
export const ARG_CP015_COMBO_EDITORIAL_AUTHORITY = "ARG_CP015_COMBO_EDITORIAL_NATURALIZATION_V1" as const;

type Question = Readonly<Record<string, any>>;
type Captured = Readonly<{ a: string; b: string }>;
type Strength = "STRONG" | "WEAK";

const ROMAN = ["I", "II", "III", "IV"] as const;

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

function normalizeArgument(qlId: string, argument: string): string {
  if (qlId !== "ARG-QL-001") return argument;
  return argument
    .replace(/^Yes\. Clear (model answer points|evaluation criteria) helps\b/, "Yes. Clear $1 help")
    .replace(/\b(model answer points|evaluation criteria) can change, ([^.]*) must keep it updated\b/, "$1 can change, $2 must keep them updated");
}

function ql001Reason(argument: string, { a, b }: Captured): string {
  if (/helps users understand the decision process/i.test(argument)) {
    return `Making ${b} clear helps affected users understand how the outcome was reached and spot avoidable errors, so it is directly relevant to post-process transparency.`;
  }
  if (/page with .* may look less attractive/i.test(argument)) {
    return `The visual attractiveness of a page is cosmetic and does not address whether users materially benefit from access to ${b}.`;
  }
  if (/must keep (it|them) updated|stale information/i.test(argument)) {
    return `If ${b} can change, outdated information could mislead users; keeping it current is therefore a material accuracy condition for publication.`;
  }
  if (/Successful organisations display more information/i.test(argument)) {
    return `The fact that other successful organisations publish more information does not show that ${b} is necessary or useful for ${a}; the argument relies on imitation rather than relevance.`;
  }
  if (/clear grievance contact gives users a direct route/i.test(argument)) {
    return `A visible grievance contact gives affected users a concrete route to seek clarification or report a possible error after the process, which is directly relevant to accountability.`;
  }
  if (/Relevant post-process information or a clear contact route/i.test(argument)) {
    return `A relevant post-process information or contact route can help affected users verify an outcome or seek clarification, giving a practical transparency benefit after completion.`;
  }
  if (/anything displayed afterwards is automatically useless/i.test(argument)) {
    return `Completion of a process does not make all later information useless; useful post-process guidance can still help users verify or question an outcome.`;
  }
  return `The argument must be judged by whether it materially affects accurate, useful access to ${b} after the process rather than by a cosmetic or unrelated consideration.`;
}

function ql002Reason(argument: string, { a, b }: Captured): string {
  if (/second verification can stop stolen login details/i.test(argument)) {
    return `A second check means stolen login credentials alone are not enough to change ${b}, which is a concrete security mechanism for ${a}.`;
  }
  if (/One customer once failed verification/i.test(argument)) {
    return `One failed verification attempt does not show that every legitimate change to ${b} will become impossible; the argument generalises from a single case.`;
  }
  if (/alert through an old verified channel/i.test(argument)) {
    return `An alert through a previously verified channel can expose an unauthorised change to ${b} quickly, giving the genuine user a practical early-warning mechanism.`;
  }
  if (/guarantees that fraud|every future fraud attempt impossible/i.test(argument)) {
    return `Independent verification can reduce the risk of fraud involving ${b}, but it cannot guarantee that every future fraud attempt will be impossible.`;
  }
  if (/secure recovery route|locked out/i.test(argument)) {
    return `A secure recovery route is material because a genuine user who loses the old verification factor must still be able to regain legitimate access without weakening the control.`;
  }
  return `The argument is relevant only if it identifies a realistic security or legitimate-access consequence of independently verifying a change to ${b}.`;
}

function ql003Reason(argument: string, { a, b }: Captured): string {
  if (/spread arrivals and reduce crowding/i.test(argument)) {
    return `Spreading arrivals across scheduled slots can reduce queue concentration for ${b} at ${a}, which is a direct operational benefit.`;
  }
  if (/expensive desktop computer/i.test(argument)) {
    return `A slot system does not require every visitor to own an expensive desktop computer; the objection invents an unnecessary implementation condition.`;
  }
  if (/walk-in or assisted fallback/i.test(argument)) {
    return `A walk-in or assisted fallback addresses the real access problem faced by users who cannot book a slot, so it is a material implementation safeguard.`;
  }
  if (/permanently impossible to deliver/i.test(argument)) {
    return `Using scheduled slots does not make ${b} permanently impossible to deliver; the argument turns a limited scheduling change into an unsupported absolute claim.`;
  }
  if (/plan counter capacity|service duration is reasonably predictable/i.test(argument)) {
    return `Where service time is reasonably predictable, scheduled arrivals can help ${a} match counter capacity to demand across the day.`;
  }
  if (/always makes public services inaccessible to everyone/i.test(argument)) {
    return `A time-slot system may create access issues for some users, but claiming that it always makes the service inaccessible to everyone is an unsupported universal conclusion.`;
  }
  if (/cannot book online|fixed slot/i.test(argument)) {
    return `Users who cannot book online or reliably arrive within a fixed slot could be disadvantaged, so the proposal needs an access fallback rather than assuming universal digital convenience.`;
  }
  return `The argument must identify a realistic queue-management, capacity or access consequence of using scheduled slots for ${b} at ${a}.`;
}

function ql004Reason(argument: string, { a, b }: Captured): string {
  if (/limited restriction during .* can reduce conflict/i.test(argument)) {
    return `A restriction limited to ${b} targets the period of greatest conflict on ${a} without imposing an all-day ban, making the measure relevant and proportionate.`;
  }
  if (/permanently destroy all activity/i.test(argument)) {
    return `A short restriction during ${b} does not establish that all activity around ${a} will be permanently destroyed; the claimed harm is grossly disproportionate to the measure.`;
  }
  if (/Emergency and essential-delivery access|defined exceptions/i.test(argument)) {
    return `Emergency and essential-delivery access may still be necessary during ${b}, so defined exceptions are a material limit on the scope of the restriction.`;
  }
  if (/should be banned .* at all times|If any restriction helps once/i.test(argument)) {
    return `A measure that may be useful during ${b} does not justify banning heavy vehicles on ${a} at all times; the argument improperly expands a targeted restriction into a blanket ban.`;
  }
  if (/turning and pedestrian conflict/i.test(argument)) {
    return `Reducing heavy-vehicle movements during ${b} can lower turning and pedestrian conflicts on ${a}, which directly addresses the safety problem behind the proposal.`;
  }
  if (/delay emergency or essential deliveries/i.test(argument)) {
    return `Restricting access during ${b} can delay emergency or essential deliveries that genuinely need ${a}, so this is a concrete operational cost that the policy must accommodate.`;
  }
  return `The argument is material only if it addresses the safety, access or proportionality effects of a time-bound heavy-vehicle restriction on ${a} during ${b}.`;
}

function ql005Reason(argument: string, { a, b }: Captured): string {
  if (/should know what data .* collects/i.test(argument)) {
    return `${a} have a direct privacy interest in knowing what data ${b} collects, why it is collected and who can access it before the monitoring begins.`;
  }
  if (/must have something to hide|cannot be trusted at work/i.test(argument)) {
    return `Questioning ${b} or valuing privacy does not show that an employee is dishonest; the argument stereotypes ${a} instead of assessing the monitoring policy.`;
  }
  if (/less intrusive method should be considered|excessive for the stated purpose/i.test(argument)) {
    return `If ${b} is more intrusive than the stated purpose requires, considering a less intrusive method is a genuine proportionality safeguard.`;
  }
  if (/modern technology.*always be fair/i.test(argument)) {
    return `Being modern technology does not establish that ${b} is necessary, proportionate or fair to ${a}; the conclusion does not follow from the premise.`;
  }
  if (/narrowly targeted investigation|advance notice could defeat/i.test(argument)) {
    return `In a narrowly targeted misconduct investigation, advance notice could undermine the investigation itself, so a limited exception can be relevant without justifying routine secret monitoring.`;
  }
  if (/monitoring data may be used in workplace decisions/i.test(argument)) {
    return `Advance notice lets ${a} understand how data from ${b} may affect workplace decisions, giving a direct governance and informed-notice benefit.`;
  }
  return `The argument must address a concrete privacy, notice, proportionality or investigation consequence of introducing ${b} for ${a}.`;
}

function ql006Reason(argument: string, { a, b }: Captured): string {
  if (/Temporary safeguards and evidence review|fact-checking|fair opportunity to respond/i.test(argument)) {
    return `Before ${a} imposes an irreversible penalty after ${b}, temporary safeguards and evidence review preserve due process while still allowing immediate risks to be managed.`;
  }
  if (/guilt is already certain/i.test(argument)) {
    return `${b} is an allegation or signal, not automatic proof of guilt; treating it as conclusive would bypass the need to verify the facts.`;
  }
  if (/mistaken .* can cause serious harm/i.test(argument)) {
    return `If ${b} is mistaken, an irreversible penalty can cause serious harm that may not be repairable later, which is a direct cost of acting permanently before verification.`;
  }
  if (/must ignore every future complaint/i.test(argument)) {
    return `Rejecting an immediate permanent penalty does not require ${a} to ignore future complaints; the argument creates a false choice between irreversible punishment and doing nothing.`;
  }
  if (/reversible interim restriction/i.test(argument)) {
    return `A reversible interim restriction can control immediate risk while evidence relating to ${b} is checked, offering a proportionate alternative to an instant permanent sanction.`;
  }
  return `The argument is material only if it addresses proof, reversibility or due process before ${a} imposes a permanent penalty after ${b}.`;
}

function reasonFor(qlId: string, argument: string, captured: Captured): string {
  switch (qlId) {
    case "ARG-QL-001": return ql001Reason(argument, captured);
    case "ARG-QL-002": return ql002Reason(argument, captured);
    case "ARG-QL-003": return ql003Reason(argument, captured);
    case "ARG-QL-004": return ql004Reason(argument, captured);
    case "ARG-QL-005": return ql005Reason(argument, captured);
    case "ARG-QL-006": return ql006Reason(argument, captured);
    default: return "The argument must be assessed on its direct relevance and logical support for the proposal.";
  }
}

function buildExplanation(
  qlId: string,
  argumentsList: readonly string[],
  strengths: readonly Strength[],
  captured: Captured,
): string {
  return argumentsList.map((argument, index) => {
    const label = ROMAN[index]!;
    const strength = strengths[index]!;
    return `Argument ${label} is ${strength.toLowerCase()}: ${reasonFor(qlId, argument, captured)}`;
  }).join(" ");
}

function rebuildStem(question: Question, statement: string, argumentsList: readonly string[]): string {
  return `Statement: ${statement}\nArguments:\n${argumentsList.map((argument, index) => `${ROMAN[index]}. ${argument}`).join("\n")}`;
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
  const qlId = text(question.qlId);
  const captured = captureEnglish(qlId, statement);
  if (!captured) return question;

  const variants = profile === "BANKING_COMBO_4X5"
    ? hardFourVariants(qlId, captured)
    : text(difficulty).toUpperCase() === "HARD"
      ? hardThreeVariants(qlId, captured)
      : mediumVariants(qlId, captured);
  if (variants.length !== 4) return question;

  const sourceArguments = Array.isArray(question.arguments) ? question.arguments as readonly string[] : [];
  const sourceStrengths = Array.isArray(question.argumentStrengths) ? question.argumentStrengths as readonly string[] : [];
  if (sourceArguments.length !== sourceStrengths.length || (sourceArguments.length !== 3 && sourceArguments.length !== 4)) return question;
  const strengths = sourceStrengths.map((value) => text(value).toUpperCase()) as Strength[];
  if (strengths.some((value) => value !== "STRONG" && value !== "WEAK")) return question;

  const variantIndex = pickIndex(`${candidateSeed}:${question.seed}:${question.scenarioId}`);
  const naturalizedStatement = variants[variantIndex]!;
  const argumentsList = Object.freeze(sourceArguments.map((argument) => normalizeArgument(qlId, argument)));
  const explanation = buildExplanation(qlId, argumentsList, strengths, captured);
  const stem = rebuildStem(question, naturalizedStatement, argumentsList);
  const contentFingerprint = createHash("sha256").update(JSON.stringify([
    ARG_CP015_COMBO_STATEMENT_AUTHORITY,
    ARG_CP015_COMBO_EDITORIAL_AUTHORITY,
    profile,
    difficulty,
    qlId,
    question.scenarioId,
    naturalizedStatement,
    argumentsList,
    question.options,
    question.correctIndex,
    explanation,
  ])).digest("hex");

  return Object.freeze({
    ...question,
    statement: naturalizedStatement,
    arguments: argumentsList,
    explanation,
    stem,
    text: stem,
    sourceStatement: statement,
    sourceComboArguments: question.arguments,
    sourceComboExplanation: question.explanation,
    statementSurfaceAuthority: ARG_CP015_COMBO_STATEMENT_AUTHORITY,
    comboEditorialAuthority: ARG_CP015_COMBO_EDITORIAL_AUTHORITY,
    statementVariantId: `${profile}:${text(difficulty).toUpperCase()}:${variantIndex + 1}`,
    scenarioId: `${question.scenarioId}-CP015-SV${variantIndex + 1}`,
    canonicalItemId: `${question.canonicalItemId}:CP015:SV${variantIndex + 1}:EDITORIAL`,
    questionId: `ARG-001:${question.qlId}:${profile}:CP015:${contentFingerprint.slice(0, 20)}`,
    contentFingerprint,
    diversitySourceMode: "CP014_APPROVED_SEMANTICS_WITH_CP015_NATURAL_COMBO_EDITORIAL_SURFACE" as const,
  });
}
