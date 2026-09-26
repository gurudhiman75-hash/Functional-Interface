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
    "qlId": "GEO-LOC-001-QL-001",
    "qlName": "Northern and Eastern Hemisphere position",
    "difficulty": "Easy",
    "stem": "In which hemisphere is India located with respect to the Equator?",
    "answer": "Northern Hemisphere",
    "distractors": [
      "Southern Hemisphere",
      "Both Northern and Southern Hemispheres",
      "Western Hemisphere"
    ],
    "explanation": "India lies entirely north of the Equator, so it is in the Northern Hemisphere. Its mainland latitudes begin at 8°4'N and extend northward to 37°6'N.",
    "sourceFactIds": [
      "HEMISPHERE-NORTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-001",
    "qlName": "Northern and Eastern Hemisphere position",
    "difficulty": "Easy",
    "stem": "India lies east of which reference line and therefore falls in the Eastern Hemisphere?",
    "answer": "Prime Meridian",
    "distractors": [
      "Equator",
      "Tropic of Cancer",
      "Arctic Circle"
    ],
    "explanation": "All of India's mainland longitudes are east longitudes, from 68°7'E to 97°25'E. That places India east of the Prime Meridian and therefore in the Eastern Hemisphere.",
    "sourceFactIds": [
      "HEMISPHERE-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-001",
    "qlName": "Northern and Eastern Hemisphere position",
    "difficulty": "Medium",
    "stem": "Which pair correctly states India's hemispheric position?",
    "answer": "Northern and Eastern Hemispheres",
    "distractors": [
      "Northern and Western Hemispheres",
      "Southern and Eastern Hemispheres",
      "Southern and Western Hemispheres"
    ],
    "explanation": "India is north of the Equator and east of the Prime Meridian. These two reference lines place the country in the Northern and Eastern Hemispheres respectively.",
    "sourceFactIds": [
      "HEMISPHERE-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-001",
    "qlName": "Northern and Eastern Hemisphere position",
    "difficulty": "Medium",
    "stem": "A place in India is marked 20°N, 80°E. What do the letters N and E show?",
    "answer": "It lies north of the Equator and east of the Prime Meridian",
    "distractors": [
      "It lies north of the Prime Meridian and east of the Equator",
      "It lies south of the Equator and west of the Prime Meridian",
      "It lies west of both the Equator and Prime Meridian"
    ],
    "explanation": "Latitude marked N is measured north of the Equator, while longitude marked E is measured east of the Prime Meridian. The coordinate notation therefore matches India's hemispheric position.",
    "sourceFactIds": [
      "HEMISPHERE-COORDINATE-NOTATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-001",
    "qlName": "Northern and Eastern Hemisphere position",
    "difficulty": "Medium",
    "stem": "Which coordinate pattern is consistent with India's hemispheric location?",
    "answer": "A north latitude with an east longitude",
    "distractors": [
      "A south latitude with an east longitude",
      "A north latitude with a west longitude",
      "A south latitude with a west longitude"
    ],
    "explanation": "India's mainland is entirely north of the Equator and east of the Prime Meridian. Coordinates used for India therefore use N for latitude and E for longitude.",
    "sourceFactIds": [
      "HEMISPHERE-COORDINATE-PATTERN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-001",
    "qlName": "Northern and Eastern Hemisphere position",
    "difficulty": "Medium",
    "stem": "Site P is at 15°N, 75°E and Site Q is at 15°S, 75°E. Which site has the same hemispheric combination as India?",
    "answer": "Site P only",
    "distractors": [
      "Site Q only",
      "Both P and Q",
      "Neither P nor Q"
    ],
    "explanation": "India combines north latitude with east longitude. Site P has that same Northern–Eastern combination, while Site Q lies south of the Equator despite sharing an east longitude.",
    "sourceFactIds": [
      "HEMISPHERE-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-002",
    "qlName": "Mainland latitudinal extent",
    "difficulty": "Easy",
    "stem": "What is the southern latitude of mainland India given in NCERT?",
    "answer": "8°4'N",
    "distractors": [
      "6°45'N",
      "23°30'N",
      "37°6'N"
    ],
    "explanation": "The mainland of India begins at about 8°4'N in the south. The lower latitude should not be confused with the latitude of India's southern island extremity.",
    "sourceFactIds": [
      "LATITUDE-SOUTH-MAINLAND"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-002",
    "qlName": "Mainland latitudinal extent",
    "difficulty": "Easy",
    "stem": "What is the northern latitude of mainland India given in NCERT?",
    "answer": "37°6'N",
    "distractors": [
      "35°6'N",
      "23°30'N",
      "8°4'N"
    ],
    "explanation": "The northern limit of mainland India's stated latitudinal extent is 37°6'N. Together with 8°4'N, it defines the textbook's mainland north–south latitude range.",
    "sourceFactIds": [
      "LATITUDE-NORTH-MAINLAND"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-002",
    "qlName": "Mainland latitudinal extent",
    "difficulty": "Medium",
    "stem": "Which pair gives the latitudinal extent of mainland India?",
    "answer": "8°4'N to 37°6'N",
    "distractors": [
      "68°7'E to 97°25'E",
      "8°4'S to 37°6'N",
      "23°30'N to 82°30'E"
    ],
    "explanation": "Mainland India extends from 8°4'N to 37°6'N in latitude. The 68°7'E–97°25'E pair refers to longitude, while 23°30'N and 82°30'E are reference lines.",
    "sourceFactIds": [
      "LATITUDE-RANGE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-002",
    "qlName": "Mainland latitudinal extent",
    "difficulty": "Medium",
    "stem": "A latitude of 40°N is compared with India's stated mainland extent. What is correct?",
    "answer": "It lies north of the stated mainland latitudinal limit",
    "distractors": [
      "It lies within the stated mainland latitudinal limits",
      "It lies south of the stated mainland latitudinal limits",
      "It is a longitude, not a latitude"
    ],
    "explanation": "Mainland India's northern latitude limit is 37°6'N. A latitude of 40°N is farther north, so it falls outside the stated mainland latitude range.",
    "sourceFactIds": [
      "LATITUDE-OUTSIDE-NORTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-002",
    "qlName": "Mainland latitudinal extent",
    "difficulty": "Medium",
    "stem": "Which latitude falls between the stated southern and northern limits of mainland India?",
    "answer": "25°N",
    "distractors": [
      "5°N",
      "40°N",
      "2°S"
    ],
    "explanation": "The textbook range runs from 8°4'N to 37°6'N. A latitude of 25°N lies between those two limits, whereas 5°N and 2°S are too far south and 40°N is too far north.",
    "sourceFactIds": [
      "LATITUDE-IN-RANGE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-002",
    "qlName": "Mainland latitudinal extent",
    "difficulty": "Medium",
    "stem": "Consider the statements: I. Mainland India lies entirely north of 8°N. II. Mainland India extends beyond 37°N. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "The mainland limits are 8°4'N and 37°6'N. That places the mainland just north of 8°N at its southern end and slightly beyond 37°N at its northern end.",
    "sourceFactIds": [
      "LATITUDE-BOUNDARY-INTERPRETATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-003",
    "qlName": "Mainland longitudinal extent",
    "difficulty": "Easy",
    "stem": "What is the western longitude of mainland India given in NCERT?",
    "answer": "68°7'E",
    "distractors": [
      "82°30'E",
      "97°25'E",
      "37°6'N"
    ],
    "explanation": "The stated western longitude of mainland India is 68°7'E. It is the smaller of India's two mainland longitude limits because longitude values increase eastward here.",
    "sourceFactIds": [
      "LONGITUDE-WEST-MAINLAND"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-003",
    "qlName": "Mainland longitudinal extent",
    "difficulty": "Easy",
    "stem": "What is the eastern longitude of mainland India given in NCERT?",
    "answer": "97°25'E",
    "distractors": [
      "68°7'E",
      "82°30'E",
      "23°30'N"
    ],
    "explanation": "The stated eastern longitude of mainland India is 97°25'E. Together with 68°7'E in the west, it forms the textbook's east–west longitude range.",
    "sourceFactIds": [
      "LONGITUDE-EAST-MAINLAND"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-003",
    "qlName": "Mainland longitudinal extent",
    "difficulty": "Medium",
    "stem": "Which pair gives the longitudinal extent of mainland India?",
    "answer": "68°7'E to 97°25'E",
    "distractors": [
      "8°4'N to 37°6'N",
      "23°30'N to 82°30'E",
      "68°7'W to 97°25'E"
    ],
    "explanation": "Mainland India extends from 68°7'E in the west to 97°25'E in the east. The 8°4'N–37°6'N pair is the mainland latitudinal extent.",
    "sourceFactIds": [
      "LONGITUDE-RANGE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-003",
    "qlName": "Mainland longitudinal extent",
    "difficulty": "Medium",
    "stem": "A longitude of 100°E is compared with India's stated mainland extent. What is correct?",
    "answer": "It lies east of the stated mainland longitudinal limit",
    "distractors": [
      "It lies within the stated mainland longitudinal limits",
      "It lies west of the stated mainland longitudinal limits",
      "It is a latitude, not a longitude"
    ],
    "explanation": "The eastern mainland limit is 97°25'E. A longitude of 100°E is farther east, so it falls outside the stated mainland longitude range.",
    "sourceFactIds": [
      "LONGITUDE-OUTSIDE-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-003",
    "qlName": "Mainland longitudinal extent",
    "difficulty": "Medium",
    "stem": "Which longitude falls between the stated western and eastern limits of mainland India?",
    "answer": "80°E",
    "distractors": [
      "60°E",
      "105°E",
      "20°W"
    ],
    "explanation": "The mainland range is 68°7'E to 97°25'E. A longitude of 80°E lies between those limits, while 60°E is west of them and 105°E is east of them.",
    "sourceFactIds": [
      "LONGITUDE-IN-RANGE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-003",
    "qlName": "Mainland longitudinal extent",
    "difficulty": "Medium",
    "stem": "Which statement correctly compares 70°E and 95°E with India's stated mainland longitude limits?",
    "answer": "Both longitudes fall between the stated western and eastern limits",
    "distractors": [
      "Only 70°E falls between the limits",
      "Only 95°E falls between the limits",
      "Neither longitude falls between the limits"
    ],
    "explanation": "India's stated mainland longitudes run from 68°7'E to 97°25'E. Both 70°E and 95°E lie numerically inside that interval, though this alone does not prove that every point on those meridians is Indian territory.",
    "sourceFactIds": [
      "LONGITUDE-INTERVAL-INTERPRETATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-004",
    "qlName": "Tropic of Cancer",
    "difficulty": "Easy",
    "stem": "Which important latitude passes through India at 23°30'N?",
    "answer": "Tropic of Cancer",
    "distractors": [
      "Equator",
      "Tropic of Capricorn",
      "Arctic Circle"
    ],
    "explanation": "The Tropic of Cancer lies at 23°30'N and passes through India. It is one of the most frequently tested reference lines in Indian geography.",
    "sourceFactIds": [
      "TROPIC-LATITUDE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-004",
    "qlName": "Tropic of Cancer",
    "difficulty": "Easy",
    "stem": "At what latitude is the Tropic of Cancer located?",
    "answer": "23°30'N",
    "distractors": [
      "0°",
      "66°30'N",
      "82°30'E"
    ],
    "explanation": "The Tropic of Cancer is the parallel at 23°30'N. The value 82°30'E is a longitude used for India's Standard Meridian, not a latitude.",
    "sourceFactIds": [
      "TROPIC-VALUE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-004",
    "qlName": "Tropic of Cancer",
    "difficulty": "Medium",
    "stem": "How does NCERT describe the Tropic of Cancer's position across India?",
    "answer": "It divides the country into almost two equal parts",
    "distractors": [
      "It forms India's western boundary",
      "It passes only through the island groups",
      "It marks the Standard Meridian of India"
    ],
    "explanation": "NCERT notes that the Tropic of Cancer at 23°30'N divides India into almost two equal parts. It is a latitude, so it should not be confused with a boundary or the Standard Meridian.",
    "sourceFactIds": [
      "TROPIC-DIVISION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-004",
    "qlName": "Tropic of Cancer",
    "difficulty": "Medium",
    "stem": "A place at 20°N lies on which side of the Tropic of Cancer?",
    "answer": "South of the Tropic of Cancer",
    "distractors": [
      "North of the Tropic of Cancer",
      "Exactly on the Tropic of Cancer",
      "Its position cannot be compared using latitude"
    ],
    "explanation": "The Tropic of Cancer is at 23°30'N. Since 20°N is a smaller north latitude, the place lies south of that reference line.",
    "sourceFactIds": [
      "TROPIC-SOUTH-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-004",
    "qlName": "Tropic of Cancer",
    "difficulty": "Medium",
    "stem": "A place at 28°N lies on which side of the Tropic of Cancer?",
    "answer": "North of the Tropic of Cancer",
    "distractors": [
      "South of the Tropic of Cancer",
      "Exactly on the Tropic of Cancer",
      "It lies west of the Tropic of Cancer"
    ],
    "explanation": "The Tropic of Cancer is at 23°30'N. A place at 28°N has a larger north latitude and therefore lies north of the Tropic.",
    "sourceFactIds": [
      "TROPIC-NORTH-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-004",
    "qlName": "Tropic of Cancer",
    "difficulty": "Hard",
    "stem": "Site A is at 22°N and Site B is at 25°N. How are they placed relative to the Tropic of Cancer?",
    "answer": "A is south of it and B is north of it",
    "distractors": [
      "A is north of it and B is south of it",
      "Both are north of it",
      "Both are south of it"
    ],
    "explanation": "The Tropic of Cancer is at 23°30'N. The latitude 22°N is lower and lies to its south, while 25°N is higher and lies to its north.",
    "sourceFactIds": [
      "TROPIC-TWO-SITE-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-005",
    "qlName": "Standard Meridian of India",
    "difficulty": "Easy",
    "stem": "Which longitude is used as the Standard Meridian of India?",
    "answer": "82°30'E",
    "distractors": [
      "68°7'E",
      "97°25'E",
      "23°30'N"
    ],
    "explanation": "India uses 82°30'E as its Standard Meridian. The local time along this longitude is taken as the standard time for the whole country.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-VALUE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-005",
    "qlName": "Standard Meridian of India",
    "difficulty": "Easy",
    "stem": "The Standard Meridian of India passes through which place mentioned by NCERT?",
    "answer": "Mirzapur in Uttar Pradesh",
    "distractors": [
      "Jaipur in Rajasthan",
      "Mumbai in Maharashtra",
      "Kolkata in West Bengal"
    ],
    "explanation": "NCERT identifies 82°30'E passing through Mirzapur in Uttar Pradesh as India's Standard Meridian. This central reference helps the country use one standard time.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-MIRZAPUR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-005",
    "qlName": "Standard Meridian of India",
    "difficulty": "Medium",
    "stem": "Why is 82°30'E important in Indian geography?",
    "answer": "Its local time is used as the standard time for India",
    "distractors": [
      "It marks India's northern latitude limit",
      "It is the Tropic of Cancer",
      "It forms the western coast of India"
    ],
    "explanation": "The longitude 82°30'E is India's Standard Meridian. Instead of every longitude keeping a separate official clock time, the country follows the time based on this reference meridian.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-PURPOSE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-005",
    "qlName": "Standard Meridian of India",
    "difficulty": "Medium",
    "stem": "Which statement correctly distinguishes the Tropic of Cancer from India's Standard Meridian?",
    "answer": "The Tropic is a latitude, while the Standard Meridian is a longitude",
    "distractors": [
      "Both are latitudes",
      "Both are longitudes",
      "The Tropic is a longitude, while the Standard Meridian is a latitude"
    ],
    "explanation": "The Tropic of Cancer is 23°30'N, a line of latitude. India's Standard Meridian is 82°30'E, a line of longitude used for national standard time.",
    "sourceFactIds": [
      "TROPIC-VS-STANDARD-MERIDIAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-005",
    "qlName": "Standard Meridian of India",
    "difficulty": "Medium",
    "stem": "Which value is closer to the middle of India's stated mainland longitude range and is used for standard time?",
    "answer": "82°30'E",
    "distractors": [
      "68°7'E",
      "97°25'E",
      "23°30'N"
    ],
    "explanation": "India's mainland longitudes extend from 68°7'E to 97°25'E. The chosen Standard Meridian, 82°30'E, lies near the middle of this east–west range and provides a practical national time reference.",
    "sourceFactIds": [
      "STANDARD-MERIDIAN-CENTRAL-POSITION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-005",
    "qlName": "Standard Meridian of India",
    "difficulty": "Hard",
    "stem": "A map labels 23°30'N and 82°30'E across India. Which identification is correct?",
    "answer": "23°30'N is the Tropic of Cancer and 82°30'E is the Standard Meridian",
    "distractors": [
      "23°30'N is the Standard Meridian and 82°30'E is the Tropic of Cancer",
      "Both are standard meridians",
      "Both are tropical latitudes"
    ],
    "explanation": "The N suffix marks 23°30'N as a latitude, the Tropic of Cancer. The E suffix marks 82°30'E as a longitude, India's Standard Meridian.",
    "sourceFactIds": [
      "REFERENCE-LINES-IDENTIFICATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-006",
    "qlName": "North-south and east-west mainland dimensions",
    "difficulty": "Easy",
    "stem": "What is the approximate north–south extent of mainland India?",
    "answer": "3,214 km",
    "distractors": [
      "2,933 km",
      "7,516.6 km",
      "15,200 km"
    ],
    "explanation": "NCERT gives India's mainland north–south extent as about 3,214 km. This is longer than the stated east–west mainland extent of about 2,933 km.",
    "sourceFactIds": [
      "DIMENSION-NORTH-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-006",
    "qlName": "North-south and east-west mainland dimensions",
    "difficulty": "Easy",
    "stem": "What is the approximate east–west extent of mainland India?",
    "answer": "2,933 km",
    "distractors": [
      "3,214 km",
      "15,200 km",
      "3.28 million km"
    ],
    "explanation": "The east–west extent of mainland India is about 2,933 km. The north–south extent is slightly greater at about 3,214 km.",
    "sourceFactIds": [
      "DIMENSION-EAST-WEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-006",
    "qlName": "North-south and east-west mainland dimensions",
    "difficulty": "Medium",
    "stem": "Which mainland dimension of India is greater?",
    "answer": "North–south extent",
    "distractors": [
      "East–west extent",
      "Both are exactly equal",
      "Neither can be measured"
    ],
    "explanation": "The north–south extent is about 3,214 km, compared with about 2,933 km east to west. The difference is a standard size fact used in Indian geography.",
    "sourceFactIds": [
      "DIMENSION-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-006",
    "qlName": "North-south and east-west mainland dimensions",
    "difficulty": "Medium",
    "stem": "Which pair correctly matches India's mainland dimensions?",
    "answer": "North–south: 3,214 km; east–west: 2,933 km",
    "distractors": [
      "North–south: 2,933 km; east–west: 3,214 km",
      "North–south: 15,200 km; east–west: 7,516.6 km",
      "North–south: 3.28 million km; east–west: 2.4 km"
    ],
    "explanation": "The textbook gives about 3,214 km from north to south and about 2,933 km from east to west. Border length and coastline figures measure different geographic features.",
    "sourceFactIds": [
      "DIMENSION-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-006",
    "qlName": "North-south and east-west mainland dimensions",
    "difficulty": "Medium",
    "stem": "By roughly how much does India's north–south mainland extent exceed its east–west extent?",
    "answer": "About 281 km",
    "distractors": [
      "About 29 km",
      "About 1,281 km",
      "About 2,933 km"
    ],
    "explanation": "Subtracting the stated dimensions gives about 3,214 − 2,933 = 281 km. The question compares the two mainland spans rather than any boundary or coastline length.",
    "sourceFactIds": [
      "DIMENSION-DIFFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-006",
    "qlName": "North-south and east-west mainland dimensions",
    "difficulty": "Hard",
    "stem": "Statement I: India's mainland spans about 3,214 km north to south. Statement II: Its east–west span is about 2,933 km. Which is correct?",
    "answer": "Both statements are correct",
    "distractors": [
      "Only Statement I is correct",
      "Only Statement II is correct",
      "Neither statement is correct"
    ],
    "explanation": "Both figures match the standard NCERT dimensions of mainland India. Together they show that the north–south span is somewhat longer than the east–west span.",
    "sourceFactIds": [
      "DIMENSION-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-007",
    "qlName": "Area, world share and size rank",
    "difficulty": "Easy",
    "stem": "What is the approximate total area of India given in NCERT?",
    "answer": "3.28 million square kilometres",
    "distractors": [
      "1.28 million square kilometres",
      "5.28 million square kilometres",
      "7.28 million square kilometres"
    ],
    "explanation": "India's area is about 3.28 million square kilometres. This figure is used with its share of world area and global size rank to describe the country's physical size.",
    "sourceFactIds": [
      "AREA-TOTAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-007",
    "qlName": "Area, world share and size rank",
    "difficulty": "Easy",
    "stem": "India accounts for about what share of the world's geographical area?",
    "answer": "2.4%",
    "distractors": [
      "1.2%",
      "4.8%",
      "7.5%"
    ],
    "explanation": "NCERT states that India occupies about 2.4% of the world's total geographical area. The percentage is small relative to the global total despite India's large absolute size.",
    "sourceFactIds": [
      "AREA-WORLD-SHARE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-007",
    "qlName": "Area, world share and size rank",
    "difficulty": "Medium",
    "stem": "What is India's size rank by area in the NCERT framing?",
    "answer": "Seventh",
    "distractors": [
      "Third",
      "Fifth",
      "Tenth"
    ],
    "explanation": "NCERT presents India as the seventh-largest country in the world by area. The rank is paired with an area of about 3.28 million square kilometres.",
    "sourceFactIds": [
      "AREA-RANK"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-007",
    "qlName": "Area, world share and size rank",
    "difficulty": "Medium",
    "stem": "Which combination correctly states India's area and share of world geographical area?",
    "answer": "About 3.28 million sq km and about 2.4%",
    "distractors": [
      "About 2.4 million sq km and about 3.28%",
      "About 7.5 million sq km and about 2.4%",
      "About 3.28 million sq km and about 7.5%"
    ],
    "explanation": "The standard figures are about 3.28 million square kilometres and about 2.4% of the world's geographical area. They measure absolute size and proportional world share respectively.",
    "sourceFactIds": [
      "AREA-SHARE-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-007",
    "qlName": "Area, world share and size rank",
    "difficulty": "Medium",
    "stem": "Which statement about India's physical size is correct?",
    "answer": "India is the seventh-largest country by area in the textbook comparison",
    "distractors": [
      "India is the world's largest country by area",
      "India covers about 24% of the world's geographical area",
      "India's area is about 0.328 million square kilometres"
    ],
    "explanation": "India is placed seventh by area in NCERT's standard world comparison. Its area is about 3.28 million square kilometres, representing roughly 2.4% of world geographical area.",
    "sourceFactIds": [
      "AREA-SIZE-INTERPRETATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-007",
    "qlName": "Area, world share and size rank",
    "difficulty": "Hard",
    "stem": "Consider the statements: I. India has about 3.28 million sq km of area. II. This is about 2.4% of world geographical area. III. India is seventh by area. Which is correct?",
    "answer": "I, II and III are correct",
    "distractors": [
      "I and II only",
      "II and III only",
      "I and III only"
    ],
    "explanation": "All three statements reproduce the standard size facts given for India. They connect the country's absolute area with its approximate world share and global area rank.",
    "sourceFactIds": [
      "AREA-THREE-FACT-INTEGRATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-008",
    "qlName": "East-west time lag and one standard time",
    "difficulty": "Easy",
    "stem": "About how much local-time difference exists from Gujarat to Arunachal Pradesh?",
    "answer": "Two hours",
    "distractors": [
      "Thirty minutes",
      "Four hours",
      "Six hours"
    ],
    "explanation": "NCERT notes a local-time lag of about two hours from Gujarat in the west to Arunachal Pradesh in the east. This arises from India's considerable longitudinal extent.",
    "sourceFactIds": [
      "TIME-LAG-TWO-HOURS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-008",
    "qlName": "East-west time lag and one standard time",
    "difficulty": "Easy",
    "stem": "Why does India use one standard time across the country?",
    "answer": "To avoid different official times caused by east–west longitude differences",
    "distractors": [
      "To remove the Tropic of Cancer",
      "To make all places have identical sunrise times",
      "To change India's longitude"
    ],
    "explanation": "Local solar time changes with longitude, so eastern and western places would otherwise show different clock times. India uses the time of 82°30'E as one national standard.",
    "sourceFactIds": [
      "TIME-STANDARDIZATION-PURPOSE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-008",
    "qlName": "East-west time lag and one standard time",
    "difficulty": "Medium",
    "stem": "Which part of India experiences local noon earlier because it lies farther east?",
    "answer": "Arunachal Pradesh",
    "distractors": [
      "Gujarat",
      "Rajasthan",
      "Goa"
    ],
    "explanation": "Places farther east reach the Sun's apparent daily positions earlier in local solar time. Arunachal Pradesh lies much farther east than Gujarat, creating the textbook two-hour local-time contrast.",
    "sourceFactIds": [
      "TIME-EAST-EARLIER"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-008",
    "qlName": "East-west time lag and one standard time",
    "difficulty": "Medium",
    "stem": "If local solar time differs across India, what keeps official clocks uniform?",
    "answer": "Indian Standard Time based on 82°30'E",
    "distractors": [
      "The Tropic of Cancer",
      "The Equator",
      "The westernmost longitude 68°7'E"
    ],
    "explanation": "India does not use separate official time zones for each longitude. Official time is standardized using the 82°30'E meridian, so clocks follow the same national time.",
    "sourceFactIds": [
      "TIME-IST-UNIFORMITY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-008",
    "qlName": "East-west time lag and one standard time",
    "difficulty": "Medium",
    "stem": "What geographic feature causes the local-time difference between western and eastern India?",
    "answer": "Longitudinal extent",
    "distractors": [
      "Latitudinal extent",
      "Altitude alone",
      "Distance from the Equator alone"
    ],
    "explanation": "Local solar time changes from one longitude to another as Earth rotates. India's wide east–west longitude range therefore creates a noticeable local-time difference.",
    "sourceFactIds": [
      "TIME-LONGITUDE-CAUSE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-008",
    "qlName": "East-west time lag and one standard time",
    "difficulty": "Hard",
    "stem": "Two towns keep the same official clock time, but the eastern town sees local noon earlier. Which explanation fits India?",
    "answer": "Both follow IST, while longitude still changes local solar time",
    "distractors": [
      "The eastern town uses a different national time zone",
      "Latitude alone creates the clock difference",
      "The Standard Meridian removes all solar-time variation"
    ],
    "explanation": "A single national clock does not erase the effect of longitude on the Sun's apparent timing. Both towns can follow IST even though the eastern location reaches local noon earlier.",
    "sourceFactIds": [
      "TIME-OFFICIAL-VS-SOLAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-009",
    "qlName": "Mixed coordinate and extent interpretation",
    "difficulty": "Easy",
    "stem": "Which coordinate pair fits India's stated mainland latitude and longitude limits?",
    "answer": "20°N, 80°E",
    "distractors": [
      "40°N, 80°E",
      "20°N, 60°E",
      "10°S, 80°E"
    ],
    "explanation": "The stated mainland limits are 8°4'N–37°6'N and 68°7'E–97°25'E. The pair 20°N, 80°E falls inside both numeric intervals; this test does not claim every such coordinate is Indian territory.",
    "sourceFactIds": [
      "COORDINATE-COMPATIBLE-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-009",
    "qlName": "Mixed coordinate and extent interpretation",
    "difficulty": "Easy",
    "stem": "Which coordinate cannot fit the stated mainland latitude limits of India?",
    "answer": "42°N, 80°E",
    "distractors": [
      "10°N, 75°E",
      "20°N, 80°E",
      "30°N, 90°E"
    ],
    "explanation": "Mainland India's northern latitude limit is 37°6'N. A coordinate at 42°N is therefore outside the stated mainland latitude interval regardless of its longitude.",
    "sourceFactIds": [
      "COORDINATE-LATITUDE-EXCLUSION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-009",
    "qlName": "Mixed coordinate and extent interpretation",
    "difficulty": "Medium",
    "stem": "Which coordinate cannot fit the stated mainland longitude limits of India?",
    "answer": "25°N, 105°E",
    "distractors": [
      "25°N, 70°E",
      "25°N, 82°E",
      "25°N, 95°E"
    ],
    "explanation": "Mainland India's eastern longitude limit is 97°25'E. A longitude of 105°E lies beyond that interval, while 70°E, 82°E and 95°E fall between the stated west and east limits.",
    "sourceFactIds": [
      "COORDINATE-LONGITUDE-EXCLUSION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-009",
    "qlName": "Mixed coordinate and extent interpretation",
    "difficulty": "Medium",
    "stem": "A map point is at 5°N, 80°E. Which stated mainland limit does it fail?",
    "answer": "The southern latitude limit",
    "distractors": [
      "The western longitude limit",
      "The eastern longitude limit",
      "The northern latitude limit"
    ],
    "explanation": "The longitude 80°E lies within India's stated mainland east–west interval, but 5°N is south of the mainland's 8°4'N southern latitude limit. The failure is therefore latitudinal.",
    "sourceFactIds": [
      "COORDINATE-SOUTH-EXCLUSION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-009",
    "qlName": "Mixed coordinate and extent interpretation",
    "difficulty": "Medium",
    "stem": "A map point is at 25°N, 65°E. Which stated mainland limit does it fail?",
    "answer": "The western longitude limit",
    "distractors": [
      "The southern latitude limit",
      "The northern latitude limit",
      "The eastern longitude limit"
    ],
    "explanation": "The latitude 25°N lies within the mainland latitude interval, but 65°E is west of the 68°7'E western longitude limit. Its incompatibility comes from longitude.",
    "sourceFactIds": [
      "COORDINATE-WEST-EXCLUSION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-009",
    "qlName": "Mixed coordinate and extent interpretation",
    "difficulty": "Hard",
    "stem": "Point A is 12°N, 75°E; B is 39°N, 75°E; C is 20°N, 100°E. Which point fits both stated mainland coordinate intervals?",
    "answer": "Point A only",
    "distractors": [
      "Point B only",
      "Point C only",
      "Points B and C only"
    ],
    "explanation": "Point A lies between both the stated latitude and longitude limits. B exceeds the northern latitude limit and C exceeds the eastern longitude limit; fitting both intervals still does not by itself prove territorial location.",
    "sourceFactIds": [
      "COORDINATE-MULTI-POINT-ELIMINATION"
    ]
  }
]);

export const GEO_LOC_001_CP001_REVIEW_BATCH_V1: readonly GeoLoc001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-LOC-001-CP001-Q${String(index + 1).padStart(3, "0")}`,
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

const BANNED = /associated with|best describes|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR = /currency|literacy rate|stock market|crop price|movie|sports team|bank rate|tax slab/i;

export function auditGeoLoc001Cp001ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_LOC_001_CP001_REVIEW_BATCH_V1) {
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
    if (q.stem.length < 20 || q.stem.length > 260 || !q.stem.trim().endsWith("?")) issues.push("STEM_SHAPE:" + q.questionId);
    if (q.explanation.length < 115) issues.push("SHORT_EXPLANATION:" + q.questionId);
    if ((q.explanation.match(/[.!?](?:\s|$)/g) ?? []).length < 2) issues.push("EXPLANATION_DEPTH:" + q.questionId);
  }

  if (GEO_LOC_001_CP001_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_LOC_001_CP001_REVIEW_BATCH_V1.length);
  for (let n = 1; n <= 9; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) {
    issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  }
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_LOC_001_CP001_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
