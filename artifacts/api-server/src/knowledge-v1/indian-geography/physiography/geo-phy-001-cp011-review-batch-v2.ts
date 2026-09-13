import {
  GEO_PHY_001_CP011_REVIEW_BATCH_V1,
  auditGeoPhy001Cp011ReviewBatchV1,
  type GeoPhy001Cp011ReviewQuestion,
} from "./geo-phy-001-cp011-review-batch-v1";

const qlNames: Record<string, string> = {
  "GEO-PHY-001-QL-091": "Major physical divisions",
  "GEO-PHY-001-QL-092": "How the major divisions were formed",
  "GEO-PHY-001-QL-093": "Coasts and islands",
  "GEO-PHY-001-QL-094": "Himalayas and Peninsular Plateau",
  "GEO-PHY-001-QL-095": "Northern Plains and Indian Desert",
  "GEO-PHY-001-QL-096": "Western and Eastern Coastal Plains",
  "GEO-PHY-001-QL-097": "Lakshadweep and Andaman–Nicobar",
  "GEO-PHY-001-QL-098": "Correct and incorrect matches",
  "GEO-PHY-001-QL-099": "Mixed statement questions",
};

const simpleStems: Record<string, string> = {
  "GEO-PHY-001-CP011-Q001": "Which major physical division of India has young fold mountains?",
  "GEO-PHY-001-CP011-Q002": "Which major division is a large alluvial plain made by rivers?",
  "GEO-PHY-001-CP011-Q003": "Which major division is an old plateau made mainly of hard rocks?",
  "GEO-PHY-001-CP011-Q004": "Which major division is a dry sandy region mainly west of the Aravali Hills?",
  "GEO-PHY-001-CP011-Q005": "Which major division has coastal lowlands along the Arabian Sea and Bay of Bengal?",
  "GEO-PHY-001-CP011-Q006": "Lakshadweep and Andaman and Nicobar belong to which major physical division?",
  "GEO-PHY-001-CP011-Q007": "Which major division is geologically young?",
  "GEO-PHY-001-CP011-Q008": "Which major division is an old stable plateau?",
  "GEO-PHY-001-CP011-Q009": "Which major division was formed mainly by river deposits?",
  "GEO-PHY-001-CP011-Q010": "Which major division is known for dunes, very low rainfall and sparse vegetation?",
  "GEO-PHY-001-CP011-Q011": "Which pair is correct?",
  "GEO-PHY-001-CP011-Q012": "Which pair is correct?",
  "GEO-PHY-001-CP011-Q013": "Which major physical division lies along India's Arabian Sea and Bay of Bengal coasts?",
  "GEO-PHY-001-CP011-Q014": "Which major physical division lies away from the mainland?",
  "GEO-PHY-001-CP011-Q015": "Which coastal plain lies along the Arabian Sea?",
  "GEO-PHY-001-CP011-Q016": "Which coastal plain lies along the Bay of Bengal?",
  "GEO-PHY-001-CP011-Q017": "Which island group lies in the Arabian Sea near the Malabar Coast?",
  "GEO-PHY-001-CP011-Q018": "Which island group forms a chain in the Bay of Bengal?",
  "GEO-PHY-001-CP011-Q019": "Which statement correctly compares the Himalayas and the Peninsular Plateau?",
  "GEO-PHY-001-CP011-Q020": "Which region is old, stable and made mainly of hard rocks?",
  "GEO-PHY-001-CP011-Q021": "Which region is geologically young and formed by folding?",
  "GEO-PHY-001-CP011-Q022": "Which statement is correct?",
  "GEO-PHY-001-CP011-Q023": "Which region is mainly made of old crystalline, igneous and metamorphic rocks?",
  "GEO-PHY-001-CP011-Q024": "Which pair is wrongly matched?",
  "GEO-PHY-001-CP011-Q025": "Which comparison is correct?",
  "GEO-PHY-001-CP011-Q026": "Which region was formed by deposits of the Indus, Ganga and Brahmaputra river systems?",
  "GEO-PHY-001-CP011-Q027": "Which region has seasonal streams that may disappear into sand?",
  "GEO-PHY-001-CP011-Q028": "Which feature belongs to the Indian Desert, not the Northern Plains?",
  "GEO-PHY-001-CP011-Q029": "Which feature belongs to the Northern Plains, not the Indian Desert?",
  "GEO-PHY-001-CP011-Q030": "Which pair is wrongly matched?",
  "GEO-PHY-001-CP011-Q031": "Which statement correctly compares India's western and eastern coastal plains?",
  "GEO-PHY-001-CP011-Q032": "Which coast is submerged and has good natural ports?",
  "GEO-PHY-001-CP011-Q033": "Which coast is emergent and has large river deltas?",
  "GEO-PHY-001-CP011-Q034": "Mahanadi, Godavari, Krishna and Kaveri form large deltas on which coast?",
  "GEO-PHY-001-CP011-Q035": "Which set belongs to the Western Coastal Plain?",
  "GEO-PHY-001-CP011-Q036": "Which set belongs to the Eastern Coastal Plain?",
  "GEO-PHY-001-CP011-Q037": "Which statement correctly compares Lakshadweep and Andaman and Nicobar?",
  "GEO-PHY-001-CP011-Q038": "Which group is made of small coral islands?",
  "GEO-PHY-001-CP011-Q039": "Which island group is made from raised parts of underwater mountains?",
  "GEO-PHY-001-CP011-Q040": "Which group has more and larger islands than Lakshadweep?",
  "GEO-PHY-001-CP011-Q041": "Barren Island and the Ten Degree Channel belong to which island group?",
  "GEO-PHY-001-CP011-Q042": "Which pair is wrongly matched?",
  "GEO-PHY-001-CP011-Q043": "Which pair is correctly matched?",
  "GEO-PHY-001-CP011-Q044": "Which pair is correctly matched?",
  "GEO-PHY-001-CP011-Q045": "Which pair is wrongly matched?",
  "GEO-PHY-001-CP011-Q046": "Which pair is wrongly matched?",
  "GEO-PHY-001-CP011-Q047": "Which match is correct for the coral islands near the Malabar Coast?",
  "GEO-PHY-001-CP011-Q048": "Which match is correct for the wide coastal plain with large river deltas?",
  "GEO-PHY-001-CP011-Q049": "Consider the following statements: I. The Himalayas are young fold mountains. II. The Northern Plains are alluvial plains. III. The Peninsular Plateau is an old plateau. Which statements are correct?",
  "GEO-PHY-001-CP011-Q050": "Consider the following statements: I. The Indian Desert is dry and sandy. II. The Western Coastal Plain is wider than the Eastern Coastal Plain. III. Lakshadweep is a coral island group. Which statements are correct?",
  "GEO-PHY-001-CP011-Q051": "Consider the following statements: I. The Himalayas are an old stable plateau. II. The Eastern Coastal Plain has large river deltas. III. Andaman and Nicobar lie in the Bay of Bengal. Which statements are correct?",
  "GEO-PHY-001-CP011-Q052": "Consider the following statements: I. The Northern Plains were formed mainly by river deposits. II. Desert streams may disappear into sand. III. The western coast is an emergent coast with large deltas. Which statements are correct?",
  "GEO-PHY-001-CP011-Q053": "Consider the following statements: I. Lakshadweep lies in the Arabian Sea. II. Andaman and Nicobar are raised parts of underwater mountains. III. The Ten Degree Channel separates the Andaman and Nicobar groups. Which statements are correct?",
  "GEO-PHY-001-CP011-Q054": "Consider the following statements: I. The Peninsular Plateau is a young fold-mountain region. II. The Indian Desert was formed by large river deposits of the Indus-Ganga-Brahmaputra systems. III. The Eastern Coastal Plain is narrower than the Western Coastal Plain. Which statements are correct?",
};

