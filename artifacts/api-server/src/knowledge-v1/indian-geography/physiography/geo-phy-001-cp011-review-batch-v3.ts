import {
  GEO_PHY_001_CP011_REVIEW_BATCH_V2,
  type GeoPhy001Cp011ReviewQuestion,
} from "./geo-phy-001-cp011-review-batch-v2";

const qlNames: Record<string, string> = {
  "GEO-PHY-001-QL-091": "Major regions of India",
  "GEO-PHY-001-QL-092": "How the regions were formed",
  "GEO-PHY-001-QL-093": "Coasts and islands",
  "GEO-PHY-001-QL-094": "Himalayas and Peninsular Plateau",
  "GEO-PHY-001-QL-095": "Northern Plains and Indian Desert",
  "GEO-PHY-001-QL-096": "Western and Eastern Coastal Plains",
  "GEO-PHY-001-QL-097": "Lakshadweep and Andaman–Nicobar",
  "GEO-PHY-001-QL-098": "Correct and wrong matches",
  "GEO-PHY-001-QL-099": "Mixed statement questions",
};

const stemOverrides: Record<string, string> = {
  "GEO-PHY-001-CP011-Q001": "Which region of India has young fold mountains?",
  "GEO-PHY-001-CP011-Q002": "Which region is a wide plain made by river deposits?",
  "GEO-PHY-001-CP011-Q003": "Which region is an old plateau made mainly of hard rocks?",
  "GEO-PHY-001-CP011-Q004": "Which region is dry and sandy and lies mainly west of the Aravali Hills?",
  "GEO-PHY-001-CP011-Q005": "Which region has lowlands along the Arabian Sea and Bay of Bengal?",
  "GEO-PHY-001-CP011-Q006": "Lakshadweep and Andaman and Nicobar belong to which region?",
  "GEO-PHY-001-CP011-Q007": "Which region is young?",
  "GEO-PHY-001-CP011-Q008": "Which region is an old stable plateau?",
  "GEO-PHY-001-CP011-Q009": "Which region was formed mainly by river deposits?",
  "GEO-PHY-001-CP011-Q010": "Which region is known for dunes, very low rainfall and little natural vegetation?",
  "GEO-PHY-001-CP011-Q013": "Which region lies along India's Arabian Sea and Bay of Bengal coasts?",
  "GEO-PHY-001-CP011-Q014": "Which region lies away from the mainland?",
  "GEO-PHY-001-CP011-Q019": "Which statement correctly compares the Himalayas and Peninsular Plateau?",
  "GEO-PHY-001-CP011-Q020": "Which region is old, stable and made mainly of hard rocks?",
  "GEO-PHY-001-CP011-Q021": "Which region is young and was formed by folding?",
  "GEO-PHY-001-CP011-Q023": "Which region is mainly made of old hard rocks?",
  "GEO-PHY-001-CP011-Q025": "Which comparison is correct?",
  "GEO-PHY-001-CP011-Q028": "Which feature belongs to the Indian Desert, not the Northern Plains?",
  "GEO-PHY-001-CP011-Q029": "Which feature belongs to the Northern Plains, not the Indian Desert?",
  "GEO-PHY-001-CP011-Q031": "Which statement correctly compares India's western and eastern coasts?",
  "GEO-PHY-001-CP011-Q032": "Which coast is known for good natural ports?",
  "GEO-PHY-001-CP011-Q033": "Which coast is wider and has large river deltas?",
  "GEO-PHY-001-CP011-Q037": "Which statement correctly compares Lakshadweep and Andaman and Nicobar?",
  "GEO-PHY-001-CP011-Q039": "Which island group is made from raised parts of underwater mountains?",
  "GEO-PHY-001-CP011-Q043": "Which pair is correctly matched?",
  "GEO-PHY-001-CP011-Q044": "Which pair is correctly matched?",
  "GEO-PHY-001-CP011-Q047": "Which match is correct for the coral islands near the Malabar Coast?",
  "GEO-PHY-001-CP011-Q048": "Which match is correct for the wide coast with large river deltas?",
  "GEO-PHY-001-CP011-Q049": "Consider the statements: I. The Himalayas are young fold mountains. II. The Northern Plains were made by river deposits. III. The Peninsular Plateau is an old plateau. Which are correct?",
  "GEO-PHY-001-CP011-Q050": "Consider the statements: I. The Indian Desert is dry and sandy. II. The Western Coastal Plain is wider than the Eastern Coastal Plain. III. Lakshadweep is a coral island group. Which are correct?",
  "GEO-PHY-001-CP011-Q051": "Consider the statements: I. The Himalayas are an old stable plateau. II. The Eastern Coastal Plain has large river deltas. III. Andaman and Nicobar lie in the Bay of Bengal. Which are correct?",
  "GEO-PHY-001-CP011-Q052": "Consider the statements: I. The Northern Plains were formed mainly by river deposits. II. Desert streams may disappear into sand. III. The western coast has large river deltas. Which are correct?",
  "GEO-PHY-001-CP011-Q053": "Consider the statements: I. Lakshadweep lies in the Arabian Sea. II. Andaman and Nicobar are raised parts of underwater mountains. III. The Ten Degree Channel separates the Andaman and Nicobar groups. Which are correct?",
  "GEO-PHY-001-CP011-Q054": "Consider the statements: I. The Peninsular Plateau is a young fold-mountain region. II. The Indian Desert was formed by large river deposits of the Indus-Ganga-Brahmaputra systems. III. The Eastern Coastal Plain is narrower than the Western Coastal Plain. Which are correct?",
};

