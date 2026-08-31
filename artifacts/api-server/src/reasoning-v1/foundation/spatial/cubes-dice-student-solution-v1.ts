import {
  oppositeNetLabelV1,
  type CubeNetCellV1,
} from "./cubes-dice-foundation-v1";
import type { CubesDicePermanentEnglishQuestionV1 } from "./cubes-dice-permanent-english-runtime-v1";
import type { CubesDiceVoxelPermanentEnglishQuestionV1 } from "./cubes-dice-voxel-projection-permanent-english-runtime-v1";

export type CubesDiceStudentSolutionLanguageV1 = "en" | "hi" | "pa";

export interface CubesDiceStudentSolutionTableV1 {
  title: string;
  headers: readonly string[];
  rows: readonly (readonly string[])[];
  emphasizedRowIndexes: readonly number[];
}

export interface CubesDiceStudentSolutionV1 {
  version: "CND-001-STUDENT-SOLUTION-V1";
  language: CubesDiceStudentSolutionLanguageV1;
  presentationModel: "LOGIC_RULE_THEN_EXACT_WORKING_THEN_ANSWER";
  logicRule: string;
  tables: readonly CubesDiceStudentSolutionTableV1[];
  steps: readonly string[];
  note: string | null;
  answerLine: string;
  quality: Readonly<{
    questionSpecific: true;
    exactCalculationOrDeductionShown: true;
    engineTerminologyHidden: true;
    stemNotRepeated: true;
    finalAnswerExplicit: true;
  }>;
}

export const CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-STUDENT-SOLUTION-V4-AUTHORITY-V1" as const,
  chapterCode: "CND-001" as const,
  permanentQlIds: Object.freeze(["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"] as const),
  presentationModel: "LOGIC_RULE_THEN_EXACT_WORKING_THEN_ANSWER" as const,
  approvedReviewSurface: "CND-001-COMPETITOR-GRADE-EXPLANATIONS-V4" as const,
  productOwnerReviewStatus: "ENGLISH_APPROVED_2026_08_31" as const,
  languageReviewStatus: Object.freeze({
    en: "PRODUCT_OWNER_APPROVED" as const,
    hi: "GENERATED_REVIEW_REQUIRED" as const,
    pa: "GENERATED_REVIEW_REQUIRED" as const,
  }),
  requiredComponents: Object.freeze([
    "APPLICABLE_RULE",
    "QUESTION_SPECIFIC_OBSERVATION_OR_TABLE_WHERE_USEFUL",
    "EXACT_DEDUCTION_OR_CALCULATION",
    "EXPLICIT_FINAL_ANSWER",
  ] as const),
  forbiddenStudentFacingTerms: Object.freeze([
    "solver-attested",
    "occupied-voxel",
    "height matrix",
    "renderer authority",
    "runtime proof",
  ] as const),
  automaticStudentPublication: false,
  questionStudioRegistrationAuthorized: false,
  nextGate: "CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_V2_OPERATOR_REVIEW" as const,
});

function table(
  title: string,
  headers: readonly string[],
  rows: readonly (readonly string[])[],
  emphasizedRowIndexes: readonly number[] = [],
): CubesDiceStudentSolutionTableV1 {
  return Object.freeze({
    title,
    headers: Object.freeze([...headers]),
    rows: Object.freeze(rows.map((row) => Object.freeze([...row]))),
    emphasizedRowIndexes: Object.freeze([...emphasizedRowIndexes]),
  });
}

function solution(
  language: CubesDiceStudentSolutionLanguageV1,
  logicRule: string,
  tables: readonly CubesDiceStudentSolutionTableV1[],
  steps: readonly string[],
  answerLine: string,
  note: string | null = null,
): CubesDiceStudentSolutionV1 {
  const result: CubesDiceStudentSolutionV1 = Object.freeze({
    version: "CND-001-STUDENT-SOLUTION-V1",
    language,
    presentationModel: "LOGIC_RULE_THEN_EXACT_WORKING_THEN_ANSWER",
    logicRule,
    tables: Object.freeze([...tables]),
    steps: Object.freeze([...steps]),
    note,
    answerLine,
    quality: Object.freeze({
      questionSpecific: true as const,
      exactCalculationOrDeductionShown: true as const,
      engineTerminologyHidden: true as const,
      stemNotRepeated: true as const,
      finalAnswerExplicit: true as const,
    }),
  });
  const surface = [result.logicRule, ...result.steps, result.note ?? "", result.answerLine, ...result.tables.flatMap((row) => [row.title, ...row.headers, ...row.rows.flat()])].join(" ").toLowerCase();
  for (const forbidden of CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1.forbiddenStudentFacingTerms) {
    if (surface.includes(forbidden)) throw new Error(`CND student solution leaked engine terminology: ${forbidden}.`);
  }
  return result;
}

function targetFromEnglishStem(stem: string): string {
  const match = stem.match(/opposite(?:\s+to)?\s+([A-Z0-9]+)(?:\?|\.|\s|$)/i);
  if (!match?.[1]) throw new Error(`CND student solution cannot resolve target from: ${stem}`);
  return match[1];
}

