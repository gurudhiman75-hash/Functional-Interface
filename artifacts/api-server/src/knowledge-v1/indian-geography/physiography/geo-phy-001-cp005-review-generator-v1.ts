import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import { GEO_PHY_001_CP005_FACTS_V1 as facts } from "./geo-phy-001-cp005-facts";
import type { GeoPhy001Cp005ReviewQuestion } from "./geo-phy-001-cp005-review-types";

const qlNames: Record<string, string> = {
  "GEO-PHY-001-QL-037": "Identify the Indian Desert from location and core clues",
  "GEO-PHY-001-QL-038": "Rainfall, climate and vegetation",
  "GEO-PHY-001-QL-039": "Drainage, ephemeral streams and Luni",
  "GEO-PHY-001-QL-040": "Barchans and longitudinal dunes",
  "GEO-PHY-001-QL-041": "Wind-shaped desert landforms and processes",
  "GEO-PHY-001-QL-042": "Inland drainage, playas, oasis and regional slope",
  "GEO-PHY-001-QL-043": "Correctly matched desert pair",
  "GEO-PHY-001-QL-044": "Incorrectly matched desert pair",
  "GEO-PHY-001-QL-045": "Multi-statement Indian Desert synthesis",
};

type Row = readonly [string, string, readonly string[], readonly string[]];

