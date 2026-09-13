import type { KnowledgeV1Difficulty } from "../../types";
import { GEO_PHY_001_CP011_FACT_BY_ID_V1 as factById } from "./geo-phy-001-cp011-facts";

export type GeoPhy001Cp011ReviewQuestion = {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: KnowledgeV1Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
};

const qlNames: Record<number, string> = {
  91: "Major physiographic division classification",
  92: "Formation and surface-type classification",
  93: "Coastal and island classification",
  94: "Himalayas versus Peninsular Plateau",
  95: "Northern Plains versus Indian Desert",
  96: "Western versus Eastern Coastal Plains",
  97: "Lakshadweep versus Andaman and Nicobar",
  98: "Cross-division correct and incorrect classification",
  99: "Multi-statement comparative physiography synthesis",
};

type Row = readonly [stem: string, canonical: string, options: readonly string[], factIds: readonly string[]];

const rowsByQl: Record<number, readonly Row[]> = {
  91: [
    ["Which major physiographic division of India is a young fold-mountain region?", "The Himalayan Mountains", ["The Himalayan Mountains", "The Northern Plains", "The Peninsular Plateau", "The Indian Desert"], ["himalaya-young-fold"]],
    ["Which major division is an extensive alluvial plain formed by large river systems?", "The Northern Plains", ["The Northern Plains", "The Peninsular Plateau", "The Coastal Plains", "The Islands"], ["northern-plains-alluvial"]],
    ["Which major division is an ancient tableland of old crystalline rocks?", "The Peninsular Plateau", ["The Peninsular Plateau", "The Himalayan Mountains", "The Northern Plains", "The Coastal Plains"], ["plateau-old-tableland"]],
    ["Which major division is an arid sandy region mainly west of the Aravali Hills?", "The Indian Desert", ["The Indian Desert", "The Northern Plains", "The Peninsular Plateau", "The Islands"], ["desert-arid-sandy"]],
    ["Which major division includes lowlands along both the Arabian Sea and Bay of Bengal margins?", "The Coastal Plains", ["The Coastal Plains", "The Northern Plains", "The Himalayan Mountains", "The Indian Desert"], ["coastal-plains-margins"]],
    ["Lakshadweep and Andaman and Nicobar belong to which major physiographic division?", "The Islands", ["The Islands", "The Coastal Plains", "The Northern Plains", "The Peninsular Plateau"], ["island-groups"]],
  ],
  92: [
    ["Which division is geologically young rather than an old stable landmass?", "The Himalayan Mountains", ["The Himalayan Mountains", "The Peninsular Plateau", "The Indian Desert", "The Coastal Plains"], ["himalaya-young-fold", "plateau-old-tableland"]],
    ["Which division is best described as an old stable tableland?", "The Peninsular Plateau", ["The Peninsular Plateau", "The Himalayan Mountains", "The Northern Plains", "The Islands"], ["plateau-old-tableland"]],
    ["Which division was built mainly by alluvial deposition?", "The Northern Plains", ["The Northern Plains", "The Peninsular Plateau", "The Himalayan Mountains", "The Islands"], ["northern-plains-alluvial"]],
    ["Which division is most closely linked with dunes, low rainfall and sparse vegetation?", "The Indian Desert", ["The Indian Desert", "The Northern Plains", "The Coastal Plains", "The Islands"], ["desert-arid-sandy", "desert-rain-vegetation"]],
    ["Which pair correctly contrasts a young fold region with an old tableland?", "Himalayan Mountains — Peninsular Plateau", ["Himalayan Mountains — Peninsular Plateau", "Northern Plains — Indian Desert", "Coastal Plains — Islands", "Indian Desert — Northern Plains"], ["himalaya-young-fold", "plateau-old-tableland"]],
    ["Which pair correctly contrasts an alluvial depositional plain with an arid sandy plain?", "Northern Plains — Indian Desert", ["Northern Plains — Indian Desert", "Peninsular Plateau — Islands", "Himalayas — Coastal Plains", "Islands — Coastal Plains"], ["northern-plains-alluvial", "desert-arid-sandy"]],
  ],
  93: [
    ["Which physiographic division lies along the mainland margins of the Arabian Sea and Bay of Bengal?", "The Coastal Plains", ["The Coastal Plains", "The Islands", "The Northern Plains", "The Indian Desert"], ["coastal-plains-margins"]],
    ["Which physiographic division is offshore rather than a mainland lowland?", "The Islands", ["The Islands", "The Coastal Plains", "The Northern Plains", "The Peninsular Plateau"], ["island-groups"]],
    ["Which coastal plain lies along the Arabian Sea?", "Western Coastal Plain", ["Western Coastal Plain", "Eastern Coastal Plain", "Northern Plains", "Indian Desert"], ["west-coast"]],
    ["Which coastal plain lies along the Bay of Bengal?", "Eastern Coastal Plain", ["Eastern Coastal Plain", "Western Coastal Plain", "Malwa Plateau", "Indian Desert"], ["east-coast"]],
    ["Which island group lies in the Arabian Sea near the Malabar Coast?", "Lakshadweep", ["Lakshadweep", "Andaman and Nicobar", "Northern Circar", "Coromandel Coast"], ["island-groups", "lakshadweep-coral"]],
    ["Which island group forms a chain in the Bay of Bengal?", "Andaman and Nicobar Islands", ["Andaman and Nicobar Islands", "Lakshadweep", "Konkan", "Malabar Coast"], ["island-groups", "andaman-submarine"]],
  ],
  94: [
    ["Which comparison between the Himalayas and Peninsular Plateau is correct?", "Himalayas are young fold mountains; the Peninsular Plateau is an old tableland", ["Himalayas are young fold mountains; the Peninsular Plateau is an old tableland", "Both are young fold mountains", "Both are alluvial plains", "Himalayas are an old tableland; the plateau is a young fold region"], ["himalaya-young-fold", "plateau-old-tableland"]],
    ["A region is old, stable and made largely of crystalline rocks. Which is it?", "Peninsular Plateau", ["Peninsular Plateau", "Himalayan Mountains", "Northern Plains", "Indian Desert"], ["plateau-old-tableland"]],
    ["A region is geologically young and structurally folded. Which is it?", "Himalayan Mountains", ["Himalayan Mountains", "Peninsular Plateau", "Coastal Plains", "Northern Plains"], ["himalaya-young-fold"]],
    ["Which statement correctly separates the two regions?", "The Himalayas are in the north; the Peninsular Plateau occupies peninsular India", ["The Himalayas are in the north; the Peninsular Plateau occupies peninsular India", "Both lie only along the coast", "Both are offshore regions", "The plateau lies north of the Himalayas"], ["himalaya-young-fold", "plateau-old-tableland"]],
    ["Which region is more closely linked with old crystalline, igneous and metamorphic rocks?", "Peninsular Plateau", ["Peninsular Plateau", "Himalayan Mountains", "Northern Plains", "Coastal Plains"], ["plateau-old-tableland"]],
    ["Which pair is incorrectly matched?", "Himalayan Mountains — old stable tableland", ["Himalayan Mountains — old stable tableland", "Peninsular Plateau — ancient tableland", "Himalayan Mountains — young fold mountains", "Peninsular Plateau — old crystalline rocks"], ["himalaya-young-fold", "plateau-old-tableland"]],
  ],
  95: [
    ["Which comparison is correct?", "Northern Plains are alluvial; Indian Desert is sandy and arid", ["Northern Plains are alluvial; Indian Desert is sandy and arid", "Both are old crystalline tablelands", "Both are offshore island regions", "Northern Plains are sandy dunes; Indian Desert is a river-built delta"], ["northern-plains-alluvial", "desert-arid-sandy"]],
    ["Which region is formed by the Indus, Ganga and Brahmaputra river systems and their tributaries?", "Northern Plains", ["Northern Plains", "Indian Desert", "Peninsular Plateau", "Coastal Plains"], ["northern-plains-alluvial"]],
    ["Which region commonly has seasonal streams that may disappear into sand?", "Indian Desert", ["Indian Desert", "Northern Plains", "Eastern Coastal Plain", "Lakshadweep"], ["desert-seasonal-drainage"]],
    ["Which clue points to the Indian Desert rather than the Northern Plains?", "Low rainfall and sparse vegetation", ["Low rainfall and sparse vegetation", "Extensive river-laid alluvium", "Indus-Ganga-Brahmaputra deposition", "Broad alluvial plain"], ["desert-rain-vegetation", "northern-plains-alluvial"]],
    ["Which clue points to the Northern Plains rather than the Indian Desert?", "Extensive alluvial deposition", ["Extensive alluvial deposition", "Sand dunes", "Seasonal streams disappearing into sand", "Sparse desert vegetation"], ["northern-plains-alluvial", "desert-arid-sandy", "desert-seasonal-drainage"]],
    ["Which pair is incorrectly matched?", "Northern Plains — sparse arid vegetation", ["Northern Plains — sparse arid vegetation", "Indian Desert — sandy plain", "Northern Plains — alluvial deposition", "Indian Desert — seasonal streams"], ["northern-plains-alluvial", "desert-rain-vegetation", "desert-seasonal-drainage"]],
  ],
  96: [
    ["Which comparison of India's coastal plains is correct?", "Western coast is generally narrow; eastern coast is wider and more level", ["Western coast is generally narrow; eastern coast is wider and more level", "Eastern coast is narrow; western coast is wider", "Both coasts are equally narrow", "Both coasts are desert plains"], ["west-coast", "east-coast"]],
    ["Which coast is classified as a submerged coast and favours natural ports?", "Western coast", ["Western coast", "Eastern coast", "Northern Plains", "Indian Desert"], ["west-coast"]],
    ["Which coast is emergent and has well-developed river deltas?", "Eastern coast", ["Eastern coast", "Western coast", "Lakshadweep", "Indian Desert"], ["east-coast"]],
    ["Mahanadi, Godavari, Krishna and Kaveri deltas are characteristic of which coast?", "Eastern coast", ["Eastern coast", "Western coast", "Indian Desert", "Lakshadweep"], ["east-coast"]],
    ["Which set belongs to the Western Coastal Plain?", "Konkan, Kannad Plain and Malabar Coast", ["Konkan, Kannad Plain and Malabar Coast", "Northern Circar and Coromandel Coast", "Garo, Khasi and Jaintia Hills", "Andaman and Nicobar"], ["west-sections"]],
    ["Which set belongs to the Eastern Coastal Plain?", "Northern Circar and Coromandel Coast", ["Northern Circar and Coromandel Coast", "Konkan and Malabar Coast", "Kullu and Kashmir valleys", "Lakshadweep and Pitti"], ["east-sections"]],
  ],
  97: [
    ["Which comparison is correct?", "Lakshadweep is coral and in the Arabian Sea; Andaman and Nicobar are in the Bay of Bengal and linked with submarine mountains", ["Lakshadweep is coral and in the Arabian Sea; Andaman and Nicobar are in the Bay of Bengal and linked with submarine mountains", "Both groups are river-made islands in the Bay of Bengal", "Lakshadweep is a submarine mountain chain; Andaman and Nicobar are coral islands", "Both groups lie near the Malabar Coast"], ["island-groups", "lakshadweep-coral", "andaman-submarine"]],
    ["Which group is made of small coral islands?", "Lakshadweep", ["Lakshadweep", "Andaman and Nicobar", "Northern Circar", "Konkan"], ["lakshadweep-coral"]],
    ["Which group is considered the elevated part of submarine mountains?", "Andaman and Nicobar Islands", ["Andaman and Nicobar Islands", "Lakshadweep", "Malabar Coast", "Northern Plains"], ["andaman-submarine"]],
    ["Which group is larger, more numerous and more scattered than Lakshadweep?", "Andaman and Nicobar Islands", ["Andaman and Nicobar Islands", "Lakshadweep", "Konkan islands", "Coromandel islands"], ["andaman-submarine"]],
    ["Barren Island and the Ten Degree Channel are associated with which island group?", "Andaman and Nicobar Islands", ["Andaman and Nicobar Islands", "Lakshadweep", "Western Coastal Plain", "Indian Desert"], ["andaman-volcano-channel"]],
    ["Which pair is incorrectly matched?", "Lakshadweep — elevated submarine mountains", ["Lakshadweep — elevated submarine mountains", "Lakshadweep — coral islands", "Andaman and Nicobar — Bay of Bengal", "Andaman and Nicobar — Barren Island"], ["lakshadweep-coral", "andaman-submarine", "andaman-volcano-channel", "island-groups"]],
  ],
  98: [
    ["Which pair is correctly classified?", "Barchan-type sandy landscape — Indian Desert", ["Barchan-type sandy landscape — Indian Desert", "Large east-coast deltas — Himalayan Mountains", "Coral Lakshadweep — Northern Plains", "Young fold mountains — Peninsular Plateau"], ["desert-arid-sandy"]],
    ["Which pair is correctly classified?", "Large river deltas — Eastern Coastal Plain", ["Large river deltas — Eastern Coastal Plain", "Sparse arid vegetation — Northern Plains", "Old crystalline tableland — Himalayas", "Coral islands — Indian Desert"], ["east-coast"]],
    ["Which pair is incorrectly classified?", "Lakshadweep — Northern Plains", ["Lakshadweep — Northern Plains", "Himalayas — young fold mountains", "Peninsular Plateau — old tableland", "Indian Desert — arid sandy region"], ["island-groups", "himalaya-young-fold", "plateau-old-tableland", "desert-arid-sandy"]],
    ["Which pair is incorrectly classified?", "Northern Plains — old crystalline tableland", ["Northern Plains — old crystalline tableland", "Western coast — narrow coastal plain", "Eastern coast — wider deltaic plain", "Andaman and Nicobar — Bay of Bengal islands"], ["northern-plains-alluvial", "plateau-old-tableland", "west-coast", "east-coast", "island-groups"]],
    ["A place is described as an offshore coral group near the Malabar Coast. Which classification is correct?", "Lakshadweep — Islands", ["Lakshadweep — Islands", "Lakshadweep — Northern Plains", "Lakshadweep — Indian Desert", "Lakshadweep — Peninsular Plateau"], ["lakshadweep-coral", "island-groups"]],
    ["A region is described as a wide, level coastal plain with major deltas. Which classification is correct?", "Eastern Coastal Plain — Coastal Plains", ["Eastern Coastal Plain — Coastal Plains", "Eastern Coastal Plain — Islands", "Eastern Coastal Plain — Indian Desert", "Eastern Coastal Plain — Himalayan Mountains"], ["east-coast", "coastal-plains-margins"]],
  ],
  99: [
    ["Consider the following statements: I. The Himalayas are young fold mountains. II. The Northern Plains are alluvial. III. The Peninsular Plateau is an old tableland. Which statements are correct?", "All three", ["I and II only", "II and III only", "I and III only", "All three"], ["himalaya-young-fold", "northern-plains-alluvial", "plateau-old-tableland"]],
    ["Consider the following statements: I. The Indian Desert is arid and sandy. II. The Western Coastal Plain is wider than the Eastern Coastal Plain. III. Lakshadweep is a coral island group. Which statements are correct?", "I and III only", ["I only", "I and III only", "II and III only", "All three"], ["desert-arid-sandy", "west-coast", "east-coast", "lakshadweep-coral"]],
    ["Consider the following statements: I. The Himalayas are an old stable tableland. II. The Eastern Coastal Plain has major river deltas. III. Andaman and Nicobar lie in the Bay of Bengal. Which statements are correct?", "II and III only", ["I and II only", "II and III only", "I and III only", "All three"], ["himalaya-young-fold", "east-coast", "island-groups"]],
    ["Consider the following statements: I. Northern Plains are formed mainly by river alluvium. II. Desert streams may disappear into sand. III. The western coast is an emergent coast with large deltas. Which statements are correct?", "I and II only", ["I and II only", "II and III only", "I and III only", "All three"], ["northern-plains-alluvial", "desert-seasonal-drainage", "west-coast", "east-coast"]],
    ["Consider the following statements: I. Lakshadweep lies in the Arabian Sea. II. Andaman and Nicobar are linked with submarine mountains. III. The Ten Degree Channel separates the Andaman and Nicobar groups. Which statements are correct?", "All three", ["I only", "II only", "I and II only", "All three"], ["island-groups", "andaman-submarine", "andaman-volcano-channel"]],
    ["Consider the following statements: I. The Peninsular Plateau is a young fold-mountain region. II. The Indian Desert has extensive river-laid alluvium from the Indus-Ganga-Brahmaputra systems. III. The Eastern Coastal Plain is narrower than the Western Coastal Plain. Which statements are correct?", "None of the three", ["I only", "II only", "III only", "None of the three"], ["plateau-old-tableland", "northern-plains-alluvial", "desert-arid-sandy", "west-coast", "east-coast"]],
  ],
};

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function difficultyForQl(ql: number): KnowledgeV1Difficulty {
  if (ql <= 93) return "Easy";
  if (ql <= 98) return "Medium";
  return "Hard";
}

