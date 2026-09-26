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
    "qlId": "GEO-AGR-001-QL-055",
    "qlName": "Tea climate and rainfall",
    "difficulty": "Easy",
    "stem": "Which climate is favourable for tea cultivation?",
    "answer": "Warm, humid conditions with frequent rainfall",
    "distractors": [
      "Cold arid conditions with frost",
      "Permanent snow cover",
      "Hot desert climate without moisture"
    ],
    "explanation": "Tea grows well in a warm and humid environment with frequent rainfall or showers through much of the growing season. A long moist period supports repeated leaf growth and plucking.",
    "sourceFactIds": [
      "TEA-WARM-HUMID"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-055",
    "qlName": "Tea climate and rainfall",
    "difficulty": "Easy",
    "stem": "Which moisture condition suits tea plantations?",
    "answer": "Well-distributed rainfall through the growing period",
    "distractors": [
      "A long season without rain",
      "Permanent drought",
      "Only winter snowfall"
    ],
    "explanation": "Tea benefits from regular moisture rather than one short burst of rain followed by a long dry spell. Frequent rainfall helps maintain continuous vegetative growth for leaf harvesting.",
    "sourceFactIds": [
      "TEA-DISTRIBUTED-RAINFALL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-055",
    "qlName": "Tea climate and rainfall",
    "difficulty": "Medium",
    "stem": "Why does tea require a humid growing environment?",
    "answer": "Tender leaves need regular moisture for repeated growth",
    "distractors": [
      "Tea bushes grow only in frozen soil",
      "Dry winds are required for leaf formation",
      "The crop needs standing seawater"
    ],
    "explanation": "Tea is harvested repeatedly for young leaves and shoots, so the bushes need steady moisture to keep producing fresh growth. Humid conditions and frequent rain support that cycle.",
    "sourceFactIds": [
      "TEA-HUMID-REASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-055",
    "qlName": "Tea climate and rainfall",
    "difficulty": "Medium",
    "stem": "Which weather pattern would create the greatest stress for a tea plantation?",
    "answer": "A prolonged dry spell during active leaf growth",
    "distractors": [
      "Frequent light showers",
      "Warm humid weather",
      "Cloudy intervals between rains"
    ],
    "explanation": "Tea needs regular moisture during active growth, so a prolonged dry spell can reduce new leaf production. Frequent showers and humidity are much closer to the crop's preferred environment.",
    "sourceFactIds": [
      "TEA-DRY-SPELL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-055",
    "qlName": "Tea climate and rainfall",
    "difficulty": "Medium",
    "stem": "Which temperature–moisture combination fits tea better than wheat?",
    "answer": "Warm humid weather with frequent rainfall",
    "distractors": [
      "Cool dry winter with sunny ripening",
      "Cold dry air with frost",
      "Dry desert heat without irrigation"
    ],
    "explanation": "Tea is a perennial plantation crop adapted to warm humid conditions, while wheat is a cool-season rabi cereal. The moisture and temperature regimes are therefore very different.",
    "sourceFactIds": [
      "TEA-VS-WHEAT-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-055",
    "qlName": "Tea climate and rainfall",
    "difficulty": "Hard",
    "stem": "Region A is warm, humid and receives frequent rain; Region B has a cool dry winter and sunny spring. Which crop is more naturally suited to Region A?",
    "answer": "Tea",
    "distractors": [
      "Wheat",
      "Mustard",
      "Gram"
    ],
    "explanation": "Region A provides the warm humid conditions needed by tea bushes for repeated leaf growth. Region B fits winter rabi crops such as wheat, mustard and gram much better.",
    "sourceFactIds": [
      "TEA-CLIMATE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-056",
    "qlName": "Tea slopes, drainage and soil",
    "difficulty": "Easy",
    "stem": "Why are hill slopes useful for tea cultivation?",
    "answer": "They provide good drainage for plantation soils",
    "distractors": [
      "They keep fields permanently waterlogged",
      "They prevent roots from receiving air",
      "They create standing seawater"
    ],
    "explanation": "Tea needs abundant moisture but does not grow well in stagnant water. Sloping land helps excess water drain away while the soil remains moist enough for the bushes.",
    "sourceFactIds": [
      "TEA-SLOPE-DRAINAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-056",
    "qlName": "Tea slopes, drainage and soil",
    "difficulty": "Easy",
    "stem": "Which soil condition favours tea?",
    "answer": "Deep, fertile, well-drained soil rich in organic matter",
    "distractors": [
      "Bare rock without soil",
      "Permanent swamp mud",
      "Dry saline crust"
    ],
    "explanation": "Tea bushes need a deep root zone, good fertility and drainage, while organic matter helps support continuous vegetative growth. Waterlogged or barren soils are unsuitable.",
    "sourceFactIds": [
      "TEA-SOIL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-056",
    "qlName": "Tea slopes, drainage and soil",
    "difficulty": "Medium",
    "stem": "Why is waterlogging harmful to tea even though the crop needs heavy rainfall?",
    "answer": "Tea roots need aerated soil as well as moisture",
    "distractors": [
      "Tea needs no water at all",
      "The crop grows only in deep standing water",
      "Waterlogging always increases leaf quality"
    ],
    "explanation": "Tea requires plenty of moisture, but roots still need oxygen in the soil. Good drainage therefore allows heavy rainfall without leaving the root zone permanently saturated.",
    "sourceFactIds": [
      "TEA-WATERLOGGING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-056",
    "qlName": "Tea slopes, drainage and soil",
    "difficulty": "Medium",
    "stem": "Which landscape is more suitable for tea than paddy?",
    "answer": "Humid well-drained hill slope",
    "distractors": [
      "Level field kept under standing water",
      "Tidal marsh",
      "Dry desert dune"
    ],
    "explanation": "Tea prefers moist but well-drained slopes, whereas paddy can use level fields with standing water. The slope therefore fits tea much better than a flooded lowland.",
    "sourceFactIds": [
      "TEA-VS-PADDY-SLOPE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-056",
    "qlName": "Tea slopes, drainage and soil",
    "difficulty": "Medium",
    "stem": "Which combination gives a strong tea-growing site?",
    "answer": "Humid climate, deep soil, organic matter and drainage",
    "distractors": [
      "Arid climate, shallow rock and no moisture",
      "Permanent floodwater and saline soil",
      "Frequent frost and bare gravel"
    ],
    "explanation": "Tea needs warmth and humidity together with fertile soil and effective drainage. The combination supports healthy roots and repeated production of tender leaves.",
    "sourceFactIds": [
      "TEA-SITE-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-056",
    "qlName": "Tea slopes, drainage and soil",
    "difficulty": "Hard",
    "stem": "Farm A is on a humid hill slope with deep humus-rich soil; Farm B is a level waterlogged basin. Which farm is better for tea?",
    "answer": "Farm A",
    "distractors": [
      "Farm B",
      "Both are equally suited because drainage is irrelevant",
      "Neither can support tea"
    ],
    "explanation": "Farm A combines humidity, deep fertile soil and natural drainage, all of which suit tea. Farm B remains waterlogged, which limits root aeration and makes it less suitable.",
    "sourceFactIds": [
      "TEA-SITE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-057",
    "qlName": "Tea regional belts",
    "difficulty": "Easy",
    "stem": "Which state has a long-established tea belt in the Brahmaputra valley?",
    "answer": "Assam",
    "distractors": [
      "Rajasthan",
      "Punjab",
      "Gujarat"
    ],
    "explanation": "Assam's Brahmaputra valley has a warm humid climate and abundant rainfall that favour tea. It is one of India's classic tea-growing regions.",
    "sourceFactIds": [
      "TEA-ASSAM"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-057",
    "qlName": "Tea regional belts",
    "difficulty": "Easy",
    "stem": "Darjeeling tea is linked with which state?",
    "answer": "West Bengal",
    "distractors": [
      "Haryana",
      "Madhya Pradesh",
      "Rajasthan"
    ],
    "explanation": "Darjeeling lies in the hill region of West Bengal and is internationally known for tea cultivation. Cool-to-mild slopes, rainfall and drainage support the crop there.",
    "sourceFactIds": [
      "TEA-DARJEELING-WB"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-057",
    "qlName": "Tea regional belts",
    "difficulty": "Medium",
    "stem": "Which group contains established tea-growing regions?",
    "answer": "Assam, Darjeeling and the Nilgiri hills",
    "distractors": [
      "Thar Desert, Ladakh and Kutch",
      "Punjab plains, western Rajasthan and Ladakh",
      "Cold desert valleys, salt marshes and dune fields"
    ],
    "explanation": "Assam, Darjeeling and the Nilgiri hills all provide humid conditions and suitable slopes or soils for tea. The other groups are dominated by dry or cold environments.",
    "sourceFactIds": [
      "TEA-REGION-GROUP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-057",
    "qlName": "Tea regional belts",
    "difficulty": "Medium",
    "stem": "Which southern region is well known for tea plantations?",
    "answer": "Nilgiri hills",
    "distractors": [
      "Thar Desert",
      "Rann of Kutch",
      "Ladakh plateau"
    ],
    "explanation": "The Nilgiri hills of southern India have a cool humid upland environment and well-drained slopes that support tea. They form an important southern plantation belt.",
    "sourceFactIds": [
      "TEA-NILGIRI"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-057",
    "qlName": "Tea regional belts",
    "difficulty": "Medium",
    "stem": "Why do Assam and Darjeeling both support tea despite different relief?",
    "answer": "Both provide ample moisture and suitable growing temperatures",
    "distractors": [
      "Both are arid deserts",
      "Both remain frozen through the year",
      "Both lack rainfall"
    ],
    "explanation": "Assam tea often grows in humid valley conditions, while Darjeeling tea grows on cooler hill slopes. Both still provide the moisture and temperature regime needed by tea.",
    "sourceFactIds": [
      "TEA-ASSAM-DARJEELING-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-057",
    "qlName": "Tea regional belts",
    "difficulty": "Medium",
    "stem": "Region A is a humid Brahmaputra valley; Region B is a moist Himalayan foothill slope in West Bengal. Which plantation crop can fit both regions?",
    "answer": "Tea",
    "distractors": [
      "Bajra",
      "Mustard",
      "Wheat"
    ],
    "explanation": "Tea can grow in both humid valley and well-drained hill environments when temperature and moisture are suitable. The other crops are more typical of dry or cool seasonal farming.",
    "sourceFactIds": [
      "TEA-REGION-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-058",
    "qlName": "Tea labour, plucking and processing linkage",
    "difficulty": "Easy",
    "stem": "Which field operation is especially important in tea cultivation?",
    "answer": "Plucking tender leaves and shoots",
    "distractors": [
      "Cutting cane stalks for crushing",
      "Retting stems in water",
      "Picking cotton bolls"
    ],
    "explanation": "Tea is harvested by repeatedly plucking young leaves and shoots from the bushes. The harvested plant part differs from sugarcane, jute and cotton.",
    "sourceFactIds": [
      "TEA-PLUCKING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-058",
    "qlName": "Tea labour, plucking and processing linkage",
    "difficulty": "Easy",
    "stem": "Why is tea cultivation labour-intensive?",
    "answer": "Tender leaves must be plucked repeatedly and carefully",
    "distractors": [
      "The crop grows without harvesting",
      "Tea is collected by flooding fields",
      "The leaves are harvested only once in many years"
    ],
    "explanation": "Tea bushes produce repeated flushes of young leaves, and quality depends on careful harvesting. This creates a high demand for skilled manual labour.",
    "sourceFactIds": [
      "TEA-LABOUR-INTENSIVE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-058",
    "qlName": "Tea labour, plucking and processing linkage",
    "difficulty": "Medium",
    "stem": "Why are tea-processing units usually located near plantations?",
    "answer": "Freshly plucked leaves should be processed quickly",
    "distractors": [
      "Tea leaves improve after months of field storage",
      "Processing requires snow",
      "Transport distance never matters"
    ],
    "explanation": "Fresh tea leaves begin changing soon after plucking, so processing should start without long delay. Nearby factories reduce transport time and help preserve quality.",
    "sourceFactIds": [
      "TEA-FACTORY-NEAR-PLANTATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-058",
    "qlName": "Tea labour, plucking and processing linkage",
    "difficulty": "Medium",
    "stem": "Which plantation feature creates a strong need for organised labour?",
    "answer": "Repeated selective harvesting of young leaves",
    "distractors": [
      "One mechanical harvest of dry grain",
      "No field work after planting",
      "Harvesting only underground pods"
    ],
    "explanation": "Tea must be plucked repeatedly through the growing season, and workers select tender leaves rather than removing the whole plant. That repeated precision makes labour organisation important.",
    "sourceFactIds": [
      "TEA-ORGANISED-LABOUR"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-058",
    "qlName": "Tea labour, plucking and processing linkage",
    "difficulty": "Medium",
    "stem": "Which crop-processing clue points most strongly to tea?",
    "answer": "Fresh leaves move quickly from plantation to a nearby factory",
    "distractors": [
      "Stems are soaked for retting",
      "Seed bolls are ginned",
      "Cane stalks are crushed for sugar"
    ],
    "explanation": "Tea is harvested as fresh leaves that require prompt processing after plucking. Retting belongs to jute, ginning to cotton and crushing to sugarcane.",
    "sourceFactIds": [
      "TEA-PROCESSING-CLUE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-058",
    "qlName": "Tea labour, plucking and processing linkage",
    "difficulty": "Hard",
    "stem": "Estate A has abundant labour and a nearby leaf-processing factory; Estate B lacks workers and must transport leaves for two days. Which estate has the stronger tea advantage?",
    "answer": "Estate A",
    "distractors": [
      "Estate B",
      "Both are identical because labour and time do not matter",
      "Neither can grow tea"
    ],
    "explanation": "Tea needs repeated careful plucking and rapid processing of fresh leaves, so labour supply and factory proximity both matter. Estate A has advantages on both counts.",
    "sourceFactIds": [
      "TEA-LABOUR-PROCESSING-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-059",
    "qlName": "Coffee crop character and shade",
    "difficulty": "Easy",
    "stem": "Coffee is classified as which type of crop?",
    "answer": "Plantation beverage crop",
    "distractors": [
      "Fibre crop",
      "Sugar crop",
      "Rabi cereal"
    ],
    "explanation": "Coffee is grown commercially on plantations for beans that are processed into a beverage. It is therefore grouped with plantation beverage crops rather than cereals or fibre crops.",
    "sourceFactIds": [
      "COFFEE-PLANTATION-BEVERAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-059",
    "qlName": "Coffee crop character and shade",
    "difficulty": "Easy",
    "stem": "Coffee is often grown under what field condition?",
    "answer": "Shade from taller trees",
    "distractors": [
      "Permanent standing water",
      "Open snowfields",
      "Tidal flooding"
    ],
    "explanation": "Coffee is commonly grown under a canopy of shade trees, especially in traditional Indian plantations. Shade moderates heat and helps create a favourable plantation microclimate.",
    "sourceFactIds": [
      "COFFEE-SHADE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-059",
    "qlName": "Coffee crop character and shade",
    "difficulty": "Medium",
    "stem": "Why can shade trees benefit coffee?",
    "answer": "They moderate direct heat and help maintain a humid microclimate",
    "distractors": [
      "They keep the soil permanently frozen",
      "They remove all humidity",
      "They create tidal water"
    ],
    "explanation": "A shade canopy reduces harsh direct sunlight and can help conserve moisture around coffee plants. This suits the crop's preference for warm but moderated conditions.",
    "sourceFactIds": [
      "COFFEE-SHADE-REASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-059",
    "qlName": "Coffee crop character and shade",
    "difficulty": "Medium",
    "stem": "Which plantation setting fits coffee better than cotton?",
    "answer": "Humid shaded hill slope",
    "distractors": [
      "Dry black-soil plain with open sunshine",
      "Arid dune field",
      "Irrigated northwestern cotton plain"
    ],
    "explanation": "Coffee commonly grows on humid shaded slopes, while cotton prefers open warm fields with good sunshine and drainage. The plantation environments are clearly different.",
    "sourceFactIds": [
      "COFFEE-VS-COTTON-SETTING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-059",
    "qlName": "Coffee crop character and shade",
    "difficulty": "Medium",
    "stem": "Which feature separates coffee from tea in many Indian plantations?",
    "answer": "Coffee is commonly raised under shade trees",
    "distractors": [
      "Coffee is a fibre crop",
      "Tea is grown only in deserts",
      "Coffee requires permanent flooding"
    ],
    "explanation": "Both are plantation beverages, but coffee is especially known for cultivation under shade trees. Tea plantations are more often kept as open pruned bushes on humid slopes.",
    "sourceFactIds": [
      "COFFEE-TEA-SHADE-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-059",
    "qlName": "Coffee crop character and shade",
    "difficulty": "Medium",
    "stem": "An upland estate grows a beverage crop beneath a canopy of taller trees to soften direct sunlight. Which crop is the strongest match?",
    "answer": "Coffee",
    "distractors": [
      "Cotton",
      "Jute",
      "Sugarcane"
    ],
    "explanation": "Shade-tree cultivation on an upland estate is a classic coffee plantation pattern. Cotton, jute and sugarcane are field crops grown under very different conditions.",
    "sourceFactIds": [
      "COFFEE-SHADE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-060",
    "qlName": "Coffee climate, slope and soil",
    "difficulty": "Easy",
    "stem": "Which climate is favourable for coffee cultivation?",
    "answer": "Warm, moist climate without severe frost",
    "distractors": [
      "Permanent polar climate",
      "Cold desert climate",
      "Frequent hard frost throughout growth"
    ],
    "explanation": "Coffee grows best under warm humid conditions and is sensitive to severe cold and frost. A mild upland tropical climate is therefore favourable.",
    "sourceFactIds": [
      "COFFEE-WARM-MOIST"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-060",
    "qlName": "Coffee climate, slope and soil",
    "difficulty": "Easy",
    "stem": "Which soil condition suits coffee plantations?",
    "answer": "Well-drained fertile soil rich in organic matter",
    "distractors": [
      "Permanent swamp mud",
      "Bare rock",
      "Saline tidal crust"
    ],
    "explanation": "Coffee roots need moisture but also good drainage and fertility. Organic-rich loamy soils on upland slopes provide a favourable root environment.",
    "sourceFactIds": [
      "COFFEE-SOIL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-060",
    "qlName": "Coffee climate, slope and soil",
    "difficulty": "Medium",
    "stem": "Why are hill slopes useful for coffee?",
    "answer": "They provide drainage while maintaining a moist upland environment",
    "distractors": [
      "They keep roots under standing water",
      "They create permanent frost",
      "They prevent all rainfall"
    ],
    "explanation": "Coffee needs reliable moisture but not stagnant water around its roots. Sloping land drains excess rainfall and can provide a mild humid upland climate.",
    "sourceFactIds": [
      "COFFEE-SLOPE-DRAINAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-060",
    "qlName": "Coffee climate, slope and soil",
    "difficulty": "Medium",
    "stem": "Which rainfall pattern suits coffee better than an arid climate?",
    "answer": "Moderate to high rainfall with a short dry period for ripening and harvest",
    "distractors": [
      "No rain through the year",
      "Permanent waterlogging",
      "Only snowfall"
    ],
    "explanation": "Coffee needs substantial moisture for growth but also benefits from a drier phase around ripening and harvest. A completely arid environment is unsuitable.",
    "sourceFactIds": [
      "COFFEE-RAINFALL-PATTERN"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-060",
    "qlName": "Coffee climate, slope and soil",
    "difficulty": "Medium",
    "stem": "Which landscape clue points toward coffee cultivation?",
    "answer": "Shaded, well-drained humid upland",
    "distractors": [
      "Open flooded delta",
      "Hot bare desert",
      "Glaciated mountain ridge"
    ],
    "explanation": "Coffee plantations commonly occupy humid uplands with good drainage and shade. Flooded, arid or glaciated settings do not match the crop's needs.",
    "sourceFactIds": [
      "COFFEE-LANDSCAPE-CLUE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-060",
    "qlName": "Coffee climate, slope and soil",
    "difficulty": "Hard",
    "stem": "Farm A is a shaded humid slope with deep loam; Farm B is an open waterlogged basin. Which farm is better for coffee?",
    "answer": "Farm A",
    "distractors": [
      "Farm B",
      "Both require permanent flooding",
      "Neither can support coffee"
    ],
    "explanation": "Farm A combines shade, humidity, drainage and fertile soil, which fit coffee well. Farm B remains waterlogged and lacks the upland plantation setting the crop prefers.",
    "sourceFactIds": [
      "COFFEE-SITE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-061",
    "qlName": "Coffee regional belts",
    "difficulty": "Easy",
    "stem": "Which state is strongly linked with coffee cultivation in India?",
    "answer": "Karnataka",
    "distractors": [
      "Punjab",
      "Rajasthan",
      "Haryana"
    ],
    "explanation": "Karnataka has a long-established coffee belt in its humid Western Ghats and adjoining uplands. The crop is especially prominent in the state's hill districts.",
    "sourceFactIds": [
      "COFFEE-KARNATAKA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-061",
    "qlName": "Coffee regional belts",
    "difficulty": "Easy",
    "stem": "Which southern state also has important coffee plantations?",
    "answer": "Kerala",
    "distractors": [
      "Punjab",
      "Bihar only",
      "Rajasthan"
    ],
    "explanation": "Kerala's humid uplands along the Western Ghats support coffee cultivation. Karnataka, Kerala and Tamil Nadu together form India's classic southern coffee belt.",
    "sourceFactIds": [
      "COFFEE-KERALA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-061",
    "qlName": "Coffee regional belts",
    "difficulty": "Medium",
    "stem": "Which group contains India's classic coffee-growing states?",
    "answer": "Karnataka, Kerala and Tamil Nadu",
    "distractors": [
      "Punjab, Haryana and Rajasthan",
      "Bihar, Uttar Pradesh and Punjab",
      "Assam, Punjab and Gujarat"
    ],
    "explanation": "Coffee is concentrated in the humid uplands of Karnataka, Kerala and Tamil Nadu. These states share suitable Western Ghats or adjoining hill environments.",
    "sourceFactIds": [
      "COFFEE-STATE-GROUP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-061",
    "qlName": "Coffee regional belts",
    "difficulty": "Medium",
    "stem": "Which hill system supports much of India's coffee cultivation?",
    "answer": "Western Ghats and adjoining southern uplands",
    "distractors": [
      "Thar Desert dunes",
      "Cold Ladakh plateau",
      "Indo-Gangetic floodplain only"
    ],
    "explanation": "The Western Ghats and nearby southern hills provide warm humid upland conditions, shade and drainage suitable for coffee. These features explain the crop's southern concentration.",
    "sourceFactIds": [
      "COFFEE-WESTERN-GHATS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-061",
    "qlName": "Coffee regional belts",
    "difficulty": "Medium",
    "stem": "Why is coffee concentrated more in southern uplands than in the northern plains?",
    "answer": "Southern uplands provide humid, shaded and frost-free plantation conditions",
    "distractors": [
      "Northern plains have no soil",
      "Coffee requires desert sand",
      "Coffee needs permanent snow"
    ],
    "explanation": "Coffee thrives in humid, well-drained and relatively frost-free uplands, conditions widely available in southern hill regions. The northern plains do not provide the same plantation environment.",
    "sourceFactIds": [
      "COFFEE-SOUTH-CONCENTRATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-061",
    "qlName": "Coffee regional belts",
    "difficulty": "Medium",
    "stem": "A map highlights humid upland districts across Karnataka, Kerala and Tamil Nadu. Which plantation crop is the strongest common match?",
    "answer": "Coffee",
    "distractors": [
      "Wheat",
      "Mustard",
      "Bajra"
    ],
    "explanation": "The southern humid uplands across these three states form the classic Indian coffee belt. Wheat, mustard and bajra belong to very different seasonal and climatic settings.",
    "sourceFactIds": [
      "COFFEE-MAP-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-062",
    "qlName": "Arabica and Robusta basics",
    "difficulty": "Easy",
    "stem": "Arabica and Robusta are varieties of which crop?",
    "answer": "Coffee",
    "distractors": [
      "Tea",
      "Jute",
      "Cotton"
    ],
    "explanation": "Arabica and Robusta are the two widely known commercial coffee types. They differ in quality, climate tolerance and disease resistance, but both are coffee.",
    "sourceFactIds": [
      "COFFEE-ARABICA-ROBUSTA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-062",
    "qlName": "Arabica and Robusta basics",
    "difficulty": "Easy",
    "stem": "Which coffee type is generally valued for finer flavour and quality?",
    "answer": "Arabica",
    "distractors": [
      "Jute",
      "Robusta as a fibre crop",
      "Cotton"
    ],
    "explanation": "Arabica coffee is generally prized for a finer flavour profile and is important in quality coffee production. Robusta is hardier and more tolerant of warmer, humid conditions.",
    "sourceFactIds": [
      "COFFEE-ARABICA-QUALITY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-062",
    "qlName": "Arabica and Robusta basics",
    "difficulty": "Medium",
    "stem": "Which coffee type is generally more tolerant of heat and some diseases?",
    "answer": "Robusta",
    "distractors": [
      "Arabica only under all conditions",
      "Tea",
      "Jute"
    ],
    "explanation": "Robusta is known for greater hardiness and tolerance of warmer conditions and some diseases compared with Arabica. This makes it useful in lower and warmer plantation zones.",
    "sourceFactIds": [
      "COFFEE-ROBUSTA-HARDY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-062",
    "qlName": "Arabica and Robusta basics",
    "difficulty": "Medium",
    "stem": "Which historical fact is linked with Arabica coffee in India?",
    "answer": "It was introduced from Yemen and cultivated in the Baba Budan hills",
    "distractors": [
      "It originated as a jute fibre in Bengal",
      "It was first grown as a desert millet",
      "It was introduced as a sugarcane variety"
    ],
    "explanation": "Arabica coffee was introduced into India from Yemen and became linked with cultivation in the Baba Budan hills. This is a standard historical-geography fact about Indian coffee.",
    "sourceFactIds": [
      "COFFEE-ARABICA-YEMEN-BABABUDAN"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-062",
    "qlName": "Arabica and Robusta basics",
    "difficulty": "Medium",
    "stem": "How do Arabica and Robusta generally differ?",
    "answer": "Arabica is generally finer in flavour; Robusta is generally hardier",
    "distractors": [
      "Arabica is a fibre crop; Robusta is a cereal",
      "Both are tea varieties",
      "Robusta requires snow while Arabica needs desert drought"
    ],
    "explanation": "Arabica is generally preferred for cup quality, while Robusta is more tolerant of heat and some diseases. Both are commercial coffee types.",
    "sourceFactIds": [
      "COFFEE-ARABICA-ROBUSTA-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-062",
    "qlName": "Arabica and Robusta basics",
    "difficulty": "Hard",
    "stem": "Estate A is cooler and targets premium flavour; Estate B is warmer and needs a hardier coffee type. Which pairing is more logical?",
    "answer": "A Arabica; B Robusta",
    "distractors": [
      "A Robusta; B Arabica only",
      "A tea; B jute",
      "A cotton; B wheat"
    ],
    "explanation": "Arabica is generally favoured for finer quality under milder upland conditions, while Robusta is hardier in warmer settings. The estate clues therefore point to Arabica and Robusta respectively.",
    "sourceFactIds": [
      "COFFEE-VARIETY-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-063",
    "qlName": "Tea–coffee integrated reasoning",
    "difficulty": "Easy",
    "stem": "Which statement about tea and coffee is accurate?",
    "answer": "Both are plantation beverage crops",
    "distractors": [
      "Both are fibre crops",
      "Both are rabi cereals",
      "Both are sugar crops"
    ],
    "explanation": "Tea leaves and coffee beans are processed into beverages, and both crops are commonly grown on organised plantations. They differ in field conditions and harvesting methods.",
    "sourceFactIds": [
      "TEA-COFFEE-BEVERAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-063",
    "qlName": "Tea–coffee integrated reasoning",
    "difficulty": "Easy",
    "stem": "Which plantation crop is especially known for growth under shade trees?",
    "answer": "Coffee",
    "distractors": [
      "Tea only",
      "Cotton",
      "Jute"
    ],
    "explanation": "Traditional coffee plantations commonly use taller shade trees to moderate direct sunlight and conserve humidity. Tea is usually maintained as open pruned bushes on slopes.",
    "sourceFactIds": [
      "TEA-COFFEE-SHADE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-063",
    "qlName": "Tea–coffee integrated reasoning",
    "difficulty": "Medium",
    "stem": "How do tea and coffee differ in the part harvested?",
    "answer": "Tea needs repeated leaf plucking; coffee is harvested for berries containing beans",
    "distractors": [
      "Tea is harvested for bolls; coffee for bast fibre",
      "Both are cut as cane",
      "Both are harvested as underground pods"
    ],
    "explanation": "Tea production depends on repeated plucking of tender leaves and shoots, while coffee produces berries whose seeds are processed as beans. The harvested plant parts differ.",
    "sourceFactIds": [
      "TEA-COFFEE-HARVEST-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-063",
    "qlName": "Tea–coffee integrated reasoning",
    "difficulty": "Medium",
    "stem": "Which regional comparison is accurate?",
    "answer": "Tea has major belts in Assam and Darjeeling; coffee is concentrated in southern uplands",
    "distractors": [
      "Coffee is concentrated in Punjab while tea is a desert crop",
      "Both are restricted to Rajasthan",
      "Tea grows only in snowfields"
    ],
    "explanation": "Tea has prominent belts in northeastern and eastern hill regions as well as the south. Coffee is strongly concentrated in Karnataka, Kerala and Tamil Nadu.",
    "sourceFactIds": [
      "TEA-COFFEE-REGION-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-063",
    "qlName": "Tea–coffee integrated reasoning",
    "difficulty": "Medium",
    "stem": "Which site is more characteristic of coffee than tea?",
    "answer": "Shaded plantation beneath a tree canopy",
    "distractors": [
      "Open pruned bushes on a humid slope",
      "Brahmaputra valley tea estate",
      "Darjeeling hill tea garden"
    ],
    "explanation": "Coffee is commonly cultivated beneath shade trees, whereas tea is usually maintained as open pruned bushes. The canopy clue therefore points more strongly to coffee.",
    "sourceFactIds": [
      "TEA-COFFEE-SITE-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-063",
    "qlName": "Tea–coffee integrated reasoning",
    "difficulty": "Hard",
    "stem": "Estate A repeatedly plucks tender leaves on humid slopes; Estate B grows a beverage crop under shade trees in Karnataka. Which crops are A and B?",
    "answer": "A tea; B coffee",
    "distractors": [
      "A coffee; B tea",
      "A cotton; B jute",
      "A rubber; B wheat"
    ],
    "explanation": "Repeated leaf plucking on humid slopes identifies tea, while shaded plantation cultivation in Karnataka strongly points to coffee. The two clues separate the beverage crops clearly.",
    "sourceFactIds": [
      "TEA-COFFEE-INFERENCE"
    ]
  }
]);

export const GEO_AGR_001_CP003_TEA_COFFEE_SEGMENT_V1: readonly GeoAgr001Question[] = Object.freeze(
  RAW.map((raw, index) => Object.freeze({
    questionId: `GEO-AGR-001-CP003-TC-Q${String(index + 1).padStart(3, "0")}`,
    qlId: raw.qlId, qlName: raw.qlName, difficulty: raw.difficulty, stem: raw.stem,
    options: placeGeoAgrOptions(raw.answer, raw.distractors, index % 4),
    correctIndex: index % 4, canonicalAnswer: raw.answer, explanation: raw.explanation,
    sourceIds: GEO_AGR_001_SOURCE_IDS, sourceFactIds: Object.freeze([...raw.sourceFactIds]),
    reviewOnly: true as const, runtimeRegistered: false as const,
  })),
);

export function auditGeoAgr001Cp003TeaCoffeeSegmentV1() {
  return auditGeoAgr001Batch(GEO_AGR_001_CP003_TEA_COFFEE_SEGMENT_V1, 55, 63);
}