const rowsByQl: Record<number, readonly Row[]> = {
  37: [["The Indian Desert lies mainly on which side of the Aravali Hills?","Western side",["Western side","Eastern side","Northern side","Southern side"],["location"]],["Which description best identifies the Indian Desert?","An undulating sandy plain with sand dunes",["An undulating sandy plain with sand dunes","A flat deltaic plain with distributaries","A high snow-covered fold mountain","A lava plateau with black soil"],["surface"]],["Which region is found towards the western margins of the Aravali Hills?","Indian Desert",["Indian Desert","Northern Plains","Deccan Plateau","Coastal Plains","Brahmaputra Plain"],["location","surface"]],["An undulating plain dominated by sand dunes west of the Aravalis refers to which region?","Indian Desert",["Indian Desert","Central Highlands","Terai belt","Eastern Coastal Plain","Meghalaya Plateau"],["location","surface"]],["Which physical region of India is most closely associated with extensive sandy, dune-covered terrain?","Indian Desert",["Indian Desert","Himalayan Mountains","Northern Plains","Peninsular Plateau","Coastal Plains"],["surface"]],["Which pair of clues points to the Indian Desert?","West of the Aravalis and an undulating sandy surface",["West of the Aravalis and an undulating sandy surface","South of the Narmada and a triangular plateau","Between the Shiwaliks and Himachal with duns","Along the Bay of Bengal with large river deltas"],["location","surface"]]],
  38: [["The Indian Desert generally receives annual rainfall of less than:","150 mm",["150 mm","500 mm","1,000 mm","2,000 mm"],["rainfall"]],["Which climate is characteristic of the Indian Desert?","Arid climate",["Arid climate","Humid equatorial climate","Tundra climate","Marine west-coast climate"],["rainfall","vegetation"]],["Why is natural vegetation sparse over much of the Indian Desert?","Rainfall is very low",["Rainfall is very low","The region remains snow-covered","The soil stays permanently waterlogged","Tidal flooding occurs every day"],["rainfall","vegetation"]],["Which combination is typical of the Indian Desert?","Low rainfall and sparse vegetation",["Low rainfall and sparse vegetation","Heavy rainfall and dense evergreen forest","Frequent snowfall and alpine meadow","High rainfall and mangrove vegetation"],["rainfall","vegetation"]],["A region receiving below 150 mm of rain annually with low vegetation cover is most likely which Indian landform region?","Indian Desert",["Indian Desert","Western Coastal Plain","Brahmaputra Plain","Himadri","Ganga Delta"],["rainfall","vegetation"]],["Which statement best describes moisture conditions in the Indian Desert?","Rainfall is very low and the climate is arid",["Rainfall is very low and the climate is arid","Rainfall is high throughout the year","Snowmelt is the main moisture source","Frequent cyclones keep the region humid"],["rainfall","vegetation"]]],
  39: [["Which is the only large river identified with the Indian Desert?","Luni",["Luni","Godavari","Mahanadi","Kaveri","Teesta"],["luni"]],["What usually happens to many desert streams after the rainy season?","They disappear into the sand",["They disappear into the sand","They become perennial glaciers","They form large coastal deltas","They flow throughout the year to the sea"],["seasonal-streams"]],["Most rivers of the Indian Desert are best described as:","Ephemeral",["Ephemeral","Perennial","Glacial","Tidal"],["ephemeral","seasonal-streams"]],["Why do many streams in the Indian Desert fail to reach the sea?","Their flow is too limited and often disappears into sand",["Their flow is too limited and often disappears into sand","They are blocked by permanent ice","They are all diverted into eastern deltas","They flow only through underground limestone caves"],["rainfall","seasonal-streams"]],["The Luni is most strongly associated with which part of the Indian Desert?","Southern part",["Southern part","Extreme eastern Himalayan part","Northern deltaic part","Western coastal strip"],["luni"]],["Which drainage pattern is common in the Indian Desert?","Short-lived streams with limited or inland flow",["Short-lived streams with limited or inland flow","Dense perennial drainage to the sea","Only snow-fed rivers","Large tidal distributary networks"],["ephemeral","inland-drainage"]]],
  40: [["Barchans are which type of desert feature?","Crescent-shaped sand dunes",["Crescent-shaped sand dunes","Flat-topped lava plateaus","River-built natural levees","Glacial U-shaped valleys"],["barchans"]],["Which sand dunes become more prominent near the Indo-Pakistan boundary?","Longitudinal dunes",["Longitudinal dunes","Barchans only","River terraces","Moraines"],["longitudinal-dunes","barchans"]],["Which dune form covers larger areas of the Indian Desert in the standard description?","Barchans",["Barchans","Longitudinal dunes","Eskers","Drumlins"],["barchans","longitudinal-dunes"]],["A crescent-shaped dune seen in the Indian Desert is called a:","Barchan",["Barchan","Playa","Moraine","Delta"],["barchans"]],["Which comparison between dune types in the Indian Desert is correct?","Barchans are crescent-shaped; longitudinal dunes are prominent near the Indo-Pakistan boundary",["Barchans are crescent-shaped; longitudinal dunes are prominent near the Indo-Pakistan boundary","Barchans are river deposits; longitudinal dunes are glacial deposits","Barchans occur only in deltas; longitudinal dunes occur only on coasts","Both are formed mainly by sea waves"],["barchans","longitudinal-dunes"]],["Near the Indo-Pakistan boundary, which desert feature gains greater prominence?","Longitudinal sand dunes",["Longitudinal sand dunes","Mangrove swamps","Glacial moraines","Natural levees"],["longitudinal-dunes"]]],
  41: [["Which agents strongly shape the surface features of the Indian Desert?","Physical weathering and wind action",["Physical weathering and wind action","Glacial plucking and abrasion","Coral growth and wave action","Only river deposition"],["wind-landforms"]],["Which of the following is a characteristic arid landform of the Indian Desert?","Mushroom rock",["Mushroom rock","Fjord","Ox-bow lake","Natural levee"],["desert-landforms","wind-landforms"]],["Shifting dunes in the Indian Desert are most directly linked with:","Wind action",["Wind action","Glacial movement","Tidal currents","Coral deposition"],["wind-landforms","desert-landforms"]],["Which group contains only features associated with arid desert terrain?","Mushroom rocks, shifting dunes and oasis",["Mushroom rocks, shifting dunes and oasis","Moraines, cirques and fjords","Levees, deltas and ox-bow lakes","Coral reefs, lagoons and tidal flats"],["desert-landforms"]],["Why is wind geomorphology especially important in the Indian Desert?","Extreme aridity leaves loose dry material exposed to wind",["Extreme aridity leaves loose dry material exposed to wind","The region is permanently ice-covered","Daily tides reshape the interior","Dense forests prevent surface erosion"],["vegetation","wind-landforms"]],["Which process-landform relation is correct for the Indian Desert?","Wind action — shifting sand dunes",["Wind action — shifting sand dunes","Glacial erosion — barchans","River deposition — mushroom rocks","Coral growth — oasis"],["wind-landforms","desert-landforms"]]],
  42: [["A desert stream that ends in a lake or playa instead of reaching the sea shows:","Inland drainage",["Inland drainage","Deltaic drainage","Glacial drainage","Tidal drainage"],["inland-drainage"]],["Water in many desert playas is commonly:","Brackish",["Brackish","Fresh glacier meltwater","Deep-ocean saline water","Permanently frozen"],["playa"]],["Which resource is commonly obtained from brackish desert playas?","Salt",["Salt","Coal","Petroleum from dune sand","Timber"],["playa"]],["Broadly, the northern part of the Great Indian Desert slopes towards:","Sindh",["Sindh","Bay of Bengal","Malabar Coast","Brahmaputra Valley"],["regional-slope"]],["Broadly, the southern part of the Great Indian Desert slopes towards:","Rann of Kachchh",["Rann of Kachchh","Sindh","Ganga Delta","Coromandel Coast"],["regional-slope"]],["Which feature is a localized water-related feature within an arid desert landscape?","Oasis",["Oasis","Moraine","Delta","Fjord"],["desert-landforms"]]],
  43: [["Which of the following pairs is correctly matched?","Indian Desert — west of the Aravali Hills",["Indian Desert — west of the Aravali Hills","Indian Desert — east of the Eastern Ghats","Luni — Himalayan glacier-fed river","Barchan — river-built levee"],["location"]],["Choose the correctly matched desert feature.","Barchan — crescent-shaped dune",["Barchan — crescent-shaped dune","Playa — snow-fed valley","Luni — major east-coast delta river","Oasis — glacial deposit"],["barchans"]],["Which pair gives the correct association?","Longitudinal dunes — prominent near the Indo-Pakistan boundary",["Longitudinal dunes — prominent near the Indo-Pakistan boundary","Barchans — formed by glaciers","Luni — perennial Himalayan river","Playa — open-ocean bay"],["longitudinal-dunes"]],["Identify the correctly matched pair.","Luni — major river of the Indian Desert",["Luni — major river of the Indian Desert","Godavari — inland desert stream","Barchan — brackish lake","Mushroom rock — river delta"],["luni"]],["Which desert pair is correctly matched?","Playa — brackish inland basin",["Playa — brackish inland basin","Oasis — crescent dune","Barchan — glacial hollow","Luni — coastal lagoon"],["playa","inland-drainage"]],["Which process-feature pair is correct for the Indian Desert?","Wind action — shifting dunes",["Wind action — shifting dunes","Glacial erosion — mushroom rocks","Tidal action — barchans","River deposition — oasis"],["wind-landforms","desert-landforms"]]],
  44: [["Which of the following pairs is incorrectly matched?","Indian Desert — east of the Aravali Hills",["Indian Desert — east of the Aravali Hills","Barchan — crescent-shaped dune","Luni — desert river","Playa — inland basin"],["location"]],["Identify the incorrectly matched desert pair.","Longitudinal dunes — most prominent along the eastern coast",["Longitudinal dunes — most prominent along the eastern coast","Barchans — crescent-shaped dunes","Luni — southern desert region","Oasis — arid-land feature"],["longitudinal-dunes"]],["Which association is incorrect?","Indian Desert — annual rainfall generally above 2,000 mm",["Indian Desert — annual rainfall generally above 2,000 mm","Indian Desert — arid climate","Indian Desert — sparse vegetation","Indian Desert — sandy undulating plain"],["rainfall","vegetation","surface"]],["Which river-feature pair is wrongly matched?","Luni — perennial snow-fed Himalayan river",["Luni — perennial snow-fed Himalayan river","Desert streams — often ephemeral","Seasonal streams — may disappear into sand","Luni — major river of the desert"],["luni","ephemeral"]],["Which landform pair is incorrectly matched?","Mushroom rock — feature formed mainly by glacial ice",["Mushroom rock — feature formed mainly by glacial ice","Shifting dune — wind action","Barchan — crescent-shaped dune","Oasis — desert water-related feature"],["wind-landforms","desert-landforms"]],["Which drainage association is incorrect for the Indian Desert?","Playa — river mouth opening directly into the sea",["Playa — river mouth opening directly into the sea","Inland drainage — stream may terminate within the desert","Playa water — commonly brackish","Ephemeral river — short-lived flow"],["inland-drainage","playa","ephemeral"]]],
  45: [["Consider the following statements: 1. The Indian Desert lies west of the Aravali Hills. 2. Annual rainfall is generally below 150 mm. 3. The region has sparse natural vegetation. How many statements are correct?","All three",["Only one","Only two","All three","None"],["location","rainfall","vegetation"]],["Consider the following statements: I. Barchans are crescent-shaped dunes. II. Longitudinal dunes become prominent near the Indo-Pakistan boundary. Which is correct?","Both I and II",["I only","II only","Both I and II","Neither I nor II"],["barchans","longitudinal-dunes"]],["Consider the following statements: 1. Most desert rivers are ephemeral. 2. Many seasonal streams disappear into sand. 3. The Luni is a major river of the desert. How many are correct?","All three",["Only one","Only two","All three","None"],["ephemeral","seasonal-streams","luni"]],["Consider the following statements: I. Physical weathering and wind action strongly shape the desert. II. Mushroom rocks and shifting dunes are characteristic arid features. Which is correct?","Both I and II",["I only","II only","Both I and II","Neither I nor II"],["wind-landforms","desert-landforms"]],["Consider the following statements: 1. Some desert streams show inland drainage. 2. Playas commonly contain brackish water. 3. Such playas can be sources of salt. How many are correct?","All three",["Only one","Only two","All three","None"],["inland-drainage","playa"]],["Consider the following statements: 1. The northern desert slopes broadly towards Sindh. 2. The southern part slopes towards the Rann of Kachchh. 3. Longitudinal dunes are especially prominent near the Indo-Pakistan boundary. How many are correct?","All three",["Only one","Only two","All three","None"],["regional-slope","longitudinal-dunes"]]],
};

