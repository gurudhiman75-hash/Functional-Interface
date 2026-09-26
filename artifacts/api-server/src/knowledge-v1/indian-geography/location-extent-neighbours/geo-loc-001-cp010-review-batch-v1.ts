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
    "qlId": "GEO-LOC-001-QL-082",
    "qlName": "India’s core position in South Asia",
    "difficulty": "Easy",
    "stem": "India occupies a central position in which region of Asia?",
    "answer": "South Asia",
    "distractors": [
      "Central Asia",
      "West Asia",
      "East Asia"
    ],
    "explanation": "India forms a major part of South Asia and lies between the Himalayan region and the northern Indian Ocean. This regional position shapes its land and maritime geography.",
    "sourceFactIds": [
      "SOUTH-ASIA-INDIA-CENTRAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-082",
    "qlName": "India’s core position in South Asia",
    "difficulty": "Easy",
    "stem": "Which ocean lies immediately south of the South Asian mainland occupied by India?",
    "answer": "Indian Ocean",
    "distractors": [
      "Atlantic Ocean",
      "Arctic Ocean",
      "Pacific Ocean"
    ],
    "explanation": "The Indian Ocean lies south of the Indian peninsula and forms the southern maritime setting of South Asia. India projects prominently into its northern part.",
    "sourceFactIds": [
      "SOUTH-ASIA-INDIAN-OCEAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-082",
    "qlName": "India’s core position in South Asia",
    "difficulty": "Medium",
    "stem": "Which physical frame places India most accurately within South Asia?",
    "answer": "Himalayan region to the north and Indian Ocean to the south",
    "distractors": [
      "Arctic Ocean north and Atlantic Ocean south",
      "Mediterranean Sea north and Pacific Ocean south",
      "Caspian Sea north and Red Sea south"
    ],
    "explanation": "India lies south of the Himalayan mountain system and extends toward the Indian Ocean. This north–south frame is fundamental to its South Asian location.",
    "sourceFactIds": [
      "SOUTH-ASIA-NORTH-SOUTH-FRAME"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-082",
    "qlName": "India’s core position in South Asia",
    "difficulty": "Medium",
    "stem": "Why is India visually prominent on a map of South Asia?",
    "answer": "A large peninsula projects southward into the Indian Ocean",
    "distractors": [
      "It is detached from Asia as an island",
      "It lies entirely west of Pakistan",
      "It has no maritime frontage"
    ],
    "explanation": "The Indian peninsula extends well into the northern Indian Ocean while remaining attached to the Asian mainland. That shape makes India highly prominent on a regional map.",
    "sourceFactIds": [
      "SOUTH-ASIA-PENINSULAR-PROMINENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-082",
    "qlName": "India’s core position in South Asia",
    "difficulty": "Medium",
    "stem": "Which regional description fits India?",
    "answer": "A South Asian country with both extensive land frontiers and a long ocean-facing peninsula",
    "distractors": [
      "A landlocked Central Asian country",
      "An East Asian island country",
      "A West Asian desert peninsula"
    ],
    "explanation": "India combines major continental frontiers in the north and east with a peninsula projecting into the Indian Ocean. This dual land-and-sea setting is characteristic of its South Asian position.",
    "sourceFactIds": [
      "SOUTH-ASIA-LAND-SEA-SETTING"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-082",
    "qlName": "India’s core position in South Asia",
    "difficulty": "Medium",
    "stem": "Which feature most clearly links India's South Asian location with the Indian Ocean?",
    "answer": "The southward-projecting Indian peninsula",
    "distractors": [
      "The Thar Desert alone",
      "The northern mountain wall alone",
      "The Ganga plain alone"
    ],
    "explanation": "The peninsula projects directly into the northern Indian Ocean and creates India's long western and eastern coasts. It is the strongest physical link between the continental and oceanic settings.",
    "sourceFactIds": [
      "SOUTH-ASIA-OCEAN-PENINSULA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-083",
    "qlName": "Pakistan–India–Bangladesh west/east regional frame",
    "difficulty": "Easy",
    "stem": "Which country lies to the west or northwest of India in South Asia?",
    "answer": "Pakistan",
    "distractors": [
      "Bangladesh",
      "Bhutan",
      "Myanmar"
    ],
    "explanation": "Pakistan lies along India's western and northwestern side. Bangladesh lies on India's eastern side, giving a clear regional west–east contrast.",
    "sourceFactIds": [
      "REGIONAL-PAKISTAN-WEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-083",
    "qlName": "Pakistan–India–Bangladesh west/east regional frame",
    "difficulty": "Easy",
    "stem": "Which country lies east of India within South Asia?",
    "answer": "Bangladesh",
    "distractors": [
      "Pakistan",
      "Afghanistan",
      "Maldives"
    ],
    "explanation": "Bangladesh lies on India's eastern side and is surrounded by Indian territory on much of its land boundary. Pakistan occupies the contrasting western side.",
    "sourceFactIds": [
      "REGIONAL-BANGLADESH-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-083",
    "qlName": "Pakistan–India–Bangladesh west/east regional frame",
    "difficulty": "Medium",
    "stem": "Which regional arrangement is accurate from west to east?",
    "answer": "Pakistan → India → Bangladesh",
    "distractors": [
      "Bangladesh → India → Pakistan",
      "India → Pakistan → Bangladesh",
      "Pakistan → Bangladesh → India"
    ],
    "explanation": "Pakistan lies west of India and Bangladesh lies east of India. The three-country regional frame therefore reads Pakistan, India, Bangladesh from west to east.",
    "sourceFactIds": [
      "REGIONAL-PAK-IND-BD-ORDER"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-083",
    "qlName": "Pakistan–India–Bangladesh west/east regional frame",
    "difficulty": "Medium",
    "stem": "A map places Bangladesh west of India and Pakistan east of India. What has been reversed?",
    "answer": "India's western and eastern South Asian neighbours",
    "distractors": [
      "The Arabian Sea and Indian Ocean",
      "The Himalayas and peninsula",
      "Sri Lanka and Maldives"
    ],
    "explanation": "Pakistan belongs on India's western/northwestern side, while Bangladesh belongs on the eastern side. The map has reversed the regional land-neighbour frame.",
    "sourceFactIds": [
      "REGIONAL-PAK-BD-REVERSAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-083",
    "qlName": "Pakistan–India–Bangladesh west/east regional frame",
    "difficulty": "Medium",
    "stem": "Which country forms India's eastern South Asian flank opposite Pakistan?",
    "answer": "Bangladesh",
    "distractors": [
      "Nepal",
      "Bhutan",
      "Sri Lanka"
    ],
    "explanation": "Bangladesh lies to the east of India, while Pakistan lies to the west and northwest. The two countries therefore frame India from opposite landward sides.",
    "sourceFactIds": [
      "REGIONAL-EASTERN-FLANK-BD"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-083",
    "qlName": "Pakistan–India–Bangladesh west/east regional frame",
    "difficulty": "Medium",
    "stem": "Which regional clue identifies India between two neighbouring countries?",
    "answer": "Pakistan to the west and Bangladesh to the east",
    "distractors": [
      "Bhutan to the west and Pakistan to the east",
      "Myanmar to the west and Nepal to the east",
      "Sri Lanka to the west and Maldives to the east"
    ],
    "explanation": "India lies between Pakistan on its western side and Bangladesh on its eastern side in the regional map. This contrast is one of the clearest South Asian orientation clues.",
    "sourceFactIds": [
      "REGIONAL-INDIA-BETWEEN-PAK-BD"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-084",
    "qlName": "Himalayan north: China, Nepal and Bhutan",
    "difficulty": "Easy",
    "stem": "Which three countries form India's principal northern neighbour arc?",
    "answer": "China, Nepal and Bhutan",
    "distractors": [
      "Pakistan, Bangladesh and Myanmar",
      "Sri Lanka, Maldives and Nepal",
      "Afghanistan, Bangladesh and Myanmar"
    ],
    "explanation": "China, Nepal and Bhutan lie along India's northern Himalayan side. Pakistan is northwest, while Bangladesh and Myanmar lie to the east.",
    "sourceFactIds": [
      "REGIONAL-NORTHERN-ARC"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-084",
    "qlName": "Himalayan north: China, Nepal and Bhutan",
    "difficulty": "Easy",
    "stem": "Nepal and Bhutan lie mainly on which side of India?",
    "answer": "North",
    "distractors": [
      "Southwest",
      "Southeast",
      "West coast"
    ],
    "explanation": "Nepal and Bhutan lie along India's northern Himalayan side. They form part of the northern neighbour arc together with China.",
    "sourceFactIds": [
      "REGIONAL-NEPAL-BHUTAN-NORTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-084",
    "qlName": "Himalayan north: China, Nepal and Bhutan",
    "difficulty": "Medium",
    "stem": "Which country lies between Nepal and India's northeastern frontier in the northern regional frame?",
    "answer": "Bhutan",
    "distractors": [
      "Pakistan",
      "Bangladesh",
      "Sri Lanka"
    ],
    "explanation": "Bhutan lies east of Nepal along India's northern side and west of the far northeastern frontier. This position places it within the Himalayan neighbour arc.",
    "sourceFactIds": [
      "REGIONAL-BHUTAN-NORTHERN-FRAME"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-084",
    "qlName": "Himalayan north: China, Nepal and Bhutan",
    "difficulty": "Medium",
    "stem": "A map labels China, Nepal and Bhutan south of India. Which correction is needed?",
    "answer": "They should be placed along India's northern side",
    "distractors": [
      "They should all be placed in the Arabian Sea",
      "They should be placed west of Pakistan",
      "They should be placed south of Sri Lanka"
    ],
    "explanation": "China, Nepal and Bhutan lie along India's northern side in the Himalayan region. Placing them south of India reverses the regional orientation.",
    "sourceFactIds": [
      "REGIONAL-NORTH-ARC-CORRECTION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-084",
    "qlName": "Himalayan north: China, Nepal and Bhutan",
    "difficulty": "Medium",
    "stem": "Which regional feature links China, Nepal and Bhutan in Indian geography?",
    "answer": "All lie along India's Himalayan northern side",
    "distractors": [
      "All are maritime neighbours",
      "All lie on the Arabian Sea",
      "All lie southwest of India"
    ],
    "explanation": "China, Nepal and Bhutan share a northern landward relationship with India along the Himalayan region. Their common feature is geographic direction, not maritime location.",
    "sourceFactIds": [
      "REGIONAL-NORTH-ARC-COMMON"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-084",
    "qlName": "Himalayan north: China, Nepal and Bhutan",
    "difficulty": "Hard",
    "stem": "Country A is west of Bhutan, Country B lies north of much of India, and both are in the northern neighbour arc. Which pair can A and B be?",
    "answer": "Nepal and China",
    "distractors": [
      "Pakistan and Bangladesh",
      "Sri Lanka and Maldives",
      "Myanmar and Bangladesh"
    ],
    "explanation": "Nepal lies west of Bhutan, while China lies north of large sections of India's Himalayan frontier. Both belong to the northern regional neighbour arc.",
    "sourceFactIds": [
      "REGIONAL-NORTH-ARC-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-085",
    "qlName": "Sri Lanka and Maldives in India’s southern maritime frame",
    "difficulty": "Easy",
    "stem": "Which neighbouring island country lies just south of the Indian peninsula?",
    "answer": "Sri Lanka",
    "distractors": [
      "Bhutan",
      "Nepal",
      "Myanmar"
    ],
    "explanation": "Sri Lanka lies immediately south and southeast of peninsular India across narrow sea passages. It is India's closest major southern maritime neighbour.",
    "sourceFactIds": [
      "REGIONAL-SRI-LANKA-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-085",
    "qlName": "Sri Lanka and Maldives in India’s southern maritime frame",
    "difficulty": "Easy",
    "stem": "Which island country lies southwest of India?",
    "answer": "Maldives",
    "distractors": [
      "Bangladesh",
      "Bhutan",
      "Myanmar"
    ],
    "explanation": "Maldives lies southwest of India in the Indian Ocean and south of the Lakshadweep region. Sri Lanka lies closer to the southeast of the peninsula.",
    "sourceFactIds": [
      "REGIONAL-MALDIVES-SW"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-085",
    "qlName": "Sri Lanka and Maldives in India’s southern maritime frame",
    "difficulty": "Medium",
    "stem": "Which southward regional arrangement is accurate?",
    "answer": "Sri Lanka near the southeast; Maldives toward the southwest",
    "distractors": [
      "Maldives northeast; Sri Lanka northwest",
      "Both north of Nepal",
      "Sri Lanka west of Pakistan; Maldives east of Myanmar"
    ],
    "explanation": "Sri Lanka lies close to India's southeastern/southern side, while Maldives lies farther southwest in the Indian Ocean. Their positions frame India's southern maritime neighbourhood.",
    "sourceFactIds": [
      "REGIONAL-SOUTH-ISLAND-FRAME"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-085",
    "qlName": "Sri Lanka and Maldives in India’s southern maritime frame",
    "difficulty": "Medium",
    "stem": "Which maritime neighbour is closer to Tamil Nadu?",
    "answer": "Sri Lanka",
    "distractors": [
      "Maldives",
      "Bhutan",
      "Nepal"
    ],
    "explanation": "Sri Lanka lies across Palk Strait and the Gulf of Mannar from Tamil Nadu. Maldives lies much farther southwest, beyond the Lakshadweep region.",
    "sourceFactIds": [
      "REGIONAL-SRI-LANKA-TN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-085",
    "qlName": "Sri Lanka and Maldives in India’s southern maritime frame",
    "difficulty": "Medium",
    "stem": "Which maritime neighbour lies closer to Minicoy than to Tamil Nadu?",
    "answer": "Maldives",
    "distractors": [
      "Sri Lanka",
      "Bangladesh",
      "Myanmar"
    ],
    "explanation": "Minicoy lies near the northern Maldives and is separated from that island chain by the Eight Degree Channel. Sri Lanka is instead close to Tamil Nadu.",
    "sourceFactIds": [
      "REGIONAL-MALDIVES-MINICOY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-085",
    "qlName": "Sri Lanka and Maldives in India’s southern maritime frame",
    "difficulty": "Hard",
    "stem": "Island country A lies across a narrow sea gap from Tamil Nadu, while B lies southwest beyond Minicoy. What are A and B?",
    "answer": "Sri Lanka and Maldives",
    "distractors": [
      "Maldives and Sri Lanka",
      "Bangladesh and Myanmar",
      "Nepal and Bhutan"
    ],
    "explanation": "Sri Lanka lies across the India–Sri Lanka sea gap from Tamil Nadu, while Maldives lies southwest beyond Minicoy. The two clues identify the pair in that order.",
    "sourceFactIds": [
      "REGIONAL-SOUTH-ISLAND-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-086",
    "qlName": "Arabian Sea–India–Bay of Bengal regional orientation",
    "difficulty": "Easy",
    "stem": "Which water body lies west of India?",
    "answer": "Arabian Sea",
    "distractors": [
      "Bay of Bengal",
      "South China Sea",
      "Red Sea"
    ],
    "explanation": "The Arabian Sea lies to India's west and borders the western coast. The Bay of Bengal occupies the contrasting eastern side.",
    "sourceFactIds": [
      "REGIONAL-ARABIAN-WEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-086",
    "qlName": "Arabian Sea–India–Bay of Bengal regional orientation",
    "difficulty": "Easy",
    "stem": "Which water body lies east of India?",
    "answer": "Bay of Bengal",
    "distractors": [
      "Arabian Sea",
      "Persian Gulf",
      "Caspian Sea"
    ],
    "explanation": "The Bay of Bengal lies along India's eastern side and eastern seaboard. The Arabian Sea lies on the western side of the peninsula.",
    "sourceFactIds": [
      "REGIONAL-BAY-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-086",
    "qlName": "Arabian Sea–India–Bay of Bengal regional orientation",
    "difficulty": "Medium",
    "stem": "Which west-to-east maritime sequence is accurate?",
    "answer": "Arabian Sea → India → Bay of Bengal",
    "distractors": [
      "Bay of Bengal → India → Arabian Sea",
      "India → Arabian Sea → Bay of Bengal",
      "Arabian Sea → Bay of Bengal → India"
    ],
    "explanation": "The Arabian Sea lies west of India and the Bay of Bengal lies east. The peninsula stands between them, giving the stated west-to-east sequence.",
    "sourceFactIds": [
      "REGIONAL-SEA-INDIA-BAY-ORDER"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-086",
    "qlName": "Arabian Sea–India–Bay of Bengal regional orientation",
    "difficulty": "Medium",
    "stem": "What geographic role does the Indian peninsula play between its two major surrounding waters?",
    "answer": "It separates the Arabian Sea on the west from the Bay of Bengal on the east",
    "distractors": [
      "It separates the Atlantic from the Pacific",
      "It places both waters west of India",
      "It places both waters north of India"
    ],
    "explanation": "Peninsular India projects between the Arabian Sea and Bay of Bengal. Its western and eastern coasts therefore face different major water bodies.",
    "sourceFactIds": [
      "REGIONAL-PENINSULA-BETWEEN-WATERS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-086",
    "qlName": "Arabian Sea–India–Bay of Bengal regional orientation",
    "difficulty": "Medium",
    "stem": "A map places the Arabian Sea east of India and the Bay of Bengal west. What is wrong?",
    "answer": "The two water bodies have been reversed",
    "distractors": [
      "India has been moved south of the Equator",
      "The Himalayas have been moved east",
      "Sri Lanka has been moved north"
    ],
    "explanation": "The Arabian Sea belongs west of India and the Bay of Bengal east. Switching them reverses the basic regional maritime orientation.",
    "sourceFactIds": [
      "REGIONAL-SEA-BAY-REVERSAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-086",
    "qlName": "Arabian Sea–India–Bay of Bengal regional orientation",
    "difficulty": "Medium",
    "stem": "Which regional clue places India between two arms of the northern Indian Ocean?",
    "answer": "Arabian Sea to the west and Bay of Bengal to the east",
    "distractors": [
      "Red Sea to the east and Mediterranean Sea to the west",
      "Pacific Ocean to the west and Atlantic Ocean to the east",
      "Caspian Sea west and Aral Sea east"
    ],
    "explanation": "India's peninsula lies between the Arabian Sea and Bay of Bengal, both connected with the northern Indian Ocean. This is a defining regional map relationship.",
    "sourceFactIds": [
      "REGIONAL-INDIA-BETWEEN-OCEAN-ARMS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-087",
    "qlName": "Western maritime approach toward West Asia and Africa",
    "difficulty": "Easy",
    "stem": "India's western maritime side opens most directly toward which region?",
    "answer": "West Asia",
    "distractors": [
      "Northeast Asia",
      "Central America",
      "Arctic Europe"
    ],
    "explanation": "The western coast faces the Arabian Sea and routes toward West Asia. These routes also extend toward eastern Africa and farther westward maritime connections.",
    "sourceFactIds": [
      "REGIONAL-WEST-ASIA-APPROACH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-087",
    "qlName": "Western maritime approach toward West Asia and Africa",
    "difficulty": "Easy",
    "stem": "Which Indian coast is oriented toward eastern Africa across the Arabian Sea?",
    "answer": "Western coast",
    "distractors": [
      "Eastern coast",
      "Northern land frontier",
      "Northeastern mountain frontier"
    ],
    "explanation": "India's western coast faces the Arabian Sea and western Indian Ocean, providing the natural maritime orientation toward eastern Africa.",
    "sourceFactIds": [
      "REGIONAL-WEST-COAST-AFRICA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-087",
    "qlName": "Western maritime approach toward West Asia and Africa",
    "difficulty": "Medium",
    "stem": "A ship leaves India for West Asia by the most direct maritime orientation. Which side of India does it start from?",
    "answer": "Western side",
    "distractors": [
      "Eastern side",
      "Northern side",
      "Northeastern side"
    ],
    "explanation": "West Asia lies across the Arabian Sea from India's western side. The eastern side is instead oriented toward the Bay of Bengal and Southeast Asia.",
    "sourceFactIds": [
      "REGIONAL-WEST-ASIA-WEST-SIDE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-087",
    "qlName": "Western maritime approach toward West Asia and Africa",
    "difficulty": "Medium",
    "stem": "Which sea forms India's main western maritime approach toward West Asia and Africa?",
    "answer": "Arabian Sea",
    "distractors": [
      "Bay of Bengal",
      "South China Sea",
      "Black Sea"
    ],
    "explanation": "The Arabian Sea lies west of India and opens toward West Asia and eastern Africa. It is the key regional water body for India's western maritime approach.",
    "sourceFactIds": [
      "REGIONAL-ARABIAN-WESTERN-APPROACH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-087",
    "qlName": "Western maritime approach toward West Asia and Africa",
    "difficulty": "Medium",
    "stem": "Which regional comparison is accurate?",
    "answer": "Western coast faces routes toward West Asia; eastern coast faces routes toward Southeast Asia",
    "distractors": [
      "Western coast faces Southeast Asia; eastern coast faces West Asia",
      "Both coasts face only West Asia",
      "Both coasts face only Southeast Asia"
    ],
    "explanation": "India's western maritime side opens through the Arabian Sea toward West Asia, while the eastern side opens through the Bay of Bengal toward Southeast Asia.",
    "sourceFactIds": [
      "REGIONAL-WEST-EAST-APPROACH-COMPARE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-087",
    "qlName": "Western maritime approach toward West Asia and Africa",
    "difficulty": "Hard",
    "stem": "A route from India heads toward the Arabian Peninsula and eastern Africa. Which coast–sea combination fits the route?",
    "answer": "Western coast — Arabian Sea",
    "distractors": [
      "Eastern coast — Bay of Bengal",
      "Western coast — Bay of Bengal",
      "Eastern coast — Arabian Sea"
    ],
    "explanation": "The Arabian Peninsula and eastern Africa lie across the Arabian Sea from India. The geographically consistent route begins from India's western coast.",
    "sourceFactIds": [
      "REGIONAL-WEST-ROUTE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-088",
    "qlName": "Eastern maritime approach toward Southeast Asia",
    "difficulty": "Easy",
    "stem": "India's eastern maritime side opens most directly toward which region?",
    "answer": "Southeast Asia",
    "distractors": [
      "West Asia",
      "North Africa",
      "Western Europe"
    ],
    "explanation": "The eastern coast faces the Bay of Bengal and maritime routes toward Southeast Asia. This is the eastern counterpart to India's Arabian Sea orientation.",
    "sourceFactIds": [
      "REGIONAL-SE-ASIA-APPROACH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-088",
    "qlName": "Eastern maritime approach toward Southeast Asia",
    "difficulty": "Easy",
    "stem": "Which Indian coast is oriented toward Southeast Asia across the Bay of Bengal?",
    "answer": "Eastern coast",
    "distractors": [
      "Western coast",
      "Northern frontier",
      "Northwestern desert edge"
    ],
    "explanation": "The eastern coast opens directly onto the Bay of Bengal and routes toward Southeast Asia. The western coast faces the Arabian Sea instead.",
    "sourceFactIds": [
      "REGIONAL-EAST-COAST-SE-ASIA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-088",
    "qlName": "Eastern maritime approach toward Southeast Asia",
    "difficulty": "Medium",
    "stem": "A ship leaves India for Southeast Asia by the natural Bay of Bengal route. Which side does it depart from?",
    "answer": "Eastern side",
    "distractors": [
      "Western side",
      "Northern side",
      "Northwestern side"
    ],
    "explanation": "Southeast Asia lies beyond the Bay of Bengal from India's eastern side. The western coast is oriented toward the Arabian Sea and West Asia.",
    "sourceFactIds": [
      "REGIONAL-SE-ASIA-EAST-SIDE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-088",
    "qlName": "Eastern maritime approach toward Southeast Asia",
    "difficulty": "Medium",
    "stem": "Which water body forms India's main eastern maritime approach toward Southeast Asia?",
    "answer": "Bay of Bengal",
    "distractors": [
      "Arabian Sea",
      "Red Sea",
      "Persian Gulf"
    ],
    "explanation": "The Bay of Bengal lies east of India and opens toward Southeast Asian waters. It is therefore the key regional sea for India's eastward maritime orientation.",
    "sourceFactIds": [
      "REGIONAL-BAY-EASTERN-APPROACH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-088",
    "qlName": "Eastern maritime approach toward Southeast Asia",
    "difficulty": "Medium",
    "stem": "Which island territory strengthens India's geographic reach toward Southeast Asia?",
    "answer": "Andaman and Nicobar Islands",
    "distractors": [
      "Lakshadweep",
      "Dadra and Nagar Haveli and Daman and Diu",
      "Chandigarh"
    ],
    "explanation": "Andaman and Nicobar Islands lies southeast of mainland India toward Southeast Asia. Lakshadweep instead strengthens India's western Arabian Sea presence.",
    "sourceFactIds": [
      "REGIONAL-AN-SE-ASIA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-088",
    "qlName": "Eastern maritime approach toward Southeast Asia",
    "difficulty": "Hard",
    "stem": "A route begins near the Andaman and Nicobar Islands and continues eastward toward Southeast Asia. Which maritime side of India is involved?",
    "answer": "Eastern maritime side",
    "distractors": [
      "Western maritime side",
      "Northern land side",
      "Northwestern land side"
    ],
    "explanation": "Andaman and Nicobar lies on India's eastern/southeastern maritime side and faces Southeast Asian waters. The route therefore belongs to the eastern maritime frame.",
    "sourceFactIds": [
      "REGIONAL-EAST-ROUTE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-089",
    "qlName": "India’s central northern-Indian-Ocean position",
    "difficulty": "Easy",
    "stem": "India's peninsula projects into which part of the Indian Ocean?",
    "answer": "Northern Indian Ocean",
    "distractors": [
      "Southern Atlantic",
      "Arctic Ocean",
      "North Pacific"
    ],
    "explanation": "The Indian peninsula projects into the northern Indian Ocean between the Arabian Sea and Bay of Bengal. This gives India a central position in that oceanic region.",
    "sourceFactIds": [
      "REGIONAL-NORTHERN-INDIAN-OCEAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-089",
    "qlName": "India’s central northern-Indian-Ocean position",
    "difficulty": "Easy",
    "stem": "What gives India a central maritime position between western and eastern ocean routes?",
    "answer": "Its peninsula extends into the northern Indian Ocean",
    "distractors": [
      "It is landlocked",
      "It lies north of the Arctic Circle",
      "It has only one coast"
    ],
    "explanation": "The peninsula reaches deep into the northern Indian Ocean and has access to both the Arabian Sea and Bay of Bengal. This places India between western and eastern maritime routes.",
    "sourceFactIds": [
      "REGIONAL-CENTRAL-MARITIME-POSITION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-089",
    "qlName": "India’s central northern-Indian-Ocean position",
    "difficulty": "Medium",
    "stem": "Which feature allows India to face both western and eastern Indian Ocean route systems?",
    "answer": "A peninsula with coasts on the Arabian Sea and Bay of Bengal",
    "distractors": [
      "A landlocked plateau",
      "An Arctic coastline",
      "A single river boundary"
    ],
    "explanation": "India's peninsula has a western coast on the Arabian Sea and an eastern coast on the Bay of Bengal. The two sides open toward different route systems.",
    "sourceFactIds": [
      "REGIONAL-TWO-OCEAN-ROUTE-SIDES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-089",
    "qlName": "India’s central northern-Indian-Ocean position",
    "difficulty": "Medium",
    "stem": "Why can routes from West Asia toward Southeast Asia pass near India?",
    "answer": "India lies centrally in the northern Indian Ocean between the two regions",
    "distractors": [
      "India lies in the Atlantic Ocean",
      "India is west of Africa",
      "India is north of Europe"
    ],
    "explanation": "India occupies a central northern-Indian-Ocean position between West Asia and Southeast Asia. Its peninsula lies close to route systems linking the two sides.",
    "sourceFactIds": [
      "REGIONAL-WEST-EAST-ROUTES-NEAR-INDIA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-089",
    "qlName": "India’s central northern-Indian-Ocean position",
    "difficulty": "Medium",
    "stem": "Which map feature most clearly shows India's central oceanic position?",
    "answer": "The peninsula projecting between the Arabian Sea and Bay of Bengal",
    "distractors": [
      "The Himalayas forming a northern wall",
      "The Thar Desert in the west",
      "The Ganga plain in the north"
    ],
    "explanation": "The projecting peninsula physically occupies the space between the Arabian Sea and Bay of Bengal. That shape is the clearest map clue to India's central oceanic position.",
    "sourceFactIds": [
      "REGIONAL-CENTRAL-MAP-FEATURE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-089",
    "qlName": "India’s central northern-Indian-Ocean position",
    "difficulty": "Hard",
    "stem": "A country lies between Arabian Sea routes to the west and Bay of Bengal routes to the east while projecting into the same ocean. Which country fits?",
    "answer": "India",
    "distractors": [
      "Nepal",
      "Bhutan",
      "Afghanistan"
    ],
    "explanation": "India is the South Asian peninsula between the Arabian Sea and Bay of Bengal and projects into the Indian Ocean. The other options are landlocked.",
    "sourceFactIds": [
      "REGIONAL-CENTRAL-COUNTRY-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-090",
    "qlName": "South Asia–Indian Ocean integrated map relations",
    "difficulty": "Easy",
    "stem": "Which regional arrangement around India is accurate?",
    "answer": "Pakistan west, Bangladesh east, Indian Ocean south",
    "distractors": [
      "Bangladesh west, Pakistan east, Indian Ocean north",
      "Pakistan east, China south, Arabian Sea north",
      "Sri Lanka north, Nepal south, Bay of Bengal west"
    ],
    "explanation": "Pakistan lies west/northwest of India, Bangladesh east and the Indian Ocean south. Together these clues form a basic South Asia–ocean map frame.",
    "sourceFactIds": [
      "REGIONAL-INTEGRATED-BASIC"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-090",
    "qlName": "South Asia–Indian Ocean integrated map relations",
    "difficulty": "Easy",
    "stem": "Which set places one northern, one eastern and one southern neighbour correctly?",
    "answer": "Nepal — north; Bangladesh — east; Sri Lanka — south",
    "distractors": [
      "Nepal — south; Bangladesh — west; Sri Lanka — north",
      "Pakistan — east; Bhutan — south; Maldives — north",
      "Myanmar — west; China — south; Sri Lanka — east"
    ],
    "explanation": "Nepal lies north of India, Bangladesh east and Sri Lanka south across the sea. The set correctly combines land and maritime regional directions.",
    "sourceFactIds": [
      "REGIONAL-NORTH-EAST-SOUTH-SET"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-090",
    "qlName": "South Asia–Indian Ocean integrated map relations",
    "difficulty": "Medium",
    "stem": "A map shows West Asia on one side of India and Southeast Asia on the other. Which Indian maritime sides face them?",
    "answer": "Western side toward West Asia; eastern side toward Southeast Asia",
    "distractors": [
      "Eastern side toward West Asia; western side toward Southeast Asia",
      "Both sides toward West Asia",
      "Both sides toward Southeast Asia"
    ],
    "explanation": "India's western side opens through the Arabian Sea toward West Asia, while its eastern side opens through the Bay of Bengal toward Southeast Asia.",
    "sourceFactIds": [
      "REGIONAL-INTEGRATED-WEST-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-090",
    "qlName": "South Asia–Indian Ocean integrated map relations",
    "difficulty": "Medium",
    "stem": "Which clue set identifies India's regional position most accurately?",
    "answer": "Himalayan neighbours north, Arabian Sea west, Bay of Bengal east, Indian Ocean south",
    "distractors": [
      "Indian Ocean north, Arabian Sea east, Bay of Bengal west",
      "Himalayan neighbours south, Arabian Sea north, Bay of Bengal west",
      "Atlantic west, Pacific east, Arctic south"
    ],
    "explanation": "India's northern side is framed by Himalayan neighbours, while its peninsula lies between the Arabian Sea and Bay of Bengal with the Indian Ocean to the south.",
    "sourceFactIds": [
      "REGIONAL-INTEGRATED-FOUR-SIDES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-090",
    "qlName": "South Asia–Indian Ocean integrated map relations",
    "difficulty": "Medium",
    "stem": "Which regional sequence moves from India's western land neighbour to its eastern land neighbour and then to a southern maritime neighbour?",
    "answer": "Pakistan → Bangladesh → Sri Lanka",
    "distractors": [
      "Bangladesh → Pakistan → Nepal",
      "Nepal → Bhutan → China",
      "Sri Lanka → Maldives → Pakistan"
    ],
    "explanation": "Pakistan represents India's western/northwestern land side, Bangladesh the eastern land side and Sri Lanka a southern maritime neighbour. The sequence follows those three regional roles.",
    "sourceFactIds": [
      "REGIONAL-INTEGRATED-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-090",
    "qlName": "South Asia–Indian Ocean integrated map relations",
    "difficulty": "Hard",
    "stem": "Country A lies west of India, country B east, island country C south, and sea D west of the peninsula. Which set fits?",
    "answer": "Pakistan, Bangladesh, Sri Lanka, Arabian Sea",
    "distractors": [
      "Bangladesh, Pakistan, Maldives, Bay of Bengal",
      "Nepal, Bhutan, Sri Lanka, Arabian Sea",
      "Pakistan, Myanmar, Maldives, Bay of Bengal"
    ],
    "explanation": "Pakistan lies west/northwest, Bangladesh east, Sri Lanka south and the Arabian Sea west of the peninsula. All four clues align only in the first set.",
    "sourceFactIds": [
      "REGIONAL-INTEGRATED-INFERENCE"
    ]
  }
]);

export const GEO_LOC_001_CP010_REVIEW_BATCH_V1: readonly GeoLoc001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-LOC-001-CP010-Q${String(index + 1).padStart(3, "0")}`,
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

export function auditGeoLoc001Cp010ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_LOC_001_CP010_REVIEW_BATCH_V1) {
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

  if (GEO_LOC_001_CP010_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_LOC_001_CP010_REVIEW_BATCH_V1.length);
  for (let n = 82; n <= 90; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_LOC_001_CP010_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