function paintedFaceCountFromEnglishStem(stem: string): number {
  const match = stem.match(/exactly\s+(\d+)\s+(?:painted\s+)?faces?/i);
  if (!match?.[1]) throw new Error(`CND student solution cannot resolve painted-face count from: ${stem}`);
  return Number(match[1]);
}

function answerSentence(language: CubesDiceStudentSolutionLanguageV1, answer: string | number, target?: string): string {
  if (target) {
    if (language === "hi") return `अतः ${target} के विपरीत फलक ${answer} है।`;
    if (language === "pa") return `ਇਸ ਲਈ ${target} ਦੇ ਉਲਟ ਫਲਕ ${answer} ਹੈ।`;
    return `Therefore, face ${answer} is opposite to face ${target}.`;
  }
  if (language === "hi") return `अतः सही उत्तर ${answer} है।`;
  if (language === "pa") return `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`;
  return `Therefore, the correct answer is ${answer}.`;
}

function diceSolution(source: CubesDicePermanentEnglishQuestionV1, language: CubesDiceStudentSolutionLanguageV1): CubesDiceStudentSolutionV1 {
  const target = targetFromEnglishStem(source.stem);
  const answer = String(source.answer);
  const observations = source.scene.observations as readonly { top: string; front: string; right: string }[];
  if (!observations?.[0] || !observations?.[1]) throw new Error(`${source.seed}: dice observations missing.`);
  const first = [observations[0].top, observations[0].front, observations[0].right] as const;
  const second = [observations[1].top, observations[1].front, observations[1].right] as const;
  const common = first.filter((label) => second.includes(label));
  const viewHeaders = language === "hi" ? ["स्थिति", "ऊपर", "सामने", "दायाँ"] : language === "pa" ? ["ਸਥਿਤੀ", "ਉੱਪਰ", "ਸਾਹਮਣੇ", "ਸੱਜਾ"] : ["View", "Top", "Front", "Right"];
  const viewTable = table(
    language === "hi" ? "दिए गए दोनों दृश्य" : language === "pa" ? "ਦਿੱਤੇ ਦੋਵੇਂ ਦ੍ਰਿਸ਼" : "Given views",
    viewHeaders,
    [["I", ...first], ["II", ...second]],
  );

  if (common.length === 2) {
    const changingFirst = first.find((label) => !common.includes(label))!;
    const changingSecond = second.find((label) => !common.includes(label))!;
    if (language === "hi") return solution(language,
      "यदि पासे की दो स्थितियों में दो पास-पास वाले फलक समान हों, तो दोनों स्थितियों के अलग-अलग तीसरे फलक एक-दूसरे के विपरीत होते हैं।",
      [viewTable, table("तुलना", ["समान फलक", "बदलने वाले फलक", "विपरीत जोड़ी"], [[common.join(", "), `${changingFirst}, ${changingSecond}`, `${changingFirst} ↔ ${changingSecond}`]], [0])],
      [`दोनों स्थितियों में समान फलक ${common.join(" और ")} हैं।`, `तीसरा फलक पहली स्थिति में ${changingFirst} और दूसरी में ${changingSecond} है।`, `इसलिए ${changingFirst} और ${changingSecond} विपरीत फलक हैं।`],
      answerSentence(language, answer, target));
    if (language === "pa") return solution(language,
      "ਜੇ ਪਾਸੇ ਦੀਆਂ ਦੋ ਸਥਿਤੀਆਂ ਵਿੱਚ ਦੋ ਨਾਲ-ਨਾਲ ਵਾਲੇ ਫਲਕ ਇੱਕੋ ਹਨ, ਤਾਂ ਦੋਵੇਂ ਸਥਿਤੀਆਂ ਦੇ ਵੱਖਰੇ ਤੀਜੇ ਫਲਕ ਇਕ-ਦੂਜੇ ਦੇ ਉਲਟ ਹੁੰਦੇ ਹਨ।",
      [viewTable, table("ਤੁਲਨਾ", ["ਸਾਂਝੇ ਫਲਕ", "ਬਦਲਦੇ ਫਲਕ", "ਉਲਟ ਜੋੜਾ"], [[common.join(", "), `${changingFirst}, ${changingSecond}`, `${changingFirst} ↔ ${changingSecond}`]], [0])],
      [`ਦੋਵੇਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਸਾਂਝੇ ਫਲਕ ${common.join(" ਅਤੇ ")} ਹਨ।`, `ਤੀਜਾ ਫਲਕ ਪਹਿਲੀ ਸਥਿਤੀ ਵਿੱਚ ${changingFirst} ਅਤੇ ਦੂਜੀ ਵਿੱਚ ${changingSecond} ਹੈ।`, `ਇਸ ਲਈ ${changingFirst} ਅਤੇ ${changingSecond} ਉਲਟ ਫਲਕ ਹਨ।`],
      answerSentence(language, answer, target));
    return solution(language,
      "If two positions of the same die have the same two adjacent faces, the two different third faces are opposite to each other.",
      [viewTable, table("Comparison", ["Common faces", "Changing faces", "Opposite pair"], [[common.join(", "), `${changingFirst}, ${changingSecond}`, `${changingFirst} ↔ ${changingSecond}`]], [0])],
      [`The common faces are ${common.join(" and ")}.`, `The third face changes from ${changingFirst} in View I to ${changingSecond} in View II.`, `Hence ${changingFirst} and ${changingSecond} occupy opposite faces.`],
      answerSentence(language, answer, target));
  }

  if (common.length === 1) {
    const commonFace = common[0]!;
    const visible = new Set([...first, ...second]);
    const labels = source.scene.labels as readonly string[];
    const missing = labels.find((label) => !visible.has(label));
    const around = [...visible].filter((label) => label !== commonFace);
    if (target === commonFace || answer === commonFace) {
      const opposite = target === commonFace ? answer : target;
      const headers = language === "hi" ? ["समान फलक", "चार पास वाले फलक", "विपरीत फलक"] : language === "pa" ? ["ਸਾਂਝਾ ਫਲਕ", "ਚਾਰ ਨਾਲ ਵਾਲੇ ਫਲਕ", "ਉਲਟ ਫਲਕ"] : ["Common face", "Four adjacent faces", "Opposite face"];
      const t = table(language === "hi" ? "फलक संबंध" : language === "pa" ? "ਫਲਕ ਸੰਬੰਧ" : "Face relation", headers, [[commonFace, around.join(", "), opposite]], [0]);
      if (language === "hi") return solution(language, "घन के किसी एक फलक के चार फलक पास होते हैं और केवल एक फलक उसके विपरीत होता है।", [viewTable, t], [`${commonFace} दोनों स्थितियों में समान फलक है।`, `दोनों दृश्यों से ${around.join(", ")} इसके चारों पास वाले फलक हैं।`, `इसलिए बचा हुआ फलक ${opposite}, ${commonFace} के विपरीत होगा।`], answerSentence(language, answer, target));
      if (language === "pa") return solution(language, "ਘਣ ਦੇ ਕਿਸੇ ਇੱਕ ਫਲਕ ਨਾਲ ਚਾਰ ਫਲਕ ਲੱਗਦੇ ਹਨ ਅਤੇ ਕੇਵਲ ਇੱਕ ਫਲਕ ਉਸਦੇ ਉਲਟ ਹੁੰਦਾ ਹੈ।", [viewTable, t], [`${commonFace} ਦੋਵੇਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਸਾਂਝਾ ਫਲਕ ਹੈ।`, `ਦੋਵੇਂ ਦ੍ਰਿਸ਼ਾਂ ਤੋਂ ${around.join(", ")} ਇਸਦੇ ਚਾਰ ਨਾਲ ਵਾਲੇ ਫਲਕ ਹਨ।`, `ਇਸ ਲਈ ਬਚਿਆ ਫਲਕ ${opposite}, ${commonFace} ਦੇ ਉਲਟ ਹੈ।`], answerSentence(language, answer, target));
      return solution(language, "A cube face has exactly four adjacent faces and one opposite face.", [viewTable, t], [`Face ${commonFace} is common to both views.`, `The four faces ${around.join(", ")} are all adjacent to ${commonFace}.`, `The remaining face ${opposite} must therefore be opposite to ${commonFace}.`], answerSentence(language, answer, target));
    }

    const sideFaces = around;
    if (sideFaces.length !== 4) throw new Error(`${source.seed}: one-common-face dice explanation expected four side faces.`);
    const pair1 = first.filter((label) => label !== commonFace);
    const pair2 = second.filter((label) => label !== commonFace);
    const permutations = (values: readonly string[]): string[][] => {
      if (values.length <= 1) return [values.slice()];
      const out: string[][] = [];
      values.forEach((value, index) => {
        const rest = values.filter((_, restIndex) => restIndex !== index);
        for (const tail of permutations(rest)) out.push([value, ...tail]);
      });
      return out;
    };
    const isAdjacent = (cycle: readonly string[], a: string, b: string) => {
      const distance = Math.abs(cycle.indexOf(a) - cycle.indexOf(b));
      return distance === 1 || distance === 3;
    };
    const isOpposite = (cycle: readonly string[], a: string, b: string) => Math.abs(cycle.indexOf(a) - cycle.indexOf(b)) === 2;
    const cycle = permutations(sideFaces).find((candidate) => isAdjacent(candidate, pair1[0]!, pair1[1]!) && isAdjacent(candidate, pair2[0]!, pair2[1]!) && isOpposite(candidate, target, answer));
    if (!cycle) throw new Error(`${source.seed}: could not construct a student-facing side-face ring.`);
    const ring = `${cycle.join(" → ")} → ${cycle[0]}`;
    const ringTable = table(language === "hi" ? `समान फलक ${commonFace} को स्थिर रखने पर` : language === "pa" ? `ਸਾਂਝੇ ਫਲਕ ${commonFace} ਨੂੰ ਸਥਿਰ ਰੱਖਣ ਤੇ` : `With common face ${commonFace} fixed`, [language === "hi" ? "चारों ओर क्रम" : language === "pa" ? "ਚਾਰੋਂ ਪਾਸੇ ਕ੍ਰਮ" : "Order around the face"], [[ring]], [0]);
    if (language === "hi") return solution(language, "एक समान फलक को स्थिर रखकर उसके चारों ओर के फलकों का क्रम बनाइए। इस क्रम में दो स्थान की दूरी वाले फलक विपरीत होते हैं।", [viewTable, ringTable], [`समान फलक ${commonFace} को स्थिर रखते हैं।`, `चारों ओर का क्रम ${ring} बनता है।`, `${target} और ${answer} इस क्रम में दो स्थान की दूरी पर हैं, इसलिए वे विपरीत हैं।`], answerSentence(language, answer, target));
    if (language === "pa") return solution(language, "ਇੱਕ ਸਾਂਝੇ ਫਲਕ ਨੂੰ ਸਥਿਰ ਰੱਖ ਕੇ ਉਸਦੇ ਚਾਰੋਂ ਪਾਸੇ ਵਾਲੇ ਫਲਕਾਂ ਦਾ ਕ੍ਰਮ ਬਣਾਓ। ਇਸ ਕ੍ਰਮ ਵਿੱਚ ਦੋ ਥਾਵਾਂ ਦੀ ਦੂਰੀ ਵਾਲੇ ਫਲਕ ਉਲਟ ਹੁੰਦੇ ਹਨ।", [viewTable, ringTable], [`ਸਾਂਝੇ ਫਲਕ ${commonFace} ਨੂੰ ਸਥਿਰ ਰੱਖਦੇ ਹਾਂ।`, `ਚਾਰੋਂ ਪਾਸੇ ਦਾ ਕ੍ਰਮ ${ring} ਬਣਦਾ ਹੈ।`, `${target} ਅਤੇ ${answer} ਇਸ ਕ੍ਰਮ ਵਿੱਚ ਦੋ ਥਾਵਾਂ ਦੀ ਦੂਰੀ ਤੇ ਹਨ, ਇਸ ਲਈ ਉਹ ਉਲਟ ਹਨ।`], answerSentence(language, answer, target));
    return solution(language, "Keep the one common face fixed and arrange the four surrounding faces in order. Faces two positions apart in this ring are opposite.", [viewTable, ringTable], [`Keep face ${commonFace} fixed.`, `The side-face order is ${ring}.`, `${target} and ${answer} are two positions apart in this ring, so they are opposite.`], answerSentence(language, answer, target), missing ? `The only face not adjacent to ${commonFace} is ${missing}.` : null);
  }

  throw new Error(`${source.seed}: unsupported dice-view overlap for student explanation.`);
}

