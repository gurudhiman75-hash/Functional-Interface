const GENERIC_CATEGORY_PHRASES = [
  "national affairs",
  "economy and banking",
  "economy & banking",
  "international affairs",
  "appointment",
  "appointments",
  "award",
  "awards",
  "report and index",
  "reports and indices",
  "sports",
  "science and technology",
  "science & technology",
  "space",
  "defence",
  "defense",
  "environment",
  "books and authors",
  "important day",
  "important days",
  "summit",
  "summits",
  "obituary",
  "obituaries",
  "punjab affairs",
  "current affairs",
] as const;

const GENERIC_TAILS = [
  "development",
  "announcement",
  "initiative",
  "update",
  "news",
  "story",
  "event",
] as const;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const categoryPattern = GENERIC_CATEGORY_PHRASES.map(escapeRegExp).join("|");
const tailPattern = GENERIC_TAILS.map(escapeRegExp).join("|");
const GENERIC_SOURCE_CATEGORY_TITLE = new RegExp(
  `^[^:]{2,140}:\\s+(?:key\\s+)?(?:${categoryPattern})\\s+(?:${tailPattern})$`,
  "i",
);
const GENERIC_BARE_CATEGORY_TITLE = new RegExp(
  `^(?:key\\s+)?(?:${categoryPattern})\\s+(?:${tailPattern})$`,
  "i",
);

export function isGenericCurrentAffairsLearnerTitle(value: string) {
  const title = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!title) return false;
  return GENERIC_SOURCE_CATEGORY_TITLE.test(title) || GENERIC_BARE_CATEGORY_TITLE.test(title);
}

export function factualFallbackTitle(factsInput: Array<{ key: string; value: string }>) {
  const facts = new Map(
    factsInput
      .map((fact) => [String(fact.key ?? "").trim().toLowerCase(), String(fact.value ?? "").replace(/\s+/g, " ").trim()] as const)
      .filter(([key, value]) => key && value),
  );

  const target = facts.get("target_percentage");
  const targetYear = facts.get("target_year");
  if (target && targetYear) return `${target} target by ${targetYear}`;

  const outlay = facts.get("scheme_outlay");
  const beneficiaries = facts.get("beneficiary_count");
  if (outlay && beneficiaries) return `${outlay} programme for ${beneficiaries}`;

  const appointee = facts.get("appointee");
  const position = facts.get("position");
  if (appointee && position) return `${appointee} appointed ${position}`;

  const winner = facts.get("winner");
  const award = facts.get("award_or_title");
  if (winner && award) return `${winner} wins ${award}`;

  const initiative = facts.get("initiative");
  const launchingEntity = facts.get("launching_entity");
  if (initiative && launchingEntity) return `${initiative} — ${launchingEntity}`;

  const actionSubject = facts.get("action_subject");
  const actingEntity = facts.get("acting_entity");
  if (actionSubject && actingEntity) return `${actionSubject} — ${actingEntity}`;

  return null;
}

export const CURRENT_AFFAIRS_LEARNER_TITLE_QUALITY_VERSION = "ca-cp055-universal-title-quality-v1";
