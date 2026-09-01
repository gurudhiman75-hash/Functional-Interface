import { createHash } from "node:crypto";

export type AuthoringFact = {
  key: string;
  value: string;
  type?: string;
};

export type AuthoringInput = {
  eventId: string;
  eventDate: string;
  category: string;
  sourceKey?: string;
  sourceTitle: string;
  facts: AuthoringFact[];
};

export type AuthoringOutput = {
  status: "ready" | "needs_editorial";
  title?: string;
  summary?: string;
  oneLiner?: string;
  templateId?: string;
  sourceTitleSimilarity: number;
  reasons: string[];
  inputFingerprint: string;
};

const AUTHORING_POLICY_VERSION = "ca-cp044-learner-writing-quality-v1";
const TITLE_SIMILARITY_LIMIT = 0.72;

const SOURCE_NAMES: Record<string, string> = {
  pib: "Government of India",
  rbi: "Reserve Bank of India",
  sebi: "SEBI",
  isro: "ISRO",
  punjab_gov: "Punjab Government",
  punjab_gov_press: "Punjab Government",
  punjab_lok_bhavan_press: "Punjab Lok Bhavan",
};

const CATEGORY_LABELS: Record<string, string> = {
  national: "national affairs",
  economy_banking: "economy and banking",
  international: "international affairs",
  appointments: "appointment",
  awards: "award",
  reports_indices: "report and index",
  sports: "sports",
  science_technology: "science and technology",
  space: "space",
  defence: "defence",
  environment: "environment",
  books_authors: "books and authors",
  important_days: "important day",
  summits: "summit",
  obituaries: "obituary",
  punjab: "Punjab affairs",
  other: "current affairs",
};

const FACT_LABELS: Record<string, string> = {
  appointee: "Appointee",
  position: "Position",
  winner: "Winner",
  award_or_title: "Award / title",
  launching_entity: "Organisation",
  initiative: "Initiative",
  acting_entity: "Organisation",
  official_action: "Action",
  action_subject: "Topic",
  event_status: "Status",
  amount: "Amount",
  percentage: "Percentage",
  rank: "Rank",
  scheme_outlay: "Outlay",
  beneficiary_count: "Beneficiaries",
  effective_date: "Effective date",
  headquarters: "Headquarters",
  target_percentage: "Target",
  target_year: "Target year",
  mou_parties: "Parties",
  orbit_altitude: "Orbit altitude",
  repeat_cycle: "Repeat cycle",
  mission_life: "Mission life",
  launcher: "Launch vehicle",
  index_value: "Index value",
};

const SUBJECT_FACT_PRIORITY = [
  "action_subject",
  "initiative",
  "award_or_title",
  "appointee",
  "mou_parties",
  "headquarters",
  "scheme_outlay",
  "rank",
] as const;

const ACRONYM_STOP = new Set([
  "RBI", "SEBI", "ISRO", "PIB", "NASA", "GOVT", "INDIA", "PRESS", "RELEASE",
  "NEW", "THE", "AND", "FOR", "WITH", "FROM", "ON", "IN", "OF", "TO", "AT",
]);

function normalized(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}%₹.\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(value: string): Set<string> {
  return new Set(
    normalized(value)
      .split(" ")
      .filter((token) => token.length >= 3),
  );
}

export function titleSimilarity(a: string, b: string): number {
  const left = tokenSet(a);
  const right = tokenSet(b);
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  for (const token of left) if (right.has(token)) shared += 1;
  const union = left.size + right.size - shared;
  return Number((shared / Math.max(1, union)).toFixed(4));
}

function factMap(facts: AuthoringFact[]) {
  const result = new Map<string, string>();
  for (const fact of facts) {
    const key = fact.key.trim().toLowerCase();
    const value = fact.value.trim();
    if (key && value && !result.has(key)) result.set(key, value);
  }
  return result;
}

function sentence(value: string): string {
  const clean = value.replace(/\s+/g, " ").trim();
  return /[.!?।]$/u.test(clean) ? clean : `${clean}.`;
}

