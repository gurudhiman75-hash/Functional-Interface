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
    "qlId": "GEO-AGR-001-QL-091",
    "qlName": "Wet vs dry crop-environment reasoning",
    "difficulty": "Easy",
    "stem": "A warm delta receives heavy monsoon rain and has level fields that retain water. Which crop is most suitable?",
    "answer": "Rice",
    "distractors": [
      "Bajra",
      "Mustard",
      "Gram"
    ],
    "explanation": "Rice needs abundant moisture and performs well on warm level plains where water can be retained. Bajra, mustard and gram are better suited to drier or cooler conditions.",
    "sourceFactIds": [
      "REASON-WET-DELTA-RICE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-091",
    "qlName": "Wet vs dry crop-environment reasoning",
    "difficulty": "Easy",
    "stem": "A hot district has sandy soil and uncertain rainfall. Which cereal is more suitable than paddy?",
    "answer": "Bajra",
    "distractors": [
      "Rice",
      "Jute",
      "Tea"
    ],
    "explanation": "Bajra tolerates low rainfall and sandy soils far better than paddy. Rice, jute and tea all need much greater moisture or humidity.",
    "sourceFactIds": [
      "REASON-DRY-SAND-BAJRA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-091",
    "qlName": "Wet vs dry crop-environment reasoning",
    "difficulty": "Medium",
    "stem": "Which crop change is most logical when a field shifts from reliable flooding to limited rain and no irrigation?",
    "answer": "Rice to bajra",
    "distractors": [
      "Bajra to rice",
      "Mustard to jute",
      "Gram to rubber"
    ],
    "explanation": "Rice depends on abundant moisture, while bajra is adapted to dryland conditions. A sharp fall in water availability therefore favours a shift toward bajra rather than paddy.",
    "sourceFactIds": [
      "REASON-WATER-SHIFT-RICE-BAJRA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-091",
    "qlName": "Wet vs dry crop-environment reasoning",
    "difficulty": "Medium",
    "stem": "Two farms are equally warm: Farm A is waterlogged and Farm B is well drained with moderate rainfall. Which crop fits Farm B better?",
    "answer": "Maize",
    "distractors": [
      "Paddy rice",
      "Jute",
      "Rubber"
    ],
    "explanation": "Maize prefers fertile well-drained soil with adequate moisture, not prolonged waterlogging. Rice and jute fit wetter environments, while rubber needs a humid plantation climate.",
    "sourceFactIds": [
      "REASON-DRAINAGE-MAIZE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-091",
    "qlName": "Wet vs dry crop-environment reasoning",
    "difficulty": "Medium",
    "stem": "Which crop combination fits a humid floodplain and an arid sandy plain respectively?",
    "answer": "Jute and bajra",
    "distractors": [
      "Bajra and jute",
      "Mustard and rice",
      "Wheat and rubber"
    ],
    "explanation": "Jute needs a warm humid alluvial floodplain, while bajra thrives in hotter drier sandy conditions. Their contrasting moisture requirements make the pairing logical.",
    "sourceFactIds": [
      "REASON-HUMID-ARID-PAIR"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-091",
    "qlName": "Wet vs dry crop-environment reasoning",
    "difficulty": "Hard",
    "stem": "Region A is a rain-rich eastern delta; Region B is a semi-arid western plain; Region C is a cool dry winter plain. Which crops fit A, B and C?",
    "answer": "Rice, bajra, wheat",
    "distractors": [
      "Wheat, rice, jute",
      "Bajra, jute, rice",
      "Jute, wheat, rubber"
    ],
    "explanation": "Rice fits the wet delta, bajra the semi-arid western plain and wheat the cool dry rabi environment. The three regional clues separate the crops by water and season needs.",
    "sourceFactIds": [
      "REASON-THREE-REGION-WET-DRY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-092",
    "qlName": "Kharif vs rabi crop-region inference",
    "difficulty": "Easy",
    "stem": "A crop is sown with monsoon onset and harvested in autumn on a warm plain. Which season is indicated?",
    "answer": "Kharif",
    "distractors": [
      "Rabi",
      "Zaid",
      "Winter plantation"
    ],
    "explanation": "Monsoon-onset sowing and autumn harvest are standard features of kharif cultivation. Rabi begins after the monsoon, while zaid occupies the short summer interval.",
    "sourceFactIds": [
      "REASON-KHARIF-CALENDAR"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-092",
    "qlName": "Kharif vs rabi crop-region inference",
    "difficulty": "Easy",
    "stem": "A farmer sows after monsoon withdrawal and harvests in spring. Which season is being used?",
    "answer": "Rabi",
    "distractors": [
      "Kharif",
      "Zaid",
      "Plantation cycle"
    ],
    "explanation": "Rabi crops are planted in the cool post-monsoon period and harvested in spring. The timing is the opposite of the normal kharif cycle.",
    "sourceFactIds": [
      "REASON-RABI-CALENDAR"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-092",
    "qlName": "Kharif vs rabi crop-region inference",
    "difficulty": "Medium",
    "stem": "Which crop is the stronger match for an irrigated Punjab field in January?",
    "answer": "Wheat",
    "distractors": [
      "Cotton",
      "Jute",
      "Soybean"
    ],
    "explanation": "January lies within the rabi growing season, and irrigated Punjab is a classic wheat environment. Cotton, jute and soybean are generally linked with warmer kharif conditions.",
    "sourceFactIds": [
      "REASON-JANUARY-PUNJAB-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-092",
    "qlName": "Kharif vs rabi crop-region inference",
    "difficulty": "Medium",
    "stem": "Which crop is the stronger match for a central Indian field planted with monsoon rain?",
    "answer": "Soybean",
    "distractors": [
      "Mustard",
      "Wheat",
      "Gram"
    ],
    "explanation": "Soybean is a kharif oilseed strongly linked with central India and monsoon sowing. Mustard, wheat and gram are standard rabi crops.",
    "sourceFactIds": [
      "REASON-CENTRAL-KHARIF-SOY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-092",
    "qlName": "Kharif vs rabi crop-region inference",
    "difficulty": "Medium",
    "stem": "A Rajasthan farmer wants a winter oilseed under relatively dry conditions. Which crop fits?",
    "answer": "Mustard",
    "distractors": [
      "Groundnut",
      "Soybean",
      "Jute"
    ],
    "explanation": "Mustard is a rabi oilseed well suited to cool dry conditions in Rajasthan. Groundnut and soybean are warmer-season crops, while jute needs a humid floodplain.",
    "sourceFactIds": [
      "REASON-RAJASTHAN-RABI-MUSTARD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-092",
    "qlName": "Kharif vs rabi crop-region inference",
    "difficulty": "Hard",
    "stem": "Field A in November is cool and dry; Field B in July is warm and monsoon-fed. Which crop pair fits A and B most logically?",
    "answer": "Mustard and cotton",
    "distractors": [
      "Cotton and mustard",
      "Rice and wheat",
      "Jute and gram"
    ],
    "explanation": "Mustard belongs to the cool rabi season, while cotton is a warm kharif crop commonly planted with monsoon onset. The seasonal contrast identifies the pair.",
    "sourceFactIds": [
      "REASON-RABI-KHARIF-PAIR"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-093",
    "qlName": "Soil–crop matching",
    "difficulty": "Easy",
    "stem": "Which crop is strongly linked with black soil in the Deccan?",
    "answer": "Cotton",
    "distractors": [
      "Jute",
      "Tea",
      "Apple"
    ],
    "explanation": "Black soil has deep clayey texture and good moisture retention, making it famous for cotton cultivation. Jute, tea and apple need very different soil–climate settings.",
    "sourceFactIds": [
      "REASON-BLACKSOIL-COTTON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-093",
    "qlName": "Soil–crop matching",
    "difficulty": "Easy",
    "stem": "Which crop is well suited to fertile new alluvium on a humid floodplain?",
    "answer": "Jute",
    "distractors": [
      "Bajra",
      "Ragi",
      "Mustard"
    ],
    "explanation": "Jute thrives on fertile alluvial floodplains where humidity and water are abundant. Bajra, ragi and mustard are better adapted to drier or cooler conditions.",
    "sourceFactIds": [
      "REASON-ALLUVIUM-JUTE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-093",
    "qlName": "Soil–crop matching",
    "difficulty": "Medium",
    "stem": "A crop needs loose, well-drained soil because its pods develop below the surface. Which crop is it?",
    "answer": "Groundnut",
    "distractors": [
      "Rice",
      "Jute",
      "Tea"
    ],
    "explanation": "Groundnut pods form below the soil surface, so loose aerated soil helps pod development. Waterlogged paddy or jute conditions are not suitable for this crop.",
    "sourceFactIds": [
      "REASON-SOIL-GROUNDNUT-PODS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-093",
    "qlName": "Soil–crop matching",
    "difficulty": "Medium",
    "stem": "Which crop fits red or sandy loam uplands better than a flooded delta?",
    "answer": "Ragi",
    "distractors": [
      "Rice",
      "Jute",
      "Rubber"
    ],
    "explanation": "Ragi can grow on red and sandy loam soils under relatively dry upland conditions. Rice and jute need far more water, while rubber needs humid tropical plantation conditions.",
    "sourceFactIds": [
      "REASON-RED-SOIL-RAGI"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-093",
    "qlName": "Soil–crop matching",
    "difficulty": "Medium",
    "stem": "Which soil–crop sequence is most logical?",
    "answer": "Black soil—cotton; alluvial floodplain—jute; sandy dry soil—bajra",
    "distractors": [
      "Black soil—jute; floodplain—bajra; sand—rice",
      "Black soil—tea; floodplain—apple; sand—rubber",
      "Black soil—jute; floodplain—mustard; sand—tea"
    ],
    "explanation": "Cotton is classically linked with black soil, jute with humid alluvial floodplains and bajra with drier sandy soils. The three soil settings therefore point to those crops.",
    "sourceFactIds": [
      "REASON-SOIL-THREE-MATCH"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-093",
    "qlName": "Soil–crop matching",
    "difficulty": "Hard",
    "stem": "Farm A has deep black soil, Farm B has fresh alluvium beside a humid river, and Farm C has sandy dry soil. Which crops fit A, B and C?",
    "answer": "Cotton, jute, bajra",
    "distractors": [
      "Jute, cotton, rice",
      "Tea, wheat, rubber",
      "Rice, mustard, coffee"
    ],
    "explanation": "Black soil favours cotton, humid alluvial floodplains favour jute and sandy dry conditions favour bajra. The sequence uses three classic soil–crop relationships.",
    "sourceFactIds": [
      "REASON-SOIL-FARM-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-094",
    "qlName": "Irrigation-led crop extension",
    "difficulty": "Easy",
    "stem": "What allows rice to be grown in lower-rainfall parts of northwestern India?",
    "answer": "Assured irrigation",
    "distractors": [
      "Permanent frost",
      "Absence of water",
      "Dry desert winds alone"
    ],
    "explanation": "Rice has a high water requirement, so canals and tube-wells can compensate for lower natural rainfall. Irrigation therefore extends paddy beyond its naturally wetter belt.",
    "sourceFactIds": [
      "REASON-RICE-IRRIGATION-EXTENSION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-094",
    "qlName": "Irrigation-led crop extension",
    "difficulty": "Easy",
    "stem": "Which resource allows wheat to remain productive where winter rainfall is limited?",
    "answer": "Irrigation",
    "distractors": [
      "Tidal water",
      "Permanent snow cover",
      "No soil moisture"
    ],
    "explanation": "Wheat needs adequate soil moisture during the rabi season, and irrigation can supply that water when winter rainfall is insufficient. This supports major wheat belts in drier plains.",
    "sourceFactIds": [
      "REASON-WHEAT-IRRIGATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-094",
    "qlName": "Irrigation-led crop extension",
    "difficulty": "Medium",
    "stem": "Which crop becomes more feasible in a dry warm plain after canals and tube-wells expand?",
    "answer": "Rice",
    "distractors": [
      "Apple",
      "Tea without humidity",
      "Rubber without rainfall"
    ],
    "explanation": "Reliable irrigation can provide the large water supply needed by rice even where natural rainfall is lower. It cannot replace the cool climate required by apple or the humid plantation climate required by tea and rubber.",
    "sourceFactIds": [
      "REASON-IRRIGATION-RICE-EXPANSION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-094",
    "qlName": "Irrigation-led crop extension",
    "difficulty": "Medium",
    "stem": "Why can sugarcane be grown in regions with seasonal rainfall?",
    "answer": "Irrigation supplies moisture during long dry intervals",
    "distractors": [
      "Sugarcane needs no water after planting",
      "The crop finishes before rainfall ends",
      "Frost provides all required moisture"
    ],
    "explanation": "Sugarcane remains in the field for many months and needs dependable moisture throughout growth. Irrigation bridges dry periods when seasonal rainfall is not enough.",
    "sourceFactIds": [
      "REASON-SUGARCANE-IRRIGATION-LONG"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-094",
    "qlName": "Irrigation-led crop extension",
    "difficulty": "Medium",
    "stem": "Which crop system is most directly enabled by year-round irrigation?",
    "answer": "Rice–wheat multiple cropping",
    "distractors": [
      "One rain-fed millet crop only",
      "Permanent fallow",
      "A single long forest rotation"
    ],
    "explanation": "Year-round irrigation allows a kharif rice crop to be followed by rabi wheat on the same field. That repeated seasonal use raises cropping intensity.",
    "sourceFactIds": [
      "REASON-IRRIGATION-RICE-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-094",
    "qlName": "Irrigation-led crop extension",
    "difficulty": "Hard",
    "stem": "District A and B have similar heat, but A has canals and tube-wells while B depends only on erratic rain. Which crop is most likely to expand farther in A?",
    "answer": "Paddy rice",
    "distractors": [
      "Rain-fed bajra",
      "Ragi on dry uplands",
      "Mustard under cool winter conditions"
    ],
    "explanation": "Paddy has a high water requirement and gains the largest geographic advantage from dependable irrigation in a dry warm setting. Bajra and ragi already tolerate lower moisture, while mustard depends more on winter season conditions.",
    "sourceFactIds": [
      "REASON-IRRIGATION-CROP-EXTENSION-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-095",
    "qlName": "Plateau, plain, delta and hill crop inference",
    "difficulty": "Easy",
    "stem": "Which crop is most suitable for a humid river delta?",
    "answer": "Rice",
    "distractors": [
      "Bajra",
      "Mustard",
      "Apple"
    ],
    "explanation": "A humid river delta offers level fertile land and abundant water, which strongly favour rice. Bajra and mustard prefer drier conditions, while apple needs cooler hills.",
    "sourceFactIds": [
      "REASON-LANDFORM-DELTA-RICE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-095",
    "qlName": "Plateau, plain, delta and hill crop inference",
    "difficulty": "Easy",
    "stem": "Which plantation crop is a strong match for a humid well-drained hill slope?",
    "answer": "Tea",
    "distractors": [
      "Paddy rice",
      "Bajra",
      "Mustard"
    ],
    "explanation": "Tea needs moisture but also good drainage, so humid hill slopes provide a strong plantation setting. Paddy uses level wet fields, while bajra and mustard fit drier environments.",
    "sourceFactIds": [
      "REASON-LANDFORM-HILL-TEA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-095",
    "qlName": "Plateau, plain, delta and hill crop inference",
    "difficulty": "Medium",
    "stem": "Which crop fits a warm black-soil plateau better than a humid alluvial delta?",
    "answer": "Cotton",
    "distractors": [
      "Jute",
      "Rice",
      "Tea"
    ],
    "explanation": "Cotton is strongly linked with warm black-soil plateau regions such as the Deccan. Jute and rice favour wetter alluvial plains, while tea prefers humid slopes.",
    "sourceFactIds": [
      "REASON-LANDFORM-PLATEAU-COTTON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-095",
    "qlName": "Plateau, plain, delta and hill crop inference",
    "difficulty": "Medium",
    "stem": "Which crop is a strong match for an irrigated alluvial plain with cool winters?",
    "answer": "Wheat",
    "distractors": [
      "Rubber",
      "Tea",
      "Jute"
    ],
    "explanation": "Wheat fits fertile alluvial plains with cool rabi weather and controlled irrigation. Rubber, tea and jute require warmer or more humid environments.",
    "sourceFactIds": [
      "REASON-LANDFORM-PLAIN-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-095",
    "qlName": "Plateau, plain, delta and hill crop inference",
    "difficulty": "Medium",
    "stem": "Which sequence matches landform and crop most logically?",
    "answer": "Delta—jute; plateau—cotton; hill slope—tea",
    "distractors": [
      "Delta—bajra; plateau—jute; hill—rice",
      "Delta—mustard; plateau—rubber; hill—cotton",
      "Delta—apple; plateau—tea; hill—sugarcane"
    ],
    "explanation": "Jute suits humid alluvial deltas, cotton warm black-soil plateaus and tea humid well-drained slopes. The landforms reinforce each crop's moisture and soil requirements.",
    "sourceFactIds": [
      "REASON-LANDFORM-THREE-MATCH"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-095",
    "qlName": "Plateau, plain, delta and hill crop inference",
    "difficulty": "Hard",
    "stem": "Map zones show A as a wet delta, B as a black-soil plateau and C as a cool Himalayan orchard belt. Which crops fit A, B and C?",
    "answer": "Jute, cotton, apple",
    "distractors": [
      "Cotton, jute, banana",
      "Bajra, rice, coconut",
      "Tea, wheat, rubber"
    ],
    "explanation": "Jute fits the wet alluvial delta, cotton the black-soil plateau and apple the cool temperate hill belt. The map clues separate the three agricultural environments.",
    "sourceFactIds": [
      "REASON-LANDFORM-MAP-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-096",
    "qlName": "Plantation vs field-crop environment",
    "difficulty": "Easy",
    "stem": "Which crop is grown on managed estates and harvested by repeated plucking of tender leaves?",
    "answer": "Tea",
    "distractors": [
      "Wheat",
      "Gram",
      "Bajra"
    ],
    "explanation": "Tea is a plantation crop harvested repeatedly for tender leaves and shoots. Wheat, gram and bajra are seasonal field crops rather than leaf-plucking estate crops.",
    "sourceFactIds": [
      "REASON-PLANTATION-TEA-ESTATE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-096",
    "qlName": "Plantation vs field-crop environment",
    "difficulty": "Easy",
    "stem": "Which crop is commonly grown under shade trees on humid upland estates?",
    "answer": "Coffee",
    "distractors": [
      "Mustard",
      "Wheat",
      "Bajra"
    ],
    "explanation": "Coffee is commonly cultivated under a canopy of shade trees in humid southern uplands. Mustard, wheat and bajra are open-field seasonal crops.",
    "sourceFactIds": [
      "REASON-PLANTATION-COFFEE-SHADE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-096",
    "qlName": "Plantation vs field-crop environment",
    "difficulty": "Medium",
    "stem": "Which clue points to rubber rather than a seasonal field crop?",
    "answer": "Latex collected repeatedly from bark cuts on perennial trees",
    "distractors": [
      "Grain harvested once from annual plants",
      "Pods dug from loose soil",
      "Cereal threshed after harvest"
    ],
    "explanation": "Rubber is a perennial plantation tree tapped repeatedly for latex, unlike annual field crops harvested for grain or pods. The harvest method identifies the plantation system.",
    "sourceFactIds": [
      "REASON-PLANTATION-RUBBER-CLUE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-096",
    "qlName": "Plantation vs field-crop environment",
    "difficulty": "Medium",
    "stem": "Which contrast between plantation and field crops is accurate?",
    "answer": "Plantations often use perennial crops and organised processing links",
    "distractors": [
      "Plantations always grow annual cereals",
      "Field crops are always perennial trees",
      "Plantations never use hired labour"
    ],
    "explanation": "Tea, coffee and rubber are perennial plantation crops with specialised harvesting and nearby processing needs. Many cereals, pulses and oilseeds are annual seasonal field crops.",
    "sourceFactIds": [
      "REASON-PLANTATION-VS-FIELD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-096",
    "qlName": "Plantation vs field-crop environment",
    "difficulty": "Medium",
    "stem": "Which crop would fit a humid estate with nearby leaf processing better than an irrigated rabi plain?",
    "answer": "Tea",
    "distractors": [
      "Wheat",
      "Gram",
      "Mustard"
    ],
    "explanation": "A humid estate and nearby leaf-processing factory are strong tea clues. Wheat, gram and mustard fit open rabi fields rather than perennial plantation systems.",
    "sourceFactIds": [
      "REASON-PLANTATION-PROCESSING-TEA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-096",
    "qlName": "Plantation vs field-crop environment",
    "difficulty": "Hard",
    "stem": "Estate A has shaded coffee bushes; Estate B has black-soil cotton fields; Estate C has latex-tapped trees. Which systems are represented?",
    "answer": "Plantation, field crop, plantation",
    "distractors": [
      "Field crop, plantation, field crop",
      "Plantation, plantation, field crop",
      "Field crop, field crop, field crop"
    ],
    "explanation": "Coffee and rubber are perennial plantation crops, while cotton is a seasonal field crop. The crop forms and harvesting systems determine the sequence.",
    "sourceFactIds": [
      "REASON-PLANTATION-FIELD-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-097",
    "qlName": "Food vs commercial crop-region comparison",
    "difficulty": "Easy",
    "stem": "Which crop is a staple foodgrain rather than a fibre or plantation crop?",
    "answer": "Wheat",
    "distractors": [
      "Cotton",
      "Jute",
      "Tea"
    ],
    "explanation": "Wheat is a major foodgrain cereal grown primarily for grain consumption. Cotton and jute are fibre crops, while tea is a plantation beverage crop.",
    "sourceFactIds": [
      "REASON-FOOD-COMMERCIAL-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-097",
    "qlName": "Food vs commercial crop-region comparison",
    "difficulty": "Easy",
    "stem": "Which crop is grown chiefly as an industrial fibre raw material?",
    "answer": "Cotton",
    "distractors": [
      "Rice",
      "Wheat",
      "Gram"
    ],
    "explanation": "Cotton is cultivated for fibre used by the textile industry, making it a major commercial raw-material crop. Rice, wheat and gram are food crops.",
    "sourceFactIds": [
      "REASON-COMMERCIAL-COTTON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-097",
    "qlName": "Food vs commercial crop-region comparison",
    "difficulty": "Medium",
    "stem": "Which regional pairing combines a food crop and a commercial crop suited to the same warm monsoon season?",
    "answer": "Rice and cotton",
    "distractors": [
      "Wheat and mustard only",
      "Gram and wheat",
      "Apple and wheat"
    ],
    "explanation": "Rice and cotton are both commonly kharif crops, though they need different water and soil conditions. The other pairs are dominated by rabi or temperate crops.",
    "sourceFactIds": [
      "REASON-FOOD-COMMERCIAL-KHARIF"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-097",
    "qlName": "Food vs commercial crop-region comparison",
    "difficulty": "Medium",
    "stem": "Which pair illustrates a food crop and a plantation beverage crop respectively?",
    "answer": "Rice and tea",
    "distractors": [
      "Cotton and jute",
      "Tea and coffee",
      "Mustard and groundnut"
    ],
    "explanation": "Rice is a foodgrain cereal, while tea is a plantation crop grown for beverage leaves. The other pairs remain within fibre, beverage or oilseed categories.",
    "sourceFactIds": [
      "REASON-FOOD-PLANTATION-PAIR"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-097",
    "qlName": "Food vs commercial crop-region comparison",
    "difficulty": "Medium",
    "stem": "Which change is a shift from foodgrain farming to a commercial fibre crop?",
    "answer": "Wheat to cotton",
    "distractors": [
      "Rice to wheat",
      "Gram to lentil",
      "Bajra to ragi"
    ],
    "explanation": "Wheat is a foodgrain cereal, while cotton is grown chiefly for industrial fibre. The other changes remain within foodgrain or pulse categories.",
    "sourceFactIds": [
      "REASON-FOOD-TO-COMMERCIAL-SHIFT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-097",
    "qlName": "Food vs commercial crop-region comparison",
    "difficulty": "Medium",
    "stem": "Which crop set contains one foodgrain, one oilseed and one fibre crop?",
    "answer": "Wheat, mustard, cotton",
    "distractors": [
      "Rice, wheat, maize",
      "Tea, coffee, rubber",
      "Cotton, jute, sugarcane"
    ],
    "explanation": "Wheat is a foodgrain, mustard an oilseed and cotton a fibre crop. The set therefore spans three different agricultural use categories.",
    "sourceFactIds": [
      "REASON-THREE-CROP-CATEGORY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-098",
    "qlName": "Water demand and resource-pressure reasoning",
    "difficulty": "Easy",
    "stem": "Which crop generally places greater irrigation demand on a dry region: rice or bajra?",
    "answer": "Rice",
    "distractors": [
      "Bajra",
      "Both require identical water",
      "Neither needs soil moisture"
    ],
    "explanation": "Rice has a much higher water requirement than bajra and is often grown under wet field conditions. Bajra is adapted to lower rainfall and dryland farming.",
    "sourceFactIds": [
      "REASON-WATER-RICE-BAJRA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-098",
    "qlName": "Water demand and resource-pressure reasoning",
    "difficulty": "Easy",
    "stem": "Which farming pattern can place heavy pressure on groundwater in a dry plain?",
    "answer": "Water-intensive crops supported by repeated tube-well pumping",
    "distractors": [
      "Rain-fed bajra without pumping",
      "Dryland pulses with little irrigation",
      "One seasonal millet crop"
    ],
    "explanation": "Repeated pumping for water-demanding crops can withdraw groundwater faster than recharge in dry regions. Rain-fed or low-water crops create far less direct aquifer pressure.",
    "sourceFactIds": [
      "REASON-GROUNDWATER-PRESSURE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-098",
    "qlName": "Water demand and resource-pressure reasoning",
    "difficulty": "Medium",
    "stem": "Which crop substitution would most likely reduce irrigation demand in a semi-arid region?",
    "answer": "Rice to bajra",
    "distractors": [
      "Bajra to rice",
      "Gram to sugarcane",
      "Mustard to paddy"
    ],
    "explanation": "Bajra needs far less water than rice, so replacing paddy with bajra can reduce irrigation demand. The other substitutions generally move toward more water-intensive crops.",
    "sourceFactIds": [
      "REASON-WATER-SAVING-SUBSTITUTION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-098",
    "qlName": "Water demand and resource-pressure reasoning",
    "difficulty": "Medium",
    "stem": "Why can rice–wheat rotation stress groundwater in a lower-rainfall area?",
    "answer": "Both crop seasons may depend on irrigation, especially water-intensive rice",
    "distractors": [
      "Neither crop uses water",
      "The rotation automatically recharges every aquifer",
      "Wheat requires permanent flooding"
    ],
    "explanation": "Irrigated rice can demand large amounts of water in kharif, while wheat also needs dry-season irrigation. Repeated pumping across both seasons can lower groundwater levels.",
    "sourceFactIds": [
      "REASON-RICE-WHEAT-GROUNDWATER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-098",
    "qlName": "Water demand and resource-pressure reasoning",
    "difficulty": "Medium",
    "stem": "Which change would help control waterlogging in a canal command area?",
    "answer": "Better drainage and more carefully timed irrigation",
    "distractors": [
      "Continuous flooding regardless of crop need",
      "Blocking drainage outlets",
      "Applying water when soil is saturated"
    ],
    "explanation": "Waterlogging develops when water accumulates faster than it drains from the root zone. Better drainage and matching irrigation to crop needs reduce that excess.",
    "sourceFactIds": [
      "REASON-WATERLOGGING-MANAGEMENT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-098",
    "qlName": "Water demand and resource-pressure reasoning",
    "difficulty": "Medium",
    "stem": "Which crop group can support rotation while usually using less water than paddy?",
    "answer": "Pulses",
    "distractors": [
      "Sugarcane",
      "Jute in flooded lowlands",
      "Rubber plantations"
    ],
    "explanation": "Many pulses have relatively modest water needs and can improve soil nitrogen through biological fixation. They can therefore diversify rotations away from water-intensive paddy.",
    "sourceFactIds": [
      "REASON-PULSES-WATER-ROTATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-099",
    "qlName": "Multi-clue crop identification",
    "difficulty": "Easy",
    "stem": "A crop is a rabi cereal, grows well on irrigated alluvial plains and is harvested in spring. Which crop is it?",
    "answer": "Wheat",
    "distractors": [
      "Rice",
      "Cotton",
      "Jute"
    ],
    "explanation": "Wheat fits all three clues: rabi season, irrigated alluvial plains and spring harvest. Rice, cotton and jute are generally kharif crops.",
    "sourceFactIds": [
      "REASON-MULTICLUE-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-099",
    "qlName": "Multi-clue crop identification",
    "difficulty": "Easy",
    "stem": "A crop is called golden fibre, grows in humid alluvial floodplains and needs water for retting. Which crop is it?",
    "answer": "Jute",
    "distractors": [
      "Cotton",
      "Mustard",
      "Bajra"
    ],
    "explanation": "The golden-fibre name, humid floodplain setting and retting process all identify jute. Cotton uses bolls, while mustard and bajra belong to different crop groups.",
    "sourceFactIds": [
      "REASON-MULTICLUE-JUTE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-099",
    "qlName": "Multi-clue crop identification",
    "difficulty": "Medium",
    "stem": "A crop is a kharif oilseed, strongly linked with central India and grown on well-drained soils. Which crop is it?",
    "answer": "Soybean",
    "distractors": [
      "Mustard",
      "Wheat",
      "Jute"
    ],
    "explanation": "Soybean is a kharif oilseed with a strong central Indian plateau belt and preference for well-drained fertile soils. The other options do not match all three clues.",
    "sourceFactIds": [
      "REASON-MULTICLUE-SOYBEAN"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-099",
    "qlName": "Multi-clue crop identification",
    "difficulty": "Medium",
    "stem": "A perennial crop grows in a humid southern plantation, often under shade trees, and produces berries containing beans. Which crop is it?",
    "answer": "Coffee",
    "distractors": [
      "Tea",
      "Rubber",
      "Cotton"
    ],
    "explanation": "Shade-grown plantation bushes producing berries with beans identify coffee. Tea is harvested for leaves, rubber for latex and cotton for fibre bolls.",
    "sourceFactIds": [
      "REASON-MULTICLUE-COFFEE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-099",
    "qlName": "Multi-clue crop identification",
    "difficulty": "Medium",
    "stem": "A long-duration crop needs warm weather, irrigation and nearby processing because its stalks are bulky. Which crop is it?",
    "answer": "Sugarcane",
    "distractors": [
      "Mustard",
      "Tea",
      "Jute"
    ],
    "explanation": "Sugarcane is a long-duration warm-season crop with high water needs, and its bulky stalks are best processed near the fields. The combined clues identify cane clearly.",
    "sourceFactIds": [
      "REASON-MULTICLUE-SUGARCANE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-099",
    "qlName": "Multi-clue crop identification",
    "difficulty": "Medium",
    "stem": "A crop grows on humid slopes, is repeatedly plucked for tender leaves and is processed soon after harvest. Which crop is it?",
    "answer": "Tea",
    "distractors": [
      "Coffee",
      "Rubber",
      "Cotton"
    ],
    "explanation": "Repeated plucking of tender leaves on humid slopes and rapid post-harvest processing are distinctive tea features. Coffee, rubber and cotton use different harvested products.",
    "sourceFactIds": [
      "REASON-MULTICLUE-TEA"
    ]
  }
]);

export const GEO_AGR_001_CP005_REASONING_SEGMENT_V1: readonly GeoAgr001Question[] = Object.freeze(
  RAW.map((raw, index) => Object.freeze({
    questionId: `GEO-AGR-001-CP005-R-Q${String(index + 1).padStart(3, "0")}`,
    qlId: raw.qlId, qlName: raw.qlName, difficulty: raw.difficulty, stem: raw.stem,
    options: placeGeoAgrOptions(raw.answer, raw.distractors, index % 4),
    correctIndex: index % 4, canonicalAnswer: raw.answer, explanation: raw.explanation,
    sourceIds: GEO_AGR_001_SOURCE_IDS, sourceFactIds: Object.freeze([...raw.sourceFactIds]),
    reviewOnly: true as const, runtimeRegistered: false as const,
  })),
);

export function auditGeoAgr001Cp005ReasoningSegmentV1() {
  return auditGeoAgr001Batch(GEO_AGR_001_CP005_REASONING_SEGMENT_V1, 91, 99);
}
