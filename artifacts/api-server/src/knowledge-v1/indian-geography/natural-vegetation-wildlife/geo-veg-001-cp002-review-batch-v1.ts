import {
  GEO_VEG_001_SOURCE_IDS,
  placeGeoVegOptions,
  type GeoVeg001Difficulty,
  type GeoVeg001Question,
} from "./geo-veg-001-review-types";

type RawQuestion = Readonly<{
  qlId: string;
  qlName: string;
  difficulty: GeoVeg001Difficulty;
  stem: string;
  answer: string;
  distractors: readonly string[];
  explanation: string;
  sourceFactIds: readonly string[];
}>;

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-VEG-001-QL-010",
    "qlName": "Evergreen forest climate",
    "difficulty": "Easy",
    "stem": "Tropical evergreen forests in India develop best under which rainfall condition?",
    "answer": "Very heavy annual rainfall, generally above 200 cm",
    "distractors": [
      "Rainfall below 70 cm",
      "Rainfall of about 70–100 cm",
      "Rainfall confined to a short winter season"
    ],
    "explanation": "These forests require abundant moisture through much of the year. Very high rainfall supports dense growth and reduces the length of the dry season.",
    "sourceFactIds": [
      "EVERGREEN-RAINFALL"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-010",
    "qlName": "Evergreen forest climate",
    "difficulty": "Easy",
    "stem": "Which climatic combination favours tropical evergreen forests?",
    "answer": "High temperature and heavy rainfall",
    "distractors": [
      "Low temperature and scanty rainfall",
      "High temperature and very low rainfall",
      "Cold winters with moderate snowfall"
    ],
    "explanation": "Tropical evergreen forests need both warmth and abundant moisture. This combination permits plant growth for most of the year.",
    "sourceFactIds": [
      "EVERGREEN-WARM-WET"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-010",
    "qlName": "Evergreen forest climate",
    "difficulty": "Medium",
    "stem": "Why do tropical evergreen forests remain green through the year?",
    "answer": "Trees do not shed all their leaves in one common season",
    "distractors": [
      "All trees replace leaves on the same day",
      "The forests receive no dry-season stress at all",
      "Their trees never lose individual leaves"
    ],
    "explanation": "Evergreen trees shed leaves at different times rather than in one synchronized season. The canopy therefore remains green even though individual leaves are replaced.",
    "sourceFactIds": [
      "EVERGREEN-LEAF-SHEDDING"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-010",
    "qlName": "Evergreen forest climate",
    "difficulty": "Medium",
    "stem": "A warm region receives more than 200 cm of rain and has no long dry season. Which natural vegetation is most likely?",
    "answer": "Tropical evergreen forest",
    "distractors": [
      "Tropical thorn forest",
      "Dry deciduous forest",
      "Alpine vegetation"
    ],
    "explanation": "The clues point to continuously warm and very moist conditions. Such conditions favour dense tropical evergreen vegetation rather than dry or cold-climate types.",
    "sourceFactIds": [
      "EVERGREEN-CLIMATE-ID"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-010",
    "qlName": "Evergreen forest climate",
    "difficulty": "Medium",
    "stem": "Which change would most directly push a tropical evergreen setting toward a more seasonal forest type?",
    "answer": "A longer and stronger dry season",
    "distractors": [
      "A rise in year-round moisture",
      "More frequent rainfall through the year",
      "A reduction in seasonal water stress"
    ],
    "explanation": "Evergreen forests depend on sustained moisture. A longer dry season increases seasonal water stress and favours vegetation that sheds leaves to conserve water.",
    "sourceFactIds": [
      "EVERGREEN-DRY-SEASON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-010",
    "qlName": "Evergreen forest climate",
    "difficulty": "Hard",
    "stem": "Two tropical regions are equally warm. Region A receives heavy rain through much of the year, while Region B has a marked dry season. Why is evergreen forest more likely in Region A?",
    "answer": "Continuous moisture supports year-round growth and reduces the need for seasonal leaf shedding",
    "distractors": [
      "Region A must be at a higher latitude",
      "Region B cannot support trees of any kind",
      "Dry-season length has no effect on vegetation"
    ],
    "explanation": "Both regions are warm, so moisture seasonality becomes the key contrast. More continuous moisture allows a dense evergreen canopy, while a marked dry season favours seasonal leaf loss.",
    "sourceFactIds": [
      "EVERGREEN-INTEGRATED-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-011",
    "qlName": "Western Ghats evergreen distribution",
    "difficulty": "Easy",
    "stem": "Which part of India is well known for tropical evergreen forests because of heavy orographic rainfall?",
    "answer": "Windward slopes of the Western Ghats",
    "distractors": [
      "Leeward interior of the Deccan Plateau",
      "Thar Desert",
      "Upper Ganga plain"
    ],
    "explanation": "The windward Western Ghats receive very heavy monsoon rainfall. Warm, wet conditions there support evergreen and semi-evergreen forests.",
    "sourceFactIds": [
      "EVERGREEN-WESTERN-GHATS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-011",
    "qlName": "Western Ghats evergreen distribution",
    "difficulty": "Easy",
    "stem": "On which side of the Western Ghats are dense evergreen forests more likely?",
    "answer": "Western windward side",
    "distractors": [
      "Eastern leeward side",
      "Dry interior plateau only",
      "Northern rain-shadow side only"
    ],
    "explanation": "Moist Arabian Sea winds rise along the western slopes and produce heavy rain. The leeward side receives less moisture and therefore supports drier vegetation.",
    "sourceFactIds": [
      "EVERGREEN-WINDWARD"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-011",
    "qlName": "Western Ghats evergreen distribution",
    "difficulty": "Medium",
    "stem": "Why are evergreen forests more extensive on the windward Western Ghats than in the adjoining Deccan interior?",
    "answer": "The windward slopes receive much heavier rainfall",
    "distractors": [
      "The interior has no soil",
      "The windward slopes are always at sea level",
      "The interior receives heavier orographic rainfall"
    ],
    "explanation": "Relief forces moist monsoon air to rise on the western slopes, producing heavy rain. After crossing the crest, the air loses moisture and the interior becomes drier.",
    "sourceFactIds": [
      "EVERGREEN-OROGRAPHIC-CONTRAST"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-011",
    "qlName": "Western Ghats evergreen distribution",
    "difficulty": "Medium",
    "stem": "A location lies on the western slope of the Western Ghats and receives very high annual rainfall. Which forest clue fits it best?",
    "answer": "Dense evergreen canopy with several layers",
    "distractors": [
      "Open thorn scrub",
      "Sparse dry deciduous woodland",
      "Treeless alpine meadow"
    ],
    "explanation": "Heavy rainfall and tropical warmth favour dense multi-layered evergreen forest. Thorn scrub and dry deciduous vegetation indicate much lower or more seasonal moisture.",
    "sourceFactIds": [
      "EVERGREEN-WG-STRUCTURE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-011",
    "qlName": "Western Ghats evergreen distribution",
    "difficulty": "Medium",
    "stem": "Which pair is correctly matched?",
    "answer": "Windward Western Ghats — tropical evergreen forest",
    "distractors": [
      "Rain-shadow Deccan — dense evergreen forest",
      "Western Rajasthan — tropical evergreen forest",
      "Upper Himalayan alpine belt — tropical evergreen forest"
    ],
    "explanation": "The windward Western Ghats combine warmth with very heavy rainfall. The other regions have dry or high-altitude conditions that favour different vegetation.",
    "sourceFactIds": [
      "EVERGREEN-WG-PAIR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-011",
    "qlName": "Western Ghats evergreen distribution",
    "difficulty": "Hard",
    "stem": "The western slope and eastern rain-shadow side of the same mountain chain differ sharply in vegetation. Which process best explains evergreen forest on the western side?",
    "answer": "Moist monsoon air rises, cools and gives heavy orographic rain on the windward slope",
    "distractors": [
      "Descending air on the western slope creates the wettest conditions",
      "The mountain removes all temperature differences but increases soil salinity",
      "Evergreen forest forms wherever elevation rises, regardless of rainfall"
    ],
    "explanation": "The Western Ghats force moisture-bearing winds upward on the west-facing slope. Heavy orographic rain there supports evergreen vegetation, while descending air leaves the interior drier.",
    "sourceFactIds": [
      "EVERGREEN-WG-RELIEF-REASONING"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-012",
    "qlName": "Northeast India evergreen distribution",
    "difficulty": "Easy",
    "stem": "Which region of India is a major area of tropical evergreen and semi-evergreen forests?",
    "answer": "Northeastern India",
    "distractors": [
      "Western Rajasthan",
      "Punjab-Haryana plains",
      "Cold desert of Ladakh"
    ],
    "explanation": "Northeastern India receives abundant rainfall and has warm, humid conditions at lower elevations. These conditions support evergreen and semi-evergreen vegetation.",
    "sourceFactIds": [
      "EVERGREEN-NE-REGION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-012",
    "qlName": "Northeast India evergreen distribution",
    "difficulty": "Easy",
    "stem": "Heavy rainfall in parts of Assam and adjoining hill states supports which forest type?",
    "answer": "Tropical evergreen and semi-evergreen forests",
    "distractors": [
      "Tropical thorn forests",
      "Dry deciduous forests only",
      "Alpine scrub at all elevations"
    ],
    "explanation": "Much of the Northeast receives high rainfall and remains humid for long periods. This moisture supports dense evergreen and semi-evergreen forests in suitable areas.",
    "sourceFactIds": [
      "EVERGREEN-NE-RAIN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-012",
    "qlName": "Northeast India evergreen distribution",
    "difficulty": "Medium",
    "stem": "Why can northeastern India support dense evergreen vegetation?",
    "answer": "High rainfall combines with warm humid conditions",
    "distractors": [
      "Rainfall is extremely low",
      "Winters remain below freezing throughout the region",
      "The area lies entirely in a rain shadow"
    ],
    "explanation": "Warmth and abundant moisture are the central controls. Together they support continuous plant growth and a dense forest canopy.",
    "sourceFactIds": [
      "EVERGREEN-NE-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-012",
    "qlName": "Northeast India evergreen distribution",
    "difficulty": "Medium",
    "stem": "Which clue most strongly points to evergreen vegetation in northeastern India?",
    "answer": "Very high rainfall with a short or weak dry season",
    "distractors": [
      "Hot climate with rainfall below 70 cm",
      "Long severe winter with permanent snow",
      "Strong rain shadow and sparse moisture"
    ],
    "explanation": "Evergreen vegetation requires sustained moisture. Very high rainfall and limited seasonal drought provide the needed water supply.",
    "sourceFactIds": [
      "EVERGREEN-NE-CLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-012",
    "qlName": "Northeast India evergreen distribution",
    "difficulty": "Medium",
    "stem": "A humid valley in northeastern India receives heavy monsoon rain and stays warm for most of the year. Which vegetation is most plausible?",
    "answer": "Tropical evergreen forest",
    "distractors": [
      "Thorn scrub",
      "Dry deciduous forest",
      "Alpine meadow"
    ],
    "explanation": "The warm and very wet valley setting is suitable for tropical evergreen forest. The alternative vegetation types indicate much drier or much colder environments.",
    "sourceFactIds": [
      "EVERGREEN-NE-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-012",
    "qlName": "Northeast India evergreen distribution",
    "difficulty": "Hard",
    "stem": "Why may vegetation change from evergreen forest in a wet northeastern valley to montane forest higher on a nearby slope?",
    "answer": "Temperature falls with altitude even where moisture remains adequate",
    "distractors": [
      "Evergreen forest cannot occur near hills",
      "Rainfall alone fixes vegetation at every elevation",
      "Altitude affects only wildlife, not plants"
    ],
    "explanation": "The valley and slope may both receive good rainfall, but temperature decreases with height. This creates an altitudinal vegetation sequence instead of one forest type continuing indefinitely.",
    "sourceFactIds": [
      "EVERGREEN-NE-ALTITUDE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-013",
    "qlName": "Island evergreen distribution",
    "difficulty": "Easy",
    "stem": "Which Indian island group has areas of tropical evergreen forest?",
    "answer": "Andaman and Nicobar Islands",
    "distractors": [
      "Lakshadweep only",
      "Rann of Kachchh",
      "Malwa Plateau"
    ],
    "explanation": "The Andaman and Nicobar Islands have warm, humid tropical conditions and high rainfall. These conditions support evergreen vegetation in many areas.",
    "sourceFactIds": [
      "EVERGREEN-ISLANDS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-013",
    "qlName": "Island evergreen distribution",
    "difficulty": "Easy",
    "stem": "What climatic feature helps evergreen forests grow in the Andaman and Nicobar Islands?",
    "answer": "Warm humid conditions with abundant rainfall",
    "distractors": [
      "Very low rainfall and extreme aridity",
      "Long freezing winters",
      "Persistent continental dryness"
    ],
    "explanation": "A maritime tropical setting provides warmth and abundant moisture. These conditions favour lush evergreen forest rather than dry or cold-climate vegetation.",
    "sourceFactIds": [
      "EVERGREEN-ISLAND-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-013",
    "qlName": "Island evergreen distribution",
    "difficulty": "Medium",
    "stem": "Which region–vegetation pair is correct for India's tropical evergreen belt?",
    "answer": "Andaman and Nicobar Islands — tropical evergreen vegetation",
    "distractors": [
      "Thar Desert — tropical evergreen vegetation",
      "Ladakh — tropical evergreen vegetation",
      "Interior rain-shadow Deccan — tropical evergreen vegetation"
    ],
    "explanation": "The island group has a warm, humid and rainy climate suitable for evergreen vegetation. The other regions are much drier or colder.",
    "sourceFactIds": [
      "EVERGREEN-ISLAND-PAIR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-013",
    "qlName": "Island evergreen distribution",
    "difficulty": "Medium",
    "stem": "Why does an oceanic tropical setting favour evergreen vegetation in the Andaman and Nicobar Islands?",
    "answer": "Moist maritime air and heavy rainfall reduce seasonal water stress",
    "distractors": [
      "Sea influence eliminates all rainfall",
      "Oceanic conditions create a permanent cold desert",
      "Salty air alone determines forest type"
    ],
    "explanation": "Maritime moisture and frequent rainfall keep water available for plants through much of the year. Lower seasonal water stress supports evergreen growth.",
    "sourceFactIds": [
      "EVERGREEN-ISLAND-MARITIME"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-013",
    "qlName": "Island evergreen distribution",
    "difficulty": "Medium",
    "stem": "A warm Indian island receives heavy rainfall through much of the year. Which forest feature is expected?",
    "answer": "Dense vegetation with no single season of complete leaf fall",
    "distractors": [
      "Sparse thorn bushes with tiny leaves",
      "Open dry woodland with a long leafless period",
      "Treeless grassland caused by aridity"
    ],
    "explanation": "High year-round moisture supports a dense evergreen canopy. Trees may shed leaves individually, but the forest does not become leafless in one common season.",
    "sourceFactIds": [
      "EVERGREEN-ISLAND-FEATURE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-013",
    "qlName": "Island evergreen distribution",
    "difficulty": "Hard",
    "stem": "A mainland rain-shadow plateau and a humid tropical island lie at similar low latitudes. Why can their natural vegetation differ sharply?",
    "answer": "Moisture availability differs greatly despite similar latitude",
    "distractors": [
      "Latitude always creates identical vegetation",
      "Island soils automatically prevent forests",
      "Relief and rainfall do not influence vegetation"
    ],
    "explanation": "Latitude alone does not determine vegetation. The humid island receives abundant moisture, while the rain-shadow plateau faces much greater water stress.",
    "sourceFactIds": [
      "EVERGREEN-ISLAND-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-014",
    "qlName": "Evergreen forest structure",
    "difficulty": "Easy",
    "stem": "Which feature is typical of tropical evergreen forests?",
    "answer": "A dense, multi-layered canopy",
    "distractors": [
      "Widely scattered thorn bushes",
      "Treeless tundra",
      "Open grassland with few trees"
    ],
    "explanation": "Warm and wet conditions allow many plant species to grow at different heights. This creates a dense forest with several vegetation layers.",
    "sourceFactIds": [
      "EVERGREEN-MULTILAYER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-014",
    "qlName": "Evergreen forest structure",
    "difficulty": "Easy",
    "stem": "Why is the ground inside a dense evergreen forest often dim?",
    "answer": "The thick canopy blocks much of the sunlight",
    "distractors": [
      "The forest receives no sunlight at its latitude",
      "Trees absorb all atmospheric oxygen",
      "Rainfall stops light from reaching Earth throughout the year"
    ],
    "explanation": "Several layers of leaves and branches intercept a large share of incoming light. The forest floor therefore receives much less direct sunlight.",
    "sourceFactIds": [
      "EVERGREEN-DIM-FLOOR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-014",
    "qlName": "Evergreen forest structure",
    "difficulty": "Medium",
    "stem": "Which structural clue helps identify a tropical evergreen forest?",
    "answer": "Tall trees, climbers and dense undergrowth in several layers",
    "distractors": [
      "Uniform low thorn scrub",
      "A single layer of short grass",
      "Widely spaced leafless trees only"
    ],
    "explanation": "Evergreen forests are structurally complex because warmth and moisture support dense growth. Tall trees, climbers and lower layers can occur together.",
    "sourceFactIds": [
      "EVERGREEN-STRUCTURE-ID"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-014",
    "qlName": "Evergreen forest structure",
    "difficulty": "Medium",
    "stem": "Why are tropical evergreen forests difficult to exploit compared with more open forests?",
    "answer": "Dense mixed growth and multiple layers make access difficult",
    "distractors": [
      "They contain no timber species",
      "All trees are too small to use",
      "They occur only on flat open plains"
    ],
    "explanation": "Their vegetation is thick, species-rich and layered, which makes movement and selective extraction harder. The issue is forest structure, not the absence of useful trees.",
    "sourceFactIds": [
      "EVERGREEN-ACCESS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-014",
    "qlName": "Evergreen forest structure",
    "difficulty": "Medium",
    "stem": "What does the absence of a common leaf-shedding season do to the appearance of evergreen forest?",
    "answer": "It keeps the canopy green through the year",
    "distractors": [
      "It makes all trees leafless in summer",
      "It creates an annual treeless phase",
      "It converts the forest into grassland each dry season"
    ],
    "explanation": "Different trees replace leaves at different times. Because leaf fall is not synchronized, the forest canopy stays green throughout the year.",
    "sourceFactIds": [
      "EVERGREEN-CANOPY-GREEN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-014",
    "qlName": "Evergreen forest structure",
    "difficulty": "Hard",
    "stem": "A forest is tall, very dense, multi-layered and green throughout the year. Which environmental explanation fits these traits?",
    "answer": "Warm conditions and sustained moisture permit continuous growth",
    "distractors": [
      "Very low rainfall forces continuous leaf retention",
      "Severe frost creates dense tropical layers",
      "A long dry season prevents seasonal stress"
    ],
    "explanation": "The structure reflects a warm, wet environment with limited seasonal drought. Sustained moisture supports continuous growth and reduces synchronized leaf shedding.",
    "sourceFactIds": [
      "EVERGREEN-STRUCTURE-REASONING"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-015",
    "qlName": "Evergreen characteristic species",
    "difficulty": "Easy",
    "stem": "Which tree is commonly listed as a tropical evergreen forest species in India?",
    "answer": "Ebony",
    "distractors": [
      "Babool",
      "Khair",
      "Deodar"
    ],
    "explanation": "Ebony is a characteristic tree of tropical evergreen forests. Babool and khair are linked with drier vegetation, while deodar is a montane conifer.",
    "sourceFactIds": [
      "EVERGREEN-EBONY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-015",
    "qlName": "Evergreen characteristic species",
    "difficulty": "Easy",
    "stem": "Which group contains trees characteristic of tropical evergreen forests?",
    "answer": "Ebony, mahogany and rosewood",
    "distractors": [
      "Babool, cactus and khejri",
      "Deodar, fir and spruce",
      "Peepal, neem and thorny acacia"
    ],
    "explanation": "Ebony, mahogany and rosewood are standard examples of tropical evergreen forest trees. The other groups fit dry or montane settings better.",
    "sourceFactIds": [
      "EVERGREEN-SPECIES-GROUP"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-015",
    "qlName": "Evergreen characteristic species",
    "difficulty": "Medium",
    "stem": "A forest contains ebony, mahogany and rosewood. Which forest type is indicated?",
    "answer": "Tropical evergreen forest",
    "distractors": [
      "Tropical thorn forest",
      "Dry deciduous forest",
      "Montane coniferous forest"
    ],
    "explanation": "These tree species are characteristic examples of tropical evergreen vegetation. Their presence points to warm, very moist forest conditions.",
    "sourceFactIds": [
      "EVERGREEN-SPECIES-ID"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-015",
    "qlName": "Evergreen characteristic species",
    "difficulty": "Medium",
    "stem": "Which tree–forest pair is correct for tropical evergreen vegetation?",
    "answer": "Mahogany — tropical evergreen forest",
    "distractors": [
      "Babool — tropical evergreen forest",
      "Deodar — tropical evergreen forest",
      "Cactus — tropical evergreen forest"
    ],
    "explanation": "Mahogany is a well-known evergreen forest tree. Babool and cactus fit dry thorn vegetation, while deodar belongs to montane forests.",
    "sourceFactIds": [
      "EVERGREEN-MAHOGANY-PAIR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-015",
    "qlName": "Evergreen characteristic species",
    "difficulty": "Medium",
    "stem": "Why are valuable hardwoods such as ebony and mahogany linked with evergreen forests?",
    "answer": "The warm wet environment supports tall, dense tree growth",
    "distractors": [
      "They require rainfall below 70 cm",
      "They depend on severe winter snowfall",
      "They grow only in treeless alpine belts"
    ],
    "explanation": "Evergreen forest climates provide abundant moisture and warmth for long growing seasons. This supports tall hardwood trees among the many species present.",
    "sourceFactIds": [
      "EVERGREEN-HARDWOOD"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-015",
    "qlName": "Evergreen characteristic species",
    "difficulty": "Hard",
    "stem": "A timber sample is identified as mahogany from a warm, very wet Indian forest. Which additional clue would strengthen the forest identification?",
    "answer": "Dense multi-layered vegetation with no common leaf-fall season",
    "distractors": [
      "Open thorn scrub with scattered acacia",
      "A long annual leafless phase caused by severe drought",
      "Coniferous trees dominant because of cold altitude"
    ],
    "explanation": "Mahogany plus a dense, year-round green canopy fits tropical evergreen forest. The other clues point to thorn, deciduous or montane vegetation.",
    "sourceFactIds": [
      "EVERGREEN-SPECIES-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-016",
    "qlName": "Semi-evergreen forest features",
    "difficulty": "Easy",
    "stem": "Semi-evergreen forests generally occur where conditions are slightly drier than in tropical evergreen areas. What does this mean for their composition?",
    "answer": "They contain a mixture of evergreen and deciduous species",
    "distractors": [
      "They contain only thorny shrubs",
      "They are permanently treeless",
      "They consist only of alpine grasses"
    ],
    "explanation": "Semi-evergreen forests form a transition between very wet evergreen and more seasonal deciduous forests. Their mixed composition reflects this intermediate moisture regime.",
    "sourceFactIds": [
      "SEMI-EVERGREEN-MIX"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-016",
    "qlName": "Semi-evergreen forest features",
    "difficulty": "Easy",
    "stem": "Which phrase fits semi-evergreen forests?",
    "answer": "A transition between evergreen and moist deciduous vegetation",
    "distractors": [
      "A transition between desert and tundra",
      "A permanently snow-covered forest",
      "A grassland without trees"
    ],
    "explanation": "Semi-evergreen forests occupy conditions between the wettest evergreen areas and more seasonal moist deciduous zones. Their vegetation therefore combines traits of both.",
    "sourceFactIds": [
      "SEMI-EVERGREEN-TRANSITION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-016",
    "qlName": "Semi-evergreen forest features",
    "difficulty": "Medium",
    "stem": "Why do semi-evergreen forests contain some deciduous trees?",
    "answer": "Seasonal moisture stress is greater than in the wettest evergreen forests",
    "distractors": [
      "Temperatures remain below freezing all year",
      "Rainfall is always below 70 cm",
      "The forests receive no monsoon rain"
    ],
    "explanation": "The climate remains humid enough for dense forest, but the dry season is stronger than in true evergreen areas. Some species respond by shedding leaves seasonally.",
    "sourceFactIds": [
      "SEMI-EVERGREEN-SEASONALITY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-016",
    "qlName": "Semi-evergreen forest features",
    "difficulty": "Medium",
    "stem": "Which climate shift can encourage evergreen forest to grade into semi-evergreen forest?",
    "answer": "A modest increase in dry-season stress",
    "distractors": [
      "A sharp move to permanent snow",
      "A complete loss of all rainfall",
      "A change from tropical warmth to polar climate"
    ],
    "explanation": "A somewhat longer or stronger dry period creates more seasonal water stress. This favours a mixture of evergreen and deciduous species rather than a fully evergreen canopy.",
    "sourceFactIds": [
      "SEMI-EVERGREEN-GRADE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-016",
    "qlName": "Semi-evergreen forest features",
    "difficulty": "Medium",
    "stem": "A forest remains dense but includes both year-round green trees and species that shed leaves seasonally. Which type fits?",
    "answer": "Semi-evergreen forest",
    "distractors": [
      "Tropical thorn forest",
      "Alpine scrub",
      "Dry deciduous forest only"
    ],
    "explanation": "The mixture of evergreen and deciduous trees is the key clue. Semi-evergreen forest reflects an intermediate moisture regime between very wet and more seasonal forests.",
    "sourceFactIds": [
      "SEMI-EVERGREEN-ID"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-016",
    "qlName": "Semi-evergreen forest features",
    "difficulty": "Medium",
    "stem": "Which comparison is correct?",
    "answer": "Semi-evergreen forest has greater seasonal leaf fall than tropical evergreen forest",
    "distractors": [
      "Semi-evergreen forest is always drier than thorn scrub",
      "Evergreen forest has a longer dry season than semi-evergreen forest",
      "Both types must become completely leafless each year"
    ],
    "explanation": "Semi-evergreen areas experience more seasonal moisture stress than the wettest evergreen areas. As a result, deciduous elements and seasonal leaf fall are more noticeable.",
    "sourceFactIds": [
      "SEMI-EVERGREEN-COMPARE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-017",
    "qlName": "Evergreen and semi-evergreen comparison",
    "difficulty": "Easy",
    "stem": "Which forest type requires the most continuously wet tropical conditions?",
    "answer": "Tropical evergreen forest",
    "distractors": [
      "Semi-evergreen forest",
      "Dry deciduous forest",
      "Tropical thorn forest"
    ],
    "explanation": "Tropical evergreen forest occupies the wettest tropical conditions with limited dry-season stress. Semi-evergreen and deciduous types tolerate greater seasonality.",
    "sourceFactIds": [
      "EVERGREEN-WETTEST"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-017",
    "qlName": "Evergreen and semi-evergreen comparison",
    "difficulty": "Easy",
    "stem": "Which forest is more likely when a very wet tropical climate develops a somewhat stronger dry season?",
    "answer": "Semi-evergreen forest",
    "distractors": [
      "Alpine forest",
      "Tropical thorn forest immediately",
      "Tundra vegetation"
    ],
    "explanation": "A modest increase in seasonal dryness can shift vegetation toward semi-evergreen forest. This type retains dense tropical growth but includes more deciduous elements.",
    "sourceFactIds": [
      "SEMI-EVERGREEN-DRIER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-017",
    "qlName": "Evergreen and semi-evergreen comparison",
    "difficulty": "Medium",
    "stem": "How does leaf behaviour differ between evergreen and semi-evergreen forests?",
    "answer": "Semi-evergreen forests contain a larger deciduous component",
    "distractors": [
      "Evergreen forests become fully leafless every summer",
      "Semi-evergreen forests contain no trees",
      "Both have identical seasonal leaf fall"
    ],
    "explanation": "Evergreen forests have no common season of full leaf fall. Semi-evergreen forests show more seasonal shedding because deciduous species form a larger part of the community.",
    "sourceFactIds": [
      "EVERGREEN-SEMI-LEAVES"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-017",
    "qlName": "Evergreen and semi-evergreen comparison",
    "difficulty": "Medium",
    "stem": "Which sequence follows increasing seasonal dryness?",
    "answer": "Evergreen → semi-evergreen → moist deciduous",
    "distractors": [
      "Thorn → evergreen → alpine",
      "Moist deciduous → evergreen → rainforest with greater dryness",
      "Alpine → mangrove → evergreen"
    ],
    "explanation": "As the dry season becomes more important, tropical vegetation shifts from fully evergreen to mixed semi-evergreen and then toward deciduous forms. Moisture seasonality drives the sequence.",
    "sourceFactIds": [
      "VEG-DRYNESS-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-017",
    "qlName": "Evergreen and semi-evergreen comparison",
    "difficulty": "Medium",
    "stem": "Two warm forests receive high rainfall, but Forest B has a longer dry season and more leaf-shedding species. Which identification is reasonable?",
    "answer": "Forest A evergreen; Forest B semi-evergreen",
    "distractors": [
      "Forest A thorn; Forest B alpine",
      "Both must be identical evergreen forests",
      "Forest A dry deciduous; Forest B mangrove"
    ],
    "explanation": "The longer dry season in Forest B creates greater seasonal water stress and more deciduous elements. Forest A better fits fully evergreen conditions.",
    "sourceFactIds": [
      "EVERGREEN-SEMI-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-017",
    "qlName": "Evergreen and semi-evergreen comparison",
    "difficulty": "Medium",
    "stem": "Which feature is shared by evergreen and semi-evergreen tropical forests?",
    "answer": "Both occur in warm, relatively humid regions",
    "distractors": [
      "Both require rainfall below 70 cm",
      "Both are dominated by cold-climate conifers",
      "Both become completely leafless each year"
    ],
    "explanation": "Both forest types need substantial warmth and moisture. Their main difference is the degree of seasonal dryness and the resulting share of deciduous species.",
    "sourceFactIds": [
      "EVERGREEN-SEMI-SHARED"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-018",
    "qlName": "Evergreen integrated identification",
    "difficulty": "Easy",
    "stem": "A warm region has very high rainfall, tall dense trees and no common leaf-fall season. Which forest type fits?",
    "answer": "Tropical evergreen forest",
    "distractors": [
      "Tropical thorn forest",
      "Dry deciduous forest",
      "Montane coniferous forest"
    ],
    "explanation": "The combination of heavy rainfall, warmth and year-round green canopy is diagnostic of tropical evergreen forest. The other types indicate drier or colder conditions.",
    "sourceFactIds": [
      "EVERGREEN-INTEGRATED-EASY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-018",
    "qlName": "Evergreen integrated identification",
    "difficulty": "Easy",
    "stem": "Which regional clue most strongly supports tropical evergreen forest in India?",
    "answer": "Windward Western Ghats with very heavy rainfall",
    "distractors": [
      "Western Rajasthan with scanty rain",
      "Interior Deccan rain shadow",
      "High Himalayan cold desert"
    ],
    "explanation": "The windward Western Ghats receive abundant orographic rainfall in a warm setting. This supports evergreen forest much better than the dry or cold alternatives.",
    "sourceFactIds": [
      "EVERGREEN-REGIONAL-CLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-018",
    "qlName": "Evergreen integrated identification",
    "difficulty": "Medium",
    "stem": "A forest has ebony and mahogany, dense layers and heavy year-round moisture. What is the correct identification?",
    "answer": "Tropical evergreen forest",
    "distractors": [
      "Semi-arid thorn scrub",
      "Dry deciduous forest",
      "Subalpine conifer forest"
    ],
    "explanation": "The species, dense multi-layered structure and sustained moisture all point in the same direction. Together they identify tropical evergreen forest.",
    "sourceFactIds": [
      "EVERGREEN-MULTICLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-018",
    "qlName": "Evergreen integrated identification",
    "difficulty": "Medium",
    "stem": "Which set of clues is internally consistent?",
    "answer": "Heavy rainfall + windward Western Ghats + dense evergreen canopy",
    "distractors": [
      "Low rainfall + Western Rajasthan + dense evergreen canopy",
      "Permanent snow + tropical hardwoods + evergreen rainforest",
      "Rain shadow + cactus + multi-layered evergreen canopy"
    ],
    "explanation": "The first set combines the climate, region and structure expected for tropical evergreen forest. The other sets mix features from incompatible vegetation zones.",
    "sourceFactIds": [
      "EVERGREEN-CONSISTENT-SET"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-018",
    "qlName": "Evergreen integrated identification",
    "difficulty": "Medium",
    "stem": "A humid tropical forest remains dense but contains a noticeable mix of deciduous trees. Which conclusion is most likely?",
    "answer": "It is semi-evergreen rather than fully evergreen",
    "distractors": [
      "It must be thorn forest",
      "It must be alpine vegetation",
      "It cannot occur in a high-rainfall region"
    ],
    "explanation": "A deciduous component within a dense humid tropical forest indicates greater seasonality than true evergreen conditions. Semi-evergreen is the transitional type.",
    "sourceFactIds": [
      "SEMI-EVERGREEN-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-018",
    "qlName": "Evergreen integrated identification",
    "difficulty": "Medium",
    "stem": "Which physical change is most likely to convert evergreen conditions toward semi-evergreen without creating a dry forest immediately?",
    "answer": "A moderate increase in dry-season length",
    "distractors": [
      "A small rise in annual rainfall",
      "A shorter dry season",
      "A large increase in year-round soil moisture"
    ],
    "explanation": "A moderate increase in seasonal water stress introduces more deciduous elements while moisture remains sufficient for dense forest. That is the semi-evergreen transition.",
    "sourceFactIds": [
      "EVERGREEN-TO-SEMI"
    ]
  }
]);

export const GEO_VEG_001_CP002_REVIEW_BATCH_V1: readonly GeoVeg001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-VEG-001-CP002-Q${String(index + 1).padStart(3, "0")}`,
      qlId: raw.qlId,
      qlName: raw.qlName,
      difficulty: raw.difficulty,
      stem: raw.stem,
      options: placeGeoVegOptions(raw.answer, raw.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: raw.answer,
      explanation: raw.explanation,
      sourceIds: GEO_VEG_001_SOURCE_IDS,
      sourceFactIds: Object.freeze([...raw.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED = /associated with|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR = /currency|population census|political boundary|time zone|magnetic declination|crop price|road density|literacy|mineral price/i;

export function auditGeoVeg001Cp002ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoVeg001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_VEG_001_CP002_REVIEW_BATCH_V1) {
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
    const distractors = q.options.filter((_, index) => index !== q.correctIndex);
    if (distractors.some((option) => TRIVIAL_DISTRACTOR.test(option))) issues.push("TRIVIAL_DISTRACTOR:" + q.questionId);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push("PROVENANCE:" + q.questionId);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push("LIFECYCLE:" + q.questionId);
    const learnerText = q.stem + "\n" + q.options.join("\n") + "\n" + q.explanation;
    if (BANNED.test(learnerText)) issues.push("STYLE:" + q.questionId);
    if (q.stem.length < 22 || q.stem.length > 360 || !q.stem.trim().endsWith("?")) issues.push("STEM_SHAPE:" + q.questionId);
    if (q.explanation.length < 110) issues.push("SHORT_EXPLANATION:" + q.questionId);
  }

  if (GEO_VEG_001_CP002_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_VEG_001_CP002_REVIEW_BATCH_V1.length);
  for (let n = 10; n <= 18; n += 1) {
    const qlId = "GEO-VEG-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_VEG_001_CP002_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