const simpleExplanations: Record<string, string> = {
  "GEO-PHY-001-CP011-Q011": "The Himalayas are young fold mountains. The Peninsular Plateau is an old plateau.",
  "GEO-PHY-001-CP011-Q012": "The Northern Plains are alluvial plains made by river deposits. The Indian Desert is dry and sandy.",
  "GEO-PHY-001-CP011-Q018": "Andaman and Nicobar form a long island chain in the Bay of Bengal.",
  "GEO-PHY-001-CP011-Q019": "The Himalayas are young fold mountains. The Peninsular Plateau is an old plateau.",
  "GEO-PHY-001-CP011-Q020": "The Peninsular Plateau is old and stable, and is made mainly of crystalline, igneous and metamorphic rocks.",
  "GEO-PHY-001-CP011-Q021": "The Himalayas are geologically young fold mountains.",
  "GEO-PHY-001-CP011-Q022": "The Himalayas lie in northern India, while the Peninsular Plateau is the old plateau region of peninsular India.",
  "GEO-PHY-001-CP011-Q023": "The Peninsular Plateau is made mainly of old crystalline, igneous and metamorphic rocks.",
  "GEO-PHY-001-CP011-Q024": "The Himalayas are young fold mountains, not an old stable plateau.",
  "GEO-PHY-001-CP011-Q025": "The Northern Plains are alluvial plains. The Indian Desert is dry and sandy.",
  "GEO-PHY-001-CP011-Q026": "The Northern Plains were formed by deposits of the Indus, Ganga and Brahmaputra river systems and their tributaries.",
  "GEO-PHY-001-CP011-Q027": "Many streams in the Indian Desert flow only in the rainy season and may disappear into sand.",
  "GEO-PHY-001-CP011-Q028": "Very low rainfall and sparse vegetation are features of the Indian Desert.",
  "GEO-PHY-001-CP011-Q029": "The Northern Plains are broad alluvial plains formed by river deposits.",
  "GEO-PHY-001-CP011-Q030": "Sparse desert vegetation is a feature of the Indian Desert, not the Northern Plains.",
  "GEO-PHY-001-CP011-Q031": "The Western Coastal Plain is generally narrow. The Eastern Coastal Plain is wider and flatter.",
  "GEO-PHY-001-CP011-Q032": "The western coast is a submerged coast and has good natural ports.",
  "GEO-PHY-001-CP011-Q033": "The eastern coast is an emergent coast and has large river deltas.",
  "GEO-PHY-001-CP011-Q034": "The Mahanadi, Godavari, Krishna and Kaveri form large deltas on the eastern coast.",
  "GEO-PHY-001-CP011-Q035": "Konkan, Kannad Plain and Malabar Coast are parts of the Western Coastal Plain.",
  "GEO-PHY-001-CP011-Q036": "Northern Circar and Coromandel Coast are parts of the Eastern Coastal Plain.",
  "GEO-PHY-001-CP011-Q037": "Lakshadweep is a coral island group in the Arabian Sea. Andaman and Nicobar lie in the Bay of Bengal and are raised parts of underwater mountains.",
  "GEO-PHY-001-CP011-Q038": "Lakshadweep is a group of small coral islands near the Malabar Coast.",
  "GEO-PHY-001-CP011-Q039": "Andaman and Nicobar are raised parts of underwater mountains.",
  "GEO-PHY-001-CP011-Q040": "Andaman and Nicobar have more and larger islands than Lakshadweep.",
  "GEO-PHY-001-CP011-Q041": "Barren Island is in the Andaman and Nicobar group. The Ten Degree Channel separates Andaman from Nicobar.",
  "GEO-PHY-001-CP011-Q042": "Lakshadweep is made of coral islands. Raised parts of underwater mountains describe Andaman and Nicobar.",
  "GEO-PHY-001-CP011-Q043": "The Indian Desert is a dry sandy region mainly west of the Aravali Hills.",
  "GEO-PHY-001-CP011-Q044": "The Eastern Coastal Plain has large river deltas.",
  "GEO-PHY-001-CP011-Q045": "Lakshadweep belongs to India's Islands division, not the Northern Plains.",
  "GEO-PHY-001-CP011-Q046": "The Northern Plains are alluvial plains, not an old rocky plateau.",
  "GEO-PHY-001-CP011-Q047": "Lakshadweep is a coral island group near the Malabar Coast and belongs to India's Islands division.",
  "GEO-PHY-001-CP011-Q048": "The Eastern Coastal Plain is part of the Coastal Plains and has large river deltas.",
  "GEO-PHY-001-CP011-Q049": "All three are correct: the Himalayas are young fold mountains, the Northern Plains are alluvial, and the Peninsular Plateau is old.",
  "GEO-PHY-001-CP011-Q050": "Statements I and III are correct. The Indian Desert is dry and sandy, and Lakshadweep is coral. The western coastal plain is narrower than the eastern coastal plain.",
  "GEO-PHY-001-CP011-Q051": "Statements II and III are correct. The Himalayas are young fold mountains, not an old plateau. The eastern coast has large deltas, and Andaman and Nicobar lie in the Bay of Bengal.",
  "GEO-PHY-001-CP011-Q052": "Statements I and II are correct. The Northern Plains were formed by river deposits, and many desert streams disappear into sand. The western coast is submerged, not emergent.",
  "GEO-PHY-001-CP011-Q053": "All three are correct. Lakshadweep is in the Arabian Sea, Andaman and Nicobar are raised parts of underwater mountains, and the Ten Degree Channel separates Andaman from Nicobar.",
  "GEO-PHY-001-CP011-Q054": "All three are false. The Peninsular Plateau is old, the Indian Desert is dry and sandy, and the Eastern Coastal Plain is wider than the Western Coastal Plain.",
};

