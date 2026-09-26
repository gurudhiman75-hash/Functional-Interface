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

const CP009_SOURCE_IDS = Object.freeze([
  ...GEO_LOC_001_SOURCE_IDS,
  "MHA-BORDER-MANAGEMENT-I-CURRENT",
  "ICG-COASTAL-ORGANISATION-CURRENT",
] as const);

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-LOC-001-QL-073",
    "qlName": "Coastal states — full nine-state set",
    "difficulty": "Easy",
    "stem": "How many Indian states have a coastline?",
    "answer": "Nine",
    "distractors": [
      "Seven",
      "Eight",
      "Ten"
    ],
    "explanation": "India has nine coastal states on the mainland. They stretch from Gujarat on the western side to West Bengal on the eastern side.",
    "sourceFactIds": [
      "COASTAL-STATES-COUNT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-073",
    "qlName": "Coastal states — full nine-state set",
    "difficulty": "Easy",
    "stem": "Which state is part of India's coastal-state set?",
    "answer": "Karnataka",
    "distractors": [
      "Madhya Pradesh",
      "Jharkhand",
      "Haryana"
    ],
    "explanation": "Karnataka has an Arabian Sea coastline and is one of India's nine coastal states. The other options are inland states without a sea coast.",
    "sourceFactIds": [
      "COASTAL-STATE-KARNATAKA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-073",
    "qlName": "Coastal states — full nine-state set",
    "difficulty": "Medium",
    "stem": "Which group contains only coastal states of India?",
    "answer": "Gujarat, Goa, Kerala, Odisha",
    "distractors": [
      "Gujarat, Madhya Pradesh, Kerala, Odisha",
      "Goa, Karnataka, Telangana, Tamil Nadu",
      "Maharashtra, Chhattisgarh, Odisha, West Bengal"
    ],
    "explanation": "Gujarat, Goa, Kerala and Odisha all have sea coasts. Each distractor group includes at least one inland state, so only this set is entirely coastal.",
    "sourceFactIds": [
      "COASTAL-STATES-VALID-GROUP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-073",
    "qlName": "Coastal states — full nine-state set",
    "difficulty": "Medium",
    "stem": "Which state should be removed from Gujarat, Maharashtra, Goa, Karnataka and Telangana to leave only coastal states?",
    "answer": "Telangana",
    "distractors": [
      "Gujarat",
      "Goa",
      "Karnataka"
    ],
    "explanation": "Telangana is landlocked, while Gujarat, Maharashtra, Goa and Karnataka all touch the sea. Removing Telangana leaves a valid coastal-state group.",
    "sourceFactIds": [
      "COASTAL-STATES-REMOVE-TELANGANA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-073",
    "qlName": "Coastal states — full nine-state set",
    "difficulty": "Medium",
    "stem": "Which pair contains one coastal state and one inland state?",
    "answer": "Odisha and Chhattisgarh",
    "distractors": [
      "Kerala and Karnataka",
      "Gujarat and Maharashtra",
      "Tamil Nadu and Andhra Pradesh"
    ],
    "explanation": "Odisha has a Bay of Bengal coastline, while Chhattisgarh is inland. The other pairs consist entirely of coastal states.",
    "sourceFactIds": [
      "COASTAL-INLAND-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-073",
    "qlName": "Coastal states — full nine-state set",
    "difficulty": "Medium",
    "stem": "Which state completes this coastal sequence: Gujarat, Maharashtra, Goa, Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Odisha, ___?",
    "answer": "West Bengal",
    "distractors": [
      "Bihar",
      "Jharkhand",
      "Assam"
    ],
    "explanation": "West Bengal completes the standard nine-state coastal list. Its southern edge reaches the Bay of Bengal, unlike Bihar, Jharkhand and Assam.",
    "sourceFactIds": [
      "COASTAL-STATES-COMPLETE-WB"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-074",
    "qlName": "Western seaboard state/UT map relations",
    "difficulty": "Easy",
    "stem": "Which state lies on India's western seaboard?",
    "answer": "Goa",
    "distractors": [
      "Odisha",
      "West Bengal",
      "Andhra Pradesh"
    ],
    "explanation": "Goa lies on the Arabian Sea side of India and belongs to the western seaboard. The other options belong to the eastern seaboard.",
    "sourceFactIds": [
      "WEST-SEABOARD-GOA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-074",
    "qlName": "Western seaboard state/UT map relations",
    "difficulty": "Easy",
    "stem": "Which island Union Territory belongs to India's western maritime side?",
    "answer": "Lakshadweep",
    "distractors": [
      "Andaman and Nicobar Islands",
      "Puducherry",
      "Chandigarh"
    ],
    "explanation": "Lakshadweep lies in the Arabian Sea west of the peninsula. Andaman and Nicobar lies on India's eastern maritime side.",
    "sourceFactIds": [
      "WEST-SEABOARD-LAKSHADWEEP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-074",
    "qlName": "Western seaboard state/UT map relations",
    "difficulty": "Medium",
    "stem": "Which north-to-south order follows India's western coastal states?",
    "answer": "Gujarat → Maharashtra → Goa → Karnataka → Kerala",
    "distractors": [
      "Maharashtra → Gujarat → Goa → Kerala → Karnataka",
      "Gujarat → Goa → Maharashtra → Karnataka → Kerala",
      "Kerala → Karnataka → Goa → Maharashtra → Gujarat"
    ],
    "explanation": "From north to south, the western coastal states are Gujarat, Maharashtra, Goa, Karnataka and Kerala. The sequence follows the Arabian Sea coast.",
    "sourceFactIds": [
      "WEST-SEABOARD-NORTH-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-074",
    "qlName": "Western seaboard state/UT map relations",
    "difficulty": "Medium",
    "stem": "Which Union Territory contributes a mainland western coastline through Daman and Diu?",
    "answer": "Dadra and Nagar Haveli and Daman and Diu",
    "distractors": [
      "Puducherry",
      "Chandigarh",
      "Delhi"
    ],
    "explanation": "The Union Territory includes coastal Daman and Diu on India's western side. Dadra and Nagar Haveli itself is inland, but the combined Union Territory has a coastline.",
    "sourceFactIds": [
      "WEST-COAST-DNHDD"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-074",
    "qlName": "Western seaboard state/UT map relations",
    "difficulty": "Medium",
    "stem": "Which state lies between Goa and Kerala along the western coast?",
    "answer": "Karnataka",
    "distractors": [
      "Tamil Nadu",
      "Maharashtra",
      "Andhra Pradesh"
    ],
    "explanation": "Karnataka lies immediately south of Goa and north of Kerala on the western seaboard. This position places it between the two along the Arabian Sea coast.",
    "sourceFactIds": [
      "WEST-COAST-BETWEEN-GOA-KERALA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-074",
    "qlName": "Western seaboard state/UT map relations",
    "difficulty": "Medium",
    "stem": "A coastal route moves south from Maharashtra and reaches Kerala after crossing two states. Which two states are crossed?",
    "answer": "Goa and Karnataka",
    "distractors": [
      "Gujarat and Goa",
      "Karnataka and Tamil Nadu",
      "Goa and Tamil Nadu"
    ],
    "explanation": "South of Maharashtra the western coastal order is Goa, then Karnataka, then Kerala. The two states crossed before reaching Kerala are therefore Goa and Karnataka.",
    "sourceFactIds": [
      "WEST-COAST-ROUTE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-075",
    "qlName": "Eastern seaboard state/UT map relations",
    "difficulty": "Easy",
    "stem": "Which state lies on India's eastern seaboard?",
    "answer": "Odisha",
    "distractors": [
      "Gujarat",
      "Goa",
      "Kerala"
    ],
    "explanation": "Odisha has a Bay of Bengal coastline and belongs to India's eastern seaboard. The other options are western coastal states.",
    "sourceFactIds": [
      "EAST-SEABOARD-ODISHA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-075",
    "qlName": "Eastern seaboard state/UT map relations",
    "difficulty": "Easy",
    "stem": "Which Union Territory has enclaves on India's southeastern coast?",
    "answer": "Puducherry",
    "distractors": [
      "Lakshadweep",
      "Chandigarh",
      "Ladakh"
    ],
    "explanation": "Puducherry includes coastal enclaves on the southeastern side of India. Lakshadweep is an island territory in the Arabian Sea.",
    "sourceFactIds": [
      "EAST-SEABOARD-PUDUCHERRY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-075",
    "qlName": "Eastern seaboard state/UT map relations",
    "difficulty": "Medium",
    "stem": "Which north-to-south sequence follows India's main eastern coastal states?",
    "answer": "West Bengal → Odisha → Andhra Pradesh → Tamil Nadu",
    "distractors": [
      "Odisha → West Bengal → Tamil Nadu → Andhra Pradesh",
      "West Bengal → Andhra Pradesh → Odisha → Tamil Nadu",
      "Tamil Nadu → Andhra Pradesh → Odisha → West Bengal"
    ],
    "explanation": "Moving south along the eastern seaboard gives West Bengal, Odisha, Andhra Pradesh and Tamil Nadu. The sequence follows the Bay of Bengal side of India.",
    "sourceFactIds": [
      "EAST-SEABOARD-NORTH-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-075",
    "qlName": "Eastern seaboard state/UT map relations",
    "difficulty": "Medium",
    "stem": "Which island Union Territory belongs to India's eastern maritime side?",
    "answer": "Andaman and Nicobar Islands",
    "distractors": [
      "Lakshadweep",
      "Dadra and Nagar Haveli and Daman and Diu",
      "Chandigarh"
    ],
    "explanation": "Andaman and Nicobar Islands lies southeast of the mainland on India's eastern maritime side. Lakshadweep lies in the Arabian Sea to the west.",
    "sourceFactIds": [
      "EAST-SEABOARD-AN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-075",
    "qlName": "Eastern seaboard state/UT map relations",
    "difficulty": "Medium",
    "stem": "Which state lies between Odisha and Tamil Nadu along the eastern coastal sequence?",
    "answer": "Andhra Pradesh",
    "distractors": [
      "Telangana",
      "Karnataka",
      "West Bengal"
    ],
    "explanation": "Andhra Pradesh lies south of Odisha and north of Tamil Nadu on India's eastern coast. Telangana is inland and does not form part of the coastal sequence.",
    "sourceFactIds": [
      "EAST-COAST-BETWEEN-ODISHA-TN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-075",
    "qlName": "Eastern seaboard state/UT map relations",
    "difficulty": "Medium",
    "stem": "A coastal route moves south from West Bengal and reaches Tamil Nadu after crossing two coastal states. Which states are crossed?",
    "answer": "Odisha and Andhra Pradesh",
    "distractors": [
      "Bihar and Odisha",
      "Odisha and Telangana",
      "Andhra Pradesh and Karnataka"
    ],
    "explanation": "The east-coast order south of West Bengal is Odisha, then Andhra Pradesh, then Tamil Nadu. The route therefore crosses Odisha and Andhra Pradesh.",
    "sourceFactIds": [
      "EAST-COAST-ROUTE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-076",
    "qlName": "States touching more than one foreign country",
    "difficulty": "Easy",
    "stem": "Which Indian state borders both Bangladesh and Myanmar?",
    "answer": "Mizoram",
    "distractors": [
      "Tripura",
      "Manipur",
      "Meghalaya"
    ],
    "explanation": "Mizoram shares international borders with Bangladesh to the west and Myanmar to the east and south. The other options do not border both countries.",
    "sourceFactIds": [
      "MULTI-BORDER-MIZORAM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-076",
    "qlName": "States touching more than one foreign country",
    "difficulty": "Easy",
    "stem": "Which state borders Nepal, Bhutan and Bangladesh?",
    "answer": "West Bengal",
    "distractors": [
      "Bihar",
      "Assam",
      "Sikkim"
    ],
    "explanation": "West Bengal touches Nepal and Bhutan in the north and Bangladesh along a long eastern frontier. This gives it borders with all three countries.",
    "sourceFactIds": [
      "MULTI-BORDER-WEST-BENGAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-076",
    "qlName": "States touching more than one foreign country",
    "difficulty": "Medium",
    "stem": "Which state borders China, Bhutan and Myanmar?",
    "answer": "Arunachal Pradesh",
    "distractors": [
      "Sikkim",
      "Nagaland",
      "Assam"
    ],
    "explanation": "Arunachal Pradesh touches China to the north, Bhutan to the west and Myanmar to the east. No other option shares this three-country combination.",
    "sourceFactIds": [
      "MULTI-BORDER-ARUNACHAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-076",
    "qlName": "States touching more than one foreign country",
    "difficulty": "Medium",
    "stem": "Which state borders China, Nepal and Bhutan?",
    "answer": "Sikkim",
    "distractors": [
      "Uttarakhand",
      "West Bengal",
      "Assam"
    ],
    "explanation": "Sikkim lies between Nepal and Bhutan and also borders China to the north. This compact position gives it three international neighbours.",
    "sourceFactIds": [
      "MULTI-BORDER-SIKKIM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-076",
    "qlName": "States touching more than one foreign country",
    "difficulty": "Medium",
    "stem": "Which state is common to both the Bangladesh-border and Bhutan-border lists?",
    "answer": "Assam",
    "distractors": [
      "Tripura",
      "Mizoram",
      "Manipur"
    ],
    "explanation": "Assam borders Bangladesh and Bhutan. Tripura and Mizoram border Bangladesh but not Bhutan, while Manipur borders Myanmar.",
    "sourceFactIds": [
      "MULTI-BORDER-ASSAM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-076",
    "qlName": "States touching more than one foreign country",
    "difficulty": "Hard",
    "stem": "State X borders Nepal and Bhutan, while also touching Bangladesh. It does not border Myanmar. Which state is X?",
    "answer": "West Bengal",
    "distractors": [
      "Sikkim",
      "Assam",
      "Mizoram"
    ],
    "explanation": "West Bengal borders Nepal, Bhutan and Bangladesh but not Myanmar. Sikkim lacks a Bangladesh border, while Assam does not border Nepal.",
    "sourceFactIds": [
      "MULTI-BORDER-WB-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-077",
    "qlName": "Bangladesh-border states",
    "difficulty": "Easy",
    "stem": "Which Indian state shares a border with Bangladesh?",
    "answer": "Tripura",
    "distractors": [
      "Nagaland",
      "Sikkim",
      "Uttarakhand"
    ],
    "explanation": "Tripura shares a long international boundary with Bangladesh. Nagaland borders Myanmar, while Sikkim and Uttarakhand lie on India's northern frontier.",
    "sourceFactIds": [
      "BANGLADESH-BORDER-TRIPURA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-077",
    "qlName": "Bangladesh-border states",
    "difficulty": "Easy",
    "stem": "How many Indian states are listed along the Bangladesh border?",
    "answer": "Five",
    "distractors": [
      "Three",
      "Four",
      "Six"
    ],
    "explanation": "Five states border Bangladesh: West Bengal, Assam, Meghalaya, Tripura and Mizoram. They form India's eastern and northeastern Bangladesh frontier.",
    "sourceFactIds": [
      "BANGLADESH-BORDER-COUNT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-077",
    "qlName": "Bangladesh-border states",
    "difficulty": "Medium",
    "stem": "Which group contains only Bangladesh-border states?",
    "answer": "West Bengal, Assam, Meghalaya, Tripura",
    "distractors": [
      "West Bengal, Sikkim, Meghalaya, Tripura",
      "Assam, Nagaland, Tripura, Mizoram",
      "Meghalaya, Manipur, Tripura, West Bengal"
    ],
    "explanation": "West Bengal, Assam, Meghalaya and Tripura all border Bangladesh. The distractor groups include Sikkim, Nagaland or Manipur, which do not.",
    "sourceFactIds": [
      "BANGLADESH-BORDER-VALID-GROUP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-077",
    "qlName": "Bangladesh-border states",
    "difficulty": "Medium",
    "stem": "Which state completes the Bangladesh-border set: West Bengal, Assam, Meghalaya, Tripura and ___?",
    "answer": "Mizoram",
    "distractors": [
      "Nagaland",
      "Manipur",
      "Sikkim"
    ],
    "explanation": "Mizoram is the fifth Indian state bordering Bangladesh. It also borders Myanmar, giving it a two-country international frontier.",
    "sourceFactIds": [
      "BANGLADESH-BORDER-COMPLETE-MIZORAM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-077",
    "qlName": "Bangladesh-border states",
    "difficulty": "Medium",
    "stem": "Which Bangladesh-border state also shares a border with Myanmar?",
    "answer": "Mizoram",
    "distractors": [
      "Meghalaya",
      "Tripura",
      "West Bengal"
    ],
    "explanation": "Mizoram is the only option that borders both Bangladesh and Myanmar. Meghalaya, Tripura and West Bengal do not share a Myanmar frontier.",
    "sourceFactIds": [
      "BANGLADESH-MYANMAR-OVERLAP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-077",
    "qlName": "Bangladesh-border states",
    "difficulty": "Hard",
    "stem": "A state borders Bangladesh and Bhutan but not Nepal. Which option fits?",
    "answer": "Assam",
    "distractors": [
      "West Bengal",
      "Sikkim",
      "Tripura"
    ],
    "explanation": "Assam borders Bangladesh and Bhutan but does not border Nepal. West Bengal borders all three, while Sikkim lacks a Bangladesh border.",
    "sourceFactIds": [
      "BANGLADESH-BHUTAN-ASSAM-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-078",
    "qlName": "Myanmar-border states",
    "difficulty": "Easy",
    "stem": "Which Indian state shares a border with Myanmar?",
    "answer": "Manipur",
    "distractors": [
      "Meghalaya",
      "Tripura",
      "Sikkim"
    ],
    "explanation": "Manipur lies on India's eastern international frontier with Myanmar. Meghalaya and Tripura border Bangladesh, while Sikkim lies farther north.",
    "sourceFactIds": [
      "MYANMAR-BORDER-MANIPUR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-078",
    "qlName": "Myanmar-border states",
    "difficulty": "Easy",
    "stem": "How many Indian states border Myanmar?",
    "answer": "Four",
    "distractors": [
      "Three",
      "Five",
      "Six"
    ],
    "explanation": "Four states border Myanmar: Arunachal Pradesh, Nagaland, Manipur and Mizoram. They form a north-to-south chain along India's far eastern frontier.",
    "sourceFactIds": [
      "MYANMAR-BORDER-COUNT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-078",
    "qlName": "Myanmar-border states",
    "difficulty": "Medium",
    "stem": "Which group contains only Myanmar-border states?",
    "answer": "Arunachal Pradesh, Nagaland, Manipur, Mizoram",
    "distractors": [
      "Assam, Nagaland, Manipur, Mizoram",
      "Arunachal Pradesh, Meghalaya, Manipur, Mizoram",
      "Nagaland, Tripura, Manipur, Mizoram"
    ],
    "explanation": "Arunachal Pradesh, Nagaland, Manipur and Mizoram are the four Myanmar-border states. Assam, Meghalaya and Tripura do not share this border.",
    "sourceFactIds": [
      "MYANMAR-BORDER-FULL-SET"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-078",
    "qlName": "Myanmar-border states",
    "difficulty": "Medium",
    "stem": "Which Myanmar-border state also borders China and Bhutan?",
    "answer": "Arunachal Pradesh",
    "distractors": [
      "Nagaland",
      "Manipur",
      "Mizoram"
    ],
    "explanation": "Arunachal Pradesh borders Myanmar, China and Bhutan. The other Myanmar-border states do not share the same northern international neighbours.",
    "sourceFactIds": [
      "MYANMAR-CHINA-BHUTAN-ARUNACHAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-078",
    "qlName": "Myanmar-border states",
    "difficulty": "Medium",
    "stem": "Which Myanmar-border state also borders Bangladesh?",
    "answer": "Mizoram",
    "distractors": [
      "Nagaland",
      "Manipur",
      "Arunachal Pradesh"
    ],
    "explanation": "Mizoram borders both Myanmar and Bangladesh. Nagaland and Manipur border Myanmar only among foreign countries, while Arunachal also borders China and Bhutan.",
    "sourceFactIds": [
      "MYANMAR-BANGLADESH-MIZORAM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-078",
    "qlName": "Myanmar-border states",
    "difficulty": "Hard",
    "stem": "Moving south along India's Myanmar frontier, which order is correct?",
    "answer": "Arunachal Pradesh → Nagaland → Manipur → Mizoram",
    "distractors": [
      "Nagaland → Arunachal Pradesh → Mizoram → Manipur",
      "Arunachal Pradesh → Manipur → Nagaland → Mizoram",
      "Mizoram → Manipur → Nagaland → Arunachal Pradesh"
    ],
    "explanation": "From north to south, the Myanmar-border states are Arunachal Pradesh, Nagaland, Manipur and Mizoram. The order follows India's far eastern edge.",
    "sourceFactIds": [
      "MYANMAR-BORDER-NORTH-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-079",
    "qlName": "Nepal-border states",
    "difficulty": "Easy",
    "stem": "Which Indian state shares a border with Nepal?",
    "answer": "Bihar",
    "distractors": [
      "Odisha",
      "Assam",
      "Haryana"
    ],
    "explanation": "Bihar shares an international boundary with Nepal along its northern side. Odisha, Assam and Haryana do not border Nepal.",
    "sourceFactIds": [
      "NEPAL-BORDER-BIHAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-079",
    "qlName": "Nepal-border states",
    "difficulty": "Easy",
    "stem": "How many Indian states border Nepal?",
    "answer": "Five",
    "distractors": [
      "Three",
      "Four",
      "Six"
    ],
    "explanation": "Five states border Nepal: Uttarakhand, Uttar Pradesh, Bihar, West Bengal and Sikkim. They extend from the western Himalayas to the eastern Himalayan region.",
    "sourceFactIds": [
      "NEPAL-BORDER-COUNT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-079",
    "qlName": "Nepal-border states",
    "difficulty": "Medium",
    "stem": "Which group contains only Nepal-border states?",
    "answer": "Uttarakhand, Uttar Pradesh, Bihar, Sikkim",
    "distractors": [
      "Himachal Pradesh, Uttar Pradesh, Bihar, Sikkim",
      "Uttarakhand, Bihar, Assam, Sikkim",
      "Uttar Pradesh, Bihar, Jharkhand, West Bengal"
    ],
    "explanation": "Uttarakhand, Uttar Pradesh, Bihar and Sikkim all border Nepal. The distractor groups include Himachal Pradesh, Assam or Jharkhand, which do not.",
    "sourceFactIds": [
      "NEPAL-BORDER-VALID-GROUP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-079",
    "qlName": "Nepal-border states",
    "difficulty": "Medium",
    "stem": "Which state completes the Nepal-border set: Uttarakhand, Uttar Pradesh, Bihar, West Bengal and ___?",
    "answer": "Sikkim",
    "distractors": [
      "Assam",
      "Himachal Pradesh",
      "Jharkhand"
    ],
    "explanation": "Sikkim is the fifth state in India's Nepal-border list. It lies east of West Bengal and also borders Bhutan and China.",
    "sourceFactIds": [
      "NEPAL-BORDER-COMPLETE-SIKKIM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-079",
    "qlName": "Nepal-border states",
    "difficulty": "Medium",
    "stem": "Which Nepal-border state also borders Bhutan and Bangladesh?",
    "answer": "West Bengal",
    "distractors": [
      "Bihar",
      "Uttar Pradesh",
      "Uttarakhand"
    ],
    "explanation": "West Bengal borders Nepal, Bhutan and Bangladesh. Bihar, Uttar Pradesh and Uttarakhand border Nepal but not both of the other countries.",
    "sourceFactIds": [
      "NEPAL-BHUTAN-BANGLADESH-WB"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-079",
    "qlName": "Nepal-border states",
    "difficulty": "Hard",
    "stem": "A state borders Nepal and China but does not border Bangladesh. Which option fits?",
    "answer": "Sikkim",
    "distractors": [
      "West Bengal",
      "Bihar",
      "Uttar Pradesh"
    ],
    "explanation": "Sikkim borders Nepal and China and has no Bangladesh frontier. West Bengal borders Nepal and Bangladesh but not China.",
    "sourceFactIds": [
      "NEPAL-CHINA-SIKKIM-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-080",
    "qlName": "Bhutan-border states",
    "difficulty": "Easy",
    "stem": "Which Indian state shares a border with Bhutan?",
    "answer": "Assam",
    "distractors": [
      "Bihar",
      "Nagaland",
      "Manipur"
    ],
    "explanation": "Assam shares an international border with Bhutan along the Himalayan foothill region. Bihar, Nagaland and Manipur do not border Bhutan.",
    "sourceFactIds": [
      "BHUTAN-BORDER-ASSAM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-080",
    "qlName": "Bhutan-border states",
    "difficulty": "Easy",
    "stem": "How many Indian states border Bhutan?",
    "answer": "Four",
    "distractors": [
      "Three",
      "Five",
      "Six"
    ],
    "explanation": "Four states border Bhutan: Sikkim, West Bengal, Assam and Arunachal Pradesh. They form a west-to-east arc along Bhutan's southern and eastern sides.",
    "sourceFactIds": [
      "BHUTAN-BORDER-COUNT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-080",
    "qlName": "Bhutan-border states",
    "difficulty": "Medium",
    "stem": "Which group contains only Bhutan-border states?",
    "answer": "Sikkim, West Bengal, Assam, Arunachal Pradesh",
    "distractors": [
      "Sikkim, Bihar, Assam, Arunachal Pradesh",
      "West Bengal, Meghalaya, Assam, Arunachal Pradesh",
      "Sikkim, West Bengal, Nagaland, Arunachal Pradesh"
    ],
    "explanation": "Sikkim, West Bengal, Assam and Arunachal Pradesh are the four Indian states bordering Bhutan. Bihar, Meghalaya and Nagaland do not.",
    "sourceFactIds": [
      "BHUTAN-BORDER-FULL-SET"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-080",
    "qlName": "Bhutan-border states",
    "difficulty": "Medium",
    "stem": "Which Bhutan-border state also borders Nepal and China?",
    "answer": "Sikkim",
    "distractors": [
      "Assam",
      "West Bengal",
      "Arunachal Pradesh"
    ],
    "explanation": "Sikkim borders Bhutan, Nepal and China. West Bengal borders Bhutan and Nepal but not China, while Arunachal borders Bhutan and China but not Nepal.",
    "sourceFactIds": [
      "BHUTAN-NEPAL-CHINA-SIKKIM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-080",
    "qlName": "Bhutan-border states",
    "difficulty": "Medium",
    "stem": "Which Bhutan-border state also borders Myanmar?",
    "answer": "Arunachal Pradesh",
    "distractors": [
      "Sikkim",
      "West Bengal",
      "Assam"
    ],
    "explanation": "Arunachal Pradesh borders Bhutan and Myanmar, and also China. The other Bhutan-border states do not touch Myanmar, which makes Arunachal Pradesh unique in this set.",
    "sourceFactIds": [
      "BHUTAN-MYANMAR-ARUNACHAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-080",
    "qlName": "Bhutan-border states",
    "difficulty": "Hard",
    "stem": "Moving west to east along the Indian states touching Bhutan, which order is correct?",
    "answer": "Sikkim → West Bengal → Assam → Arunachal Pradesh",
    "distractors": [
      "West Bengal → Sikkim → Assam → Arunachal Pradesh",
      "Sikkim → Assam → West Bengal → Arunachal Pradesh",
      "Arunachal Pradesh → Assam → West Bengal → Sikkim"
    ],
    "explanation": "From west to east, India's Bhutan-border states are Sikkim, West Bengal, Assam and Arunachal Pradesh. The order follows Bhutan's southern edge.",
    "sourceFactIds": [
      "BHUTAN-BORDER-WEST-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-081",
    "qlName": "China-border states/UT",
    "difficulty": "Easy",
    "stem": "Which Indian state shares a border with China?",
    "answer": "Sikkim",
    "distractors": [
      "Bihar",
      "Jharkhand",
      "Assam"
    ],
    "explanation": "Sikkim lies on India's northern frontier with China. Bihar, Jharkhand and Assam do not directly share the China border.",
    "sourceFactIds": [
      "CHINA-BORDER-SIKKIM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-081",
    "qlName": "China-border states/UT",
    "difficulty": "Easy",
    "stem": "Which Union Territory is listed on India's border with China?",
    "answer": "Ladakh",
    "distractors": [
      "Chandigarh",
      "Puducherry",
      "Lakshadweep"
    ],
    "explanation": "Ladakh is the Union Territory included in India's official China-border state/UT list. The other Union Territories are far from the northern frontier.",
    "sourceFactIds": [
      "CHINA-BORDER-LADAKH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-081",
    "qlName": "China-border states/UT",
    "difficulty": "Medium",
    "stem": "Which group contains only Indian states/UT on the China border?",
    "answer": "Ladakh, Himachal Pradesh, Uttarakhand, Sikkim",
    "distractors": [
      "Ladakh, Punjab, Uttarakhand, Sikkim",
      "Himachal Pradesh, Uttar Pradesh, Sikkim, Arunachal Pradesh",
      "Ladakh, Himachal Pradesh, Bihar, Arunachal Pradesh"
    ],
    "explanation": "Ladakh, Himachal Pradesh, Uttarakhand and Sikkim are all on India's China-border list. Punjab, Uttar Pradesh and Bihar are not.",
    "sourceFactIds": [
      "CHINA-BORDER-VALID-GROUP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-081",
    "qlName": "China-border states/UT",
    "difficulty": "Medium",
    "stem": "Which state completes the China-border set with Ladakh, Himachal Pradesh, Uttarakhand and Sikkim?",
    "answer": "Arunachal Pradesh",
    "distractors": [
      "Assam",
      "Nagaland",
      "West Bengal"
    ],
    "explanation": "Arunachal Pradesh is the easternmost member of India's five-unit China-border set. Assam, Nagaland and West Bengal are not directly on that border.",
    "sourceFactIds": [
      "CHINA-BORDER-COMPLETE-ARUNACHAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-081",
    "qlName": "China-border states/UT",
    "difficulty": "Medium",
    "stem": "Which China-border state also borders Nepal and Bhutan?",
    "answer": "Sikkim",
    "distractors": [
      "Himachal Pradesh",
      "Uttarakhand",
      "Arunachal Pradesh"
    ],
    "explanation": "Sikkim borders China to the north, Nepal to the west and Bhutan to the east. The other China-border states do not share both Nepal and Bhutan.",
    "sourceFactIds": [
      "CHINA-NEPAL-BHUTAN-SIKKIM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-081",
    "qlName": "China-border states/UT",
    "difficulty": "Hard",
    "stem": "A state borders China, Bhutan and Myanmar but not Nepal. Which state fits?",
    "answer": "Arunachal Pradesh",
    "distractors": [
      "Sikkim",
      "Uttarakhand",
      "Himachal Pradesh"
    ],
    "explanation": "Arunachal Pradesh borders China, Bhutan and Myanmar and does not border Nepal. Sikkim borders Nepal and Bhutan but not Myanmar.",
    "sourceFactIds": [
      "CHINA-BHUTAN-MYANMAR-ARUNACHAL"
    ]
  }
]);

export const GEO_LOC_001_CP009_REVIEW_BATCH_V1: readonly GeoLoc001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-LOC-001-CP009-Q${String(index + 1).padStart(3, "0")}`,
      qlId: raw.qlId,
      qlName: raw.qlName,
      difficulty: raw.difficulty,
      stem: raw.stem,
      options: placeGeoLocOptions(raw.answer, raw.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: raw.answer,
      explanation: raw.explanation,
      sourceIds: CP009_SOURCE_IDS,
      sourceFactIds: Object.freeze([...raw.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED = /associated with|best describes|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|given in NCERT|\bNCERT\b|\btextbook\b|stated mainland|which pair correctly|which statement correctly|which option gives|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR = /currency|literacy rate|stock market|crop price|movie|sports team|bank rate|tax slab/i;

export function auditGeoLoc001Cp009ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_LOC_001_CP009_REVIEW_BATCH_V1) {
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

  if (GEO_LOC_001_CP009_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_LOC_001_CP009_REVIEW_BATCH_V1.length);
  for (let n = 73; n <= 81; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_LOC_001_CP009_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