function explanationFor(factIds: readonly string[]): string {
  return unique(factIds).map((id) => factById[id]?.fact).filter(Boolean).join(" ");
}

function sourceIdsFor(factIds: readonly string[]): string[] {
  return unique(factIds.flatMap((id) => factById[id]?.sourceIds ?? []));
}

function sourceFactIdsFor(factIds: readonly string[]): string[] {
  return unique(factIds.flatMap((id) => factById[id]?.sourceFactIds ?? []));
}

function balancedOptions(canonical: string, options: readonly string[], targetIndex: number): string[] {
  const distractors = unique(options.filter((option) => option !== canonical));
  if (distractors.length !== 3) throw new Error(`CP011 options require exactly three distinct distractors for: ${canonical}`);
  const result = [...distractors];
  result.splice(targetIndex, 0, canonical);
  return result;
}

export function generateGeoPhy001Cp011ReviewBatchV1(): GeoPhy001Cp011ReviewQuestion[] {
  const questions: GeoPhy001Cp011ReviewQuestion[] = [];
  let globalIndex = 0;

  for (let ql = 91; ql <= 99; ql += 1) {
    const rows = rowsByQl[ql];
    if (!rows || rows.length !== 6) throw new Error(`CP011 requires six rows for QL${ql}`);

    rows.forEach(([stem, canonical, options, factIds]) => {
      const targetIndex = globalIndex % 4;
      const balanced = balancedOptions(canonical, options, targetIndex);
      const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
      questions.push({
        questionId: `GEO-PHY-001-CP011-Q${String(globalIndex + 1).padStart(3, "0")}`,
        qlId,
        qlName: qlNames[ql],
        difficulty: difficultyForQl(ql),
        stem,
        options: balanced,
        correctIndex: targetIndex,
        canonicalAnswer: canonical,
        explanation: explanationFor(factIds),
        sourceIds: sourceIdsFor(factIds),
        sourceFactIds: sourceFactIdsFor(factIds),
        reviewOnly: true,
        runtimeRegistered: false,
      });
      globalIndex += 1;
    });
  }

  return questions;
}

