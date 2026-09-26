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
    "qlId": "GEO-AGR-001-QL-046",
    "qlName": "Cotton fibre crop and kharif timing",
    "difficulty": "Easy",
    "stem": "Cotton is primarily grown for which product?",
    "answer": "Fibre",
    "distractors": [
      "Cane sugar",
      "Tea leaves",
      "Edible grain"
    ],
    "explanation": "Cotton produces natural fibre used extensively by the textile industry. It is therefore classified as a major fibre crop rather than a sugar, beverage or cereal crop.",
    "sourceFactIds": [
      "COTTON-FIBRE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-046",
    "qlName": "Cotton fibre crop and kharif timing",
    "difficulty": "Easy",
    "stem": "Cotton is generally grown in India during which major crop season?",
    "answer": "Kharif",
    "distractors": [
      "Rabi only",
      "Zaid only",
      "Winter plantation"
    ],
    "explanation": "Cotton is commonly sown with monsoon onset and grows through the warm kharif season. Its long frost-free requirement also suits this seasonal pattern.",
    "sourceFactIds": [
      "COTTON-KHARIF"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-046",
    "qlName": "Cotton fibre crop and kharif timing",
    "difficulty": "Medium",
    "stem": "Why is cotton usually grouped with kharif crops?",
    "answer": "It needs warm weather and is commonly sown around monsoon onset",
    "distractors": [
      "It needs winter frost throughout growth",
      "It grows only under snow",
      "It requires cool spring sowing only"
    ],
    "explanation": "Cotton requires a long warm growing period and is commonly planted with the monsoon. These features place it within the standard kharif calendar.",
    "sourceFactIds": [
      "COTTON-KHARIF-REASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-046",
    "qlName": "Cotton fibre crop and kharif timing",
    "difficulty": "Medium",
    "stem": "Which crop should be removed from cotton, jute, tea and wheat to leave only commercial non-cereal crops?",
    "answer": "Wheat",
    "distractors": [
      "Cotton",
      "Jute",
      "Tea"
    ],
    "explanation": "Cotton, jute and tea are commercial crops grown for fibre or beverages, while wheat is a foodgrain cereal. Wheat is therefore the outlier.",
    "sourceFactIds": [
      "COTTON-COMMERCIAL-CROP-GROUP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-046",
    "qlName": "Cotton fibre crop and kharif timing",
    "difficulty": "Medium",
    "stem": "Which crop–industry relation is accurate?",
    "answer": "Cotton — textile industry",
    "distractors": [
      "Cotton — sugar mill",
      "Cotton — tea factory",
      "Cotton — rice mill only"
    ],
    "explanation": "Cotton fibre is a basic raw material for spinning and textile manufacturing. Its agricultural geography is therefore closely linked with the cotton textile industry.",
    "sourceFactIds": [
      "COTTON-TEXTILE-LINK"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-046",
    "qlName": "Cotton fibre crop and kharif timing",
    "difficulty": "Hard",
    "stem": "A crop is sown in warm monsoon conditions, harvested for fibre and supplies textile mills. Which crop is indicated?",
    "answer": "Cotton",
    "distractors": [
      "Mustard",
      "Sugarcane",
      "Tea"
    ],
    "explanation": "Warm kharif cultivation, fibre production and textile linkage together identify cotton. The other crops are oilseed, sugar or plantation beverage crops.",
    "sourceFactIds": [
      "COTTON-KHARIF-FIBRE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-047",
    "qlName": "Cotton climate and frost-free period",
    "difficulty": "Easy",
    "stem": "Which temperature condition favours cotton cultivation?",
    "answer": "High temperature with a long frost-free period",
    "distractors": [
      "Frequent severe frost",
      "Permanent freezing weather",
      "Short cold growing season"
    ],
    "explanation": "Cotton needs sustained warmth through much of its growth and is sensitive to frost. A long frost-free period therefore supports fibre development and boll maturity.",
    "sourceFactIds": [
      "COTTON-WARM-FROSTFREE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-047",
    "qlName": "Cotton climate and frost-free period",
    "difficulty": "Easy",
    "stem": "Which weather near boll opening helps cotton quality?",
    "answer": "Bright sunshine and relatively dry conditions",
    "distractors": [
      "Persistent heavy rain",
      "Continuous flooding",
      "Frequent frost"
    ],
    "explanation": "Dry bright weather helps cotton bolls open and keeps the fibre cleaner at harvest. Excess rain during this stage can damage quality and delay picking.",
    "sourceFactIds": [
      "COTTON-RIPENING-SUNSHINE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-047",
    "qlName": "Cotton climate and frost-free period",
    "difficulty": "Medium",
    "stem": "Why is frequent frost a problem for cotton?",
    "answer": "Cotton needs a long warm growing season",
    "distractors": [
      "Cotton grows only when frozen",
      "Frost increases boll formation",
      "The crop requires snow cover"
    ],
    "explanation": "Cotton develops over a long warm season and frost can damage plants before bolls mature. Frost-free conditions are therefore an important climatic requirement.",
    "sourceFactIds": [
      "COTTON-FROST-PROBLEM"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-047",
    "qlName": "Cotton climate and frost-free period",
    "difficulty": "Medium",
    "stem": "Which rainfall pattern suits cotton better than continuous heavy flooding?",
    "answer": "Moderate seasonal rainfall with good drainage",
    "distractors": [
      "Permanent standing water",
      "Tidal flooding",
      "Heavy rainfall throughout harvest"
    ],
    "explanation": "Cotton needs moisture during growth but not prolonged waterlogging. Moderate rainfall, irrigation where needed and good drainage are more suitable than continuous flooding.",
    "sourceFactIds": [
      "COTTON-RAINFALL-DRAINAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-047",
    "qlName": "Cotton climate and frost-free period",
    "difficulty": "Medium",
    "stem": "Which climate description fits cotton best?",
    "answer": "Warm season, moderate moisture and sunny harvest weather",
    "distractors": [
      "Cold wet season with frequent snow",
      "Permanent humid flooding",
      "Polar climate"
    ],
    "explanation": "Cotton needs warmth and adequate moisture while growing, followed by drier sunny weather for boll opening and picking. This pattern supports both yield and fibre quality.",
    "sourceFactIds": [
      "COTTON-CLIMATE-PATTERN"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-047",
    "qlName": "Cotton climate and frost-free period",
    "difficulty": "Hard",
    "stem": "Region A has 200+ frost-free days and sunny autumn weather; Region B has frequent frost before harvest. Which region is better for cotton?",
    "answer": "Region A",
    "distractors": [
      "Region B",
      "Both are equal because frost is useful",
      "Neither can grow cotton"
    ],
    "explanation": "A long frost-free period and sunny harvest weather are favourable for cotton, while early frost can damage immature bolls. Region A is therefore the stronger fit.",
    "sourceFactIds": [
      "COTTON-CLIMATE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-048",
    "qlName": "Cotton black-soil and Deccan association",
    "difficulty": "Easy",
    "stem": "Which soil is famously linked with cotton cultivation in India?",
    "answer": "Black soil",
    "distractors": [
      "Tundra soil",
      "Glacial ice",
      "Mangrove mud only"
    ],
    "explanation": "Black soil of the Deccan is widely known for its suitability for cotton because it retains moisture and has a deep clayey profile. This has produced the term black cotton soil.",
    "sourceFactIds": [
      "COTTON-BLACK-SOIL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-048",
    "qlName": "Cotton black-soil and Deccan association",
    "difficulty": "Easy",
    "stem": "Which physical region is strongly linked with rain-fed cotton?",
    "answer": "Deccan Plateau",
    "distractors": [
      "High Himalayan snowfields",
      "Sundarbans tidal swamp only",
      "Coral islands only"
    ],
    "explanation": "Large parts of the Deccan Plateau contain black soils and warm climates suitable for cotton. This region forms a classic cotton belt in India.",
    "sourceFactIds": [
      "COTTON-DECCAN"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-048",
    "qlName": "Cotton black-soil and Deccan association",
    "difficulty": "Medium",
    "stem": "Why is black soil suitable for cotton?",
    "answer": "It can retain moisture while supporting deep root development",
    "distractors": [
      "It remains permanently frozen",
      "It contains only tidal saltwater",
      "It cannot hold any moisture"
    ],
    "explanation": "Black soil has a fine clayey texture and good moisture-retention capacity, which benefits cotton during dry intervals. Its depth also supports crop roots.",
    "sourceFactIds": [
      "COTTON-BLACK-SOIL-REASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-048",
    "qlName": "Cotton black-soil and Deccan association",
    "difficulty": "Medium",
    "stem": "Which state is strongly linked with black-soil cotton cultivation?",
    "answer": "Maharashtra",
    "distractors": [
      "Sikkim",
      "Arunachal Pradesh only",
      "Goa only"
    ],
    "explanation": "Maharashtra lies across extensive Deccan black-soil tracts and has a long-established cotton belt. Similar conditions occur in several western and central states.",
    "sourceFactIds": [
      "COTTON-MAHARASHTRA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-048",
    "qlName": "Cotton black-soil and Deccan association",
    "difficulty": "Medium",
    "stem": "Which landscape clue points most strongly toward cotton?",
    "answer": "Warm black-soil plateau with seasonal rainfall",
    "distractors": [
      "Cold glaciated valley",
      "Permanent tidal marsh",
      "Deeply flooded delta"
    ],
    "explanation": "A warm plateau with black soil and seasonal moisture closely matches the classic Deccan cotton belt. Cold or permanently waterlogged settings are much less suitable.",
    "sourceFactIds": [
      "COTTON-LANDSCAPE-CLUE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-048",
    "qlName": "Cotton black-soil and Deccan association",
    "difficulty": "Hard",
    "stem": "Farm A has deep black soil with seasonal moisture; Farm B is a humid flooded delta. Which farm is more naturally suited to rain-fed cotton?",
    "answer": "Farm A",
    "distractors": [
      "Farm B",
      "Both require permanent flooding",
      "Neither can grow cotton"
    ],
    "explanation": "Cotton fits the deep moisture-retentive black soil of Farm A, especially under warm conditions. A continuously flooded delta is more suited to wet crops such as paddy or jute.",
    "sourceFactIds": [
      "COTTON-BLACKSOIL-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-049",
    "qlName": "Cotton regional belts and irrigation",
    "difficulty": "Easy",
    "stem": "Which state is part of India's major western cotton belt?",
    "answer": "Gujarat",
    "distractors": [
      "Sikkim",
      "Mizoram only",
      "Arunachal Pradesh only"
    ],
    "explanation": "Gujarat is a major cotton-growing state in western India, with warm conditions and extensive suitable soils. It forms part of the wider western and central cotton belt.",
    "sourceFactIds": [
      "COTTON-GUJARAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-049",
    "qlName": "Cotton regional belts and irrigation",
    "difficulty": "Easy",
    "stem": "How can cotton be supported in drier northwestern plains?",
    "answer": "Through irrigation",
    "distractors": [
      "By permanent flooding",
      "By snow cover",
      "By removing all water sources"
    ],
    "explanation": "Cotton needs adequate moisture even in relatively dry climates, so irrigation can support it in northwestern plains. Controlled water supply is especially important where rainfall is limited.",
    "sourceFactIds": [
      "COTTON-NW-IRRIGATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-049",
    "qlName": "Cotton regional belts and irrigation",
    "difficulty": "Medium",
    "stem": "Which pair contains two states with irrigated cotton belts in northwestern India?",
    "answer": "Punjab and Haryana",
    "distractors": [
      "Kerala and Goa",
      "Sikkim and Assam",
      "Mizoram and Tripura"
    ],
    "explanation": "Punjab and Haryana have irrigated cotton areas in their warmer plains. Canal and groundwater systems help compensate for lower and variable rainfall.",
    "sourceFactIds": [
      "COTTON-PUNJAB-HARYANA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-049",
    "qlName": "Cotton regional belts and irrigation",
    "difficulty": "Medium",
    "stem": "Which group fits the western-central cotton belt?",
    "answer": "Gujarat, Maharashtra, Madhya Pradesh",
    "distractors": [
      "Sikkim, Arunachal Pradesh, Meghalaya",
      "Kerala, Goa, Tripura only",
      "Jammu and Kashmir, Sikkim, Nagaland"
    ],
    "explanation": "Gujarat, Maharashtra and Madhya Pradesh all contain important cotton areas under warm conditions and suitable soils. Together they form a major western-central cotton zone.",
    "sourceFactIds": [
      "COTTON-WEST-CENTRAL-STATES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-049",
    "qlName": "Cotton regional belts and irrigation",
    "difficulty": "Medium",
    "stem": "What explains cotton cultivation in Punjab despite the region's relatively low rainfall?",
    "answer": "Irrigation supplies the crop's moisture requirement",
    "distractors": [
      "Cotton needs no water",
      "Permanent snow replaces rainfall",
      "Tidal flooding is used"
    ],
    "explanation": "Punjab's cotton belt depends strongly on irrigation because natural rainfall is limited and variable. Controlled water supply allows cotton to grow in the warm plains.",
    "sourceFactIds": [
      "COTTON-PUNJAB-IRRIGATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-049",
    "qlName": "Cotton regional belts and irrigation",
    "difficulty": "Hard",
    "stem": "Region A is a black-soil western plateau; Region B is an irrigated warm northwestern plain. Which statement about cotton is accurate?",
    "answer": "Both regions can support cotton through different moisture settings",
    "distractors": [
      "Cotton can grow only in Region A",
      "Cotton can grow only in Region B",
      "Neither region can support cotton"
    ],
    "explanation": "Black-soil western plateaus provide classic rain-fed cotton conditions, while northwestern plains can support cotton with irrigation. Cotton geography therefore spans more than one physical setting.",
    "sourceFactIds": [
      "COTTON-TWO-BELTS-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-050",
    "qlName": "Jute as golden fibre",
    "difficulty": "Easy",
    "stem": "Jute is commonly known by which name?",
    "answer": "Golden fibre",
    "distractors": [
      "White gold grain",
      "Black cane",
      "Silver millet"
    ],
    "explanation": "Jute is called the golden fibre because of its natural golden-brown colour and commercial value. It is one of India's important bast fibre crops.",
    "sourceFactIds": [
      "JUTE-GOLDEN-FIBRE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-050",
    "qlName": "Jute as golden fibre",
    "difficulty": "Easy",
    "stem": "Jute is grown primarily for which product?",
    "answer": "Bast fibre",
    "distractors": [
      "Cane sugar",
      "Edible grain",
      "Tea leaves"
    ],
    "explanation": "Jute fibre is extracted from the stem and used for packaging, ropes, mats and other products. It is therefore classified as a bast fibre crop.",
    "sourceFactIds": [
      "JUTE-BAST-FIBRE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-050",
    "qlName": "Jute as golden fibre",
    "difficulty": "Medium",
    "stem": "Which product is commonly made from jute?",
    "answer": "Gunny bags",
    "distractors": [
      "Refined sugar",
      "Tea leaves",
      "Wheat flour"
    ],
    "explanation": "Jute fibre is widely used for gunny bags, sacks, ropes, mats and similar products. Its strength makes it useful for packaging and coarse textiles.",
    "sourceFactIds": [
      "JUTE-GUNNY-BAGS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-050",
    "qlName": "Jute as golden fibre",
    "difficulty": "Medium",
    "stem": "Which industry use matches jute most accurately?",
    "answer": "Jute — packaging and fibre industry",
    "distractors": [
      "Jute — sugar mill",
      "Jute — tea factory only",
      "Jute — rice milling only"
    ],
    "explanation": "Jute is processed into fibre products such as sacks, bags, ropes and mats. It is therefore closely connected with packaging and fibre-processing industries.",
    "sourceFactIds": [
      "JUTE-INDUSTRY-LINK"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-050",
    "qlName": "Jute as golden fibre",
    "difficulty": "Medium",
    "stem": "Which feature separates jute from cotton?",
    "answer": "Jute fibre comes from the stem rather than the seed boll",
    "distractors": [
      "Jute is a sugar crop",
      "Cotton is a beverage crop",
      "Both fibres come from cane"
    ],
    "explanation": "Jute is a bast fibre extracted from the stem, whereas cotton fibres develop around seeds inside bolls. The source of the fibre differs between the two crops.",
    "sourceFactIds": [
      "JUTE-COTTON-FIBRE-SOURCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-050",
    "qlName": "Jute as golden fibre",
    "difficulty": "Medium",
    "stem": "A crop is called golden fibre, its stem is processed for bast fibre and it is used in sacks and ropes. Which crop is it?",
    "answer": "Jute",
    "distractors": [
      "Cotton",
      "Sugarcane",
      "Mustard"
    ],
    "explanation": "The golden-fibre name, stem-based bast fibre and packaging uses together identify jute. Cotton fibre comes from bolls, while sugarcane and mustard belong to other crop groups.",
    "sourceFactIds": [
      "JUTE-GOLDEN-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-051",
    "qlName": "Jute climate requirements",
    "difficulty": "Easy",
    "stem": "Which climate is favourable for jute cultivation?",
    "answer": "Warm and humid climate with abundant rainfall",
    "distractors": [
      "Cold dry desert climate",
      "Permanent frost",
      "Polar conditions"
    ],
    "explanation": "Jute needs high temperature, abundant moisture and humidity during growth. These conditions occur widely in the eastern and northeastern floodplain belt.",
    "sourceFactIds": [
      "JUTE-WARM-HUMID"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-051",
    "qlName": "Jute climate requirements",
    "difficulty": "Easy",
    "stem": "Which water condition supports jute better than dry arid weather?",
    "answer": "High seasonal rainfall",
    "distractors": [
      "Permanent drought",
      "No soil moisture",
      "Snowfall only"
    ],
    "explanation": "Jute grows best where rainfall and humidity are high during the growing season. Dry arid conditions do not supply the moisture the crop requires.",
    "sourceFactIds": [
      "JUTE-HIGH-RAINFALL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-051",
    "qlName": "Jute climate requirements",
    "difficulty": "Medium",
    "stem": "Why is jute strongly linked with humid eastern India?",
    "answer": "The crop needs high temperature and abundant moisture",
    "distractors": [
      "It requires winter frost",
      "It grows only on dry dunes",
      "It needs permanent snow"
    ],
    "explanation": "Eastern India provides a warm humid monsoon climate and plentiful water, which suit jute growth. The crop is poorly adapted to cold or arid environments.",
    "sourceFactIds": [
      "JUTE-EASTERN-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-051",
    "qlName": "Jute climate requirements",
    "difficulty": "Medium",
    "stem": "Which climate pattern is least suitable for jute?",
    "answer": "Hot but very dry climate without irrigation",
    "distractors": [
      "Warm humid monsoon climate",
      "Rain-rich floodplain climate",
      "Humid river-delta environment"
    ],
    "explanation": "Jute has high moisture and humidity requirements, so a very dry climate is unsuitable unless substantial water is available. Warm humid conditions are much more favourable.",
    "sourceFactIds": [
      "JUTE-DRY-UNSUITABLE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-051",
    "qlName": "Jute climate requirements",
    "difficulty": "Medium",
    "stem": "Which crop needs a wetter growing environment: jute or cotton?",
    "answer": "Jute",
    "distractors": [
      "Cotton always needs more water",
      "Both require permanent flooding",
      "Neither needs rainfall"
    ],
    "explanation": "Jute is strongly linked with humid high-rainfall floodplains, while cotton is better suited to moderate moisture with good drainage. Jute therefore needs the wetter environment.",
    "sourceFactIds": [
      "JUTE-COTTON-WATER-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-051",
    "qlName": "Jute climate requirements",
    "difficulty": "Hard",
    "stem": "Region A is warm, humid and rain-rich; Region B is warm but semi-arid. Which fibre crop is more naturally suited to Region A?",
    "answer": "Jute",
    "distractors": [
      "Cotton",
      "Wool",
      "Flax only"
    ],
    "explanation": "Jute needs abundant rainfall and humidity, making Region A favourable. Cotton can perform better in the drier warm conditions of Region B with suitable soil or irrigation.",
    "sourceFactIds": [
      "JUTE-CLIMATE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-052",
    "qlName": "Jute alluvial soils and retting",
    "difficulty": "Easy",
    "stem": "Which soil setting is especially favourable for jute?",
    "answer": "Fertile alluvial floodplain soil",
    "distractors": [
      "Bare rock",
      "Glacial ice",
      "Arid dune without water"
    ],
    "explanation": "Jute thrives on fertile alluvial soils of river floodplains, where fresh sediment can renew soil fertility. These areas also provide abundant moisture.",
    "sourceFactIds": [
      "JUTE-ALLUVIAL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-052",
    "qlName": "Jute alluvial soils and retting",
    "difficulty": "Easy",
    "stem": "What is retting in jute processing?",
    "answer": "Soaking harvested stems so fibre can be separated",
    "distractors": [
      "Dry grinding cane for sugar",
      "Picking cotton bolls",
      "Roasting oilseeds"
    ],
    "explanation": "Retting involves soaking jute stems in water so plant tissues soften and fibres can be separated. Access to suitable water is therefore important after harvest.",
    "sourceFactIds": [
      "JUTE-RETTING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-052",
    "qlName": "Jute alluvial soils and retting",
    "difficulty": "Medium",
    "stem": "Why are floodplains useful for jute beyond supplying moisture?",
    "answer": "Floods can renew fertile alluvial soil",
    "distractors": [
      "Floods create permanent frost",
      "Floodplains contain no soil",
      "They eliminate all humidity"
    ],
    "explanation": "River floodplains receive fresh alluvial deposits that can renew soil fertility, supporting jute growth. They also provide the warm humid and water-rich environment the crop needs.",
    "sourceFactIds": [
      "JUTE-FLOODPLAIN-RENEWAL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-052",
    "qlName": "Jute alluvial soils and retting",
    "difficulty": "Medium",
    "stem": "Which post-harvest resource is especially important for traditional jute fibre extraction?",
    "answer": "Clean or slow-moving water for retting",
    "distractors": [
      "Snowfields",
      "Dry desert wind only",
      "Permanent frost"
    ],
    "explanation": "Jute stems are retted in water so fibres can be loosened and separated from woody tissue. Suitable water bodies therefore support the post-harvest process.",
    "sourceFactIds": [
      "JUTE-RETTING-WATER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-052",
    "qlName": "Jute alluvial soils and retting",
    "difficulty": "Medium",
    "stem": "Which landscape combines both growing and processing advantages for jute?",
    "answer": "Humid river floodplain with abundant water",
    "distractors": [
      "Dry rocky plateau without water",
      "High glacial ridge",
      "Arid dune field"
    ],
    "explanation": "A humid river floodplain provides fertile alluvial soil and moisture for growth, along with water needed for retting. The other settings lack one or both requirements.",
    "sourceFactIds": [
      "JUTE-LANDSCAPE-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-052",
    "qlName": "Jute alluvial soils and retting",
    "difficulty": "Hard",
    "stem": "Farm A has fertile new alluvium beside slow-moving water; Farm B is a dry plateau without surface water. Which farm is more suitable for jute from crop to fibre processing?",
    "answer": "Farm A",
    "distractors": [
      "Farm B",
      "Both are identical",
      "Neither can produce jute"
    ],
    "explanation": "Farm A supplies fertile alluvial soil, humid moisture and nearby water for retting. Farm B lacks both the wet growing environment and post-harvest water resource.",
    "sourceFactIds": [
      "JUTE-FARM-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-053",
    "qlName": "Jute regional belt",
    "difficulty": "Easy",
    "stem": "Which state is strongly linked with jute cultivation?",
    "answer": "West Bengal",
    "distractors": [
      "Rajasthan only",
      "Punjab only",
      "Gujarat only"
    ],
    "explanation": "West Bengal lies in the humid lower Ganga-Brahmaputra deltaic region and has a long-established jute belt. Warm wet conditions and alluvial soils favour the crop.",
    "sourceFactIds": [
      "JUTE-WEST-BENGAL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-053",
    "qlName": "Jute regional belt",
    "difficulty": "Easy",
    "stem": "Which region forms India's principal jute belt?",
    "answer": "Eastern river plains and deltaic belt",
    "distractors": [
      "Western arid desert",
      "High Himalayan snowfields",
      "Deccan dry plateau only"
    ],
    "explanation": "Jute is concentrated in humid eastern river plains and deltaic regions where alluvial soils and abundant water are available. This setting matches the crop's climatic needs.",
    "sourceFactIds": [
      "JUTE-EASTERN-BELT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-053",
    "qlName": "Jute regional belt",
    "difficulty": "Medium",
    "stem": "Which group contains states with well-known jute-growing areas?",
    "answer": "West Bengal, Bihar, Assam",
    "distractors": [
      "Rajasthan, Punjab, Haryana only",
      "Gujarat, Goa, Himachal Pradesh",
      "Sikkim, Ladakh, Rajasthan"
    ],
    "explanation": "West Bengal, Bihar and Assam all contain warm humid riverine areas suitable for jute. The eastern concentration reflects rainfall, alluvial soil and water availability.",
    "sourceFactIds": [
      "JUTE-STATES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-053",
    "qlName": "Jute regional belt",
    "difficulty": "Medium",
    "stem": "Why is the lower Ganga plain favourable for jute?",
    "answer": "It combines humid monsoon weather, fertile alluvium and abundant water",
    "distractors": [
      "It is permanently frozen",
      "It is an arid dune field",
      "It has no rivers"
    ],
    "explanation": "The lower Ganga plain offers warm humid conditions, fresh alluvial soils and plentiful water. These features support both jute growth and retting after harvest.",
    "sourceFactIds": [
      "JUTE-LOWER-GANGA-REASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-053",
    "qlName": "Jute regional belt",
    "difficulty": "Medium",
    "stem": "Which crop is the strongest match for a humid alluvial floodplain in West Bengal?",
    "answer": "Jute",
    "distractors": [
      "Bajra",
      "Mustard",
      "Ragi"
    ],
    "explanation": "Jute thrives in humid alluvial floodplains and West Bengal is a classic jute region. Bajra and ragi are drier-land crops, while mustard is a rabi oilseed.",
    "sourceFactIds": [
      "JUTE-WB-MAP-CLUE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-053",
    "qlName": "Jute regional belt",
    "difficulty": "Medium",
    "stem": "Region A is a humid delta in eastern India; Region B is a dry black-soil plateau. Which fibre crops fit A and B respectively?",
    "answer": "Jute and cotton",
    "distractors": [
      "Cotton and jute",
      "Jute and jute",
      "Cotton and cotton only"
    ],
    "explanation": "The humid eastern delta fits jute, while the dry black-soil plateau fits cotton. Their contrasting fibre-crop geographies make this a classic regional comparison.",
    "sourceFactIds": [
      "JUTE-COTTON-REGION-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-054",
    "qlName": "Cotton–jute integrated fibre reasoning",
    "difficulty": "Easy",
    "stem": "Which comparison of cotton and jute is accurate?",
    "answer": "Cotton fibre comes from bolls; jute fibre comes from stems",
    "distractors": [
      "Both fibres come from cane",
      "Cotton is a sugar crop and jute a cereal",
      "Both are beverage crops"
    ],
    "explanation": "Cotton fibres develop around seeds inside bolls, while jute is a bast fibre extracted from stems. The crops therefore differ in the plant part supplying fibre.",
    "sourceFactIds": [
      "FIBRE-COTTON-JUTE-SOURCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-054",
    "qlName": "Cotton–jute integrated fibre reasoning",
    "difficulty": "Easy",
    "stem": "Which climate comparison is accurate?",
    "answer": "Cotton suits warm moderate-moisture conditions; jute needs warmer wetter humidity",
    "distractors": [
      "Cotton needs permanent flooding; jute needs desert drought",
      "Both need snow cover",
      "Both are rabi frost crops"
    ],
    "explanation": "Cotton performs well with warmth, moderate moisture and good drainage, while jute requires abundant rainfall and humidity. Their water regimes differ clearly.",
    "sourceFactIds": [
      "FIBRE-CLIMATE-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-054",
    "qlName": "Cotton–jute integrated fibre reasoning",
    "difficulty": "Medium",
    "stem": "Which soil pairing is accurate?",
    "answer": "Cotton — black soil; jute — fresh alluvial floodplain soil",
    "distractors": [
      "Cotton — glacial ice; jute — desert sand",
      "Cotton — tidal marsh only; jute — black plateau only",
      "Both — permanent swamp only"
    ],
    "explanation": "Black soils of the Deccan are strongly linked with cotton, while jute thrives on fertile alluvial floodplains. The two fibre crops therefore occupy contrasting soil regions.",
    "sourceFactIds": [
      "FIBRE-SOIL-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-054",
    "qlName": "Cotton–jute integrated fibre reasoning",
    "difficulty": "Medium",
    "stem": "Which regional pairing is accurate?",
    "answer": "Cotton — western/central plateau and irrigated northwest; jute — humid eastern floodplain belt",
    "distractors": [
      "Cotton — humid delta only; jute — western desert",
      "Both restricted to Himalayan snowfields",
      "Both restricted to coral islands"
    ],
    "explanation": "Cotton has major belts in western-central India and irrigated northwestern plains. Jute is concentrated in humid eastern river plains and deltas.",
    "sourceFactIds": [
      "FIBRE-REGION-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-054",
    "qlName": "Cotton–jute integrated fibre reasoning",
    "difficulty": "Medium",
    "stem": "Which processing clue points to jute rather than cotton?",
    "answer": "Retting stems in water before fibre separation",
    "distractors": [
      "Picking fibre from opened bolls",
      "Ginning seed cotton",
      "Removing cottonseed from lint"
    ],
    "explanation": "Retting is a distinctive jute process in which stems are soaked before fibre extraction. Cotton fibre is instead collected from bolls and later ginned.",
    "sourceFactIds": [
      "FIBRE-PROCESSING-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-054",
    "qlName": "Cotton–jute integrated fibre reasoning",
    "difficulty": "Medium",
    "stem": "Which statement best summarises the geography of India's two major fibre crops?",
    "answer": "Cotton favours warmer drier well-drained regions, while jute favours humid alluvial floodplains",
    "distractors": [
      "Both require identical flooded fields",
      "Both are cool-season snow crops",
      "Jute is the dryland crop and cotton the floodplain crop"
    ],
    "explanation": "Cotton fits warm well-drained regions, especially black-soil areas. Jute needs humid alluvial floodplains with abundant water, so the two fibre crops occupy contrasting environments.",
    "sourceFactIds": [
      "FIBRE-INTEGRATED-SUMMARY"
    ]
  }
]);

export const GEO_AGR_001_CP002_COTTON_JUTE_SEGMENT_V1: readonly GeoAgr001Question[] = Object.freeze(
  RAW.map((raw, index) => Object.freeze({
    questionId: `GEO-AGR-001-CP002-FIB-Q${String(index + 1).padStart(3, "0")}`,
    qlId: raw.qlId, qlName: raw.qlName, difficulty: raw.difficulty, stem: raw.stem,
    options: placeGeoAgrOptions(raw.answer, raw.distractors, index % 4),
    correctIndex: index % 4, canonicalAnswer: raw.answer, explanation: raw.explanation,
    sourceIds: GEO_AGR_001_SOURCE_IDS, sourceFactIds: Object.freeze([...raw.sourceFactIds]),
    reviewOnly: true as const, runtimeRegistered: false as const,
  })),
);

export function auditGeoAgr001Cp002CottonJuteSegmentV1() {
  return auditGeoAgr001Batch(GEO_AGR_001_CP002_COTTON_JUTE_SEGMENT_V1, 46, 54);
}
