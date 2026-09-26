import {
  GEO_AGR_001_SOURCE_IDS,
  placeGeoAgrOptions,
  type GeoAgr001Difficulty,
  type GeoAgr001Question,
} from "./geo-agr-001-review-types";
import { auditGeoAgr001Batch } from "./geo-agr-001-review-audit";

type RawQuestion = Readonly<{
  qlId: string; qlName: string; difficulty: GeoAgr001Difficulty; stem: string;
  answer: string; distractors: readonly string[]; explanation: string; sourceFactIds: readonly string[];
}>;

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-AGR-001-QL-037",
    "qlName": "Sugarcane crop type and duration",
    "difficulty": "Easy",
    "stem": "Sugarcane is primarily grown for the production of which product?",
    "answer": "Sugar",
    "distractors": [
      "Bast fibre",
      "Tea leaves",
      "Edible grain"
    ],
    "explanation": "Sugarcane stores sucrose in its stalks and is the principal raw material for sugar production. It is therefore classified as a major commercial sugar crop.",
    "sourceFactIds": [
      "SUGARCANE-SUGAR-CROP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-037",
    "qlName": "Sugarcane crop type and duration",
    "difficulty": "Easy",
    "stem": "Sugarcane is generally considered what type of field crop in terms of duration?",
    "answer": "Long-duration crop",
    "distractors": [
      "Very short zaid crop only",
      "One-week crop",
      "Permanent forest tree"
    ],
    "explanation": "Sugarcane remains in the field for many months before harvest and is therefore a long-duration commercial crop. Its field occupancy is much longer than that of most seasonal cereals.",
    "sourceFactIds": [
      "SUGARCANE-LONG-DURATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-037",
    "qlName": "Sugarcane crop type and duration",
    "difficulty": "Medium",
    "stem": "Why does sugarcane require careful planning in a cropping system?",
    "answer": "It occupies the field for a long period before harvest",
    "distractors": [
      "It matures in only a few days",
      "It grows without using land",
      "It is harvested before sowing"
    ],
    "explanation": "Sugarcane has a long growth cycle, so land remains committed to the crop for many months. This affects crop rotation, irrigation scheduling and field planning.",
    "sourceFactIds": [
      "SUGARCANE-DURATION-PLANNING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-037",
    "qlName": "Sugarcane crop type and duration",
    "difficulty": "Medium",
    "stem": "Which feature separates sugarcane from short-duration zaid crops?",
    "answer": "Its growing period extends across many months",
    "distractors": [
      "It is harvested within a few weeks",
      "It never needs a field",
      "It grows only under snow"
    ],
    "explanation": "Sugarcane is a long-duration crop, while zaid vegetables and melons complete their cycle in a short summer interval. The time spent in the field is a key difference.",
    "sourceFactIds": [
      "SUGARCANE-VS-ZAID-DURATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-037",
    "qlName": "Sugarcane crop type and duration",
    "difficulty": "Medium",
    "stem": "Which description fits sugarcane farming most accurately?",
    "answer": "Commercial cultivation of a long-duration cane crop for processing",
    "distractors": [
      "Short subsistence pulse grown only for home use",
      "Fibre crop grown for bast fibre",
      "Plantation beverage harvested as leaves"
    ],
    "explanation": "Sugarcane is grown commercially and its stalks are processed for sugar and related products. Its long field duration and processing link distinguish it from pulses, fibre and beverage crops.",
    "sourceFactIds": [
      "SUGARCANE-COMMERCIAL-PROCESSING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-037",
    "qlName": "Sugarcane crop type and duration",
    "difficulty": "Hard",
    "stem": "A crop occupies the same field for nearly a year, is cut as cane and sent for processing soon after harvest. Which crop is indicated?",
    "answer": "Sugarcane",
    "distractors": [
      "Mustard",
      "Jute",
      "Tea"
    ],
    "explanation": "A long-duration cane crop requiring rapid post-harvest processing strongly identifies sugarcane. Mustard, jute and tea differ in product, duration and processing pattern.",
    "sourceFactIds": [
      "SUGARCANE-DURATION-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-038",
    "qlName": "Sugarcane tropical and subtropical climate",
    "difficulty": "Easy",
    "stem": "Sugarcane grows well under which general climate?",
    "answer": "Warm tropical or subtropical climate",
    "distractors": [
      "Permanent polar climate",
      "Glacial climate",
      "Cold desert climate only"
    ],
    "explanation": "Sugarcane needs a long warm growing season and can be cultivated in both tropical and subtropical parts of India. Severe frost is harmful to the crop.",
    "sourceFactIds": [
      "SUGARCANE-WARM-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-038",
    "qlName": "Sugarcane tropical and subtropical climate",
    "difficulty": "Easy",
    "stem": "Which temperature condition is suitable for sugarcane growth?",
    "answer": "Warm conditions through most of the growing period",
    "distractors": [
      "Persistent freezing temperatures",
      "Permanent snow cover",
      "Sub-zero conditions throughout"
    ],
    "explanation": "Sugarcane is a warm-season crop and grows best where temperatures remain favourable for a long period. Prolonged frost or freezing weather damages cane growth.",
    "sourceFactIds": [
      "SUGARCANE-WARM-TEMP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-038",
    "qlName": "Sugarcane tropical and subtropical climate",
    "difficulty": "Medium",
    "stem": "Why is frost harmful to sugarcane?",
    "answer": "The crop is sensitive to prolonged low temperatures",
    "distractors": [
      "Sugarcane requires frozen stalks to grow",
      "Frost increases tropical growth",
      "The crop is a snow-season plant"
    ],
    "explanation": "Sugarcane is adapted to warm tropical and subtropical conditions, so frost can injure leaves and stalk tissue. A long frost-free period therefore supports better growth.",
    "sourceFactIds": [
      "SUGARCANE-FROST"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-038",
    "qlName": "Sugarcane tropical and subtropical climate",
    "difficulty": "Medium",
    "stem": "Which climate pattern gives sugarcane a longer growing advantage?",
    "answer": "Long warm season with little frost risk",
    "distractors": [
      "Short cold season with frequent freezing",
      "Permanent snowfall",
      "Very short growing season"
    ],
    "explanation": "A long warm season lets sugarcane accumulate biomass and sugar over many months. Frequent frost shortens or disrupts that growth period.",
    "sourceFactIds": [
      "SUGARCANE-LONG-WARM-SEASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-038",
    "qlName": "Sugarcane tropical and subtropical climate",
    "difficulty": "Medium",
    "stem": "Which region is climatically more suitable for sugarcane?",
    "answer": "Warm plain with a long frost-free season",
    "distractors": [
      "High glaciated valley",
      "Permanent snow plateau",
      "Polar desert"
    ],
    "explanation": "Sugarcane needs sustained warmth and a long growing period, so a warm frost-free plain is favourable. High cold regions do not provide the required temperature regime.",
    "sourceFactIds": [
      "SUGARCANE-CLIMATE-SETTING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-038",
    "qlName": "Sugarcane tropical and subtropical climate",
    "difficulty": "Hard",
    "stem": "Region A has a long warm season and rare frost; Region B has frequent winter frost and a short warm period. Which region is more suitable for sugarcane?",
    "answer": "Region A",
    "distractors": [
      "Region B",
      "Both are equally suited because temperature does not matter",
      "Neither can grow sugarcane"
    ],
    "explanation": "Sugarcane benefits from prolonged warmth and suffers under repeated frost. Region A therefore provides the stronger climatic fit for the crop.",
    "sourceFactIds": [
      "SUGARCANE-CLIMATE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-039",
    "qlName": "Sugarcane rainfall and irrigation",
    "difficulty": "Easy",
    "stem": "Sugarcane requires what kind of water supply during its long growing period?",
    "answer": "Adequate and dependable moisture",
    "distractors": [
      "No water after planting",
      "Only tidal seawater",
      "Permanent drought"
    ],
    "explanation": "Sugarcane has a long growing period and produces a large amount of biomass, so it needs a reliable water supply. Rainfall may be supplemented by irrigation where necessary.",
    "sourceFactIds": [
      "SUGARCANE-WATER-NEED"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-039",
    "qlName": "Sugarcane rainfall and irrigation",
    "difficulty": "Easy",
    "stem": "What can support sugarcane cultivation where rainfall is insufficient?",
    "answer": "Irrigation",
    "distractors": [
      "Removing all water access",
      "Snow cover only",
      "Dry wind alone"
    ],
    "explanation": "Irrigation supplies the moisture sugarcane needs when natural rainfall is inadequate. Canals, wells and other systems therefore support cane in relatively drier regions.",
    "sourceFactIds": [
      "SUGARCANE-IRRIGATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-039",
    "qlName": "Sugarcane rainfall and irrigation",
    "difficulty": "Medium",
    "stem": "Why is assured irrigation important in many sugarcane regions?",
    "answer": "The crop needs moisture for many months, not just at sowing",
    "distractors": [
      "The crop completes growth in a few days",
      "It requires no water after germination",
      "It grows only on dry dunes"
    ],
    "explanation": "Sugarcane stays in the field for a long time and needs water through much of its growth. Assured irrigation reduces the risk of moisture stress between rainfall events.",
    "sourceFactIds": [
      "SUGARCANE-IRRIGATION-LONG-DURATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-039",
    "qlName": "Sugarcane rainfall and irrigation",
    "difficulty": "Medium",
    "stem": "Which water condition is least suitable for healthy sugarcane roots?",
    "answer": "Prolonged waterlogging",
    "distractors": [
      "Controlled irrigation",
      "Adequate soil moisture",
      "Well-timed rainfall"
    ],
    "explanation": "Sugarcane needs plentiful moisture, but prolonged waterlogging reduces soil aeration and harms roots. Good drainage is therefore important even in well-watered fields.",
    "sourceFactIds": [
      "SUGARCANE-WATERLOGGING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-039",
    "qlName": "Sugarcane rainfall and irrigation",
    "difficulty": "Medium",
    "stem": "Which development would most directly help sugarcane in a lower-rainfall plain?",
    "answer": "Expansion of reliable irrigation",
    "distractors": [
      "Closure of canals",
      "Removal of wells",
      "Elimination of field drainage"
    ],
    "explanation": "Reliable irrigation can compensate for insufficient rainfall and maintain moisture through the long cane season. It is therefore a major support for cane cultivation in drier plains.",
    "sourceFactIds": [
      "SUGARCANE-LOW-RAIN-IRRIGATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-039",
    "qlName": "Sugarcane rainfall and irrigation",
    "difficulty": "Hard",
    "stem": "Two warm districts have similar soils. District A has dependable canal irrigation; District B has uncertain rain and no irrigation. Which is better for sugarcane?",
    "answer": "District A",
    "distractors": [
      "District B",
      "Both are identical because water is unimportant",
      "Neither can grow cane"
    ],
    "explanation": "Because sugarcane needs moisture over a long period, dependable irrigation gives District A a major advantage. District B faces a greater risk of water stress.",
    "sourceFactIds": [
      "SUGARCANE-WATER-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-040",
    "qlName": "Sugarcane soil and drainage",
    "difficulty": "Easy",
    "stem": "Which soil condition is favourable for sugarcane?",
    "answer": "Deep fertile soil with good drainage",
    "distractors": [
      "Bare rock without soil",
      "Permanent swamp mud only",
      "Glacial ice"
    ],
    "explanation": "Sugarcane develops a large root system and benefits from deep fertile soil. Good drainage prevents prolonged waterlogging while still allowing ample moisture.",
    "sourceFactIds": [
      "SUGARCANE-SOIL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-040",
    "qlName": "Sugarcane soil and drainage",
    "difficulty": "Easy",
    "stem": "Why is fertile soil important for sugarcane?",
    "answer": "The crop produces heavy biomass over a long growing period",
    "distractors": [
      "Sugarcane grows without nutrients",
      "The crop is harvested before roots form",
      "Fertility prevents all growth"
    ],
    "explanation": "Sugarcane produces substantial stalk biomass and remains in the field for many months. Fertile soil helps supply the nutrients needed for this long growth cycle.",
    "sourceFactIds": [
      "SUGARCANE-FERTILITY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-040",
    "qlName": "Sugarcane soil and drainage",
    "difficulty": "Medium",
    "stem": "Which field is better for sugarcane?",
    "answer": "Deep loam with irrigation and drainage",
    "distractors": [
      "Shallow bare rock",
      "Permanently flooded marsh",
      "Dry dune without water"
    ],
    "explanation": "Deep fertile loam, adequate water and good drainage provide a strong sugarcane environment. The other settings lack soil depth, drainage or moisture.",
    "sourceFactIds": [
      "SUGARCANE-FIELD-SETTING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-040",
    "qlName": "Sugarcane soil and drainage",
    "difficulty": "Medium",
    "stem": "Why must a sugarcane field combine moisture with drainage?",
    "answer": "The crop needs abundant water but roots still require aerated soil",
    "distractors": [
      "The crop needs no soil oxygen",
      "Drainage removes the need for irrigation",
      "Standing water is required permanently"
    ],
    "explanation": "Sugarcane has high moisture demand, but roots function poorly in continuously saturated soil. Controlled water supply and drainage therefore work together.",
    "sourceFactIds": [
      "SUGARCANE-MOISTURE-DRAINAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-040",
    "qlName": "Sugarcane soil and drainage",
    "difficulty": "Medium",
    "stem": "Which soil problem would most directly reduce sugarcane root health?",
    "answer": "Persistent waterlogging",
    "distractors": [
      "Deep fertile profile",
      "Balanced moisture",
      "Good drainage"
    ],
    "explanation": "Persistent waterlogging reduces oxygen in the root zone and can weaken cane growth. Deep fertile soil with balanced moisture is far more favourable.",
    "sourceFactIds": [
      "SUGARCANE-ROOT-WATERLOGGING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-040",
    "qlName": "Sugarcane soil and drainage",
    "difficulty": "Hard",
    "stem": "Farm A has deep fertile loam but no water; Farm B has irrigation but permanently flooded shallow soil. Which change would make either farm suitable?",
    "answer": "Give A reliable water or improve B's drainage",
    "distractors": [
      "Remove soil from both farms",
      "Keep B more deeply flooded",
      "Prevent all moisture in A"
    ],
    "explanation": "Sugarcane needs both sufficient moisture and a healthy root zone. Farm A lacks water, while Farm B lacks drainage, so correcting either limiting factor improves suitability.",
    "sourceFactIds": [
      "SUGARCANE-SOIL-WATER-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-041",
    "qlName": "Northern sugarcane belt",
    "difficulty": "Easy",
    "stem": "Which state is strongly linked with the northern sugarcane belt?",
    "answer": "Uttar Pradesh",
    "distractors": [
      "Sikkim",
      "Goa only",
      "Arunachal Pradesh only"
    ],
    "explanation": "Uttar Pradesh has a long-established sugarcane belt across the Ganga plain. Fertile soils, irrigation and warm growing conditions support cane there.",
    "sourceFactIds": [
      "SUGARCANE-UP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-041",
    "qlName": "Northern sugarcane belt",
    "difficulty": "Easy",
    "stem": "Which physical region supports much of north India's sugarcane?",
    "answer": "Ganga plain",
    "distractors": [
      "High Himalayan snowfields",
      "Coral islands",
      "Cold desert plateau"
    ],
    "explanation": "The Ganga plain provides fertile alluvial soils, a long warm season and widespread irrigation. These conditions support extensive sugarcane cultivation.",
    "sourceFactIds": [
      "SUGARCANE-GANGA-PLAIN"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-041",
    "qlName": "Northern sugarcane belt",
    "difficulty": "Medium",
    "stem": "Which group contains states of the northern sugarcane belt?",
    "answer": "Uttar Pradesh, Bihar, Haryana",
    "distractors": [
      "Kerala, Goa, Sikkim",
      "Nagaland, Mizoram, Tripura only",
      "Arunachal Pradesh, Sikkim, Goa"
    ],
    "explanation": "Uttar Pradesh, Bihar and Haryana all contain important sugarcane areas in northern India. Irrigation and fertile plains support the crop across this belt.",
    "sourceFactIds": [
      "SUGARCANE-NORTH-STATES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-041",
    "qlName": "Northern sugarcane belt",
    "difficulty": "Medium",
    "stem": "What supports sugarcane in the north Indian plains despite a cooler winter than tropical peninsular regions?",
    "answer": "Long warm season, fertile soils and irrigation",
    "distractors": [
      "Permanent snow cover",
      "Tidal seawater",
      "Absence of summer heat"
    ],
    "explanation": "The northern plains still provide a sufficiently long warm period for cane, while fertile alluvial soils and irrigation support growth. Winter cooling can shorten the effective growth period compared with tropical regions.",
    "sourceFactIds": [
      "SUGARCANE-NORTH-CONDITIONS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-041",
    "qlName": "Northern sugarcane belt",
    "difficulty": "Medium",
    "stem": "Which landscape clue points toward a northern sugarcane belt?",
    "answer": "Irrigated alluvial plain with warm summers",
    "distractors": [
      "Glaciated valley",
      "Tidal coral reef",
      "Permanent snowfield"
    ],
    "explanation": "Sugarcane in northern India is closely linked with irrigated alluvial plains such as the Ganga basin. Warm summers and dependable water support the long-duration crop.",
    "sourceFactIds": [
      "SUGARCANE-NORTH-LANDSCAPE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-041",
    "qlName": "Northern sugarcane belt",
    "difficulty": "Medium",
    "stem": "A district lies on a fertile irrigated Ganga plain and has a long warm season. Which commercial crop is a strong fit?",
    "answer": "Sugarcane",
    "distractors": [
      "Rubber",
      "Jute only",
      "Tea plantation"
    ],
    "explanation": "Fertile alluvial soil, irrigation and a long warm period are classic conditions for north Indian sugarcane. Rubber and tea need different plantation climates, while jute needs a more humid floodplain regime.",
    "sourceFactIds": [
      "SUGARCANE-NORTH-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-042",
    "qlName": "Peninsular sugarcane belt",
    "difficulty": "Easy",
    "stem": "Which state is strongly linked with peninsular sugarcane cultivation?",
    "answer": "Maharashtra",
    "distractors": [
      "Sikkim",
      "Arunachal Pradesh only",
      "Nagaland only"
    ],
    "explanation": "Maharashtra has a major peninsular sugarcane belt supported by warm conditions and irrigation. The crop is also important in Karnataka and parts of southern India.",
    "sourceFactIds": [
      "SUGARCANE-MAHARASHTRA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-042",
    "qlName": "Peninsular sugarcane belt",
    "difficulty": "Easy",
    "stem": "Which climate advantage does peninsular India offer sugarcane?",
    "answer": "Longer warm frost-free growing period",
    "distractors": [
      "Longer snow season",
      "Permanent freezing",
      "Shorter warm season than mountains"
    ],
    "explanation": "Peninsular sugarcane regions experience a long warm season with little frost risk. This supports sustained cane growth and sugar accumulation.",
    "sourceFactIds": [
      "SUGARCANE-PENINSULA-WARM"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-042",
    "qlName": "Peninsular sugarcane belt",
    "difficulty": "Medium",
    "stem": "Which group contains peninsular sugarcane states?",
    "answer": "Maharashtra, Karnataka, Tamil Nadu",
    "distractors": [
      "Sikkim, Arunachal Pradesh, Himachal Pradesh",
      "Goa, Sikkim, Nagaland only",
      "Jammu and Kashmir, Sikkim, Meghalaya"
    ],
    "explanation": "Maharashtra, Karnataka and Tamil Nadu all have substantial sugarcane cultivation in warm peninsular settings. Irrigation is often important because rainfall is seasonal.",
    "sourceFactIds": [
      "SUGARCANE-PENINSULA-STATES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-042",
    "qlName": "Peninsular sugarcane belt",
    "difficulty": "Medium",
    "stem": "Why can peninsular sugarcane have a climatic advantage over the northern belt?",
    "answer": "Warm conditions last longer and frost risk is lower",
    "distractors": [
      "The peninsula has more winter snow",
      "Cane requires freezing weather",
      "Northern India has no soil"
    ],
    "explanation": "Longer warm conditions allow cane to grow for more of the year in peninsular India. Lower frost risk is especially favourable for this tropical crop.",
    "sourceFactIds": [
      "SUGARCANE-PENINSULA-ADVANTAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-042",
    "qlName": "Peninsular sugarcane belt",
    "difficulty": "Medium",
    "stem": "What is often necessary for peninsular sugarcane where rainfall is strongly seasonal?",
    "answer": "Assured irrigation",
    "distractors": [
      "Permanent drought",
      "Snowmelt only",
      "Tidal seawater"
    ],
    "explanation": "Sugarcane needs water over many months, while peninsular rainfall may be concentrated in one season. Irrigation bridges dry periods and stabilises the crop.",
    "sourceFactIds": [
      "SUGARCANE-PENINSULA-IRRIGATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-042",
    "qlName": "Peninsular sugarcane belt",
    "difficulty": "Hard",
    "stem": "Region A has warm weather most of the year and irrigation; Region B has frequent frost. Which region has the stronger natural advantage for sugarcane?",
    "answer": "Region A",
    "distractors": [
      "Region B",
      "Both are identical",
      "Frost always improves cane growth"
    ],
    "explanation": "A long warm frost-free period with irrigation is highly favourable for sugarcane. Frequent frost in Region B limits cane growth and can damage the crop.",
    "sourceFactIds": [
      "SUGARCANE-PENINSULA-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-043",
    "qlName": "Sugar-industry linkage",
    "difficulty": "Easy",
    "stem": "Why are sugar mills commonly located near sugarcane fields?",
    "answer": "Cane is bulky and should be processed soon after harvest",
    "distractors": [
      "Cane improves with long storage",
      "Sugarcane is weightless",
      "Mills require snowfields"
    ],
    "explanation": "Sugarcane is bulky to transport and its sugar content can decline after cutting. Locating mills near cane fields reduces delay and transport burden.",
    "sourceFactIds": [
      "SUGARCANE-MILL-LOCATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-043",
    "qlName": "Sugar-industry linkage",
    "difficulty": "Easy",
    "stem": "Which factor links sugarcane farming closely with processing industries?",
    "answer": "The harvested cane must be crushed for sugar extraction",
    "distractors": [
      "The crop is eaten only as dry grain",
      "No processing is required",
      "The crop is grown only for fibre"
    ],
    "explanation": "Sugarcane stalks must be crushed so their juice can be processed into sugar and related products. This creates a strong farm-to-mill connection.",
    "sourceFactIds": [
      "SUGARCANE-PROCESSING-LINK"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-043",
    "qlName": "Sugar-industry linkage",
    "difficulty": "Medium",
    "stem": "Which transport pattern is most efficient for sugarcane?",
    "answer": "Short, rapid movement from field to nearby mill",
    "distractors": [
      "Long storage before transport",
      "Sending cane first to distant cold deserts",
      "Keeping cut cane in the field for months"
    ],
    "explanation": "Freshly cut cane is bulky and should be processed promptly. Short transport distances help preserve quality and reduce freight costs.",
    "sourceFactIds": [
      "SUGARCANE-TRANSPORT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-043",
    "qlName": "Sugar-industry linkage",
    "difficulty": "Medium",
    "stem": "Why does a dense sugarcane belt often attract sugar factories?",
    "answer": "It provides a concentrated supply of bulky raw material",
    "distractors": [
      "Sugar factories need no raw material",
      "The crop cannot be processed",
      "Factories depend on tea leaves instead"
    ],
    "explanation": "Sugar factories need a regular supply of cane, and transport is costly because the raw material is bulky. A dense cane belt therefore creates a strong location advantage.",
    "sourceFactIds": [
      "SUGARCANE-FACTORY-BELT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-043",
    "qlName": "Sugar-industry linkage",
    "difficulty": "Medium",
    "stem": "Which change would most likely raise transport costs for a sugar mill?",
    "answer": "Moving the mill much farther from the cane-growing area",
    "distractors": [
      "Locating the mill inside the cane belt",
      "Improving nearby roads",
      "Reducing harvest-to-crush time"
    ],
    "explanation": "Greater distance means more bulky cane must be hauled farther before processing. A mill close to cane fields reduces both transport cost and delay.",
    "sourceFactIds": [
      "SUGARCANE-MILL-DISTANCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-043",
    "qlName": "Sugar-industry linkage",
    "difficulty": "Hard",
    "stem": "Two mill sites are identical except Site A is inside a dense cane belt and Site B is 200 km away. Which site has the stronger raw-material advantage?",
    "answer": "Site A",
    "distractors": [
      "Site B",
      "Both are identical because cane transport has no cost",
      "Neither can process cane"
    ],
    "explanation": "Site A receives bulky cane over shorter distances and can crush it sooner after harvest. This gives it a clear raw-material and transport advantage.",
    "sourceFactIds": [
      "SUGARCANE-MILL-SITE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-044",
    "qlName": "Ratoon crop concept",
    "difficulty": "Easy",
    "stem": "What is a ratoon crop in sugarcane farming?",
    "answer": "A new cane crop grown from the stubble left after harvest",
    "distractors": [
      "A crop grown from tea leaves",
      "A fibre crop planted after jute",
      "A crop raised only from snowmelt"
    ],
    "explanation": "After the first sugarcane crop is cut, shoots can regrow from the remaining stubble and roots. This regrowth crop is called a ratoon.",
    "sourceFactIds": [
      "SUGARCANE-RATOON-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-044",
    "qlName": "Ratoon crop concept",
    "difficulty": "Easy",
    "stem": "Which practice avoids replanting sugarcane immediately after every harvest?",
    "answer": "Ratooning",
    "distractors": [
      "Retting",
      "Shifting cultivation",
      "Terracing"
    ],
    "explanation": "Ratooning uses regrowth from the existing cane stubble after harvest. Farmers can therefore obtain another crop without planting fresh setts immediately.",
    "sourceFactIds": [
      "SUGARCANE-RATOON-PRACTICE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-044",
    "qlName": "Ratoon crop concept",
    "difficulty": "Medium",
    "stem": "What is the main time-saving advantage of a ratoon crop?",
    "answer": "The next crop regrows from existing roots and stubble",
    "distractors": [
      "The field must be completely replanted",
      "The crop needs a new forest clearing",
      "The crop grows without roots"
    ],
    "explanation": "Ratoon cane starts from the established root system left in the field, so land preparation and replanting are reduced. This can shorten the interval to the next crop.",
    "sourceFactIds": [
      "SUGARCANE-RATOON-ADVANTAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-044",
    "qlName": "Ratoon crop concept",
    "difficulty": "Medium",
    "stem": "Which sequence describes ratoon sugarcane correctly?",
    "answer": "Harvest cane → leave stubble → allow new shoots to grow",
    "distractors": [
      "Harvest cane → flood with seawater → grow jute",
      "Burn roots → plant tea → harvest cane",
      "Remove all roots → no regrowth"
    ],
    "explanation": "Ratooning depends on leaving viable cane stubble and roots after harvest. New shoots emerge from that material and form the next crop.",
    "sourceFactIds": [
      "SUGARCANE-RATOON-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-044",
    "qlName": "Ratoon crop concept",
    "difficulty": "Medium",
    "stem": "Which crop practice is specifically linked with sugarcane regrowth?",
    "answer": "Ratooning",
    "distractors": [
      "Retting",
      "Transplanting paddy only",
      "Jhum cultivation"
    ],
    "explanation": "Ratooning is the practice of allowing sugarcane to regrow from harvested stubble. Retting is linked with fibre extraction from jute.",
    "sourceFactIds": [
      "SUGARCANE-RATOON-IDENTIFY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-044",
    "qlName": "Ratoon crop concept",
    "difficulty": "Medium",
    "stem": "A farmer cuts cane but keeps the root system and lower stalk portions so the field produces another crop. What has the farmer chosen?",
    "answer": "Ratoon cultivation",
    "distractors": [
      "Jute retting",
      "Shifting cultivation",
      "Tea pruning"
    ],
    "explanation": "Keeping living cane stubble after harvest so it produces new shoots is the defining feature of ratoon cultivation. It avoids immediate full replanting.",
    "sourceFactIds": [
      "SUGARCANE-RATOON-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-045",
    "qlName": "Integrated sugarcane reasoning",
    "difficulty": "Easy",
    "stem": "Which crop–climate pair is accurate?",
    "answer": "Sugarcane — long warm growing season",
    "distractors": [
      "Sugarcane — permanent frost",
      "Sugarcane — polar climate",
      "Sugarcane — glacial desert"
    ],
    "explanation": "Sugarcane is a warm tropical or subtropical crop and needs a long growing season. Severe frost is harmful rather than beneficial.",
    "sourceFactIds": [
      "SUGARCANE-INTEGRATED-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-045",
    "qlName": "Integrated sugarcane reasoning",
    "difficulty": "Easy",
    "stem": "Which processing industry is directly linked with sugarcane?",
    "answer": "Sugarcane — sugar mill",
    "distractors": [
      "Sugarcane — jute mill",
      "Sugarcane — tea factory only",
      "Sugarcane — wool mill"
    ],
    "explanation": "Sugarcane is the raw material processed in sugar mills. Its bulky, perishable nature creates a strong geographic link between cane fields and mills.",
    "sourceFactIds": [
      "SUGARCANE-INTEGRATED-INDUSTRY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-045",
    "qlName": "Integrated sugarcane reasoning",
    "difficulty": "Medium",
    "stem": "Which set of conditions is most favourable for sugarcane?",
    "answer": "Warm climate, deep fertile soil, assured moisture and drainage",
    "distractors": [
      "Permanent snow, shallow soil and no water",
      "Tidal marsh and freezing weather",
      "Dry bare rock without irrigation"
    ],
    "explanation": "Sugarcane needs warmth, fertile soil and dependable moisture, but roots also need drainage. The full combination supports its long growth cycle.",
    "sourceFactIds": [
      "SUGARCANE-INTEGRATED-CONDITIONS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-045",
    "qlName": "Integrated sugarcane reasoning",
    "difficulty": "Medium",
    "stem": "Which regional comparison is accurate?",
    "answer": "North India has a major cane belt, while peninsular India benefits from a longer warm season",
    "distractors": [
      "Sugarcane grows only in snowfields",
      "Peninsular India is too cold for cane",
      "North India has no cane cultivation"
    ],
    "explanation": "Sugarcane is important in both northern plains and peninsular states. Peninsular regions often have a longer frost-free warm season, while northern areas benefit from fertile plains and irrigation.",
    "sourceFactIds": [
      "SUGARCANE-INTEGRATED-REGIONS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-045",
    "qlName": "Integrated sugarcane reasoning",
    "difficulty": "Medium",
    "stem": "A mill needs nearby bulky raw material, and the crop needs long-term irrigation. Which crop fits both clues?",
    "answer": "Sugarcane",
    "distractors": [
      "Mustard",
      "Tea leaves only",
      "Jute fibre only"
    ],
    "explanation": "Sugarcane is a long-duration water-demanding crop whose bulky stalks are best processed near the production area. Both clues point to cane.",
    "sourceFactIds": [
      "SUGARCANE-INTEGRATED-TWO-CLUE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-045",
    "qlName": "Integrated sugarcane reasoning",
    "difficulty": "Medium",
    "stem": "Which statement links sugarcane farming and ratooning correctly?",
    "answer": "A harvested cane field can produce another crop from surviving stubble",
    "distractors": [
      "Ratooning means soaking jute stems",
      "Ratooning means shifting to a forest plot",
      "Ratooning requires removing all cane roots"
    ],
    "explanation": "Sugarcane can regrow from the stubble left after harvest, producing a ratoon crop. This characteristic reduces the need for immediate replanting.",
    "sourceFactIds": [
      "SUGARCANE-INTEGRATED-RATOON"
    ]
  }
]);

export const GEO_AGR_001_CP002_SUGARCANE_SEGMENT_V1: readonly GeoAgr001Question[] = Object.freeze(
  RAW.map((raw, index) => Object.freeze({
    questionId: `GEO-AGR-001-CP002-SUG-Q${String(index + 1).padStart(3, "0")}`,
    qlId: raw.qlId, qlName: raw.qlName, difficulty: raw.difficulty, stem: raw.stem,
    options: placeGeoAgrOptions(raw.answer, raw.distractors, index % 4),
    correctIndex: index % 4, canonicalAnswer: raw.answer, explanation: raw.explanation,
    sourceIds: GEO_AGR_001_SOURCE_IDS, sourceFactIds: Object.freeze([...raw.sourceFactIds]),
    reviewOnly: true as const, runtimeRegistered: false as const,
  })),
);

export function auditGeoAgr001Cp002SugarcaneSegmentV1() {
  return auditGeoAgr001Batch(GEO_AGR_001_CP002_SUGARCANE_SEGMENT_V1, 37, 45);
}
