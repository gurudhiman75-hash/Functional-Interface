import {
  GEO_VEG_001_SOURCE_IDS,
  placeGeoVegOptions,
  type GeoVeg001Difficulty,
  type GeoVeg001Question,
} from "./geo-veg-001-review-types";

type RawQuestion = Readonly<{
  qlId: string; qlName: string; difficulty: GeoVeg001Difficulty; stem: string;
  answer: string; distractors: readonly string[]; explanation: string; sourceFactIds: readonly string[];
}>;

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-VEG-001-QL-019",
    "qlName": "Deciduous forest identity",
    "difficulty": "Easy",
    "stem": "Which forest type is often called the monsoon forest of India?",
    "answer": "Tropical deciduous forest",
    "distractors": [
      "Tropical evergreen forest",
      "Tropical thorn forest",
      "Montane conifer forest"
    ],
    "explanation": "Tropical deciduous forests are closely tied to the seasonal monsoon climate. Their trees shed leaves during the dry period to reduce water loss.",
    "sourceFactIds": [
      "DECIDUOUS-MONSOON-NAME"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-019",
    "qlName": "Deciduous forest identity",
    "difficulty": "Easy",
    "stem": "What is a key feature of tropical deciduous trees during the dry season?",
    "answer": "They shed leaves for a period to conserve water",
    "distractors": [
      "They remain fully evergreen in all seasons",
      "They become permanently leafless",
      "They depend on snowmelt for growth"
    ],
    "explanation": "Seasonal leaf shedding reduces water loss when soil moisture becomes limited. This is the defining seasonal behaviour of deciduous forests.",
    "sourceFactIds": [
      "DECIDUOUS-LEAF-SHEDDING"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-019",
    "qlName": "Deciduous forest identity",
    "difficulty": "Medium",
    "stem": "Why are tropical deciduous forests called seasonal forests?",
    "answer": "Their growth and leaf fall respond strongly to wet and dry seasons",
    "distractors": [
      "Their trees grow only during winter",
      "They occur only in one month each year",
      "They receive the same rainfall every month"
    ],
    "explanation": "Monsoon rainfall creates a wet growing season followed by a drier period. Trees adjust by shedding leaves when moisture stress increases.",
    "sourceFactIds": [
      "DECIDUOUS-SEASONALITY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-019",
    "qlName": "Deciduous forest identity",
    "difficulty": "Medium",
    "stem": "A forest is green during the rainy season but many trees become leafless for several weeks in the dry season. Which type fits?",
    "answer": "Tropical deciduous forest",
    "distractors": [
      "Tropical evergreen forest",
      "Mangrove forest",
      "Alpine meadow"
    ],
    "explanation": "A distinct dry-season leaf-fall period is the central clue. Evergreen forests do not have one common season of widespread leaf shedding.",
    "sourceFactIds": [
      "DECIDUOUS-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-019",
    "qlName": "Deciduous forest identity",
    "difficulty": "Medium",
    "stem": "Which adaptation helps deciduous trees survive seasonal water shortage?",
    "answer": "Temporary leaf shedding",
    "distractors": [
      "Permanent leaflessness",
      "Growth of breathing roots in all soils",
      "Needle leaves caused by severe frost"
    ],
    "explanation": "Dropping leaves lowers transpiration when water is scarce. The tree can then produce new leaves when moisture conditions improve.",
    "sourceFactIds": [
      "DECIDUOUS-ADAPTATION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-019",
    "qlName": "Deciduous forest identity",
    "difficulty": "Hard",
    "stem": "Two warm forests receive similar annual rainfall, but one has a long dry season and widespread leaf fall while the other stays green. What best explains the difference?",
    "answer": "Rainfall seasonality and dry-season length differ",
    "distractors": [
      "Annual rainfall alone always fixes forest type",
      "The deciduous forest must be colder than freezing",
      "Evergreen trees cannot lose individual leaves"
    ],
    "explanation": "The timing of rainfall matters as well as the annual total. A stronger dry season favours synchronized leaf shedding, while more continuous moisture supports evergreen growth.",
    "sourceFactIds": [
      "DECIDUOUS-VS-EVERGREEN-SEASON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-020",
    "qlName": "Deciduous rainfall range",
    "difficulty": "Easy",
    "stem": "Tropical deciduous forests in India are common in areas receiving roughly which annual rainfall range?",
    "answer": "About 70–200 cm",
    "distractors": [
      "Below 20 cm only",
      "Above 300 cm with no dry season",
      "Only snowfall-based precipitation"
    ],
    "explanation": "Deciduous forests occupy a wide monsoon-rainfall belt between very wet evergreen areas and much drier thorn regions. The dry season remains important within this range.",
    "sourceFactIds": [
      "DECIDUOUS-RAINFALL-RANGE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-020",
    "qlName": "Deciduous rainfall range",
    "difficulty": "Easy",
    "stem": "Which rainfall range is typical of moist deciduous forests?",
    "answer": "About 100–200 cm",
    "distractors": [
      "Below 50 cm",
      "About 50–70 cm only",
      "Above 300 cm in all cases"
    ],
    "explanation": "Moist deciduous forests occur in the wetter part of the deciduous belt. Rainfall is substantial but still seasonal enough to produce leaf fall.",
    "sourceFactIds": [
      "MOIST-DECIDUOUS-RAINFALL"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-020",
    "qlName": "Deciduous rainfall range",
    "difficulty": "Medium",
    "stem": "Which rainfall range is commonly linked with dry deciduous forests?",
    "answer": "About 70–100 cm",
    "distractors": [
      "Above 250 cm",
      "About 150–200 cm with no dry period",
      "Below 20 cm only"
    ],
    "explanation": "Dry deciduous forests occupy the drier part of the monsoon-forest belt. They receive less moisture than moist deciduous forests but more than typical thorn areas.",
    "sourceFactIds": [
      "DRY-DECIDUOUS-RAINFALL"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-020",
    "qlName": "Deciduous rainfall range",
    "difficulty": "Medium",
    "stem": "As rainfall decreases from about 180 cm to about 80 cm in a warm monsoon region, which change is likely?",
    "answer": "Moist deciduous vegetation grades toward dry deciduous vegetation",
    "distractors": [
      "Evergreen forest becomes denser",
      "Alpine vegetation develops at low elevation",
      "Mangroves spread across inland plateaus"
    ],
    "explanation": "Lower rainfall increases seasonal water stress. This favours the more open and drought-tolerant dry deciduous form.",
    "sourceFactIds": [
      "DECIDUOUS-RAINFALL-GRADIENT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-020",
    "qlName": "Deciduous rainfall range",
    "difficulty": "Medium",
    "stem": "Which sequence follows decreasing rainfall in warm lowland conditions?",
    "answer": "Evergreen → moist deciduous → dry deciduous → thorn scrub",
    "distractors": [
      "Thorn scrub → evergreen → alpine → mangrove",
      "Dry deciduous → evergreen → thorn scrub → rainforest",
      "Mangrove → alpine → evergreen → deciduous"
    ],
    "explanation": "A fall in available moisture generally shifts vegetation from dense evergreen forest toward increasingly seasonal and open forms. Thorn scrub occupies the driest end of this sequence.",
    "sourceFactIds": [
      "VEG-RAINFALL-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-020",
    "qlName": "Deciduous rainfall range",
    "difficulty": "Hard",
    "stem": "Region A gets 160 cm of monsoon rain and Region B gets 80 cm, with similar temperatures. Which comparison is most plausible?",
    "answer": "A is more likely moist deciduous; B more likely dry deciduous",
    "distractors": [
      "A must be thorn scrub; B evergreen",
      "Both must support identical vegetation",
      "B must be montane conifer because rainfall is lower"
    ],
    "explanation": "Both rainfall totals lie within the wider deciduous range, but Region A is wetter. Region B has stronger moisture stress and better fits dry deciduous conditions.",
    "sourceFactIds": [
      "DECIDUOUS-RAINFALL-COMPARE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-021",
    "qlName": "Moist deciduous distribution",
    "difficulty": "Easy",
    "stem": "Moist deciduous forests are found in which part of the deciduous rainfall belt?",
    "answer": "Areas with higher seasonal rainfall",
    "distractors": [
      "The driest desert margins only",
      "Permanent snow zones",
      "Salt marshes only"
    ],
    "explanation": "Moist deciduous forests occupy the wetter portion of the deciduous zone. They still face a dry season but receive more moisture than dry deciduous forests.",
    "sourceFactIds": [
      "MOIST-DECIDUOUS-WETTER-BELT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-021",
    "qlName": "Moist deciduous distribution",
    "difficulty": "Easy",
    "stem": "Which region can support moist deciduous forests in India?",
    "answer": "Eastern slopes of the Western Ghats",
    "distractors": [
      "Thar Desert interior",
      "Cold desert of Ladakh",
      "Highest alpine belt"
    ],
    "explanation": "The eastern slopes receive less rain than the windward evergreen belt but can still receive enough seasonal moisture for moist deciduous forest.",
    "sourceFactIds": [
      "MOIST-DECIDUOUS-EASTERN-WG"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-021",
    "qlName": "Moist deciduous distribution",
    "difficulty": "Medium",
    "stem": "Which group of regions fits moist deciduous distribution?",
    "answer": "Jharkhand, Odisha and Chhattisgarh",
    "distractors": [
      "Western Rajasthan, Ladakh and Kachchh desert",
      "Upper alpine Himalaya only",
      "Dry rain-shadow interiors only"
    ],
    "explanation": "Large parts of eastern and central India receive monsoon rainfall suitable for moist deciduous forests. These areas form an important belt of monsoon forest.",
    "sourceFactIds": [
      "MOIST-DECIDUOUS-EAST-CENTRAL"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-021",
    "qlName": "Moist deciduous distribution",
    "difficulty": "Medium",
    "stem": "Why can vegetation change from evergreen on the windward Western Ghats to moist deciduous farther east?",
    "answer": "Rainfall decreases and the dry season becomes more important",
    "distractors": [
      "Temperature rises above the tropical range immediately",
      "Soil disappears east of the crest",
      "Leaf shedding is unrelated to moisture"
    ],
    "explanation": "Crossing the Ghats reduces monsoon moisture because of the rain-shadow effect. Greater seasonality favours deciduous rather than fully evergreen forest.",
    "sourceFactIds": [
      "WG-EVERGREEN-TO-MOIST"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-021",
    "qlName": "Moist deciduous distribution",
    "difficulty": "Medium",
    "stem": "A warm eastern Indian plateau receives substantial monsoon rain but has a clear dry season. Which forest type is likely?",
    "answer": "Moist deciduous forest",
    "distractors": [
      "Tropical evergreen rainforest with no seasonal leaf fall",
      "Thorn scrub caused by extreme aridity",
      "Subalpine conifer forest"
    ],
    "explanation": "The rainfall is high enough for dense tree growth, yet seasonal dryness encourages leaf shedding. That combination fits moist deciduous forest.",
    "sourceFactIds": [
      "MOIST-DECIDUOUS-PLATEAU"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-021",
    "qlName": "Moist deciduous distribution",
    "difficulty": "Hard",
    "stem": "A transect runs from the wet western face of the Ghats to the drier interior. Which vegetation sequence is most reasonable before true thorn conditions appear?",
    "answer": "Evergreen → moist deciduous → dry deciduous",
    "distractors": [
      "Thorn → evergreen → mangrove",
      "Alpine → evergreen → thorn",
      "Mangrove → moist deciduous → alpine"
    ],
    "explanation": "Rainfall generally decreases from the windward side toward the rain-shadow interior. Vegetation therefore becomes progressively more seasonal and open.",
    "sourceFactIds": [
      "WG-VEGETATION-TRANSECT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-022",
    "qlName": "Moist deciduous species",
    "difficulty": "Easy",
    "stem": "Which tree is especially important in moist deciduous forests of India?",
    "answer": "Teak",
    "distractors": [
      "Ebony",
      "Babool",
      "Deodar"
    ],
    "explanation": "Teak is a major deciduous timber tree and is widespread in suitable monsoon-forest areas. Ebony is evergreen, babool is linked with drier thorn zones, and deodar is montane.",
    "sourceFactIds": [
      "TEAK-MOIST-DECIDUOUS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-022",
    "qlName": "Moist deciduous species",
    "difficulty": "Easy",
    "stem": "Which tree is a characteristic deciduous forest species in India?",
    "answer": "Sal",
    "distractors": [
      "Cactus",
      "Fir",
      "Mangrove palm only"
    ],
    "explanation": "Sal is one of the major trees of India's deciduous forests, especially in eastern and northern belts. It is not a desert succulent or high-altitude conifer.",
    "sourceFactIds": [
      "SAL-DECIDUOUS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-022",
    "qlName": "Moist deciduous species",
    "difficulty": "Medium",
    "stem": "A forest contains teak, bamboo and other leaf-shedding trees. Which type is most likely?",
    "answer": "Moist deciduous forest",
    "distractors": [
      "Tropical evergreen forest",
      "Tropical thorn scrub",
      "Alpine meadow"
    ],
    "explanation": "Teak and bamboo are familiar components of moist deciduous vegetation. Seasonal leaf fall distinguishes the forest from evergreen types.",
    "sourceFactIds": [
      "MOIST-SPECIES-ID"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-022",
    "qlName": "Moist deciduous species",
    "difficulty": "Medium",
    "stem": "Which pair is correctly matched?",
    "answer": "Teak — tropical deciduous forest",
    "distractors": [
      "Ebony — tropical thorn forest",
      "Deodar — moist deciduous forest",
      "Cactus — moist deciduous forest"
    ],
    "explanation": "Teak is a classic deciduous forest tree. The other pairs mix species with vegetation zones where they are not characteristic.",
    "sourceFactIds": [
      "TEAK-PAIR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-022",
    "qlName": "Moist deciduous species",
    "difficulty": "Medium",
    "stem": "Which group contains trees commonly found in deciduous forests?",
    "answer": "Teak, sal and shisham",
    "distractors": [
      "Ebony, mahogany and rosewood only",
      "Cactus, euphorbia and babool only",
      "Fir, spruce and deodar only"
    ],
    "explanation": "Teak, sal and shisham are standard examples of deciduous forest trees. The other groups better represent evergreen, thorn or montane vegetation.",
    "sourceFactIds": [
      "DECIDUOUS-SPECIES-GROUP"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-022",
    "qlName": "Moist deciduous species",
    "difficulty": "Hard",
    "stem": "A timber-rich monsoon forest has teak and sal, receives substantial seasonal rainfall and sheds leaves in the dry period. Which identification is strongest?",
    "answer": "Tropical deciduous forest",
    "distractors": [
      "Tropical evergreen forest",
      "Thorn scrub",
      "Subalpine forest"
    ],
    "explanation": "The species, rainfall pattern and seasonal leaf fall all reinforce the same identification. These are characteristic clues of tropical deciduous forest.",
    "sourceFactIds": [
      "DECIDUOUS-SPECIES-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-023",
    "qlName": "Dry deciduous distribution",
    "difficulty": "Easy",
    "stem": "Dry deciduous forests generally occur where rainfall is lower than in moist deciduous areas. Which range fits best?",
    "answer": "About 70–100 cm annually",
    "distractors": [
      "Above 250 cm",
      "Below 20 cm only",
      "Only snowfall above 3000 m"
    ],
    "explanation": "Dry deciduous forests occupy the drier part of the deciduous belt. Rainfall is still sufficient for woodland but the dry season is stronger.",
    "sourceFactIds": [
      "DRY-DECIDUOUS-RANGE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-023",
    "qlName": "Dry deciduous distribution",
    "difficulty": "Easy",
    "stem": "Which region can contain dry deciduous forests?",
    "answer": "Rainier parts of the Peninsular Plateau",
    "distractors": [
      "Wettest windward evergreen belt only",
      "Highest Himalayan snow zone",
      "Tidal delta only"
    ],
    "explanation": "Parts of the Peninsular Plateau receive seasonal rainfall suitable for dry deciduous forest. These areas are drier than moist deciduous zones but not as arid as thorn country.",
    "sourceFactIds": [
      "DRY-DECIDUOUS-PENINSULA"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-023",
    "qlName": "Dry deciduous distribution",
    "difficulty": "Medium",
    "stem": "Why are dry deciduous forests more open than moist deciduous forests?",
    "answer": "Lower rainfall and stronger seasonal water stress limit dense growth",
    "distractors": [
      "They receive more year-round moisture",
      "They occur only in permanently frozen ground",
      "Their trees never lose leaves"
    ],
    "explanation": "Reduced moisture supports fewer and more widely spaced trees. A longer dry season also increases the duration of leaf fall.",
    "sourceFactIds": [
      "DRY-DECIDUOUS-OPEN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-023",
    "qlName": "Dry deciduous distribution",
    "difficulty": "Medium",
    "stem": "A warm inland area gets about 80 cm of monsoon rainfall. Which forest type is more likely than moist deciduous forest?",
    "answer": "Dry deciduous forest",
    "distractors": [
      "Tropical evergreen forest",
      "Mangrove forest",
      "Alpine forest"
    ],
    "explanation": "Around 80 cm lies in the drier deciduous range. Seasonal water stress is stronger, producing a more open woodland.",
    "sourceFactIds": [
      "DRY-DECIDUOUS-80CM"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-023",
    "qlName": "Dry deciduous distribution",
    "difficulty": "Medium",
    "stem": "Which change can move vegetation from moist deciduous toward dry deciduous?",
    "answer": "Lower annual rainfall with a longer dry period",
    "distractors": [
      "Higher rainfall spread through the year",
      "Shorter seasonal drought",
      "Greater year-round soil moisture"
    ],
    "explanation": "Less rainfall and a stronger dry season increase water stress. The forest becomes more open and more strongly seasonal.",
    "sourceFactIds": [
      "MOIST-TO-DRY-DECIDUOUS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-023",
    "qlName": "Dry deciduous distribution",
    "difficulty": "Hard",
    "stem": "Region A has 120 cm of monsoon rain and Region B has 75 cm, with similar relief and temperature. Which contrast is likely?",
    "answer": "A supports denser moist deciduous forest; B supports more open dry deciduous forest",
    "distractors": [
      "A supports thorn scrub; B evergreen forest",
      "Both must have identical canopy density",
      "B becomes alpine because rainfall is lower"
    ],
    "explanation": "Rainfall is the key differing control in this comparison. The wetter region can support denser deciduous growth, while the drier one has greater seasonal stress.",
    "sourceFactIds": [
      "MOIST-DRY-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-024",
    "qlName": "Dry deciduous features",
    "difficulty": "Easy",
    "stem": "What happens to many dry deciduous trees during the driest part of the year?",
    "answer": "They shed leaves for several weeks",
    "distractors": [
      "They become permanently evergreen",
      "They grow breathing roots",
      "They remain under snow"
    ],
    "explanation": "Dry deciduous trees reduce water loss by dropping leaves during the strongest moisture stress. New foliage appears when better moisture returns.",
    "sourceFactIds": [
      "DRY-DECIDUOUS-LEAF-PERIOD"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-024",
    "qlName": "Dry deciduous features",
    "difficulty": "Easy",
    "stem": "Which structure is typical of dry deciduous forest?",
    "answer": "A more open canopy than moist deciduous forest",
    "distractors": [
      "A continuously closed rainforest canopy",
      "Treeless permanent snowfield",
      "Dense tidal mangrove roots"
    ],
    "explanation": "Lower rainfall limits canopy density and creates more open woodland. This contrasts with the denser moist deciduous form.",
    "sourceFactIds": [
      "DRY-DECIDUOUS-CANOPY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-024",
    "qlName": "Dry deciduous features",
    "difficulty": "Medium",
    "stem": "Why can grasses and shrubs be more noticeable in dry deciduous areas?",
    "answer": "The open tree canopy allows more light to reach lower layers",
    "distractors": [
      "The forest has no trees at all",
      "Rainfall is higher than in evergreen forest",
      "Permanent snow removes the canopy"
    ],
    "explanation": "Greater spacing between trees lets more sunlight reach the ground. This can support a stronger grass and shrub layer.",
    "sourceFactIds": [
      "DRY-DECIDUOUS-UNDERGROWTH"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-024",
    "qlName": "Dry deciduous features",
    "difficulty": "Medium",
    "stem": "Which clue separates dry deciduous forest from thorn scrub?",
    "answer": "Dry deciduous still forms seasonal woodland with more tree cover",
    "distractors": [
      "Dry deciduous receives less rain than true desert thorn zones",
      "Thorn scrub always has a closed canopy",
      "Dry deciduous lacks any seasonal leaf fall"
    ],
    "explanation": "Dry deciduous areas receive enough rainfall to maintain a recognizable woodland. Thorn vegetation is more open and drought-adapted under still lower rainfall.",
    "sourceFactIds": [
      "DRY-VS-THORN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-024",
    "qlName": "Dry deciduous features",
    "difficulty": "Medium",
    "stem": "A forest has widely spaced trees that shed leaves during a long dry season but still forms woodland. Which type fits?",
    "answer": "Dry deciduous forest",
    "distractors": [
      "Tropical evergreen forest",
      "Dense mangrove forest",
      "Alpine scrub"
    ],
    "explanation": "The combination of woodland structure and strong seasonal leaf fall is characteristic of dry deciduous forest. Thorn vegetation would be even more open and drought-adapted.",
    "sourceFactIds": [
      "DRY-DECIDUOUS-ID"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-024",
    "qlName": "Dry deciduous features",
    "difficulty": "Hard",
    "stem": "Why does dry deciduous forest not normally remain as dense as moist deciduous forest even when both are tropical?",
    "answer": "Lower moisture availability limits continuous canopy growth",
    "distractors": [
      "Tropical temperature prevents dense forests",
      "Deciduous trees cannot grow close together",
      "Soil has no role in vegetation"
    ],
    "explanation": "Both are warm, so the key contrast is water availability. Lower and more seasonal rainfall reduces the density of tree growth in dry deciduous areas.",
    "sourceFactIds": [
      "DRY-DECIDUOUS-DENSITY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-025",
    "qlName": "Moist and dry deciduous comparison",
    "difficulty": "Easy",
    "stem": "Which deciduous type receives more rainfall?",
    "answer": "Moist deciduous forest",
    "distractors": [
      "Dry deciduous forest",
      "Both receive exactly the same amount",
      "Neither depends on rainfall"
    ],
    "explanation": "Moist deciduous forest occupies the wetter part of the deciduous rainfall belt. Dry deciduous forest develops under lower and more seasonal moisture.",
    "sourceFactIds": [
      "MOIST-DRY-RAINFALL"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-025",
    "qlName": "Moist and dry deciduous comparison",
    "difficulty": "Easy",
    "stem": "Which deciduous type usually has the more open canopy?",
    "answer": "Dry deciduous forest",
    "distractors": [
      "Moist deciduous forest",
      "Both are equally dense everywhere",
      "Only mangrove forest"
    ],
    "explanation": "Lower rainfall in dry deciduous areas limits canopy closure. Moist deciduous forest generally supports denser tree growth.",
    "sourceFactIds": [
      "MOIST-DRY-CANOPY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-025",
    "qlName": "Moist and dry deciduous comparison",
    "difficulty": "Medium",
    "stem": "Which comparison is correct?",
    "answer": "Moist deciduous occurs in wetter conditions than dry deciduous",
    "distractors": [
      "Dry deciduous requires more rainfall than moist deciduous",
      "Both occur only above the tree line",
      "Moist deciduous is a desert vegetation type"
    ],
    "explanation": "The two forest types form a moisture gradient within the monsoon forest belt. Moist deciduous occupies the wetter side and dry deciduous the drier side.",
    "sourceFactIds": [
      "MOIST-DRY-CORRECT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-025",
    "qlName": "Moist and dry deciduous comparison",
    "difficulty": "Medium",
    "stem": "A forest shifts from dense teak-sal woodland to more open seasonal woodland along a rainfall decline. What transition is occurring?",
    "answer": "Moist deciduous to dry deciduous",
    "distractors": [
      "Evergreen to mangrove",
      "Thorn scrub to rainforest",
      "Alpine to tidal forest"
    ],
    "explanation": "The forest remains deciduous but becomes more open as moisture decreases. That is the expected transition from moist to dry deciduous conditions.",
    "sourceFactIds": [
      "MOIST-DRY-TRANSITION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-025",
    "qlName": "Moist and dry deciduous comparison",
    "difficulty": "Medium",
    "stem": "Which factor most directly explains the general difference between moist and dry deciduous forests?",
    "answer": "Amount and seasonality of rainfall",
    "distractors": [
      "Soil colour alone",
      "Tree species alone",
      "Altitude alone"
    ],
    "explanation": "Both types are tropical monsoon forests, but they receive different amounts of usable moisture. Rainfall amount and dry-season strength shape canopy density and leaf-fall duration.",
    "sourceFactIds": [
      "MOIST-DRY-CONTROL"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-025",
    "qlName": "Moist and dry deciduous comparison",
    "difficulty": "Medium",
    "stem": "Which sequence is correct within the deciduous belt as conditions become drier?",
    "answer": "Moist deciduous → dry deciduous",
    "distractors": [
      "Dry deciduous → moist deciduous",
      "Alpine → moist deciduous",
      "Mangrove → evergreen"
    ],
    "explanation": "The wetter deciduous type gives way to the drier form as water availability falls. The change is gradual across many landscapes.",
    "sourceFactIds": [
      "MOIST-DRY-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-026",
    "qlName": "Deciduous tree identification",
    "difficulty": "Easy",
    "stem": "Which tree is strongly linked with India's deciduous forests?",
    "answer": "Teak",
    "distractors": [
      "Ebony",
      "Cactus",
      "Fir"
    ],
    "explanation": "Teak is one of the best-known deciduous timber trees in India. The distractors point to evergreen, thorn or montane vegetation.",
    "sourceFactIds": [
      "DECIDUOUS-TEAK-ID"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-026",
    "qlName": "Deciduous tree identification",
    "difficulty": "Easy",
    "stem": "Which tree is common in deciduous forests of northern and eastern India?",
    "answer": "Sal",
    "distractors": [
      "Mahogany",
      "Cactus",
      "Spruce"
    ],
    "explanation": "Sal is a major deciduous species in large parts of northern and eastern India. It is not a desert succulent or high-altitude conifer.",
    "sourceFactIds": [
      "DECIDUOUS-SAL-ID"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-026",
    "qlName": "Deciduous tree identification",
    "difficulty": "Medium",
    "stem": "Which species pair points most strongly to deciduous forest?",
    "answer": "Teak and sal",
    "distractors": [
      "Ebony and mahogany",
      "Cactus and euphorbia",
      "Fir and spruce"
    ],
    "explanation": "Teak and sal are characteristic deciduous trees. The alternative pairs correspond more closely to evergreen, thorn and montane forests.",
    "sourceFactIds": [
      "DECIDUOUS-PAIR-ID"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-026",
    "qlName": "Deciduous tree identification",
    "difficulty": "Medium",
    "stem": "A question lists teak, shisham and bamboo. Which vegetation group should you think of first?",
    "answer": "Tropical deciduous forest",
    "distractors": [
      "Tropical evergreen forest only",
      "Thorn scrub only",
      "Alpine vegetation"
    ],
    "explanation": "These species are commonly encountered in deciduous forest descriptions. Their combination is a stronger clue than any one species viewed in isolation.",
    "sourceFactIds": [
      "DECIDUOUS-SPECIES-CLUSTER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-026",
    "qlName": "Deciduous tree identification",
    "difficulty": "Medium",
    "stem": "Which option contains a mismatched forest-species pair?",
    "answer": "Cactus — moist deciduous forest",
    "distractors": [
      "Teak — deciduous forest",
      "Sal — deciduous forest",
      "Shisham — deciduous forest"
    ],
    "explanation": "Cactus is adapted to dry thorn conditions rather than moist deciduous forest. The other trees are standard deciduous examples.",
    "sourceFactIds": [
      "DECIDUOUS-MISMATCH"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-026",
    "qlName": "Deciduous tree identification",
    "difficulty": "Medium",
    "stem": "Why is species identification useful but not sufficient by itself to classify a forest?",
    "answer": "Forest type also depends on climate, structure and the wider plant community",
    "distractors": [
      "Every species occurs in only one exact district",
      "Rainfall never matters once a species is known",
      "A single tree always fixes the whole forest type"
    ],
    "explanation": "A species can be a strong clue, but forest classification reflects the complete vegetation community and its environment. Climate and structure should support the identification.",
    "sourceFactIds": [
      "DECIDUOUS-SPECIES-LIMIT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-027",
    "qlName": "Deciduous integrated identification",
    "difficulty": "Easy",
    "stem": "A warm monsoon forest sheds leaves during the dry season. Which type is indicated?",
    "answer": "Tropical deciduous forest",
    "distractors": [
      "Tropical evergreen forest",
      "Mangrove forest",
      "Alpine meadow"
    ],
    "explanation": "Seasonal leaf fall in a warm monsoon setting is the key identifying feature of tropical deciduous forest. It reflects adaptation to dry-season water stress.",
    "sourceFactIds": [
      "DECIDUOUS-INTEGRATED-EASY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-027",
    "qlName": "Deciduous integrated identification",
    "difficulty": "Easy",
    "stem": "Which clue points to moist rather than dry deciduous forest?",
    "answer": "Higher annual rainfall and a denser canopy",
    "distractors": [
      "Lower rainfall and a more open canopy",
      "Rainfall below 70 cm with thorn scrub",
      "Permanent snow cover"
    ],
    "explanation": "Moist deciduous forest receives more rainfall and supports denser tree growth. Dry deciduous forest is more open because seasonal water stress is stronger.",
    "sourceFactIds": [
      "MOIST-DECIDUOUS-CLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-027",
    "qlName": "Deciduous integrated identification",
    "difficulty": "Medium",
    "stem": "A forest gets about 90 cm of rain, has open woodland and sheds leaves for a long dry period. Which type fits?",
    "answer": "Dry deciduous forest",
    "distractors": [
      "Tropical evergreen forest",
      "Moist deciduous forest of the wettest belt",
      "Mangrove forest"
    ],
    "explanation": "Around 90 cm and a strong dry season fit dry deciduous conditions. The open canopy reinforces the identification.",
    "sourceFactIds": [
      "DRY-DECIDUOUS-MULTICLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-027",
    "qlName": "Deciduous integrated identification",
    "difficulty": "Medium",
    "stem": "Which set of clues is internally consistent?",
    "answer": "120–180 cm rainfall + teak/sal + seasonal leaf fall",
    "distractors": [
      "Below 70 cm + dense evergreen canopy + ebony",
      "Permanent snow + teak-sal monsoon forest",
      "Tidal mudflat + dry deciduous teak forest"
    ],
    "explanation": "The first set combines deciduous rainfall, typical tree species and expected dry-season leaf fall. The other sets mix incompatible vegetation features.",
    "sourceFactIds": [
      "DECIDUOUS-CONSISTENT-SET"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-027",
    "qlName": "Deciduous integrated identification",
    "difficulty": "Medium",
    "stem": "A warm forest receives less rain than a nearby evergreen belt but more than a thorn zone. Which vegetation is most likely between them?",
    "answer": "Tropical deciduous forest",
    "distractors": [
      "Alpine forest",
      "Tundra",
      "Salt-marsh vegetation only"
    ],
    "explanation": "Deciduous forest occupies the intermediate moisture zone between very wet evergreen forest and much drier thorn vegetation. Its seasonal leaf fall reflects this position.",
    "sourceFactIds": [
      "DECIDUOUS-INTERMEDIATE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-027",
    "qlName": "Deciduous integrated identification",
    "difficulty": "Medium",
    "stem": "Why is tropical deciduous forest so widespread in India compared with evergreen forest?",
    "answer": "Large areas have seasonal monsoon rainfall rather than continuously wet conditions",
    "distractors": [
      "Most of India is permanently frozen",
      "Evergreen trees cannot grow in the tropics",
      "Deciduous forests require no rainfall"
    ],
    "explanation": "Much of India receives substantial but strongly seasonal monsoon rainfall. That climate favours leaf-shedding forests over continuously wet evergreen vegetation.",
    "sourceFactIds": [
      "DECIDUOUS-WIDESPREAD"
    ]
  }
]);

export const GEO_VEG_001_CP003_REVIEW_BATCH_V1: readonly GeoVeg001Question[] = Object.freeze(
  RAW.map((raw,index)=>{const correctIndex=index%4;return Object.freeze({
    questionId:`GEO-VEG-001-CP003-Q${String(index+1).padStart(3,"0")}`,qlId:raw.qlId,qlName:raw.qlName,
    difficulty:raw.difficulty,stem:raw.stem,options:placeGeoVegOptions(raw.answer,raw.distractors,correctIndex),
    correctIndex,canonicalAnswer:raw.answer,explanation:raw.explanation,sourceIds:GEO_VEG_001_SOURCE_IDS,
    sourceFactIds:Object.freeze([...raw.sourceFactIds]),reviewOnly:true as const,runtimeRegistered:false as const,
  });})
);
const BANNED=/associated with|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR=/currency|population census|political boundary|time zone|magnetic declination|crop price|road density|literacy|mineral price/i;
export function auditGeoVeg001Cp003ReviewBatchV1(){
 const issues:string[]=[];const ids=new Set<string>();const stems=new Set<string>();const explanations=new Set<string>();
 const qlCounts:Record<string,number>={};const difficultyCounts:Record<GeoVeg001Difficulty,number>={Easy:0,Medium:0,Hard:0};const answerPositions=[0,0,0,0];
 for(const q of GEO_VEG_001_CP003_REVIEW_BATCH_V1){
  if(ids.has(q.questionId))issues.push("DUPLICATE_ID:"+q.questionId);ids.add(q.questionId);
  const st=q.stem.replace(/\s+/g," ").trim().toLowerCase();if(stems.has(st))issues.push("DUPLICATE_STEM:"+q.questionId);stems.add(st);
  const ex=q.explanation.replace(/\s+/g," ").trim().toLowerCase();if(explanations.has(ex))issues.push("DUPLICATE_EXPLANATION:"+q.questionId);explanations.add(ex);
  qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]+=1;answerPositions[q.correctIndex]+=1;
  if(q.options.length!==4||new Set(q.options).size!==4)issues.push("OPTIONS:"+q.questionId);
  if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push("ANSWER:"+q.questionId);
  const distractors=q.options.filter((_,i)=>i!==q.correctIndex);if(distractors.some(o=>TRIVIAL_DISTRACTOR.test(o)))issues.push("TRIVIAL_DISTRACTOR:"+q.questionId);
  if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push("PROVENANCE:"+q.questionId);
  if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);
  const learner=q.stem+"\n"+q.options.join("\n")+"\n"+q.explanation;if(BANNED.test(learner))issues.push("STYLE:"+q.questionId);
  if(q.stem.length<22||q.stem.length>360||!q.stem.trim().endsWith("?"))issues.push("STEM_SHAPE:"+q.questionId);
  if(q.explanation.length<110)issues.push("SHORT_EXPLANATION:"+q.questionId);
 }
 if(GEO_VEG_001_CP003_REVIEW_BATCH_V1.length!==54)issues.push("COUNT:"+GEO_VEG_001_CP003_REVIEW_BATCH_V1.length);
 for(let n=19;n<=27;n++){const id="GEO-VEG-001-QL-"+String(n).padStart(3,"0");if(qlCounts[id]!==6)issues.push("QL_COUNT:"+id+":"+(qlCounts[id]??0));}
 if(difficultyCounts.Easy!==18||difficultyCounts.Medium!==30||difficultyCounts.Hard!==6)issues.push("DIFFICULTY:"+JSON.stringify(difficultyCounts));
 if(answerPositions.join(",")!=="14,14,13,13")issues.push("ANSWER_POSITIONS:"+answerPositions.join(","));
 if(stems.size!==54)issues.push("STEM_COUNT:"+stems.size);if(explanations.size!==54)issues.push("EXPLANATION_COUNT:"+explanations.size);
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_VEG_001_CP003_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