const explanations: Record<string, string> = {
  "GEO-PHY-001-CP011-Q001": "The Himalayas are young fold mountains in northern India.",
  "GEO-PHY-001-CP011-Q002": "The Northern Plains were formed by deposits brought by large rivers.",
  "GEO-PHY-001-CP011-Q003": "The Peninsular Plateau is an old plateau made mainly of hard rocks.",
  "GEO-PHY-001-CP011-Q004": "The Indian Desert is dry and sandy and lies mainly west of the Aravali Hills.",
  "GEO-PHY-001-CP011-Q005": "The Coastal Plains lie along the Arabian Sea and Bay of Bengal.",
  "GEO-PHY-001-CP011-Q006": "Lakshadweep and Andaman and Nicobar are India's two main island groups.",
  "GEO-PHY-001-CP011-Q007": "The Himalayas are a young mountain system.",
  "GEO-PHY-001-CP011-Q008": "The Peninsular Plateau is an old and stable plateau.",
  "GEO-PHY-001-CP011-Q009": "The Northern Plains were built mainly by river deposits.",
  "GEO-PHY-001-CP011-Q010": "The Indian Desert has dunes, very little rain and little natural vegetation.",
  "GEO-PHY-001-CP011-Q011": "The Himalayas are young fold mountains, while the Peninsular Plateau is old.",
  "GEO-PHY-001-CP011-Q012": "The Northern Plains were made by river deposits, while the Indian Desert is dry and sandy.",
  "GEO-PHY-001-CP011-Q013": "The Coastal Plains run along India's western and eastern coasts.",
  "GEO-PHY-001-CP011-Q014": "The Islands lie away from the mainland in the Arabian Sea and Bay of Bengal.",
  "GEO-PHY-001-CP011-Q015": "The Western Coastal Plain lies along the Arabian Sea.",
  "GEO-PHY-001-CP011-Q016": "The Eastern Coastal Plain lies along the Bay of Bengal.",
  "GEO-PHY-001-CP011-Q017": "Lakshadweep lies in the Arabian Sea near the Malabar Coast.",
  "GEO-PHY-001-CP011-Q018": "Andaman and Nicobar form a long island chain in the Bay of Bengal.",
  "GEO-PHY-001-CP011-Q019": "The Himalayas are young fold mountains; the Peninsular Plateau is old.",
  "GEO-PHY-001-CP011-Q020": "The Peninsular Plateau is old, stable and made mainly of hard rocks.",
  "GEO-PHY-001-CP011-Q021": "The Himalayas are young mountains formed by folding.",
  "GEO-PHY-001-CP011-Q022": "The Himalayas are in northern India, while the Peninsular Plateau lies in peninsular India.",
  "GEO-PHY-001-CP011-Q023": "The Peninsular Plateau is made mainly of old hard rocks.",
  "GEO-PHY-001-CP011-Q024": "The Himalayas are young fold mountains, not an old stable plateau.",
  "GEO-PHY-001-CP011-Q025": "The Northern Plains are river-made plains; the Indian Desert is dry and sandy.",
  "GEO-PHY-001-CP011-Q026": "The Indus, Ganga and Brahmaputra river systems helped build the Northern Plains.",
  "GEO-PHY-001-CP011-Q027": "Many streams in the Indian Desert flow only in the rainy season and may disappear into sand.",
  "GEO-PHY-001-CP011-Q028": "Very low rainfall and little natural vegetation are features of the Indian Desert.",
  "GEO-PHY-001-CP011-Q029": "Large river deposits are a key feature of the Northern Plains.",
  "GEO-PHY-001-CP011-Q030": "The Northern Plains are not a dry region with little natural vegetation.",
  "GEO-PHY-001-CP011-Q031": "The western coast is generally narrow; the eastern coast is wider and flatter.",
  "GEO-PHY-001-CP011-Q032": "The western coast has good conditions for natural ports.",
  "GEO-PHY-001-CP011-Q033": "The eastern coast is wider and has large river deltas.",
  "GEO-PHY-001-CP011-Q034": "The Mahanadi, Godavari, Krishna and Kaveri form large deltas on the eastern coast.",
  "GEO-PHY-001-CP011-Q035": "Konkan, Kannad Plain and Malabar Coast are parts of the Western Coastal Plain.",
  "GEO-PHY-001-CP011-Q036": "Northern Circar and Coromandel Coast are parts of the Eastern Coastal Plain.",
  "GEO-PHY-001-CP011-Q037": "Lakshadweep is a coral group in the Arabian Sea; Andaman and Nicobar lie in the Bay of Bengal.",
  "GEO-PHY-001-CP011-Q038": "Lakshadweep is made of small coral islands.",
  "GEO-PHY-001-CP011-Q039": "Andaman and Nicobar are raised parts of mountains under the sea.",
  "GEO-PHY-001-CP011-Q040": "Andaman and Nicobar have more and larger islands than Lakshadweep.",
  "GEO-PHY-001-CP011-Q041": "Barren Island and the Ten Degree Channel are both part of the Andaman and Nicobar group.",
  "GEO-PHY-001-CP011-Q042": "Lakshadweep is a coral island group, not part of an underwater mountain chain.",
  "GEO-PHY-001-CP011-Q043": "Crescent-shaped sand dunes are a feature of the Indian Desert.",
  "GEO-PHY-001-CP011-Q044": "Large river deltas are a major feature of the Eastern Coastal Plain.",
  "GEO-PHY-001-CP011-Q045": "Lakshadweep is an island group, not part of the Northern Plains.",
  "GEO-PHY-001-CP011-Q046": "The Northern Plains are river-made plains, not an old rocky plateau.",
  "GEO-PHY-001-CP011-Q047": "Lakshadweep is the coral island group near the Malabar Coast.",
  "GEO-PHY-001-CP011-Q048": "The Eastern Coastal Plain is wide and has large river deltas.",
  "GEO-PHY-001-CP011-Q049": "All three statements are correct.",
  "GEO-PHY-001-CP011-Q050": "Statements I and III are correct. The western coast is generally narrower than the eastern coast.",
  "GEO-PHY-001-CP011-Q051": "Statements II and III are correct. The Himalayas are young fold mountains.",
  "GEO-PHY-001-CP011-Q052": "Statements I and II are correct. Large river deltas are mainly a feature of the eastern coast.",
  "GEO-PHY-001-CP011-Q053": "All three statements are correct.",
  "GEO-PHY-001-CP011-Q054": "None of the three statements is correct.",
};

