import {
  GEO_LOC_001_SOURCE_IDS,
  placeGeoLocOptions,
  type GeoLoc001Difficulty,
  type GeoLoc001Question,
} from "./geo-loc-001-review-types";

type RawQuestion = Readonly<{
  qlId: string;
  qlName: string;
  difficulty: GeoLoc001Difficulty;
  stem: string;
  answer: string;
  distractors: readonly string[];
  explanation: string;
  sourceFactIds: readonly string[];
}>;

const CP007_SOURCE_IDS = Object.freeze([
  ...GEO_LOC_001_SOURCE_IDS,
  "ANDAMAN-UT-PROFILE",
  "LAKSHADWEEP-ABOUT-OFFICIAL",
  "LAKSHADWEEP-MINICOY-OFFICIAL",
  "INCREDIBLE-INDIA-BARREN-ISLAND",
] as const);

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-LOC-001-QL-055",
    "qlName": "Andaman & Nicobar — southeast/eastern island group",
    "difficulty": "Easy",
    "stem": "Which Indian island group lies to the southeast of the mainland?",
    "answer": "Andaman and Nicobar Islands",
    "distractors": [
      "Lakshadweep",
      "Diu",
      "Majuli"
    ],
    "explanation": "The Andaman and Nicobar Islands lie to the southeast of mainland India in the Bay of Bengal–Andaman Sea region. Lakshadweep lies to the southwest in the Arabian Sea.",
    "sourceFactIds": [
      "AN-SE-MAINLAND"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-055",
    "qlName": "Andaman & Nicobar — southeast/eastern island group",
    "difficulty": "Easy",
    "stem": "Which major Indian island group is located on the eastern side of the peninsula?",
    "answer": "Andaman and Nicobar Islands",
    "distractors": [
      "Lakshadweep",
      "Minicoy alone",
      "Daman and Diu"
    ],
    "explanation": "Andaman and Nicobar forms India's major eastern island territory. Lakshadweep lies off the western coast in the Arabian Sea.",
    "sourceFactIds": [
      "AN-EASTERN-ISLAND-GROUP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-055",
    "qlName": "Andaman & Nicobar — southeast/eastern island group",
    "difficulty": "Medium",
    "stem": "A map shows an Indian Union Territory southeast of the mainland near the Andaman Sea. Which territory is it?",
    "answer": "Andaman and Nicobar Islands",
    "distractors": [
      "Lakshadweep",
      "Chandigarh",
      "Puducherry"
    ],
    "explanation": "The island Union Territory southeast of mainland India is Andaman and Nicobar Islands. Its islands extend through the Bay of Bengal and Andaman Sea region.",
    "sourceFactIds": [
      "AN-MAP-SE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-055",
    "qlName": "Andaman & Nicobar — southeast/eastern island group",
    "difficulty": "Medium",
    "stem": "Which water-side clue points to the Andaman and Nicobar Islands rather than Lakshadweep?",
    "answer": "Bay of Bengal and Andaman Sea side",
    "distractors": [
      "Arabian Sea west of Kerala",
      "Gulf of Kachchh side",
      "Konkan coast only"
    ],
    "explanation": "Andaman and Nicobar lies on India's eastern and southeastern maritime side in the Bay of Bengal–Andaman Sea region. Lakshadweep belongs to the Arabian Sea side.",
    "sourceFactIds": [
      "AN-WATER-SIDE-CLUE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-055",
    "qlName": "Andaman & Nicobar — southeast/eastern island group",
    "difficulty": "Medium",
    "stem": "How do India's two main island Union Territories differ in location?",
    "answer": "Andaman and Nicobar lies east/southeast of the mainland, while Lakshadweep lies southwest",
    "distractors": [
      "Both lie only west of Gujarat",
      "Lakshadweep lies east of Myanmar",
      "Andaman and Nicobar lies west of Kerala"
    ],
    "explanation": "India's two island Union Territories occupy opposite maritime sides. Andaman and Nicobar lies to the east/southeast, while Lakshadweep lies to the southwest.",
    "sourceFactIds": [
      "AN-VS-LAK-LOCATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-055",
    "qlName": "Andaman & Nicobar — southeast/eastern island group",
    "difficulty": "Medium",
    "stem": "Which island group would be reached by sailing far southeast from India's eastern coast?",
    "answer": "Andaman and Nicobar Islands",
    "distractors": [
      "Lakshadweep",
      "Diu",
      "Minicoy"
    ],
    "explanation": "Andaman and Nicobar lies southeast of the mainland on India's eastern maritime side. Lakshadweep and Minicoy lie west and southwest of the peninsula.",
    "sourceFactIds": [
      "AN-SAIL-SE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-056",
    "qlName": "Lakshadweep — southwest/western island group",
    "difficulty": "Easy",
    "stem": "Which Indian island group lies in the Arabian Sea west of Kerala?",
    "answer": "Lakshadweep",
    "distractors": [
      "Andaman and Nicobar Islands",
      "Sundarbans",
      "Majuli"
    ],
    "explanation": "Lakshadweep lies in the Arabian Sea off the Kerala coast. Andaman and Nicobar lies on India's opposite, eastern maritime side.",
    "sourceFactIds": [
      "LAK-WEST-KERALA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-056",
    "qlName": "Lakshadweep — southwest/western island group",
    "difficulty": "Easy",
    "stem": "Which Union Territory forms India's main western island group?",
    "answer": "Lakshadweep",
    "distractors": [
      "Andaman and Nicobar Islands",
      "Puducherry",
      "Chandigarh"
    ],
    "explanation": "Lakshadweep is India's island Union Territory in the Arabian Sea to the southwest of the mainland. Andaman and Nicobar is the eastern island Union Territory.",
    "sourceFactIds": [
      "LAK-WESTERN-ISLAND-UT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-056",
    "qlName": "Lakshadweep — southwest/western island group",
    "difficulty": "Medium",
    "stem": "A map marks islands 220–440 km off Kerala in the Arabian Sea. Which island group is shown?",
    "answer": "Lakshadweep",
    "distractors": [
      "Andaman Islands",
      "Nicobar Islands",
      "Sri Lanka"
    ],
    "explanation": "Lakshadweep lies a few hundred kilometres off Kerala in the Arabian Sea. That west-coast location distinguishes it from Andaman and Nicobar.",
    "sourceFactIds": [
      "LAK-KERALA-DISTANCE-CLUE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-056",
    "qlName": "Lakshadweep — southwest/western island group",
    "difficulty": "Medium",
    "stem": "Which direction from the Indian mainland leads toward Lakshadweep?",
    "answer": "Southwest",
    "distractors": [
      "Northeast",
      "Due north",
      "Southeast toward Myanmar"
    ],
    "explanation": "Lakshadweep lies southwest of mainland India off the Kerala coast. The Andaman and Nicobar group lies in the opposite southeastern direction.",
    "sourceFactIds": [
      "LAK-SOUTHWEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-056",
    "qlName": "Lakshadweep — southwest/western island group",
    "difficulty": "Medium",
    "stem": "Which sea should be marked around Lakshadweep on an India map?",
    "answer": "Arabian Sea",
    "distractors": [
      "Bay of Bengal",
      "Red Sea",
      "South China Sea"
    ],
    "explanation": "Lakshadweep is an Arabian Sea archipelago west of the Indian peninsula. The Bay of Bengal belongs to India's eastern island geography.",
    "sourceFactIds": [
      "LAK-ARABIAN-SEA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-056",
    "qlName": "Lakshadweep — southwest/western island group",
    "difficulty": "Medium",
    "stem": "Which pairing is correct?",
    "answer": "Lakshadweep — west of Kerala",
    "distractors": [
      "Lakshadweep — east of West Bengal",
      "Lakshadweep — north of Nepal",
      "Lakshadweep — southeast of Great Nicobar"
    ],
    "explanation": "Lakshadweep lies off Kerala on India's western maritime side. The other options place the island group in unrelated parts of the map.",
    "sourceFactIds": [
      "LAK-KERALA-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-057",
    "qlName": "Sri Vijaya Puram — capital of Andaman & Nicobar Islands",
    "difficulty": "Easy",
    "stem": "What is the capital of the Andaman and Nicobar Islands?",
    "answer": "Sri Vijaya Puram",
    "distractors": [
      "Kavaratti",
      "Kochi",
      "Panaji"
    ],
    "explanation": "Sri Vijaya Puram is the current capital of the Andaman and Nicobar Islands. The city was formerly known as Port Blair.",
    "sourceFactIds": [
      "AN-CAPITAL-SRI-VIJAYA-PURAM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-057",
    "qlName": "Sri Vijaya Puram — capital of Andaman & Nicobar Islands",
    "difficulty": "Easy",
    "stem": "Sri Vijaya Puram is the capital of which Union Territory?",
    "answer": "Andaman and Nicobar Islands",
    "distractors": [
      "Lakshadweep",
      "Puducherry",
      "Ladakh"
    ],
    "explanation": "Sri Vijaya Puram is the administrative capital of the Andaman and Nicobar Islands. Lakshadweep's capital is Kavaratti.",
    "sourceFactIds": [
      "SRI-VIJAYA-PURAM-UT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-057",
    "qlName": "Sri Vijaya Puram — capital of Andaman & Nicobar Islands",
    "difficulty": "Medium",
    "stem": "Which capital belongs to India's eastern island Union Territory?",
    "answer": "Sri Vijaya Puram",
    "distractors": [
      "Kavaratti",
      "Daman",
      "Leh"
    ],
    "explanation": "India's eastern island Union Territory is Andaman and Nicobar Islands, whose capital is Sri Vijaya Puram. Kavaratti is the capital of the western island territory, Lakshadweep.",
    "sourceFactIds": [
      "EASTERN-ISLAND-CAPITAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-057",
    "qlName": "Sri Vijaya Puram — capital of Andaman & Nicobar Islands",
    "difficulty": "Medium",
    "stem": "Which capital–territory pair is correct?",
    "answer": "Sri Vijaya Puram — Andaman and Nicobar Islands",
    "distractors": [
      "Sri Vijaya Puram — Lakshadweep",
      "Kavaratti — Andaman and Nicobar Islands",
      "Kochi — Lakshadweep"
    ],
    "explanation": "Sri Vijaya Puram is the capital of Andaman and Nicobar Islands. Kavaratti, not Sri Vijaya Puram or Kochi, is the capital of Lakshadweep.",
    "sourceFactIds": [
      "SRI-VIJAYA-PURAM-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-057",
    "qlName": "Sri Vijaya Puram — capital of Andaman & Nicobar Islands",
    "difficulty": "Medium",
    "stem": "A question uses the former name Port Blair. Which current capital name should you recognise?",
    "answer": "Sri Vijaya Puram",
    "distractors": [
      "Kavaratti",
      "Shaheed Dweep",
      "Swaraj Dweep"
    ],
    "explanation": "Port Blair was renamed Sri Vijaya Puram, which is the current official capital name. Exam content should recognise both names while using the current one in answers.",
    "sourceFactIds": [
      "PORT-BLAIR-CURRENT-NAME"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-057",
    "qlName": "Sri Vijaya Puram — capital of Andaman & Nicobar Islands",
    "difficulty": "Hard",
    "stem": "Capital X belongs to the Union Territory containing Great Nicobar and Barren Island. What is X?",
    "answer": "Sri Vijaya Puram",
    "distractors": [
      "Kavaratti",
      "Panaji",
      "Thiruvananthapuram"
    ],
    "explanation": "Great Nicobar and Barren Island are part of Andaman and Nicobar Islands. The capital of that Union Territory is Sri Vijaya Puram.",
    "sourceFactIds": [
      "AN-CAPITAL-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-058",
    "qlName": "Kavaratti — capital of Lakshadweep",
    "difficulty": "Easy",
    "stem": "What is the capital of Lakshadweep?",
    "answer": "Kavaratti",
    "distractors": [
      "Minicoy",
      "Agatti",
      "Sri Vijaya Puram"
    ],
    "explanation": "Kavaratti is the capital and principal town of Lakshadweep. Minicoy and Agatti are important islands but are not the Union Territory capital.",
    "sourceFactIds": [
      "LAK-CAPITAL-KAVARATTI"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-058",
    "qlName": "Kavaratti — capital of Lakshadweep",
    "difficulty": "Easy",
    "stem": "Kavaratti is the capital of which Union Territory?",
    "answer": "Lakshadweep",
    "distractors": [
      "Andaman and Nicobar Islands",
      "Puducherry",
      "Dadra and Nagar Haveli and Daman and Diu"
    ],
    "explanation": "Kavaratti serves as the administrative capital of Lakshadweep in the Arabian Sea. Andaman and Nicobar Islands has Sri Vijaya Puram as its capital.",
    "sourceFactIds": [
      "KAVARATTI-LAKSHADWEEP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-058",
    "qlName": "Kavaratti — capital of Lakshadweep",
    "difficulty": "Medium",
    "stem": "Which capital belongs to India's Arabian Sea island Union Territory?",
    "answer": "Kavaratti",
    "distractors": [
      "Sri Vijaya Puram",
      "Port Louis",
      "Male"
    ],
    "explanation": "Lakshadweep is India's island Union Territory in the Arabian Sea, and Kavaratti is its capital. Sri Vijaya Puram belongs to Andaman and Nicobar Islands.",
    "sourceFactIds": [
      "ARABIAN-SEA-UT-CAPITAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-058",
    "qlName": "Kavaratti — capital of Lakshadweep",
    "difficulty": "Medium",
    "stem": "Which island should be selected if a question asks for Lakshadweep's administrative capital?",
    "answer": "Kavaratti",
    "distractors": [
      "Minicoy",
      "Andrott",
      "Great Nicobar"
    ],
    "explanation": "Kavaratti is Lakshadweep's administrative capital. Minicoy and Andrott belong to the same island territory, but neither is the capital.",
    "sourceFactIds": [
      "KAVARATTI-ADMIN-CAPITAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-058",
    "qlName": "Kavaratti — capital of Lakshadweep",
    "difficulty": "Medium",
    "stem": "Which capital–island group match is accurate?",
    "answer": "Kavaratti — Lakshadweep",
    "distractors": [
      "Kavaratti — Nicobar Islands",
      "Sri Vijaya Puram — Lakshadweep",
      "Minicoy — Andaman Islands"
    ],
    "explanation": "Kavaratti is the capital of Lakshadweep. Sri Vijaya Puram is the capital of Andaman and Nicobar Islands, while Minicoy is a Lakshadweep island rather than a capital.",
    "sourceFactIds": [
      "KAVARATTI-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-058",
    "qlName": "Kavaratti — capital of Lakshadweep",
    "difficulty": "Hard",
    "stem": "Capital X lies in India's western island Union Territory, while Sri Vijaya Puram lies in the eastern island territory. What is X?",
    "answer": "Kavaratti",
    "distractors": [
      "Minicoy",
      "Agatti",
      "Kochi"
    ],
    "explanation": "India's western island Union Territory is Lakshadweep, whose capital is Kavaratti. Sri Vijaya Puram is the capital of the eastern island territory, Andaman and Nicobar Islands.",
    "sourceFactIds": [
      "KAVARATTI-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-059",
    "qlName": "Minicoy — southernmost island of Lakshadweep",
    "difficulty": "Easy",
    "stem": "Which is the southernmost island of Lakshadweep?",
    "answer": "Minicoy",
    "distractors": [
      "Kavaratti",
      "Agatti",
      "Amini"
    ],
    "explanation": "Minicoy is the southernmost island of Lakshadweep. It lies well south of the main northern island cluster and close to the Maldives.",
    "sourceFactIds": [
      "MINICOY-SOUTHERNMOST-LAK"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-059",
    "qlName": "Minicoy — southernmost island of Lakshadweep",
    "difficulty": "Easy",
    "stem": "Minicoy belongs to which Indian island group?",
    "answer": "Lakshadweep",
    "distractors": [
      "Andaman Islands",
      "Nicobar Islands",
      "Sundarbans"
    ],
    "explanation": "Minicoy is part of Lakshadweep in the Arabian Sea. It is the southernmost island of that Union Territory and lies well south of the main northern cluster.",
    "sourceFactIds": [
      "MINICOY-LAKSHADWEEP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-059",
    "qlName": "Minicoy — southernmost island of Lakshadweep",
    "difficulty": "Medium",
    "stem": "Which clue identifies Minicoy?",
    "answer": "Southernmost Lakshadweep island near the Maldives",
    "distractors": [
      "Capital of Andaman and Nicobar Islands",
      "Island containing Indira Point",
      "Easternmost island of India near Myanmar"
    ],
    "explanation": "Minicoy lies at the southern end of Lakshadweep and is close to the Maldives. It does not contain Indira Point and is not the Andaman and Nicobar capital.",
    "sourceFactIds": [
      "MINICOY-CLUE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-059",
    "qlName": "Minicoy — southernmost island of Lakshadweep",
    "difficulty": "Medium",
    "stem": "Which island lies south of Kavaratti within Lakshadweep and closest to the Maldives?",
    "answer": "Minicoy",
    "distractors": [
      "Agatti",
      "Amini",
      "Kadmat"
    ],
    "explanation": "Minicoy lies far south of the main Lakshadweep cluster and is the territory's southernmost island. Its position also places it nearest the Maldives among these options.",
    "sourceFactIds": [
      "MINICOY-SOUTH-OF-KAVARATTI"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-059",
    "qlName": "Minicoy — southernmost island of Lakshadweep",
    "difficulty": "Medium",
    "stem": "A map marks Lakshadweep's southernmost large island below the main group. Which label belongs there?",
    "answer": "Minicoy",
    "distractors": [
      "Kavaratti",
      "Agatti",
      "Andrott"
    ],
    "explanation": "The isolated southern island below the main Lakshadweep group is Minicoy. Kavaratti, Agatti and Andrott all lie farther north.",
    "sourceFactIds": [
      "MINICOY-MAP-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-059",
    "qlName": "Minicoy — southernmost island of Lakshadweep",
    "difficulty": "Hard",
    "stem": "Island X is south of the Nine Degree Channel and north of the Maldives. Which Indian island is X?",
    "answer": "Minicoy",
    "distractors": [
      "Kavaratti",
      "Great Nicobar",
      "Little Andaman"
    ],
    "explanation": "Minicoy lies south of the Nine Degree Channel and immediately north of the Maldives region. These two location clues uniquely identify the island.",
    "sourceFactIds": [
      "MINICOY-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-060",
    "qlName": "Great Nicobar — Indira Point and southern location",
    "difficulty": "Easy",
    "stem": "Indira Point is located on which island?",
    "answer": "Great Nicobar Island",
    "distractors": [
      "Little Andaman",
      "Minicoy",
      "Kavaratti"
    ],
    "explanation": "Indira Point lies on Great Nicobar Island. It marks the southernmost point of India when the island territory is included.",
    "sourceFactIds": [
      "GREAT-NICOBAR-INDIRA-POINT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-060",
    "qlName": "Great Nicobar — Indira Point and southern location",
    "difficulty": "Easy",
    "stem": "Great Nicobar belongs to which island group?",
    "answer": "Nicobar Islands",
    "distractors": [
      "Lakshadweep",
      "Andaman Islands",
      "Maldives"
    ],
    "explanation": "Great Nicobar is part of the Nicobar group at the southern end of the Andaman and Nicobar Union Territory. It lies well south of the Andaman group.",
    "sourceFactIds": [
      "GREAT-NICOBAR-NICOBAR-GROUP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-060",
    "qlName": "Great Nicobar — Indira Point and southern location",
    "difficulty": "Medium",
    "stem": "Which island links India's southernmost point with the Nicobar group?",
    "answer": "Great Nicobar",
    "distractors": [
      "Little Andaman",
      "Minicoy",
      "Agatti"
    ],
    "explanation": "Great Nicobar contains Indira Point, India's southernmost point. The island therefore links the extreme-point fact directly with the Nicobar group.",
    "sourceFactIds": [
      "GREAT-NICOBAR-SOUTHERNMOST-LINK"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-060",
    "qlName": "Great Nicobar — Indira Point and southern location",
    "difficulty": "Medium",
    "stem": "Which statement about Great Nicobar is accurate?",
    "answer": "It contains Indira Point at India's southern extremity",
    "distractors": [
      "It is the capital island of Lakshadweep",
      "It lies north of the Andaman group",
      "It contains Kavaratti"
    ],
    "explanation": "Great Nicobar contains Indira Point at India's southern extremity. Kavaratti belongs to Lakshadweep, while Great Nicobar lies in the southern Nicobar group.",
    "sourceFactIds": [
      "GREAT-NICOBAR-STATEMENT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-060",
    "qlName": "Great Nicobar — Indira Point and southern location",
    "difficulty": "Medium",
    "stem": "A map shows India's southernmost point on an island in the Nicobar group. Which island should be labelled?",
    "answer": "Great Nicobar",
    "distractors": [
      "Car Nicobar",
      "Little Andaman",
      "Minicoy"
    ],
    "explanation": "India's southernmost point, Indira Point, lies on Great Nicobar. Car Nicobar is farther north, while Little Andaman and Minicoy belong to different island locations.",
    "sourceFactIds": [
      "GREAT-NICOBAR-MAP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-060",
    "qlName": "Great Nicobar — Indira Point and southern location",
    "difficulty": "Hard",
    "stem": "Island X lies at the southern end of the Nicobar group and carries Indira Point. What is X?",
    "answer": "Great Nicobar",
    "distractors": [
      "Car Nicobar",
      "Little Andaman",
      "Minicoy"
    ],
    "explanation": "The southern Nicobar island containing Indira Point is Great Nicobar. The combination of group position and extreme-point identity distinguishes it from the other islands.",
    "sourceFactIds": [
      "GREAT-NICOBAR-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-061",
    "qlName": "Andaman group north / Nicobar group south",
    "difficulty": "Easy",
    "stem": "Which island group lies north of the Nicobar Islands?",
    "answer": "Andaman Islands",
    "distractors": [
      "Lakshadweep",
      "Maldives",
      "Sri Lanka"
    ],
    "explanation": "The Andaman group occupies the northern part of the Union Territory. The Nicobar group lies farther south, creating a clear north–south division within the territory.",
    "sourceFactIds": [
      "ANDAMAN-NORTH-NICOBAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-061",
    "qlName": "Andaman group north / Nicobar group south",
    "difficulty": "Easy",
    "stem": "Which group forms the southern part of the Andaman and Nicobar Union Territory?",
    "answer": "Nicobar Islands",
    "distractors": [
      "Andaman Islands",
      "Lakshadweep",
      "Sundarbans"
    ],
    "explanation": "The Nicobar Islands form the southern portion of the Union Territory. The Andaman Islands lie to their north, so a north-up map places Nicobar below Andaman.",
    "sourceFactIds": [
      "NICOBAR-SOUTHERN-GROUP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-061",
    "qlName": "Andaman group north / Nicobar group south",
    "difficulty": "Medium",
    "stem": "Travelling south through the Andaman and Nicobar Union Territory, which group is reached after the Andamans?",
    "answer": "Nicobar Islands",
    "distractors": [
      "Lakshadweep",
      "Maldives",
      "Sri Lanka"
    ],
    "explanation": "The Andamans occupy the northern portion and the Nicobars the southern portion. A southward route through the territory therefore reaches the Nicobars next.",
    "sourceFactIds": [
      "AN-TO-NICOBAR-SOUTHWARD"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-061",
    "qlName": "Andaman group north / Nicobar group south",
    "difficulty": "Medium",
    "stem": "Which north–south arrangement is correct?",
    "answer": "Andaman Islands → Nicobar Islands",
    "distractors": [
      "Nicobar Islands → Andaman Islands",
      "Lakshadweep → Andaman Islands",
      "Maldives → Lakshadweep → Andaman Islands"
    ],
    "explanation": "Within the Union Territory, the Andaman group lies north of the Nicobar group. The correct north-to-south order is therefore Andaman followed by Nicobar.",
    "sourceFactIds": [
      "AN-NICOBAR-NORTH-SOUTH-ORDER"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-061",
    "qlName": "Andaman group north / Nicobar group south",
    "difficulty": "Medium",
    "stem": "Which group should appear below the Andamans on a north-up map?",
    "answer": "Nicobar Islands",
    "distractors": [
      "Lakshadweep",
      "Gujarat",
      "Maldives"
    ],
    "explanation": "The Nicobar group lies south of the Andaman group. On a north-up map it should therefore appear below the Andamans.",
    "sourceFactIds": [
      "NICOBAR-BELOW-ANDAMAN-MAP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-061",
    "qlName": "Andaman group north / Nicobar group south",
    "difficulty": "Hard",
    "stem": "Group A contains Sri Vijaya Puram and lies north of Group B, which contains Great Nicobar. What are A and B?",
    "answer": "Andaman and Nicobar respectively",
    "distractors": [
      "Lakshadweep and Andaman respectively",
      "Nicobar and Andaman respectively",
      "Lakshadweep and Nicobar respectively"
    ],
    "explanation": "Sri Vijaya Puram lies in the Andaman part of the territory, while Great Nicobar belongs to the southern Nicobar group. A is therefore Andaman and B is Nicobar.",
    "sourceFactIds": [
      "AN-NICOBAR-GROUP-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-062",
    "qlName": "Lakshadweep — coral-atoll archipelago",
    "difficulty": "Easy",
    "stem": "Lakshadweep is especially known for which type of island formation?",
    "answer": "Coral atolls",
    "distractors": [
      "Glacial islands",
      "River-delta islands",
      "Continental mountain peaks"
    ],
    "explanation": "Lakshadweep is a coral archipelago made up largely of atolls, reefs and small islands. Its physical identity differs from the larger Andaman and Nicobar chain.",
    "sourceFactIds": [
      "LAK-CORAL-ATOLLS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-062",
    "qlName": "Lakshadweep — coral-atoll archipelago",
    "difficulty": "Easy",
    "stem": "Which Indian island Union Territory consists of coral atolls in the Arabian Sea?",
    "answer": "Lakshadweep",
    "distractors": [
      "Andaman and Nicobar Islands",
      "Puducherry",
      "Ladakh"
    ],
    "explanation": "Lakshadweep is India's coral-atoll island Union Territory in the Arabian Sea. Andaman and Nicobar has a different geological and geographic setting.",
    "sourceFactIds": [
      "LAK-CORAL-UT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-062",
    "qlName": "Lakshadweep — coral-atoll archipelago",
    "difficulty": "Medium",
    "stem": "Which clue points to Lakshadweep rather than the Andaman and Nicobar Islands?",
    "answer": "A chain of coral atolls west of Kerala",
    "distractors": [
      "A long island chain southeast of the mainland",
      "Great Nicobar containing Indira Point",
      "Barren Island in the Andaman Sea"
    ],
    "explanation": "Lakshadweep is a coral-atoll archipelago west of Kerala in the Arabian Sea. The other clues belong to the Andaman and Nicobar region.",
    "sourceFactIds": [
      "LAK-CORAL-LOCATION-CLUE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-062",
    "qlName": "Lakshadweep — coral-atoll archipelago",
    "difficulty": "Medium",
    "stem": "Which statement about Lakshadweep is correct?",
    "answer": "It includes atolls and reefs in the Arabian Sea",
    "distractors": [
      "It lies in the Bay of Bengal east of Myanmar",
      "It contains Great Nicobar",
      "It is joined to Kerala by land"
    ],
    "explanation": "Lakshadweep consists of small coral islands, atolls and reefs in the Arabian Sea. It is separated from the mainland by sea and does not contain Great Nicobar.",
    "sourceFactIds": [
      "LAK-ATOLL-STATEMENT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-062",
    "qlName": "Lakshadweep — coral-atoll archipelago",
    "difficulty": "Medium",
    "stem": "Which island group would be the natural answer to an exam question linking India, coral atolls and the Arabian Sea?",
    "answer": "Lakshadweep",
    "distractors": [
      "Nicobar Islands",
      "Andaman Islands",
      "Sundarbans"
    ],
    "explanation": "The combination of coral atolls and Arabian Sea location points directly to Lakshadweep. The Andaman and Nicobar groups lie on India's eastern side.",
    "sourceFactIds": [
      "LAK-CORAL-EXAM-CLUE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-062",
    "qlName": "Lakshadweep — coral-atoll archipelago",
    "difficulty": "Hard",
    "stem": "Island Territory X lies west of Kerala, includes Minicoy and is formed largely by coral atolls. What is X?",
    "answer": "Lakshadweep",
    "distractors": [
      "Andaman and Nicobar Islands",
      "Sri Lanka",
      "Maldives"
    ],
    "explanation": "West of Kerala, Minicoy and coral-atoll formation are three defining clues for Lakshadweep. No other Indian island territory matches all three.",
    "sourceFactIds": [
      "LAK-CORAL-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-063",
    "qlName": "Barren Island — Andaman Sea / active-volcano location",
    "difficulty": "Easy",
    "stem": "India's only active volcano is located on which island?",
    "answer": "Barren Island",
    "distractors": [
      "Minicoy",
      "Great Nicobar",
      "Kavaratti"
    ],
    "explanation": "Barren Island in the Andaman Sea contains India's only active volcano. It belongs to the Andaman and Nicobar island region.",
    "sourceFactIds": [
      "BARREN-INDIA-ACTIVE-VOLCANO"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-063",
    "qlName": "Barren Island — Andaman Sea / active-volcano location",
    "difficulty": "Easy",
    "stem": "Barren Island belongs to which Indian island region?",
    "answer": "Andaman and Nicobar Islands",
    "distractors": [
      "Lakshadweep",
      "Gulf of Mannar islands",
      "Diu"
    ],
    "explanation": "Barren Island lies in the Andaman Sea and forms part of the Andaman and Nicobar territory. It is not part of Lakshadweep or India's western coast.",
    "sourceFactIds": [
      "BARREN-AN-REGION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-063",
    "qlName": "Barren Island — Andaman Sea / active-volcano location",
    "difficulty": "Medium",
    "stem": "Which clue identifies Barren Island?",
    "answer": "An active volcanic island in the Andaman Sea",
    "distractors": [
      "Lakshadweep's capital island",
      "Island containing Indira Point",
      "Southernmost island of Lakshadweep"
    ],
    "explanation": "Barren Island is the active volcanic island in the Andaman Sea. Kavaratti, Great Nicobar and Minicoy match the other clues in the distractors.",
    "sourceFactIds": [
      "BARREN-CLUE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-063",
    "qlName": "Barren Island — Andaman Sea / active-volcano location",
    "difficulty": "Medium",
    "stem": "Which island should be placed northeast of Sri Vijaya Puram in the Andaman Sea?",
    "answer": "Barren Island",
    "distractors": [
      "Minicoy",
      "Kavaratti",
      "Great Nicobar"
    ],
    "explanation": "Barren Island lies in the Andaman Sea northeast of Sri Vijaya Puram. Minicoy and Kavaratti lie in Lakshadweep, while Great Nicobar is far to the south.",
    "sourceFactIds": [
      "BARREN-NE-SRI-VIJAYA-PURAM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-063",
    "qlName": "Barren Island — Andaman Sea / active-volcano location",
    "difficulty": "Medium",
    "stem": "Which pairing is accurate?",
    "answer": "Barren Island — active volcano — Andaman Sea",
    "distractors": [
      "Minicoy — active volcano — Bay of Bengal",
      "Kavaratti — active volcano — Arabian Sea",
      "Great Nicobar — active volcano — Gulf of Mannar"
    ],
    "explanation": "Barren Island is India's active-volcano island and lies in the Andaman Sea. The other islands are important for different location facts but not this volcanic identity.",
    "sourceFactIds": [
      "BARREN-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-063",
    "qlName": "Barren Island — Andaman Sea / active-volcano location",
    "difficulty": "Medium",
    "stem": "Which island fact belongs to India's eastern island territory?",
    "answer": "Barren Island contains the country's active volcano",
    "distractors": [
      "Minicoy is its capital",
      "Kavaratti contains Indira Point",
      "Lakshadweep lies in the Bay of Bengal"
    ],
    "explanation": "Barren Island is part of Andaman and Nicobar Islands and contains India's active volcano. The other options mix facts from Lakshadweep or Great Nicobar.",
    "sourceFactIds": [
      "BARREN-EASTERN-TERRITORY-FACT"
    ]
  }
]);

export const GEO_LOC_001_CP007_REVIEW_BATCH_V1: readonly GeoLoc001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-LOC-001-CP007-Q${String(index + 1).padStart(3, "0")}`,
      qlId: raw.qlId,
      qlName: raw.qlName,
      difficulty: raw.difficulty,
      stem: raw.stem,
      options: placeGeoLocOptions(raw.answer, raw.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: raw.answer,
      explanation: raw.explanation,
      sourceIds: CP007_SOURCE_IDS,
      sourceFactIds: Object.freeze([...raw.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED = /associated with|best describes|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|given in NCERT|\bNCERT\b|\btextbook\b|stated mainland|which pair correctly|which statement correctly|which option gives|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR = /currency|literacy rate|stock market|crop price|movie|sports team|bank rate|tax slab/i;

export function auditGeoLoc001Cp007ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_LOC_001_CP007_REVIEW_BATCH_V1) {
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
    const distractors = q.options.filter((_, i) => i !== q.correctIndex);
    if (distractors.some((option) => TRIVIAL_DISTRACTOR.test(option))) issues.push("TRIVIAL_DISTRACTOR:" + q.questionId);
    const learnerText = q.stem + "\n" + q.options.join("\n") + "\n" + q.explanation;
    if (BANNED.test(learnerText)) issues.push("STYLE:" + q.questionId);
    if (q.stem.length < 20 || q.stem.length > 300 || !q.stem.trim().endsWith("?")) issues.push("STEM_SHAPE:" + q.questionId);
    if (q.explanation.length < 115) issues.push("SHORT_EXPLANATION:" + q.questionId);
    if ((q.explanation.match(/[.!?](?:\s|$)/g) ?? []).length < 2) issues.push("EXPLANATION_DEPTH:" + q.questionId);
  }

  if (GEO_LOC_001_CP007_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_LOC_001_CP007_REVIEW_BATCH_V1.length);
  for (let n = 55; n <= 63; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_LOC_001_CP007_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
