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
    "qlId": "GEO-LOC-001-QL-100",
    "qlName": "Astronomical location + hemispheres + mainland extent",
    "difficulty": "Easy",
    "stem": "Consider two facts about India: it lies north of the Equator and east of the Prime Meridian. Which conclusion follows?",
    "answer": "India lies in the Northern and Eastern Hemispheres",
    "distractors": [
      "India lies in the Northern and Western Hemispheres",
      "India lies in the Southern and Eastern Hemispheres",
      "India lies in the Southern and Western Hemispheres"
    ],
    "explanation": "North of the Equator means the Northern Hemisphere, while east of the Prime Meridian means the Eastern Hemisphere. India therefore lies in the Northern and Eastern Hemispheres.",
    "sourceFactIds": [
      "INTEGRATE-HEMISPHERES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-100",
    "qlName": "Astronomical location + hemispheres + mainland extent",
    "difficulty": "Easy",
    "stem": "Which set gives India's mainland latitude and longitude limits in the correct order?",
    "answer": "8°4'N–37°6'N; 68°7'E–97°25'E",
    "distractors": [
      "68°7'N–97°25'N; 8°4'E–37°6'E",
      "8°4'S–37°6'S; 68°7'E–97°25'E",
      "8°4'N–37°6'N; 68°7'W–97°25'W"
    ],
    "explanation": "Mainland India extends from 8°4'N to 37°6'N in latitude and from 68°7'E to 97°25'E in longitude. The N and E suffixes also match India's hemispheric position.",
    "sourceFactIds": [
      "INTEGRATE-MAINLAND-BOUNDS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-100",
    "qlName": "Astronomical location + hemispheres + mainland extent",
    "difficulty": "Medium",
    "stem": "A point is at 25°N, 80°E. Which two conclusions can be drawn from the chapter's mainland bounds?",
    "answer": "It is in the Northern/Eastern Hemispheres and lies within both mainland coordinate ranges",
    "distractors": [
      "It is in the Southern/Eastern Hemispheres and outside both ranges",
      "It is in the Northern/Western Hemispheres and inside only the latitude range",
      "It is in the Northern/Eastern Hemispheres but outside both mainland ranges"
    ],
    "explanation": "The coordinate uses N and E, placing the point in the Northern and Eastern Hemispheres. Both 25°N and 80°E also fall inside the standard mainland latitude and longitude intervals.",
    "sourceFactIds": [
      "INTEGRATE-COORDINATE-INSIDE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-100",
    "qlName": "Astronomical location + hemispheres + mainland extent",
    "difficulty": "Medium",
    "stem": "Which coordinate fails India's mainland latitude range but still matches India's eastern-hemisphere position?",
    "answer": "40°N, 80°E",
    "distractors": [
      "25°N, 80°E",
      "20°N, 75°E",
      "30°N, 90°E"
    ],
    "explanation": "The longitude 80°E is east of the Prime Meridian and within India's mainland longitude range. But 40°N is north of the mainland's 37°6'N limit.",
    "sourceFactIds": [
      "INTEGRATE-LATITUDE-OUTSIDE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-100",
    "qlName": "Astronomical location + hemispheres + mainland extent",
    "difficulty": "Medium",
    "stem": "Three statements are given: 1. India lies north of the Equator. 2. Mainland India extends east of 97°25'E. 3. India lies east of the Prime Meridian. Which set is accurate?",
    "answer": "Statements 1 and 3 only",
    "distractors": [
      "Statements 1 and 2 only",
      "Statements 2 and 3 only",
      "All three statements"
    ],
    "explanation": "Statements 1 and 3 are true because India lies in the Northern and Eastern Hemispheres. Statement 2 is false because 97°25'E is the stated eastern mainland limit, not a longitude the mainland extends beyond.",
    "sourceFactIds": [
      "INTEGRATE-HEMISPHERE-BOUND-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-100",
    "qlName": "Astronomical location + hemispheres + mainland extent",
    "difficulty": "Hard",
    "stem": "P is at 6°N, 80°E and Q at 25°N, 100°E. Which assessment is accurate?",
    "answer": "P is south of the mainland latitude limit; Q is east of the mainland longitude limit",
    "distractors": [
      "P is east of the mainland longitude limit; Q is north of the latitude limit",
      "Both points lie within the mainland coordinate ranges",
      "P is north of the latitude limit; Q is west of the longitude limit"
    ],
    "explanation": "P fails the mainland latitude test because 6°N is south of 8°4'N. Q fails the longitude test because 100°E is east of 97°25'E, while each point's other coordinate remains within range.",
    "sourceFactIds": [
      "INTEGRATE-TWO-POINT-BOUNDS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-101",
    "qlName": "Tropic of Cancer + Standard Meridian + IST",
    "difficulty": "Easy",
    "stem": "Which pairing of India's major reference lines is accurate?",
    "answer": "Tropic of Cancer — 23°30'N; Standard Meridian — 82°30'E",
    "distractors": [
      "Tropic of Cancer — 82°30'E; Standard Meridian — 23°30'N",
      "Tropic of Cancer — 0°; Standard Meridian — 90°E",
      "Tropic of Cancer — 23°30'S; Standard Meridian — 82°30'W"
    ],
    "explanation": "The Tropic of Cancer is a latitude at 23°30'N. India's Standard Meridian is a longitude at 82°30'E, so the two lines use different coordinate dimensions.",
    "sourceFactIds": [
      "INTEGRATE-TOC-SM-VALUES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-101",
    "qlName": "Tropic of Cancer + Standard Meridian + IST",
    "difficulty": "Easy",
    "stem": "Which numerical combination belongs to the Tropic of Cancer and Standard Meridian in India?",
    "answer": "8 states crossed by the Tropic; 5 states crossed by the Standard Meridian",
    "distractors": [
      "5 states crossed by the Tropic; 8 by the Standard Meridian",
      "8 states crossed by both lines",
      "5 states crossed by both lines"
    ],
    "explanation": "The Tropic of Cancer crosses eight Indian states, while the Standard Meridian crosses five. Keeping the two counts separate is a common map-based requirement.",
    "sourceFactIds": [
      "INTEGRATE-TOC-SM-COUNTS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-101",
    "qlName": "Tropic of Cancer + Standard Meridian + IST",
    "difficulty": "Medium",
    "stem": "Which pair of states is crossed by both the Tropic of Cancer and India's Standard Meridian?",
    "answer": "Madhya Pradesh and Chhattisgarh",
    "distractors": [
      "Rajasthan and Gujarat",
      "Odisha and Andhra Pradesh",
      "Jharkhand and West Bengal"
    ],
    "explanation": "Madhya Pradesh and Chhattisgarh are common to both reference-line routes. The other pairs belong only to the Tropic or only to the Standard Meridian set.",
    "sourceFactIds": [
      "INTEGRATE-TOC-SM-COMMON-STATES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-101",
    "qlName": "Tropic of Cancer + Standard Meridian + IST",
    "difficulty": "Medium",
    "stem": "A line at 82°30'E passes through the Mirzapur region and is used for national time. Which fact completes the description?",
    "answer": "It is the Standard Meridian used for Indian Standard Time",
    "distractors": [
      "It is the Tropic of Cancer used to divide India climatically",
      "It is the Equator used for Indian Standard Time",
      "It is the western mainland limit of India"
    ],
    "explanation": "India's Standard Meridian is 82°30'E and passes through the Mirzapur region. Indian Standard Time is based on this reference longitude.",
    "sourceFactIds": [
      "INTEGRATE-MIRZAPUR-IST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-101",
    "qlName": "Tropic of Cancer + Standard Meridian + IST",
    "difficulty": "Medium",
    "stem": "Which sequence belongs to the Tropic of Cancer rather than the Standard Meridian?",
    "answer": "Gujarat → Rajasthan → Madhya Pradesh → Chhattisgarh",
    "distractors": [
      "Uttar Pradesh → Madhya Pradesh → Chhattisgarh → Odisha",
      "Madhya Pradesh → Chhattisgarh → Odisha → Andhra Pradesh",
      "Uttar Pradesh → Odisha → Andhra Pradesh"
    ],
    "explanation": "Gujarat and Rajasthan are part of the west-to-east Tropic of Cancer route. The Standard Meridian instead runs north to south through Uttar Pradesh, Madhya Pradesh, Chhattisgarh, Odisha and Andhra Pradesh.",
    "sourceFactIds": [
      "INTEGRATE-REFERENCE-LINE-SEQUENCES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-101",
    "qlName": "Tropic of Cancer + Standard Meridian + IST",
    "difficulty": "Hard",
    "stem": "State A is crossed by both 23°30'N and 82°30'E, while State B is crossed by 82°30'E but not by 23°30'N. Which pair can be A and B?",
    "answer": "Chhattisgarh and Odisha",
    "distractors": [
      "Rajasthan and Gujarat",
      "Jharkhand and West Bengal",
      "Tripura and Mizoram"
    ],
    "explanation": "Chhattisgarh is crossed by both the Tropic of Cancer and Standard Meridian. Odisha is crossed by the Standard Meridian but not by the Tropic, so the pair satisfies both clues.",
    "sourceFactIds": [
      "INTEGRATE-REFERENCE-LINE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-102",
    "qlName": "Extreme points + mainland/island distinction",
    "difficulty": "Easy",
    "stem": "Which pairing distinguishes India's southernmost point from the southernmost point of the mainland?",
    "answer": "Indira Point — India; Kanyakumari — mainland",
    "distractors": [
      "Kanyakumari — India; Indira Point — mainland",
      "Minicoy — India; Kanyakumari — mainland",
      "Indira Point — mainland; Minicoy — India"
    ],
    "explanation": "Indira Point on Great Nicobar is India's southernmost point when island territory is included. Kanyakumari is the southernmost point of the Indian mainland.",
    "sourceFactIds": [
      "INTEGRATE-SOUTHERNMOST-DISTINCTION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-102",
    "qlName": "Extreme points + mainland/island distinction",
    "difficulty": "Easy",
    "stem": "Indira Point and Kanyakumari differ because one lies on an island and the other on the mainland. Which is the island location?",
    "answer": "Indira Point",
    "distractors": [
      "Kanyakumari",
      "Both are mainland locations",
      "Neither is in India"
    ],
    "explanation": "Indira Point lies on Great Nicobar Island, whereas Kanyakumari lies at the southern tip of mainland India. This island-mainland distinction explains the two southernmost-point answers.",
    "sourceFactIds": [
      "INTEGRATE-INDIRA-ISLAND"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-102",
    "qlName": "Extreme points + mainland/island distinction",
    "difficulty": "Medium",
    "stem": "Match the locations with their roles: 1. Indira Point 2. Kanyakumari 3. Minicoy. Which match is accurate?",
    "answer": "1 southernmost India; 2 southernmost mainland; 3 southernmost Lakshadweep island",
    "distractors": [
      "1 southernmost mainland; 2 southernmost India; 3 capital of Lakshadweep",
      "1 capital of Andaman and Nicobar; 2 southernmost mainland; 3 southernmost India",
      "1 southernmost Lakshadweep; 2 southernmost India; 3 southernmost mainland"
    ],
    "explanation": "Indira Point marks India's southern extremity, Kanyakumari the mainland's southern extremity and Minicoy the southernmost island of Lakshadweep. The three roles belong to different geographic scales.",
    "sourceFactIds": [
      "INTEGRATE-THREE-SOUTHERN-ROLES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-102",
    "qlName": "Extreme points + mainland/island distinction",
    "difficulty": "Medium",
    "stem": "Which location lies farther south than Kanyakumari and belongs to the Nicobar group?",
    "answer": "Indira Point on Great Nicobar",
    "distractors": [
      "Kavaratti in Lakshadweep",
      "Sri Vijaya Puram in Andaman",
      "Minicoy in Lakshadweep"
    ],
    "explanation": "Indira Point lies on Great Nicobar and is farther south than Kanyakumari. It is the point that makes India's full territorial southern extent reach beyond the mainland.",
    "sourceFactIds": [
      "INTEGRATE-GREAT-NICOBAR-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-102",
    "qlName": "Extreme points + mainland/island distinction",
    "difficulty": "Medium",
    "stem": "Which conclusion follows from the fact that India's islands extend south of the mainland?",
    "answer": "India's southernmost territorial point is not on the mainland",
    "distractors": [
      "Kanyakumari is south of every Indian island",
      "The mainland extends to Indira Point",
      "Lakshadweep contains the southernmost point of India"
    ],
    "explanation": "Island territory extends farther south than the mainland, so India's southernmost territorial point is Indira Point on Great Nicobar. Kanyakumari remains the southernmost mainland point.",
    "sourceFactIds": [
      "INTEGRATE-TERRITORIAL-VS-MAINLAND"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-102",
    "qlName": "Extreme points + mainland/island distinction",
    "difficulty": "Hard",
    "stem": "Location A is the southernmost point of India, B is the southernmost mainland point and C is the southernmost island of Lakshadweep. Which set is correct?",
    "answer": "A Indira Point; B Kanyakumari; C Minicoy",
    "distractors": [
      "A Kanyakumari; B Indira Point; C Kavaratti",
      "A Minicoy; B Kanyakumari; C Great Nicobar",
      "A Indira Point; B Minicoy; C Kanyakumari"
    ],
    "explanation": "Indira Point is India's southernmost point, Kanyakumari is the mainland's southernmost point and Minicoy is Lakshadweep's southernmost island. The set combines three distinct location categories.",
    "sourceFactIds": [
      "INTEGRATE-EXTREME-THREE-CATEGORY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-103",
    "qlName": "Surrounding waters + coasts + maritime orientation",
    "difficulty": "Easy",
    "stem": "Which three-part arrangement around India is accurate?",
    "answer": "Arabian Sea west; Bay of Bengal east; Indian Ocean south",
    "distractors": [
      "Bay of Bengal west; Arabian Sea east; Indian Ocean north",
      "Indian Ocean west; Arabian Sea south; Bay of Bengal north",
      "Arabian Sea north; Bay of Bengal south; Indian Ocean east"
    ],
    "explanation": "India's western coast faces the Arabian Sea, its eastern coast faces the Bay of Bengal and the Indian Ocean lies to the south. This is the basic maritime frame of the peninsula.",
    "sourceFactIds": [
      "INTEGRATE-WATERS-THREE-SIDES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-103",
    "qlName": "Surrounding waters + coasts + maritime orientation",
    "difficulty": "Easy",
    "stem": "Which coast–water pair is accurate?",
    "answer": "Western coast — Arabian Sea",
    "distractors": [
      "Western coast — Bay of Bengal",
      "Eastern coast — Arabian Sea",
      "Northern frontier — Indian Ocean"
    ],
    "explanation": "India's western coast opens onto the Arabian Sea. The eastern coast opens onto the Bay of Bengal, while the northern side is a land frontier.",
    "sourceFactIds": [
      "INTEGRATE-COAST-WATER-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-103",
    "qlName": "Surrounding waters + coasts + maritime orientation",
    "difficulty": "Medium",
    "stem": "A ship travels from India's west coast around the southern peninsula to the east coast. Which water sequence fits the route?",
    "answer": "Arabian Sea → Indian Ocean → Bay of Bengal",
    "distractors": [
      "Bay of Bengal → Arabian Sea → Indian Ocean",
      "Arabian Sea → Bay of Bengal → Indian Ocean",
      "Indian Ocean → Bay of Bengal → Arabian Sea"
    ],
    "explanation": "The west coast faces the Arabian Sea, the southern tip projects into the Indian Ocean and the east coast faces the Bay of Bengal. The route therefore follows that sequence.",
    "sourceFactIds": [
      "INTEGRATE-WEST-TO-EAST-SEA-ROUTE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-103",
    "qlName": "Surrounding waters + coasts + maritime orientation",
    "difficulty": "Medium",
    "stem": "Which regional pairing fits India's two maritime sides?",
    "answer": "Western coast toward West Asia; eastern coast toward Southeast Asia",
    "distractors": [
      "Western coast toward Southeast Asia; eastern coast toward West Asia",
      "Both coasts toward West Asia",
      "Both coasts toward Southeast Asia"
    ],
    "explanation": "The western coast opens through the Arabian Sea toward West Asia, while the eastern coast opens through the Bay of Bengal toward Southeast Asia. The two sides therefore face different regional route systems.",
    "sourceFactIds": [
      "INTEGRATE-MARITIME-REGIONS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-103",
    "qlName": "Surrounding waters + coasts + maritime orientation",
    "difficulty": "Medium",
    "stem": "Which island territory belongs with the western maritime side rather than the eastern maritime side?",
    "answer": "Lakshadweep",
    "distractors": [
      "Andaman and Nicobar Islands",
      "Sri Vijaya Puram",
      "Great Nicobar"
    ],
    "explanation": "Lakshadweep lies in the Arabian Sea on India's western maritime side. Andaman and Nicobar Islands, including Great Nicobar and Sri Vijaya Puram, lie on the eastern/southeastern side.",
    "sourceFactIds": [
      "INTEGRATE-ISLAND-MARITIME-SIDE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-103",
    "qlName": "Surrounding waters + coasts + maritime orientation",
    "difficulty": "Hard",
    "stem": "Map labels A west of India, B east, C south, and D as the western island Union Territory. Which identification fits all four labels?",
    "answer": "A Arabian Sea; B Bay of Bengal; C Indian Ocean; D Lakshadweep",
    "distractors": [
      "A Bay of Bengal; B Arabian Sea; C Indian Ocean; D Andaman and Nicobar",
      "A Arabian Sea; B Indian Ocean; C Bay of Bengal; D Lakshadweep",
      "A Indian Ocean; B Bay of Bengal; C Arabian Sea; D Andaman and Nicobar"
    ],
    "explanation": "The Arabian Sea lies west, Bay of Bengal east and Indian Ocean south of India. Lakshadweep is the island Union Territory on the western Arabian Sea side.",
    "sourceFactIds": [
      "INTEGRATE-MARITIME-MAP-FOUR-LABELS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-104",
    "qlName": "Land/maritime neighbours + directional relations",
    "difficulty": "Easy",
    "stem": "Which directional grouping of India's land neighbours is accurate?",
    "answer": "Northwest: Pakistan/Afghanistan; North: China/Nepal/Bhutan; East: Bangladesh/Myanmar",
    "distractors": [
      "Northwest: Bangladesh/Myanmar; North: Pakistan/Afghanistan; East: China/Nepal/Bhutan",
      "Northwest: China/Nepal/Bhutan; North: Bangladesh/Myanmar; East: Pakistan/Afghanistan",
      "Northwest: Sri Lanka/Maldives; North: Bangladesh/Myanmar; East: Pakistan/Afghanistan"
    ],
    "explanation": "Pakistan and Afghanistan lie northwest, China/Nepal/Bhutan north, and Bangladesh/Myanmar east of India. Sri Lanka and Maldives are maritime neighbours rather than land neighbours.",
    "sourceFactIds": [
      "INTEGRATE-LAND-NEIGHBOUR-GROUPS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-104",
    "qlName": "Land/maritime neighbours + directional relations",
    "difficulty": "Easy",
    "stem": "Which pair contains only India's maritime neighbours?",
    "answer": "Sri Lanka and Maldives",
    "distractors": [
      "Nepal and Bhutan",
      "Bangladesh and Myanmar",
      "Pakistan and Afghanistan"
    ],
    "explanation": "Sri Lanka and Maldives are separated from India by sea and belong to the maritime-neighbour group. The other pairs share land frontiers with India.",
    "sourceFactIds": [
      "INTEGRATE-MARITIME-NEIGHBOUR-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-104",
    "qlName": "Land/maritime neighbours + directional relations",
    "difficulty": "Medium",
    "stem": "Match each country with its side of India: Pakistan, Nepal, Bangladesh. Which sequence is accurate?",
    "answer": "Northwest, North, East",
    "distractors": [
      "East, Northwest, North",
      "North, East, Northwest",
      "Northwest, East, North"
    ],
    "explanation": "Pakistan lies northwest of India, Nepal lies north and Bangladesh lies east. The sequence combines three distinct directional neighbour groups.",
    "sourceFactIds": [
      "INTEGRATE-THREE-NEIGHBOUR-DIRECTIONS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-104",
    "qlName": "Land/maritime neighbours + directional relations",
    "difficulty": "Medium",
    "stem": "Which country changes the set Nepal, Bhutan, Myanmar, Sri Lanka from an all-land-neighbour set to a mixed set?",
    "answer": "Sri Lanka",
    "distractors": [
      "Nepal",
      "Bhutan",
      "Myanmar"
    ],
    "explanation": "Nepal, Bhutan and Myanmar share land frontiers with India. Sri Lanka is separated by sea, so its inclusion makes the set a mix of land and maritime neighbours.",
    "sourceFactIds": [
      "INTEGRATE-MIXED-NEIGHBOUR-SET"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-104",
    "qlName": "Land/maritime neighbours + directional relations",
    "difficulty": "Medium",
    "stem": "Which regional relation is accurate?",
    "answer": "Pakistan lies west/northwest of India while Bangladesh lies east",
    "distractors": [
      "Bangladesh lies west while Pakistan lies east",
      "Nepal lies southwest while Myanmar lies northwest",
      "Sri Lanka lies north while Bhutan lies south"
    ],
    "explanation": "Pakistan forms India's western/northwestern neighbour side, while Bangladesh lies to the east. The other options reverse well-established map directions.",
    "sourceFactIds": [
      "INTEGRATE-PAK-BD-CONTRAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-104",
    "qlName": "Land/maritime neighbours + directional relations",
    "difficulty": "Hard",
    "stem": "Country A lies northwest of India, B lies east, and island country C lies south across the sea. Which set can be A, B and C?",
    "answer": "Pakistan, Bangladesh, Sri Lanka",
    "distractors": [
      "Bangladesh, Pakistan, Nepal",
      "Nepal, Myanmar, Bhutan",
      "Pakistan, Nepal, Maldives"
    ],
    "explanation": "Pakistan fits the northwest clue, Bangladesh the east clue and Sri Lanka the southern maritime clue. Only the first set satisfies all three directional categories.",
    "sourceFactIds": [
      "INTEGRATE-NEIGHBOUR-THREE-CLUE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-105",
    "qlName": "Straits/channels + island-group matching",
    "difficulty": "Easy",
    "stem": "Which passage–location match is accurate?",
    "answer": "Palk Strait — India and Sri Lanka",
    "distractors": [
      "Palk Strait — Andaman and Nicobar groups",
      "Palk Strait — Minicoy and Maldives",
      "Palk Strait — Rutland and Little Andaman"
    ],
    "explanation": "Palk Strait lies between southeastern India and Sri Lanka. The other separations belong to named channels in Lakshadweep or the Andaman region.",
    "sourceFactIds": [
      "INTEGRATE-PALK-MATCH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-105",
    "qlName": "Straits/channels + island-group matching",
    "difficulty": "Easy",
    "stem": "Which pair of channels belongs to the Minicoy–Lakshadweep–Maldives setting?",
    "answer": "Eight Degree Channel and Nine Degree Channel",
    "distractors": [
      "Ten Degree Channel and Duncan Passage",
      "Palk Strait and Great Channel",
      "Duncan Passage and Gulf of Mannar"
    ],
    "explanation": "The Eight Degree Channel lies south of Minicoy toward the Maldives, while the Nine Degree Channel separates Minicoy from the rest of Lakshadweep. Both belong to the same western island setting.",
    "sourceFactIds": [
      "INTEGRATE-EIGHT-NINE-DEGREE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-105",
    "qlName": "Straits/channels + island-group matching",
    "difficulty": "Medium",
    "stem": "Which three-way match is accurate: Ten Degree Channel, Duncan Passage, Great Channel?",
    "answer": "Andaman–Nicobar; Rutland–Little Andaman; Nicobar–northern Sumatra",
    "distractors": [
      "Minicoy–Maldives; Andaman–Nicobar; India–Sri Lanka",
      "Rutland–Little Andaman; Minicoy–Maldives; Andaman–Nicobar",
      "India–Sri Lanka; Nicobar–Sumatra; Minicoy–Lakshadweep"
    ],
    "explanation": "Ten Degree Channel divides the Andaman and Nicobar groups. Duncan Passage lies between Rutland and Little Andaman, while Great Channel lies toward northern Sumatra from the Nicobar region.",
    "sourceFactIds": [
      "INTEGRATE-THREE-CHANNEL-MATCH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-105",
    "qlName": "Straits/channels + island-group matching",
    "difficulty": "Medium",
    "stem": "A ship sails north from Minicoy toward Kavaratti and another sails south from Minicoy toward Maldives. Which channels do they cross first?",
    "answer": "Nine Degree Channel northward; Eight Degree Channel southward",
    "distractors": [
      "Eight Degree Channel northward; Nine Degree Channel southward",
      "Ten Degree Channel northward; Duncan Passage southward",
      "Palk Strait northward; Great Channel southward"
    ],
    "explanation": "The Nine Degree Channel lies between Minicoy and the main Lakshadweep group to the north. The Eight Degree Channel lies south of Minicoy toward the Maldives.",
    "sourceFactIds": [
      "INTEGRATE-MINICOY-TWO-DIRECTIONS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-105",
    "qlName": "Straits/channels + island-group matching",
    "difficulty": "Medium",
    "stem": "Which channel belongs to the Andaman region but does not separate the Andaman and Nicobar groups?",
    "answer": "Duncan Passage",
    "distractors": [
      "Ten Degree Channel",
      "Eight Degree Channel",
      "Nine Degree Channel"
    ],
    "explanation": "Duncan Passage lies within the Andaman region between Rutland and Little Andaman. Ten Degree Channel is the larger division between the Andaman and Nicobar groups.",
    "sourceFactIds": [
      "INTEGRATE-DUNCAN-VS-TEN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-105",
    "qlName": "Straits/channels + island-group matching",
    "difficulty": "Hard",
    "stem": "Match A–D: A Palk Strait, B Nine Degree Channel, C Ten Degree Channel, D Great Channel. Which location sequence is accurate?",
    "answer": "India–Sri Lanka; Minicoy–rest of Lakshadweep; Andaman–Nicobar; Nicobar–northern Sumatra",
    "distractors": [
      "Minicoy–Maldives; India–Sri Lanka; Rutland–Little Andaman; Andaman–Nicobar",
      "India–Sri Lanka; Andaman–Nicobar; Minicoy–Lakshadweep; Rutland–Little Andaman",
      "Andaman–Nicobar; Minicoy–Maldives; India–Sri Lanka; Nicobar–Sumatra"
    ],
    "explanation": "Palk Strait belongs to India–Sri Lanka, Nine Degree Channel to Minicoy–Lakshadweep, Ten Degree Channel to Andaman–Nicobar and Great Channel to the Nicobar–Sumatra setting. The sequence therefore matches the first option.",
    "sourceFactIds": [
      "INTEGRATE-FOUR-CHANNEL-MATCH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-106",
    "qlName": "Reference lines + State/UT map associations",
    "difficulty": "Easy",
    "stem": "Which statement about India's two major reference lines is accurate?",
    "answer": "The Tropic of Cancer crosses 8 states; the Standard Meridian crosses 5",
    "distractors": [
      "The Tropic crosses 5 states; the Standard Meridian crosses 8",
      "Both cross 8 states",
      "Both cross 5 states"
    ],
    "explanation": "The Tropic of Cancer crosses eight states across India, while the Standard Meridian crosses five states from north to south. These are separate state-map sets.",
    "sourceFactIds": [
      "INTEGRATE-REFERENCE-LINE-COUNTS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-106",
    "qlName": "Reference lines + State/UT map associations",
    "difficulty": "Easy",
    "stem": "Which pair of states belongs to both reference-line sets?",
    "answer": "Madhya Pradesh and Chhattisgarh",
    "distractors": [
      "Gujarat and Rajasthan",
      "Odisha and Andhra Pradesh",
      "Tripura and Mizoram"
    ],
    "explanation": "Madhya Pradesh and Chhattisgarh are crossed by both the Tropic of Cancer and the Standard Meridian. The other pairs belong only to one line.",
    "sourceFactIds": [
      "INTEGRATE-REFERENCE-LINE-OVERLAP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-106",
    "qlName": "Reference lines + State/UT map associations",
    "difficulty": "Medium",
    "stem": "Which classification is accurate?",
    "answer": "Rajasthan — Tropic only; Odisha — Standard Meridian only; Chhattisgarh — both",
    "distractors": [
      "Rajasthan — both; Odisha — Tropic only; Chhattisgarh — Standard only",
      "Rajasthan — Standard only; Odisha — both; Chhattisgarh — Tropic only",
      "Rajasthan — neither; Odisha — Tropic only; Chhattisgarh — neither"
    ],
    "explanation": "Rajasthan lies on the Tropic of Cancer, Odisha on the Standard Meridian and Chhattisgarh on both. The three states therefore represent the three different line relationships.",
    "sourceFactIds": [
      "INTEGRATE-LINE-THREE-CATEGORIES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-106",
    "qlName": "Reference lines + State/UT map associations",
    "difficulty": "Medium",
    "stem": "Which two sequences belong to different reference lines but are both accurate?",
    "answer": "Gujarat → Rajasthan → Madhya Pradesh; Uttar Pradesh → Madhya Pradesh → Chhattisgarh",
    "distractors": [
      "Rajasthan → Gujarat → Madhya Pradesh; Andhra Pradesh → Odisha → Uttar Pradesh",
      "Gujarat → Madhya Pradesh → Rajasthan; Chhattisgarh → Uttar Pradesh → Odisha",
      "Mizoram → Tripura → West Bengal; Andhra Pradesh → Madhya Pradesh → Uttar Pradesh"
    ],
    "explanation": "The first sequence follows the Tropic of Cancer west to east, while the second follows the Standard Meridian north to south. Both preserve the correct map order.",
    "sourceFactIds": [
      "INTEGRATE-TWO-LINE-ORDERS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-106",
    "qlName": "Reference lines + State/UT map associations",
    "difficulty": "Medium",
    "stem": "Which state is crossed by the Tropic of Cancer, lies east of Jharkhand in that sequence and is not on the Standard Meridian?",
    "answer": "West Bengal",
    "distractors": [
      "Odisha",
      "Madhya Pradesh",
      "Chhattisgarh"
    ],
    "explanation": "West Bengal lies east of Jharkhand on the Tropic of Cancer route and is not crossed by the Standard Meridian. Madhya Pradesh and Chhattisgarh are on both lines.",
    "sourceFactIds": [
      "INTEGRATE-WB-LINE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-106",
    "qlName": "Reference lines + State/UT map associations",
    "difficulty": "Medium",
    "stem": "A state is south of Odisha on the Standard Meridian and is not crossed by the Tropic of Cancer. Which state fits?",
    "answer": "Andhra Pradesh",
    "distractors": [
      "Chhattisgarh",
      "Jharkhand",
      "West Bengal"
    ],
    "explanation": "Andhra Pradesh lies south of Odisha on the Standard Meridian and is not crossed by the Tropic of Cancer. The clues combine north–south order with line membership.",
    "sourceFactIds": [
      "INTEGRATE-AP-LINE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-107",
    "qlName": "Coastal/border State/UT + South Asia regional integration",
    "difficulty": "Easy",
    "stem": "Which state is both coastal and shares an international border with Bangladesh?",
    "answer": "West Bengal",
    "distractors": [
      "Odisha",
      "Goa",
      "Kerala"
    ],
    "explanation": "West Bengal has a Bay of Bengal coastline and also shares a land border with Bangladesh. Odisha, Goa and Kerala are coastal but do not border Bangladesh.",
    "sourceFactIds": [
      "INTEGRATE-COAST-BANGLADESH-WB"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-107",
    "qlName": "Coastal/border State/UT + South Asia regional integration",
    "difficulty": "Easy",
    "stem": "Which west-to-east regional frame around India is accurate?",
    "answer": "Pakistan → India → Bangladesh",
    "distractors": [
      "Bangladesh → India → Pakistan",
      "India → Bangladesh → Pakistan",
      "Pakistan → Bangladesh → India"
    ],
    "explanation": "Pakistan lies west/northwest of India and Bangladesh lies east. This gives the regional west-to-east order Pakistan, India, Bangladesh.",
    "sourceFactIds": [
      "INTEGRATE-SOUTH-ASIA-WEST-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-107",
    "qlName": "Coastal/border State/UT + South Asia regional integration",
    "difficulty": "Medium",
    "stem": "Which state is both on India's eastern side and shares borders with Bangladesh and Myanmar?",
    "answer": "Mizoram",
    "distractors": [
      "Tripura",
      "Assam",
      "Manipur"
    ],
    "explanation": "Mizoram borders Bangladesh and Myanmar, placing it at a junction of India's eastern international frontier. Tripura lacks a Myanmar border, while Manipur lacks a Bangladesh border.",
    "sourceFactIds": [
      "INTEGRATE-BD-MYANMAR-MIZORAM"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-107",
    "qlName": "Coastal/border State/UT + South Asia regional integration",
    "difficulty": "Medium",
    "stem": "Which coastal sequence and regional orientation are both accurate?",
    "answer": "Gujarat → Maharashtra → Goa on the west; West Bengal → Odisha → Andhra Pradesh on the east",
    "distractors": [
      "Goa → Maharashtra → Gujarat on the west; Odisha → West Bengal → Andhra Pradesh on the east",
      "Gujarat → Goa → Maharashtra on the west; Andhra Pradesh → Odisha → West Bengal on the east",
      "Kerala → Gujarat → Goa on the west; Tamil Nadu → West Bengal → Odisha on the east"
    ],
    "explanation": "The western sequence proceeds southward from Gujarat to Maharashtra to Goa. On the eastern side, the north-to-south order begins West Bengal, Odisha and Andhra Pradesh.",
    "sourceFactIds": [
      "INTEGRATE-TWO-COAST-SEQUENCES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-107",
    "qlName": "Coastal/border State/UT + South Asia regional integration",
    "difficulty": "Medium",
    "stem": "Which state links Nepal, Bhutan and Bangladesh in one international-border pattern and also has a coastline?",
    "answer": "West Bengal",
    "distractors": [
      "Sikkim",
      "Assam",
      "Bihar"
    ],
    "explanation": "West Bengal borders Nepal, Bhutan and Bangladesh and also reaches the Bay of Bengal. The other options do not combine all three international borders with a coastline.",
    "sourceFactIds": [
      "INTEGRATE-WB-FOUR-WAY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-107",
    "qlName": "Coastal/border State/UT + South Asia regional integration",
    "difficulty": "Medium",
    "stem": "Which pairing joins India's western maritime approach with its eastern regional neighbour frame?",
    "answer": "Arabian Sea — West Asia; Bangladesh — east of India",
    "distractors": [
      "Bay of Bengal — West Asia; Pakistan — east of India",
      "Arabian Sea — Southeast Asia; Bangladesh — west of India",
      "Indian Ocean — Central Asia; Nepal — south of India"
    ],
    "explanation": "The Arabian Sea supports India's western maritime orientation toward West Asia, while Bangladesh lies on India's eastern land side. The pair combines correct maritime and regional directions.",
    "sourceFactIds": [
      "INTEGRATE-MARITIME-LAND-REGION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-108",
    "qlName": "Mixed coordinate + direction + map inference",
    "difficulty": "Easy",
    "stem": "A point at 25°N, 90°E lies where relative to the Tropic of Cancer and Standard Meridian?",
    "answer": "North of the Tropic and east of the Standard Meridian",
    "distractors": [
      "South of the Tropic and west of the Standard Meridian",
      "North of the Tropic and west of the Standard Meridian",
      "South of the Tropic and east of the Standard Meridian"
    ],
    "explanation": "25°N is north of 23°30'N, and 90°E is east of 82°30'E. The point therefore lies northeast of the two reference lines.",
    "sourceFactIds": [
      "INTEGRATE-COORDINATE-NE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-108",
    "qlName": "Mixed coordinate + direction + map inference",
    "difficulty": "Easy",
    "stem": "A point at 20°N, 75°E lies where relative to the Tropic of Cancer and Standard Meridian?",
    "answer": "South of the Tropic and west of the Standard Meridian",
    "distractors": [
      "North of the Tropic and east of the Standard Meridian",
      "North of the Tropic and west of the Standard Meridian",
      "South of the Tropic and east of the Standard Meridian"
    ],
    "explanation": "20°N is south of 23°30'N, while 75°E is west of 82°30'E. The point therefore lies southwest of the two reference lines.",
    "sourceFactIds": [
      "INTEGRATE-COORDINATE-SW"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-108",
    "qlName": "Mixed coordinate + direction + map inference",
    "difficulty": "Medium",
    "stem": "Which coordinate is inside mainland bounds, north of the Tropic of Cancer and east of the Standard Meridian?",
    "answer": "28°N, 90°E",
    "distractors": [
      "20°N, 90°E",
      "28°N, 75°E",
      "40°N, 90°E"
    ],
    "explanation": "28°N, 90°E is inside the mainland coordinate intervals, above 23°30'N and east of 82°30'E. Each distractor fails at least one of those three tests.",
    "sourceFactIds": [
      "INTEGRATE-COORDINATE-THREE-TESTS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-108",
    "qlName": "Mixed coordinate + direction + map inference",
    "difficulty": "Medium",
    "stem": "Place P is west of the Standard Meridian and north of the Tropic of Cancer. Which coordinate can represent P?",
    "answer": "30°N, 75°E",
    "distractors": [
      "20°N, 75°E",
      "30°N, 90°E",
      "20°N, 90°E"
    ],
    "explanation": "P needs latitude above 23°30'N and longitude below 82°30'E. Only 30°N, 75°E satisfies both directional conditions and remains in the required northwestern quadrant.",
    "sourceFactIds": [
      "INTEGRATE-COORDINATE-NW"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-108",
    "qlName": "Mixed coordinate + direction + map inference",
    "difficulty": "Medium",
    "stem": "A map point lies east of India's Standard Meridian and on the eastern maritime side of the peninsula. Which water body is the natural coast-facing clue?",
    "answer": "Bay of Bengal",
    "distractors": [
      "Arabian Sea",
      "Red Sea",
      "Persian Gulf"
    ],
    "explanation": "The Bay of Bengal lies on India's eastern maritime side, the same side as longitudes east of the Standard Meridian. The Arabian Sea belongs to the western coast.",
    "sourceFactIds": [
      "INTEGRATE-EAST-COORDINATE-WATER"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-108",
    "qlName": "Mixed coordinate + direction + map inference",
    "difficulty": "Medium",
    "stem": "A location is south of the Tropic of Cancer, west of the Standard Meridian and still inside mainland bounds. Which coordinate is possible?",
    "answer": "18°N, 75°E",
    "distractors": [
      "25°N, 75°E",
      "18°N, 90°E",
      "5°N, 75°E"
    ],
    "explanation": "18°N is south of 23°30'N, 75°E is west of 82°30'E, and both values remain inside the mainland coordinate limits. The other options fail one of these conditions.",
    "sourceFactIds": [
      "INTEGRATE-COORDINATE-SW-IN-BOUNDS"
    ]
  }
]);

export const GEO_LOC_001_CP012_REVIEW_BATCH_V1: readonly GeoLoc001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-LOC-001-CP012-Q${String(index + 1).padStart(3, "0")}`,
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

export function auditGeoLoc001Cp012ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_LOC_001_CP012_REVIEW_BATCH_V1) {
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
    if (q.stem.length < 20 || q.stem.length > 360 || !q.stem.trim().endsWith("?")) issues.push("STEM_SHAPE:" + q.questionId);
    if (q.explanation.length < 115) issues.push("SHORT_EXPLANATION:" + q.questionId);
    if ((q.explanation.match(/[.!?](?:\s|$)/g) ?? []).length < 2) issues.push("EXPLANATION_DEPTH:" + q.questionId);
  }

  if (GEO_LOC_001_CP012_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_LOC_001_CP012_REVIEW_BATCH_V1.length);
  for (let n = 100; n <= 108; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_LOC_001_CP012_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
