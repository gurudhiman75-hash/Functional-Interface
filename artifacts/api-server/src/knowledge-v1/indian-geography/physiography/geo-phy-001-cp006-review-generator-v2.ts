import { generateGeoPhy001Cp006ReviewBatchV1 } from "./geo-phy-001-cp006-review-generator-v1";

const stemOverrides: Record<string, string> = {
  "GEO-PHY-001-CP006-Q017": "The Mumbai–Goa stretch belongs to which coastal section?",
  "GEO-PHY-001-CP006-Q040": "Which is India's largest salt-water lake?",
  "GEO-PHY-001-CP006-Q050": "Consider the following statements: 1. The Eastern Coastal Plain is wide and level. 2. Its northern part is called the Northern Circar. 3. The Coromandel Coast is its northern section. How many statements are correct?",
  "GEO-PHY-001-CP006-Q051": "Consider the following statements: 1. Mahanadi, Godavari, Krishna and Kaveri form large deltas on the eastern coast. 2. Chilika is a feature of the western coast. 3. Chilika lies north of the Mahanadi delta. How many statements are correct?",
  "GEO-PHY-001-CP006-Q052": "Consider the following statements: 1. The western coast is an emergent coast. 2. The eastern coast is a submerged coast. 3. Rivers crossing the Western Coastal Plain generally form large deltas. How many statements are correct?",
  "GEO-PHY-001-CP006-Q053": "Consider the following statements: 1. Malabar is the southern section of the Western Coastal Plain. 2. Malabar is known for kayals or backwaters. 3. Konkan is the central section of the Western Coastal Plain. How many statements are correct?",
  "GEO-PHY-001-CP006-Q054": "Consider the following statements: 1. The Western Coastal Plain is generally wide. 2. The Eastern Coastal Plain is wider and more level than the western plain. 3. Large river deltas are mainly a feature of the western coast. How many statements are correct?",
};

const answerOverrides: Record<string, string> = {
  "GEO-PHY-001-CP006-Q050": "Only two",
  "GEO-PHY-001-CP006-Q051": "Only one",
  "GEO-PHY-001-CP006-Q052": "None",
  "GEO-PHY-001-CP006-Q053": "Only two",
  "GEO-PHY-001-CP006-Q054": "Only one",
};

const optionOverrides: Record<string, string[]> = {
  "GEO-PHY-001-CP006-Q001": ["Arabian Sea and Bay of Bengal", "Arabian Sea and Indian Ocean", "Bay of Bengal and Indian Ocean", "Indian Ocean and Andaman Sea"],
  "GEO-PHY-001-CP006-Q003": ["Northern and southern sides", "Northern and western sides", "Western and eastern sides", "Eastern and southern sides"],
  "GEO-PHY-001-CP006-Q004": ["Indian Ocean", "Bay of Bengal", "Andaman Sea", "Arabian Sea"],
  "GEO-PHY-001-CP006-Q005": ["Bay of Bengal", "Arabian Sea", "Indian Ocean", "Andaman Sea"],
  "GEO-PHY-001-CP006-Q007": ["Eastern Ghats and Arabian Sea", "Western Ghats and Bay of Bengal", "Western Ghats and Arabian Sea", "Eastern Ghats and Bay of Bengal"],
  "GEO-PHY-001-CP006-Q008": ["Broad and level", "Wide and deltaic", "Mountainous", "Narrow"],
  "GEO-PHY-001-CP006-Q010": ["Bay of Bengal", "Arabian Sea", "Indian Ocean", "Andaman Sea"],
  "GEO-PHY-001-CP006-Q022": ["Arabian Sea", "Bay of Bengal", "Indian Ocean", "Andaman Sea"],
  "GEO-PHY-001-CP006-Q023": ["Arabian Sea — wide eastern plain", "Bay of Bengal — narrow western plain", "Bay of Bengal — wide and level plain", "Western Ghats — eastern coastal plain"],
  "GEO-PHY-001-CP006-Q034": ["Western coast", "Eastern coast", "Inland drainage basin", "Himalayan foothills"],
  "GEO-PHY-001-CP006-Q041": ["Odisha — south of the Mahanadi delta", "Andhra Pradesh — south of the Godavari delta", "Tamil Nadu — south of the Kaveri delta", "Kerala — south of the Periyar mouth"],
  "GEO-PHY-001-CP006-Q044": ["It is an emergent coast", "It has broad river deltas", "It has a very wide continental shelf", "It is a submerged coast"],
  "GEO-PHY-001-CP006-Q046": ["Western coast", "Eastern coast", "Both coasts equally", "Neither coast"],
  "GEO-PHY-001-CP006-Q050": ["Only one", "Only two", "All three", "None"],
  "GEO-PHY-001-CP006-Q051": ["All three", "Only two", "Only one", "None"],
  "GEO-PHY-001-CP006-Q052": ["Only one", "Only two", "All three", "None"],
  "GEO-PHY-001-CP006-Q053": ["Only two", "Only one", "All three", "None"],
  "GEO-PHY-001-CP006-Q054": ["All three", "Only one", "Only two", "None"],
};

const explanationOverrides: Record<string, string> = {
  "GEO-PHY-001-CP006-Q050": "Statements 1 and 2 are correct. The Coromandel Coast is the southern, not the northern, section of the Eastern Coastal Plain.",
  "GEO-PHY-001-CP006-Q051": "Only statement 1 is correct. Chilika is on the eastern coast in Odisha and lies south, not north, of the Mahanadi delta.",
  "GEO-PHY-001-CP006-Q052": "None is correct. The western coast is submerged, the eastern coast is emergent, and western-coast rivers generally do not form deltas.",
  "GEO-PHY-001-CP006-Q053": "Statements 1 and 2 are correct. Konkan is the northern section; the Kannad Plain is the central section of the Western Coastal Plain.",
  "GEO-PHY-001-CP006-Q054": "Only statement 2 is correct. The Western Coastal Plain is generally narrow, while large river deltas are a major feature of the eastern coast.",
};

export function generateGeoPhy001Cp006ReviewBatchV2() {
  return generateGeoPhy001Cp006ReviewBatchV1().map((question) => {
    const canonicalAnswer = answerOverrides[question.questionId] ?? question.canonicalAnswer;
    const options = optionOverrides[question.questionId] ?? question.options;
    return {
      ...question,
      stem: stemOverrides[question.questionId] ?? question.stem,
      options,
      canonicalAnswer,
      explanation: explanationOverrides[question.questionId] ?? question.explanation,
    };
  });
}