function simplify(text: string): string {
  return text
    .replaceAll("major physical division", "region")
    .replaceAll("major division", "region")
    .replaceAll("physical division", "region")
    .replaceAll("geologically young", "young")
    .replaceAll("wide alluvial plains", "wide plains made by river deposits")
    .replaceAll("alluvial plains", "plains made by river deposits")
    .replaceAll("alluvial plain", "plain made by river deposits")
    .replaceAll("alluvial", "river-made")
    .replaceAll("crystalline, igneous and metamorphic rocks", "old hard rocks")
    .replaceAll("old crystalline rocks", "old hard rocks")
    .replaceAll("old rocky plateau", "old plateau")
    .replaceAll("arid", "dry")
    .replaceAll("sparse vegetation", "little natural vegetation")
    .replaceAll("sparse desert vegetation", "little desert vegetation")
    .replaceAll("submerged coast", "coast with good natural ports")
    .replaceAll("emergent coast", "wide coast with large river deltas")
    .replaceAll("elevated submarine mountains", "raised underwater mountains")
    .replaceAll("underwater mountain chain", "mountain chain under the sea")
    .replaceAll("offshore island regions", "island regions away from the mainland")
    .replaceAll("offshore", "away from the mainland")
    .replaceAll("deposition", "deposits")
    .replaceAll("Barchan-type sandy landscape", "crescent-shaped sand dunes");
}

