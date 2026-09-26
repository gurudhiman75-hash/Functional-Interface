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
    "qlId": "GEO-LOC-001-QL-037",
    "qlName": "India’s land-neighbour set",
    "difficulty": "Easy",
    "stem": "Which country is a land neighbour of India?",
    "answer": "Nepal",
    "distractors": [
      "Sri Lanka",
      "Maldives",
      "Indonesia"
    ],
    "explanation": "Nepal shares a land frontier with India along the Himalayan region. Sri Lanka and Maldives are maritime neighbours rather than land neighbours.",
    "sourceFactIds": [
      "LAND-NEIGHBOUR-NEPAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-037",
    "qlName": "India’s land-neighbour set",
    "difficulty": "Easy",
    "stem": "Which of the following is not a land neighbour of India?",
    "answer": "Sri Lanka",
    "distractors": [
      "Bhutan",
      "Bangladesh",
      "Myanmar"
    ],
    "explanation": "Sri Lanka is separated from India by sea and narrow straits. Bhutan, Bangladesh and Myanmar all share land boundaries with India.",
    "sourceFactIds": [
      "LAND-NEIGHBOUR-NOT-SRI-LANKA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-037",
    "qlName": "India’s land-neighbour set",
    "difficulty": "Medium",
    "stem": "Which group contains only India's land neighbours?",
    "answer": "Pakistan, Nepal, Bangladesh",
    "distractors": [
      "Sri Lanka, Nepal, Myanmar",
      "Maldives, Bhutan, Bangladesh",
      "Sri Lanka, Maldives, Nepal"
    ],
    "explanation": "Pakistan, Nepal and Bangladesh all share land frontiers with India. Sri Lanka and Maldives are separated from India by sea.",
    "sourceFactIds": [
      "LAND-NEIGHBOUR-GROUP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-037",
    "qlName": "India’s land-neighbour set",
    "difficulty": "Medium",
    "stem": "How many countries are commonly listed as India's land neighbours in Indian geography?",
    "answer": "Seven",
    "distractors": [
      "Five",
      "Six",
      "Nine"
    ],
    "explanation": "The standard list contains Pakistan, Afghanistan, China, Nepal, Bhutan, Bangladesh and Myanmar. Sri Lanka and Maldives are treated separately as maritime neighbours.",
    "sourceFactIds": [
      "LAND-NEIGHBOUR-COUNT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-037",
    "qlName": "India’s land-neighbour set",
    "difficulty": "Medium",
    "stem": "Which country belongs in the same land-neighbour list as China, Nepal and Bhutan?",
    "answer": "Myanmar",
    "distractors": [
      "Sri Lanka",
      "Maldives",
      "Indonesia"
    ],
    "explanation": "Myanmar shares a land boundary with India in the east. Sri Lanka and Maldives are neighbouring island countries but do not share a land frontier with India.",
    "sourceFactIds": [
      "LAND-NEIGHBOUR-MYANMAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-037",
    "qlName": "India’s land-neighbour set",
    "difficulty": "Medium",
    "stem": "Which country should be removed from a list of India's land neighbours?",
    "answer": "Maldives",
    "distractors": [
      "Pakistan",
      "Bangladesh",
      "Bhutan"
    ],
    "explanation": "Maldives is an island country in the Indian Ocean and does not share a land border with India. Pakistan, Bangladesh and Bhutan do.",
    "sourceFactIds": [
      "LAND-NEIGHBOUR-REMOVE-MALDIVES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-038",
    "qlName": "Pakistan and Afghanistan — northwest",
    "difficulty": "Easy",
    "stem": "Which country lies to the northwest of India?",
    "answer": "Pakistan",
    "distractors": [
      "Myanmar",
      "Bangladesh",
      "Bhutan"
    ],
    "explanation": "Pakistan lies along India's northwestern side. Myanmar and Bangladesh are on the eastern side, while Bhutan lies to the north.",
    "sourceFactIds": [
      "NORTHWEST-PAKISTAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-038",
    "qlName": "Pakistan and Afghanistan — northwest",
    "difficulty": "Easy",
    "stem": "Which two countries are grouped as India's northwestern land neighbours?",
    "answer": "Pakistan and Afghanistan",
    "distractors": [
      "Bangladesh and Myanmar",
      "Nepal and Bhutan",
      "China and Myanmar"
    ],
    "explanation": "Indian geography places Pakistan and Afghanistan to the northwest of India. Bangladesh and Myanmar are eastern neighbours, while Nepal and Bhutan lie to the north.",
    "sourceFactIds": [
      "NORTHWEST-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-038",
    "qlName": "Pakistan and Afghanistan — northwest",
    "difficulty": "Medium",
    "stem": "Afghanistan is placed in which directional group of India's neighbours?",
    "answer": "Northwest",
    "distractors": [
      "East",
      "South across the sea",
      "Southeast"
    ],
    "explanation": "In India's official geographic framework, Afghanistan is listed with Pakistan on the northwestern side. Questions here test that directional classification rather than present-day administrative control.",
    "sourceFactIds": [
      "AFGHANISTAN-NORTHWEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-038",
    "qlName": "Pakistan and Afghanistan — northwest",
    "difficulty": "Medium",
    "stem": "Which neighbour should be paired with Pakistan when identifying India's northwest?",
    "answer": "Afghanistan",
    "distractors": [
      "Bangladesh",
      "Myanmar",
      "Bhutan"
    ],
    "explanation": "Pakistan and Afghanistan form the northwestern neighbour pair in standard Indian geography. Bangladesh and Myanmar belong to the eastern side, while Bhutan is to the north.",
    "sourceFactIds": [
      "PAKISTAN-AFGHANISTAN-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-038",
    "qlName": "Pakistan and Afghanistan — northwest",
    "difficulty": "Medium",
    "stem": "Which directional label fits Pakistan in relation to India?",
    "answer": "Northwest",
    "distractors": [
      "East",
      "Southeast",
      "South across the sea"
    ],
    "explanation": "Pakistan lies on India's western and northwestern side. The country is therefore grouped under India's northwestern land neighbours.",
    "sourceFactIds": [
      "PAKISTAN-DIRECTION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-038",
    "qlName": "Pakistan and Afghanistan — northwest",
    "difficulty": "Medium",
    "stem": "A map groups Pakistan with Bangladesh on India's eastern side. What is wrong?",
    "answer": "Pakistan should be placed on the northwestern side",
    "distractors": [
      "Bangladesh should be placed west of India",
      "Both countries should be south across the sea",
      "Pakistan and Bangladesh are both northern neighbours"
    ],
    "explanation": "Pakistan lies to India's northwest, whereas Bangladesh lies to the east. Grouping them together on the eastern side reverses Pakistan's correct position.",
    "sourceFactIds": [
      "PAKISTAN-MAP-ERROR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-039",
    "qlName": "China, Nepal and Bhutan — north",
    "difficulty": "Easy",
    "stem": "Which country lies to the north of India?",
    "answer": "Nepal",
    "distractors": [
      "Sri Lanka",
      "Maldives",
      "Myanmar"
    ],
    "explanation": "Nepal lies along India's northern Himalayan frontier. Myanmar is to the east, while Sri Lanka and Maldives are maritime neighbours to the south.",
    "sourceFactIds": [
      "NORTH-NEPAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-039",
    "qlName": "China, Nepal and Bhutan — north",
    "difficulty": "Easy",
    "stem": "Which three countries are grouped as India's northern land neighbours?",
    "answer": "China, Nepal and Bhutan",
    "distractors": [
      "Pakistan, Bangladesh and Myanmar",
      "Sri Lanka, Nepal and Maldives",
      "Afghanistan, Myanmar and Bangladesh"
    ],
    "explanation": "China, Nepal and Bhutan lie along India's northern side. Pakistan and Afghanistan are grouped to the northwest, while Bangladesh and Myanmar lie to the east.",
    "sourceFactIds": [
      "NORTH-TRIO"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-039",
    "qlName": "China, Nepal and Bhutan — north",
    "difficulty": "Medium",
    "stem": "Bhutan belongs to which directional group of India's land neighbours?",
    "answer": "North",
    "distractors": [
      "Northwest",
      "East only",
      "South across the sea"
    ],
    "explanation": "Bhutan lies along the Himalayan side of India and is grouped with Nepal and China among the northern neighbours. It is not a maritime neighbour.",
    "sourceFactIds": [
      "BHUTAN-NORTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-039",
    "qlName": "China, Nepal and Bhutan — north",
    "difficulty": "Medium",
    "stem": "Which neighbour is grouped with Nepal and Bhutan on India's northern side?",
    "answer": "China",
    "distractors": [
      "Bangladesh",
      "Myanmar",
      "Sri Lanka"
    ],
    "explanation": "China, Nepal and Bhutan form the standard northern-neighbour group. Bangladesh and Myanmar lie to the east, while Sri Lanka is separated from India by sea.",
    "sourceFactIds": [
      "CHINA-NEPAL-BHUTAN-GROUP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-039",
    "qlName": "China, Nepal and Bhutan — north",
    "difficulty": "Medium",
    "stem": "A question lists China, Nepal and Bhutan together. What common geographic feature is being tested?",
    "answer": "They are northern land neighbours of India",
    "distractors": [
      "They are island neighbours of India",
      "They all lie east of Myanmar",
      "They all face India's western coast"
    ],
    "explanation": "The three countries lie along India's northern side and share land frontiers with India. Their grouping is directional, not maritime.",
    "sourceFactIds": [
      "NORTH-GROUP-COMMON-FEATURE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-039",
    "qlName": "China, Nepal and Bhutan — north",
    "difficulty": "Medium",
    "stem": "Which country does not belong with China, Nepal and Bhutan in the northern-neighbour group?",
    "answer": "Bangladesh",
    "distractors": [
      "China",
      "Nepal",
      "Bhutan"
    ],
    "explanation": "Bangladesh lies to the east of India and is grouped with Myanmar in directional questions. China, Nepal and Bhutan belong to the northern group.",
    "sourceFactIds": [
      "NORTH-GROUP-ODD-BANGLADESH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-040",
    "qlName": "Bangladesh and Myanmar — east",
    "difficulty": "Easy",
    "stem": "Which country lies to the east of India?",
    "answer": "Bangladesh",
    "distractors": [
      "Pakistan",
      "Afghanistan",
      "Maldives"
    ],
    "explanation": "Bangladesh lies along India's eastern side. Pakistan and Afghanistan are to the northwest, while Maldives is a maritime neighbour.",
    "sourceFactIds": [
      "EAST-BANGLADESH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-040",
    "qlName": "Bangladesh and Myanmar — east",
    "difficulty": "Easy",
    "stem": "Which two countries are grouped as India's eastern land neighbours?",
    "answer": "Bangladesh and Myanmar",
    "distractors": [
      "Pakistan and Afghanistan",
      "China and Nepal",
      "Sri Lanka and Maldives"
    ],
    "explanation": "Bangladesh and Myanmar lie to the east of India and share land frontiers with it. Pakistan and Afghanistan are northwestern neighbours.",
    "sourceFactIds": [
      "EAST-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-040",
    "qlName": "Bangladesh and Myanmar — east",
    "difficulty": "Medium",
    "stem": "Myanmar belongs to which directional group of India's land neighbours?",
    "answer": "East",
    "distractors": [
      "Northwest",
      "West",
      "South across the sea"
    ],
    "explanation": "Myanmar shares a land frontier with India on the eastern side. It is commonly grouped with Bangladesh in directional neighbour questions.",
    "sourceFactIds": [
      "MYANMAR-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-040",
    "qlName": "Bangladesh and Myanmar — east",
    "difficulty": "Medium",
    "stem": "Which neighbour should be paired with Bangladesh when identifying India's eastern side?",
    "answer": "Myanmar",
    "distractors": [
      "Pakistan",
      "Afghanistan",
      "Nepal"
    ],
    "explanation": "Bangladesh and Myanmar are the two countries grouped to India's east. Pakistan and Afghanistan are northwest, while Nepal is to the north.",
    "sourceFactIds": [
      "BANGLADESH-MYANMAR-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-040",
    "qlName": "Bangladesh and Myanmar — east",
    "difficulty": "Medium",
    "stem": "A map places Myanmar on India's northwestern side. Where should it be placed instead?",
    "answer": "Eastern side",
    "distractors": [
      "Western coast",
      "South across the sea",
      "Northern Arabian Sea"
    ],
    "explanation": "Myanmar lies along India's eastern land frontier. Placing it to the northwest confuses it with the Pakistan-Afghanistan directional group.",
    "sourceFactIds": [
      "MYANMAR-MAP-CORRECTION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-040",
    "qlName": "Bangladesh and Myanmar — east",
    "difficulty": "Hard",
    "stem": "Neighbour P is Bangladesh and neighbour Q is Myanmar. Which statement is true of both?",
    "answer": "Both lie on India's eastern side and share land frontiers with India",
    "distractors": [
      "Both lie to India's northwest",
      "Both are island neighbours",
      "Both lie west of the Arabian Sea"
    ],
    "explanation": "Bangladesh and Myanmar both border India on the eastern side. Their shared directional position separates them from the northwestern and northern neighbour groups.",
    "sourceFactIds": [
      "EAST-PAIR-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-041",
    "qlName": "Northwest / north / east directional grouping",
    "difficulty": "Easy",
    "stem": "Which neighbour group is correctly arranged by direction from India?",
    "answer": "Northwest — Pakistan; North — Nepal; East — Myanmar",
    "distractors": [
      "Northwest — Myanmar; North — Pakistan; East — Nepal",
      "Northwest — Nepal; North — Bangladesh; East — Afghanistan",
      "Northwest — Bhutan; North — Myanmar; East — Pakistan"
    ],
    "explanation": "Pakistan belongs to the northwest, Nepal to the north and Myanmar to the east. This pattern follows India's standard neighbour-direction map.",
    "sourceFactIds": [
      "DIRECTION-GROUP-ONE-EACH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-041",
    "qlName": "Northwest / north / east directional grouping",
    "difficulty": "Easy",
    "stem": "Which sequence moves from India's northwest neighbour group to north and then east?",
    "answer": "Pakistan → Nepal → Bangladesh",
    "distractors": [
      "Bangladesh → Pakistan → Nepal",
      "Nepal → Myanmar → Pakistan",
      "Bhutan → Afghanistan → China"
    ],
    "explanation": "Pakistan represents the northwest group, Nepal the northern group and Bangladesh the eastern group. The sequence therefore moves around India's land frontiers by direction.",
    "sourceFactIds": [
      "DIRECTION-SEQUENCE-NW-N-E"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-041",
    "qlName": "Northwest / north / east directional grouping",
    "difficulty": "Medium",
    "stem": "Which directional grouping contains an error?",
    "answer": "East — Pakistan and Afghanistan",
    "distractors": [
      "Northwest — Pakistan and Afghanistan",
      "North — China, Nepal and Bhutan",
      "East — Bangladesh and Myanmar"
    ],
    "explanation": "Pakistan and Afghanistan belong to the northwest, not the east. The northern and eastern groupings shown in the other options are correct.",
    "sourceFactIds": [
      "DIRECTION-GROUP-ERROR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-041",
    "qlName": "Northwest / north / east directional grouping",
    "difficulty": "Medium",
    "stem": "If the neighbour groups are arranged northwest, north and east, which countries fill the three groups?",
    "answer": "Pakistan/Afghanistan; China/Nepal/Bhutan; Bangladesh/Myanmar",
    "distractors": [
      "Bangladesh/Myanmar; Pakistan/Afghanistan; China/Nepal/Bhutan",
      "China/Nepal/Bhutan; Bangladesh/Myanmar; Pakistan/Afghanistan",
      "Sri Lanka/Maldives; China/Nepal/Bhutan; Pakistan/Afghanistan"
    ],
    "explanation": "The standard directional grouping places Pakistan and Afghanistan northwest, China/Nepal/Bhutan north, and Bangladesh/Myanmar east. Sri Lanka and Maldives are maritime neighbours.",
    "sourceFactIds": [
      "DIRECTION-ALL-GROUPS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-041",
    "qlName": "Northwest / north / east directional grouping",
    "difficulty": "Medium",
    "stem": "Which direction contains the largest number of countries in the standard northwest–north–east grouping?",
    "answer": "North",
    "distractors": [
      "Northwest",
      "East",
      "All contain the same number"
    ],
    "explanation": "The northern group contains China, Nepal and Bhutan, giving three countries. The northwest and east groups each contain two.",
    "sourceFactIds": [
      "DIRECTION-GROUP-COUNT-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-041",
    "qlName": "Northwest / north / east directional grouping",
    "difficulty": "Hard",
    "stem": "A map labels Group A as Pakistan/Afghanistan, Group B as China/Nepal/Bhutan and Group C as Bangladesh/Myanmar. Which directions match A, B and C?",
    "answer": "Northwest, North, East",
    "distractors": [
      "East, North, Northwest",
      "North, East, Northwest",
      "Northwest, East, North"
    ],
    "explanation": "Pakistan and Afghanistan are northwest; China, Nepal and Bhutan are north; Bangladesh and Myanmar are east. The three groups therefore map to Northwest, North and East.",
    "sourceFactIds": [
      "DIRECTION-GROUP-LABELS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-042",
    "qlName": "Land neighbour vs sea neighbour distinction",
    "difficulty": "Easy",
    "stem": "Which neighbouring country is separated from India by sea rather than a land frontier?",
    "answer": "Sri Lanka",
    "distractors": [
      "Nepal",
      "Bhutan",
      "Bangladesh"
    ],
    "explanation": "Sri Lanka lies south of India across narrow sea channels and does not share a land border. Nepal, Bhutan and Bangladesh are land neighbours.",
    "sourceFactIds": [
      "SEA-NEIGHBOUR-SRI-LANKA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-042",
    "qlName": "Land neighbour vs sea neighbour distinction",
    "difficulty": "Easy",
    "stem": "Which country is a maritime neighbour of India rather than a land neighbour?",
    "answer": "Maldives",
    "distractors": [
      "Myanmar",
      "Pakistan",
      "Nepal"
    ],
    "explanation": "Maldives is an island country southwest of India in the Indian Ocean. Myanmar, Pakistan and Nepal all share land frontiers with India.",
    "sourceFactIds": [
      "SEA-NEIGHBOUR-MALDIVES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-042",
    "qlName": "Land neighbour vs sea neighbour distinction",
    "difficulty": "Medium",
    "stem": "Which pair contains only maritime neighbours of India?",
    "answer": "Sri Lanka and Maldives",
    "distractors": [
      "Nepal and Bhutan",
      "Bangladesh and Myanmar",
      "Pakistan and Afghanistan"
    ],
    "explanation": "Sri Lanka and Maldives are neighbouring countries reached across the sea. The other pairs consist of countries sharing land frontiers with India.",
    "sourceFactIds": [
      "SEA-NEIGHBOUR-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-042",
    "qlName": "Land neighbour vs sea neighbour distinction",
    "difficulty": "Medium",
    "stem": "Which pair should not be added to a list titled 'India's land neighbours'?",
    "answer": "Sri Lanka and Maldives",
    "distractors": [
      "China and Nepal",
      "Bangladesh and Myanmar",
      "Pakistan and Bhutan"
    ],
    "explanation": "Sri Lanka and Maldives do not share land boundaries with India. They belong to India's maritime-neighbour geography instead.",
    "sourceFactIds": [
      "LAND-LIST-EXCLUDE-SEA-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-042",
    "qlName": "Land neighbour vs sea neighbour distinction",
    "difficulty": "Medium",
    "stem": "What separates Sri Lanka from India in geographic terms?",
    "answer": "Sea and narrow straits rather than a land boundary",
    "distractors": [
      "A continuous land frontier",
      "The Himalayas",
      "The Thar Desert"
    ],
    "explanation": "India and Sri Lanka are close neighbours but are separated by water. Their relationship is therefore maritime, not a shared land frontier.",
    "sourceFactIds": [
      "SRI-LANKA-LAND-VS-SEA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-042",
    "qlName": "Land neighbour vs sea neighbour distinction",
    "difficulty": "Hard",
    "stem": "A list contains Nepal, Myanmar, Sri Lanka and Bhutan. Which entry changes the list from all-land neighbours to a mixed land/sea-neighbour list?",
    "answer": "Sri Lanka",
    "distractors": [
      "Nepal",
      "Myanmar",
      "Bhutan"
    ],
    "explanation": "Nepal, Myanmar and Bhutan share land frontiers with India. Sri Lanka is separated by sea, so its inclusion changes the geographic category of the list.",
    "sourceFactIds": [
      "LAND-SEA-MIXED-LIST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-043",
    "qlName": "Pakistan / Bangladesh / Myanmar directional comparison",
    "difficulty": "Easy",
    "stem": "Which country lies northwest of India while Bangladesh lies east?",
    "answer": "Pakistan",
    "distractors": [
      "Myanmar",
      "Bhutan",
      "Sri Lanka"
    ],
    "explanation": "Pakistan belongs to India's northwestern neighbour group. Bangladesh lies to the east, giving a clear west-versus-east directional contrast.",
    "sourceFactIds": [
      "PAKISTAN-VS-BANGLADESH-DIRECTION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-043",
    "qlName": "Pakistan / Bangladesh / Myanmar directional comparison",
    "difficulty": "Easy",
    "stem": "Bangladesh and Myanmar lie on which side of India compared with Pakistan?",
    "answer": "Eastern side",
    "distractors": [
      "Northwestern side",
      "Western sea side",
      "Southern island side"
    ],
    "explanation": "Bangladesh and Myanmar lie to India's east. Pakistan lies on the northwestern side, so the two groups occupy opposite directional sectors.",
    "sourceFactIds": [
      "EAST-PAIR-VS-PAKISTAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-043",
    "qlName": "Pakistan / Bangladesh / Myanmar directional comparison",
    "difficulty": "Medium",
    "stem": "Which country is the directional odd one out: Pakistan, Bangladesh, Myanmar?",
    "answer": "Pakistan",
    "distractors": [
      "Bangladesh",
      "Myanmar",
      "None; all lie east"
    ],
    "explanation": "Bangladesh and Myanmar are eastern neighbours, while Pakistan lies to the northwest. Pakistan is therefore the directional odd one out.",
    "sourceFactIds": [
      "DIRECTION-ODD-PAKISTAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-043",
    "qlName": "Pakistan / Bangladesh / Myanmar directional comparison",
    "difficulty": "Medium",
    "stem": "If a map shows Pakistan east of India and Myanmar northwest of India, what correction is needed?",
    "answer": "Pakistan and Myanmar should switch directional sides",
    "distractors": [
      "Both should move south across the sea",
      "Both should move north with Nepal",
      "No correction is needed"
    ],
    "explanation": "Pakistan belongs on the northwestern side, while Myanmar belongs on the eastern side. The map has reversed their directional positions.",
    "sourceFactIds": [
      "PAKISTAN-MYANMAR-MAP-SWAP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-043",
    "qlName": "Pakistan / Bangladesh / Myanmar directional comparison",
    "difficulty": "Medium",
    "stem": "Which neighbour lies on the same directional side of India as Bangladesh?",
    "answer": "Myanmar",
    "distractors": [
      "Pakistan",
      "Afghanistan",
      "Nepal"
    ],
    "explanation": "Bangladesh and Myanmar are both eastern land neighbours. Pakistan and Afghanistan are northwest, while Nepal lies north.",
    "sourceFactIds": [
      "BANGLADESH-SAME-DIRECTION-MYANMAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-043",
    "qlName": "Pakistan / Bangladesh / Myanmar directional comparison",
    "difficulty": "Hard",
    "stem": "Neighbour A is northwest of India, while B and C are both east. If A is Pakistan and B is Bangladesh, which country is C?",
    "answer": "Myanmar",
    "distractors": [
      "Nepal",
      "Bhutan",
      "Sri Lanka"
    ],
    "explanation": "Myanmar joins Bangladesh in the eastern-neighbour group. Nepal and Bhutan are northern neighbours, while Sri Lanka is maritime.",
    "sourceFactIds": [
      "DIRECTION-INFERENCE-MYANMAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-044",
    "qlName": "China / Nepal / Bhutan directional comparison",
    "difficulty": "Easy",
    "stem": "China, Nepal and Bhutan all lie on which side of India?",
    "answer": "North",
    "distractors": [
      "East",
      "Northwest",
      "South across the sea"
    ],
    "explanation": "China, Nepal and Bhutan are grouped along India's northern side. This is the main directional feature they share in Indian geography.",
    "sourceFactIds": [
      "NORTH-TRIO-SIDE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-044",
    "qlName": "China / Nepal / Bhutan directional comparison",
    "difficulty": "Easy",
    "stem": "Which country belongs to the same directional group as Nepal?",
    "answer": "Bhutan",
    "distractors": [
      "Pakistan",
      "Bangladesh",
      "Myanmar"
    ],
    "explanation": "Nepal and Bhutan are both northern neighbours of India. Pakistan lies northwest, while Bangladesh and Myanmar lie east.",
    "sourceFactIds": [
      "NEPAL-SAME-GROUP-BHUTAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-044",
    "qlName": "China / Nepal / Bhutan directional comparison",
    "difficulty": "Medium",
    "stem": "Which country is the odd one out by direction: China, Nepal, Bhutan, Myanmar?",
    "answer": "Myanmar",
    "distractors": [
      "China",
      "Nepal",
      "Bhutan"
    ],
    "explanation": "China, Nepal and Bhutan form the northern-neighbour group. Myanmar lies to the east and therefore differs in directional classification.",
    "sourceFactIds": [
      "NORTH-TRIO-ODD-MYANMAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-044",
    "qlName": "China / Nepal / Bhutan directional comparison",
    "difficulty": "Medium",
    "stem": "A map groups Nepal with Bangladesh and Myanmar on India's eastern side. What should be changed?",
    "answer": "Nepal should be moved to the northern neighbour group",
    "distractors": [
      "Bangladesh should move to the northwest",
      "Myanmar should move to the south across the sea",
      "All three already belong to the east"
    ],
    "explanation": "Nepal lies to the north of India, whereas Bangladesh and Myanmar lie to the east. The map has placed Nepal in the wrong directional group.",
    "sourceFactIds": [
      "NEPAL-MAP-GROUP-CORRECTION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-044",
    "qlName": "China / Nepal / Bhutan directional comparison",
    "difficulty": "Medium",
    "stem": "Which two countries, together with China, complete India's northern-neighbour trio?",
    "answer": "Nepal and Bhutan",
    "distractors": [
      "Bangladesh and Myanmar",
      "Pakistan and Afghanistan",
      "Sri Lanka and Maldives"
    ],
    "explanation": "The northern group consists of China, Nepal and Bhutan. Bangladesh/Myanmar are eastern, Pakistan/Afghanistan northwestern, and Sri Lanka/Maldives maritime.",
    "sourceFactIds": [
      "NORTH-TRIO-COMPLETE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-044",
    "qlName": "China / Nepal / Bhutan directional comparison",
    "difficulty": "Hard",
    "stem": "Group X contains China and Nepal and is defined by direction from India. Which country completes Group X?",
    "answer": "Bhutan",
    "distractors": [
      "Pakistan",
      "Bangladesh",
      "Myanmar"
    ],
    "explanation": "China and Nepal belong to India's northern-neighbour group, which also includes Bhutan. The other options belong to northwest or east directional groups.",
    "sourceFactIds": [
      "NORTH-GROUP-INFERENCE-BHUTAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-045",
    "qlName": "Mixed neighbour-direction identification",
    "difficulty": "Easy",
    "stem": "Which neighbour-direction match is correct?",
    "answer": "Myanmar — East",
    "distractors": [
      "Pakistan — East",
      "Nepal — Northwest",
      "Bangladesh — Northwest"
    ],
    "explanation": "Myanmar lies east of India. Pakistan is northwest, Nepal is north and Bangladesh is also east, showing the main directional groups clearly.",
    "sourceFactIds": [
      "MIXED-NEIGHBOUR-DIRECTION-MATCH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-045",
    "qlName": "Mixed neighbour-direction identification",
    "difficulty": "Easy",
    "stem": "Which country–direction match is incorrect?",
    "answer": "Bhutan — Northwest",
    "distractors": [
      "Pakistan — Northwest",
      "Nepal — North",
      "Bangladesh — East"
    ],
    "explanation": "Bhutan is a northern neighbour of India, not a northwestern one. Pakistan fits northwest, while Nepal and Bangladesh fit north and east respectively.",
    "sourceFactIds": [
      "MIXED-NEIGHBOUR-DIRECTION-ERROR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-045",
    "qlName": "Mixed neighbour-direction identification",
    "difficulty": "Medium",
    "stem": "Which sequence correctly moves from northwest to north to east around India's land neighbours?",
    "answer": "Pakistan → Bhutan → Myanmar",
    "distractors": [
      "Myanmar → Nepal → Pakistan",
      "Bhutan → Pakistan → Bangladesh",
      "Bangladesh → China → Afghanistan"
    ],
    "explanation": "Pakistan represents the northwest, Bhutan the north and Myanmar the east. The sequence therefore moves through the correct directional groups.",
    "sourceFactIds": [
      "MIXED-DIRECTION-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-045",
    "qlName": "Mixed neighbour-direction identification",
    "difficulty": "Medium",
    "stem": "Neighbour A is north of India, B is east and C is northwest. Which set can represent A, B and C?",
    "answer": "Nepal, Bangladesh, Pakistan",
    "distractors": [
      "Pakistan, Nepal, Myanmar",
      "Bangladesh, Bhutan, Pakistan",
      "Myanmar, Pakistan, Nepal"
    ],
    "explanation": "Nepal is north, Bangladesh east and Pakistan northwest. The other sets place at least one country in the wrong directional category.",
    "sourceFactIds": [
      "MIXED-A-B-C-DIRECTIONS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-045",
    "qlName": "Mixed neighbour-direction identification",
    "difficulty": "Medium",
    "stem": "Which pair lies on different sides of India?",
    "answer": "Pakistan and Bangladesh",
    "distractors": [
      "Bangladesh and Myanmar",
      "Nepal and Bhutan",
      "China and Nepal"
    ],
    "explanation": "Pakistan lies northwest while Bangladesh lies east. The other pairs belong to the same directional group, so they do not show the same contrast.",
    "sourceFactIds": [
      "MIXED-DIFFERENT-DIRECTIONS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-045",
    "qlName": "Mixed neighbour-direction identification",
    "difficulty": "Hard",
    "stem": "A list gives Pakistan–northwest, Bhutan–north, Myanmar–east and Sri Lanka–land neighbour. Which entry must be corrected?",
    "answer": "Sri Lanka — land neighbour",
    "distractors": [
      "Pakistan — northwest",
      "Bhutan — north",
      "Myanmar — east"
    ],
    "explanation": "Pakistan, Bhutan and Myanmar have the correct directional classifications. Sri Lanka is a maritime neighbour separated from India by sea, not a land neighbour.",
    "sourceFactIds": [
      "MIXED-NEIGHBOUR-FINAL-AUDIT"
    ]
  }
]);

export const GEO_LOC_001_CP005_REVIEW_BATCH_V1: readonly GeoLoc001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-LOC-001-CP005-Q${String(index + 1).padStart(3, "0")}`,
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

export function auditGeoLoc001Cp005ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_LOC_001_CP005_REVIEW_BATCH_V1) {
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

  if (GEO_LOC_001_CP005_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_LOC_001_CP005_REVIEW_BATCH_V1.length);
  for (let n = 37; n <= 45; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_LOC_001_CP005_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