function netSolution(source: CubesDicePermanentEnglishQuestionV1, language: CubesDiceStudentSolutionLanguageV1): CubesDiceStudentSolutionV1 {
  const target = targetFromEnglishStem(source.stem);
  const answer = String(source.answer);
  const cells = source.scene.cells as readonly CubeNetCellV1[];
  const labels = cells.map((cell) => cell.label);
  const seen = new Set<string>();
  const pairs: string[][] = [];
  for (const label of labels) {
    if (seen.has(label)) continue;
    const opposite = oppositeNetLabelV1(cells, label);
    seen.add(label);
    seen.add(opposite);
    pairs.push([label, opposite]);
  }
  const headers = language === "hi" ? ["फलक", "मोड़ने पर विपरीत फलक"] : language === "pa" ? ["ਫਲਕ", "ਮੋੜਨ ਤੋਂ ਬਾਅਦ ਉਲਟ ਫਲਕ"] : ["Face", "Opposite face after folding"];
  const pairTable = table(language === "hi" ? "विपरीत फलकों की जोड़ियाँ" : language === "pa" ? "ਉਲਟ ਫਲਕਾਂ ਦੇ ਜੋੜੇ" : "Opposite-face pairs", headers, pairs, [pairs.findIndex((pair) => pair.includes(target))]);
  if (language === "hi") return solution(language, "जाल को मोड़ते समय प्रत्येक जुड़े वर्ग को साझा किनारे पर 90° मोड़ें। जो दो फलक अंत में उलटी दिशाओं में हों, वे विपरीत फलक हैं।", [pairTable], ["दिए गए जाल को क्रम से मोड़ने पर ऊपर दी गई तीन विपरीत जोड़ियाँ बनती हैं।", `${target} वाली जोड़ी ${target} ↔ ${answer} है।`], answerSentence(language, answer, target));
  if (language === "pa") return solution(language, "ਜਾਲ ਨੂੰ ਮੋੜਦੇ ਸਮੇਂ ਹਰ ਜੁੜੇ ਵਰਗ ਨੂੰ ਸਾਂਝੇ ਕਿਨਾਰੇ ਉੱਤੇ 90° ਮੋੜੋ। ਅੰਤ ਵਿੱਚ ਉਲਟ ਦਿਸ਼ਾਵਾਂ ਵੱਲ ਮੂੰਹ ਕਰਨ ਵਾਲੇ ਦੋ ਫਲਕ ਇਕ-ਦੂਜੇ ਦੇ ਉਲਟ ਹੁੰਦੇ ਹਨ।", [pairTable], ["ਦਿੱਤੇ ਜਾਲ ਨੂੰ ਮੋੜਨ ਤੇ ਉੱਪਰ ਦਿੱਤੇ ਤਿੰਨ ਉਲਟ ਜੋੜੇ ਬਣਦੇ ਹਨ।", `${target} ਵਾਲਾ ਜੋੜਾ ${target} ↔ ${answer} ਹੈ।`], answerSentence(language, answer, target));
  return solution(language, "Fold each connected square through 90° along its shared edge. Faces that finally point in opposite directions form an opposite pair.", [pairTable], ["Folding the given net gives the three opposite-face pairs shown above.", `The pair containing ${target} is ${target} ↔ ${answer}.`], answerSentence(language, answer, target));
}

