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
    "qlId": "GEO-AGR-001-QL-028",
    "qlName": "Oilseed crop family and uses",
    "difficulty": "Easy",
    "stem": "Which crop belongs to the oilseed group?",
    "answer": "Groundnut",
    "distractors": [
      "Jute",
      "Sugarcane",
      "Tea"
    ],
    "explanation": "Groundnut is grown primarily for edible oil and is one of India's important oilseed crops. Jute is a fibre crop, sugarcane is a sugar crop and tea is a plantation beverage crop.",
    "sourceFactIds": [
      "OILSEED-GROUNDNUT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-028",
    "qlName": "Oilseed crop family and uses",
    "difficulty": "Easy",
    "stem": "Which group contains only oilseed crops?",
    "answer": "Groundnut, mustard, soybean",
    "distractors": [
      "Cotton, jute, tea",
      "Rice, wheat, maize",
      "Sugarcane, tea, coffee"
    ],
    "explanation": "Groundnut, mustard and soybean are all cultivated for oil-rich seeds. The other groups contain fibre, cereal, sugar or plantation crops.",
    "sourceFactIds": [
      "OILSEED-GROUP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-028",
    "qlName": "Oilseed crop family and uses",
    "difficulty": "Medium",
    "stem": "Which crop should be removed from groundnut, mustard, soybean and jute to leave an oilseed-only set?",
    "answer": "Jute",
    "distractors": [
      "Groundnut",
      "Mustard",
      "Soybean"
    ],
    "explanation": "Groundnut, mustard and soybean are oilseed crops, whereas jute is grown for bast fibre. Removing jute leaves a consistent oilseed group.",
    "sourceFactIds": [
      "OILSEED-REMOVE-JUTE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-028",
    "qlName": "Oilseed crop family and uses",
    "difficulty": "Medium",
    "stem": "What is the common agricultural purpose linking mustard, sesame and sunflower?",
    "answer": "Their seeds are important sources of vegetable oil",
    "distractors": [
      "They are all fibre crops",
      "They are all plantation beverages",
      "They are grown only for cane sugar"
    ],
    "explanation": "Mustard, sesame and sunflower are cultivated for oil extracted from their seeds. This shared use places them in the oilseed crop group.",
    "sourceFactIds": [
      "OILSEED-COMMON-USE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-028",
    "qlName": "Oilseed crop family and uses",
    "difficulty": "Medium",
    "stem": "Which pair combines two oilseed crops rather than a fibre and sugar crop?",
    "answer": "Mustard and groundnut",
    "distractors": [
      "Cotton and sugarcane",
      "Jute and tea",
      "Wheat and jute"
    ],
    "explanation": "Mustard and groundnut are both oilseeds. Cotton and jute are fibre crops, while sugarcane and tea belong to different commercial-crop categories.",
    "sourceFactIds": [
      "OILSEED-PAIR"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-028",
    "qlName": "Oilseed crop family and uses",
    "difficulty": "Hard",
    "stem": "A processor buys seeds for edible-oil extraction rather than fibre or sugar production. Which crop set is the best fit?",
    "answer": "Groundnut, mustard and soybean",
    "distractors": [
      "Cotton, jute and sugarcane",
      "Tea, coffee and rubber",
      "Rice, wheat and jute"
    ],
    "explanation": "Groundnut, mustard and soybean are all oil-rich seed crops used for vegetable-oil production. The other sets contain crops grown for fibre, sugar, beverages or staple grain.",
    "sourceFactIds": [
      "OILSEED-PROCESSING-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-029",
    "qlName": "Groundnut geography",
    "difficulty": "Easy",
    "stem": "Groundnut is commonly grown in India during which major crop season?",
    "answer": "Kharif",
    "distractors": [
      "Rabi only",
      "Zaid only",
      "Plantation season"
    ],
    "explanation": "Groundnut is commonly sown with monsoon moisture and is treated as a major kharif oilseed. In some regions it can also be grown in other seasons with irrigation.",
    "sourceFactIds": [
      "GROUNDNUT-KHARIF"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-029",
    "qlName": "Groundnut geography",
    "difficulty": "Easy",
    "stem": "Which field condition suits groundnut better than waterlogged soil?",
    "answer": "Well-drained light soil",
    "distractors": [
      "Permanent standing water",
      "Tidal saline marsh",
      "Deep swamp throughout the season"
    ],
    "explanation": "Groundnut develops pods below the soil surface and performs well in loose, well-drained soils. Prolonged waterlogging is harmful to root and pod development.",
    "sourceFactIds": [
      "GROUNDNUT-DRAINAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-029",
    "qlName": "Groundnut geography",
    "difficulty": "Medium",
    "stem": "Which climate is suitable for groundnut cultivation?",
    "answer": "Warm weather with moderate rainfall",
    "distractors": [
      "Permanent freezing conditions",
      "Heavy waterlogging throughout growth",
      "Cold snowy climate"
    ],
    "explanation": "Groundnut is a warm-season crop and needs sufficient moisture without prolonged flooding. Moderate rainfall and well-drained fields support good growth.",
    "sourceFactIds": [
      "GROUNDNUT-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-029",
    "qlName": "Groundnut geography",
    "difficulty": "Medium",
    "stem": "Which state is strongly linked with groundnut cultivation?",
    "answer": "Gujarat",
    "distractors": [
      "Sikkim",
      "Himachal Pradesh only",
      "Arunachal Pradesh only"
    ],
    "explanation": "Gujarat has extensive warm dry-to-semi-dry areas suited to groundnut and is a long-established groundnut-growing state. The crop is also important in several other western and southern states.",
    "sourceFactIds": [
      "GROUNDNUT-GUJARAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-029",
    "qlName": "Groundnut geography",
    "difficulty": "Medium",
    "stem": "Why is a loose, well-drained soil useful for groundnut?",
    "answer": "Pods develop underground and need aerated soil rather than prolonged flooding",
    "distractors": [
      "The crop grows only in standing water",
      "Pods form on tree branches",
      "The crop needs glacial soil"
    ],
    "explanation": "Groundnut pods form below the soil surface after flowering. Loose aerated soil helps pod development, while prolonged waterlogging creates poor root conditions.",
    "sourceFactIds": [
      "GROUNDNUT-POD-SOIL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-029",
    "qlName": "Groundnut geography",
    "difficulty": "Hard",
    "stem": "Farm A is warm with sandy loam and good drainage; Farm B is continuously flooded clay. Which farm is more suitable for groundnut?",
    "answer": "Farm A",
    "distractors": [
      "Farm B",
      "Both require deep standing water",
      "Neither can grow groundnut"
    ],
    "explanation": "Groundnut needs warmth and a loose well-drained root zone, which Farm A provides. Continuous flooding in Farm B is unsuitable for normal pod formation.",
    "sourceFactIds": [
      "GROUNDNUT-FARM-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-030",
    "qlName": "Mustard geography",
    "difficulty": "Easy",
    "stem": "Mustard is commonly grown in which major crop season?",
    "answer": "Rabi",
    "distractors": [
      "Kharif only",
      "Zaid only",
      "Plantation season"
    ],
    "explanation": "Mustard is an important winter oilseed and is usually sown after the monsoon. Its standard crop-calendar classification is rabi.",
    "sourceFactIds": [
      "MUSTARD-RABI"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-030",
    "qlName": "Mustard geography",
    "difficulty": "Easy",
    "stem": "Which weather pattern suits mustard cultivation?",
    "answer": "Cool growing season with relatively dry conditions",
    "distractors": [
      "Deep standing water throughout monsoon",
      "Hot humid swamp climate",
      "Permanent snow cover"
    ],
    "explanation": "Mustard is a cool-season rabi crop and generally performs well under comparatively dry winter conditions. It does not require paddy-style flooding.",
    "sourceFactIds": [
      "MUSTARD-COOL-DRY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-030",
    "qlName": "Mustard geography",
    "difficulty": "Medium",
    "stem": "Which state has a well-established mustard belt?",
    "answer": "Rajasthan",
    "distractors": [
      "Kerala only",
      "Sikkim only",
      "Goa only"
    ],
    "explanation": "Rajasthan has large dry rabi-growing areas where mustard is well suited. Mustard is also important in several northern and central states.",
    "sourceFactIds": [
      "MUSTARD-RAJASTHAN"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-030",
    "qlName": "Mustard geography",
    "difficulty": "Medium",
    "stem": "Which comparison between mustard and groundnut is accurate?",
    "answer": "Mustard is commonly rabi; groundnut is commonly kharif",
    "distractors": [
      "Mustard is kharif; groundnut is rabi only",
      "Both are plantation crops",
      "Both require flooded paddy fields"
    ],
    "explanation": "Mustard is a cool-season rabi oilseed, while groundnut is commonly linked with the warm kharif season. Their standard sowing calendars differ.",
    "sourceFactIds": [
      "MUSTARD-GROUNDNUT-SEASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-030",
    "qlName": "Mustard geography",
    "difficulty": "Medium",
    "stem": "A farmer wants an oilseed for cool post-monsoon sowing. Which crop fits best?",
    "answer": "Mustard",
    "distractors": [
      "Groundnut under normal kharif timing",
      "Jute",
      "Cotton"
    ],
    "explanation": "Mustard is a classic rabi oilseed sown in the cooler post-monsoon period. Groundnut, jute and cotton are more closely linked with kharif conditions.",
    "sourceFactIds": [
      "MUSTARD-POST-MONSOON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-030",
    "qlName": "Mustard geography",
    "difficulty": "Hard",
    "stem": "Field A is prepared in November under cool dry weather; Field B is planted with monsoon onset. Which oilseed is more naturally suited to Field A?",
    "answer": "Mustard",
    "distractors": [
      "Groundnut",
      "Soybean",
      "Sesame under normal kharif timing"
    ],
    "explanation": "November sowing under cool weather is a rabi pattern and strongly points to mustard. Groundnut and soybean are generally kharif oilseeds.",
    "sourceFactIds": [
      "MUSTARD-SEASON-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-031",
    "qlName": "Soybean geography",
    "difficulty": "Easy",
    "stem": "Soybean belongs to which crop group?",
    "answer": "Oilseeds",
    "distractors": [
      "Fibre crops",
      "Sugar crops",
      "Plantation beverages"
    ],
    "explanation": "Soybean is valued for its oil-rich seed and high-protein meal, placing it in the oilseed group. It is not a fibre, sugar or plantation beverage crop.",
    "sourceFactIds": [
      "SOYBEAN-OILSEED"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-031",
    "qlName": "Soybean geography",
    "difficulty": "Easy",
    "stem": "Soybean is commonly cultivated in India during which major season?",
    "answer": "Kharif",
    "distractors": [
      "Rabi only",
      "Zaid only",
      "Winter plantation"
    ],
    "explanation": "Soybean is usually sown with the monsoon and is a major kharif oilseed. Warm weather and seasonal rainfall suit its growing period.",
    "sourceFactIds": [
      "SOYBEAN-KHARIF"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-031",
    "qlName": "Soybean geography",
    "difficulty": "Medium",
    "stem": "Which region is strongly linked with soybean cultivation?",
    "answer": "Central Indian plateau belt",
    "distractors": [
      "High Himalayan snowfields",
      "Tidal mangrove swamps only",
      "Coral islands only"
    ],
    "explanation": "Soybean is widely grown across central India, especially plateau and black-soil areas. The warm monsoon season and suitable soils support the crop there.",
    "sourceFactIds": [
      "SOYBEAN-CENTRAL-INDIA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-031",
    "qlName": "Soybean geography",
    "difficulty": "Medium",
    "stem": "Which state is well known for soybean cultivation?",
    "answer": "Madhya Pradesh",
    "distractors": [
      "Goa only",
      "Sikkim only",
      "Nagaland only"
    ],
    "explanation": "Madhya Pradesh has a major soybean belt across its central plateau landscape. Soybean is also important in Maharashtra and parts of Rajasthan.",
    "sourceFactIds": [
      "SOYBEAN-MP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-031",
    "qlName": "Soybean geography",
    "difficulty": "Medium",
    "stem": "Which soil setting can support soybean well?",
    "answer": "Well-drained fertile black or loamy soil",
    "distractors": [
      "Permanent tidal mud only",
      "Glacial ice",
      "Deep standing water throughout"
    ],
    "explanation": "Soybean prefers fertile soil with good drainage and adequate monsoon moisture. Black and loamy soils of central India can provide favourable conditions.",
    "sourceFactIds": [
      "SOYBEAN-SOIL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-031",
    "qlName": "Soybean geography",
    "difficulty": "Hard",
    "stem": "A warm monsoon district on a well-drained central plateau wants an oilseed suited to kharif cultivation. Which crop fits?",
    "answer": "Soybean",
    "distractors": [
      "Mustard",
      "Wheat",
      "Jute fibre"
    ],
    "explanation": "Warm kharif conditions and a well-drained central plateau setting fit soybean well. Mustard and wheat are rabi crops, while jute needs a much wetter floodplain environment.",
    "sourceFactIds": [
      "SOYBEAN-REGION-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-032",
    "qlName": "Sesame geography",
    "difficulty": "Easy",
    "stem": "Sesame is also known by which common Indian crop name?",
    "answer": "Til",
    "distractors": [
      "Arhar",
      "Bajra",
      "Ragi"
    ],
    "explanation": "Sesame is commonly called til in India and is grown for its oil-rich seeds. Arhar is a pulse, while bajra and ragi are millets.",
    "sourceFactIds": [
      "SESAME-TIL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-032",
    "qlName": "Sesame geography",
    "difficulty": "Easy",
    "stem": "Sesame belongs to which agricultural crop group?",
    "answer": "Oilseeds",
    "distractors": [
      "Fibre crops",
      "Beverage crops",
      "Sugar crops"
    ],
    "explanation": "Sesame seeds contain valuable edible oil, so the crop is classified as an oilseed. It is not grown primarily for fibre, beverage leaves or cane sugar.",
    "sourceFactIds": [
      "SESAME-OILSEED"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-032",
    "qlName": "Sesame geography",
    "difficulty": "Medium",
    "stem": "Which field condition is suitable for sesame?",
    "answer": "Warm well-drained soil with moderate moisture",
    "distractors": [
      "Permanent waterlogging",
      "Deep snow throughout growth",
      "Tidal seawater flooding"
    ],
    "explanation": "Sesame is a warm-season crop and performs best where soil drains well. Excess water and prolonged waterlogging are harmful to normal growth.",
    "sourceFactIds": [
      "SESAME-DRAINAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-032",
    "qlName": "Sesame geography",
    "difficulty": "Medium",
    "stem": "Why can sesame be grown in comparatively dry regions?",
    "answer": "It can tolerate lower moisture better than water-demanding paddy",
    "distractors": [
      "It requires permanent standing water",
      "It grows only in swamps",
      "It needs winter snow"
    ],
    "explanation": "Sesame is relatively drought tolerant once established and does not need flooded fields. This makes it suitable for many dryland farming areas.",
    "sourceFactIds": [
      "SESAME-DRYLAND"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-032",
    "qlName": "Sesame geography",
    "difficulty": "Medium",
    "stem": "Which statement about sesame season is safest for Indian crop geography?",
    "answer": "Its season can vary regionally, though kharif cultivation is common",
    "distractors": [
      "It can only be grown in one winter month",
      "It is restricted to permanent plantations",
      "It requires snow-season sowing"
    ],
    "explanation": "Sesame is grown in different seasonal windows across India, with kharif cultivation common in many regions. This regional flexibility makes a single rigid season label less accurate.",
    "sourceFactIds": [
      "SESAME-SEASON-FLEXIBILITY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-032",
    "qlName": "Sesame geography",
    "difficulty": "Medium",
    "stem": "A crop is called til, gives edible oil and tolerates relatively dry well-drained fields. Which crop is it?",
    "answer": "Sesame",
    "distractors": [
      "Jute",
      "Sugarcane",
      "Tea"
    ],
    "explanation": "Til is the common Indian name for sesame, an oilseed adapted to warm and relatively dry conditions. The other crops belong to fibre, sugar or plantation groups.",
    "sourceFactIds": [
      "SESAME-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-033",
    "qlName": "Sunflower and castor",
    "difficulty": "Easy",
    "stem": "Sunflower is cultivated primarily for which product?",
    "answer": "Edible oil from its seeds",
    "distractors": [
      "Bast fibre",
      "Cane sugar",
      "Tea leaves"
    ],
    "explanation": "Sunflower seeds contain oil used for cooking and other purposes, so sunflower is an oilseed crop. It is not a fibre, sugar or beverage crop.",
    "sourceFactIds": [
      "SUNFLOWER-OIL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-033",
    "qlName": "Sunflower and castor",
    "difficulty": "Easy",
    "stem": "Castor belongs to which crop group?",
    "answer": "Oilseeds",
    "distractors": [
      "Cereals",
      "Fibre crops",
      "Plantation beverages"
    ],
    "explanation": "Castor seeds yield castor oil, placing the crop among oilseeds. The oil also has important industrial uses beyond food applications.",
    "sourceFactIds": [
      "CASTOR-OILSEED"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-033",
    "qlName": "Sunflower and castor",
    "difficulty": "Medium",
    "stem": "Which crop is especially valued for an oil used widely in industrial and medicinal products?",
    "answer": "Castor",
    "distractors": [
      "Jute",
      "Wheat",
      "Tea"
    ],
    "explanation": "Castor oil has many industrial and medicinal uses, which gives castor a distinct role among oilseeds. Jute, wheat and tea are grown for different products.",
    "sourceFactIds": [
      "CASTOR-INDUSTRIAL-OIL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-033",
    "qlName": "Sunflower and castor",
    "difficulty": "Medium",
    "stem": "Which climate generally suits sunflower cultivation?",
    "answer": "Sunny conditions with moderate moisture and good drainage",
    "distractors": [
      "Permanent deep flooding",
      "Continuous snow cover",
      "Tidal saline swamp"
    ],
    "explanation": "Sunflower performs well under bright sunny conditions with adequate moisture and well-drained soil. Persistent flooding is not favourable.",
    "sourceFactIds": [
      "SUNFLOWER-CONDITIONS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-033",
    "qlName": "Sunflower and castor",
    "difficulty": "Medium",
    "stem": "Which pair contains two oilseeds that can fit relatively dry farming systems?",
    "answer": "Sunflower and castor",
    "distractors": [
      "Jute and rice",
      "Tea and rubber",
      "Sugarcane and jute"
    ],
    "explanation": "Sunflower and castor are both oilseeds and can be cultivated under moderate to relatively dry conditions with suitable management. The other pairs include water-demanding or plantation crops.",
    "sourceFactIds": [
      "SUNFLOWER-CASTOR-PAIR"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-033",
    "qlName": "Sunflower and castor",
    "difficulty": "Hard",
    "stem": "A farmer wants a seed crop for non-food industrial oil in a warm semi-dry area. Which option fits most closely?",
    "answer": "Castor",
    "distractors": [
      "Jute",
      "Tea",
      "Wheat"
    ],
    "explanation": "Castor is adapted to warm conditions and produces oil with major industrial uses. Jute is a fibre crop, tea a plantation crop and wheat a rabi cereal.",
    "sourceFactIds": [
      "CASTOR-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-034",
    "qlName": "Oilseed regional associations",
    "difficulty": "Easy",
    "stem": "Which state–oilseed match is well established?",
    "answer": "Gujarat — groundnut",
    "distractors": [
      "Sikkim — groundnut only",
      "Kerala — mustard belt only",
      "Goa — soybean belt only"
    ],
    "explanation": "Gujarat is strongly linked with groundnut cultivation across its warm semi-dry agricultural areas. The other pairings are not standard oilseed-region matches.",
    "sourceFactIds": [
      "OILSEED-GUJARAT-GROUNDNUT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-034",
    "qlName": "Oilseed regional associations",
    "difficulty": "Easy",
    "stem": "Which state–oilseed match is accurate?",
    "answer": "Madhya Pradesh — soybean",
    "distractors": [
      "Lakshadweep — soybean",
      "Sikkim — castor belt",
      "Goa — mustard belt"
    ],
    "explanation": "Madhya Pradesh is a major soybean-growing region of central India. Its plateau climate and soils support widespread kharif soybean cultivation.",
    "sourceFactIds": [
      "OILSEED-MP-SOYBEAN"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-034",
    "qlName": "Oilseed regional associations",
    "difficulty": "Medium",
    "stem": "Which state–crop association fits a dry rabi oilseed belt?",
    "answer": "Rajasthan — mustard",
    "distractors": [
      "Kerala — mustard only",
      "Assam — mustard only",
      "Goa — mustard only"
    ],
    "explanation": "Rajasthan's cool dry rabi conditions suit mustard and make it an important crop there. The association is a standard feature of India's oilseed geography.",
    "sourceFactIds": [
      "OILSEED-RAJASTHAN-MUSTARD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-034",
    "qlName": "Oilseed regional associations",
    "difficulty": "Medium",
    "stem": "Which regional sequence is most logical for groundnut, soybean and mustard respectively?",
    "answer": "Western India, central India, northwestern dry rabi belt",
    "distractors": [
      "High Himalaya, tidal delta, coral islands",
      "Snowfield, mangrove coast, equatorial island",
      "Only eastern hills for all three"
    ],
    "explanation": "Groundnut is strongly linked with western India, soybean with central India and mustard with dry northwestern rabi regions. The crops occupy different geographic niches.",
    "sourceFactIds": [
      "OILSEED-REGIONAL-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-034",
    "qlName": "Oilseed regional associations",
    "difficulty": "Medium",
    "stem": "Which crop is the strongest match for a central Indian kharif oilseed belt?",
    "answer": "Soybean",
    "distractors": [
      "Mustard",
      "Wheat",
      "Jute"
    ],
    "explanation": "Soybean is a major kharif oilseed of central India. Mustard and wheat are rabi crops, while jute belongs to humid eastern floodplains.",
    "sourceFactIds": [
      "OILSEED-CENTRAL-SOYBEAN"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-034",
    "qlName": "Oilseed regional associations",
    "difficulty": "Hard",
    "stem": "Region A is western and semi-dry, Region B is a central plateau, and Region C is a cool dry rabi belt. Which crops fit A, B and C?",
    "answer": "Groundnut, soybean, mustard",
    "distractors": [
      "Mustard, jute, rice",
      "Soybean, tea, cotton",
      "Jute, groundnut, rubber"
    ],
    "explanation": "Groundnut fits western semi-dry agriculture, soybean the central plateau belt and mustard the cool dry rabi zone. The three clues identify those oilseeds in order.",
    "sourceFactIds": [
      "OILSEED-THREE-REGION-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-035",
    "qlName": "Oilseed climate and soil comparisons",
    "difficulty": "Easy",
    "stem": "Which oilseed is most clearly linked with cool rabi conditions?",
    "answer": "Mustard",
    "distractors": [
      "Groundnut",
      "Soybean",
      "Castor"
    ],
    "explanation": "Mustard is a winter rabi oilseed and is strongly linked with cool dry conditions. Groundnut, soybean and castor generally fit warmer growing environments.",
    "sourceFactIds": [
      "OILSEED-COOL-RABI"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-035",
    "qlName": "Oilseed climate and soil comparisons",
    "difficulty": "Easy",
    "stem": "Which oilseed is strongly linked with warm kharif conditions on well-drained central Indian soils?",
    "answer": "Soybean",
    "distractors": [
      "Mustard",
      "Linseed under normal rabi timing",
      "Wheat"
    ],
    "explanation": "Soybean is a warm kharif oilseed widely grown on well-drained soils of central India. Mustard and linseed are more closely linked with rabi cultivation.",
    "sourceFactIds": [
      "OILSEED-WARM-KHARIF-SOY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-035",
    "qlName": "Oilseed climate and soil comparisons",
    "difficulty": "Medium",
    "stem": "Which comparison is accurate?",
    "answer": "Groundnut needs good drainage; mustard suits cool rabi weather",
    "distractors": [
      "Groundnut requires permanent flooding; mustard needs monsoon swamp",
      "Both require deep standing water",
      "Both are plantation tree crops"
    ],
    "explanation": "Groundnut develops underground pods and needs well-drained soil, while mustard is a cool-season rabi oilseed. Their soil-water and seasonal requirements differ clearly.",
    "sourceFactIds": [
      "OILSEED-GROUNDNUT-MUSTARD-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-035",
    "qlName": "Oilseed climate and soil comparisons",
    "difficulty": "Medium",
    "stem": "Which crop is less suitable for a permanently waterlogged field?",
    "answer": "Groundnut",
    "distractors": [
      "Paddy rice",
      "Wetland taro",
      "Aquatic vegetation"
    ],
    "explanation": "Groundnut needs aerated, well-drained soil for root and pod development, so prolonged waterlogging is harmful. Paddy is much better adapted to wet field conditions.",
    "sourceFactIds": [
      "OILSEED-WATERLOGGING-GROUNDNUT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-035",
    "qlName": "Oilseed climate and soil comparisons",
    "difficulty": "Medium",
    "stem": "Which oilseed is a logical choice for a dry winter field in northwestern India?",
    "answer": "Mustard",
    "distractors": [
      "Soybean under normal kharif timing",
      "Groundnut under flooded conditions",
      "Jute"
    ],
    "explanation": "Mustard is well suited to cool dry rabi conditions in northwestern India. Soybean and groundnut are usually warmer-season crops, while jute needs a humid floodplain environment.",
    "sourceFactIds": [
      "OILSEED-NW-RABI-MUSTARD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-035",
    "qlName": "Oilseed climate and soil comparisons",
    "difficulty": "Medium",
    "stem": "Which oilseed pair is more strongly linked with the warm season than with winter rabi cultivation?",
    "answer": "Groundnut and soybean",
    "distractors": [
      "Mustard and linseed",
      "Wheat and gram",
      "Mustard and wheat"
    ],
    "explanation": "Groundnut and soybean are commonly kharif oilseeds and grow under warm monsoon-season conditions. Mustard and linseed are more strongly linked with rabi.",
    "sourceFactIds": [
      "OILSEED-WARM-PAIR"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-036",
    "qlName": "Integrated oilseed reasoning",
    "difficulty": "Easy",
    "stem": "Which crop-season pair is accurate?",
    "answer": "Mustard — rabi",
    "distractors": [
      "Soybean — rabi only",
      "Groundnut — winter plantation",
      "Jute — oilseed rabi"
    ],
    "explanation": "Mustard is a standard rabi oilseed. Soybean and groundnut are commonly kharif crops, while jute is a fibre crop rather than an oilseed.",
    "sourceFactIds": [
      "OILSEED-INTEGRATED-SEASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-036",
    "qlName": "Integrated oilseed reasoning",
    "difficulty": "Easy",
    "stem": "Which crop–region pair is accurate?",
    "answer": "Soybean — central India",
    "distractors": [
      "Mustard — humid delta only",
      "Groundnut — glacial valley only",
      "Castor — tidal marsh only"
    ],
    "explanation": "Soybean has a strong belt across central India. The distractor pairings place oilseeds in environments that do not match their typical geography.",
    "sourceFactIds": [
      "OILSEED-INTEGRATED-REGION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-036",
    "qlName": "Integrated oilseed reasoning",
    "difficulty": "Medium",
    "stem": "A crop is kharif, oil-bearing and strongly linked with Gujarat. Which crop is the best match?",
    "answer": "Groundnut",
    "distractors": [
      "Mustard",
      "Wheat",
      "Jute"
    ],
    "explanation": "Groundnut is a major kharif oilseed with a strong geographic association with Gujarat. Mustard and wheat are rabi crops, while jute is a fibre crop.",
    "sourceFactIds": [
      "OILSEED-INTEGRATED-GROUNDNUT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-036",
    "qlName": "Integrated oilseed reasoning",
    "difficulty": "Medium",
    "stem": "A crop is a rabi oilseed and fits the dry northwestern plains. Which crop is indicated?",
    "answer": "Mustard",
    "distractors": [
      "Soybean",
      "Groundnut",
      "Jute"
    ],
    "explanation": "Mustard combines the required rabi season with a strong dry northwestern geographic association. Soybean and groundnut are usually warmer-season oilseeds.",
    "sourceFactIds": [
      "OILSEED-INTEGRATED-MUSTARD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-036",
    "qlName": "Integrated oilseed reasoning",
    "difficulty": "Medium",
    "stem": "Which set matches crop, season and region most logically?",
    "answer": "Soybean — kharif — central plateau",
    "distractors": [
      "Mustard — kharif — humid delta",
      "Groundnut — rabi only — high Himalaya",
      "Jute — rabi oilseed — dry plateau"
    ],
    "explanation": "Soybean is a kharif oilseed strongly linked with central plateau regions. The other combinations mismatch either season, crop group or geographic setting.",
    "sourceFactIds": [
      "OILSEED-INTEGRATED-TRIPLE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-036",
    "qlName": "Integrated oilseed reasoning",
    "difficulty": "Medium",
    "stem": "Which statement about India's oilseeds is accurate?",
    "answer": "Different oilseeds occupy distinct seasonal and regional niches",
    "distractors": [
      "All oilseeds require flooded fields",
      "All oilseeds are grown only in winter",
      "All oilseeds are plantation tree crops"
    ],
    "explanation": "Mustard, soybean, groundnut, sesame, sunflower and castor differ in season, soil and climate requirements. Oilseed geography is therefore diverse rather than uniform.",
    "sourceFactIds": [
      "OILSEED-INTEGRATED-DIVERSITY"
    ]
  }
]);

export const GEO_AGR_001_CP002_OILSEEDS_SEGMENT_V1: readonly GeoAgr001Question[] = Object.freeze(
  RAW.map((raw, index) => Object.freeze({
    questionId: `GEO-AGR-001-CP002-OIL-Q${String(index + 1).padStart(3, "0")}`,
    qlId: raw.qlId, qlName: raw.qlName, difficulty: raw.difficulty, stem: raw.stem,
    options: placeGeoAgrOptions(raw.answer, raw.distractors, index % 4),
    correctIndex: index % 4, canonicalAnswer: raw.answer, explanation: raw.explanation,
    sourceIds: GEO_AGR_001_SOURCE_IDS, sourceFactIds: Object.freeze([...raw.sourceFactIds]),
    reviewOnly: true as const, runtimeRegistered: false as const,
  })),
);

export function auditGeoAgr001Cp002OilseedsSegmentV1() {
  return auditGeoAgr001Batch(GEO_AGR_001_CP002_OILSEEDS_SEGMENT_V1, 28, 36);
}