export const GEO_PHY_001_CP011_REVIEW_BATCH_V3: readonly GeoPhy001Cp011ReviewQuestion[] = Object.freeze(
  GEO_PHY_001_CP011_REVIEW_BATCH_V2.map((question) => {
    const options = question.options.map(simplify);
    const canonicalAnswer = simplify(question.canonicalAnswer);
    const stem = stemOverrides[question.questionId] ?? simplify(question.stem);
    const explanation = explanations[question.questionId];
    if (!explanation) throw new Error(`CP011 V3 missing explanation for ${question.questionId}`);
    return Object.freeze({
      ...question,
      qlName: qlNames[question.qlId] ?? question.qlName,
      stem,
      options,
      canonicalAnswer,
      explanation,
    });
  }),
);

const bannedLearnerWording = /physiographic|physical division|geologically|alluvial|emergent|submerged|crystalline|igneous|metamorphic|offshore|\barid\b|deposition|correctly classified|incorrectly classified|structurally folded/i;

export function auditGeoPhy001Cp011ReviewBatchV3() {
  const issues: string[] = [];
  const answerPositions = [0, 0, 0, 0];
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const semantic = new Set<string>();
  const sourceFacts = new Set<string>();
  const hardAnswers = new Set<string>();

  for (const question of GEO_PHY_001_CP011_REVIEW_BATCH_V3) {
    const learner = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (bannedLearnerWording.test(learner)) issues.push(`${question.questionId}: heavy wording remains`);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`${question.questionId}: options invalid`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: answer mismatch`);
    if (question.difficulty !== "Hard" && question.stem.split(/\s+/).length > 17) issues.push(`${question.questionId}: stem too long`);
    if (question.difficulty !== "Hard" && question.explanation.split(/\s+/).length > 20) issues.push(`${question.questionId}: explanation too long`);
    answerPositions[question.correctIndex] += 1;
    difficultyCounts[question.difficulty] += 1;
    semantic.add(question.stem.toLowerCase());
    question.sourceFactIds.forEach((id) => sourceFacts.add(id));
    if (question.difficulty === "Hard") hardAnswers.add(question.canonicalAnswer);
  }

  const qlCounts = new Map<string, number>();
  GEO_PHY_001_CP011_REVIEW_BATCH_V3.forEach((q) => qlCounts.set(q.qlId, (qlCounts.get(q.qlId) ?? 0) + 1));
  if (GEO_PHY_001_CP011_REVIEW_BATCH_V3.length !== 54) issues.push("CP011 V3 must contain 54 questions");
  if ([...qlCounts.values()].some((count) => count !== 6) || qlCounts.size !== 9) issues.push("CP011 V3 must contain 6 questions per QL");
  if (semantic.size !== 54) issues.push("CP011 V3 stems are not unique");
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("CP011 V3 difficulty split is wrong");
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`CP011 V3 answer balance is ${answerPositions.join(",")}`);
  if (hardAnswers.size < 4) issues.push("CP011 V3 hard answer pattern is too repetitive");
  if (sourceFacts.size < 20) issues.push("CP011 V3 source-fact coverage is too shallow");

  return {
    valid: issues.length === 0,
    issues,
    questionCount: GEO_PHY_001_CP011_REVIEW_BATCH_V3.length,
    semanticCount: semantic.size,
    difficultyCounts,
    answerPositions,
    hardAnswerVariety: hardAnswers.size,
    usedSourceFactCount: sourceFacts.size,
  };
}