function paintedSolution(source: CubesDicePermanentEnglishQuestionV1, language: CubesDiceStudentSolutionLanguageV1): CubesDiceStudentSolutionV1 {
  const n = Number(source.scene.subdivisionsPerEdge);
  const faceCount = paintedFaceCountFromEnglishStem(source.stem);
  const answer = Number(source.answer);
  const formulaRows = [["3", "8"], ["2", "12(n − 2)"], ["1", "6(n − 2)²"], ["0", "(n − 2)³"]];
  const headers = language === "hi" ? ["ठीक इतने रंगे फलक", "सूत्र"] : language === "pa" ? ["ਠੀਕ ਇੰਨੇ ਰੰਗੇ ਫਲਕ", "ਸੂਤਰ"] : ["Exactly this many painted faces", "Formula"];
  const formulaTable = table(language === "hi" ? "मानक सूत्र" : language === "pa" ? "ਮਿਆਰੀ ਸੂਤਰ" : "Standard painted-cube formulas", headers, formulaRows, [3 - faceCount]);
  const calc = faceCount === 3
    ? "8"
    : faceCount === 2
      ? `12 × (${n} − 2) = 12 × ${n - 2} = ${12 * (n - 2)}`
      : faceCount === 1
        ? `6 × (${n} − 2)² = 6 × ${(n - 2) ** 2} = ${6 * (n - 2) ** 2}`
        : `(${n} − 2)³ = ${n - 2}³ = ${(n - 2) ** 3}`;
  const position = faceCount === 3 ? "corner" : faceCount === 2 ? "edge (excluding corners)" : faceCount === 1 ? "inside a face, away from edges" : "completely internal";
  if (language === "hi") return solution(language, "सभी छह बाहरी फलक रंगे हों तो छोटे घनों की स्थिति के अनुसार मानक सूत्र सीधे लगाए जा सकते हैं।", [formulaTable], [`हर किनारे पर n = ${n} भाग हैं।`, `ठीक ${faceCount} रंगे फलक वाले घनों के लिए संबंधित सूत्र लगाएँ।`, `गणना: ${calc}।`], answerSentence(language, answer), faceCount === 2 ? "कोने के घन इसमें नहीं गिने जाते; उन पर 3 फलक रंगे होते हैं।" : null);
  if (language === "pa") return solution(language, "ਜੇ ਘਣ ਦੇ ਸਾਰੇ ਛੇ ਬਾਹਰੀ ਫਲਕ ਰੰਗੇ ਹੋਣ ਤਾਂ ਛੋਟੇ ਘਣਾਂ ਦੀ ਸਥਿਤੀ ਅਨੁਸਾਰ ਮਿਆਰੀ ਸੂਤਰ ਸਿੱਧੇ ਲਾਗੂ ਹੁੰਦੇ ਹਨ।", [formulaTable], [`ਹਰ ਕਿਨਾਰੇ ਉੱਤੇ n = ${n} ਹਿੱਸੇ ਹਨ।`, `ਠੀਕ ${faceCount} ਰੰਗੇ ਫਲਕਾਂ ਵਾਲੇ ਘਣਾਂ ਲਈ ਸੰਬੰਧਿਤ ਸੂਤਰ ਲਗਾਓ।`, `ਗਣਨਾ: ${calc}।`], answerSentence(language, answer), faceCount === 2 ? "ਕੋਨੇ ਵਾਲੇ ਘਣ ਇਸ ਵਿੱਚ ਨਹੀਂ ਗਿਣੇ ਜਾਂਦੇ; ਉਨ੍ਹਾਂ ਦੇ 3 ਫਲਕ ਰੰਗੇ ਹੁੰਦੇ ਹਨ।" : null);
  return solution(language, "For a cube painted on all six outer faces, use the standard position formula for the required number of painted faces.", [formulaTable], [`There are n = ${n} divisions along each edge.`, `Cubes with exactly ${faceCount} painted face${faceCount === 1 ? "" : "s"} are ${position} cubes.`, `Substitution: ${calc}.`], answerSentence(language, answer), faceCount === 2 ? "Corner cubes are excluded because they have three painted faces." : null);
}

