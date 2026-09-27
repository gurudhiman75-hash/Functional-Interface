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

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-LOC-001-QL-010",
    "qlName": "Southernmost point of mainland India — Kanyakumari",
    "difficulty": "Easy",
    "stem": "What is the southernmost point of mainland India?",
    "answer": "Kanyakumari",
    "distractors": [
      "Indira Point",
      "Minicoy",
      "Port Blair"
    ],
    "explanation": "Kanyakumari marks the southern end of mainland India. Indira Point lies farther south, but it is on Great Nicobar Island and is therefore not a mainland point.",
    "sourceFactIds": [
      "MAINLAND-SOUTHERNMOST-KANYAKUMARI"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-010",
    "qlName": "Southernmost point of mainland India — Kanyakumari",
    "difficulty": "Easy",
    "stem": "Kanyakumari, the southernmost point of mainland India, is in which state?",
    "answer": "Tamil Nadu",
    "distractors": [
      "Kerala",
      "Karnataka",
      "Andhra Pradesh"
    ],
    "explanation": "Kanyakumari is located in Tamil Nadu at the southern end of the Indian mainland. The distinction matters because India's overall southernmost point lies on an island farther south.",
    "sourceFactIds": [
      "KANYAKUMARI-TAMIL-NADU"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-010",
    "qlName": "Southernmost point of mainland India — Kanyakumari",
    "difficulty": "Medium",
    "stem": "A question asks for India's southernmost mainland point rather than its southernmost point overall. What should the answer be?",
    "answer": "Kanyakumari",
    "distractors": [
      "Indira Point",
      "Great Nicobar",
      "Lakshadweep"
    ],
    "explanation": "The word mainland changes the answer. Kanyakumari is the southernmost point of mainland India, whereas Indira Point on Great Nicobar is the southernmost point of India as a whole.",
    "sourceFactIds": [
      "MAINLAND-VS-UNION-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-010",
    "qlName": "Southernmost point of mainland India — Kanyakumari",
    "difficulty": "Medium",
    "stem": "Which place should be marked at the southern tip of the Indian mainland on a map?",
    "answer": "Kanyakumari",
    "distractors": [
      "Indira Point",
      "Car Nicobar",
      "Kavaratti"
    ],
    "explanation": "The Indian mainland ends at Kanyakumari in Tamil Nadu. Island locations such as Indira Point or Car Nicobar lie away from the mainland and should not replace it on a mainland-extreme question.",
    "sourceFactIds": [
      "KANYAKUMARI-MAP-SOUTH-TIP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-010",
    "qlName": "Southernmost point of mainland India — Kanyakumari",
    "difficulty": "Medium",
    "stem": "Why is Kanyakumari not called the southernmost point of India as a whole?",
    "answer": "Indian islands extend farther south than the mainland",
    "distractors": [
      "Kanyakumari lies north of the Tropic of Cancer",
      "Tamil Nadu has no coastline",
      "Kanyakumari is outside India"
    ],
    "explanation": "India includes island territories as well as the mainland. Great Nicobar Island extends farther south than Kanyakumari, so the overall southernmost point is different from the mainland southern tip.",
    "sourceFactIds": [
      "KANYAKUMARI-NOT-OVERALL-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-010",
    "qlName": "Southernmost point of mainland India — Kanyakumari",
    "difficulty": "Medium",
    "stem": "Kanyakumari and Indira Point are both used in questions on India's southern extent. What does Kanyakumari represent?",
    "answer": "The southernmost point of the mainland",
    "distractors": [
      "The southernmost point of the entire country",
      "The easternmost point of the mainland",
      "The westernmost point of the mainland"
    ],
    "explanation": "Kanyakumari belongs specifically to the mainland-extreme fact. Indira Point is used when the question asks for the southernmost point of India including its island territory.",
    "sourceFactIds": [
      "KANYAKUMARI-ROLE-DISTINCTION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-011",
    "qlName": "Southernmost point of India — Indira Point",
    "difficulty": "Easy",
    "stem": "What is the southernmost point of India?",
    "answer": "Indira Point",
    "distractors": [
      "Kanyakumari",
      "Minicoy",
      "Kavaratti"
    ],
    "explanation": "Indira Point is the southernmost point of India when the country's island territory is included. It lies south of Kanyakumari, which is the southernmost point of the mainland.",
    "sourceFactIds": [
      "INDIA-SOUTHERNMOST-INDIRA-POINT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-011",
    "qlName": "Southernmost point of India — Indira Point",
    "difficulty": "Easy",
    "stem": "Indira Point is located on which island?",
    "answer": "Great Nicobar Island",
    "distractors": [
      "North Andaman Island",
      "Minicoy Island",
      "Majuli"
    ],
    "explanation": "Indira Point lies on Great Nicobar Island, the southernmost major island of the Andaman and Nicobar group. This location makes it India's southernmost point.",
    "sourceFactIds": [
      "INDIRA-POINT-GREAT-NICOBAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-011",
    "qlName": "Southernmost point of India — Indira Point",
    "difficulty": "Medium",
    "stem": "Indira Point belongs to which island group?",
    "answer": "Andaman and Nicobar Islands",
    "distractors": [
      "Lakshadweep Islands",
      "Maldives",
      "Sundarbans"
    ],
    "explanation": "Great Nicobar, on which Indira Point lies, is part of the Andaman and Nicobar Islands. Lakshadweep lies off India's western coast and does not contain the country's southernmost point.",
    "sourceFactIds": [
      "INDIRA-POINT-ISLAND-GROUP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-011",
    "qlName": "Southernmost point of India — Indira Point",
    "difficulty": "Medium",
    "stem": "Which place lies farther south: Kanyakumari or Indira Point?",
    "answer": "Indira Point",
    "distractors": [
      "Kanyakumari",
      "Both lie at the same latitude",
      "Their positions cannot be compared"
    ],
    "explanation": "Indira Point lies on Great Nicobar Island and extends farther south than the mainland. Kanyakumari remains the southernmost mainland point but not the southernmost point of India overall.",
    "sourceFactIds": [
      "INDIRA-VS-KANYAKUMARI-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-011",
    "qlName": "Southernmost point of India — Indira Point",
    "difficulty": "Medium",
    "stem": "A map includes both mainland India and its island territories. Which label belongs at the country's southern extreme?",
    "answer": "Indira Point",
    "distractors": [
      "Kanyakumari",
      "Diu",
      "Kochi"
    ],
    "explanation": "When island territories are included, India's southern extent reaches Great Nicobar Island. Indira Point therefore marks the country's southern extreme on a complete map of India.",
    "sourceFactIds": [
      "INDIRA-POINT-COMPLETE-MAP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-011",
    "qlName": "Southernmost point of India — Indira Point",
    "difficulty": "Medium",
    "stem": "Which statement about Indira Point is accurate?",
    "answer": "It is India's southernmost point and lies on Great Nicobar Island",
    "distractors": [
      "It is the southernmost point of mainland India",
      "It lies in Lakshadweep",
      "It is on the Gujarat coast"
    ],
    "explanation": "Indira Point combines two linked facts: it is India's southernmost point and it lies on Great Nicobar Island. Kanyakumari, not Indira Point, is the southernmost point of the mainland.",
    "sourceFactIds": [
      "INDIRA-POINT-IDENTITY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-012",
    "qlName": "Indira Point and the 2004 tsunami",
    "difficulty": "Easy",
    "stem": "What happened to Indira Point during the 2004 tsunami?",
    "answer": "It was submerged under seawater",
    "distractors": [
      "It became part of the mainland",
      "It shifted to Lakshadweep",
      "It became India's northernmost point"
    ],
    "explanation": "Indira Point was submerged under seawater during the 2004 tsunami. This event is often linked with the location because the point lies at the southern end of Great Nicobar Island.",
    "sourceFactIds": [
      "INDIRA-POINT-2004-TSUNAMI"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-012",
    "qlName": "Indira Point and the 2004 tsunami",
    "difficulty": "Easy",
    "stem": "In which year did the tsunami linked with the submergence of Indira Point occur?",
    "answer": "2004",
    "distractors": [
      "1999",
      "2001",
      "2011"
    ],
    "explanation": "The tsunami occurred in 2004 and affected Indira Point on Great Nicobar Island. The year is part of the standard static-geography fact connected with India's southernmost point.",
    "sourceFactIds": [
      "INDIRA-POINT-TSUNAMI-YEAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-012",
    "qlName": "Indira Point and the 2004 tsunami",
    "difficulty": "Medium",
    "stem": "The 2004 tsunami affected which Indian extreme point?",
    "answer": "Indira Point",
    "distractors": [
      "Kanyakumari",
      "Gujarat's western edge",
      "Arunachal Pradesh's eastern edge"
    ],
    "explanation": "Indira Point on Great Nicobar Island was submerged under seawater during the 2004 tsunami. The event concerns India's southernmost point, not the mainland southern tip at Kanyakumari.",
    "sourceFactIds": [
      "TSUNAMI-AFFECTED-EXTREME-POINT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-012",
    "qlName": "Indira Point and the 2004 tsunami",
    "difficulty": "Medium",
    "stem": "Why is the 2004 tsunami mentioned in questions about Indira Point?",
    "answer": "The point was submerged under seawater during the event",
    "distractors": [
      "The tsunami created the Andaman Islands",
      "It moved Kanyakumari into the Bay of Bengal",
      "It changed India's Standard Meridian"
    ],
    "explanation": "The geographical identity of Indira Point is often paired with the 2004 tsunami because seawater submerged the point during that event. The tsunami did not change India's standard meridian or create its island groups.",
    "sourceFactIds": [
      "INDIRA-POINT-TSUNAMI-RELEVANCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-012",
    "qlName": "Indira Point and the 2004 tsunami",
    "difficulty": "Medium",
    "stem": "Indira Point, affected by the 2004 tsunami, lies on which island?",
    "answer": "Great Nicobar Island",
    "distractors": [
      "Minicoy Island",
      "Little Andaman Island",
      "Elephanta Island"
    ],
    "explanation": "The tsunami fact and the location fact refer to the same place on Great Nicobar Island. Great Nicobar belongs to the Andaman and Nicobar group southeast of the mainland.",
    "sourceFactIds": [
      "INDIRA-TSUNAMI-GREAT-NICOBAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-012",
    "qlName": "Indira Point and the 2004 tsunami",
    "difficulty": "Medium",
    "stem": "Which event-place combination belongs to India's southernmost point?",
    "answer": "Indira Point — submerged during the 2004 tsunami",
    "distractors": [
      "Kanyakumari — submerged during the 2004 tsunami",
      "Kavaratti — shifted after the 2004 tsunami",
      "Gujarat coast — became the southernmost point in 2004"
    ],
    "explanation": "Indira Point is the southernmost point of India and was submerged under seawater during the 2004 tsunami. The other places do not carry this extreme-point and tsunami combination.",
    "sourceFactIds": [
      "INDIRA-EVENT-PLACE-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-013",
    "qlName": "Western and eastern mainland edge states",
    "difficulty": "Easy",
    "stem": "Which state lies at the western edge of mainland India?",
    "answer": "Gujarat",
    "distractors": [
      "Odisha",
      "West Bengal",
      "Arunachal Pradesh"
    ],
    "explanation": "Gujarat reaches the western edge of mainland India. Arunachal Pradesh occupies the far eastern side, making the two states useful reference points for India's east–west extent.",
    "sourceFactIds": [
      "WESTERN-EDGE-GUJARAT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-013",
    "qlName": "Western and eastern mainland edge states",
    "difficulty": "Easy",
    "stem": "Which state lies at the eastern edge of mainland India?",
    "answer": "Arunachal Pradesh",
    "distractors": [
      "Gujarat",
      "Rajasthan",
      "Kerala"
    ],
    "explanation": "Arunachal Pradesh reaches the eastern edge of mainland India. Gujarat lies at the western edge, so the two states anchor the mainland's east–west map position.",
    "sourceFactIds": [
      "EASTERN-EDGE-ARUNACHAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-013",
    "qlName": "Western and eastern mainland edge states",
    "difficulty": "Medium",
    "stem": "Travelling across mainland India from its western edge to its eastern edge, which state comes first and which comes last?",
    "answer": "Gujarat first, Arunachal Pradesh last",
    "distractors": [
      "Arunachal Pradesh first, Gujarat last",
      "Kerala first, West Bengal last",
      "Rajasthan first, Odisha last"
    ],
    "explanation": "The western edge is in Gujarat, while the eastern edge reaches Arunachal Pradesh. A west-to-east map sequence therefore begins with Gujarat and ends with Arunachal Pradesh.",
    "sourceFactIds": [
      "WEST-EAST-STATE-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-013",
    "qlName": "Western and eastern mainland edge states",
    "difficulty": "Medium",
    "stem": "Gujarat and Arunachal Pradesh are useful reference states for which dimension of mainland India?",
    "answer": "East–west extent",
    "distractors": [
      "North–south extent",
      "Altitude range",
      "Coastline depth"
    ],
    "explanation": "Gujarat lies on the far western side and Arunachal Pradesh on the far eastern side of the mainland. Their positions illustrate India's east–west spread rather than its north–south span.",
    "sourceFactIds": [
      "EDGE-STATES-EAST-WEST-EXTENT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-013",
    "qlName": "Western and eastern mainland edge states",
    "difficulty": "Medium",
    "stem": "A map swaps Gujarat and Arunachal Pradesh as India's western and eastern edge states. What is wrong?",
    "answer": "Their east–west positions have been reversed",
    "distractors": [
      "Both states are actually on the southern coast",
      "Neither state lies in India",
      "Both states occupy the same longitude"
    ],
    "explanation": "Gujarat belongs on the western side of the mainland and Arunachal Pradesh on the eastern side. Swapping them reverses India's actual east–west map orientation.",
    "sourceFactIds": [
      "EDGE-STATES-REVERSAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-013",
    "qlName": "Western and eastern mainland edge states",
    "difficulty": "Hard",
    "stem": "P is in Gujarat and Q is in Arunachal Pradesh. Without using their exact coordinates, which conclusion follows from their mainland positions?",
    "answer": "P is toward India's western edge and Q toward its eastern edge",
    "distractors": [
      "P is east of Q",
      "Both are at the same east–west position",
      "Q is toward the western edge and P toward the eastern edge"
    ],
    "explanation": "Gujarat occupies the western side of mainland India, whereas Arunachal Pradesh lies at the eastern side. Exact coordinates are unnecessary to establish this basic directional relationship.",
    "sourceFactIds": [
      "EDGE-STATES-DIRECTIONAL-REASONING"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-014",
    "qlName": "Peninsular shape and southward taper",
    "difficulty": "Easy",
    "stem": "What happens to the Indian landmass south of the Tropic of Cancer?",
    "answer": "It tapers toward the Indian Ocean",
    "distractors": [
      "It widens continuously toward the north",
      "It becomes a separate island",
      "It turns west toward Central Asia"
    ],
    "explanation": "South of the Tropic of Cancer, the Indian landmass narrows toward the Indian Ocean. This southward taper gives peninsular India its characteristic triangular form.",
    "sourceFactIds": [
      "INDIA-SOUTHWARD-TAPER"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-014",
    "qlName": "Peninsular shape and southward taper",
    "difficulty": "Easy",
    "stem": "Which term fits the southern part of India because it projects into the sea?",
    "answer": "Peninsula",
    "distractors": [
      "Isthmus",
      "Delta",
      "Archipelago"
    ],
    "explanation": "A peninsula is a landmass surrounded by water on three sides while remaining connected to a larger landmass. Southern India projects into the Indian Ocean in this peninsular form.",
    "sourceFactIds": [
      "INDIA-PENINSULAR-FORM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-014",
    "qlName": "Peninsular shape and southward taper",
    "difficulty": "Medium",
    "stem": "Why does the outline of southern India narrow as it extends toward the ocean?",
    "answer": "The landmass tapers southward into a peninsula",
    "distractors": [
      "The mainland ends at the Tropic of Cancer",
      "The Himalayas continue into the ocean",
      "India becomes wider toward its southern tip"
    ],
    "explanation": "The southern landmass becomes progressively narrower and forms a peninsula. This tapering shape continues toward the Indian Ocean rather than widening toward the southern tip.",
    "sourceFactIds": [
      "PENINSULAR-TAPER-REASON"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-014",
    "qlName": "Peninsular shape and southward taper",
    "difficulty": "Medium",
    "stem": "Which map outline is most consistent with peninsular India?",
    "answer": "A landmass narrowing southward and projecting into the ocean",
    "distractors": [
      "A circular island detached from Asia",
      "A landmass widening steadily toward the south",
      "A narrow strip extending only eastward"
    ],
    "explanation": "Peninsular India narrows toward the south and projects into the ocean. The outline is therefore neither a detached island nor a landmass that widens continuously toward the south.",
    "sourceFactIds": [
      "PENINSULAR-MAP-SHAPE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-014",
    "qlName": "Peninsular shape and southward taper",
    "difficulty": "Medium",
    "stem": "The southward taper of India becomes especially clear beyond which major latitude?",
    "answer": "Tropic of Cancer",
    "distractors": [
      "Equator",
      "Arctic Circle",
      "Tropic of Capricorn"
    ],
    "explanation": "India stretches southward and becomes narrower beyond the Tropic of Cancer. The peninsula then projects into the Indian Ocean, producing the familiar shape of southern India.",
    "sourceFactIds": [
      "PENINSULA-TROPIC-REFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-014",
    "qlName": "Peninsular shape and southward taper",
    "difficulty": "Hard",
    "stem": "A landmass remains joined to Asia in the north but narrows southward with water around much of its southern sides. Which feature of India does this describe?",
    "answer": "Its peninsular form",
    "distractors": [
      "Its island character",
      "Its landlocked position",
      "Its polar location"
    ],
    "explanation": "India is connected to the Asian landmass in the north while its southern part projects into surrounding waters. This combination produces a peninsula rather than an island or a landlocked country.",
    "sourceFactIds": [
      "PENINSULAR-FORM-INTEGRATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-015",
    "qlName": "India's land-boundary length",
    "difficulty": "Easy",
    "stem": "What is the approximate length of India's land boundary?",
    "answer": "15,200 km",
    "distractors": [
      "7,516.6 km",
      "3,214 km",
      "2,933 km"
    ],
    "explanation": "India's land boundary is about 15,200 km long. This figure refers to the boundary on land and should not be confused with the country's coastline or mainland dimensions.",
    "sourceFactIds": [
      "LAND-BOUNDARY-LENGTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-015",
    "qlName": "India's land-boundary length",
    "difficulty": "Easy",
    "stem": "The figure of about 15,200 km refers to which feature of India?",
    "answer": "Land boundary",
    "distractors": [
      "Total coastline",
      "North–south mainland extent",
      "East–west mainland extent"
    ],
    "explanation": "About 15,200 km is the standard figure for India's land boundary. The coastline is much shorter, while the north–south and east–west mainland spans are measured separately.",
    "sourceFactIds": [
      "LAND-BOUNDARY-FIGURE-IDENTITY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-015",
    "qlName": "India's land-boundary length",
    "difficulty": "Medium",
    "stem": "Which measurement should be used when a question asks for India's frontier on land?",
    "answer": "About 15,200 km",
    "distractors": [
      "About 7,516.6 km",
      "About 3,214 km",
      "About 2,933 km"
    ],
    "explanation": "A frontier on land refers to the land boundary, whose approximate length is 15,200 km. The 7,516.6 km figure belongs to the total coastline including island groups.",
    "sourceFactIds": [
      "LAND-FRONTIER-MEASUREMENT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-015",
    "qlName": "India's land-boundary length",
    "difficulty": "Medium",
    "stem": "Why should 15,200 km not be used as India's coastline length?",
    "answer": "It measures the land boundary, not the coast",
    "distractors": [
      "It measures only the Andaman Islands",
      "It is India's north–south distance",
      "It is India's east–west distance"
    ],
    "explanation": "The 15,200 km figure measures India's land frontier with neighbouring countries. Coastline is a different measurement and includes the shoreline of the mainland and island groups.",
    "sourceFactIds": [
      "LAND-BOUNDARY-NOT-COAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-015",
    "qlName": "India's land-boundary length",
    "difficulty": "Medium",
    "stem": "India's land boundary is closest to which of these values?",
    "answer": "15.2 thousand km",
    "distractors": [
      "7.5 thousand km",
      "3.2 thousand km",
      "2.9 thousand km"
    ],
    "explanation": "About 15.2 thousand km is another way of expressing the approximate 15,200 km land-boundary figure. The other values are closer to coastline or mainland span measurements.",
    "sourceFactIds": [
      "LAND-BOUNDARY-UNIT-CONVERSION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-015",
    "qlName": "India's land-boundary length",
    "difficulty": "Hard",
    "stem": "A table lists 15,200 km beside 'coastline' and 7,516.6 km beside 'land boundary'. What correction is needed?",
    "answer": "The two labels should be exchanged",
    "distractors": [
      "Both figures should be removed",
      "Only 15,200 km should be doubled",
      "Both labels are already correct"
    ],
    "explanation": "The land boundary is about 15,200 km, while the total coastline is about 7,516.6 km. The table has assigned each standard figure to the wrong feature.",
    "sourceFactIds": [
      "LAND-COAST-LABEL-CORRECTION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-016",
    "qlName": "India's total coastline length",
    "difficulty": "Easy",
    "stem": "What is the approximate total length of India's coastline including its island groups?",
    "answer": "7,516.6 km",
    "distractors": [
      "15,200 km",
      "3,214 km",
      "2,933 km"
    ],
    "explanation": "India's total coastline is about 7,516.6 km when the mainland and the Andaman and Nicobar and Lakshadweep island groups are included. It is distinct from the land boundary.",
    "sourceFactIds": [
      "TOTAL-COASTLINE-LENGTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-016",
    "qlName": "India's total coastline length",
    "difficulty": "Easy",
    "stem": "The figure 7,516.6 km refers to which measurement of India?",
    "answer": "Total coastline including the islands",
    "distractors": [
      "Land boundary",
      "North–south mainland extent",
      "East–west mainland extent"
    ],
    "explanation": "The 7,516.6 km figure measures India's coastline when the island groups are included. The land boundary is about 15,200 km and is a separate territorial measurement.",
    "sourceFactIds": [
      "COASTLINE-FIGURE-IDENTITY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-016",
    "qlName": "India's total coastline length",
    "difficulty": "Medium",
    "stem": "Which value belongs to India's coastline rather than its land boundary?",
    "answer": "About 7,516.6 km",
    "distractors": [
      "About 15,200 km",
      "About 3,214 km",
      "About 2,933 km"
    ],
    "explanation": "India's total coastline is about 7,516.6 km, including the shoreline of its island groups. The much larger 15,200 km figure refers to the land boundary.",
    "sourceFactIds": [
      "COASTLINE-VS-LAND-FIGURE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-016",
    "qlName": "India's total coastline length",
    "difficulty": "Medium",
    "stem": "Why does the standard total coastline figure exceed a mainland-only shoreline measurement?",
    "answer": "It also includes the Andaman and Nicobar and Lakshadweep island coasts",
    "distractors": [
      "It includes India's land border twice",
      "It adds the north–south extent",
      "It counts the Tropic of Cancer as coastline"
    ],
    "explanation": "The total coastline is not restricted to the mainland shoreline. It includes the coasts of the Andaman and Nicobar Islands and Lakshadweep, which add to the national total.",
    "sourceFactIds": [
      "COASTLINE-INCLUDES-ISLANDS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-016",
    "qlName": "India's total coastline length",
    "difficulty": "Medium",
    "stem": "India's total coastline is closest to which rounded value?",
    "answer": "7.5 thousand km",
    "distractors": [
      "15.2 thousand km",
      "3.2 thousand km",
      "2.9 thousand km"
    ],
    "explanation": "The standard total coastline figure of 7,516.6 km rounds to about 7.5 thousand km. The 15.2 thousand km value corresponds to India's land boundary.",
    "sourceFactIds": [
      "COASTLINE-ROUNDED-VALUE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-016",
    "qlName": "India's total coastline length",
    "difficulty": "Hard",
    "stem": "A student uses 7,516.6 km for the mainland north–south span. Which geographic measurement has actually been quoted?",
    "answer": "India's total coastline including island groups",
    "distractors": [
      "The mainland north–south span",
      "The land boundary",
      "The mainland east–west span"
    ],
    "explanation": "The north–south mainland span is about 3,214 km, not 7,516.6 km. The larger 7,516.6 km figure belongs to India's total coastline including the island groups.",
    "sourceFactIds": [
      "COASTLINE-MISIDENTIFIED-MEASUREMENT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-017",
    "qlName": "Mainland and island components of the coastline",
    "difficulty": "Easy",
    "stem": "Which island groups are included in India's total coastline figure?",
    "answer": "Andaman and Nicobar Islands and Lakshadweep",
    "distractors": [
      "Maldives and Sri Lanka",
      "Seychelles and Mauritius",
      "Java and Sumatra"
    ],
    "explanation": "India's total coastline includes the mainland shoreline plus the coasts of the Andaman and Nicobar Islands and Lakshadweep. Foreign island countries are not part of India's coastline.",
    "sourceFactIds": [
      "COASTLINE-ISLAND-GROUPS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-017",
    "qlName": "Mainland and island components of the coastline",
    "difficulty": "Easy",
    "stem": "Does India's total coastline figure include only the mainland coast?",
    "answer": "No, it also includes the coasts of the Indian island groups",
    "distractors": [
      "Yes, island coasts are excluded",
      "No, it includes all South Asian islands",
      "Yes, because islands have no coastline"
    ],
    "explanation": "The national coastline total includes both the mainland shoreline and the shores of India's major island groups. Excluding Andaman and Nicobar and Lakshadweep would not give the full total.",
    "sourceFactIds": [
      "COASTLINE-NOT-MAINLAND-ONLY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-017",
    "qlName": "Mainland and island components of the coastline",
    "difficulty": "Medium",
    "stem": "A coastline calculation includes mainland India and Lakshadweep but omits the Andaman and Nicobar Islands. What is missing?",
    "answer": "Part of India's island coastline",
    "distractors": [
      "Part of India's land boundary",
      "The Standard Meridian",
      "The Tropic of Cancer"
    ],
    "explanation": "The Andaman and Nicobar Islands contribute shoreline to India's total coastline just as Lakshadweep does. Omitting them would make the coastline calculation incomplete.",
    "sourceFactIds": [
      "COASTLINE-OMIT-ANDAMAN-NICOBAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-017",
    "qlName": "Mainland and island components of the coastline",
    "difficulty": "Medium",
    "stem": "Why do Lakshadweep and the Andaman and Nicobar Islands matter when measuring India's coastline?",
    "answer": "Their shorelines form part of India's national coastline",
    "distractors": [
      "They add to India's land boundary with China",
      "They determine India's northern latitude",
      "They set Indian Standard Time"
    ],
    "explanation": "Both island groups are Indian territory with their own shorelines. Their coasts are added to the mainland shoreline when India's total coastline is measured.",
    "sourceFactIds": [
      "ISLANDS-CONTRIBUTE-COASTLINE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-017",
    "qlName": "Mainland and island components of the coastline",
    "difficulty": "Medium",
    "stem": "Which calculation would give the most complete measure of India's coastline?",
    "answer": "Mainland coast plus Andaman and Nicobar plus Lakshadweep coasts",
    "distractors": [
      "Mainland coast only",
      "Andaman and Nicobar coast only",
      "Lakshadweep coast plus land boundary"
    ],
    "explanation": "A national coastline total must include every Indian shoreline counted in the standard figure. That means the mainland coast together with the Andaman and Nicobar and Lakshadweep coasts.",
    "sourceFactIds": [
      "COMPLETE-COASTLINE-CALCULATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-017",
    "qlName": "Mainland and island components of the coastline",
    "difficulty": "Hard",
    "stem": "Two reports use different coastline totals because one counts only the mainland and the other includes Indian islands. Which report matches the standard national total?",
    "answer": "The report that includes both mainland and island coasts",
    "distractors": [
      "The mainland-only report",
      "Neither report, because islands are land boundaries",
      "Both must always have identical totals"
    ],
    "explanation": "The standard national coastline figure includes the shoreline of the mainland and the Indian island groups. A mainland-only calculation measures a narrower geographic quantity.",
    "sourceFactIds": [
      "COASTLINE-REPORT-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-018",
    "qlName": "Land-boundary / coastline integrated comparison",
    "difficulty": "Easy",
    "stem": "Which is longer in India: the land boundary or the total coastline?",
    "answer": "The land boundary",
    "distractors": [
      "The total coastline",
      "Both are equal",
      "Neither can be measured"
    ],
    "explanation": "India's land boundary is about 15,200 km, while its total coastline is about 7,516.6 km. The land boundary is therefore roughly twice as long as the coastline.",
    "sourceFactIds": [
      "LAND-BOUNDARY-LONGER-THAN-COAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-018",
    "qlName": "Land-boundary / coastline integrated comparison",
    "difficulty": "Easy",
    "stem": "Which two figures match India's land boundary and total coastline respectively?",
    "answer": "About 15,200 km and 7,516.6 km",
    "distractors": [
      "About 7,516.6 km and 15,200 km",
      "About 3,214 km and 2,933 km",
      "About 2,933 km and 3,214 km"
    ],
    "explanation": "The land boundary is about 15,200 km and the total coastline about 7,516.6 km. The 3,214 km and 2,933 km figures instead describe mainland dimensions.",
    "sourceFactIds": [
      "LAND-COAST-FIGURE-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-018",
    "qlName": "Land-boundary / coastline integrated comparison",
    "difficulty": "Medium",
    "stem": "A question gives 15,200 km and 7,516.6 km. How should these be identified?",
    "answer": "Land boundary first, total coastline second",
    "distractors": [
      "Total coastline first, land boundary second",
      "North–south span first, east–west span second",
      "East–west span first, north–south span second"
    ],
    "explanation": "The larger 15,200 km figure belongs to India's land boundary. The 7,516.6 km figure is the total coastline including the Andaman and Nicobar and Lakshadweep coasts.",
    "sourceFactIds": [
      "LAND-COAST-ORDER"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-018",
    "qlName": "Land-boundary / coastline integrated comparison",
    "difficulty": "Medium",
    "stem": "Why cannot India's land-boundary and coastline figures be added and treated as one simple 'length of India'?",
    "answer": "They measure different geographic features",
    "distractors": [
      "One is measured in degrees and the other in litres",
      "Both refer only to islands",
      "Neither has a standard unit"
    ],
    "explanation": "Land boundary measures the frontier on land, while coastline measures shoreline. They answer different geographic questions and are not interchangeable with a single linear dimension of India.",
    "sourceFactIds": [
      "LAND-COAST-DIFFERENT-MEASURES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-018",
    "qlName": "Land-boundary / coastline integrated comparison",
    "difficulty": "Medium",
    "stem": "Which comparison uses the two territorial-length figures accurately?",
    "answer": "15,200 km of land boundary is greater than 7,516.6 km of coastline",
    "distractors": [
      "7,516.6 km of land boundary is greater than 15,200 km of coastline",
      "Both figures describe coastline",
      "Both figures describe land boundary"
    ],
    "explanation": "The land boundary figure is about 15,200 km and exceeds the total coastline figure of about 7,516.6 km. Reversing the labels produces a common factual error.",
    "sourceFactIds": [
      "LAND-COAST-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-018",
    "qlName": "Land-boundary / coastline integrated comparison",
    "difficulty": "Hard",
    "stem": "Statement I: India's land boundary is about 15,200 km. Statement II: Its total coastline, including island groups, is about 7,516.6 km. Statement III: The coastline is longer than the land boundary. Which statements are correct?",
    "answer": "I and II only",
    "distractors": [
      "I and III only",
      "II and III only",
      "I, II and III"
    ],
    "explanation": "Statements I and II give the standard territorial-length figures. Statement III is false because about 7,516.6 km of coastline is shorter than the roughly 15,200 km land boundary.",
    "sourceFactIds": [
      "LAND-COAST-STATEMENTS"
    ]
  }
]);

export const GEO_LOC_001_CP002_REVIEW_BATCH_V1: readonly GeoLoc001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-LOC-001-CP002-Q${String(index + 1).padStart(3, "0")}`,
      qlId: raw.qlId,
      qlName: raw.qlName,
      difficulty: raw.difficulty,
      stem: raw.stem,
      options: placeGeoLocOptions(raw.answer, raw.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: raw.answer,
      explanation: raw.explanation,
      sourceIds: GEO_LOC_001_SOURCE_IDS,
      sourceFactIds: Object.freeze([...raw.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED = /associated with|best describes|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|given in NCERT|\bNCERT\b|\btextbook\b|stated mainland|which pair correctly|which statement correctly|which option gives|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR = /currency|literacy rate|stock market|crop price|movie|sports team|bank rate|tax slab/i;

export function auditGeoLoc001Cp002ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_LOC_001_CP002_REVIEW_BATCH_V1) {
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

  if (GEO_LOC_001_CP002_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_LOC_001_CP002_REVIEW_BATCH_V1.length);
  for (let n = 10; n <= 18; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_LOC_001_CP002_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