export const GEO_PHY_001_CP011_REVIEW_BATCH_V1 = Object.freeze(
  generateGeoPhy001Cp011ReviewBatchV1().map((question) => Object.freeze(question)),
);

const forbiddenLearnerLanguage = /\bNCERT\b|sourceFact|review-only|runtimeRegistered|generator|qualification gate|provenance/i;

export function auditGeoPhy001Cp011ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const semantics = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const usedFactIds = new Set<string>();

  for (const question of GEO_PHY_001_CP011_REVIEW_BATCH_V1) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    const semantic = `${question.stem}::${question.canonicalAnswer}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantics.add(semantic);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    question.sourceFactIds.forEach((id) => usedFactIds.add(id));

    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    const learner = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (forbiddenLearnerLanguage.test(learner)) issues.push(`LEARNER_LANGUAGE:${question.questionId}`);
    if (question.explanation.trim().length < 40) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
  }

  if (GEO_PHY_001_CP011_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_PHY_001_CP011_REVIEW_BATCH_V1.length}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  for (let ql = 91; ql <= 99; ql += 1) {
    const id = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
    if (qlCounts[id] !== 6) issues.push(`QL_COUNT:${id}:${qlCounts[id] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);

  const hardAnswers = new Set(
    GEO_PHY_001_CP011_REVIEW_BATCH_V1.filter((q) => q.difficulty === "Hard").map((q) => q.canonicalAnswer),
  );
  if (hardAnswers.size < 4) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_PHY_001_CP011_REVIEW_BATCH_V1.length,
    semanticCount: semantics.size,
    qlCounts,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
    usedSourceFactCount: usedFactIds.size,
  };
}
