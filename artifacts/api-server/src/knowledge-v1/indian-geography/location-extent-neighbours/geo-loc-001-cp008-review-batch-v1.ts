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

const CP008_SOURCE_IDS = Object.freeze([
  ...GEO_LOC_001_SOURCE_IDS,
  "IGNFA-2025-TROPIC-OF-CANCER-STATES",
  "IMD-RASHTRIYA-PANCHANG-STANDARD-MERIDIAN",
  "GOI-REFERENCE-LINE-MAP-AUDIT",
] as const);

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-LOC-001-QL-064",
    "qlName": "Tropic of Cancer — eight-state count",
    "difficulty": "Easy",
    "stem": "How many Indian states are crossed by the Tropic of Cancer?",
    "answer": "Eight",
    "distractors": [
      "Six",
      "Seven",
      "Nine"
    ],
    "explanation": "The Tropic of Cancer crosses eight Indian states. These stretch from Gujarat in the west to Mizoram in the northeast.",
    "sourceFactIds": [
      "TOC-EIGHT-STATES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-064",
    "qlName": "Tropic of Cancer — eight-state count",
    "difficulty": "Easy",
    "stem": "The Tropic of Cancer passes through how many states in India?",
    "answer": "8",
    "distractors": [
      "5",
      "7",
      "10"
    ],
    "explanation": "Eight Indian states are crossed by the Tropic of Cancer. Counting the full west-to-east sequence gives Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram.",
    "sourceFactIds": [
      "TOC-COUNT-8"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-064",
    "qlName": "Tropic of Cancer — eight-state count",
    "difficulty": "Medium",
    "stem": "A list contains seven states crossed by the Tropic of Cancer. How many states are missing from the complete Indian list?",
    "answer": "One",
    "distractors": [
      "Two",
      "Three",
      "None"
    ],
    "explanation": "The complete Indian Tropic of Cancer list contains eight states. A seven-state list is therefore short by one state.",
    "sourceFactIds": [
      "TOC-COUNT-MISSING-ONE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-064",
    "qlName": "Tropic of Cancer — eight-state count",
    "difficulty": "Medium",
    "stem": "Which numerical fact belongs to the Tropic of Cancer in India?",
    "answer": "It crosses 8 states",
    "distractors": [
      "It crosses 5 states",
      "It crosses 12 states",
      "It crosses every coastal state"
    ],
    "explanation": "The Tropic of Cancer crosses eight Indian states from west to east. The five-state figure belongs to the Standard Meridian, not the Tropic.",
    "sourceFactIds": [
      "TOC-NUMERICAL-FACT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-064",
    "qlName": "Tropic of Cancer — eight-state count",
    "difficulty": "Medium",
    "stem": "The Standard Meridian crosses five states, while the Tropic of Cancer crosses how many?",
    "answer": "Eight states",
    "distractors": [
      "Five states",
      "Six states",
      "Eleven states"
    ],
    "explanation": "The Tropic of Cancer crosses eight states, compared with five for the Standard Meridian. Keeping these two counts separate prevents a common map-based error.",
    "sourceFactIds": [
      "TOC-VS-STANDARD-COUNT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-064",
    "qlName": "Tropic of Cancer — eight-state count",
    "difficulty": "Medium",
    "stem": "Which reference line has the larger Indian state count: Tropic of Cancer or Standard Meridian?",
    "answer": "Tropic of Cancer",
    "distractors": [
      "Standard Meridian",
      "Both cross five states",
      "Both cross eight states"
    ],
    "explanation": "The Tropic of Cancer crosses eight states, while the Standard Meridian crosses five. The latitude therefore has the larger state count in India.",
    "sourceFactIds": [
      "TOC-LARGER-STATE-COUNT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-065",
    "qlName": "Tropic of Cancer — complete state set",
    "difficulty": "Easy",
    "stem": "Which state is crossed by the Tropic of Cancer?",
    "answer": "Jharkhand",
    "distractors": [
      "Bihar",
      "Odisha",
      "Uttar Pradesh"
    ],
    "explanation": "Jharkhand is one of the eight states crossed by the Tropic of Cancer. Bihar, Odisha and Uttar Pradesh are not on the Indian Tropic route.",
    "sourceFactIds": [
      "TOC-JHARKHAND"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-065",
    "qlName": "Tropic of Cancer — complete state set",
    "difficulty": "Easy",
    "stem": "Which northeastern state is crossed by the Tropic of Cancer?",
    "answer": "Tripura",
    "distractors": [
      "Assam",
      "Nagaland",
      "Manipur"
    ],
    "explanation": "Tripura is crossed by the Tropic of Cancer and forms part of the northeastern end of the Indian sequence. Mizoram is the other northeastern state on the line.",
    "sourceFactIds": [
      "TOC-TRIPURA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-065",
    "qlName": "Tropic of Cancer — complete state set",
    "difficulty": "Medium",
    "stem": "Which group contains only states crossed by the Tropic of Cancer?",
    "answer": "Gujarat, Madhya Pradesh, Jharkhand, Mizoram",
    "distractors": [
      "Gujarat, Maharashtra, Bihar, Mizoram",
      "Rajasthan, Uttar Pradesh, Odisha, Tripura",
      "Madhya Pradesh, Telangana, Bihar, West Bengal"
    ],
    "explanation": "Gujarat, Madhya Pradesh, Jharkhand and Mizoram all lie on the Tropic of Cancer. Each distractor group includes at least one state the line does not cross.",
    "sourceFactIds": [
      "TOC-VALID-GROUP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-065",
    "qlName": "Tropic of Cancer — complete state set",
    "difficulty": "Medium",
    "stem": "Which state should be added to Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal and Tripura to complete the Tropic of Cancer list?",
    "answer": "Mizoram",
    "distractors": [
      "Assam",
      "Manipur",
      "Odisha"
    ],
    "explanation": "Mizoram is the easternmost state in the Indian Tropic of Cancer sequence. Adding it completes the standard eight-state list.",
    "sourceFactIds": [
      "TOC-COMPLETE-WITH-MIZORAM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-065",
    "qlName": "Tropic of Cancer — complete state set",
    "difficulty": "Medium",
    "stem": "Which pair is crossed by the Tropic of Cancer?",
    "answer": "West Bengal and Tripura",
    "distractors": [
      "Bihar and Odisha",
      "Assam and Meghalaya",
      "Uttar Pradesh and Maharashtra"
    ],
    "explanation": "West Bengal and Tripura are both crossed by the Tropic of Cancer. The other pairs consist of states outside the line's Indian route.",
    "sourceFactIds": [
      "TOC-WB-TRIPURA-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-065",
    "qlName": "Tropic of Cancer — complete state set",
    "difficulty": "Medium",
    "stem": "Which state belongs in the Tropic of Cancer set but not in the Standard Meridian set?",
    "answer": "Jharkhand",
    "distractors": [
      "Madhya Pradesh",
      "Chhattisgarh",
      "Andhra Pradesh"
    ],
    "explanation": "Jharkhand is crossed by the Tropic of Cancer but not by the Standard Meridian. Madhya Pradesh and Chhattisgarh are crossed by both, while Andhra Pradesh is on the Standard Meridian only.",
    "sourceFactIds": [
      "TOC-NOT-STANDARD-JHARKHAND"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-066",
    "qlName": "Tropic of Cancer — west-to-east order",
    "difficulty": "Easy",
    "stem": "Which state is first on the Tropic of Cancer route when moving west to east across India?",
    "answer": "Gujarat",
    "distractors": [
      "Rajasthan",
      "Madhya Pradesh",
      "Mizoram"
    ],
    "explanation": "The Tropic of Cancer enters the Indian state sequence through Gujarat in the west. It then continues eastward through Rajasthan and the remaining states.",
    "sourceFactIds": [
      "TOC-WESTERNMOST-GUJARAT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-066",
    "qlName": "Tropic of Cancer — west-to-east order",
    "difficulty": "Easy",
    "stem": "Which state is last on the Tropic of Cancer route when moving west to east across India?",
    "answer": "Mizoram",
    "distractors": [
      "Tripura",
      "West Bengal",
      "Jharkhand"
    ],
    "explanation": "Mizoram is the easternmost state crossed by the Tropic of Cancer in India. Tripura comes immediately before it in the west-to-east sequence.",
    "sourceFactIds": [
      "TOC-EASTERNMOST-MIZORAM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-066",
    "qlName": "Tropic of Cancer — west-to-east order",
    "difficulty": "Medium",
    "stem": "Which west-to-east sequence along the Tropic of Cancer is correct?",
    "answer": "Gujarat → Rajasthan → Madhya Pradesh",
    "distractors": [
      "Rajasthan → Gujarat → Madhya Pradesh",
      "Madhya Pradesh → Gujarat → Rajasthan",
      "Gujarat → Madhya Pradesh → Rajasthan"
    ],
    "explanation": "Moving eastward, the Tropic of Cancer crosses Gujarat first, then Rajasthan, then Madhya Pradesh. That order follows their actual map positions.",
    "sourceFactIds": [
      "TOC-WEST-ORDER-1"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-066",
    "qlName": "Tropic of Cancer — west-to-east order",
    "difficulty": "Medium",
    "stem": "Which sequence correctly follows Madhya Pradesh along the Tropic of Cancer toward the east?",
    "answer": "Chhattisgarh → Jharkhand → West Bengal",
    "distractors": [
      "Jharkhand → Chhattisgarh → West Bengal",
      "West Bengal → Jharkhand → Chhattisgarh",
      "Chhattisgarh → West Bengal → Jharkhand"
    ],
    "explanation": "After Madhya Pradesh, the Tropic of Cancer crosses Chhattisgarh, then Jharkhand, then West Bengal. The sequence continues farther east into Tripura and Mizoram.",
    "sourceFactIds": [
      "TOC-MIDDLE-ORDER"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-066",
    "qlName": "Tropic of Cancer — west-to-east order",
    "difficulty": "Medium",
    "stem": "Which pair occurs in the correct west-to-east order on the Tropic of Cancer?",
    "answer": "Tripura before Mizoram",
    "distractors": [
      "Mizoram before Tripura",
      "Jharkhand before Chhattisgarh",
      "Rajasthan before Gujarat"
    ],
    "explanation": "Tripura lies west of Mizoram along the Tropic of Cancer route. The other pairs reverse the actual west-to-east ordering.",
    "sourceFactIds": [
      "TOC-ORDER-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-066",
    "qlName": "Tropic of Cancer — west-to-east order",
    "difficulty": "Hard",
    "stem": "A map labels four Tropic-of-Cancer states as A Gujarat, B Madhya Pradesh, C West Bengal and D Mizoram. Which west-to-east order is correct?",
    "answer": "A → B → C → D",
    "distractors": [
      "B → A → C → D",
      "A → C → B → D",
      "D → C → B → A"
    ],
    "explanation": "Gujarat lies farthest west, followed by Madhya Pradesh, then West Bengal and finally Mizoram. The order therefore progresses A to B to C to D.",
    "sourceFactIds": [
      "TOC-ORDER-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-067",
    "qlName": "Tropic of Cancer — crossed/not-crossed state identification",
    "difficulty": "Easy",
    "stem": "Which state is not crossed by the Tropic of Cancer?",
    "answer": "Odisha",
    "distractors": [
      "Chhattisgarh",
      "Jharkhand",
      "West Bengal"
    ],
    "explanation": "Odisha is not crossed by the Tropic of Cancer. Chhattisgarh, Jharkhand and West Bengal all lie on the line, so Odisha is the only non-member in this set.",
    "sourceFactIds": [
      "TOC-NOT-ODISHA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-067",
    "qlName": "Tropic of Cancer — crossed/not-crossed state identification",
    "difficulty": "Easy",
    "stem": "Which state is crossed by the Tropic of Cancer but not by the Standard Meridian?",
    "answer": "Rajasthan",
    "distractors": [
      "Madhya Pradesh",
      "Chhattisgarh",
      "Odisha"
    ],
    "explanation": "Rajasthan lies on the Tropic of Cancer but not on the 82°30'E Standard Meridian. Madhya Pradesh and Chhattisgarh are crossed by both lines.",
    "sourceFactIds": [
      "TOC-ONLY-RAJASTHAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-067",
    "qlName": "Tropic of Cancer — crossed/not-crossed state identification",
    "difficulty": "Medium",
    "stem": "Which state should be removed from the set Gujarat, Rajasthan, Maharashtra and Madhya Pradesh if the set is meant to contain only Tropic-of-Cancer states?",
    "answer": "Maharashtra",
    "distractors": [
      "Gujarat",
      "Rajasthan",
      "Madhya Pradesh"
    ],
    "explanation": "The Tropic of Cancer crosses Gujarat, Rajasthan and Madhya Pradesh but not Maharashtra. Maharashtra is therefore the incorrect member of the set.",
    "sourceFactIds": [
      "TOC-REMOVE-MAHARASHTRA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-067",
    "qlName": "Tropic of Cancer — crossed/not-crossed state identification",
    "difficulty": "Medium",
    "stem": "Which state lies immediately east of Chhattisgarh on the Tropic of Cancer route?",
    "answer": "Jharkhand",
    "distractors": [
      "Odisha",
      "Bihar",
      "Uttar Pradesh"
    ],
    "explanation": "The Tropic of Cancer moves from Chhattisgarh into Jharkhand as it travels eastward. Odisha, Bihar and Uttar Pradesh are outside this route.",
    "sourceFactIds": [
      "TOC-EAST-OF-CHHATTISGARH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-067",
    "qlName": "Tropic of Cancer — crossed/not-crossed state identification",
    "difficulty": "Medium",
    "stem": "Which state lies between West Bengal and Mizoram in the Tropic of Cancer sequence?",
    "answer": "Tripura",
    "distractors": [
      "Assam",
      "Meghalaya",
      "Manipur"
    ],
    "explanation": "The eastward sequence runs West Bengal, then Tripura, then Mizoram. Tripura therefore occupies the position between the other two states.",
    "sourceFactIds": [
      "TOC-BETWEEN-WB-MIZORAM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-067",
    "qlName": "Tropic of Cancer — crossed/not-crossed state identification",
    "difficulty": "Hard",
    "stem": "A state is crossed by the Tropic of Cancer, lies east of Jharkhand and west of Tripura. Which state is it?",
    "answer": "West Bengal",
    "distractors": [
      "Odisha",
      "Bihar",
      "Mizoram"
    ],
    "explanation": "West Bengal lies on the Tropic of Cancer between Jharkhand and Tripura in the west-to-east sequence. The other options do not satisfy both clues.",
    "sourceFactIds": [
      "TOC-WB-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-068",
    "qlName": "Tropic of Cancer — regional state grouping",
    "difficulty": "Easy",
    "stem": "Which two northeastern states are crossed by the Tropic of Cancer?",
    "answer": "Tripura and Mizoram",
    "distractors": [
      "Assam and Meghalaya",
      "Nagaland and Manipur",
      "Sikkim and Arunachal Pradesh"
    ],
    "explanation": "Tripura and Mizoram are the two northeastern states crossed by the Tropic of Cancer. The line does not pass through the other northeastern pairs listed.",
    "sourceFactIds": [
      "TOC-NE-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-068",
    "qlName": "Tropic of Cancer — regional state grouping",
    "difficulty": "Easy",
    "stem": "Which central Indian pair is crossed by the Tropic of Cancer?",
    "answer": "Madhya Pradesh and Chhattisgarh",
    "distractors": [
      "Maharashtra and Telangana",
      "Uttar Pradesh and Bihar",
      "Odisha and Andhra Pradesh"
    ],
    "explanation": "The Tropic of Cancer crosses both Madhya Pradesh and Chhattisgarh in central India. The other pairs are outside the line's route.",
    "sourceFactIds": [
      "TOC-CENTRAL-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-068",
    "qlName": "Tropic of Cancer — regional state grouping",
    "difficulty": "Medium",
    "stem": "Which grouping correctly links the western and northeastern ends of India's Tropic of Cancer route?",
    "answer": "Gujarat/Rajasthan — Tripura/Mizoram",
    "distractors": [
      "Maharashtra/Goa — Assam/Nagaland",
      "Punjab/Haryana — Manipur/Mizoram",
      "Gujarat/Maharashtra — Sikkim/Tripura"
    ],
    "explanation": "Gujarat and Rajasthan form the western end of the route, while Tripura and Mizoram form the northeastern end. The other groupings contain states not crossed by the line.",
    "sourceFactIds": [
      "TOC-END-REGIONS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-068",
    "qlName": "Tropic of Cancer — regional state grouping",
    "difficulty": "Medium",
    "stem": "Which eastern mainland states are crossed by the Tropic of Cancer before it reaches the Northeast?",
    "answer": "Jharkhand and West Bengal",
    "distractors": [
      "Bihar and Odisha",
      "Odisha and Andhra Pradesh",
      "Bihar and West Bengal"
    ],
    "explanation": "After Chhattisgarh, the Tropic crosses Jharkhand and West Bengal before entering Tripura and Mizoram. Bihar and Odisha are not crossed by the line.",
    "sourceFactIds": [
      "TOC-EASTERN-MAINLAND-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-068",
    "qlName": "Tropic of Cancer — regional state grouping",
    "difficulty": "Medium",
    "stem": "Which set represents the central-to-eastern part of the Tropic of Cancer route?",
    "answer": "Chhattisgarh → Jharkhand → West Bengal",
    "distractors": [
      "Odisha → Bihar → West Bengal",
      "Maharashtra → Chhattisgarh → Odisha",
      "Jharkhand → Bihar → Tripura"
    ],
    "explanation": "The Tropic moves eastward through Chhattisgarh, Jharkhand and West Bengal in that order. The distractors insert states that the line does not cross.",
    "sourceFactIds": [
      "TOC-CENTRAL-EAST-SET"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-068",
    "qlName": "Tropic of Cancer — regional state grouping",
    "difficulty": "Hard",
    "stem": "A Tropic-of-Cancer state belongs to the Northeast but is west of Mizoram. Which state fits the clue?",
    "answer": "Tripura",
    "distractors": [
      "Assam",
      "Manipur",
      "Nagaland"
    ],
    "explanation": "Tripura and Mizoram are the two northeastern states on the Tropic. Tripura lies west of Mizoram, so it fits both parts of the clue.",
    "sourceFactIds": [
      "TOC-TRIPURA-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-069",
    "qlName": "Standard Meridian — five-state set",
    "difficulty": "Easy",
    "stem": "How many Indian states are crossed by the Standard Meridian at 82°30'E?",
    "answer": "Five",
    "distractors": [
      "Four",
      "Eight",
      "Ten"
    ],
    "explanation": "India's Standard Meridian at 82°30'E crosses five states. They are Uttar Pradesh, Madhya Pradesh, Chhattisgarh, Odisha and Andhra Pradesh.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-FIVE-STATES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-069",
    "qlName": "Standard Meridian — five-state set",
    "difficulty": "Easy",
    "stem": "Which state is crossed by India's Standard Meridian?",
    "answer": "Odisha",
    "distractors": [
      "Rajasthan",
      "Jharkhand",
      "Gujarat"
    ],
    "explanation": "Odisha lies on the 82°30'E Standard Meridian. Rajasthan, Jharkhand and Gujarat are not crossed by this longitude, making Odisha the correct state-map match.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-ODISHA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-069",
    "qlName": "Standard Meridian — five-state set",
    "difficulty": "Medium",
    "stem": "Which group contains only states crossed by India's Standard Meridian?",
    "answer": "Uttar Pradesh, Madhya Pradesh, Chhattisgarh, Odisha",
    "distractors": [
      "Rajasthan, Madhya Pradesh, Jharkhand, Odisha",
      "Uttar Pradesh, Bihar, Odisha, Andhra Pradesh",
      "Madhya Pradesh, Maharashtra, Chhattisgarh, Andhra Pradesh"
    ],
    "explanation": "The Standard Meridian crosses Uttar Pradesh, Madhya Pradesh, Chhattisgarh, Odisha and Andhra Pradesh. The correct option contains only members of this five-state set.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-VALID-GROUP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-069",
    "qlName": "Standard Meridian — five-state set",
    "difficulty": "Medium",
    "stem": "Which state completes the sequence Uttar Pradesh, Madhya Pradesh, Chhattisgarh, Odisha, ___ for the Standard Meridian?",
    "answer": "Andhra Pradesh",
    "distractors": [
      "Telangana",
      "Tamil Nadu",
      "Jharkhand"
    ],
    "explanation": "Andhra Pradesh is the southernmost state crossed by the Standard Meridian in the standard five-state sequence. It follows Odisha when moving south.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-COMPLETE-AP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-069",
    "qlName": "Standard Meridian — five-state set",
    "difficulty": "Medium",
    "stem": "Which pair is crossed by the Standard Meridian?",
    "answer": "Odisha and Andhra Pradesh",
    "distractors": [
      "Jharkhand and West Bengal",
      "Rajasthan and Gujarat",
      "Bihar and Telangana"
    ],
    "explanation": "Both Odisha and Andhra Pradesh lie on 82°30'E. The other pairs are outside the Standard Meridian's five-state route.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-ODISHA-AP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-069",
    "qlName": "Standard Meridian — five-state set",
    "difficulty": "Hard",
    "stem": "A line passes through Mirzapur and continues south through Madhya Pradesh, Chhattisgarh, Odisha and Andhra Pradesh. Which line is it?",
    "answer": "India's Standard Meridian",
    "distractors": [
      "Tropic of Cancer",
      "Equator",
      "Tropic of Capricorn"
    ],
    "explanation": "Mirzapur and the five-state north-to-south route identify the 82°30'E Standard Meridian. The Tropic of Cancer follows a different east-west state sequence.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-ROUTE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-070",
    "qlName": "Standard Meridian — north-to-south state order",
    "difficulty": "Easy",
    "stem": "Which state is first on the Standard Meridian route when moving north to south?",
    "answer": "Uttar Pradesh",
    "distractors": [
      "Madhya Pradesh",
      "Odisha",
      "Andhra Pradesh"
    ],
    "explanation": "The Standard Meridian crosses Uttar Pradesh first in the north. It then continues south through Madhya Pradesh and the remaining states.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-NORTH-UP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-070",
    "qlName": "Standard Meridian — north-to-south state order",
    "difficulty": "Easy",
    "stem": "Which state is last on the Standard Meridian route when moving north to south?",
    "answer": "Andhra Pradesh",
    "distractors": [
      "Odisha",
      "Chhattisgarh",
      "Madhya Pradesh"
    ],
    "explanation": "Andhra Pradesh is the southernmost state in the Standard Meridian's five-state route. Odisha lies immediately to its north in the sequence.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-SOUTH-AP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-070",
    "qlName": "Standard Meridian — north-to-south state order",
    "difficulty": "Medium",
    "stem": "Which north-to-south sequence along the Standard Meridian is correct?",
    "answer": "Uttar Pradesh → Madhya Pradesh → Chhattisgarh",
    "distractors": [
      "Madhya Pradesh → Uttar Pradesh → Chhattisgarh",
      "Uttar Pradesh → Chhattisgarh → Madhya Pradesh",
      "Chhattisgarh → Madhya Pradesh → Uttar Pradesh"
    ],
    "explanation": "Moving south along 82°30'E, the line crosses Uttar Pradesh, then Madhya Pradesh, then Chhattisgarh. Odisha and Andhra Pradesh follow farther south.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-NORTH-ORDER"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-070",
    "qlName": "Standard Meridian — north-to-south state order",
    "difficulty": "Medium",
    "stem": "Which state comes immediately after Chhattisgarh when following the Standard Meridian southward?",
    "answer": "Odisha",
    "distractors": [
      "Jharkhand",
      "Telangana",
      "Bihar"
    ],
    "explanation": "The Standard Meridian moves from Chhattisgarh into Odisha before reaching Andhra Pradesh. Jharkhand, Telangana and Bihar are not on the line.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-AFTER-CG"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-070",
    "qlName": "Standard Meridian — north-to-south state order",
    "difficulty": "Medium",
    "stem": "Which pair appears in the correct north-to-south order on the Standard Meridian?",
    "answer": "Odisha before Andhra Pradesh",
    "distractors": [
      "Andhra Pradesh before Odisha",
      "Chhattisgarh before Madhya Pradesh",
      "Madhya Pradesh before Uttar Pradesh"
    ],
    "explanation": "Odisha lies north of Andhra Pradesh along the Standard Meridian. The other options reverse the actual order of their state pairs.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-ORDER-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-070",
    "qlName": "Standard Meridian — north-to-south state order",
    "difficulty": "Hard",
    "stem": "States A, B and C lie on the Standard Meridian. A is Uttar Pradesh, B is Chhattisgarh and C is Andhra Pradesh. Which north-to-south order is correct?",
    "answer": "A → B → C",
    "distractors": [
      "B → A → C",
      "C → B → A",
      "A → C → B"
    ],
    "explanation": "Uttar Pradesh lies north of Chhattisgarh, and Andhra Pradesh lies farther south. The correct north-to-south order is therefore A, then B, then C.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-ABC-ORDER"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-071",
    "qlName": "Standard Meridian — crossed/not-crossed state identification",
    "difficulty": "Easy",
    "stem": "Which state is not crossed by India's Standard Meridian?",
    "answer": "Jharkhand",
    "distractors": [
      "Madhya Pradesh",
      "Chhattisgarh",
      "Odisha"
    ],
    "explanation": "Jharkhand is not crossed by the 82°30'E Standard Meridian. Madhya Pradesh, Chhattisgarh and Odisha are all on the line.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-NOT-JHARKHAND"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-071",
    "qlName": "Standard Meridian — crossed/not-crossed state identification",
    "difficulty": "Easy",
    "stem": "Which state is crossed by the Standard Meridian but not by the Tropic of Cancer?",
    "answer": "Odisha",
    "distractors": [
      "Madhya Pradesh",
      "Chhattisgarh",
      "Rajasthan"
    ],
    "explanation": "Odisha lies on the Standard Meridian but not on the Tropic of Cancer. Madhya Pradesh and Chhattisgarh are crossed by both lines.",
    "sourceFactIds": [
      "STANDARD-ONLY-ODISHA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-071",
    "qlName": "Standard Meridian — crossed/not-crossed state identification",
    "difficulty": "Medium",
    "stem": "Which state should be removed from Uttar Pradesh, Madhya Pradesh, Bihar and Odisha if the list is meant to contain only Standard Meridian states?",
    "answer": "Bihar",
    "distractors": [
      "Uttar Pradesh",
      "Madhya Pradesh",
      "Odisha"
    ],
    "explanation": "Bihar is not crossed by India's Standard Meridian. Uttar Pradesh, Madhya Pradesh and Odisha are all part of the five-state route.",
    "sourceFactIds": [
      "STANDARD-REMOVE-BIHAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-071",
    "qlName": "Standard Meridian — crossed/not-crossed state identification",
    "difficulty": "Medium",
    "stem": "Which state lies between Madhya Pradesh and Odisha on the Standard Meridian route?",
    "answer": "Chhattisgarh",
    "distractors": [
      "Jharkhand",
      "Bihar",
      "Telangana"
    ],
    "explanation": "The north-to-south sequence is Madhya Pradesh, Chhattisgarh, Odisha. Chhattisgarh therefore occupies the position between the other two.",
    "sourceFactIds": [
      "STANDARD-BETWEEN-MP-ODISHA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-071",
    "qlName": "Standard Meridian — crossed/not-crossed state identification",
    "difficulty": "Medium",
    "stem": "Which southern state is crossed by the Standard Meridian?",
    "answer": "Andhra Pradesh",
    "distractors": [
      "Tamil Nadu",
      "Karnataka",
      "Kerala"
    ],
    "explanation": "Andhra Pradesh is the southernmost state crossed by India's Standard Meridian. Tamil Nadu, Karnataka and Kerala lie outside 82°30'E.",
    "sourceFactIds": [
      "STANDARD-SOUTHERN-AP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-071",
    "qlName": "Standard Meridian — crossed/not-crossed state identification",
    "difficulty": "Hard",
    "stem": "A state lies south of Odisha on the Standard Meridian but is not crossed by the Tropic of Cancer. Which state is it?",
    "answer": "Andhra Pradesh",
    "distractors": [
      "Chhattisgarh",
      "Jharkhand",
      "West Bengal"
    ],
    "explanation": "Andhra Pradesh lies immediately south of Odisha on 82°30'E and is not crossed by the Tropic of Cancer. The clues therefore identify Andhra Pradesh.",
    "sourceFactIds": [
      "STANDARD-AP-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-072",
    "qlName": "States crossed by both reference lines",
    "difficulty": "Easy",
    "stem": "Which state is crossed by both the Tropic of Cancer and India's Standard Meridian?",
    "answer": "Madhya Pradesh",
    "distractors": [
      "Rajasthan",
      "Odisha",
      "Jharkhand"
    ],
    "explanation": "Madhya Pradesh lies on both the Tropic of Cancer and the 82°30'E Standard Meridian. Rajasthan is Tropic-only, while Odisha is Standard-Meridian-only.",
    "sourceFactIds": [
      "BOTH-LINES-MP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-072",
    "qlName": "States crossed by both reference lines",
    "difficulty": "Easy",
    "stem": "Which pair of states is crossed by both the Tropic of Cancer and the Standard Meridian?",
    "answer": "Madhya Pradesh and Chhattisgarh",
    "distractors": [
      "Rajasthan and Gujarat",
      "Odisha and Andhra Pradesh",
      "Jharkhand and West Bengal"
    ],
    "explanation": "Madhya Pradesh and Chhattisgarh are the two states common to both reference-line routes. The other pairs belong to only one of the two lines.",
    "sourceFactIds": [
      "BOTH-LINES-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-072",
    "qlName": "States crossed by both reference lines",
    "difficulty": "Medium",
    "stem": "Which state is common to both reference lines and lies east of Madhya Pradesh?",
    "answer": "Chhattisgarh",
    "distractors": [
      "Jharkhand",
      "Odisha",
      "Rajasthan"
    ],
    "explanation": "Chhattisgarh is crossed by both the Tropic of Cancer and the Standard Meridian and lies east of Madhya Pradesh. Jharkhand and Odisha belong to only one line each.",
    "sourceFactIds": [
      "BOTH-LINES-CG"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-072",
    "qlName": "States crossed by both reference lines",
    "difficulty": "Medium",
    "stem": "Which comparison is accurate?",
    "answer": "Madhya Pradesh and Chhattisgarh are common to both lines",
    "distractors": [
      "Odisha and Andhra Pradesh are common to both lines",
      "Gujarat and Rajasthan are common to both lines",
      "Jharkhand and West Bengal are common to both lines"
    ],
    "explanation": "The overlap between the Tropic of Cancer route and the Standard Meridian route consists of Madhya Pradesh and Chhattisgarh. The other pairs are not shared by both.",
    "sourceFactIds": [
      "BOTH-LINES-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-072",
    "qlName": "States crossed by both reference lines",
    "difficulty": "Medium",
    "stem": "A state is crossed by the Tropic of Cancer and also by 82°30'E. Which option can satisfy both clues?",
    "answer": "Chhattisgarh",
    "distractors": [
      "Tripura",
      "Odisha",
      "Uttar Pradesh"
    ],
    "explanation": "Chhattisgarh lies on both reference lines. Tripura lies only on the Tropic, while Odisha and Uttar Pradesh lie only on the Standard Meridian.",
    "sourceFactIds": [
      "BOTH-LINES-CLUE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-072",
    "qlName": "States crossed by both reference lines",
    "difficulty": "Medium",
    "stem": "Which set correctly separates shared and line-specific states?",
    "answer": "Shared: Madhya Pradesh, Chhattisgarh; Tropic-only: Rajasthan; Meridian-only: Odisha",
    "distractors": [
      "Shared: Rajasthan, Odisha; Tropic-only: Madhya Pradesh; Meridian-only: Chhattisgarh",
      "Shared: Jharkhand, Odisha; Tropic-only: Uttar Pradesh; Meridian-only: Gujarat",
      "Shared: Andhra Pradesh, Mizoram; Tropic-only: Odisha; Meridian-only: Tripura"
    ],
    "explanation": "Madhya Pradesh and Chhattisgarh are shared by both lines. Rajasthan is Tropic-only in this comparison, while Odisha is Standard-Meridian-only.",
    "sourceFactIds": [
      "BOTH-LINES-SET-SEPARATION"
    ]
  }
]);

export const GEO_LOC_001_CP008_REVIEW_BATCH_V1: readonly GeoLoc001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-LOC-001-CP008-Q${String(index + 1).padStart(3, "0")}`,
      qlId: raw.qlId,
      qlName: raw.qlName,
      difficulty: raw.difficulty,
      stem: raw.stem,
      options: placeGeoLocOptions(raw.answer, raw.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: raw.answer,
      explanation: raw.explanation,
      sourceIds: CP008_SOURCE_IDS,
      sourceFactIds: Object.freeze([...raw.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED = /associated with|best describes|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|given in NCERT|\bNCERT\b|\btextbook\b|stated mainland|which pair correctly|which statement correctly|which option gives|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR = /currency|literacy rate|stock market|crop price|movie|sports team|bank rate|tax slab/i;

export function auditGeoLoc001Cp008ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_LOC_001_CP008_REVIEW_BATCH_V1) {
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

  if (GEO_LOC_001_CP008_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_LOC_001_CP008_REVIEW_BATCH_V1.length);
  for (let n = 64; n <= 72; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_LOC_001_CP008_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
