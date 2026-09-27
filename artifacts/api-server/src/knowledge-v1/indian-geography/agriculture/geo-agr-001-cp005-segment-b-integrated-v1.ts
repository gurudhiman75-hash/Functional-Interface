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
    "qlId": "GEO-AGR-001-QL-100",
    "qlName": "Statement sets on seasons and crop groups",
    "difficulty": "Easy",
    "stem": "Consider the following statements: 1. Rice is generally a kharif crop. 2. Wheat is generally a rabi crop. Which of the above are correct?",
    "answer": "Both 1 and 2",
    "distractors": [
      "1 only",
      "2 only",
      "Neither 1 nor 2"
    ],
    "explanation": "Rice is commonly sown with monsoon onset and belongs to kharif, while wheat is sown in the cool post-monsoon period and belongs to rabi. Both statements follow the standard Indian crop calendar.",
    "sourceFactIds": [
      "INTEGRATED-SEASONS-RICE-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-100",
    "qlName": "Statement sets on seasons and crop groups",
    "difficulty": "Easy",
    "stem": "Consider the following statements: 1. Watermelon can be grown in the zaid season. 2. Mustard is commonly a rabi crop. Which of the above are correct?",
    "answer": "Both 1 and 2",
    "distractors": [
      "1 only",
      "2 only",
      "Neither 1 nor 2"
    ],
    "explanation": "Watermelon is a common short-duration summer crop of the zaid interval, while mustard is an important winter oilseed of the rabi season. Both statements are accurate.",
    "sourceFactIds": [
      "INTEGRATED-SEASONS-ZAID-MUSTARD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-100",
    "qlName": "Statement sets on seasons and crop groups",
    "difficulty": "Medium",
    "stem": "Consider the following statements: 1. Cotton is commonly kharif. 2. Gram is commonly rabi. 3. Tea is a seasonal cereal crop. Which statements are correct?",
    "answer": "1 and 2 only",
    "distractors": [
      "1 and 3 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    "explanation": "Cotton is generally a kharif fibre crop and gram is a rabi pulse. Tea is a perennial plantation beverage crop, not a seasonal cereal.",
    "sourceFactIds": [
      "INTEGRATED-SEASONS-COTTON-GRAM-TEA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-100",
    "qlName": "Statement sets on seasons and crop groups",
    "difficulty": "Medium",
    "stem": "Consider the following statements: 1. Soybean is commonly kharif. 2. Mustard is commonly rabi. 3. Cucumber can be a zaid crop. Which statements are correct?",
    "answer": "1, 2 and 3",
    "distractors": [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only"
    ],
    "explanation": "Soybean is a kharif oilseed, mustard a rabi oilseed and cucumber a common zaid summer crop. The three crops therefore illustrate all three major seasonal windows.",
    "sourceFactIds": [
      "INTEGRATED-SEASONS-THREE-WINDOWS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-100",
    "qlName": "Statement sets on seasons and crop groups",
    "difficulty": "Medium",
    "stem": "Which set contains one kharif crop, one rabi crop and one zaid crop in that order?",
    "answer": "Rice, wheat, watermelon",
    "distractors": [
      "Wheat, rice, mustard",
      "Mustard, gram, rice",
      "Watermelon, cotton, wheat"
    ],
    "explanation": "Rice is typically kharif, wheat is rabi and watermelon can be grown in the short zaid summer season. The order therefore moves through the three seasonal categories correctly.",
    "sourceFactIds": [
      "INTEGRATED-SEASON-ORDER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-100",
    "qlName": "Statement sets on seasons and crop groups",
    "difficulty": "Hard",
    "stem": "A farmer plans three successive crops: a winter pulse, a short summer melon and a monsoon cereal. Which sequence fits the Indian crop calendar?",
    "answer": "Gram → watermelon → rice",
    "distractors": [
      "Rice → gram → watermelon",
      "Watermelon → wheat → rice",
      "Cotton → mustard → gram"
    ],
    "explanation": "Gram fits the rabi winter season, watermelon the zaid summer interval and rice the kharif monsoon season. The sequence follows the agricultural calendar from winter through summer into the monsoon.",
    "sourceFactIds": [
      "INTEGRATED-SEASON-SEQUENCE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-101",
    "qlName": "Statement sets on rice, wheat and millets",
    "difficulty": "Easy",
    "stem": "Consider the following statements: 1. Rice generally needs more water than wheat. 2. Bajra tolerates drier conditions than rice. Which of the above are correct?",
    "answer": "Both 1 and 2",
    "distractors": [
      "1 only",
      "2 only",
      "Neither 1 nor 2"
    ],
    "explanation": "Rice has a high moisture requirement, while wheat needs moderate water and bajra is adapted to dryland conditions. Both comparisons are therefore accurate.",
    "sourceFactIds": [
      "INTEGRATED-RICE-WHEAT-BAJRA-WATER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-101",
    "qlName": "Statement sets on rice, wheat and millets",
    "difficulty": "Easy",
    "stem": "Consider the following statements: 1. Ragi is finger millet. 2. Bajra is pearl millet. Which of the above are correct?",
    "answer": "Both 1 and 2",
    "distractors": [
      "1 only",
      "2 only",
      "Neither 1 nor 2"
    ],
    "explanation": "Ragi is the common Indian name for finger millet, while bajra is pearl millet. Both are hardy cereals important in dryland and upland farming.",
    "sourceFactIds": [
      "INTEGRATED-MILLET-NAMES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-101",
    "qlName": "Statement sets on rice, wheat and millets",
    "difficulty": "Medium",
    "stem": "Consider the following statements: 1. Wheat favours cool-season growth. 2. Rice is strongly linked with warm wet conditions. 3. Bajra requires permanent flooding. Which statements are correct?",
    "answer": "1 and 2 only",
    "distractors": [
      "1 and 3 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    "explanation": "Wheat fits cool rabi conditions and rice needs warmth with abundant moisture. Bajra is a drought-tolerant millet and does not require permanent flooding.",
    "sourceFactIds": [
      "INTEGRATED-CEREAL-CLIMATE-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-101",
    "qlName": "Statement sets on rice, wheat and millets",
    "difficulty": "Medium",
    "stem": "Which crop–region set fits rice, wheat and bajra accurately?",
    "answer": "Rice—humid delta; wheat—irrigated cool plain; bajra—dry sandy region",
    "distractors": [
      "Rice—dry dune; wheat—humid delta; bajra—flooded plain",
      "Rice—cold desert; wheat—tidal marsh; bajra—snowfield",
      "Rice—temperate orchard; wheat—tropical swamp; bajra—glacier"
    ],
    "explanation": "Rice suits warm wet deltas, wheat irrigated cool-season plains and bajra dry sandy regions. The three environments reflect their contrasting water and temperature requirements.",
    "sourceFactIds": [
      "INTEGRATED-CEREAL-REGION-MATCH"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-101",
    "qlName": "Statement sets on rice, wheat and millets",
    "difficulty": "Medium",
    "stem": "A map shows Zone A as a monsoon-fed delta and Zone B as an irrigated northwestern winter-crop plain. Which crop pair fits A and B?",
    "answer": "Rice and wheat",
    "distractors": [
      "Wheat and rice",
      "Bajra and jute",
      "Mustard and rubber"
    ],
    "explanation": "The monsoon-fed delta strongly points to rice, while the irrigated northwestern rabi plain is a classic wheat zone. The physical and seasonal clues determine the pair.",
    "sourceFactIds": [
      "INTEGRATED-CEREAL-MAP-PAIR"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-101",
    "qlName": "Statement sets on rice, wheat and millets",
    "difficulty": "Hard",
    "stem": "Consider the following statements: 1. Irrigation can extend rice into lower-rainfall regions. 2. Wheat can use irrigation where winter rainfall is low. 3. Bajra depends on standing water. Which statements are correct?",
    "answer": "1 and 2 only",
    "distractors": [
      "1 and 3 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    "explanation": "Irrigation can support both rice and wheat beyond the limits of natural rainfall. Bajra is adapted to comparatively dry conditions and does not depend on standing water.",
    "sourceFactIds": [
      "INTEGRATED-CEREAL-IRRIGATION-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-102",
    "qlName": "Statement sets on oilseeds, sugarcane and fibre crops",
    "difficulty": "Easy",
    "stem": "Consider the following statements: 1. Mustard is an oilseed. 2. Cotton is a fibre crop. Which of the above are correct?",
    "answer": "Both 1 and 2",
    "distractors": [
      "1 only",
      "2 only",
      "Neither 1 nor 2"
    ],
    "explanation": "Mustard is grown for oil-rich seeds, while cotton is cultivated for natural fibre used by the textile industry. Both crop classifications are accurate.",
    "sourceFactIds": [
      "INTEGRATED-OILSEED-FIBRE-BASICS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-102",
    "qlName": "Statement sets on oilseeds, sugarcane and fibre crops",
    "difficulty": "Easy",
    "stem": "Consider the following statements: 1. Sugarcane is a long-duration commercial crop. 2. Jute is known as golden fibre. Which of the above are correct?",
    "answer": "Both 1 and 2",
    "distractors": [
      "1 only",
      "2 only",
      "Neither 1 nor 2"
    ],
    "explanation": "Sugarcane occupies the field for many months and is grown commercially for sugar, while jute is widely called golden fibre. Both statements are standard agricultural facts.",
    "sourceFactIds": [
      "INTEGRATED-SUGARCANE-JUTE-BASICS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-102",
    "qlName": "Statement sets on oilseeds, sugarcane and fibre crops",
    "difficulty": "Medium",
    "stem": "Consider the following statements: 1. Groundnut prefers good drainage. 2. Sugarcane needs dependable moisture. 3. Jute is suited to arid sandy plains. Which statements are correct?",
    "answer": "1 and 2 only",
    "distractors": [
      "1 and 3 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    "explanation": "Groundnut needs loose well-drained soil and sugarcane requires reliable moisture through a long growing period. Jute instead favours humid alluvial floodplains, not arid sandy regions.",
    "sourceFactIds": [
      "INTEGRATED-COMMERCIAL-CONDITIONS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-102",
    "qlName": "Statement sets on oilseeds, sugarcane and fibre crops",
    "difficulty": "Medium",
    "stem": "Which regional set fits soybean, cotton and jute accurately?",
    "answer": "Soybean—central plateau; cotton—black-soil belt; jute—humid eastern floodplain",
    "distractors": [
      "Soybean—snowfield; cotton—tidal marsh; jute—desert",
      "Soybean—humid delta; cotton—glacier; jute—dry plateau",
      "Soybean—temperate orchard; cotton—mangrove; jute—cold desert"
    ],
    "explanation": "Soybean is strongly linked with central India, cotton with black-soil western-central regions and jute with humid eastern alluvial plains. The geographic pattern is distinct for each crop.",
    "sourceFactIds": [
      "INTEGRATED-COMMERCIAL-REGION-MATCH"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-102",
    "qlName": "Statement sets on oilseeds, sugarcane and fibre crops",
    "difficulty": "Medium",
    "stem": "Which crop-processing sequence is accurate?",
    "answer": "Sugarcane—crushing; jute—retting; cotton—ginning",
    "distractors": [
      "Sugarcane—retting; jute—ginning; cotton—crushing",
      "Sugarcane—ginning; jute—crushing; cotton—retting",
      "Sugarcane—plucking; jute—tapping; cotton—roasting"
    ],
    "explanation": "Sugarcane stalks are crushed for juice, jute stems are retted before fibre separation and cotton is ginned to separate lint from seed. The processes correspond to different raw materials.",
    "sourceFactIds": [
      "INTEGRATED-PROCESSING-SUGARCANE-JUTE-COTTON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-102",
    "qlName": "Statement sets on oilseeds, sugarcane and fibre crops",
    "difficulty": "Hard",
    "stem": "A region has black soil and warm kharif weather; another has humid new alluvium and retting water; a third has long warm irrigation and a nearby mill. Which crops fit the three regions?",
    "answer": "Cotton, jute, sugarcane",
    "distractors": [
      "Jute, cotton, mustard",
      "Sugarcane, soybean, tea",
      "Mustard, rice, cotton"
    ],
    "explanation": "Black soil and warm kharif weather point to cotton, humid alluvium with retting water to jute and long warm irrigated fields near a mill to sugarcane. The three clues identify the commercial crops in order.",
    "sourceFactIds": [
      "INTEGRATED-COMMERCIAL-THREE-REGION-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-103",
    "qlName": "Statement sets on plantation and horticulture crops",
    "difficulty": "Easy",
    "stem": "Consider the following statements: 1. Tea is harvested for tender leaves. 2. Rubber is harvested for latex. Which of the above are correct?",
    "answer": "Both 1 and 2",
    "distractors": [
      "1 only",
      "2 only",
      "Neither 1 nor 2"
    ],
    "explanation": "Tea production depends on plucking tender leaves and shoots, while rubber is tapped for latex beneath the bark. Both statements describe their harvested products accurately.",
    "sourceFactIds": [
      "INTEGRATED-PLANTATION-HARVEST-BASICS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-103",
    "qlName": "Statement sets on plantation and horticulture crops",
    "difficulty": "Easy",
    "stem": "Consider the following statements: 1. Apple suits cool temperate hills. 2. Coconut suits warm humid coasts. Which of the above are correct?",
    "answer": "Both 1 and 2",
    "distractors": [
      "1 only",
      "2 only",
      "Neither 1 nor 2"
    ],
    "explanation": "Apple needs cooler hill conditions and winter chilling, while coconut is a tropical palm of warm humid frost-free regions. The two crops occupy contrasting horticultural climates.",
    "sourceFactIds": [
      "INTEGRATED-HORTICULTURE-APPLE-COCONUT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-103",
    "qlName": "Statement sets on plantation and horticulture crops",
    "difficulty": "Medium",
    "stem": "Consider the following statements: 1. Coffee is commonly grown under shade. 2. Cardamom favours humid shaded hills. 3. Rubber needs frequent frost. Which statements are correct?",
    "answer": "1 and 2 only",
    "distractors": [
      "1 and 3 only",
      "2 and 3 only",
      "1, 2 and 3"
    ],
    "explanation": "Coffee often uses shade trees and cardamom thrives in humid shaded hill environments. Rubber is a tropical crop that needs frost-free warmth rather than frequent frost.",
    "sourceFactIds": [
      "INTEGRATED-PLANTATION-SHADE-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-103",
    "qlName": "Statement sets on plantation and horticulture crops",
    "difficulty": "Medium",
    "stem": "Which state–plantation set is accurate for tea, coffee and rubber?",
    "answer": "Tea—Assam; coffee—Karnataka; rubber—Kerala",
    "distractors": [
      "Tea—Rajasthan; coffee—Punjab; rubber—Haryana",
      "Tea—Ladakh; coffee—Thar Desert; rubber—Punjab",
      "Tea—Kutch; coffee—Haryana; rubber—Ladakh"
    ],
    "explanation": "Assam is a classic tea region, Karnataka a major coffee state and Kerala a long-established rubber belt. Their climates and plantation histories support these matches.",
    "sourceFactIds": [
      "INTEGRATED-PLANTATION-STATE-MATCH"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-103",
    "qlName": "Statement sets on plantation and horticulture crops",
    "difficulty": "Medium",
    "stem": "Which sequence matches crop and field clue?",
    "answer": "Tea—leaf plucking; coffee—shade canopy; rubber—latex tapping",
    "distractors": [
      "Tea—ginning; coffee—retting; rubber—cane crushing",
      "Tea—latex tapping; coffee—boll picking; rubber—leaf plucking",
      "Tea—pod digging; coffee—grain threshing; rubber—retting"
    ],
    "explanation": "Tea is repeatedly plucked for leaves, coffee is commonly grown under shade and rubber is tapped for latex. The field operations distinguish the three plantation crops.",
    "sourceFactIds": [
      "INTEGRATED-PLANTATION-FIELD-CLUES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-103",
    "qlName": "Statement sets on plantation and horticulture crops",
    "difficulty": "Hard",
    "stem": "A map marks a humid Brahmaputra valley, a shaded southern upland and a hot wet Kerala plantation belt. Which crops fit the three areas?",
    "answer": "Tea, coffee, rubber",
    "distractors": [
      "Coffee, tea, wheat",
      "Rubber, jute, mustard",
      "Wheat, cotton, tea"
    ],
    "explanation": "The Brahmaputra valley is a classic tea setting, shaded southern uplands strongly indicate coffee and hot wet Kerala conditions favour rubber. The three plantation regions therefore map to tea, coffee and rubber.",
    "sourceFactIds": [
      "INTEGRATED-PLANTATION-MAP-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-104",
    "qlName": "Irrigation source and terrain matching",
    "difficulty": "Easy",
    "stem": "Which irrigation source is most directly linked with groundwater?",
    "answer": "Tube-well",
    "distractors": [
      "Canal",
      "Tank",
      "Rain-fed field"
    ],
    "explanation": "A tube-well pumps water from an underground aquifer, making it a groundwater irrigation source. Canals and tanks use surface-water diversion or storage.",
    "sourceFactIds": [
      "INTEGRATED-IRRIGATION-GROUNDWATER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-104",
    "qlName": "Irrigation source and terrain matching",
    "difficulty": "Easy",
    "stem": "Which irrigation source is well suited to local runoff stored in plateau depressions?",
    "answer": "Tank",
    "distractors": [
      "Ocean tide",
      "Glacier on the field",
      "Only deep tube-well"
    ],
    "explanation": "Tanks store local runoff in natural or constructed depressions and are common in many peninsular plateau settings. Their supply is surface water rather than groundwater pumping.",
    "sourceFactIds": [
      "INTEGRATED-IRRIGATION-TANK-PLATEAU"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-104",
    "qlName": "Irrigation source and terrain matching",
    "difficulty": "Medium",
    "stem": "Which irrigation source–terrain set is accurate?",
    "answer": "Canal—level plain; tube-well—alluvial aquifer; tank—undulating plateau",
    "distractors": [
      "Canal—glacial summit; tube-well—ocean; tank—deep sea",
      "Canal—steep cliff; tube-well—no groundwater; tank—snowfield",
      "Canal—coral reef; tube-well—tidal current; tank—desert without runoff"
    ],
    "explanation": "Canals work efficiently across gentle plains, tube-wells tap aquifers and tanks store runoff in local depressions. The three systems therefore fit different physical settings.",
    "sourceFactIds": [
      "INTEGRATED-IRRIGATION-TERRAIN-MATCH"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-104",
    "qlName": "Irrigation source and terrain matching",
    "difficulty": "Medium",
    "stem": "Consider the following statements: 1. Canal irrigation suits level plains. 2. Tube-wells require usable groundwater. 3. Tanks can store seasonal runoff. Which statements are correct?",
    "answer": "1, 2 and 3",
    "distractors": [
      "1 and 2 only",
      "2 and 3 only",
      "1 and 3 only"
    ],
    "explanation": "Each statement captures a basic physical requirement of the irrigation source. Relief, groundwater availability and runoff storage help determine where each system works well.",
    "sourceFactIds": [
      "INTEGRATED-IRRIGATION-THREE-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-104",
    "qlName": "Irrigation source and terrain matching",
    "difficulty": "Medium",
    "stem": "Which problem is more closely linked with excessive canal irrigation than with lack of water?",
    "answer": "Waterlogging and salinity",
    "distractors": [
      "Drought from zero irrigation",
      "No soil moisture at all",
      "Permanent frost"
    ],
    "explanation": "Excess canal water combined with poor drainage can raise the water table and concentrate salts near the surface. These problems come from too much poorly managed water rather than shortage.",
    "sourceFactIds": [
      "INTEGRATED-IRRIGATION-CANAL-PROBLEM"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-104",
    "qlName": "Irrigation source and terrain matching",
    "difficulty": "Hard",
    "stem": "Region A is a flat river plain, Region B has a shallow alluvial aquifer, and Region C is an undulating hard-rock plateau with runoff hollows. Which irrigation sources fit A, B and C?",
    "answer": "Canal, tube-well, tank",
    "distractors": [
      "Tank, canal, tube-well",
      "Tube-well, tank, canal",
      "Canal, tank, ocean tide"
    ],
    "explanation": "Flat plains favour canal distribution, shallow aquifers favour tube-wells and runoff-filled plateau depressions favour tanks. The physical geography determines the sequence.",
    "sourceFactIds": [
      "INTEGRATED-IRRIGATION-THREE-REGION-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-105",
    "qlName": "Green Revolution cause–effect and regional matching",
    "difficulty": "Easy",
    "stem": "Which combination is central to Green Revolution agriculture?",
    "answer": "HYV seed, irrigation and fertilisers",
    "distractors": [
      "Only shifting cultivation",
      "Only forest clearing",
      "Only rain-fed fallow"
    ],
    "explanation": "High-yielding varieties produced large gains when reliable water and nutrients supported them. The Green Revolution therefore depended on an input package rather than seed alone.",
    "sourceFactIds": [
      "INTEGRATED-GR-PACKAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-105",
    "qlName": "Green Revolution cause–effect and regional matching",
    "difficulty": "Easy",
    "stem": "Which region was an early core of the Green Revolution in India?",
    "answer": "Punjab–Haryana–western Uttar Pradesh",
    "distractors": [
      "Ladakh cold desert",
      "Andaman islands only",
      "Thar Desert without irrigation"
    ],
    "explanation": "The northwestern plains had strong irrigation, fertile alluvial soils and major wheat systems, giving them an early advantage in HYV adoption. They became a core Green Revolution region.",
    "sourceFactIds": [
      "INTEGRATED-GR-NW-CORE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-105",
    "qlName": "Green Revolution cause–effect and regional matching",
    "difficulty": "Medium",
    "stem": "Consider the following statements: 1. HYV seed responds strongly to adequate water and nutrients. 2. Green Revolution adoption was initially even across all regions. Which of the above are correct?",
    "answer": "1 only",
    "distractors": [
      "2 only",
      "Both 1 and 2",
      "Neither 1 nor 2"
    ],
    "explanation": "High-yielding varieties respond strongly when water and nutrients are available, but adoption was uneven because infrastructure and input access differed by region. Only the first statement is correct.",
    "sourceFactIds": [
      "INTEGRATED-GR-ADOPTION-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-105",
    "qlName": "Green Revolution cause–effect and regional matching",
    "difficulty": "Medium",
    "stem": "Which chain is most logical?",
    "answer": "Assured irrigation → HYV adoption → higher yield potential",
    "distractors": [
      "No water → guaranteed high yield",
      "Groundwater decline → unlimited pumping",
      "Waterlogging → better root aeration"
    ],
    "explanation": "Reliable irrigation removes a major production constraint and allows high-yielding varieties to use nutrients effectively. That can increase yield potential when management is adequate.",
    "sourceFactIds": [
      "INTEGRATED-GR-CAUSE-EFFECT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-105",
    "qlName": "Green Revolution cause–effect and regional matching",
    "difficulty": "Medium",
    "stem": "Which outcome can accompany intensive Green Revolution farming if resources are poorly managed?",
    "answer": "Groundwater decline or soil salinity",
    "distractors": [
      "Unlimited groundwater recharge",
      "Elimination of all soil problems",
      "Permanent increase in rainfall"
    ],
    "explanation": "Heavy pumping can lower groundwater levels, while excessive irrigation and poor drainage can contribute to salinity. Productivity gains therefore need careful resource management.",
    "sourceFactIds": [
      "INTEGRATED-GR-RESOURCE-COST"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-105",
    "qlName": "Green Revolution cause–effect and regional matching",
    "difficulty": "Hard",
    "stem": "District A has canals, tube-wells, credit and cereal markets; District B is rain-fed with weak input access. Which district had the stronger early Green Revolution advantage, and why?",
    "answer": "District A, because the supporting input package was available",
    "distractors": [
      "District B, because irrigation reduces HYV response",
      "District A, because climate alone determines adoption",
      "District B, because markets prevent technology use"
    ],
    "explanation": "District A combines dependable water, finance and market access with cereal farming, which strongly favours HYV adoption. District B lacks several complementary inputs needed by the technology package.",
    "sourceFactIds": [
      "INTEGRATED-GR-DISTRICT-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-106",
    "qlName": "Crop–soil–climate match sets",
    "difficulty": "Easy",
    "stem": "Which crop–environment set is accurate for cotton, tea and bajra?",
    "answer": "Cotton—black soil; tea—humid slope; bajra—dry sandy soil",
    "distractors": [
      "Cotton—tidal marsh; tea—desert; bajra—flooded delta",
      "Cotton—snowfield; tea—arid dune; bajra—swamp",
      "Cotton—glacier; tea—salt desert; bajra—waterlogged basin"
    ],
    "explanation": "Cotton fits black-soil regions, tea humid well-drained slopes and bajra dry sandy areas. The three crops occupy sharply different physical environments.",
    "sourceFactIds": [
      "INTEGRATED-CROP-SOIL-CLIMATE-SET1"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-106",
    "qlName": "Crop–soil–climate match sets",
    "difficulty": "Easy",
    "stem": "Which crop–environment set is accurate for rice, apple and coffee?",
    "answer": "Rice—wet plain; apple—cool hill; coffee—shaded upland",
    "distractors": [
      "Rice—dry dune; apple—tropical coast; coffee—snowfield",
      "Rice—cold desert; apple—humid delta; coffee—tidal marsh",
      "Rice—black plateau only; apple—hot coast; coffee—glacier"
    ],
    "explanation": "Rice needs abundant water on suitable plains, apple needs cool temperate hills and coffee favours shaded humid uplands. Each crop is matched with its characteristic environment.",
    "sourceFactIds": [
      "INTEGRATED-CROP-SOIL-CLIMATE-SET2"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-106",
    "qlName": "Crop–soil–climate match sets",
    "difficulty": "Medium",
    "stem": "Which crop–soil–water combination is internally consistent?",
    "answer": "Groundnut—loose well-drained soil—moderate moisture",
    "distractors": [
      "Groundnut—permanent swamp—deep flooding",
      "Jute—dry dune—no water",
      "Rice—bare rock—no irrigation"
    ],
    "explanation": "Groundnut needs loose aerated soil with enough moisture but not prolonged waterlogging. The other combinations directly conflict with the water and soil requirements of the crops.",
    "sourceFactIds": [
      "INTEGRATED-CROP-SOIL-WATER-CONSISTENCY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-106",
    "qlName": "Crop–soil–climate match sets",
    "difficulty": "Medium",
    "stem": "Which crop–climate–region combination is coherent?",
    "answer": "Rubber—hot humid—Kerala",
    "distractors": [
      "Rubber—cold dry—Ladakh",
      "Apple—tropical humid—Kerala coast",
      "Jute—semi-arid—western Rajasthan"
    ],
    "explanation": "Rubber needs hot humid tropical conditions, and Kerala provides a classic plantation environment. The other combinations mismatch the climatic needs of apple and jute.",
    "sourceFactIds": [
      "INTEGRATED-CROP-CLIMATE-REGION-CONSISTENCY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-106",
    "qlName": "Crop–soil–climate match sets",
    "difficulty": "Medium",
    "stem": "Which sequence is coherent from crop to soil or terrain?",
    "answer": "Cotton—black soil; jute—alluvial floodplain; ragi—red upland soil",
    "distractors": [
      "Cotton—mangrove mud; jute—desert sand; ragi—deep swamp",
      "Cotton—snowfield; jute—glacier; ragi—tidal marsh",
      "Cotton—coral reef; jute—bare rock; ragi—ocean beach"
    ],
    "explanation": "Cotton is linked with black soil, jute with humid alluvial floodplains and ragi with red or sandy upland soils. The sequence uses durable crop–terrain relationships.",
    "sourceFactIds": [
      "INTEGRATED-CROP-SOIL-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-106",
    "qlName": "Crop–soil–climate match sets",
    "difficulty": "Medium",
    "stem": "Which crop would be least suitable for a dry sandy field without irrigation?",
    "answer": "Paddy rice",
    "distractors": [
      "Bajra",
      "Sesame",
      "Castor"
    ],
    "explanation": "Paddy rice has a high water requirement and is poorly suited to a dry sandy field without irrigation. Bajra, sesame and castor tolerate comparatively drier conditions.",
    "sourceFactIds": [
      "INTEGRATED-CROP-LEAST-SUITABLE-DRY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-107",
    "qlName": "Map-style regional inference",
    "difficulty": "Easy",
    "stem": "A map highlights the lower Ganga delta and nearby humid floodplains. Which crop is a strong match?",
    "answer": "Jute",
    "distractors": [
      "Bajra",
      "Mustard",
      "Apple"
    ],
    "explanation": "The lower Ganga delta provides humid conditions, fertile alluvial soil and abundant water, which strongly favour jute. The other crops fit drier or cooler settings.",
    "sourceFactIds": [
      "INTEGRATED-MAP-JUTE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-107",
    "qlName": "Map-style regional inference",
    "difficulty": "Easy",
    "stem": "A map highlights the black-soil Deccan belt. Which commercial crop is a strong match?",
    "answer": "Cotton",
    "distractors": [
      "Jute",
      "Tea",
      "Apple"
    ],
    "explanation": "The Deccan black-soil region is a classic cotton environment because of its warm climate and moisture-retentive soils. Jute, tea and apple require different settings.",
    "sourceFactIds": [
      "INTEGRATED-MAP-COTTON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-107",
    "qlName": "Map-style regional inference",
    "difficulty": "Medium",
    "stem": "A map highlights Punjab, Haryana and western Uttar Pradesh under intensive irrigated cereal farming. Which crop system is most characteristic?",
    "answer": "Rice–wheat rotation",
    "distractors": [
      "Tea–coffee plantation",
      "Rubber–coconut plantation",
      "Jute–apple rotation"
    ],
    "explanation": "The irrigated northwestern plains support rice in kharif and wheat in rabi, producing an intensive rice–wheat system. The other crop pairs belong to different environments.",
    "sourceFactIds": [
      "INTEGRATED-MAP-RICE-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-107",
    "qlName": "Map-style regional inference",
    "difficulty": "Medium",
    "stem": "A map highlights Karnataka, Kerala and Tamil Nadu uplands. Which plantation crop is the strongest common match?",
    "answer": "Coffee",
    "distractors": [
      "Wheat",
      "Bajra",
      "Jute"
    ],
    "explanation": "These southern humid uplands form India's classic coffee belt, especially around the Western Ghats. Wheat, bajra and jute belong to different regional settings.",
    "sourceFactIds": [
      "INTEGRATED-MAP-COFFEE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-107",
    "qlName": "Map-style regional inference",
    "difficulty": "Medium",
    "stem": "A map highlights Rajasthan and other dry northwestern rabi areas. Which oilseed is a strong match?",
    "answer": "Mustard",
    "distractors": [
      "Soybean",
      "Groundnut under normal kharif timing",
      "Jute"
    ],
    "explanation": "Mustard is a cool-season rabi oilseed strongly suited to dry northwestern conditions, including Rajasthan. Soybean and groundnut are usually warmer-season crops, while jute needs humid floodplains.",
    "sourceFactIds": [
      "INTEGRATED-MAP-MUSTARD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-107",
    "qlName": "Map-style regional inference",
    "difficulty": "Medium",
    "stem": "A map highlights humid slopes in Assam, Darjeeling and the Nilgiri hills. Which crop links these zones?",
    "answer": "Tea",
    "distractors": [
      "Wheat",
      "Cotton",
      "Bajra"
    ],
    "explanation": "Assam, Darjeeling and the Nilgiri hills are all established tea-growing areas with suitable moisture and temperature conditions. The other crops do not share that plantation geography.",
    "sourceFactIds": [
      "INTEGRATED-MAP-TEA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-108",
    "qlName": "Full-chapter mixed elimination and synthesis",
    "difficulty": "Easy",
    "stem": "Which crop has the strongest combined link with black soil, kharif timing and textile fibre?",
    "answer": "Cotton",
    "distractors": [
      "Jute",
      "Mustard",
      "Wheat"
    ],
    "explanation": "Cotton is a kharif fibre crop strongly linked with black-soil regions and textile manufacturing. Jute uses alluvial floodplains, while mustard and wheat are rabi crops.",
    "sourceFactIds": [
      "INTEGRATED-SYNTHESIS-COTTON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-108",
    "qlName": "Full-chapter mixed elimination and synthesis",
    "difficulty": "Easy",
    "stem": "Which crop has the strongest combined link with winter sowing, oil-rich seed and dry northwestern farming?",
    "answer": "Mustard",
    "distractors": [
      "Soybean",
      "Jute",
      "Tea"
    ],
    "explanation": "Mustard is a rabi oilseed well suited to dry northwestern conditions. Soybean is commonly kharif, while jute and tea need much wetter environments.",
    "sourceFactIds": [
      "INTEGRATED-SYNTHESIS-MUSTARD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-108",
    "qlName": "Full-chapter mixed elimination and synthesis",
    "difficulty": "Medium",
    "stem": "Which crop can be identified from the clues: perennial tree, hot humid climate, Kerala belt and latex harvest?",
    "answer": "Rubber",
    "distractors": [
      "Tea",
      "Coffee",
      "Cotton"
    ],
    "explanation": "Rubber is a tropical perennial tree crop strongly linked with Kerala and harvested by tapping latex. Tea and coffee yield leaves or beans, while cotton is an annual fibre crop.",
    "sourceFactIds": [
      "INTEGRATED-SYNTHESIS-RUBBER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-108",
    "qlName": "Full-chapter mixed elimination and synthesis",
    "difficulty": "Medium",
    "stem": "Which crop system combines high irrigation demand, kharif–rabi multiple cropping and Green Revolution geography in the northwest?",
    "answer": "Rice–wheat",
    "distractors": [
      "Tea–coffee",
      "Bajra–ragi",
      "Rubber–coconut"
    ],
    "explanation": "The irrigated northwestern plains commonly grow rice in kharif followed by wheat in rabi, a pattern strengthened by Green Revolution inputs. The other pairs belong to plantation or dryland systems.",
    "sourceFactIds": [
      "INTEGRATED-SYNTHESIS-RICE-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-108",
    "qlName": "Full-chapter mixed elimination and synthesis",
    "difficulty": "Medium",
    "stem": "Which three clues point to sugarcane rather than cotton or jute?",
    "answer": "Long duration, heavy water need and nearby crushing mill",
    "distractors": [
      "Black soil, boll fibre and ginning",
      "Humid alluvium, stem fibre and retting",
      "Cool winter, oil-rich seed and dry plain"
    ],
    "explanation": "Sugarcane is a long-duration water-demanding crop whose bulky stalks are sent quickly to nearby mills for crushing. Cotton and jute use fibre-specific processing instead.",
    "sourceFactIds": [
      "INTEGRATED-SYNTHESIS-SUGARCANE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-108",
    "qlName": "Full-chapter mixed elimination and synthesis",
    "difficulty": "Medium",
    "stem": "A district wants to reduce groundwater pressure from irrigated paddy while retaining a food crop suited to dry conditions. Which shift is most logical?",
    "answer": "Rice to bajra",
    "distractors": [
      "Bajra to rice",
      "Gram to sugarcane",
      "Mustard to jute"
    ],
    "explanation": "Bajra is a drought-tolerant foodgrain with far lower water needs than paddy, so the shift can reduce irrigation demand. The other changes move toward more water-intensive crops.",
    "sourceFactIds": [
      "INTEGRATED-SYNTHESIS-WATER-SHIFT"
    ]
  }
]);

export const GEO_AGR_001_CP005_INTEGRATED_SEGMENT_V1: readonly GeoAgr001Question[] = Object.freeze(
  RAW.map((raw, index) => Object.freeze({
    questionId: `GEO-AGR-001-CP005-I-Q${String(index + 1).padStart(3, "0")}`,
    qlId: raw.qlId, qlName: raw.qlName, difficulty: raw.difficulty, stem: raw.stem,
    options: placeGeoAgrOptions(raw.answer, raw.distractors, index % 4),
    correctIndex: index % 4, canonicalAnswer: raw.answer, explanation: raw.explanation,
    sourceIds: GEO_AGR_001_SOURCE_IDS, sourceFactIds: Object.freeze([...raw.sourceFactIds]),
    reviewOnly: true as const, runtimeRegistered: false as const,
  })),
);

export function auditGeoAgr001Cp005IntegratedSegmentV1() {
  return auditGeoAgr001Batch(GEO_AGR_001_CP005_INTEGRATED_SEGMENT_V1, 100, 108);
}