export function buildCubesDicePermanentStudentSolutionV1(source: CubesDicePermanentEnglishQuestionV1, language: CubesDiceStudentSolutionLanguageV1): CubesDiceStudentSolutionV1 {
  if (source.taskKind === "DICE_OPPOSITE_FROM_TWO_VIEWS") return diceSolution(source, language);
  if (source.taskKind === "CUBE_NET_OPPOSITE_FACE") return netSolution(source, language);
  if (source.taskKind === "PAINTED_CUBE_EXACT_FACE_COUNT") return paintedSolution(source, language);
  throw new Error(`${source.seed}: CND student solution V1 does not accept legacy pre-allocation voxel task.`);
}

export function buildCubesDiceVoxelStudentSolutionV1(source: CubesDiceVoxelPermanentEnglishQuestionV1, language: CubesDiceStudentSolutionLanguageV1): CubesDiceStudentSolutionV1 {
  const answer = source.answer;
  const facts = source.solutionFacts;
  const metrics = source.metrics;
  const sum = (values: readonly number[]) => values.join(" + ");

  if (source.taskKind === "STACK_TOTAL_CUBES") {
    const rows = facts.layerCounts.map((count, index) => [`${index + 1}`, `${count}`]);
    const headers = language === "hi" ? ["परत", "घन"] : language === "pa" ? ["ਪਰਤ", "ਘਣ"] : ["Layer", "Cubes"];
    const t = table(language === "hi" ? "परत-दर-परत गिनती" : language === "pa" ? "ਪਰਤ-ਦਰ-ਪਰਤ ਗਿਣਤੀ" : "Layer-by-layer count", headers, rows);
    if (language === "hi") return solution(language, "छिपे हुए सहायक घनों को छोड़ने से बचने के लिए नीचे से ऊपर तक परत-दर-परत गिनें।", [t], [`कुल घन = ${sum(facts.layerCounts)} = ${metrics.totalCubes}।`], answerSentence(language, answer));
    if (language === "pa") return solution(language, "ਲੁਕੇ ਹੋਏ ਸਹਾਇਕ ਘਣ ਨਾ ਛੁੱਟਣ, ਇਸ ਲਈ ਹੇਠਾਂ ਤੋਂ ਉੱਪਰ ਤੱਕ ਪਰਤ-ਦਰ-ਪਰਤ ਗਿਣੋ।", [t], [`ਕੁੱਲ ਘਣ = ${sum(facts.layerCounts)} = ${metrics.totalCubes}।`], answerSentence(language, answer));
    return solution(language, "Count the stack layer by layer from bottom to top. This automatically includes hidden supporting cubes.", [t], [`Total cubes = ${sum(facts.layerCounts)} = ${metrics.totalCubes}.`], answerSentence(language, answer));
  }

  if (source.taskKind === "STACK_EXPOSED_FACES") {
    const headers = language === "hi" ? ["मात्रा", "गिनती"] : language === "pa" ? ["ਮਾਤਰਾ", "ਗਿਣਤੀ"] : ["Quantity", "Count"];
    const rows = [
      [language === "hi" ? "कुल घन (N)" : language === "pa" ? "ਕੁੱਲ ਘਣ (N)" : "Total cubes (N)", `${metrics.totalCubes}`],
      [language === "hi" ? "ऊर्ध्व संपर्क" : language === "pa" ? "ਖੜ੍ਹੇ ਸੰਪਰਕ" : "Vertical contacts", `${facts.verticalContacts}`],
      [language === "hi" ? "बाएँ-दाएँ संपर्क" : language === "pa" ? "ਖੱਬੇ-ਸੱਜੇ ਸੰਪਰਕ" : "Left-right contacts", `${facts.leftRightContacts}`],
      [language === "hi" ? "आगे-पीछे संपर्क" : language === "pa" ? "ਅੱਗੇ-ਪਿੱਛੇ ਸੰਪਰਕ" : "Front-back contacts", `${facts.frontBackContacts}`],
      [language === "hi" ? "कुल साझा संपर्क (C)" : language === "pa" ? "ਕੁੱਲ ਸਾਂਝੇ ਸੰਪਰਕ (C)" : "Total shared contacts (C)", `${facts.totalContacts}`],
    ];
    const t = table(language === "hi" ? "संपर्क गिनती" : language === "pa" ? "ਸੰਪਰਕ ਗਿਣਤੀ" : "Contact count", headers, rows, [4]);
    const calc = `6 × ${metrics.totalCubes} − 2 × ${facts.totalContacts} = ${6 * metrics.totalCubes} − ${2 * facts.totalContacts} = ${metrics.exposedFaces}`;
    if (language === "hi") return solution(language, "यदि N घन अलग-अलग हों तो कुल 6N फलक होंगे। हर फलक-से-फलक संपर्क 2 फलक छिपाता है, इसलिए खुले फलक = 6N − 2C।", [t], [`6N − 2C = ${calc}।`], answerSentence(language, answer), "हर साझा संपर्क पर दो फलक छिपते हैं, एक नहीं।");
    if (language === "pa") return solution(language, "ਜੇ N ਘਣ ਵੱਖਰੇ ਹੋਣ ਤਾਂ ਕੁੱਲ 6N ਫਲਕ ਹੁੰਦੇ ਹਨ। ਹਰ ਫਲਕ-ਨਾਲ-ਫਲਕ ਸੰਪਰਕ 2 ਫਲਕ ਲੁਕਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਖੁੱਲ੍ਹੇ ਫਲਕ = 6N − 2C।", [t], [`6N − 2C = ${calc}।`], answerSentence(language, answer), "ਹਰ ਸਾਂਝੇ ਸੰਪਰਕ ਨਾਲ ਦੋ ਫਲਕ ਲੁਕਦੇ ਹਨ, ਇੱਕ ਨਹੀਂ।");
    return solution(language, "If N cubes were separate they would have 6N faces. Every face-to-face contact hides two faces, so exposed faces = 6N − 2C.", [t], [`6N − 2C = ${calc}.`], answerSentence(language, answer), "Each shared contact removes two exposed faces, not one.");
  }

  if (source.taskKind === "STACK_MISSING_TO_COMPLETE_CUBOID") {
    const t = table(language === "hi" ? "आवश्यक माप" : language === "pa" ? "ਲੋੜੀਂਦੇ ਮਾਪ" : "Required dimensions", [language === "hi" ? "मात्रा" : language === "pa" ? "ਮਾਤਰਾ" : "Quantity", language === "hi" ? "मान" : language === "pa" ? "ਮੁੱਲ" : "Value"], [
      [language === "hi" ? "आधार" : language === "pa" ? "ਅਧਾਰ" : "Footprint", `${metrics.columns} × ${metrics.rows}`],
      [language === "hi" ? "अधिकतम ऊँचाई" : language === "pa" ? "ਵੱਧ ਤੋਂ ਵੱਧ ਉਚਾਈ" : "Maximum height", `${metrics.maxHeight}`],
      [language === "hi" ? "मौजूदा घन" : language === "pa" ? "ਮੌਜੂਦਾ ਘਣ" : "Current cubes", `${metrics.totalCubes}`],
    ]);
    const capacity = `${metrics.columns} × ${metrics.rows} × ${metrics.maxHeight} = ${metrics.boundingCuboidVolume}`;
    const missing = `${metrics.boundingCuboidVolume} − ${metrics.totalCubes} = ${metrics.missingToCompleteCuboid}`;
    if (language === "hi") return solution(language, "सबसे छोटा पूरा घनाभ वही आधार रखेगा और उसकी ऊँचाई सबसे ऊँचे स्तंभ के बराबर होगी।", [t], [`पूरे घनाभ में स्थान = ${capacity}।`, `जोड़ने वाले घन = ${missing}।`], answerSentence(language, answer));
    if (language === "pa") return solution(language, "ਸਭ ਤੋਂ ਛੋਟੇ ਪੂਰੇ ਘਣਾਭ ਦਾ ਅਧਾਰ ਇਹੀ ਰਹੇਗਾ ਅਤੇ ਉਚਾਈ ਸਭ ਤੋਂ ਉੱਚੇ ਸਤੰਭ ਦੇ ਬਰਾਬਰ ਹੋਵੇਗੀ।", [t], [`ਪੂਰੇ ਘਣਾਭ ਵਿੱਚ ਥਾਵਾਂ = ${capacity}।`, `ਜੋੜਣ ਵਾਲੇ ਘਣ = ${missing}।`], answerSentence(language, answer));
    return solution(language, "The smallest complete cuboid has the same footprint and a height equal to the tallest column.", [t], [`Complete cuboid capacity = ${capacity}.`, `Missing cubes = ${missing}.`], answerSentence(language, answer));
  }

  if (source.taskKind === "ORTHOGRAPHIC_TOP_CELL_COUNT") {
    const rows = facts.topOccupiedByRow.map((count, index) => [`${index + 1}`, `${count}`]);
    const t = table(language === "hi" ? "ऊपरी दृश्य की गिनती" : language === "pa" ? "ਉੱਪਰਲੇ ਦ੍ਰਿਸ਼ ਦੀ ਗਿਣਤੀ" : "Top-view count", [language === "hi" ? "आधार पंक्ति" : language === "pa" ? "ਅਧਾਰ ਕਤਾਰ" : "Ground row", language === "hi" ? "भरे स्थान" : language === "pa" ? "ਭਰੇ ਖਾਣੇ" : "Occupied cells"], rows);
    const calc = `${sum(facts.topOccupiedByRow)} = ${metrics.topProjectionCells}`;
    if (language === "hi") return solution(language, "ऊपर से देखने पर स्तंभ की ऊँचाई नहीं गिनी जाती। हर गैर-खाली ऊर्ध्व स्तंभ एक वर्ग देता है।", [t], [`ऊपरी दृश्य के वर्ग = ${calc}।`], answerSentence(language, answer));
    if (language === "pa") return solution(language, "ਉੱਪਰੋਂ ਵੇਖਣ ਤੇ ਸਤੰਭ ਦੀ ਉਚਾਈ ਨਹੀਂ ਗਿਣੀ ਜਾਂਦੀ। ਹਰ ਗੈਰ-ਖਾਲੀ ਖੜ੍ਹਾ ਸਤੰਭ ਇੱਕ ਵਰਗ ਦਿੰਦਾ ਹੈ।", [t], [`ਉੱਪਰਲੇ ਦ੍ਰਿਸ਼ ਦੇ ਵਰਗ = ${calc}।`], answerSentence(language, answer));
    return solution(language, "In the top view, height disappears. Every non-empty vertical column contributes exactly one square.", [t], [`Top-view squares = ${calc}.`], answerSentence(language, answer));
  }

  if (source.taskKind === "ORTHOGRAPHIC_FRONT_CELL_COUNT") {
    const rows = facts.frontProfile.map((height, index) => [`${index + 1}`, `${height}`]);
    const t = table(language === "hi" ? "सामने का प्रोफाइल" : language === "pa" ? "ਸਾਹਮਣੇ ਦਾ ਪ੍ਰੋਫ਼ਾਈਲ" : "Front profile", [language === "hi" ? "पट्टी" : language === "pa" ? "ਪੱਟੀ" : "Strip", language === "hi" ? "दिखने वाली ऊँचाई" : language === "pa" ? "ਦਿੱਖਣ ਵਾਲੀ ਉਚਾਈ" : "Visible height"], rows);
    const calc = `${sum(facts.frontProfile)} = ${metrics.frontProjectionCells}`;
    if (language === "hi") return solution(language, "सामने से एक ही क्षैतिज स्थान पर पीछे के घन एक-दूसरे को ढकते हैं। इसलिए हर पट्टी में केवल अधिकतम ऊँचाई लें।", [t], [`सामने के दृश्य के वर्ग = ${calc}।`], answerSentence(language, answer));
    if (language === "pa") return solution(language, "ਸਾਹਮਣੇ ਤੋਂ ਇੱਕੋ ਹਰੀਜ਼ਾਂਟਲ ਥਾਂ ਤੇ ਪਿੱਛੇ ਵਾਲੇ ਘਣ ਇਕ-ਦੂਜੇ ਉੱਤੇ ਆ ਜਾਂਦੇ ਹਨ। ਇਸ ਲਈ ਹਰ ਪੱਟੀ ਵਿੱਚ ਕੇਵਲ ਵੱਧ ਤੋਂ ਵੱਧ ਉਚਾਈ ਲਵੋ।", [t], [`ਸਾਹਮਣੇ ਦੇ ਦ੍ਰਿਸ਼ ਦੇ ਵਰਗ = ${calc}।`], answerSentence(language, answer));
    return solution(language, "From the front, cubes behind one another overlap. For each horizontal strip, keep only the greatest height.", [t], [`Front-view squares = ${calc}.`], answerSentence(language, answer));
  }

  const rows = facts.rightProfile.map((height, index) => [`${index + 1}`, `${height}`]);
  const t = table(language === "hi" ? "दाएँ दृश्य का प्रोफाइल" : language === "pa" ? "ਸੱਜੇ ਦ੍ਰਿਸ਼ ਦਾ ਪ੍ਰੋਫ਼ਾਈਲ" : "Right-side profile", [language === "hi" ? "पट्टी" : language === "pa" ? "ਪੱਟੀ" : "Strip", language === "hi" ? "दिखने वाली ऊँचाई" : language === "pa" ? "ਦਿੱਖਣ ਵਾਲੀ ਉਚਾਈ" : "Visible height"], rows);
  const calc = `${sum(facts.rightProfile)} = ${metrics.rightProjectionCells}`;
  if (language === "hi") return solution(language, "दाएँ से चौड़ाई की दिशा में पड़े घन एक-दूसरे को ढकते हैं। हर गहराई पट्टी में अधिकतम ऊँचाई लें।", [t], [`दाएँ दृश्य के वर्ग = ${calc}।`], answerSentence(language, answer));
  if (language === "pa") return solution(language, "ਸੱਜੇ ਪਾਸੇ ਤੋਂ ਚੌੜਾਈ ਦੀ ਦਿਸ਼ਾ ਵਾਲੇ ਘਣ ਇਕ-ਦੂਜੇ ਉੱਤੇ ਆ ਜਾਂਦੇ ਹਨ। ਹਰ ਡੂੰਘਾਈ ਪੱਟੀ ਵਿੱਚ ਵੱਧ ਤੋਂ ਵੱਧ ਉਚਾਈ ਲਵੋ।", [t], [`ਸੱਜੇ ਦ੍ਰਿਸ਼ ਦੇ ਵਰਗ = ${calc}।`], answerSentence(language, answer));
  return solution(language, "From the right side, cubes along the width overlap. For each depth strip, keep only the greatest height.", [t], [`Right-side squares = ${calc}.`], answerSentence(language, answer));
}
