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
    "qlId": "GEO-LOC-001-QL-028",
    "qlName": "Arabian Sea — western side",
    "difficulty": "Easy",
    "stem": "Which sea lies to the west of India?",
    "answer": "Arabian Sea",
    "distractors": [
      "Bay of Bengal",
      "South China Sea",
      "Red Sea"
    ],
    "explanation": "The Arabian Sea lies along India's western side. It borders the western coast and opens into the wider Indian Ocean.",
    "sourceFactIds": [
      "ARABIAN-SEA-WEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-028",
    "qlName": "Arabian Sea — western side",
    "difficulty": "Easy",
    "stem": "India's western coast opens into which sea?",
    "answer": "Arabian Sea",
    "distractors": [
      "Bay of Bengal",
      "Mediterranean Sea",
      "Caspian Sea"
    ],
    "explanation": "The western coast of India faces the Arabian Sea. The Bay of Bengal lies on the opposite, eastern side of the peninsula.",
    "sourceFactIds": [
      "WEST-COAST-ARABIAN-SEA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-028",
    "qlName": "Arabian Sea — western side",
    "difficulty": "Medium",
    "stem": "A ship leaves India's west coast and sails directly into the adjacent sea. Which sea does it enter?",
    "answer": "Arabian Sea",
    "distractors": [
      "Bay of Bengal",
      "Black Sea",
      "Sea of Japan"
    ],
    "explanation": "India's west coast faces the Arabian Sea. A vessel leaving that coast enters the Arabian Sea before moving into broader Indian Ocean routes.",
    "sourceFactIds": [
      "WEST-COAST-SHIP-ARABIAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-028",
    "qlName": "Arabian Sea — western side",
    "difficulty": "Medium",
    "stem": "Which coast–water pairing is correct for western India?",
    "answer": "Western coast — Arabian Sea",
    "distractors": [
      "Western coast — Bay of Bengal",
      "Western coast — South China Sea",
      "Western coast — Red Sea"
    ],
    "explanation": "The Arabian Sea lies to India's west and therefore borders the western coast. The Bay of Bengal belongs to the eastern side.",
    "sourceFactIds": [
      "WEST-COAST-WATER-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-028",
    "qlName": "Arabian Sea — western side",
    "difficulty": "Medium",
    "stem": "If a map labels the Bay of Bengal on India's western side, what has been reversed?",
    "answer": "The positions of the Arabian Sea and Bay of Bengal",
    "distractors": [
      "The north and south limits of India",
      "The Tropic of Cancer and Equator",
      "The mainland and island groups"
    ],
    "explanation": "The Arabian Sea belongs on the west and the Bay of Bengal on the east. Swapping them reverses India's basic maritime orientation.",
    "sourceFactIds": [
      "ARABIAN-BAY-REVERSAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-028",
    "qlName": "Arabian Sea — western side",
    "difficulty": "Medium",
    "stem": "Which side of the Indian peninsula should be linked with the Arabian Sea?",
    "answer": "Western side",
    "distractors": [
      "Eastern side",
      "Northern mountain side",
      "Northeastern land frontier"
    ],
    "explanation": "The Arabian Sea borders the western side of peninsular India. The eastern side faces the Bay of Bengal.",
    "sourceFactIds": [
      "ARABIAN-SEA-WEST-SIDE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-029",
    "qlName": "Bay of Bengal — eastern side",
    "difficulty": "Easy",
    "stem": "Which water body lies to the east of India?",
    "answer": "Bay of Bengal",
    "distractors": [
      "Arabian Sea",
      "Red Sea",
      "Persian Gulf"
    ],
    "explanation": "The Bay of Bengal lies along India's eastern side. The Arabian Sea is on the west, while the Indian Ocean extends to the south.",
    "sourceFactIds": [
      "BAY-BENGAL-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-029",
    "qlName": "Bay of Bengal — eastern side",
    "difficulty": "Easy",
    "stem": "India's eastern coast faces which bay?",
    "answer": "Bay of Bengal",
    "distractors": [
      "Bay of Biscay",
      "Hudson Bay",
      "Baffin Bay"
    ],
    "explanation": "The eastern coast of India faces the Bay of Bengal. This is the large bay on the northeastern side of the Indian Ocean.",
    "sourceFactIds": [
      "EAST-COAST-BAY-BENGAL"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-029",
    "qlName": "Bay of Bengal — eastern side",
    "difficulty": "Medium",
    "stem": "A ship sails eastward from India's eastern coast into the adjacent water body. Where does it enter?",
    "answer": "Bay of Bengal",
    "distractors": [
      "Arabian Sea",
      "Mediterranean Sea",
      "Red Sea"
    ],
    "explanation": "The Bay of Bengal borders India's eastern coast. A vessel departing eastward from that coast enters the bay.",
    "sourceFactIds": [
      "EAST-COAST-SHIP-BAY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-029",
    "qlName": "Bay of Bengal — eastern side",
    "difficulty": "Medium",
    "stem": "Which coast–water pairing belongs to eastern India?",
    "answer": "Eastern coast — Bay of Bengal",
    "distractors": [
      "Eastern coast — Arabian Sea",
      "Eastern coast — Persian Gulf",
      "Eastern coast — Caspian Sea"
    ],
    "explanation": "The eastern coast faces the Bay of Bengal. The Arabian Sea lies on the western side of India.",
    "sourceFactIds": [
      "EAST-COAST-WATER-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-029",
    "qlName": "Bay of Bengal — eastern side",
    "difficulty": "Medium",
    "stem": "Which side of India is nearest the Bay of Bengal?",
    "answer": "Eastern side",
    "distractors": [
      "Western side",
      "Northwestern land frontier",
      "Northern Himalayan side"
    ],
    "explanation": "The Bay of Bengal lies east of the Indian mainland. It borders the eastern coast from the peninsula toward the Ganga-Brahmaputra delta region.",
    "sourceFactIds": [
      "BAY-BENGAL-EAST-SIDE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-029",
    "qlName": "Bay of Bengal — eastern side",
    "difficulty": "Medium",
    "stem": "A map shows the Arabian Sea east of India and the Bay of Bengal west of India. What is the error?",
    "answer": "The two water bodies have been placed on opposite sides",
    "distractors": [
      "India has been moved south of the Equator",
      "The Himalayas have been removed",
      "The island groups have been merged"
    ],
    "explanation": "The correct arrangement is Arabian Sea to the west and Bay of Bengal to the east. The map has simply reversed the two major surrounding waters.",
    "sourceFactIds": [
      "BAY-ARABIAN-MAP-ERROR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-030",
    "qlName": "Indian Ocean — southern side",
    "difficulty": "Easy",
    "stem": "Which ocean lies to the south of India?",
    "answer": "Indian Ocean",
    "distractors": [
      "Atlantic Ocean",
      "Arctic Ocean",
      "Pacific Ocean"
    ],
    "explanation": "The Indian Ocean lies south of India and surrounds the projecting peninsula. The Arabian Sea and Bay of Bengal form its western and eastern arms around India.",
    "sourceFactIds": [
      "INDIAN-OCEAN-SOUTH"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-030",
    "qlName": "Indian Ocean — southern side",
    "difficulty": "Easy",
    "stem": "The Indian peninsula projects southward into which ocean?",
    "answer": "Indian Ocean",
    "distractors": [
      "Atlantic Ocean",
      "Southern Ocean",
      "Arctic Ocean"
    ],
    "explanation": "Peninsular India extends into the Indian Ocean. This position gives India a prominent location between the Arabian Sea and Bay of Bengal.",
    "sourceFactIds": [
      "PENINSULA-INTO-INDIAN-OCEAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-030",
    "qlName": "Indian Ocean — southern side",
    "difficulty": "Medium",
    "stem": "Which arrangement correctly places India's major surrounding waters?",
    "answer": "Arabian Sea west, Bay of Bengal east, Indian Ocean south",
    "distractors": [
      "Bay of Bengal west, Arabian Sea east, Indian Ocean north",
      "Indian Ocean west, Arabian Sea south, Bay of Bengal north",
      "Arabian Sea north, Indian Ocean east, Bay of Bengal west"
    ],
    "explanation": "India is bordered by the Arabian Sea on the west, the Bay of Bengal on the east and the Indian Ocean to the south. This three-part orientation is fundamental to India's maritime geography.",
    "sourceFactIds": [
      "THREE-WATER-ORIENTATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-030",
    "qlName": "Indian Ocean — southern side",
    "difficulty": "Medium",
    "stem": "A traveller moves south from peninsular India beyond the coast. Which ocean is reached?",
    "answer": "Indian Ocean",
    "distractors": [
      "Atlantic Ocean",
      "Pacific Ocean",
      "Arctic Ocean"
    ],
    "explanation": "The Indian Ocean extends directly south of the peninsula. India's southern projection is one reason the ocean is central to the country's geographic position.",
    "sourceFactIds": [
      "SOUTH-FROM-PENINSULA-OCEAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-030",
    "qlName": "Indian Ocean — southern side",
    "difficulty": "Medium",
    "stem": "Which surrounding water body is an ocean rather than a sea or bay?",
    "answer": "Indian Ocean",
    "distractors": [
      "Arabian Sea",
      "Bay of Bengal",
      "Palk Strait"
    ],
    "explanation": "The Indian Ocean is the ocean south of India. The Arabian Sea and Bay of Bengal are major adjoining divisions of that ocean, while Palk Strait is a narrow passage.",
    "sourceFactIds": [
      "OCEAN-VS-SEA-BAY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-030",
    "qlName": "Indian Ocean — southern side",
    "difficulty": "Medium",
    "stem": "Why is the Indian Ocean central to India's maritime setting?",
    "answer": "The peninsula projects directly into it",
    "distractors": [
      "India lies entirely west of it",
      "It separates India from the Himalayas",
      "It is north of the Indian mainland"
    ],
    "explanation": "The Deccan Peninsula extends southward into the Indian Ocean. This projection places India prominently along routes crossing the northern Indian Ocean.",
    "sourceFactIds": [
      "INDIAN-OCEAN-CENTRALITY"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-031",
    "qlName": "Peninsula dividing waters to west/east",
    "difficulty": "Easy",
    "stem": "Which two major water bodies lie on either side of peninsular India?",
    "answer": "Arabian Sea and Bay of Bengal",
    "distractors": [
      "Red Sea and Black Sea",
      "Caspian Sea and Aral Sea",
      "Mediterranean Sea and Red Sea"
    ],
    "explanation": "Peninsular India has the Arabian Sea to the west and the Bay of Bengal to the east. The peninsula projects between these two major water bodies.",
    "sourceFactIds": [
      "PENINSULA-TWO-SIDES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-031",
    "qlName": "Peninsula dividing waters to west/east",
    "difficulty": "Easy",
    "stem": "The southward extension of India separates which waters on its western and eastern sides?",
    "answer": "Arabian Sea in the west and Bay of Bengal in the east",
    "distractors": [
      "Bay of Bengal in the west and Arabian Sea in the east",
      "Indian Ocean in the west and Red Sea in the east",
      "Pacific Ocean in the west and Atlantic Ocean in the east"
    ],
    "explanation": "As the peninsula extends southward, the Arabian Sea remains on its west and the Bay of Bengal on its east. Both are parts of the northern Indian Ocean setting.",
    "sourceFactIds": [
      "PENINSULA-WEST-EAST-WATERS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-031",
    "qlName": "Peninsula dividing waters to west/east",
    "difficulty": "Medium",
    "stem": "Why does peninsular India have distinct western and eastern maritime sides?",
    "answer": "It projects southward between the Arabian Sea and Bay of Bengal",
    "distractors": [
      "It is detached from Asia",
      "It lies between the Atlantic and Pacific Oceans",
      "It is surrounded by land on three sides"
    ],
    "explanation": "The peninsula narrows southward while water lies on both sides. The Arabian Sea forms the western maritime side and the Bay of Bengal the eastern side.",
    "sourceFactIds": [
      "PENINSULA-MARITIME-SIDES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-031",
    "qlName": "Peninsula dividing waters to west/east",
    "difficulty": "Medium",
    "stem": "A map traces India's western shoreline and eastern shoreline southward. Which waters should appear beside them?",
    "answer": "Arabian Sea on the west and Bay of Bengal on the east",
    "distractors": [
      "Bay of Bengal on both sides",
      "Arabian Sea on both sides",
      "Indian Ocean only on the northern side"
    ],
    "explanation": "The two coasts face different major water bodies. The west coast opens to the Arabian Sea, while the east coast opens to the Bay of Bengal.",
    "sourceFactIds": [
      "PENINSULA-COAST-WATERS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-031",
    "qlName": "Peninsula dividing waters to west/east",
    "difficulty": "Medium",
    "stem": "Which physical feature gives India two long maritime fronts facing different water bodies?",
    "answer": "The projecting peninsula",
    "distractors": [
      "The northern mountain wall",
      "The Thar Desert",
      "The Ganga plain alone"
    ],
    "explanation": "Peninsular India extends into the ocean and creates distinct western and eastern coasts. These face the Arabian Sea and Bay of Bengal respectively.",
    "sourceFactIds": [
      "PENINSULA-TWO-MARITIME-FRONTS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-031",
    "qlName": "Peninsula dividing waters to west/east",
    "difficulty": "Hard",
    "stem": "A triangular landmass narrows southward, with the Arabian Sea on one side and Bay of Bengal on the other. Which part of India is being described?",
    "answer": "Peninsular India",
    "distractors": [
      "The Himalayan region",
      "The Indo-Gangetic plain",
      "The Thar Desert"
    ],
    "explanation": "The southward-narrowing triangular form is characteristic of peninsular India. Its western and eastern sides face the Arabian Sea and Bay of Bengal.",
    "sourceFactIds": [
      "PENINSULA-INTEGRATED-IDENTIFICATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-032",
    "qlName": "Western coast and links toward West Asia/Africa/Europe",
    "difficulty": "Easy",
    "stem": "India's western coast provides a maritime approach toward which broad region?",
    "answer": "West Asia",
    "distractors": [
      "East Asia only",
      "Arctic Europe",
      "Central America"
    ],
    "explanation": "The western coast opens onto the Arabian Sea and toward West Asia. From there, maritime routes also connect onward toward Africa and Europe.",
    "sourceFactIds": [
      "WEST-COAST-WEST-ASIA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-032",
    "qlName": "Western coast and links toward West Asia/Africa/Europe",
    "difficulty": "Easy",
    "stem": "Which coast of India is better placed for direct maritime links toward Africa?",
    "answer": "Western coast",
    "distractors": [
      "Eastern coast",
      "Northern land frontier",
      "Northeastern mountain frontier"
    ],
    "explanation": "India's western coast faces the Arabian Sea and the western side of the Indian Ocean. This gives it direct maritime orientation toward Africa and West Asia.",
    "sourceFactIds": [
      "WEST-COAST-AFRICA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-032",
    "qlName": "Western coast and links toward West Asia/Africa/Europe",
    "difficulty": "Medium",
    "stem": "A sea route from India toward West Asia would most naturally begin from which side of the peninsula?",
    "answer": "Western side",
    "distractors": [
      "Eastern side",
      "Northern side",
      "Northeastern land side"
    ],
    "explanation": "The western side faces the Arabian Sea, which opens toward West Asia. The eastern side is oriented toward the Bay of Bengal and Southeast Asia.",
    "sourceFactIds": [
      "WEST-ASIA-WESTERN-SIDE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-032",
    "qlName": "Western coast and links toward West Asia/Africa/Europe",
    "difficulty": "Medium",
    "stem": "Which coast–region relationship fits India's maritime geography?",
    "answer": "Western coast — West Asia and Africa",
    "distractors": [
      "Western coast — Japan and Korea only",
      "Western coast — Arctic Ocean",
      "Western coast — North America directly"
    ],
    "explanation": "The western coast faces routes across the Arabian Sea toward West Asia and Africa. It also connects onward toward Europe through western sea routes.",
    "sourceFactIds": [
      "WEST-COAST-REGION-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-032",
    "qlName": "Western coast and links toward West Asia/Africa/Europe",
    "difficulty": "Medium",
    "stem": "Why is India's western coast important for contact with regions to the west?",
    "answer": "It opens onto the Arabian Sea and western Indian Ocean routes",
    "distractors": [
      "It faces the Bay of Bengal",
      "It lies north of the Himalayas",
      "It has no access to the ocean"
    ],
    "explanation": "The Arabian Sea places the western coast on routes leading toward West Asia and Africa. This maritime orientation also supports connections farther west toward Europe.",
    "sourceFactIds": [
      "WEST-COAST-ROUTE-REASON"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-032",
    "qlName": "Western coast and links toward West Asia/Africa/Europe",
    "difficulty": "Hard",
    "stem": "A trader wants the geographically shorter maritime orientation from India toward West Asia and eastern Africa. Which coast is the natural starting side?",
    "answer": "Western coast",
    "distractors": [
      "Eastern coast",
      "Northern frontier",
      "Himalayan interior"
    ],
    "explanation": "The western coast faces the Arabian Sea and lies on the side of India nearest West Asia and eastern Africa. The eastern coast is oriented toward the Bay of Bengal and Southeast Asia.",
    "sourceFactIds": [
      "WEST-COAST-TRADE-ORIENTATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-033",
    "qlName": "Eastern coast and links toward Southeast/East Asia",
    "difficulty": "Easy",
    "stem": "India's eastern coast is oriented toward which broad region across the Bay of Bengal?",
    "answer": "Southeast Asia",
    "distractors": [
      "West Asia",
      "North Africa",
      "Western Europe"
    ],
    "explanation": "The eastern coast faces the Bay of Bengal and maritime routes toward Southeast Asia. This is the opposite directional orientation from the western coast toward West Asia.",
    "sourceFactIds": [
      "EAST-COAST-SOUTHEAST-ASIA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-033",
    "qlName": "Eastern coast and links toward Southeast/East Asia",
    "difficulty": "Easy",
    "stem": "Which coast of India provides the more direct maritime orientation toward Southeast Asia?",
    "answer": "Eastern coast",
    "distractors": [
      "Western coast",
      "Northern frontier",
      "Northwestern desert edge"
    ],
    "explanation": "India's eastern coast faces the Bay of Bengal and lies on routes toward Southeast Asia. The western coast faces the Arabian Sea and regions farther west.",
    "sourceFactIds": [
      "EAST-COAST-SE-ASIA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-033",
    "qlName": "Eastern coast and links toward Southeast/East Asia",
    "difficulty": "Medium",
    "stem": "A ship leaves India for Southeast Asia. Which side of India gives the natural Bay of Bengal route?",
    "answer": "Eastern side",
    "distractors": [
      "Western side",
      "Northern side",
      "Northwestern land side"
    ],
    "explanation": "The eastern side opens into the Bay of Bengal, which leads toward Southeast Asia. This makes the eastern coast the natural maritime orientation for such a route.",
    "sourceFactIds": [
      "EAST-SIDE-BAY-ROUTE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-033",
    "qlName": "Eastern coast and links toward Southeast/East Asia",
    "difficulty": "Medium",
    "stem": "Which coast–region relationship fits India's eastern maritime position?",
    "answer": "Eastern coast — Southeast and East Asia",
    "distractors": [
      "Eastern coast — West Asia and Africa",
      "Eastern coast — Arctic Europe",
      "Eastern coast — South America directly"
    ],
    "explanation": "The eastern coast is oriented through the Bay of Bengal toward Southeast Asia and onward toward East Asia. The western coast is oriented toward West Asia and Africa.",
    "sourceFactIds": [
      "EAST-COAST-REGION-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-033",
    "qlName": "Eastern coast and links toward Southeast/East Asia",
    "difficulty": "Medium",
    "stem": "Why is the Bay of Bengal important for India's eastern maritime contacts?",
    "answer": "It opens routes from the eastern coast toward Southeast Asia",
    "distractors": [
      "It separates India from West Asia",
      "It lies west of Gujarat",
      "It is a landlocked water body"
    ],
    "explanation": "The Bay of Bengal lies east of India and links the eastern coast with maritime routes toward Southeast Asia. It therefore supports India's eastward oceanic orientation.",
    "sourceFactIds": [
      "BAY-EASTERN-CONTACTS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-033",
    "qlName": "Eastern coast and links toward Southeast/East Asia",
    "difficulty": "Hard",
    "stem": "A route from India to Southeast Asia begins on the coast facing the Bay of Bengal. Which coast is this?",
    "answer": "Eastern coast",
    "distractors": [
      "Western coast",
      "Northern coast",
      "Northwestern coast"
    ],
    "explanation": "The Bay of Bengal lies on India's eastern side. A route using that bay toward Southeast Asia therefore begins from the eastern coast.",
    "sourceFactIds": [
      "EAST-COAST-ROUTE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-034",
    "qlName": "India’s central position on trans-Indian Ocean routes",
    "difficulty": "Easy",
    "stem": "India occupies a central position on routes crossing which ocean?",
    "answer": "Indian Ocean",
    "distractors": [
      "Arctic Ocean",
      "Atlantic Ocean",
      "Southern Ocean"
    ],
    "explanation": "India projects into the northern Indian Ocean and lies near routes linking regions to its west and east. This gives the country a central geographic position on trans-Indian Ocean routes.",
    "sourceFactIds": [
      "TRANS-INDIAN-OCEAN-CENTRAL-POSITION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-034",
    "qlName": "India’s central position on trans-Indian Ocean routes",
    "difficulty": "Easy",
    "stem": "What gives India a strategic central location between western and eastern maritime regions?",
    "answer": "Its position in the Indian Ocean",
    "distractors": [
      "Its distance from all seas",
      "Its location in the Arctic",
      "Its landlocked geography"
    ],
    "explanation": "India's peninsula projects into the Indian Ocean between routes leading westward and eastward. This geographic position helps connect regions on both sides of the ocean.",
    "sourceFactIds": [
      "INDIAN-OCEAN-STRATEGIC-LOCATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-034",
    "qlName": "India’s central position on trans-Indian Ocean routes",
    "difficulty": "Medium",
    "stem": "Why can India connect maritime routes toward both Europe and East Asia?",
    "answer": "It lies centrally on northern Indian Ocean routes",
    "distractors": [
      "It lies in the Atlantic Ocean",
      "It has no peninsular coast",
      "It is west of Europe"
    ],
    "explanation": "India's position in the northern Indian Ocean places it between major western and eastern route systems. The peninsula can access routes through both the Arabian Sea and Bay of Bengal.",
    "sourceFactIds": [
      "INDIA-BETWEEN-WEST-EAST-ROUTES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-034",
    "qlName": "India’s central position on trans-Indian Ocean routes",
    "difficulty": "Medium",
    "stem": "Which feature most directly strengthens India's role on trans-ocean routes?",
    "answer": "The peninsula protruding into the Indian Ocean",
    "distractors": [
      "The Himalayas lying north of the sea",
      "The absence of a coastline",
      "The Thar Desert extending into the ocean"
    ],
    "explanation": "The peninsula extends well into the Indian Ocean, placing India close to routes crossing its northern part. This projection improves access to both western and eastern maritime directions.",
    "sourceFactIds": [
      "PENINSULA-TRANS-OCEAN-ROUTES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-034",
    "qlName": "India’s central position on trans-Indian Ocean routes",
    "difficulty": "Medium",
    "stem": "A map shows sea routes from Europe and West Asia continuing past India toward East Asia. What does India's location illustrate?",
    "answer": "A central position on trans-Indian Ocean routes",
    "distractors": [
      "A landlocked position",
      "A polar location",
      "Isolation from maritime trade"
    ],
    "explanation": "India lies along the broad corridor connecting western and eastern regions across the Indian Ocean. Its central maritime location is the geographic idea being shown.",
    "sourceFactIds": [
      "TRANS-OCEAN-MAP-INTERPRETATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-034",
    "qlName": "India’s central position on trans-Indian Ocean routes",
    "difficulty": "Hard",
    "stem": "A country projects into the northern Indian Ocean with sea access toward West Asia on one side and Southeast Asia on the other. Which advantage follows?",
    "answer": "It occupies a central position between western and eastern maritime routes",
    "distractors": [
      "It becomes landlocked",
      "It loses access to both seas",
      "It lies outside Indian Ocean routes"
    ],
    "explanation": "India's peninsula sits between the Arabian Sea and Bay of Bengal and reaches into the Indian Ocean. This creates a central route position between regions to the west and east.",
    "sourceFactIds": [
      "CENTRAL-MARITIME-ADVANTAGE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-035",
    "qlName": "Indian Ocean naming / India’s prominent position",
    "difficulty": "Easy",
    "stem": "Which ocean is named after India?",
    "answer": "Indian Ocean",
    "distractors": [
      "Atlantic Ocean",
      "Pacific Ocean",
      "Arctic Ocean"
    ],
    "explanation": "The Indian Ocean carries India's name. India's prominent position along its northern part is a standard geographic feature highlighted in Indian geography.",
    "sourceFactIds": [
      "INDIAN-OCEAN-NAMED-AFTER-INDIA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-035",
    "qlName": "Indian Ocean naming / India’s prominent position",
    "difficulty": "Easy",
    "stem": "India's prominent location is linked with the name of which ocean?",
    "answer": "Indian Ocean",
    "distractors": [
      "Southern Ocean",
      "Atlantic Ocean",
      "Arctic Ocean"
    ],
    "explanation": "India occupies a major position on the northern Indian Ocean and projects deeply into it. The ocean's name reflects the long-recognized geographic prominence of India in this region.",
    "sourceFactIds": [
      "INDIA-PROMINENT-OCEAN-NAME"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-035",
    "qlName": "Indian Ocean naming / India’s prominent position",
    "difficulty": "Medium",
    "stem": "Why is India's location especially prominent in the northern Indian Ocean?",
    "answer": "Its peninsula extends far into the ocean",
    "distractors": [
      "India lies completely outside the ocean basin",
      "India has no western coast",
      "India is separated from Asia by the ocean"
    ],
    "explanation": "The Deccan Peninsula projects southward into the Indian Ocean. This gives India a conspicuous central position along the ocean's northern rim.",
    "sourceFactIds": [
      "INDIA-PROMINENT-PENINSULA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-035",
    "qlName": "Indian Ocean naming / India’s prominent position",
    "difficulty": "Medium",
    "stem": "Which fact best links India's geography with the Indian Ocean's name?",
    "answer": "India has a prominent central position on the ocean's northern side",
    "distractors": [
      "India lies on the Atlantic coast",
      "India is an island in the middle of the Pacific",
      "India has no maritime boundary"
    ],
    "explanation": "India projects into the northern Indian Ocean and occupies a major central position there. This relationship is commonly noted when explaining the ocean's name.",
    "sourceFactIds": [
      "OCEAN-NAME-GEOGRAPHIC-LINK"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-035",
    "qlName": "Indian Ocean naming / India’s prominent position",
    "difficulty": "Medium",
    "stem": "Which description fits India's relationship with the Indian Ocean?",
    "answer": "A major peninsula projecting into its northern part",
    "distractors": [
      "A landlocked country north of it",
      "An island at its southern pole",
      "A country entirely west of the ocean"
    ],
    "explanation": "India is a large peninsula extending into the northern Indian Ocean while remaining attached to the Asian continent. This shape strengthens its maritime prominence.",
    "sourceFactIds": [
      "INDIA-INDIAN-OCEAN-RELATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-035",
    "qlName": "Indian Ocean naming / India’s prominent position",
    "difficulty": "Hard",
    "stem": "A map highlights a large Asian peninsula projecting between the Arabian Sea and Bay of Bengal into an ocean named after the country. Which ocean is shown?",
    "answer": "Indian Ocean",
    "distractors": [
      "Atlantic Ocean",
      "Arctic Ocean",
      "Pacific Ocean"
    ],
    "explanation": "The peninsula described is India, which projects between the Arabian Sea and Bay of Bengal. The ocean to its south is the Indian Ocean, named after India.",
    "sourceFactIds": [
      "OCEAN-NAME-INTEGRATED-IDENTIFICATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-036",
    "qlName": "Mixed maritime-direction reasoning",
    "difficulty": "Easy",
    "stem": "A traveller stands on India's west coast facing the adjacent sea. Which water body is ahead?",
    "answer": "Arabian Sea",
    "distractors": [
      "Bay of Bengal",
      "Indian Ocean directly east",
      "Red Sea"
    ],
    "explanation": "The Arabian Sea lies immediately west of India's western coast. The Bay of Bengal belongs to the eastern side of the peninsula.",
    "sourceFactIds": [
      "MIXED-WEST-COAST-DIRECTION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-036",
    "qlName": "Mixed maritime-direction reasoning",
    "difficulty": "Easy",
    "stem": "Which route direction begins from India's east coast across the Bay of Bengal?",
    "answer": "Toward Southeast Asia",
    "distractors": [
      "Toward West Asia across the Arabian Sea",
      "Toward the Arctic Ocean",
      "Toward inland Central Asia"
    ],
    "explanation": "The eastern coast faces the Bay of Bengal and routes toward Southeast Asia. Westward routes toward West Asia begin from the Arabian Sea side.",
    "sourceFactIds": [
      "MIXED-EAST-COAST-SE-ASIA"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-036",
    "qlName": "Mixed maritime-direction reasoning",
    "difficulty": "Medium",
    "stem": "A ship crosses from India's west coast to its east coast around the peninsula. Which water sequence is most accurate?",
    "answer": "Arabian Sea → Indian Ocean → Bay of Bengal",
    "distractors": [
      "Bay of Bengal → Arabian Sea → Indian Ocean",
      "Indian Ocean → Red Sea → Bay of Bengal",
      "Arabian Sea → Mediterranean Sea → Bay of Bengal"
    ],
    "explanation": "The west coast faces the Arabian Sea, the peninsula projects into the Indian Ocean to the south, and the east coast faces the Bay of Bengal. That gives the stated sequence.",
    "sourceFactIds": [
      "MIXED-WATER-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-036",
    "qlName": "Mixed maritime-direction reasoning",
    "difficulty": "Medium",
    "stem": "Which statement matches India's maritime orientation?",
    "answer": "West coast toward West Asia; east coast toward Southeast Asia",
    "distractors": [
      "West coast toward Southeast Asia; east coast toward West Asia",
      "Both coasts face only the Arabian Sea",
      "Both coasts face only the Bay of Bengal"
    ],
    "explanation": "India's western maritime side opens through the Arabian Sea toward West Asia, while the eastern side opens through the Bay of Bengal toward Southeast Asia.",
    "sourceFactIds": [
      "MIXED-COAST-REGION-ORIENTATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-036",
    "qlName": "Mixed maritime-direction reasoning",
    "difficulty": "Medium",
    "stem": "If the Arabian Sea is on your right while viewing a north-up map of India, which direction are you likely facing?",
    "answer": "South",
    "distractors": [
      "North",
      "East",
      "West"
    ],
    "explanation": "On a north-up map, the Arabian Sea lies west of India. If west is to your right, your orientation is reversed from north-up and you are facing south.",
    "sourceFactIds": [
      "MIXED-MAP-ORIENTATION-ARABIAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-036",
    "qlName": "Mixed maritime-direction reasoning",
    "difficulty": "Hard",
    "stem": "A map labels Water A west of India, Water B east of India and Water C south of the peninsula. Which identification is correct?",
    "answer": "A Arabian Sea, B Bay of Bengal, C Indian Ocean",
    "distractors": [
      "A Bay of Bengal, B Arabian Sea, C Indian Ocean",
      "A Indian Ocean, B Bay of Bengal, C Arabian Sea",
      "A Arabian Sea, B Indian Ocean, C Bay of Bengal"
    ],
    "explanation": "India's basic maritime orientation is Arabian Sea to the west, Bay of Bengal to the east and Indian Ocean to the south. The labels follow that three-part arrangement.",
    "sourceFactIds": [
      "MIXED-THREE-WATER-LABELS"
    ]
  }
]);

export const GEO_LOC_001_CP004_REVIEW_BATCH_V1: readonly GeoLoc001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-LOC-001-CP004-Q${String(index + 1).padStart(3, "0")}`,
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

export function auditGeoLoc001Cp004ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_LOC_001_CP004_REVIEW_BATCH_V1) {
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

  if (GEO_LOC_001_CP004_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_LOC_001_CP004_REVIEW_BATCH_V1.length);
  for (let n = 28; n <= 36; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_LOC_001_CP004_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
