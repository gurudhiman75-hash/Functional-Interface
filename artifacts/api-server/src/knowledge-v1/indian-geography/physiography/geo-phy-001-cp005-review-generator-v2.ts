import { generateGeoPhy001Cp005ReviewBatchV1 } from "./geo-phy-001-cp005-review-generator-v1";

const stemOverrides: Record<string, string> = {
  "GEO-PHY-001-CP005-Q004": "Which region is a sandy, dune-covered plain west of the Aravali Hills?",
  "GEO-PHY-001-CP005-Q005": "Which region has large areas of sand and dunes?",
  "GEO-PHY-001-CP005-Q011": "A region gets less than 150 mm of rain a year and has little vegetation. Which region is it?",
  "GEO-PHY-001-CP005-Q012": "Which statement best describes the rainfall and climate of the Indian Desert?",
  "GEO-PHY-001-CP005-Q013": "Which is the only large river of the Indian Desert?",
  "GEO-PHY-001-CP005-Q015": "Most rivers in the Indian Desert flow only during part of the year. They are called:",
  "GEO-PHY-001-CP005-Q016": "Why do many streams in the Indian Desert not reach the sea?",
  "GEO-PHY-001-CP005-Q017": "The Luni flows mainly through which part of the Indian Desert?",
  "GEO-PHY-001-CP005-Q018": "Which type of drainage is common in the Indian Desert?",
  "GEO-PHY-001-CP005-Q019": "What are barchans?",
  "GEO-PHY-001-CP005-Q021": "Which type of dune covers larger areas of the Indian Desert?",
  "GEO-PHY-001-CP005-Q023": "Which statement about desert dunes is correct?",
  "GEO-PHY-001-CP005-Q024": "Near the India-Pakistan border, which type of dune is more common?",
  "GEO-PHY-001-CP005-Q025": "Which processes mainly shape the surface of the Indian Desert?",
  "GEO-PHY-001-CP005-Q026": "Which feature is common in the Indian Desert?",
  "GEO-PHY-001-CP005-Q027": "Shifting sand dunes are mainly caused by:",
  "GEO-PHY-001-CP005-Q028": "Which group contains only desert features?",
  "GEO-PHY-001-CP005-Q029": "Why does wind strongly shape the Indian Desert?",
  "GEO-PHY-001-CP005-Q030": "Which pair is correct for the Indian Desert?",
  "GEO-PHY-001-CP005-Q031": "A desert stream ends in a lake or playa and does not reach the sea. This is called:",
  "GEO-PHY-001-CP005-Q032": "Water in many desert playas is usually:",
  "GEO-PHY-001-CP005-Q033": "What is commonly obtained from desert playas with salty water?",
  "GEO-PHY-001-CP005-Q034": "The northern part of the Great Indian Desert slopes towards:",
  "GEO-PHY-001-CP005-Q035": "The southern part of the Great Indian Desert slopes towards:",
  "GEO-PHY-001-CP005-Q036": "Which desert feature is a place where water is available?",
  "GEO-PHY-001-CP005-Q039": "Which pair is correctly matched?",
  "GEO-PHY-001-CP005-Q042": "Which pair is correctly matched?",
  "GEO-PHY-001-CP005-Q045": "Which pair is incorrectly matched?",
  "GEO-PHY-001-CP005-Q048": "Which drainage pair is incorrectly matched?",
  "GEO-PHY-001-CP005-Q051": "Consider the following statements: 1. Most desert rivers are seasonal (ephemeral). 2. Many seasonal streams disappear into the sand. 3. The Luni is a major river of the desert. How many statements are correct?",
  "GEO-PHY-001-CP005-Q052": "Consider the following statements: I. Wind and physical weathering strongly shape the desert surface. II. Mushroom rocks and shifting dunes are common desert features. Which is correct?",
  "GEO-PHY-001-CP005-Q053": "Consider the following statements: 1. Some desert streams end within the desert instead of reaching the sea. 2. Playas often contain slightly salty (brackish) water. 3. Salt can be obtained from these playas. How many statements are correct?",
  "GEO-PHY-001-CP005-Q054": "Consider the following statements: 1. The northern desert slopes towards Sindh. 2. The southern part slopes towards the Rann of Kachchh. 3. Longitudinal dunes are common near the India-Pakistan border. How many statements are correct?",
};

const exactText: Record<string, string> = {
  "An undulating sandy plain with sand dunes": "A sandy plain with an uneven surface and sand dunes",
  "A flat deltaic plain with distributaries": "A flat river delta",
  "A high snow-covered fold mountain": "A snow-covered mountain range",
  "West of the Aravalis and an undulating sandy surface": "West of the Aravali Hills and a sandy, uneven surface",
  "Arid climate": "Dry (arid) climate",
  "Rainfall is very low and the climate is arid": "Rainfall is very low and the climate is dry (arid)",
  "Ephemeral": "Seasonal (ephemeral)",
  "Short-lived streams with limited or inland flow": "Seasonal streams that often end within the desert",
  "Extreme aridity leaves loose dry material exposed to wind": "The dry surface has loose material that wind can move",
  "Mushroom rocks, shifting dunes and oasis": "Mushroom rocks, shifting dunes and oases",
  "Brackish": "Brackish (slightly salty)",
  "Playa — brackish inland basin": "Playa — inland basin with slightly salty water",
  "Oasis — arid-land feature": "Oasis — desert feature",
  "Indian Desert — sandy undulating plain": "Indian Desert — sandy, uneven plain",
  "Playa water — commonly brackish": "Playa water — usually slightly salty",
};

function simplifyText(text: string): string {
  if (exactText[text]) return exactText[text];
  return text
    .replace(/towards the western margins of/gi, "to the west of")
    .replace(/\bundulating\b/gi, "uneven")
    .replace(/gains greater prominence/gi, "is more common")
    .replace(/become more prominent/gi, "are more common")
    .replace(/especially prominent/gi, "common")
    .replace(/arid-land/gi, "desert")
    .replace(/annual rainfall generally/gi, "annual rainfall")
    .replace(/sparse natural vegetation/gi, "little natural vegetation");
}

const explanationOverrides: Record<string, string> = {
  "GEO-PHY-001-CP005-Q036": "An oasis is a place in a desert where water is available.",
};

export function generateGeoPhy001Cp005ReviewBatchV2() {
  return generateGeoPhy001Cp005ReviewBatchV1().map((question) => {
    const canonicalAnswer = simplifyText(question.canonicalAnswer);
    return {
      ...question,
      stem: stemOverrides[question.questionId] ?? simplifyText(question.stem),
      options: question.options.map(simplifyText),
      canonicalAnswer,
      explanation: explanationOverrides[question.questionId] ?? simplifyText(question.explanation),
    };
  });
}