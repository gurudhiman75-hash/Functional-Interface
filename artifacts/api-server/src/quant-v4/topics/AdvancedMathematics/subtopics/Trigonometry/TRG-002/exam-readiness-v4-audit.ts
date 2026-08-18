import { TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS, generateExamRealLocalizedTrg002Question } from "./localization-exam-realness-v2";
import { assertTrg002V4ScenarioCatalog } from "./exam-readiness-v4-scenario-engine";

type AuditRecord = {
  qlId: string;
  locale: "hi-IN" | "pa-IN";
  stem: string;
  difficulty: string;
  explanation: any;
};

function learnerText(record: AuditRecord) {
  return [record.stem, record.explanation.keyRule, ...record.explanation.steps.map((s: any) => s.body), record.explanation.shortcut, ...record.explanation.traps].join(" ");
}

function normalizeStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/√\s*#/g, "√#")
    .replace(/\s+/g, " ")
    .trim();
}

function scenarioDomain(stem: string) {
  const s = stem.toLowerCase();
  if (/छाया|ਪਰਛਾਂਵ|shadow/u.test(s)) return "SHADOW";
  if (/जहाज|नाव|नदी|लाइटहाउस|समुद्र|ਕਿਸ਼ਤੀ|ਜਹਾਜ਼|ਨਦੀ|ਲਾਈਟਹਾਊਸ|ਸਮੁੰਦਰ/u.test(s)) return "WATER";
  if (/कार|वाहन|सड़क|रोड|ਕਾਰ|ਵਾਹਨ|ਸੜਕ/u.test(s)) return "ROAD_MOVEMENT";
  if (/सीढ़ी|तार|रस्सी|ਸੀੜ੍ਹੀ|ਤਾਰ|ਰੱਸੀ/u.test(s)) return "SUPPORT";
  if (/इमारत|छत|बालकनी|ਇਮਾਰਤ|ਛੱਤ|ਬਾਲਕਨੀ/u.test(s)) return "URBAN";
  if (/पेड़|वृक्ष|चट्टान|पहाड़ी|ਦਰੱਖਤ|ਚੱਟਾਨ|ਪਹਾੜ/u.test(s)) return "NATURAL";
  if (/मीनार|खंभ|स्तंभ|झंड|ਮੀਨਾਰ|ਖੰਭ|ਥੰਮ੍ਹ|ਝੰਡ/u.test(s)) return "GROUND_VERTICAL";
  return "OTHER";
}

export function buildTrg002V4BaselineAudit(seed = "trg002-v4-baseline-audit") {
  const catalog = assertTrg002V4ScenarioCatalog();
  const records: AuditRecord[] = [];
  for (const qlId of TRG_002_EXAM_REALNESS_LOCALIZATION_QL_IDS) {
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const q: any = generateExamRealLocalizedTrg002Question(qlId, seed, locale);
      records.push({ qlId, locale, stem: q.stem, difficulty: q.difficulty, explanation: q.explanation });
    }
  }

  const hindi = records.filter((r) => r.locale === "hi-IN");
  const malformedExactMath = records.filter((r) => /√\d+\.\d+/u.test(learnerText(r)));
  const surdPhysicalGivens = hindi.filter((r) => /√\d+\s*m\b/u.test(r.stem));
  const floatingElevatedObservers = hindi.filter((r) => /जमीन से .+ ऊँचे (?:अवलोकन|निरीक्षण) बिंदु/u.test(r.stem));
  const shallowHardSolutions = hindi.filter((r) => r.difficulty === "Hard" && /(?:हल करने पर|हल करने से|समीकरण हल)/u.test(learnerText(r)));

  const normalizedGroups = new Map<string, string[]>();
  for (const r of hindi) {
    const key = normalizeStem(r.stem);
    normalizedGroups.set(key, [...(normalizedGroups.get(key) ?? []), r.qlId]);
  }
  const duplicateStemGroups = [...normalizedGroups.entries()]
    .filter(([, ids]) => new Set(ids).size > 1)
    .map(([normalizedStem, ids]) => ({ normalizedStem, qlIds: [...new Set(ids)] }))
    .filter((group) => group.qlIds.length > 1);

  const scenarioCounts = new Map<string, number>();
  for (const r of hindi) {
    const domain = scenarioDomain(r.stem);
    scenarioCounts.set(domain, (scenarioCounts.get(domain) ?? 0) + 1);
  }

  const blockers = {
    malformedExactMath: malformedExactMath.map((r) => `${r.qlId}:${r.locale}`),
    duplicateStemGroups,
    surdPhysicalGivenQlIds: surdPhysicalGivens.map((r) => r.qlId),
    floatingElevatedObserverQlIds: floatingElevatedObservers.map((r) => r.qlId),
    shallowHardSolutionQlIds: shallowHardSolutions.map((r) => r.qlId),
  };

  return {
    version: "TRG002_EXAM_READINESS_V4_BASELINE",
    qls: 96,
    bilingualRecords: records.length,
    scenarioCatalog: catalog,
    currentScenarioDomainCounts: Object.fromEntries([...scenarioCounts.entries()].sort()),
    blockers,
    readyForV4Freeze: false,
    governance: {
      mutatesFrozenEnglishAuthority: false,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioDiscoverable: false,
    },
  } as const;
}
