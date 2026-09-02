const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "being", "by", "for", "from",
  "govt", "government", "has", "have", "had", "in", "india", "indian", "is", "it", "its",
  "ministry", "department", "new", "of", "on", "or", "that", "the", "their", "this", "to",
  "under", "was", "were", "will", "with", "across", "after", "before", "centre", "central",
]);

const PHRASE_ALIASES = [
  ["indian standard time", "ist"],
  ["legal metrology", "legal_metrology"],
  ["reserve bank of india", "rbi"],
  ["securities and exchange board of india", "sebi"],
  ["competition commission of india", "cci"],
  ["bureau of indian standards", "bis"],
  ["national payments corporation of india", "npci"],
  ["insurance regulatory and development authority of india", "irdai"],
  ["pension fund regulatory and development authority", "pfrda"],
  ["directorate general of foreign trade", "dgft"],
  ["ministry of statistics and programme implementation", "mospi"],
  ["niti aayog", "niti_aayog"],
  ["goods and services tax", "gst"],
  ["shanghai cooperation organisation", "sco"],
  ["shanghai cooperation organization", "sco"],
  ["indian space research organisation", "isro"],
  ["indian space research organization", "isro"],
  ["defence research and development organisation", "drdo"],
  ["defense research and development organization", "drdo"],
] as const;

const ALIAS_TERMS = new Set(PHRASE_ALIASES.map(([, alias]) => alias));

const WORD_ROOTS: Record<string, string> = {
  announces: "announce",
  announced: "announce",
  announcing: "announce",
  approves: "approve",
  approved: "approve",
  approving: "approve",
  appoints: "appoint",
  appointed: "appoint",
  appointing: "appoint",
  launches: "launch",
  launched: "launch",
  launching: "launch",
  notifies: "notify",
  notified: "notify",
  notifying: "notify",
  signs: "sign",
  signed: "sign",
  signing: "sign",
  releases: "release",
  released: "release",
  releasing: "release",
  amends: "amend",
  amended: "amend",
  amending: "amend",
  introduces: "introduce",
  introduced: "introduce",
  introducing: "introduce",
};

function assertDateOnly(value: string) {
  if (!DATE_ONLY.test(value)) throw new Error("One-day rescue requires YYYY-MM-DD target date");
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error("One-day rescue target date is invalid");
  }
  return value;
}

export function previousCalendarDate(targetDate: string) {
  assertDateOnly(targetDate);
  const parsed = new Date(`${targetDate}T00:00:00Z`);
  parsed.setUTCDate(parsed.getUTCDate() - 1);
  return parsed.toISOString().slice(0, 10);
}

function normalizeWord(raw: string) {
  const word = WORD_ROOTS[raw] ?? raw;
  if (/^20\d{2}$/.test(word)) return "";
  if (word.length > 4 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

export function headlineRescueTerms(value: string) {
  const normalized = String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const aliases = PHRASE_ALIASES
    .filter(([phrase]) => normalized.includes(phrase))
    .map(([, alias]) => alias);

  const terms = normalized
    .split(" ")
    .map(normalizeWord)
    .filter((term) => term.length >= 2 && !STOP_WORDS.has(term));

  return [...new Set([...terms, ...aliases])].sort();
}

export type HeadlineRescueSimilarity = {
  score: number;
  sharedTerms: string[];
  sharedAliasTerms: string[];
  leftTerms: string[];
  rightTerms: string[];
  jaccard: number;
  containment: number;
};

export function headlineRescueSimilarity(left: string, right: string): HeadlineRescueSimilarity {
  const leftTerms = headlineRescueTerms(left);
  const rightTerms = headlineRescueTerms(right);
  const leftSet = new Set(leftTerms);
  const rightSet = new Set(rightTerms);
  const sharedTerms = leftTerms.filter((term) => rightSet.has(term));
  const sharedAliasTerms = sharedTerms.filter((term) => ALIAS_TERMS.has(term));
  const unionSize = new Set([...leftTerms, ...rightTerms]).size;
  const minimumSize = Math.min(leftSet.size, rightSet.size);
  const jaccard = unionSize ? sharedTerms.length / unionSize : 0;
  const containment = minimumSize ? sharedTerms.length / minimumSize : 0;
  const aliasBoost = sharedAliasTerms.length > 0 ? 0.08 : 0;
  const score = Math.min(1, 0.55 * containment + 0.45 * jaccard + aliasBoost);

  return {
    score: Number(score.toFixed(4)),
    sharedTerms,
    sharedAliasTerms,
    leftTerms,
    rightTerms,
    jaccard: Number(jaccard.toFixed(4)),
    containment: Number(containment.toFixed(4)),
  };
}

export function isOneDayOfficialRescueMatch(left: string, right: string, threshold = 0.48) {
  const similarity = headlineRescueSimilarity(left, right);
  const enoughIdentity = similarity.sharedTerms.length >= 3
    || (similarity.sharedAliasTerms.length >= 1 && similarity.sharedTerms.length >= 2);
  return {
    ...similarity,
    matched: enoughIdentity && similarity.score >= threshold,
    threshold,
  };
}

export const ONE_DAY_RESCUE_POLICY_VERSION = "cp052-one-day-official-rescue-v1";
