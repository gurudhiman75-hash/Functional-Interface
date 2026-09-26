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

const CP006_SOURCE_IDS = Object.freeze([
  ...GEO_LOC_001_SOURCE_IDS,
  "GOI-INDIA-FACT-SHEET-MARITIME-NEIGHBOURS",
  "LAKSHADWEEP-MINICOY-OFFICIAL",
  "ANDAMAN-UT-PROFILE",
  "INCREDIBLE-INDIA-LITTLE-ANDAMAN",
  "INDIAN-COAST-GUARD-GREAT-CHANNEL",
] as const);

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-LOC-001-QL-046",
    "qlName": "Sri Lanka as India’s southern maritime neighbour",
    "difficulty": "Easy",
    "stem": "Which island country is India's southern maritime neighbour across the Palk Strait?",
    "answer": "Sri Lanka",
    "distractors": [
      "Maldives",
      "Myanmar",
      "Indonesia"
    ],
    "explanation": "Sri Lanka lies immediately south-east of the Indian peninsula and is separated from India by a narrow stretch of sea. Palk Strait forms part of that maritime separation.",
    "sourceFactIds": [
      "SRI-LANKA-MARITIME-NEIGHBOUR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-046",
    "qlName": "Sri Lanka as India’s southern maritime neighbour",
    "difficulty": "Easy",
    "stem": "Sri Lanka is a neighbour of India across which type of boundary?",
    "answer": "Maritime boundary",
    "distractors": [
      "Land frontier",
      "Mountain watershed",
      "River boundary"
    ],
    "explanation": "India and Sri Lanka do not share a land frontier. Their neighbouring position is maritime, with sea passages such as Palk Strait lying between them.",
    "sourceFactIds": [
      "SRI-LANKA-MARITIME-NOT-LAND"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-046",
    "qlName": "Sri Lanka as India’s southern maritime neighbour",
    "difficulty": "Medium",
    "stem": "How is Sri Lanka positioned in relation to India?",
    "answer": "It lies south of the peninsula across a narrow sea passage",
    "distractors": [
      "It lies northwest of India across a land border",
      "It lies north of Nepal",
      "It lies east of Myanmar across land"
    ],
    "explanation": "Sri Lanka lies just south of peninsular India across narrow sea waters. It is therefore treated as a maritime neighbour rather than a land neighbour.",
    "sourceFactIds": [
      "SRI-LANKA-RELATIVE-LOCATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-046",
    "qlName": "Sri Lanka as India’s southern maritime neighbour",
    "difficulty": "Medium",
    "stem": "A list groups Sri Lanka with Nepal and Bhutan as land neighbours. What correction is needed?",
    "answer": "Sri Lanka should be moved to the maritime-neighbour group",
    "distractors": [
      "Nepal should be moved to the maritime group",
      "Bhutan should be placed south of India",
      "All three should remain land neighbours"
    ],
    "explanation": "Nepal and Bhutan share land frontiers with India, but Sri Lanka is separated from India by sea. It belongs with India's maritime neighbours instead.",
    "sourceFactIds": [
      "SRI-LANKA-LAND-LIST-CORRECTION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-046",
    "qlName": "Sri Lanka as India’s southern maritime neighbour",
    "difficulty": "Medium",
    "stem": "Which pair contains one land neighbour and one maritime neighbour of India?",
    "answer": "Nepal and Sri Lanka",
    "distractors": [
      "Nepal and Bhutan",
      "Bangladesh and Myanmar",
      "Sri Lanka and Maldives"
    ],
    "explanation": "Nepal shares a land frontier with India, while Sri Lanka is separated from India by sea. The other pairs are either both land neighbours or both maritime neighbours.",
    "sourceFactIds": [
      "SRI-LANKA-LAND-SEA-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-046",
    "qlName": "Sri Lanka as India’s southern maritime neighbour",
    "difficulty": "Medium",
    "stem": "Why is Sri Lanka not counted among India's land neighbours?",
    "answer": "Sea separates the two countries",
    "distractors": [
      "Sri Lanka lies north of the Himalayas",
      "Sri Lanka is part of Lakshadweep",
      "India has no southern coastline"
    ],
    "explanation": "India and Sri Lanka are close geographically, but water lies between them. The Palk Strait and Gulf of Mannar region prevent a continuous land frontier.",
    "sourceFactIds": [
      "SRI-LANKA-NOT-LAND-NEIGHBOUR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-047",
    "qlName": "Maldives as India’s southwestern maritime neighbour",
    "difficulty": "Easy",
    "stem": "Which island country lies southwest of India in the Indian Ocean?",
    "answer": "Maldives",
    "distractors": [
      "Bhutan",
      "Bangladesh",
      "Nepal"
    ],
    "explanation": "Maldives lies southwest of India in the Indian Ocean. It is a maritime neighbour and is especially close to the southern part of Lakshadweep.",
    "sourceFactIds": [
      "MALDIVES-SOUTHWEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-047",
    "qlName": "Maldives as India’s southwestern maritime neighbour",
    "difficulty": "Easy",
    "stem": "Maldives is connected to India as which kind of neighbour?",
    "answer": "Maritime neighbour",
    "distractors": [
      "Land neighbour",
      "River-border neighbour",
      "Mountain-border neighbour"
    ],
    "explanation": "Maldives is an island country and has no land frontier with India. Its geographic relationship with India is across the Indian Ocean.",
    "sourceFactIds": [
      "MALDIVES-MARITIME"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-047",
    "qlName": "Maldives as India’s southwestern maritime neighbour",
    "difficulty": "Medium",
    "stem": "Which Indian island is closest to the Maldives side of Lakshadweep?",
    "answer": "Minicoy",
    "distractors": [
      "Kavaratti",
      "Agatti",
      "Great Nicobar"
    ],
    "explanation": "Minicoy is the southernmost island of Lakshadweep and lies close to the northern Maldives. This makes it the Indian island most closely linked with Maldives in location questions.",
    "sourceFactIds": [
      "MINICOY-MALDIVES-PROXIMITY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-047",
    "qlName": "Maldives as India’s southwestern maritime neighbour",
    "difficulty": "Medium",
    "stem": "Which statement about Maldives and India is accurate?",
    "answer": "Maldives lies southwest of India and does not share a land border",
    "distractors": [
      "Maldives lies north of India and shares a land border",
      "Maldives lies east of Bangladesh",
      "Maldives is part of the Andaman group"
    ],
    "explanation": "Maldives lies in the Indian Ocean to the southwest of India. Because it is an island country separated by sea, there is no land frontier with India.",
    "sourceFactIds": [
      "MALDIVES-RELATION-INDIA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-047",
    "qlName": "Maldives as India’s southwestern maritime neighbour",
    "difficulty": "Medium",
    "stem": "Sri Lanka and Maldives belong together in which neighbour category for India?",
    "answer": "Maritime neighbours",
    "distractors": [
      "Northwestern land neighbours",
      "Northern land neighbours",
      "Eastern land neighbours"
    ],
    "explanation": "Both Sri Lanka and Maldives are separated from India by sea. They are therefore grouped as maritime neighbours rather than land-border countries.",
    "sourceFactIds": [
      "SRI-LANKA-MALDIVES-MARITIME-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-047",
    "qlName": "Maldives as India’s southwestern maritime neighbour",
    "difficulty": "Medium",
    "stem": "A map places Maldives northeast of India. What is the correct relative position?",
    "answer": "Southwest of India",
    "distractors": [
      "Northwest of India",
      "Directly north of Nepal",
      "East of Myanmar"
    ],
    "explanation": "Maldives lies southwest of India in the Indian Ocean. The map should place it below and to the west of the Indian peninsula rather than to the northeast.",
    "sourceFactIds": [
      "MALDIVES-MAP-CORRECTION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-048",
    "qlName": "Palk Strait — India/Sri Lanka separation",
    "difficulty": "Easy",
    "stem": "Which strait separates India from Sri Lanka?",
    "answer": "Palk Strait",
    "distractors": [
      "Duncan Passage",
      "Ten Degree Channel",
      "Nine Degree Channel"
    ],
    "explanation": "Palk Strait lies between southeastern India and Sri Lanka. It is one of the principal sea passages separating the two countries.",
    "sourceFactIds": [
      "PALK-STRAIT-INDIA-SRI-LANKA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-048",
    "qlName": "Palk Strait — India/Sri Lanka separation",
    "difficulty": "Easy",
    "stem": "Palk Strait lies between India and which country?",
    "answer": "Sri Lanka",
    "distractors": [
      "Maldives",
      "Myanmar",
      "Indonesia"
    ],
    "explanation": "Palk Strait forms a narrow sea passage between India and Sri Lanka. It is not related to India's island channels farther east or west.",
    "sourceFactIds": [
      "PALK-STRAIT-SRI-LANKA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-048",
    "qlName": "Palk Strait — India/Sri Lanka separation",
    "difficulty": "Medium",
    "stem": "Which Indian state faces Sri Lanka across the Palk Strait?",
    "answer": "Tamil Nadu",
    "distractors": [
      "Gujarat",
      "Odisha",
      "Goa"
    ],
    "explanation": "Palk Strait lies off the southeastern coast of Tamil Nadu and separates that part of India from Sri Lanka. Gujarat and Goa face the Arabian Sea, while Odisha faces the Bay of Bengal.",
    "sourceFactIds": [
      "PALK-STRAIT-TAMIL-NADU"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-048",
    "qlName": "Palk Strait — India/Sri Lanka separation",
    "difficulty": "Medium",
    "stem": "A question mentions a narrow sea passage between Tamil Nadu and Sri Lanka. Which feature is being tested?",
    "answer": "Palk Strait",
    "distractors": [
      "Nine Degree Channel",
      "Great Channel",
      "Duncan Passage"
    ],
    "explanation": "The narrow passage between Tamil Nadu and Sri Lanka is Palk Strait. The other named channels belong to India's island geography rather than the India–Sri Lanka gap.",
    "sourceFactIds": [
      "PALK-STRAIT-CLUE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-048",
    "qlName": "Palk Strait — India/Sri Lanka separation",
    "difficulty": "Medium",
    "stem": "Which feature should be placed north of the Gulf of Mannar between India and Sri Lanka?",
    "answer": "Palk Strait",
    "distractors": [
      "Great Channel",
      "Ten Degree Channel",
      "Eight Degree Channel"
    ],
    "explanation": "Palk Strait lies to the north of the Gulf of Mannar in the sea gap between India and Sri Lanka. Together they form the familiar maritime setting south of Tamil Nadu.",
    "sourceFactIds": [
      "PALK-NORTH-OF-MANNAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-048",
    "qlName": "Palk Strait — India/Sri Lanka separation",
    "difficulty": "Hard",
    "stem": "A map labels Passage X between Tamil Nadu and northern Sri Lanka. Passage X is north of the Gulf of Mannar. What is X?",
    "answer": "Palk Strait",
    "distractors": [
      "Duncan Passage",
      "Nine Degree Channel",
      "Great Channel"
    ],
    "explanation": "The two clues identify Palk Strait: it lies between Tamil Nadu and Sri Lanka and is north of the Gulf of Mannar. India's numbered island channels occur elsewhere.",
    "sourceFactIds": [
      "PALK-STRAIT-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-049",
    "qlName": "Gulf of Mannar — India/Sri Lanka maritime setting",
    "difficulty": "Easy",
    "stem": "Which gulf lies between southeastern India and Sri Lanka?",
    "answer": "Gulf of Mannar",
    "distractors": [
      "Gulf of Kachchh",
      "Gulf of Khambhat",
      "Persian Gulf"
    ],
    "explanation": "The Gulf of Mannar lies between southeastern Tamil Nadu and Sri Lanka. It forms the southern part of the narrow maritime setting separating the two countries.",
    "sourceFactIds": [
      "GULF-MANNAR-INDIA-SRI-LANKA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-049",
    "qlName": "Gulf of Mannar — India/Sri Lanka maritime setting",
    "difficulty": "Easy",
    "stem": "The Gulf of Mannar is linked with India's maritime separation from which country?",
    "answer": "Sri Lanka",
    "distractors": [
      "Pakistan",
      "Bangladesh",
      "Bhutan"
    ],
    "explanation": "The Gulf of Mannar lies between India and Sri Lanka. It is paired with Palk Strait in standard descriptions of the sea gap between the two countries.",
    "sourceFactIds": [
      "GULF-MANNAR-SRI-LANKA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-049",
    "qlName": "Gulf of Mannar — India/Sri Lanka maritime setting",
    "difficulty": "Medium",
    "stem": "Which water body lies south of Palk Strait between India and Sri Lanka?",
    "answer": "Gulf of Mannar",
    "distractors": [
      "Arabian Sea",
      "Nine Degree Channel",
      "Duncan Passage"
    ],
    "explanation": "The Gulf of Mannar is situated south of Palk Strait. Both features lie in the maritime zone separating Tamil Nadu from Sri Lanka.",
    "sourceFactIds": [
      "MANNAR-SOUTH-OF-PALK"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-049",
    "qlName": "Gulf of Mannar — India/Sri Lanka maritime setting",
    "difficulty": "Medium",
    "stem": "Which pair together forms the familiar sea separation between India and Sri Lanka?",
    "answer": "Palk Strait and Gulf of Mannar",
    "distractors": [
      "Eight Degree Channel and Nine Degree Channel",
      "Ten Degree Channel and Duncan Passage",
      "Great Channel and Arabian Sea"
    ],
    "explanation": "Palk Strait and the Gulf of Mannar lie between southern India and Sri Lanka. The numbered channels in the other options belong to Indian island groups.",
    "sourceFactIds": [
      "PALK-MANNAR-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-049",
    "qlName": "Gulf of Mannar — India/Sri Lanka maritime setting",
    "difficulty": "Medium",
    "stem": "A map places the Gulf of Mannar off Gujarat. What is the correct location?",
    "answer": "Between Tamil Nadu and Sri Lanka",
    "distractors": [
      "Between Gujarat and Pakistan",
      "Between Odisha and Bangladesh",
      "Between Goa and Maldives"
    ],
    "explanation": "The Gulf of Mannar lies off southeastern Tamil Nadu beside Sri Lanka. Gujarat instead has the Gulfs of Kachchh and Khambhat on India's western coast.",
    "sourceFactIds": [
      "MANNAR-MAP-CORRECTION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-049",
    "qlName": "Gulf of Mannar — India/Sri Lanka maritime setting",
    "difficulty": "Hard",
    "stem": "Water body A lies between Tamil Nadu and Sri Lanka, south of Palk Strait. Which feature is A?",
    "answer": "Gulf of Mannar",
    "distractors": [
      "Gulf of Kachchh",
      "Great Channel",
      "Nine Degree Channel"
    ],
    "explanation": "The location south of Palk Strait between Tamil Nadu and Sri Lanka identifies the Gulf of Mannar. India's island channels lie much farther east or west.",
    "sourceFactIds": [
      "MANNAR-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-050",
    "qlName": "Eight Degree Channel — Minicoy/Maldives",
    "difficulty": "Easy",
    "stem": "Which channel separates Minicoy from the Maldives?",
    "answer": "Eight Degree Channel",
    "distractors": [
      "Nine Degree Channel",
      "Ten Degree Channel",
      "Duncan Passage"
    ],
    "explanation": "The Eight Degree Channel lies between Minicoy, India's southernmost Lakshadweep island, and the Maldives. It marks a maritime gap south of Minicoy.",
    "sourceFactIds": [
      "EIGHT-DEGREE-MINICOY-MALDIVES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-050",
    "qlName": "Eight Degree Channel — Minicoy/Maldives",
    "difficulty": "Easy",
    "stem": "The Eight Degree Channel lies close to which Indian island?",
    "answer": "Minicoy",
    "distractors": [
      "Great Nicobar",
      "Little Andaman",
      "Kavaratti"
    ],
    "explanation": "Minicoy lies near the Eight Degree Channel at the southern end of Lakshadweep. The channel separates the Indian island from the Maldives side.",
    "sourceFactIds": [
      "EIGHT-DEGREE-MINICOY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-050",
    "qlName": "Eight Degree Channel — Minicoy/Maldives",
    "difficulty": "Medium",
    "stem": "A vessel moves south from Minicoy toward the Maldives. Which named channel does it cross?",
    "answer": "Eight Degree Channel",
    "distractors": [
      "Ten Degree Channel",
      "Duncan Passage",
      "Great Channel"
    ],
    "explanation": "The Eight Degree Channel lies between Minicoy and the Maldives. The other channels belong to the Andaman and Nicobar region.",
    "sourceFactIds": [
      "EIGHT-DEGREE-SOUTH-FROM-MINICOY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-050",
    "qlName": "Eight Degree Channel — Minicoy/Maldives",
    "difficulty": "Medium",
    "stem": "Which channel is linked with an India–Maldives island separation rather than an internal Indian island-group separation?",
    "answer": "Eight Degree Channel",
    "distractors": [
      "Nine Degree Channel",
      "Ten Degree Channel",
      "Duncan Passage"
    ],
    "explanation": "The Eight Degree Channel lies between Minicoy and the Maldives, so it separates Indian territory from a neighbouring island country. The other channels separate Indian islands or island groups.",
    "sourceFactIds": [
      "EIGHT-DEGREE-INTERNATIONAL-SETTING"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-050",
    "qlName": "Eight Degree Channel — Minicoy/Maldives",
    "difficulty": "Medium",
    "stem": "Which channel-location match is accurate?",
    "answer": "Eight Degree Channel — Minicoy and Maldives",
    "distractors": [
      "Eight Degree Channel — Andaman and Nicobar groups",
      "Eight Degree Channel — Rutland and Little Andaman",
      "Eight Degree Channel — Minicoy and Kavaratti"
    ],
    "explanation": "The Eight Degree Channel lies between Minicoy and the Maldives. Andaman–Nicobar and Rutland–Little Andaman separations use different named channels.",
    "sourceFactIds": [
      "EIGHT-DEGREE-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-050",
    "qlName": "Eight Degree Channel — Minicoy/Maldives",
    "difficulty": "Hard",
    "stem": "Channel X lies south of Minicoy and north of the Maldives island chain. What is X?",
    "answer": "Eight Degree Channel",
    "distractors": [
      "Nine Degree Channel",
      "Ten Degree Channel",
      "Duncan Passage"
    ],
    "explanation": "A channel immediately south of Minicoy toward the Maldives is the Eight Degree Channel. The Nine Degree Channel lies north of Minicoy within Lakshadweep.",
    "sourceFactIds": [
      "EIGHT-DEGREE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-051",
    "qlName": "Nine Degree Channel — Minicoy/rest of Lakshadweep",
    "difficulty": "Easy",
    "stem": "Which channel separates Minicoy from the rest of Lakshadweep?",
    "answer": "Nine Degree Channel",
    "distractors": [
      "Eight Degree Channel",
      "Ten Degree Channel",
      "Great Channel"
    ],
    "explanation": "The Nine Degree Channel separates Minicoy from the northern Lakshadweep islands. Minicoy lies distinctly south of the main island group.",
    "sourceFactIds": [
      "NINE-DEGREE-MINICOY-LAKSHADWEEP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-051",
    "qlName": "Nine Degree Channel — Minicoy/rest of Lakshadweep",
    "difficulty": "Easy",
    "stem": "Minicoy lies south of the main Lakshadweep group across which channel?",
    "answer": "Nine Degree Channel",
    "distractors": [
      "Duncan Passage",
      "Ten Degree Channel",
      "Palk Strait"
    ],
    "explanation": "Minicoy is separated from the rest of Lakshadweep by the Nine Degree Channel. This channel is an internal island-group feature of India.",
    "sourceFactIds": [
      "MINICOY-SOUTH-NINE-DEGREE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-051",
    "qlName": "Nine Degree Channel — Minicoy/rest of Lakshadweep",
    "difficulty": "Medium",
    "stem": "Which channel is internal to the Lakshadweep island group?",
    "answer": "Nine Degree Channel",
    "distractors": [
      "Palk Strait",
      "Great Channel",
      "Ten Degree Channel"
    ],
    "explanation": "The Nine Degree Channel divides Minicoy from the northern Lakshadweep islands. Palk Strait and the Andaman–Nicobar channels belong to different regions.",
    "sourceFactIds": [
      "NINE-DEGREE-INTERNAL-LAKSHADWEEP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-051",
    "qlName": "Nine Degree Channel — Minicoy/rest of Lakshadweep",
    "difficulty": "Medium",
    "stem": "Which statement about Minicoy is correct?",
    "answer": "It is separated from the rest of Lakshadweep by the Nine Degree Channel",
    "distractors": [
      "It is separated from Sri Lanka by the Palk Strait",
      "It is north of the Andaman group",
      "It lies east of Great Nicobar"
    ],
    "explanation": "Minicoy is the southernmost Lakshadweep island and is cut off from the northern group by the Nine Degree Channel. The other options place it in unrelated maritime regions.",
    "sourceFactIds": [
      "MINICOY-NINE-DEGREE-STATEMENT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-051",
    "qlName": "Nine Degree Channel — Minicoy/rest of Lakshadweep",
    "difficulty": "Medium",
    "stem": "A map shows Minicoy below the main Lakshadweep chain. Which channel should be marked between them?",
    "answer": "Nine Degree Channel",
    "distractors": [
      "Eight Degree Channel",
      "Duncan Passage",
      "Great Channel"
    ],
    "explanation": "The gap between Minicoy and the rest of Lakshadweep is the Nine Degree Channel. The Eight Degree Channel lies farther south toward the Maldives.",
    "sourceFactIds": [
      "NINE-DEGREE-MAP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-051",
    "qlName": "Nine Degree Channel — Minicoy/rest of Lakshadweep",
    "difficulty": "Hard",
    "stem": "A ship sails north from Minicoy toward Kavaratti. Which named channel must it cross first?",
    "answer": "Nine Degree Channel",
    "distractors": [
      "Eight Degree Channel",
      "Ten Degree Channel",
      "Palk Strait"
    ],
    "explanation": "Kavaratti lies in the northern part of the Lakshadweep chain relative to Minicoy. The Nine Degree Channel separates Minicoy from that main group.",
    "sourceFactIds": [
      "NINE-DEGREE-NORTH-FROM-MINICOY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-052",
    "qlName": "Ten Degree Channel — Andaman/Nicobar separation",
    "difficulty": "Easy",
    "stem": "Which channel separates the Andaman Islands from the Nicobar Islands?",
    "answer": "Ten Degree Channel",
    "distractors": [
      "Nine Degree Channel",
      "Eight Degree Channel",
      "Palk Strait"
    ],
    "explanation": "The Ten Degree Channel separates the Andaman group to the north from the Nicobar group to the south. It is a major reference feature of the Union Territory.",
    "sourceFactIds": [
      "TEN-DEGREE-ANDAMAN-NICOBAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-052",
    "qlName": "Ten Degree Channel — Andaman/Nicobar separation",
    "difficulty": "Easy",
    "stem": "The Ten Degree Channel lies between which two Indian island groups?",
    "answer": "Andaman and Nicobar",
    "distractors": [
      "Lakshadweep and Maldives",
      "Minicoy and Kavaratti",
      "India and Sri Lanka"
    ],
    "explanation": "The Andaman and Nicobar groups are divided by the Ten Degree Channel. Lakshadweep and the India–Sri Lanka region have different named sea passages.",
    "sourceFactIds": [
      "TEN-DEGREE-GROUPS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-052",
    "qlName": "Ten Degree Channel — Andaman/Nicobar separation",
    "difficulty": "Medium",
    "stem": "Which island group lies north of the Ten Degree Channel?",
    "answer": "Andaman Islands",
    "distractors": [
      "Nicobar Islands",
      "Maldives",
      "Lakshadweep"
    ],
    "explanation": "The Andaman group lies north of the Ten Degree Channel, while the Nicobar group lies south. This north–south split is central to the territory's map layout.",
    "sourceFactIds": [
      "TEN-DEGREE-NORTH-ANDAMAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-052",
    "qlName": "Ten Degree Channel — Andaman/Nicobar separation",
    "difficulty": "Medium",
    "stem": "Which island group lies south of the Ten Degree Channel?",
    "answer": "Nicobar Islands",
    "distractors": [
      "Andaman Islands",
      "Lakshadweep",
      "Maldives"
    ],
    "explanation": "The Nicobar group lies south of the Ten Degree Channel. The Andaman group occupies the northern side of this maritime division.",
    "sourceFactIds": [
      "TEN-DEGREE-SOUTH-NICOBAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-052",
    "qlName": "Ten Degree Channel — Andaman/Nicobar separation",
    "difficulty": "Medium",
    "stem": "Which pairing is correct?",
    "answer": "Ten Degree Channel — Andaman and Nicobar",
    "distractors": [
      "Ten Degree Channel — Minicoy and Maldives",
      "Ten Degree Channel — Minicoy and Kavaratti",
      "Ten Degree Channel — India and Sri Lanka"
    ],
    "explanation": "The Ten Degree Channel separates the Andaman and Nicobar groups. The other separations are linked with Eight Degree, Nine Degree or Palk Strait geography.",
    "sourceFactIds": [
      "TEN-DEGREE-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-052",
    "qlName": "Ten Degree Channel — Andaman/Nicobar separation",
    "difficulty": "Hard",
    "stem": "Channel X divides an Indian Union Territory into a northern Andaman group and a southern Nicobar group. What is X?",
    "answer": "Ten Degree Channel",
    "distractors": [
      "Nine Degree Channel",
      "Duncan Passage",
      "Eight Degree Channel"
    ],
    "explanation": "The description uniquely fits the Ten Degree Channel. It forms the major sea gap between the Andaman and Nicobar island groups.",
    "sourceFactIds": [
      "TEN-DEGREE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-053",
    "qlName": "Duncan Passage — Rutland/Little Andaman",
    "difficulty": "Easy",
    "stem": "Which passage separates Little Andaman from Rutland Island?",
    "answer": "Duncan Passage",
    "distractors": [
      "Palk Strait",
      "Nine Degree Channel",
      "Great Channel"
    ],
    "explanation": "Duncan Passage lies between Little Andaman and Rutland Island. Both locations belong to the Andaman part of the Union Territory.",
    "sourceFactIds": [
      "DUNCAN-RUTLAND-LITTLE-ANDAMAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-053",
    "qlName": "Duncan Passage — Rutland/Little Andaman",
    "difficulty": "Easy",
    "stem": "Duncan Passage is found in which Indian island region?",
    "answer": "Andaman Islands",
    "distractors": [
      "Lakshadweep",
      "Gulf of Mannar",
      "Maldives"
    ],
    "explanation": "Duncan Passage lies in the Andaman region between Rutland and Little Andaman. It is not part of Lakshadweep or the India–Sri Lanka sea gap.",
    "sourceFactIds": [
      "DUNCAN-ANDAMAN-REGION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-053",
    "qlName": "Duncan Passage — Rutland/Little Andaman",
    "difficulty": "Medium",
    "stem": "A map shows a passage between Rutland Island and Little Andaman. Which name should appear there?",
    "answer": "Duncan Passage",
    "distractors": [
      "Ten Degree Channel",
      "Eight Degree Channel",
      "Palk Strait"
    ],
    "explanation": "The named water passage between Rutland and Little Andaman is Duncan Passage. Ten Degree Channel lies farther south between the Andaman and Nicobar groups.",
    "sourceFactIds": [
      "DUNCAN-MAP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-053",
    "qlName": "Duncan Passage — Rutland/Little Andaman",
    "difficulty": "Medium",
    "stem": "Which statement about Duncan Passage is accurate?",
    "answer": "It separates Little Andaman from the Rutland side of Great Andaman",
    "distractors": [
      "It separates Minicoy from Maldives",
      "It separates Andaman from Nicobar",
      "It separates India from Sri Lanka"
    ],
    "explanation": "Duncan Passage lies between Little Andaman and Rutland Island on the southern side of Great Andaman. The other options describe different channels and straits.",
    "sourceFactIds": [
      "DUNCAN-STATEMENT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-053",
    "qlName": "Duncan Passage — Rutland/Little Andaman",
    "difficulty": "Medium",
    "stem": "Which channel is farther north within the Andaman region than the Ten Degree Channel?",
    "answer": "Duncan Passage",
    "distractors": [
      "Eight Degree Channel",
      "Nine Degree Channel",
      "Palk Strait"
    ],
    "explanation": "Duncan Passage lies within the Andaman group between Rutland and Little Andaman. Ten Degree Channel lies farther south at the Andaman–Nicobar division.",
    "sourceFactIds": [
      "DUNCAN-NORTH-OF-TEN-DEGREE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-053",
    "qlName": "Duncan Passage — Rutland/Little Andaman",
    "difficulty": "Hard",
    "stem": "Passage X lies south of Rutland Island but north of Little Andaman. Which passage is X?",
    "answer": "Duncan Passage",
    "distractors": [
      "Great Channel",
      "Palk Strait",
      "Nine Degree Channel"
    ],
    "explanation": "The passage in that exact Andaman position is Duncan Passage. It separates Rutland on the north from Little Andaman on the south.",
    "sourceFactIds": [
      "DUNCAN-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-054",
    "qlName": "Great Channel — Nicobar/northern Sumatra setting",
    "difficulty": "Easy",
    "stem": "Which channel lies between the Nicobar region and northern Sumatra?",
    "answer": "Great Channel",
    "distractors": [
      "Nine Degree Channel",
      "Palk Strait",
      "Duncan Passage"
    ],
    "explanation": "Great Channel lies south of the Nicobar Islands toward northern Sumatra. It forms an important geographic approach toward the Malacca Strait region.",
    "sourceFactIds": [
      "GREAT-CHANNEL-NICOBAR-SUMATRA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-054",
    "qlName": "Great Channel — Nicobar/northern Sumatra setting",
    "difficulty": "Easy",
    "stem": "Great Channel is associated most closely with which Indian island group?",
    "answer": "Nicobar Islands",
    "distractors": [
      "Lakshadweep",
      "Andaman Islands only",
      "Diu"
    ],
    "explanation": "Great Channel lies on the southern side of the Nicobar region toward northern Sumatra. It is therefore linked most directly with the Nicobar Islands.",
    "sourceFactIds": [
      "GREAT-CHANNEL-NICOBAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-054",
    "qlName": "Great Channel — Nicobar/northern Sumatra setting",
    "difficulty": "Medium",
    "stem": "A vessel sails south-east from Great Nicobar toward Sumatra. Which named channel lies on this route?",
    "answer": "Great Channel",
    "distractors": [
      "Nine Degree Channel",
      "Palk Strait",
      "Duncan Passage"
    ],
    "explanation": "Great Channel lies between the Nicobar area and northern Sumatra. A south-easterly route from Great Nicobar toward Sumatra enters this maritime corridor.",
    "sourceFactIds": [
      "GREAT-CHANNEL-ROUTE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-054",
    "qlName": "Great Channel — Nicobar/northern Sumatra setting",
    "difficulty": "Medium",
    "stem": "Which pairing is correct?",
    "answer": "Great Channel — Nicobar Islands and northern Sumatra",
    "distractors": [
      "Great Channel — Minicoy and Maldives",
      "Great Channel — India and Sri Lanka",
      "Great Channel — Rutland and Little Andaman"
    ],
    "explanation": "Great Channel lies between the Nicobar region and northern Sumatra. The other pairings belong to Eight Degree Channel, Palk Strait and Duncan Passage.",
    "sourceFactIds": [
      "GREAT-CHANNEL-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-054",
    "qlName": "Great Channel — Nicobar/northern Sumatra setting",
    "difficulty": "Medium",
    "stem": "Which channel is located farthest southeast among these Indian maritime features?",
    "answer": "Great Channel",
    "distractors": [
      "Palk Strait",
      "Nine Degree Channel",
      "Eight Degree Channel"
    ],
    "explanation": "Great Channel lies beyond Great Nicobar toward northern Sumatra, making it the southeastern option here. The others lie around Tamil Nadu or Lakshadweep.",
    "sourceFactIds": [
      "GREAT-CHANNEL-SOUTHEAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-054",
    "qlName": "Great Channel — Nicobar/northern Sumatra setting",
    "difficulty": "Medium",
    "stem": "Why is Great Channel linked with India's far southeastern island geography?",
    "answer": "It lies beyond the Nicobar group toward Sumatra",
    "distractors": [
      "It separates Gujarat from Pakistan",
      "It lies between Minicoy and Kavaratti",
      "It separates Tamil Nadu from Sri Lanka"
    ],
    "explanation": "Great Channel occupies the sea space south-east of the Nicobar Islands toward Sumatra. This places it in India's far southeastern maritime setting.",
    "sourceFactIds": [
      "GREAT-CHANNEL-SE-REASON"
    ]
  }
]);

export const GEO_LOC_001_CP006_REVIEW_BATCH_V1: readonly GeoLoc001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-LOC-001-CP006-Q${String(index + 1).padStart(3, "0")}`,
      qlId: raw.qlId,
      qlName: raw.qlName,
      difficulty: raw.difficulty,
      stem: raw.stem,
      options: placeGeoLocOptions(raw.answer, raw.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: raw.answer,
      explanation: raw.explanation,
      sourceIds: CP006_SOURCE_IDS,
      sourceFactIds: Object.freeze([...raw.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED = /associated with|best describes|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|given in NCERT|\bNCERT\b|\btextbook\b|stated mainland|which pair correctly|which statement correctly|which option gives|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR = /currency|literacy rate|stock market|crop price|movie|sports team|bank rate|tax slab/i;

export function auditGeoLoc001Cp006ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_LOC_001_CP006_REVIEW_BATCH_V1) {
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

  if (GEO_LOC_001_CP006_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_LOC_001_CP006_REVIEW_BATCH_V1.length);
  for (let n = 46; n <= 54; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_LOC_001_CP006_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