function fact(key: string) {
  const row = facts.find((item) => item.id === key);
  if (!row) throw new Error(`Unknown CP005 fact: ${key}`);
  return row;
}

function difficulty(ql: number): KnowledgeV1Difficulty {
  if (ql <= 39) return "Easy";
  if (ql <= 44) return "Medium";
  return "Hard";
}

function fourOptions(pool: readonly string[], correct: string, seed: string, target: number) {
  const uniquePool = [...new Set(pool)];
  if (!uniquePool.includes(correct)) uniquePool.unshift(correct);
  const others = deterministicShuffle(uniquePool.filter((item) => item !== correct), `${seed}:others`).slice(0, 3);
  if (others.length !== 3) throw new Error(`Need three distractors for ${seed}`);
  const options = deterministicShuffle([correct, ...others], `${seed}:options`);
  const current = options.indexOf(correct);
  [options[current], options[target]] = [options[target], options[current]];
  return options;
}

function makeQuestion(ql: number, item: number, globalIndex: number): GeoPhy001Cp005ReviewQuestion {
  const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
  const [stem, answer, pool, factKeys] = rowsByQl[ql][item];
  const target = globalIndex % 4;
  const provenance = factKeys.map(fact);
  return {
    questionId: `GEO-PHY-001-CP005-Q${String(globalIndex + 1).padStart(3, "0")}`,
    chapterId: "GEO-PHY-001",
    cpId: "GEO-PHY-001-CP005",
    qlId,
    qlName: qlNames[qlId],
    difficulty: difficulty(ql),
    stem,
    options: fourOptions(pool, answer, `${qlId}:${item}`, target),
    correctIndex: target,
    canonicalAnswer: answer,
    explanation: provenance.map((row) => row.fact).join(" "),
    sourceIds: [...new Set(provenance.flatMap((row) => row.sourceIds))],
    sourceFactIds: [...new Set(provenance.flatMap((row) => row.sourceFactIds))],
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export function generateGeoPhy001Cp005ReviewBatchV1(): GeoPhy001Cp005ReviewQuestion[] {
  const questions: GeoPhy001Cp005ReviewQuestion[] = [];
  for (let ql = 37; ql <= 45; ql += 1) {
    for (let item = 0; item < 6; item += 1) questions.push(makeQuestion(ql, item, questions.length));
  }
  return questions;
}