function joinFacts(items: Array<[string, string | undefined]>): string {
  const useful = items.filter((entry): entry is [string, string] => Boolean(entry[1]));
  if (useful.length === 0) return "";
  return useful.map(([label, value]) => `${label} ${value}`).join("; ");
}

function factualSubjectFromSourceTitle(sourceTitle: string): string | undefined {
  const quoted = sourceTitle.match(/[“\"']([^“”\"']{3,60})[”\"']/);
  if (quoted?.[1]) return quoted[1].trim();

  const acronyms = sourceTitle.match(/\b[A-Z][A-Z0-9-]{2,14}\b/g) ?? [];
  return acronyms.find((token) => !ACRONYM_STOP.has(token) && !/^\d/.test(token));
}

function cleanFactValue(value: string): string | undefined {
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean || clean.length > 220 || /https?:\/\//i.test(clean)) return undefined;
  return clean;
}

function factLabel(key: string): string {
  return FACT_LABELS[key] ?? key.replace(/_/g, " ").replace(/^./, (char) => char.toUpperCase());
}

function compact(value: string, max = 112): string {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

function humanDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function lowerFirst(value: string) {
  const clean = value.trim();
  return clean ? `${clean[0]!.toLowerCase()}${clean.slice(1)}` : clean;
}

function readableAction(action: string) {
  return action.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function naturalFactDetail(items: ReadonlyArray<readonly [string, string]>) {
  return items.map(([key, value]) => `${factLabel(key)}: ${value}`).join("; ");
}

function sourceSafeTitle(preferred: string, fallback: string, sourceTitle: string) {
  return titleSimilarity(preferred, sourceTitle) < TITLE_SIMILARITY_LIMIT ? preferred : fallback;
}

function genericVerifiedFactAuthoring(input: AuthoringInput, facts: Map<string, string>, sourceName: string): AuthoringOutput | null {
  const useful = [...facts.entries()]
    .map(([key, value]) => [key, cleanFactValue(value)] as const)
    .filter((entry): entry is readonly [string, string] => Boolean(entry[1]));
  if (useful.length < 2) return null;

  const categoryLabel = CATEGORY_LABELS[input.category] ?? CATEGORY_LABELS.other;
  const actionEntity = cleanFactValue(facts.get("acting_entity") ?? "");
  const officialAction = cleanFactValue(facts.get("official_action") ?? "");
  const actionSubject = cleanFactValue(facts.get("action_subject") ?? "");
  if (actionEntity && officialAction && actionSubject) {
    const action = readableAction(officialAction);
    const preferredTitle = `${sourceName}: ${compact(actionSubject, 118)}`;
    const fallbackTitle = `${sourceName}: ${categoryLabel} announcement`;
    return result({
      input,
      title: sourceSafeTitle(preferredTitle, fallbackTitle, input.sourceTitle),
      summary: `On ${humanDate(input.eventDate)}, ${actionEntity} ${lowerFirst(action)} ${actionSubject}.`,
      oneLiner: `${compact(actionSubject, 118)} — ${compact(actionEntity, 58)}`,
      templateId: "verified_official_action_v1",
      reasons: ["Learner copy states the event directly and anchors it to the Current Affairs date"],
    });
  }

  const winner = cleanFactValue(facts.get("winner") ?? "");
  const award = cleanFactValue(facts.get("award_or_title") ?? "");
  if (winner && award) {
    const preferredTitle = `${sourceName}: ${compact(award, 105)} — ${compact(winner, 60)}`;
    return result({
      input,
      title: sourceSafeTitle(preferredTitle, `${sourceName}: award result`, input.sourceTitle),
      summary: `On ${humanDate(input.eventDate)}, ${winner} was recorded as the winner of ${award}.`,
      oneLiner: `${winner} — ${award}`,
      templateId: "verified_award_result_v1",
      reasons: ["Winner and award are rendered as a direct learner-facing fact"],
    });
  }

  const launchingEntity = cleanFactValue(facts.get("launching_entity") ?? "");
  const initiative = cleanFactValue(facts.get("initiative") ?? "");
  if (launchingEntity && initiative) {
    const preferredTitle = `${sourceName}: ${compact(initiative, 118)}`;
    return result({
      input,
      title: sourceSafeTitle(preferredTitle, `${sourceName}: ${categoryLabel} initiative`, input.sourceTitle),
      summary: `On ${humanDate(input.eventDate)}, ${launchingEntity} launched ${initiative}.`,
      oneLiner: `${initiative} — launched by ${launchingEntity}`,
      templateId: "verified_initiative_v1",
      reasons: ["Initiative wording is expressed as a direct event rather than extraction metadata"],
    });
  }

  const subject = SUBJECT_FACT_PRIORITY
    .map((key) => facts.get(key))
    .map((value) => value ? cleanFactValue(value) : undefined)
    .find(Boolean);
  const selected = useful.slice(0, 4);
  const detail = naturalFactDetail(selected);
  const preferredTitle = subject
    ? `${sourceName}: ${compact(subject, 118)}`
    : `${sourceName}: key ${categoryLabel} development`;
  const title = sourceSafeTitle(preferredTitle, `${sourceName}: key ${categoryLabel} development`, input.sourceTitle);
  const memory = selected.length >= 2
    ? `${compact(selected[0]![1], 85)} · ${compact(selected[1]![1], 85)}`
    : compact(selected[0]?.[1] ?? subject ?? sourceName, 150);
  return result({
    input,
    title,
    summary: `On ${humanDate(input.eventDate)}, this ${categoryLabel} development was recorded with these key details: ${detail}.`,
    oneLiner: memory,
    templateId: "generic_verified_fact_graph_v1",
    reasons: ["Fallback uses only reconciled atomic facts while avoiding internal extraction terminology"],
  });
}

function result(args: {
  input: AuthoringInput;
  title: string;
  summary: string;
  oneLiner: string;
  templateId: string;
  reasons?: string[];
}): AuthoringOutput {
  const similarity = titleSimilarity(args.title, args.input.sourceTitle);
  const reasons = [...(args.reasons ?? [])];
  if (similarity >= TITLE_SIMILARITY_LIMIT) reasons.push("Generated learner title is too similar to the source title");
  const ready = similarity < TITLE_SIMILARITY_LIMIT && args.title.length >= 12 && args.summary.length >= 20;
  return {
    status: ready ? "ready" : "needs_editorial",
    title: ready ? args.title : undefined,
    summary: ready ? sentence(args.summary) : undefined,
    oneLiner: ready ? sentence(args.oneLiner) : undefined,
    templateId: args.templateId,
    sourceTitleSimilarity: similarity,
    reasons,
    inputFingerprint: authoringInputFingerprint(args.input),
  };
}

export function authoringInputFingerprint(input: AuthoringInput): string {
  const stable = JSON.stringify({
    authoringPolicyVersion: AUTHORING_POLICY_VERSION,
    eventId: input.eventId,
    eventDate: input.eventDate,
    category: input.category,
    sourceKey: input.sourceKey ?? "",
    sourceTitle: normalized(input.sourceTitle),
    facts: [...input.facts]
      .map((fact) => ({ key: fact.key.trim().toLowerCase(), value: normalized(fact.value) }))
      .sort((a, b) => a.key.localeCompare(b.key) || a.value.localeCompare(b.value)),
  });
  return createHash("sha256").update(stable).digest("hex");
}

export function authorSourceIndependentEvent(input: AuthoringInput): AuthoringOutput {
  const facts = factMap(input.facts);
  const sourceName = SOURCE_NAMES[input.sourceKey ?? ""] ?? "Official source";
  const appointee = facts.get("appointee");
  const position = facts.get("position");
  if (appointee && position) {
    return result({
      input,
      title: `${appointee} appointed ${position}`,
      summary: `On ${humanDate(input.eventDate)}, ${appointee} was appointed ${position}.`,
      oneLiner: `${appointee} — ${position}`,
      templateId: "appointment_v1",
    });
  }

  const fiIndex = facts.get("index_value");
  if (fiIndex && input.sourceKey === "rbi") {
    return result({
      input,
      title: `RBI Financial Inclusion Index stands at ${fiIndex}`,
      summary: `On ${humanDate(input.eventDate)}, the Reserve Bank of India reported its Financial Inclusion Index at ${fiIndex}.`,
      oneLiner: `RBI Financial Inclusion Index — ${fiIndex}`,
      templateId: "rbi_financial_inclusion_index_v1",
    });
  }

  const repo = facts.get("policy_repo_rate");
  const sdf = facts.get("standing_deposit_facility_rate");
  const msf = facts.get("marginal_standing_facility_rate");
  const bankRate = facts.get("bank_rate");
  const crr = facts.get("cash_reserve_ratio");
  const slr = facts.get("statutory_liquidity_ratio");
  if (input.sourceKey === "rbi" && repo && [sdf, msf, bankRate, crr, slr].filter(Boolean).length >= 1) {
    const detail = joinFacts([
      ["repo rate", repo], ["SDF", sdf], ["MSF", msf], ["Bank Rate", bankRate], ["CRR", crr], ["SLR", slr],
    ]);
    return result({
      input,
      title: `RBI policy rates: repo rate at ${repo}`,
      summary: `On ${humanDate(input.eventDate)}, the RBI policy-rate snapshot showed ${detail}.`,
      oneLiner: `RBI repo rate — ${repo}`,
      templateId: "rbi_policy_rates_v1",
    });
  }

  const mouParties = facts.get("mou_parties");
  if (mouParties) {
    return result({
      input,
      title: `MoU between ${mouParties}`,
      summary: `On ${humanDate(input.eventDate)}, a Memorandum of Understanding was recorded between ${mouParties}.`,
      oneLiner: `MoU parties — ${mouParties}`,
      templateId: "mou_v1",
    });
  }

  const subject = factualSubjectFromSourceTitle(input.sourceTitle);
  const altitude = facts.get("orbit_altitude");
  const repeat = facts.get("repeat_cycle");
  const missionLife = facts.get("mission_life");
  const launcher = facts.get("launcher");
  if (input.sourceKey === "isro" && subject && [altitude, repeat, missionLife, launcher].filter(Boolean).length >= 2) {
    const detail = joinFacts([
      ["orbit altitude", altitude], ["repeat cycle", repeat], ["mission life", missionLife], ["launcher", launcher],
    ]);
    return result({
      input,
      title: `${subject}: key ISRO mission facts`,
      summary: `For ${subject}, the key mission details are ${detail}.`,
      oneLiner: `${subject} — ${detail}`,
      templateId: "isro_mission_facts_v1",
      reasons: ["Subject name is extracted as a factual acronym/entity from source evidence; source wording is not reused"],
    });
  }

  const outlay = facts.get("scheme_outlay");
  const beneficiaries = facts.get("beneficiary_count");
  const effectiveDate = facts.get("effective_date");
  if (outlay && (beneficiaries || effectiveDate)) {
    const detail = joinFacts([
      ["outlay", outlay], ["beneficiaries", beneficiaries], ["effective date", effectiveDate],
    ]);
    return result({
      input,
      title: `${sourceName} programme: ${outlay} outlay`,
      summary: `On ${humanDate(input.eventDate)}, the programme details included ${detail}.`,
      oneLiner: `${sourceName} programme — ${detail}`,
      templateId: "programme_outlay_v1",
    });
  }

  const generic = genericVerifiedFactAuthoring(input, facts, sourceName);
  if (generic) return generic;

  return {
    status: "needs_editorial",
    sourceTitleSimilarity: 0,
    reasons: ["Verified fact graph is too thin for safe source-independent learner wording"],
    inputFingerprint: authoringInputFingerprint(input),
  };
}
