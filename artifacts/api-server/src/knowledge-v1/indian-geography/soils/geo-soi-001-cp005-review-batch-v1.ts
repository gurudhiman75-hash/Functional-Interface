import {
  GEO_SOI_001_SOURCE_IDS,
  placeGeoSoiOptions,
  type GeoSoi001Difficulty,
  type GeoSoi001Question,
} from "./geo-soi-001-review-types";

type RawQuestion = Readonly<{
  qlId: string;
  qlName: string;
  difficulty: GeoSoi001Difficulty;
  stem: string;
  answer: string;
  distractors: readonly string[];
  explanation: string;
  sourceFactIds: readonly string[];
}>;

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-SOI-001-QL-037",
    "qlName": "High-temperature and heavy-rainfall formation",
    "difficulty": "Easy",
    "stem": "Laterite soil commonly develops under which climatic conditions?",
    "answer": "High temperature and heavy rainfall",
    "distractors": [
      "Low temperature and permanent snow",
      "Very low rainfall and desert winds",
      "Annual river flooding only"
    ],
    "explanation": "Laterite soil commonly develops where temperatures are high and rainfall is heavy. Warmth speeds chemical weathering, while abundant rain moves dissolved materials through the soil profile.",
    "sourceFactIds": [
      "LATERITE-HIGH-TEMP-HEAVY-RAIN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-037",
    "qlName": "High-temperature and heavy-rainfall formation",
    "difficulty": "Easy",
    "stem": "Which climate is most favourable for the formation of laterite soil?",
    "answer": "A hot and wet climate",
    "distractors": [
      "A cold and dry climate",
      "A permanently frozen climate",
      "A dry desert climate"
    ],
    "explanation": "A hot, wet climate provides the heat and moisture needed for strong weathering and leaching. These conditions are central to the standard school-level explanation of laterite formation.",
    "sourceFactIds": [
      "LATERITE-HOT-WET"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-037",
    "qlName": "High-temperature and heavy-rainfall formation",
    "difficulty": "Medium",
    "stem": "Why does laterite soil commonly form in tropical and subtropical high-rainfall regions?",
    "answer": "Heat and abundant rain promote strong weathering and leaching",
    "distractors": [
      "Cold air stops all mineral change",
      "Dry winds deposit fresh river silt",
      "Low rainfall keeps all soluble material in place"
    ],
    "explanation": "High temperature increases the speed of chemical reactions, while heavy rain supplies water for leaching. Together they strongly alter the parent material and help produce lateritic soil.",
    "sourceFactIds": [
      "LATERITE-CLIMATE-PROCESS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-037",
    "qlName": "High-temperature and heavy-rainfall formation",
    "difficulty": "Medium",
    "stem": "A hill region is hot for most of the year and receives heavy seasonal rainfall. Which soil-forming environment does this favour?",
    "answer": "Laterite-soil formation",
    "distractors": [
      "Khadar renewal by river floods",
      "Arid-soil formation by desert winds",
      "Permanent glacial soil formation"
    ],
    "explanation": "Hot conditions plus heavy rainfall create the classic setting for laterite formation. The same climate also encourages strong downward removal of soluble materials from the soil.",
    "sourceFactIds": [
      "LATERITE-CLIMATE-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-037",
    "qlName": "High-temperature and heavy-rainfall formation",
    "difficulty": "Medium",
    "stem": "Which combination best matches the climatic setting of laterite soil?",
    "answer": "High temperature with heavy rainfall",
    "distractors": [
      "Low temperature with light snowfall",
      "Low rainfall with strong evaporation",
      "Moderate rainfall with yearly river deposition"
    ],
    "explanation": "Laterite formation is strongly linked with high temperature and heavy rainfall. These conditions differ from the dry setting of arid soils and the depositional setting of alluvial soils.",
    "sourceFactIds": [
      "LATERITE-CLIMATE-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-037",
    "qlName": "High-temperature and heavy-rainfall formation",
    "difficulty": "Hard",
    "stem": "Site A is hot and receives heavy rain; Site B is cool and dry. Other soil-forming factors are similar. Which site is more favourable for laterite development?",
    "answer": "Site A",
    "distractors": [
      "Site B",
      "Both are equally favourable for the same reason",
      "Neither because climate does not affect soil formation"
    ],
    "explanation": "Site A provides the warmth and abundant moisture needed for intense weathering and leaching. With other factors similar, its climate is much more favourable for laterite development than a cool, dry site.",
    "sourceFactIds": [
      "LATERITE-CLIMATE-REASONING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-038",
    "qlName": "Intense leaching process",
    "difficulty": "Easy",
    "stem": "Which soil-forming process is especially important in laterite soil?",
    "answer": "Intense leaching",
    "distractors": [
      "Annual flood deposition",
      "Wind deposition of dune sand",
      "Permanent freezing"
    ],
    "explanation": "Intense leaching is a defining process in laterite formation. Heavy rainfall moves soluble minerals downward and out of the upper soil, leaving the profile strongly altered.",
    "sourceFactIds": [
      "LATERITE-LEACHING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-038",
    "qlName": "Intense leaching process",
    "difficulty": "Easy",
    "stem": "What does heavy rainfall do during laterite formation?",
    "answer": "It washes soluble materials downward through the soil",
    "distractors": [
      "It prevents all mineral movement",
      "It deposits fresh Himalayan silt every year",
      "It turns clay directly into bedrock"
    ],
    "explanation": "Heavy rain carries water through the soil and dissolves or moves some soluble substances downward. This strong washing process is called leaching and is central to laterite development.",
    "sourceFactIds": [
      "LATERITE-RAIN-LEACHING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-038",
    "qlName": "Intense leaching process",
    "difficulty": "Medium",
    "stem": "Why can laterite soil become poor in soluble plant nutrients?",
    "answer": "Heavy rainfall leaches many soluble materials from the upper layers",
    "distractors": [
      "River floods remove all clay",
      "Cold temperatures freeze nutrients permanently",
      "Wind adds too much fresh humus"
    ],
    "explanation": "Leaching removes soluble substances from the upper soil as rainwater moves downward. Repeated heavy rainfall can therefore leave laterite soil with a lower natural supply of several plant nutrients.",
    "sourceFactIds": [
      "LATERITE-NUTRIENT-LEACHING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-038",
    "qlName": "Intense leaching process",
    "difficulty": "Medium",
    "stem": "A soil profile has been strongly washed by rain over a long period. Which process best explains this change?",
    "answer": "Leaching",
    "distractors": [
      "Deposition",
      "Glaciation",
      "Irrigation alone"
    ],
    "explanation": "Leaching is the downward movement and removal of soluble materials by percolating water. When rainfall is heavy and repeated, this process can become especially strong in lateritic regions.",
    "sourceFactIds": [
      "LATERITE-LEACHING-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-038",
    "qlName": "Intense leaching process",
    "difficulty": "Medium",
    "stem": "Which sequence best explains the development of strongly leached laterite soil?",
    "answer": "Heavy rain → water moves through soil → soluble materials are removed",
    "distractors": [
      "River flood → fresh silt is deposited → khadar forms",
      "Dry wind → sand accumulates → delta forms",
      "Snowfall → glacier deposits silt → regur forms"
    ],
    "explanation": "Heavy rainfall sends large amounts of water through the soil profile. As that water moves downward, it carries away soluble materials and gradually creates a strongly leached lateritic soil.",
    "sourceFactIds": [
      "LATERITE-LEACHING-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-038",
    "qlName": "Intense leaching process",
    "difficulty": "Hard",
    "stem": "Two warm regions have similar rocks, but one receives much heavier rainfall. Which region is more likely to show stronger leaching and laterite development?",
    "answer": "The region with heavier rainfall",
    "distractors": [
      "The drier region",
      "Both must show identical leaching",
      "Rainfall cannot affect leaching"
    ],
    "explanation": "Leaching depends heavily on the amount of water passing through the soil. In a warm region, heavier rainfall increases downward washing of soluble materials and therefore strengthens lateritic development.",
    "sourceFactIds": [
      "LATERITE-LEACHING-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-039",
    "qlName": "Low humus content",
    "difficulty": "Easy",
    "stem": "How is the humus content of laterite soil generally described?",
    "answer": "Low",
    "distractors": [
      "Very high everywhere",
      "Unlimited",
      "Absent only in river deltas"
    ],
    "explanation": "Laterite soil generally has a low humus content. High temperatures speed the activity of microorganisms, so organic matter decomposes rapidly instead of accumulating in large amounts.",
    "sourceFactIds": [
      "LATERITE-LOW-HUMUS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-039",
    "qlName": "Low humus content",
    "difficulty": "Easy",
    "stem": "Why is humus often low in laterite soil?",
    "answer": "Organic matter decomposes rapidly in the high-temperature environment",
    "distractors": [
      "Cold conditions stop decomposition",
      "Annual floods wash in fresh humus",
      "The soil contains no microorganisms"
    ],
    "explanation": "High temperature supports rapid microbial breakdown of plant and animal remains. Because decomposition is fast, less organic matter remains stored as humus in the soil.",
    "sourceFactIds": [
      "LATERITE-HUMUS-DECOMPOSITION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-039",
    "qlName": "Low humus content",
    "difficulty": "Medium",
    "stem": "Which factor directly helps explain the low humus content of laterite soil?",
    "answer": "Rapid microbial activity under high temperature",
    "distractors": [
      "Permanent freezing of organic matter",
      "Very slow decomposition in cold air",
      "Continuous deposition of fresh river silt"
    ],
    "explanation": "Warm conditions make microorganisms more active and increase the rate of decomposition. Organic remains are therefore broken down quickly, limiting the amount of humus that can build up.",
    "sourceFactIds": [
      "LATERITE-MICROBIAL-ACTIVITY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-039",
    "qlName": "Low humus content",
    "difficulty": "Medium",
    "stem": "A hot, wet soil has rapid decomposition of plant litter and little stored organic matter. Which feature of laterite soil does this describe?",
    "answer": "Low humus content",
    "distractors": [
      "High annual silt renewal",
      "Deep black clay cracking",
      "Desert salt accumulation"
    ],
    "explanation": "Rapid decomposition prevents large amounts of organic matter from remaining in the upper soil. This produces the characteristically low humus content of many laterite soils.",
    "sourceFactIds": [
      "LATERITE-HUMUS-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-039",
    "qlName": "Low humus content",
    "difficulty": "Medium",
    "stem": "Which statement best connects climate and humus in laterite soil?",
    "answer": "High temperature speeds decomposition, so humus accumulation remains low",
    "distractors": [
      "Heavy snow preserves humus permanently",
      "Low temperature causes intense lateritic leaching",
      "Dry winds add large amounts of humus"
    ],
    "explanation": "Lateritic regions are warm, and this warmth supports active microorganisms. Fast decomposition means organic material is recycled quickly rather than building a thick humus-rich layer.",
    "sourceFactIds": [
      "LATERITE-CLIMATE-HUMUS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-039",
    "qlName": "Low humus content",
    "difficulty": "Hard",
    "stem": "A soil forms in a hot, rainy region and is strongly leached, yet its surface has little humus. Which explanation best fits laterite soil?",
    "answer": "High temperature promotes rapid decomposition while rain promotes leaching",
    "distractors": [
      "Cold conditions preserve all organic matter",
      "River floods replace the soil each year",
      "Desert winds remove only clay"
    ],
    "explanation": "Two processes operate together in a lateritic environment. Heavy rain causes strong leaching, while high temperature speeds organic decomposition, so the soil can be both nutrient-poor and low in humus.",
    "sourceFactIds": [
      "LATERITE-HUMUS-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-040",
    "qlName": "Fertility limits and soil improvement",
    "difficulty": "Easy",
    "stem": "Why is laterite soil often naturally less fertile?",
    "answer": "Heavy leaching removes many soluble nutrients",
    "distractors": [
      "It is renewed by fresh silt every year",
      "It always contains excessive humus",
      "It forms only from fertile river mud"
    ],
    "explanation": "Laterite soil is often naturally less fertile because heavy rainfall removes many soluble plant nutrients. Low humus content can further reduce its natural nutrient reserve.",
    "sourceFactIds": [
      "LATERITE-LOW-FERTILITY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-040",
    "qlName": "Fertility limits and soil improvement",
    "difficulty": "Easy",
    "stem": "Which treatment can improve the agricultural usefulness of laterite soil?",
    "answer": "Manuring and suitable soil-management measures",
    "distractors": [
      "Removing all organic matter",
      "Increasing erosion",
      "Preventing all water from entering the soil"
    ],
    "explanation": "Laterite soil can support useful crops when farmers improve its fertility and manage the land carefully. Manure, fertilisers and suitable conservation practices help replace nutrients lost through leaching.",
    "sourceFactIds": [
      "LATERITE-IMPROVEMENT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-040",
    "qlName": "Fertility limits and soil improvement",
    "difficulty": "Medium",
    "stem": "Why may laterite soil need added nutrients for farming?",
    "answer": "Leaching and low humus can leave it nutrient-deficient",
    "distractors": [
      "Annual floods remove only stones",
      "It naturally contains unlimited plant nutrients",
      "Clay prevents any crop from growing"
    ],
    "explanation": "Strong leaching reduces several soluble nutrients, and rapid decomposition keeps humus low. Farmers may therefore need to add nutrients and improve soil management for dependable crop production.",
    "sourceFactIds": [
      "LATERITE-ADDED-NUTRIENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-040",
    "qlName": "Fertility limits and soil improvement",
    "difficulty": "Medium",
    "stem": "Which statement best describes the fertility of laterite soil?",
    "answer": "Natural fertility may be low, but proper treatment can make it productive",
    "distractors": [
      "It is always highly fertile without treatment",
      "It cannot support any crop under any condition",
      "Its fertility depends only on annual flood silt"
    ],
    "explanation": "Laterite soil often starts with low natural fertility because of leaching and low humus. With manuring, fertiliser and conservation measures, however, it can be used successfully for selected crops.",
    "sourceFactIds": [
      "LATERITE-FERTILITY-BALANCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-040",
    "qlName": "Fertility limits and soil improvement",
    "difficulty": "Medium",
    "stem": "A farmer improves a laterite field with manure and erosion-control measures. What is the main purpose?",
    "answer": "To restore nutrients and protect the thin nutrient supply from further loss",
    "distractors": [
      "To convert the field into alluvial soil",
      "To create annual floods",
      "To remove all remaining organic matter"
    ],
    "explanation": "Manure adds nutrients and organic material, while conservation measures reduce further soil loss. These practices help overcome the weak natural fertility that commonly follows intense leaching.",
    "sourceFactIds": [
      "LATERITE-MANURE-CONSERVATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-040",
    "qlName": "Fertility limits and soil improvement",
    "difficulty": "Hard",
    "stem": "Field A is strongly leached laterite with low humus; Field B is fresh alluvium. Why might Field A require more fertility management?",
    "answer": "Leaching and rapid decomposition have reduced its natural nutrient reserve",
    "distractors": [
      "Field A receives new river silt every year",
      "Field B contains no mineral material",
      "Laterite cannot absorb any added nutrients"
    ],
    "explanation": "Laterite loses soluble nutrients through heavy leaching and also stores little humus because decomposition is rapid. That combination often makes added nutrients and careful management more important than in fresh alluvial soil.",
    "sourceFactIds": [
      "LATERITE-FERTILITY-REASONING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-041",
    "qlName": "Karnataka, Kerala and Tamil Nadu distribution",
    "difficulty": "Easy",
    "stem": "Which southern state has important areas of laterite soil?",
    "answer": "Karnataka",
    "distractors": [
      "Punjab",
      "Haryana",
      "Bihar only"
    ],
    "explanation": "Karnataka contains important laterite-soil areas, especially in high-rainfall uplands and plateau margins. Its occurrence fits the hot, wet climate that favours strong leaching.",
    "sourceFactIds": [
      "LATERITE-KARNATAKA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-041",
    "qlName": "Karnataka, Kerala and Tamil Nadu distribution",
    "difficulty": "Easy",
    "stem": "Laterite soil is widely found in which pair of southern states?",
    "answer": "Kerala and Tamil Nadu",
    "distractors": [
      "Punjab and Haryana",
      "Bihar and Uttar Pradesh only",
      "Rajasthan and Punjab only"
    ],
    "explanation": "Kerala and Tamil Nadu contain important laterite-soil areas. High temperatures and heavy seasonal rainfall in suitable upland zones support lateritic weathering and leaching.",
    "sourceFactIds": [
      "LATERITE-KERALA-TN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-041",
    "qlName": "Karnataka, Kerala and Tamil Nadu distribution",
    "difficulty": "Medium",
    "stem": "Which group contains recognised laterite-soil regions?",
    "answer": "Karnataka, Kerala and Tamil Nadu",
    "distractors": [
      "Punjab, Haryana and western Uttar Pradesh",
      "Rajasthan, Punjab and Haryana",
      "Bihar, Punjab and Delhi only"
    ],
    "explanation": "Karnataka, Kerala and Tamil Nadu are standard southern occurrences of laterite soil. Their warm climate and high-rainfall uplands provide favourable conditions for lateritic development.",
    "sourceFactIds": [
      "LATERITE-SOUTHERN-GROUP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-041",
    "qlName": "Karnataka, Kerala and Tamil Nadu distribution",
    "difficulty": "Medium",
    "stem": "A map shades lateritic uplands across coastal and peninsular south India. Which state is a likely part of that pattern?",
    "answer": "Kerala",
    "distractors": [
      "Punjab",
      "Haryana",
      "Delhi"
    ],
    "explanation": "Kerala is a well-known laterite-soil region because many of its uplands receive high rainfall under warm tropical conditions. These conditions promote strong weathering and leaching.",
    "sourceFactIds": [
      "LATERITE-KERALA-MAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-041",
    "qlName": "Karnataka, Kerala and Tamil Nadu distribution",
    "difficulty": "Medium",
    "stem": "Why is laterite soil common in parts of Karnataka and Kerala?",
    "answer": "Warm temperatures and heavy rainfall favour intense leaching",
    "distractors": [
      "Permanent snow creates annual deposits",
      "Dry winds build river terraces",
      "Low rainfall prevents weathering"
    ],
    "explanation": "Both states include warm, high-rainfall regions where large amounts of water move through weathered material. This encourages intense leaching and laterite formation.",
    "sourceFactIds": [
      "LATERITE-SOUTH-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-041",
    "qlName": "Karnataka, Kerala and Tamil Nadu distribution",
    "difficulty": "Hard",
    "stem": "A hot, high-rainfall upland belt stretches through parts of Karnataka, Kerala and Tamil Nadu. Which soil is most likely to dominate suitable sites?",
    "answer": "Laterite soil",
    "distractors": [
      "Khadar",
      "Arid soil",
      "Bhangar only"
    ],
    "explanation": "The regional distribution and climate both point toward laterite soil. High temperature and heavy rainfall create the leaching environment typical of lateritic uplands in southern India.",
    "sourceFactIds": [
      "LATERITE-SOUTH-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-042",
    "qlName": "Madhya Pradesh, Odisha and Assam hill distribution",
    "difficulty": "Easy",
    "stem": "Laterite soil also occurs in hilly parts of which eastern state?",
    "answer": "Odisha",
    "distractors": [
      "Punjab",
      "Haryana",
      "Delhi"
    ],
    "explanation": "Hilly parts of Odisha contain laterite soil where warm conditions and substantial rainfall promote strong leaching. This occurrence is part of the wider eastern Indian lateritic belt.",
    "sourceFactIds": [
      "LATERITE-ODISHA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-042",
    "qlName": "Madhya Pradesh, Odisha and Assam hill distribution",
    "difficulty": "Easy",
    "stem": "Hilly areas of which northeastern state contain laterite soil?",
    "answer": "Assam",
    "distractors": [
      "Rajasthan",
      "Punjab",
      "Haryana"
    ],
    "explanation": "Some hilly areas of Assam contain laterite soil. The warm, wet environment supports intense weathering and leaching, which are central to laterite formation.",
    "sourceFactIds": [
      "LATERITE-ASSAM"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-042",
    "qlName": "Madhya Pradesh, Odisha and Assam hill distribution",
    "difficulty": "Medium",
    "stem": "Which central Indian state is included among recognised laterite-soil areas?",
    "answer": "Madhya Pradesh",
    "distractors": [
      "Punjab",
      "Haryana",
      "Delhi"
    ],
    "explanation": "Parts of Madhya Pradesh contain laterite soil, adding a central Indian occurrence to the better-known southern and eastern belts. The soil develops where local climate and relief favour strong leaching.",
    "sourceFactIds": [
      "LATERITE-MP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-042",
    "qlName": "Madhya Pradesh, Odisha and Assam hill distribution",
    "difficulty": "Medium",
    "stem": "Which group correctly identifies additional laterite-soil regions beyond south India?",
    "answer": "Madhya Pradesh, hilly Odisha and hilly Assam",
    "distractors": [
      "Punjab, Haryana and the active Ganga floodplain",
      "The Thar dunes, Punjab plains and Delhi ridge only",
      "Ladakh, Siachen and the Kashmir snowfields"
    ],
    "explanation": "Laterite soil occurs not only in southern India but also in parts of Madhya Pradesh and hilly areas of Odisha and Assam. These regions share suitable warm and rainy settings at many sites.",
    "sourceFactIds": [
      "LATERITE-ADDITIONAL-REGIONS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-042",
    "qlName": "Madhya Pradesh, Odisha and Assam hill distribution",
    "difficulty": "Medium",
    "stem": "A geography question places laterite soil in hilly Odisha and Assam. Which statement is correct?",
    "answer": "The distribution is valid because laterite also occurs in these high-rainfall hill areas",
    "distractors": [
      "It is incorrect because laterite exists only in Kerala",
      "It is incorrect because laterite forms only on active floodplains",
      "It is incorrect because laterite requires desert climate"
    ],
    "explanation": "Hilly areas of Odisha and Assam are recognised laterite-soil locations. Their warm, rainy conditions favour strong weathering and leaching, so the distribution is consistent with the formation process.",
    "sourceFactIds": [
      "LATERITE-HILL-DISTRIBUTION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-042",
    "qlName": "Madhya Pradesh, Odisha and Assam hill distribution",
    "difficulty": "Medium",
    "stem": "What common environmental feature helps link laterite occurrences in hilly Odisha and Assam?",
    "answer": "Warm conditions with substantial rainfall and leaching",
    "distractors": [
      "Annual deposition of fresh river silt only",
      "Extremely low rainfall",
      "Permanent frozen ground"
    ],
    "explanation": "Both regions can provide warm and wet hill environments where rainwater moves strongly through weathered material. That setting supports leaching and the development of laterite soil.",
    "sourceFactIds": [
      "LATERITE-HILL-COMMON-FACTOR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-043",
    "qlName": "Tea and coffee cultivation after improvement",
    "difficulty": "Easy",
    "stem": "Which plantation crops can be grown on suitably improved laterite soil?",
    "answer": "Tea and coffee",
    "distractors": [
      "Wheat and barley only",
      "Jute only",
      "Saffron only"
    ],
    "explanation": "Laterite soil can support tea and coffee when its fertility and erosion problems are properly managed. Manuring and suitable conservation measures help make the soil more productive.",
    "sourceFactIds": [
      "LATERITE-TEA-COFFEE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-043",
    "qlName": "Tea and coffee cultivation after improvement",
    "difficulty": "Easy",
    "stem": "What is usually needed before laterite soil becomes suitable for tea and coffee cultivation?",
    "answer": "Proper manuring and soil-conservation measures",
    "distractors": [
      "Annual renewal by river floods",
      "Removal of all organic matter",
      "Permanent waterlogging"
    ],
    "explanation": "Laterite soil often needs improvement because leaching leaves it low in nutrients. Manuring restores fertility, while conservation measures protect the soil and help plantation crops perform better.",
    "sourceFactIds": [
      "LATERITE-TEA-COFFEE-IMPROVEMENT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-043",
    "qlName": "Tea and coffee cultivation after improvement",
    "difficulty": "Medium",
    "stem": "Why can tea and coffee grow on laterite soil despite its low natural fertility?",
    "answer": "The soil can be improved through manuring and careful management",
    "distractors": [
      "The crops require no nutrients",
      "Laterite is renewed by annual floods",
      "The soil naturally contains unlimited humus"
    ],
    "explanation": "Laterite is not automatically barren. Farmers can add nutrients and manage erosion so that the soil supports plantation crops such as tea and coffee under suitable climate conditions.",
    "sourceFactIds": [
      "LATERITE-PLANTATION-MANAGEMENT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-043",
    "qlName": "Tea and coffee cultivation after improvement",
    "difficulty": "Medium",
    "stem": "A laterite plantation receives regular organic manure and erosion control. Which crop pair is a plausible choice?",
    "answer": "Tea and coffee",
    "distractors": [
      "Wheat and gram only",
      "Jute and sugar beet only",
      "Saffron and apple only"
    ],
    "explanation": "Tea and coffee are standard plantation crops linked with suitably improved laterite soil. Added nutrients and soil conservation help compensate for the soil's strong leaching and low humus.",
    "sourceFactIds": [
      "LATERITE-PLANTATION-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-043",
    "qlName": "Tea and coffee cultivation after improvement",
    "difficulty": "Medium",
    "stem": "Which statement best explains the relation between laterite soil and plantation farming?",
    "answer": "Low natural fertility can be managed, allowing crops such as tea and coffee to grow",
    "distractors": [
      "Laterite cannot support plantation crops under any treatment",
      "Tea grows only on annual flood deposits",
      "Coffee requires desert sand"
    ],
    "explanation": "Laterite soil often needs fertility improvement, but it can become agriculturally useful after proper treatment. Tea and coffee are important examples where suitable climate and management work together.",
    "sourceFactIds": [
      "LATERITE-PLANTATION-RELATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-043",
    "qlName": "Tea and coffee cultivation after improvement",
    "difficulty": "Medium",
    "stem": "A tea estate lies on lateritic upland soil. Which management step would most directly address the soil's natural weakness?",
    "answer": "Adding nutrients and limiting erosion",
    "distractors": [
      "Encouraging topsoil loss",
      "Removing all organic inputs",
      "Allowing unchecked runoff"
    ],
    "explanation": "Laterite commonly has low humus and reduced nutrient reserves after leaching. Adding nutrients improves fertility, while controlling erosion helps keep the improved topsoil in place.",
    "sourceFactIds": [
      "LATERITE-TEA-MANAGEMENT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-044",
    "qlName": "Red laterite and cashew cultivation",
    "difficulty": "Easy",
    "stem": "Red laterite soil is especially suitable for which crop in parts of south India?",
    "answer": "Cashew nut",
    "distractors": [
      "Jute",
      "Saffron",
      "Barley only"
    ],
    "explanation": "Red laterite soil is well known for cashew cultivation in parts of southern India. Cashew can perform well on these lateritic soils where climate and management are suitable.",
    "sourceFactIds": [
      "LATERITE-CASHEW"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-044",
    "qlName": "Red laterite and cashew cultivation",
    "difficulty": "Easy",
    "stem": "Which crop is commonly linked with red laterite soils of Tamil Nadu, Andhra Pradesh and Kerala?",
    "answer": "Cashew nut",
    "distractors": [
      "Jute",
      "Wheat only",
      "Saffron"
    ],
    "explanation": "Cashew nut is a standard crop relation for red laterite soils in Tamil Nadu, Andhra Pradesh and Kerala. This regional crop-soil link is frequently tested in Indian geography.",
    "sourceFactIds": [
      "LATERITE-CASHEW-STATES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-044",
    "qlName": "Red laterite and cashew cultivation",
    "difficulty": "Medium",
    "stem": "Which state group is correctly linked with cashew on red laterite soils?",
    "answer": "Tamil Nadu, Andhra Pradesh and Kerala",
    "distractors": [
      "Punjab, Haryana and Himachal Pradesh",
      "Bihar, Punjab and Delhi",
      "Rajasthan, Punjab and Haryana"
    ],
    "explanation": "Red laterite soils support cashew in parts of Tamil Nadu, Andhra Pradesh and Kerala. The crop is well adapted to suitable warm lateritic tracts in these states.",
    "sourceFactIds": [
      "LATERITE-CASHEW-REGION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-044",
    "qlName": "Red laterite and cashew cultivation",
    "difficulty": "Medium",
    "stem": "A warm coastal-upland district has red laterite soil and plans a tree crop. Which crop is a standard geographical match?",
    "answer": "Cashew nut",
    "distractors": [
      "Jute",
      "Saffron",
      "Barley"
    ],
    "explanation": "Cashew is a well-known crop for red laterite soil in parts of south India. The match is strongest when the warm climate and local lateritic terrain are also suitable for the crop.",
    "sourceFactIds": [
      "LATERITE-CASHEW-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-044",
    "qlName": "Red laterite and cashew cultivation",
    "difficulty": "Medium",
    "stem": "Which soil-crop relation is correctly matched?",
    "answer": "Red laterite soil — cashew nut",
    "distractors": [
      "Khadar — cashew as its defining crop",
      "Black soil — tea as its defining crop",
      "Arid soil — coffee as its defining crop"
    ],
    "explanation": "Red laterite soil and cashew nut form a standard regional soil-crop association in Indian geography. The relation is especially noted in parts of Tamil Nadu, Andhra Pradesh and Kerala.",
    "sourceFactIds": [
      "LATERITE-CASHEW-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-044",
    "qlName": "Red laterite and cashew cultivation",
    "difficulty": "Medium",
    "stem": "Why is cashew often used as a clue in questions on laterite soil?",
    "answer": "It is a recognised crop of red laterite tracts in parts of south India",
    "distractors": [
      "It grows only on fresh flood silt",
      "It requires permanent snow",
      "It is the defining crop of khadar"
    ],
    "explanation": "Cashew is repeatedly linked with red laterite soil in parts of southern India. When a question combines cashew with Tamil Nadu, Andhra Pradesh or Kerala, laterite is a strong soil clue.",
    "sourceFactIds": [
      "LATERITE-CASHEW-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-045",
    "qlName": "Integrated laterite-soil reasoning",
    "difficulty": "Easy",
    "stem": "A hot, rainy region has strongly leached soil with low humus. Which soil is most likely?",
    "answer": "Laterite soil",
    "distractors": [
      "Alluvial soil",
      "Black soil",
      "Arid soil"
    ],
    "explanation": "High temperature, heavy rainfall, strong leaching and low humus form a classic laterite-soil pattern. The combination is more reliable than using any single clue by itself.",
    "sourceFactIds": [
      "LATERITE-INTEGRATED-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-045",
    "qlName": "Integrated laterite-soil reasoning",
    "difficulty": "Easy",
    "stem": "Which soil is formed by intense leaching and can support tea or coffee after suitable improvement?",
    "answer": "Laterite soil",
    "distractors": [
      "Khadar",
      "Black soil",
      "Arid soil"
    ],
    "explanation": "Laterite soil develops under strong leaching in hot, wet regions. Although natural fertility may be low, manuring and conservation can make it suitable for plantation crops such as tea and coffee.",
    "sourceFactIds": [
      "LATERITE-INTEGRATED-PLANTATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-045",
    "qlName": "Integrated laterite-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which combination best describes laterite soil?",
    "answer": "Heavy rainfall, intense leaching and low humus",
    "distractors": [
      "Annual flood renewal, fresh silt and khadar",
      "Basaltic clay, deep summer cracking and regur",
      "Low rainfall, salt accumulation and desert sand"
    ],
    "explanation": "Laterite soil is shaped by a hot, wet climate and strong leaching. Rapid decomposition also keeps humus low, so these three clues commonly appear together in identification questions.",
    "sourceFactIds": [
      "LATERITE-INTEGRATED-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-045",
    "qlName": "Integrated laterite-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which statement best distinguishes laterite soil from black soil?",
    "answer": "Laterite is strongly leached in hot wet regions, while black soil is clay-rich and linked with Deccan basalt",
    "distractors": [
      "Both are newer river alluvium",
      "Black soil forms only by heavy leaching",
      "Laterite is defined by deep shrinkage cracks"
    ],
    "explanation": "Laterite formation depends strongly on high rainfall and leaching, while black soil is tied to basaltic parent material, heavy clay and shrink-swell behaviour. The formation processes are therefore quite different.",
    "sourceFactIds": [
      "LATERITE-VS-BLACK"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-045",
    "qlName": "Integrated laterite-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which chain best explains why laterite may need manuring?",
    "answer": "Heavy rainfall → intense leaching → nutrient loss → lower natural fertility",
    "distractors": [
      "River flood → fresh silt → nutrient loss → laterite",
      "Dry wind → sand deposition → high humus → laterite",
      "Basalt cracking → khadar renewal → low fertility"
    ],
    "explanation": "Heavy rainfall drives strong leaching, which removes soluble nutrients from the soil profile. Adding manure or fertiliser helps replace part of this lost nutrient supply for cultivation.",
    "sourceFactIds": [
      "LATERITE-FERTILITY-CHAIN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-045",
    "qlName": "Integrated laterite-soil reasoning",
    "difficulty": "Hard",
    "stem": "Consider the following statements about laterite soil: I. It develops under high temperature and heavy rainfall. II. Strong leaching is important in its formation. III. Proper treatment can make it useful for crops such as tea, coffee and cashew. Which statements are correct?",
    "answer": "I, II and III",
    "distractors": [
      "I and II only",
      "II and III only",
      "I and III only"
    ],
    "explanation": "All three statements fit the standard description of laterite soil. Climate and leaching explain its formation, while improved fertility and careful management allow selected plantation and tree crops to grow successfully.",
    "sourceFactIds": [
      "LATERITE-STATEMENTS"
    ]
  }
]);

export const GEO_SOI_001_CP005_REVIEW_BATCH_V1: readonly GeoSoi001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = (index + 1) % 4;
    return Object.freeze({
      questionId: `GEO-SOI-001-CP005-Q${String(index + 1).padStart(3, "0")}`,
      qlId: raw.qlId,
      qlName: raw.qlName,
      difficulty: raw.difficulty,
      stem: raw.stem,
      options: placeGeoSoiOptions(raw.answer, raw.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: raw.answer,
      explanation: raw.explanation,
      sourceIds: GEO_SOI_001_SOURCE_IDS,
      sourceFactIds: Object.freeze([...raw.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED = /associated with|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|sourceFact|runtimeRegistered|review-only|generator/i;

export function auditGeoSoi001Cp005ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoSoi001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_SOI_001_CP005_REVIEW_BATCH_V1) {
    if (ids.has(q.questionId)) issues.push("DUPLICATE_ID:" + q.questionId);
    ids.add(q.questionId);
    const stem = q.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(stem)) issues.push("DUPLICATE_STEM:" + q.questionId);
    stems.add(stem);
    const exp = q.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (explanations.has(exp)) issues.push("DUPLICATE_EXPLANATION:" + q.questionId);
    explanations.add(exp);
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;
    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push("OPTIONS:" + q.questionId);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push("ANSWER:" + q.questionId);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push("PROVENANCE:" + q.questionId);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push("LIFECYCLE:" + q.questionId);
    const learnerText = q.stem + "\n" + q.options.join("\n") + "\n" + q.explanation;
    if (BANNED.test(learnerText)) issues.push("STYLE:" + q.questionId);
    if (q.stem.length < 25 || q.stem.length > 360 || !q.stem.trim().endsWith("?")) issues.push("STEM_SHAPE:" + q.questionId);
    if (q.explanation.length < 150) issues.push("SHORT_EXPLANATION:" + q.questionId);
    if ((q.explanation.match(/[.!?](?:\s|$)/g) ?? []).length < 2) issues.push("EXPLANATION_DEPTH:" + q.questionId);
  }

  if (GEO_SOI_001_CP005_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_SOI_001_CP005_REVIEW_BATCH_V1.length);
  for (let n = 37; n <= 45; n += 1) {
    const qlId = "GEO-SOI-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "13,14,14,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_SOI_001_CP005_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
