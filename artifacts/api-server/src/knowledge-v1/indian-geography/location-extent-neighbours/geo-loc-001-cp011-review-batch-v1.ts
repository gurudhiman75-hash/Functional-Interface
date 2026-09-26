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
    "qlId": "GEO-LOC-001-QL-091",
    "qlName": "Latitude-based north/south comparison",
    "difficulty": "Easy",
    "stem": "Which place is farther north: 30°N or 20°N?",
    "answer": "30°N",
    "distractors": [
      "20°N",
      "Both are equally north",
      "Longitude is needed to compare"
    ],
    "explanation": "Within the Northern Hemisphere, a larger north latitude lies farther from the Equator. Therefore 30°N is north of 20°N.",
    "sourceFactIds": [
      "LATITUDE-LARGER-NORTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-091",
    "qlName": "Latitude-based north/south comparison",
    "difficulty": "Easy",
    "stem": "Place A is at 12°N and Place B at 28°N. Which place is farther south?",
    "answer": "Place A",
    "distractors": [
      "Place B",
      "Both are at the same latitude",
      "The longitude decides it"
    ],
    "explanation": "Both places are north of the Equator, but 12°N is the smaller north latitude. A smaller north latitude lies farther south, so Place A is farther south.",
    "sourceFactIds": [
      "LATITUDE-SMALLER-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-091",
    "qlName": "Latitude-based north/south comparison",
    "difficulty": "Medium",
    "stem": "Which north-to-south order is correct for 35°N, 25°N and 15°N?",
    "answer": "35°N → 25°N → 15°N",
    "distractors": [
      "15°N → 25°N → 35°N",
      "25°N → 35°N → 15°N",
      "35°N → 15°N → 25°N"
    ],
    "explanation": "For north latitudes, the larger value lies farther north. Sorting from north to south therefore gives 35°N, then 25°N, then 15°N.",
    "sourceFactIds": [
      "LATITUDE-NORTH-SOUTH-ORDER"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-091",
    "qlName": "Latitude-based north/south comparison",
    "difficulty": "Medium",
    "stem": "A point moves from 10°N to 24°N without changing longitude. In which direction has it moved?",
    "answer": "North",
    "distractors": [
      "South",
      "East",
      "West"
    ],
    "explanation": "The north latitude has increased from 10°N to 24°N. Increasing north latitude means moving farther north while longitude remains unchanged.",
    "sourceFactIds": [
      "LATITUDE-MOVEMENT-NORTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-091",
    "qlName": "Latitude-based north/south comparison",
    "difficulty": "Medium",
    "stem": "Which latitude lies between 18°N and 30°N?",
    "answer": "24°N",
    "distractors": [
      "12°N",
      "35°N",
      "40°N"
    ],
    "explanation": "A latitude between 18°N and 30°N must have a numerical value greater than 18 and less than 30. Only 24°N satisfies that condition.",
    "sourceFactIds": [
      "LATITUDE-BETWEEN-RANGE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-091",
    "qlName": "Latitude-based north/south comparison",
    "difficulty": "Medium",
    "stem": "Point P is at 14°N, Q at 26°N and R at 33°N. Which point lies between the other two in north–south position?",
    "answer": "Point Q",
    "distractors": [
      "Point P",
      "Point R",
      "P and R together"
    ],
    "explanation": "The latitudes increase from P at 14°N to Q at 26°N to R at 33°N. Q therefore occupies the middle north–south position.",
    "sourceFactIds": [
      "LATITUDE-MIDDLE-POINT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-092",
    "qlName": "Longitude-based east/west comparison",
    "difficulty": "Easy",
    "stem": "Which place lies farther east: 90°E or 70°E?",
    "answer": "90°E",
    "distractors": [
      "70°E",
      "Both are equally east",
      "Latitude is needed to compare"
    ],
    "explanation": "Among east longitudes, the larger value lies farther east of the Prime Meridian. Therefore 90°E lies east of 70°E, while 70°E is comparatively farther west.",
    "sourceFactIds": [
      "LONGITUDE-LARGER-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-092",
    "qlName": "Longitude-based east/west comparison",
    "difficulty": "Easy",
    "stem": "Place A is at 72°E and Place B at 88°E. Which place lies farther west?",
    "answer": "Place A",
    "distractors": [
      "Place B",
      "Both lie at the same longitude",
      "Latitude decides it"
    ],
    "explanation": "Both are east longitudes, but 72°E is the smaller value. A smaller east longitude lies farther west, so Place A is farther west.",
    "sourceFactIds": [
      "LONGITUDE-SMALLER-WEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-092",
    "qlName": "Longitude-based east/west comparison",
    "difficulty": "Medium",
    "stem": "Which west-to-east order is correct for 70°E, 82°E and 95°E?",
    "answer": "70°E → 82°E → 95°E",
    "distractors": [
      "95°E → 82°E → 70°E",
      "82°E → 70°E → 95°E",
      "70°E → 95°E → 82°E"
    ],
    "explanation": "East longitude values increase as one moves eastward. The correct west-to-east order is therefore 70°E, then 82°E, then 95°E.",
    "sourceFactIds": [
      "LONGITUDE-WEST-EAST-ORDER"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-092",
    "qlName": "Longitude-based east/west comparison",
    "difficulty": "Medium",
    "stem": "A point moves from 75°E to 92°E without changing latitude. In which direction has it moved?",
    "answer": "East",
    "distractors": [
      "West",
      "North",
      "South"
    ],
    "explanation": "The east longitude has increased from 75°E to 92°E. Increasing east longitude means moving eastward while latitude stays the same.",
    "sourceFactIds": [
      "LONGITUDE-MOVEMENT-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-092",
    "qlName": "Longitude-based east/west comparison",
    "difficulty": "Medium",
    "stem": "Which longitude lies between 70°E and 90°E?",
    "answer": "82°E",
    "distractors": [
      "65°E",
      "95°E",
      "100°E"
    ],
    "explanation": "A longitude between 70°E and 90°E must have a numerical value inside that interval. Only 82°E lies between the two limits.",
    "sourceFactIds": [
      "LONGITUDE-BETWEEN-RANGE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-092",
    "qlName": "Longitude-based east/west comparison",
    "difficulty": "Medium",
    "stem": "Point P is at 69°E, Q at 83°E and R at 96°E. Which point lies between the other two in east–west position?",
    "answer": "Point Q",
    "distractors": [
      "Point P",
      "Point R",
      "P and R together"
    ],
    "explanation": "The longitude values increase from P to Q to R. Q at 83°E therefore occupies the middle east–west position between 69°E and 96°E.",
    "sourceFactIds": [
      "LONGITUDE-MIDDLE-POINT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-093",
    "qlName": "Coordinate bounds: inside/outside mainland extent",
    "difficulty": "Easy",
    "stem": "Which coordinate pair lies within mainland India's latitude and longitude ranges?",
    "answer": "20°N, 80°E",
    "distractors": [
      "5°N, 80°E",
      "20°N, 105°E",
      "40°N, 80°E"
    ],
    "explanation": "Mainland India lies within 8°4'N–37°6'N and 68°7'E–97°25'E. The pair 20°N, 80°E falls inside both numerical ranges.",
    "sourceFactIds": [
      "COORDINATE-IN-BOUNDS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-093",
    "qlName": "Coordinate bounds: inside/outside mainland extent",
    "difficulty": "Easy",
    "stem": "Which coordinate lies outside mainland India's northern latitude limit?",
    "answer": "40°N, 80°E",
    "distractors": [
      "30°N, 80°E",
      "20°N, 80°E",
      "10°N, 80°E"
    ],
    "explanation": "Mainland India's northern latitude limit is 37°6'N. A point at 40°N lies beyond that northern bound even though its longitude is within range.",
    "sourceFactIds": [
      "COORDINATE-OUT-NORTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-093",
    "qlName": "Coordinate bounds: inside/outside mainland extent",
    "difficulty": "Medium",
    "stem": "A point is at 25°N, 65°E. Which mainland bound does it fall outside?",
    "answer": "Western longitude limit",
    "distractors": [
      "Eastern longitude limit",
      "Northern latitude limit",
      "Southern latitude limit"
    ],
    "explanation": "The latitude 25°N lies inside India's mainland range, but 65°E is west of the 68°7'E western limit. The point therefore fails only the longitude test.",
    "sourceFactIds": [
      "COORDINATE-OUT-WEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-093",
    "qlName": "Coordinate bounds: inside/outside mainland extent",
    "difficulty": "Medium",
    "stem": "A point is at 6°N, 75°E. Which mainland bound does it fall outside?",
    "answer": "Southern latitude limit",
    "distractors": [
      "Northern latitude limit",
      "Western longitude limit",
      "Eastern longitude limit"
    ],
    "explanation": "The longitude 75°E lies within mainland India's east–west range. However, 6°N is south of the 8°4'N southern latitude limit, so the point falls outside the mainland range.",
    "sourceFactIds": [
      "COORDINATE-OUT-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-093",
    "qlName": "Coordinate bounds: inside/outside mainland extent",
    "difficulty": "Medium",
    "stem": "Which point satisfies the latitude range but fails the longitude range of mainland India?",
    "answer": "25°N, 100°E",
    "distractors": [
      "25°N, 80°E",
      "40°N, 80°E",
      "5°N, 80°E"
    ],
    "explanation": "The latitude 25°N is within the mainland interval, but 100°E lies east of the 97°25'E limit. The other outside points fail the latitude range instead.",
    "sourceFactIds": [
      "COORDINATE-LAT-IN-LONG-OUT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-093",
    "qlName": "Coordinate bounds: inside/outside mainland extent",
    "difficulty": "Hard",
    "stem": "P is 12°N, 72°E; Q is 38°N, 75°E; R is 20°N, 99°E. Which point fits both mainland coordinate ranges?",
    "answer": "Point P",
    "distractors": [
      "Point Q",
      "Point R",
      "Points Q and R"
    ],
    "explanation": "P lies inside both latitude and longitude intervals. Q exceeds the northern limit of 37°6'N, while R exceeds the eastern limit of 97°25'E.",
    "sourceFactIds": [
      "COORDINATE-THREE-POINT-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-094",
    "qlName": "North/south of Tropic of Cancer reasoning",
    "difficulty": "Easy",
    "stem": "A place at 20°N lies on which side of the Tropic of Cancer?",
    "answer": "South",
    "distractors": [
      "North",
      "Exactly on it",
      "Its longitude decides"
    ],
    "explanation": "The Tropic of Cancer lies at 23°30'N. Since 20°N is a smaller north latitude, the place lies south of the Tropic and closer to the Equator.",
    "sourceFactIds": [
      "TOC-SOUTH-20N"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-094",
    "qlName": "North/south of Tropic of Cancer reasoning",
    "difficulty": "Easy",
    "stem": "A place at 28°N lies on which side of the Tropic of Cancer?",
    "answer": "North",
    "distractors": [
      "South",
      "Exactly on it",
      "Its longitude decides"
    ],
    "explanation": "The Tropic of Cancer lies at 23°30'N. Since 28°N is a larger north latitude, the place lies north of the Tropic and farther from the Equator.",
    "sourceFactIds": [
      "TOC-NORTH-28N"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-094",
    "qlName": "North/south of Tropic of Cancer reasoning",
    "difficulty": "Medium",
    "stem": "Which latitude lies closest to but south of the Tropic of Cancer?",
    "answer": "23°N",
    "distractors": [
      "24°N",
      "28°N",
      "30°N"
    ],
    "explanation": "The Tropic is at 23°30'N. A latitude of 23°N lies only half a degree south, while the other options lie north of the line.",
    "sourceFactIds": [
      "TOC-CLOSEST-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-094",
    "qlName": "North/south of Tropic of Cancer reasoning",
    "difficulty": "Medium",
    "stem": "Place A is at 22°N and Place B at 25°N. How are they positioned relative to the Tropic of Cancer?",
    "answer": "A is south and B is north",
    "distractors": [
      "A is north and B is south",
      "Both are north",
      "Both are south"
    ],
    "explanation": "The Tropic of Cancer is at 23°30'N. The 22°N point lies south of it, while the 25°N point lies north, so the two points fall on opposite sides.",
    "sourceFactIds": [
      "TOC-TWO-POINT-SIDES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-094",
    "qlName": "North/south of Tropic of Cancer reasoning",
    "difficulty": "Medium",
    "stem": "Which pair lies on opposite sides of the Tropic of Cancer?",
    "answer": "18°N and 30°N",
    "distractors": [
      "25°N and 30°N",
      "15°N and 20°N",
      "24°N and 28°N"
    ],
    "explanation": "The Tropic lies at 23°30'N. The 18°N point is south and the 30°N point north, while each distractor pair lies on the same side.",
    "sourceFactIds": [
      "TOC-OPPOSITE-SIDES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-094",
    "qlName": "North/south of Tropic of Cancer reasoning",
    "difficulty": "Hard",
    "stem": "Point P is north of 20°N but south of the Tropic of Cancer. Which latitude can P have?",
    "answer": "22°N",
    "distractors": [
      "18°N",
      "25°N",
      "30°N"
    ],
    "explanation": "P must be greater than 20°N but less than 23°30'N. Only 22°N lies inside that narrow interval, so it satisfies both latitude clues.",
    "sourceFactIds": [
      "TOC-BOUNDED-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-095",
    "qlName": "East/west of Standard Meridian reasoning",
    "difficulty": "Easy",
    "stem": "A place at 90°E lies on which side of India's Standard Meridian?",
    "answer": "East",
    "distractors": [
      "West",
      "Exactly on it",
      "Latitude decides"
    ],
    "explanation": "India's Standard Meridian is 82°30'E. Since 90°E is a larger east longitude, the place lies east of the Standard Meridian.",
    "sourceFactIds": [
      "SM-EAST-90E"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-095",
    "qlName": "East/west of Standard Meridian reasoning",
    "difficulty": "Easy",
    "stem": "A place at 75°E lies on which side of India's Standard Meridian?",
    "answer": "West",
    "distractors": [
      "East",
      "Exactly on it",
      "Latitude decides"
    ],
    "explanation": "The Standard Meridian is 82°30'E. A longitude of 75°E is smaller and therefore lies west of the reference meridian.",
    "sourceFactIds": [
      "SM-WEST-75E"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-095",
    "qlName": "East/west of Standard Meridian reasoning",
    "difficulty": "Medium",
    "stem": "Which longitude lies closest to but west of India's Standard Meridian?",
    "answer": "82°E",
    "distractors": [
      "83°E",
      "90°E",
      "95°E"
    ],
    "explanation": "The Standard Meridian is 82°30'E. A longitude of 82°E lies only half a degree west, while the other options lie east.",
    "sourceFactIds": [
      "SM-CLOSEST-WEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-095",
    "qlName": "East/west of Standard Meridian reasoning",
    "difficulty": "Medium",
    "stem": "Place A is at 80°E and Place B at 86°E. How are they positioned relative to the Standard Meridian?",
    "answer": "A is west and B is east",
    "distractors": [
      "A is east and B is west",
      "Both are east",
      "Both are west"
    ],
    "explanation": "The reference longitude is 82°30'E. The 80°E point lies west of it, while the 86°E point lies east, so the two points fall on opposite sides.",
    "sourceFactIds": [
      "SM-TWO-POINT-SIDES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-095",
    "qlName": "East/west of Standard Meridian reasoning",
    "difficulty": "Medium",
    "stem": "Which pair lies on opposite sides of India's Standard Meridian?",
    "answer": "75°E and 90°E",
    "distractors": [
      "85°E and 90°E",
      "70°E and 80°E",
      "83°E and 95°E"
    ],
    "explanation": "The Standard Meridian is 82°30'E. The 75°E point is west and the 90°E point east, while each distractor pair lies on one side.",
    "sourceFactIds": [
      "SM-OPPOSITE-SIDES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-095",
    "qlName": "East/west of Standard Meridian reasoning",
    "difficulty": "Hard",
    "stem": "Point P is east of 80°E but west of India's Standard Meridian. Which longitude can P have?",
    "answer": "82°E",
    "distractors": [
      "78°E",
      "84°E",
      "90°E"
    ],
    "explanation": "P must be greater than 80°E but less than 82°30'E. Among the options, only 82°E lies within that interval and satisfies both longitude clues.",
    "sourceFactIds": [
      "SM-BOUNDED-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-096",
    "qlName": "Hemisphere and coordinate-sign interpretation",
    "difficulty": "Easy",
    "stem": "What does the coordinate 20°N, 80°E indicate about hemispheres?",
    "answer": "Northern and Eastern Hemispheres",
    "distractors": [
      "Northern and Western Hemispheres",
      "Southern and Eastern Hemispheres",
      "Southern and Western Hemispheres"
    ],
    "explanation": "The N suffix places the point north of the Equator, while E places it east of the Prime Meridian. The coordinate is therefore in the Northern and Eastern Hemispheres.",
    "sourceFactIds": [
      "HEMISPHERE-NE-COORDINATE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-096",
    "qlName": "Hemisphere and coordinate-sign interpretation",
    "difficulty": "Easy",
    "stem": "Which coordinate pattern matches India's hemispheric position?",
    "answer": "North latitude and east longitude",
    "distractors": [
      "South latitude and east longitude",
      "North latitude and west longitude",
      "South latitude and west longitude"
    ],
    "explanation": "India lies north of the Equator and east of the Prime Meridian. Its coordinates therefore use N for latitude and E for longitude.",
    "sourceFactIds": [
      "HEMISPHERE-INDIA-PATTERN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-096",
    "qlName": "Hemisphere and coordinate-sign interpretation",
    "difficulty": "Medium",
    "stem": "Which coordinate cannot represent a point in mainland India because it is in the Southern Hemisphere?",
    "answer": "10°S, 80°E",
    "distractors": [
      "10°N, 80°E",
      "20°N, 75°E",
      "30°N, 90°E"
    ],
    "explanation": "Mainland India lies entirely north of the Equator. Any coordinate marked S is in the Southern Hemisphere and cannot represent mainland India.",
    "sourceFactIds": [
      "HEMISPHERE-SOUTH-EXCLUSION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-096",
    "qlName": "Hemisphere and coordinate-sign interpretation",
    "difficulty": "Medium",
    "stem": "Which coordinate cannot represent mainland India because it is in the Western Hemisphere?",
    "answer": "20°N, 80°W",
    "distractors": [
      "20°N, 80°E",
      "25°N, 75°E",
      "30°N, 90°E"
    ],
    "explanation": "India lies east of the Prime Meridian, so its longitudes are marked E. A coordinate at 80°W lies in the Western Hemisphere and cannot be in mainland India.",
    "sourceFactIds": [
      "HEMISPHERE-WEST-EXCLUSION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-096",
    "qlName": "Hemisphere and coordinate-sign interpretation",
    "difficulty": "Medium",
    "stem": "A point changes from 20°N, 80°E to 20°S, 80°E. Which reference line has been crossed?",
    "answer": "Equator",
    "distractors": [
      "Prime Meridian",
      "Tropic of Cancer",
      "Standard Meridian"
    ],
    "explanation": "The latitude changes from north to south while longitude remains east. Moving from N to S requires crossing the Equator at 0° latitude.",
    "sourceFactIds": [
      "HEMISPHERE-CROSS-EQUATOR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-096",
    "qlName": "Hemisphere and coordinate-sign interpretation",
    "difficulty": "Medium",
    "stem": "A point is east of the Prime Meridian and south of the Equator. Which coordinate pattern fits?",
    "answer": "South latitude, east longitude",
    "distractors": [
      "North latitude, east longitude",
      "South latitude, west longitude",
      "North latitude, west longitude"
    ],
    "explanation": "South of the Equator requires an S latitude, while east of the Prime Meridian requires an E longitude. The matching pattern is therefore S and E.",
    "sourceFactIds": [
      "HEMISPHERE-SE-PATTERN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-097",
    "qlName": "State/island relative-direction ordering",
    "difficulty": "Easy",
    "stem": "Which lies farther east: Gujarat or Arunachal Pradesh?",
    "answer": "Arunachal Pradesh",
    "distractors": [
      "Gujarat",
      "Both lie on the same longitude",
      "Latitude decides the answer"
    ],
    "explanation": "Gujarat lies on India's western side, while Arunachal Pradesh lies on the far eastern side. Arunachal Pradesh is therefore farther east.",
    "sourceFactIds": [
      "RELATIVE-GUJARAT-ARUNACHAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-097",
    "qlName": "State/island relative-direction ordering",
    "difficulty": "Easy",
    "stem": "Which lies farther south: Kanyakumari or Indira Point?",
    "answer": "Indira Point",
    "distractors": [
      "Kanyakumari",
      "Both lie at the same latitude",
      "Longitude decides the answer"
    ],
    "explanation": "Indira Point lies on Great Nicobar and extends farther south than the Indian mainland. Kanyakumari is only the southernmost mainland point.",
    "sourceFactIds": [
      "RELATIVE-KANYAKUMARI-INDIRA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-097",
    "qlName": "State/island relative-direction ordering",
    "difficulty": "Medium",
    "stem": "Which north-to-south order is correct?",
    "answer": "Andaman Islands → Nicobar Islands",
    "distractors": [
      "Nicobar Islands → Andaman Islands",
      "Lakshadweep → Andaman Islands",
      "Minicoy → Kavaratti"
    ],
    "explanation": "The Andaman group lies north of the Nicobar group. A north-to-south sequence through the Union Territory therefore places Andaman before Nicobar.",
    "sourceFactIds": [
      "RELATIVE-ANDAMAN-NICOBAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-097",
    "qlName": "State/island relative-direction ordering",
    "difficulty": "Medium",
    "stem": "Which island lies farther south within Lakshadweep: Kavaratti or Minicoy?",
    "answer": "Minicoy",
    "distractors": [
      "Kavaratti",
      "Both lie at the same latitude",
      "Neither belongs to Lakshadweep"
    ],
    "explanation": "Minicoy is the southernmost island of Lakshadweep and lies well south of Kavaratti. Its relative position is a key island-map fact.",
    "sourceFactIds": [
      "RELATIVE-MINICOY-KAVARATTI"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-097",
    "qlName": "State/island relative-direction ordering",
    "difficulty": "Medium",
    "stem": "Which west-to-east order is correct among Gujarat, Madhya Pradesh and West Bengal?",
    "answer": "Gujarat → Madhya Pradesh → West Bengal",
    "distractors": [
      "West Bengal → Madhya Pradesh → Gujarat",
      "Madhya Pradesh → Gujarat → West Bengal",
      "Gujarat → West Bengal → Madhya Pradesh"
    ],
    "explanation": "Gujarat lies in western India, Madhya Pradesh centrally and West Bengal in eastern India. That gives the stated west-to-east order.",
    "sourceFactIds": [
      "RELATIVE-STATE-WEST-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-097",
    "qlName": "State/island relative-direction ordering",
    "difficulty": "Hard",
    "stem": "Place A is Kavaratti, B is Minicoy and C is Great Nicobar. Which statement about their relative positions is accurate?",
    "answer": "B lies south of A, while C lies far east of both",
    "distractors": [
      "A lies south of B and east of C",
      "C lies west of both A and B",
      "All three lie in the same island group"
    ],
    "explanation": "Minicoy lies south of Kavaratti within Lakshadweep. Great Nicobar lies far to the east of both, in the Andaman and Nicobar region.",
    "sourceFactIds": [
      "RELATIVE-ISLAND-THREE-POINT"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-098",
    "qlName": "Surrounding-water direction reasoning",
    "difficulty": "Easy",
    "stem": "If a traveller moves west from peninsular India to the coast, which major sea is reached?",
    "answer": "Arabian Sea",
    "distractors": [
      "Bay of Bengal",
      "South China Sea",
      "Red Sea"
    ],
    "explanation": "The Arabian Sea lies west of peninsular India and borders the western coast. The Bay of Bengal lies on the eastern side.",
    "sourceFactIds": [
      "WATER-REASONING-WEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-098",
    "qlName": "Surrounding-water direction reasoning",
    "difficulty": "Easy",
    "stem": "If a traveller moves east from peninsular India to the coast, which major water body is reached?",
    "answer": "Bay of Bengal",
    "distractors": [
      "Arabian Sea",
      "Persian Gulf",
      "Caspian Sea"
    ],
    "explanation": "The Bay of Bengal lies east of peninsular India and borders the eastern coast. The Arabian Sea lies on the western side.",
    "sourceFactIds": [
      "WATER-REASONING-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-098",
    "qlName": "Surrounding-water direction reasoning",
    "difficulty": "Medium",
    "stem": "A ship rounds the southern tip of India from west coast to east coast. Which sequence is correct?",
    "answer": "Arabian Sea → Indian Ocean → Bay of Bengal",
    "distractors": [
      "Bay of Bengal → Indian Ocean → Arabian Sea",
      "Arabian Sea → Red Sea → Bay of Bengal",
      "Indian Ocean → Arabian Sea → Bay of Bengal"
    ],
    "explanation": "The west coast faces the Arabian Sea and the east coast faces the Bay of Bengal. Between them, the southern peninsula projects into the Indian Ocean.",
    "sourceFactIds": [
      "WATER-REASONING-ROUND-PENINSULA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-098",
    "qlName": "Surrounding-water direction reasoning",
    "difficulty": "Medium",
    "stem": "Which water body lies on the opposite side of peninsular India from the Arabian Sea?",
    "answer": "Bay of Bengal",
    "distractors": [
      "Red Sea",
      "Gulf of Mannar",
      "Persian Gulf"
    ],
    "explanation": "The Arabian Sea lies west of the peninsula, while the Bay of Bengal lies east. They form the two major opposite maritime sides of India.",
    "sourceFactIds": [
      "WATER-REASONING-OPPOSITE-ARABIAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-098",
    "qlName": "Surrounding-water direction reasoning",
    "difficulty": "Medium",
    "stem": "If the Bay of Bengal is to your left while viewing India, which direction are you most likely facing?",
    "answer": "South",
    "distractors": [
      "North",
      "East",
      "West"
    ],
    "explanation": "On a north-up map, the Bay of Bengal lies east of India. If east is on your left, your orientation is reversed and you are facing south.",
    "sourceFactIds": [
      "WATER-REASONING-ORIENTATION-BAY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-098",
    "qlName": "Surrounding-water direction reasoning",
    "difficulty": "Hard",
    "stem": "Water A lies west of India, B east and C south. Which identification is accurate?",
    "answer": "A Arabian Sea, B Bay of Bengal, C Indian Ocean",
    "distractors": [
      "A Bay of Bengal, B Arabian Sea, C Indian Ocean",
      "A Arabian Sea, B Indian Ocean, C Bay of Bengal",
      "A Indian Ocean, B Bay of Bengal, C Arabian Sea"
    ],
    "explanation": "India's basic water orientation is Arabian Sea to the west, Bay of Bengal to the east and Indian Ocean to the south. Only the first set matches all three clues.",
    "sourceFactIds": [
      "WATER-REASONING-THREE-LABELS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-099",
    "qlName": "Two-clue coordinate/location inference",
    "difficulty": "Easy",
    "stem": "A point is at 25°N, 90°E. Is it north or south of the Tropic of Cancer, and east or west of the Standard Meridian?",
    "answer": "North of the Tropic and east of the Standard Meridian",
    "distractors": [
      "South of the Tropic and west of the Standard Meridian",
      "North of the Tropic and west of the Standard Meridian",
      "South of the Tropic and east of the Standard Meridian"
    ],
    "explanation": "The latitude 25°N is north of 23°30'N, while 90°E is east of 82°30'E. The point therefore lies north of the Tropic and east of the Standard Meridian.",
    "sourceFactIds": [
      "TWO-CLUE-25N-90E"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-099",
    "qlName": "Two-clue coordinate/location inference",
    "difficulty": "Easy",
    "stem": "A point is at 20°N, 75°E. How does it lie relative to the Tropic of Cancer and Standard Meridian?",
    "answer": "South of the Tropic and west of the Standard Meridian",
    "distractors": [
      "North of the Tropic and east of the Standard Meridian",
      "North of the Tropic and west of the Standard Meridian",
      "South of the Tropic and east of the Standard Meridian"
    ],
    "explanation": "The latitude 20°N is south of 23°30'N, and 75°E is west of 82°30'E. Both coordinates place the point southwest of the two reference lines.",
    "sourceFactIds": [
      "TWO-CLUE-20N-75E"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-099",
    "qlName": "Two-clue coordinate/location inference",
    "difficulty": "Medium",
    "stem": "Which coordinate lies north of the Tropic of Cancer but west of the Standard Meridian?",
    "answer": "30°N, 75°E",
    "distractors": [
      "20°N, 75°E",
      "30°N, 90°E",
      "20°N, 90°E"
    ],
    "explanation": "To satisfy both conditions, latitude must exceed 23°30'N and longitude must be below 82°30'E. Only 30°N, 75°E meets both tests.",
    "sourceFactIds": [
      "TWO-CLUE-NORTH-WEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-099",
    "qlName": "Two-clue coordinate/location inference",
    "difficulty": "Medium",
    "stem": "Which coordinate lies south of the Tropic of Cancer but east of the Standard Meridian?",
    "answer": "20°N, 90°E",
    "distractors": [
      "30°N, 90°E",
      "20°N, 75°E",
      "30°N, 75°E"
    ],
    "explanation": "The point must have latitude below 23°30'N and longitude above 82°30'E. The pair 20°N, 90°E is the only option satisfying both.",
    "sourceFactIds": [
      "TWO-CLUE-SOUTH-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-099",
    "qlName": "Two-clue coordinate/location inference",
    "difficulty": "Medium",
    "stem": "Point P is inside mainland bounds, north of the Tropic of Cancer and east of the Standard Meridian. Which coordinate can be P?",
    "answer": "28°N, 90°E",
    "distractors": [
      "20°N, 90°E",
      "28°N, 75°E",
      "40°N, 90°E"
    ],
    "explanation": "The point must be inside mainland bounds, above 23°30'N and east of 82°30'E. Only 28°N, 90°E satisfies all three conditions.",
    "sourceFactIds": [
      "TWO-CLUE-INSIDE-NORTH-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-099",
    "qlName": "Two-clue coordinate/location inference",
    "difficulty": "Hard",
    "stem": "P lies within mainland India, south of the Tropic of Cancer and west of the Standard Meridian. Which coordinate is possible?",
    "answer": "18°N, 75°E",
    "distractors": [
      "25°N, 75°E",
      "18°N, 90°E",
      "5°N, 75°E"
    ],
    "explanation": "The point must remain inside mainland limits, have latitude below 23°30'N and longitude below 82°30'E. Only 18°N, 75°E meets every condition.",
    "sourceFactIds": [
      "TWO-CLUE-INSIDE-SOUTH-WEST"
    ]
  }
]);

export const GEO_LOC_001_CP011_REVIEW_BATCH_V1: readonly GeoLoc001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-LOC-001-CP011-Q${String(index + 1).padStart(3, "0")}`,
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

export function auditGeoLoc001Cp011ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_LOC_001_CP011_REVIEW_BATCH_V1) {
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

  if (GEO_LOC_001_CP011_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_LOC_001_CP011_REVIEW_BATCH_V1.length);
  for (let n = 91; n <= 99; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_LOC_001_CP011_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