function simpleOption(text: string): string {
  return text
    .replace(/Barchan-type sandy landscape — Indian Desert/gi, "Dry sandy region — Indian Desert")
    .replace(/Lakshadweep is a submarine mountain chain/gi, "Lakshadweep is an underwater mountain chain")
    .replace(/linked with submarine mountains/gi, "formed from raised underwater mountains")
    .replace(/old stable tableland/gi, "old stable plateau")
    .replace(/ancient tableland/gi, "old plateau")
    .replace(/old crystalline tableland/gi, "old rocky plateau")
    .replace(/old tableland/gi, "old plateau")
    .replace(/arid sandy region/gi, "dry sandy region")
    .replace(/sandy and arid/gi, "dry and sandy")
    .replace(/sparse arid vegetation/gi, "sparse desert vegetation")
    .replace(/elevated submarine mountains/gi, "raised underwater mountains")
    .replace(/submarine mountains/gi, "underwater mountains")
    .replace(/river-laid alluvium/gi, "river deposits")
    .replace(/alluvial deposition/gi, "river deposits");
}

export const GEO_PHY_001_CP011_REVIEW_BATCH_V2: readonly GeoPhy001Cp011ReviewQuestion[] = Object.freeze(
  GEO_PHY_001_CP011_REVIEW_BATCH_V1.map((question) => {
    const stem = simpleStems[question.questionId];
    if (!stem) throw new Error(`CP011 V2 missing simple stem for ${question.questionId}`);
    const options = question.options.map(simpleOption);
    const canonicalAnswer = simpleOption(question.canonicalAnswer);
    const explanation = simpleExplanations[question.questionId] ?? question.explanation;
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

const heavyLearnerLanguage = /physiographic|correctly classified|incorrectly classified|alluvial depositional|structurally folded|most closely linked|characteristic of|elevated part of submarine|\ba underwater\b/i;

export function auditGeoPhy001Cp011ReviewBatchV2() {
  const base = auditGeoPhy001Cp011ReviewBatchV1();
  const issues = [...base.issues];

  for (const question of GEO_PHY_001_CP011_REVIEW_BATCH_V2) {
    const learner = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (heavyLearnerLanguage.test(learner)) issues.push(`${question.questionId}: heavy learner wording remains`);
    if (new Set(question.options).size !== 4) issues.push(`${question.questionId}: simplified options are not unique`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${question.questionId}: simplified answer mismatch`);
    if (question.difficulty !== "Hard" && question.stem.split(/\s+/).length > 18) {
      issues.push(`${question.questionId}: non-hard stem is still too long`);
    }
    const explanationWords = question.explanation.trim().split(/\s+/).length;
    const explanationLimit = question.difficulty === "Hard" ? 55 : 36;
    if (explanationWords > explanationLimit) issues.push(`${question.questionId}: explanation is too wordy`);
  }

  return { ...base, valid: issues.length === 0, issues };
}
