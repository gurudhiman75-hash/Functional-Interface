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
    "qlId": "GEO-AGR-001-QL-082",
    "qlName": "Green Revolution meaning and historical setting",
    "difficulty": "Easy",
    "stem": "What does the Green Revolution refer to in Indian agriculture?",
    "answer": "Rapid yield growth using improved seeds, irrigation and modern inputs",
    "distractors": [
      "Expansion of forest cover only",
      "Replacement of farming by industry",
      "A return to shifting cultivation"
    ],
    "explanation": "The Green Revolution refers to the sharp rise in crop productivity achieved through high-yielding varieties combined with irrigation, fertilisers and other modern inputs. In India it became important from the 1960s onward.",
    "sourceFactIds": [
      "GR-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-082",
    "qlName": "Green Revolution meaning and historical setting",
    "difficulty": "Easy",
    "stem": "The Green Revolution in India began to take shape during which period?",
    "answer": "1960s",
    "distractors": [
      "1760s",
      "1860s",
      "Early medieval period"
    ],
    "explanation": "India adopted high-yielding crop varieties and a modern input package on a significant scale during the 1960s. The initial expansion focused on regions with dependable irrigation.",
    "sourceFactIds": [
      "GR-1960S"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-082",
    "qlName": "Green Revolution meaning and historical setting",
    "difficulty": "Medium",
    "stem": "Which feature most clearly separates Green Revolution farming from traditional low-input cultivation?",
    "answer": "Use of improved seed together with assured water and purchased inputs",
    "distractors": [
      "Dependence only on shifting plots",
      "Complete avoidance of irrigation",
      "Exclusive use of forest clearings"
    ],
    "explanation": "Green Revolution agriculture relied on a package of improved varieties, dependable irrigation, fertilisers and other inputs. The combination, rather than seed alone, drove large yield gains.",
    "sourceFactIds": [
      "GR-PACKAGE-DIFFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-082",
    "qlName": "Green Revolution meaning and historical setting",
    "difficulty": "Medium",
    "stem": "Why did the Green Revolution spread first in selected regions rather than uniformly across India?",
    "answer": "The new technology worked best where irrigation and input access were already stronger",
    "distractors": [
      "Every region had identical infrastructure",
      "The new seeds required no water",
      "Only coastal tides could support the crops"
    ],
    "explanation": "High-yielding varieties needed dependable water, nutrients and supporting infrastructure, so regions with these advantages adopted them earlier. Areas lacking those conditions moved more slowly.",
    "sourceFactIds": [
      "GR-SELECTIVE-SPREAD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-082",
    "qlName": "Green Revolution meaning and historical setting",
    "difficulty": "Medium",
    "stem": "Which statement captures the Green Revolution most accurately?",
    "answer": "It was a technological change in crop production rather than simply an expansion of cultivated land",
    "distractors": [
      "It depended only on adding new farmland",
      "It was only a change in crop names",
      "It replaced food crops with forests"
    ],
    "explanation": "The Green Revolution raised output largely by increasing yield per unit area through new seed–water–input combinations. It was therefore a productivity transformation, not merely land expansion.",
    "sourceFactIds": [
      "GR-PRODUCTIVITY-NOT-AREA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-082",
    "qlName": "Green Revolution meaning and historical setting",
    "difficulty": "Hard",
    "stem": "Two districts cultivate the same land area. District A adopts HYV seed, irrigation and fertiliser; District B keeps low-input traditional methods. Which district better represents Green Revolution farming?",
    "answer": "District A",
    "distractors": [
      "District B",
      "Both equally because technology does not matter",
      "Neither because Green Revolution means only more land"
    ],
    "explanation": "District A uses the combined technology package that defines Green Revolution agriculture. District B may still farm successfully, but it does not show the same high-input productivity model.",
    "sourceFactIds": [
      "GR-SCENARIO-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-083",
    "qlName": "Early wheat and rice emphasis",
    "difficulty": "Easy",
    "stem": "Which cereal was an early major focus of the Green Revolution in India?",
    "answer": "Wheat",
    "distractors": [
      "Jute",
      "Tea",
      "Rubber"
    ],
    "explanation": "High-yielding wheat varieties played a major role in the early Green Revolution, especially in irrigated northwestern India. Rice varieties were also expanded later across suitable regions.",
    "sourceFactIds": [
      "GR-WHEAT-FOCUS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-083",
    "qlName": "Early wheat and rice emphasis",
    "difficulty": "Easy",
    "stem": "Which two foodgrains were most closely linked with Green Revolution technology?",
    "answer": "Wheat and rice",
    "distractors": [
      "Tea and coffee",
      "Cotton and jute",
      "Rubber and coconut"
    ],
    "explanation": "Wheat and rice were the principal cereals transformed by high-yielding varieties, irrigation and fertiliser use. Plantation and fibre crops were not the central foodgrain focus.",
    "sourceFactIds": [
      "GR-WHEAT-RICE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-083",
    "qlName": "Early wheat and rice emphasis",
    "difficulty": "Medium",
    "stem": "Why did irrigated wheat regions respond strongly to Green Revolution technology?",
    "answer": "HYV wheat could use reliable water and nutrients to raise yields sharply",
    "distractors": [
      "Wheat required no water or nutrients",
      "The crop grew only under forest shade",
      "Irrigation reduced all wheat yields"
    ],
    "explanation": "High-yielding wheat varieties responded strongly when moisture and nutrients were not limiting. Irrigated plains therefore provided a favourable setting for rapid productivity gains.",
    "sourceFactIds": [
      "GR-WHEAT-IRRIGATION-RESPONSE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-083",
    "qlName": "Early wheat and rice emphasis",
    "difficulty": "Medium",
    "stem": "Which crop would most likely show the classic early Green Revolution pattern in Punjab?",
    "answer": "Wheat",
    "distractors": [
      "Tea",
      "Rubber",
      "Jute"
    ],
    "explanation": "Punjab's irrigated winter cereal system became strongly linked with HYV wheat and intensive input use. Tea, rubber and jute belong to very different crop geographies.",
    "sourceFactIds": [
      "GR-PUNJAB-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-083",
    "qlName": "Early wheat and rice emphasis",
    "difficulty": "Medium",
    "stem": "Which change would most directly extend Green Revolution-style rice cultivation into a suitable area?",
    "answer": "Reliable irrigation combined with responsive rice varieties",
    "distractors": [
      "Removing all water access",
      "Reducing seed quality",
      "Keeping fields permanently dry"
    ],
    "explanation": "High-yielding rice performs best when water supply is dependable and crop management is intensive. Irrigation therefore helps extend the technology beyond naturally wet areas.",
    "sourceFactIds": [
      "GR-RICE-IRRIGATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-083",
    "qlName": "Early wheat and rice emphasis",
    "difficulty": "Hard",
    "stem": "Region A has assured irrigation and cool rabi weather; Region B is humid and rain-rich during kharif. Which Green Revolution cereals fit A and B most naturally?",
    "answer": "A wheat; B rice",
    "distractors": [
      "A rice; B wheat only",
      "A jute; B cotton",
      "A tea; B mustard"
    ],
    "explanation": "Assured rabi irrigation and cool weather fit wheat, while warm wet kharif conditions favour rice. Both cereals became central to Green Revolution technology under suitable regional conditions.",
    "sourceFactIds": [
      "GR-WHEAT-RICE-REGION-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-084",
    "qlName": "Green Revolution package approach",
    "difficulty": "Easy",
    "stem": "Which input package is most closely linked with the Green Revolution?",
    "answer": "HYV seeds, irrigation and fertilisers",
    "distractors": [
      "Only rainfall and hand tools",
      "Only larger farm boundaries",
      "Only forest clearing"
    ],
    "explanation": "Green Revolution gains came from a package in which improved seeds were supported by reliable water and nutrients. Other inputs such as plant protection and machinery often complemented the system.",
    "sourceFactIds": [
      "GR-INPUT-PACKAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-084",
    "qlName": "Green Revolution package approach",
    "difficulty": "Easy",
    "stem": "Why was irrigation central to Green Revolution farming?",
    "answer": "It reduced dependence on uncertain rainfall and supported HYV crops",
    "distractors": [
      "It eliminated the need for seed",
      "It made fertilisers unnecessary",
      "It prevented all crop growth"
    ],
    "explanation": "High-yielding varieties needed reliable moisture to realise their yield potential, and irrigation supplied that water when rainfall was insufficient. This made production more dependable.",
    "sourceFactIds": [
      "GR-IRRIGATION-CENTRAL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-084",
    "qlName": "Green Revolution package approach",
    "difficulty": "Medium",
    "stem": "Why is improved seed alone not enough for a Green Revolution-style yield increase?",
    "answer": "Water, nutrients and management must also support the crop",
    "distractors": [
      "Seed quality never affects yield",
      "Improved seed grows without soil",
      "Only farm size determines yield"
    ],
    "explanation": "A crop's genetic yield potential can be limited by drought, nutrient shortage or poor management. The Green Revolution therefore worked through a coordinated package rather than a single input.",
    "sourceFactIds": [
      "GR-SEED-NOT-ALONE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-084",
    "qlName": "Green Revolution package approach",
    "difficulty": "Medium",
    "stem": "Which input directly improves the nutrient supply available to a high-yielding crop?",
    "answer": "Fertiliser",
    "distractors": [
      "Road milestone",
      "Harvest basket",
      "Weather station sign"
    ],
    "explanation": "Fertilisers add essential plant nutrients and can support the high nutrient demand of productive varieties. Their value is greatest when water and other growth conditions are also adequate.",
    "sourceFactIds": [
      "GR-FERTILISER-ROLE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-084",
    "qlName": "Green Revolution package approach",
    "difficulty": "Medium",
    "stem": "Which infrastructure most strongly supports a Green Revolution package in a dry plain?",
    "answer": "Canal and tube-well irrigation",
    "distractors": [
      "Removal of all wells",
      "Closure of reservoirs",
      "Dependence only on dew"
    ],
    "explanation": "A dry plain needs dependable water before high-yielding seed and fertiliser can perform reliably. Canals and tube-wells can provide that irrigation support.",
    "sourceFactIds": [
      "GR-DRY-PLAIN-INFRA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-084",
    "qlName": "Green Revolution package approach",
    "difficulty": "Hard",
    "stem": "Farm A uses HYV seed but has no irrigation or fertiliser; Farm B combines HYV seed with reliable water and nutrients. Which farm has the stronger Green Revolution package?",
    "answer": "Farm B",
    "distractors": [
      "Farm A",
      "Both are identical because seed is the only factor",
      "Neither because Green Revolution excludes irrigation"
    ],
    "explanation": "Farm B combines the mutually reinforcing inputs that allowed high-yielding varieties to perform strongly. Farm A lacks two major supports and is therefore less likely to realise the same productivity gains.",
    "sourceFactIds": [
      "GR-PACKAGE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-085",
    "qlName": "Northwestern core regions",
    "difficulty": "Easy",
    "stem": "Which region became a core area of the Green Revolution in India?",
    "answer": "Punjab, Haryana and western Uttar Pradesh",
    "distractors": [
      "Ladakh and cold desert valleys",
      "Andaman islands only",
      "Thar dunes without irrigation"
    ],
    "explanation": "Punjab, Haryana and western Uttar Pradesh had extensive irrigation, fertile plains and strong wheat systems. These advantages made them early core regions of Green Revolution agriculture.",
    "sourceFactIds": [
      "GR-NW-CORE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-085",
    "qlName": "Northwestern core regions",
    "difficulty": "Easy",
    "stem": "Which physical setting supported the early northwestern Green Revolution?",
    "answer": "Irrigated alluvial plains",
    "distractors": [
      "Glaciated mountain summits",
      "Tidal mangrove swamps",
      "Coral reefs"
    ],
    "explanation": "The northwestern plains combined fertile alluvial soils with canals and groundwater irrigation. These physical and infrastructural advantages supported intensive wheat and rice production.",
    "sourceFactIds": [
      "GR-NW-PLAINS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-085",
    "qlName": "Northwestern core regions",
    "difficulty": "Medium",
    "stem": "Why did Punjab and Haryana adopt Green Revolution technology rapidly?",
    "answer": "They already had strong irrigation and suitable cereal farming systems",
    "distractors": [
      "They had no access to water",
      "The region was dominated by dense forest",
      "Farming was impossible on the plains"
    ],
    "explanation": "Reliable irrigation, fertile soils and established cereal cultivation reduced the constraints on HYV adoption. Farmers could therefore use seed, fertiliser and machinery effectively.",
    "sourceFactIds": [
      "GR-PUNJAB-HARYANA-REASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-085",
    "qlName": "Northwestern core regions",
    "difficulty": "Medium",
    "stem": "Which irrigation source helped support Green Revolution farming in the northwestern plains?",
    "answer": "Canals and tube-wells",
    "distractors": [
      "Ocean tides",
      "Only mountain snow on fields",
      "Permanent rain-fed drought"
    ],
    "explanation": "Canal networks and groundwater pumping supplied dependable water across Punjab, Haryana and western Uttar Pradesh. That reliability was important for intensive HYV cultivation.",
    "sourceFactIds": [
      "GR-NW-IRRIGATION-SOURCES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-085",
    "qlName": "Northwestern core regions",
    "difficulty": "Medium",
    "stem": "Which crop sequence became common in intensively irrigated parts of the northwest?",
    "answer": "Rice–wheat rotation",
    "distractors": [
      "Tea–rubber rotation",
      "Jute–coffee rotation",
      "Apple–coconut rotation"
    ],
    "explanation": "Irrigation and modern inputs allowed rice in kharif followed by wheat in rabi on the same fields. The rice–wheat system became a major feature of intensive northwestern farming.",
    "sourceFactIds": [
      "GR-RICE-WHEAT-ROTATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-085",
    "qlName": "Northwestern core regions",
    "difficulty": "Hard",
    "stem": "District A lies on an irrigated alluvial plain in Punjab; District B is a rain-fed dry plateau with weak input access. Which district had the stronger early Green Revolution advantage?",
    "answer": "District A",
    "distractors": [
      "District B",
      "Both were identical because irrigation did not matter",
      "Neither could adopt HYV crops"
    ],
    "explanation": "District A combines the irrigation, fertile soil and input access that favoured early Green Revolution adoption. District B lacked several of those supporting conditions.",
    "sourceFactIds": [
      "GR-NW-ADVANTAGE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-086",
    "qlName": "Yield and foodgrain-output effects",
    "difficulty": "Easy",
    "stem": "What was a major agricultural effect of the Green Revolution?",
    "answer": "Higher yields of key foodgrains",
    "distractors": [
      "Complete end of cereal cultivation",
      "Lower output from every irrigated field",
      "Replacement of crops by forests"
    ],
    "explanation": "High-yielding varieties supported by irrigation and fertilisers raised productivity in wheat and rice. This increased foodgrain output without requiring equivalent expansion of cultivated land.",
    "sourceFactIds": [
      "GR-YIELD-GAINS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-086",
    "qlName": "Yield and foodgrain-output effects",
    "difficulty": "Easy",
    "stem": "How could foodgrain output rise even if cultivated area changed little?",
    "answer": "Yield per hectare increased",
    "distractors": [
      "Fields became larger without land",
      "Crops stopped using soil",
      "Rainfall doubled everywhere"
    ],
    "explanation": "Green Revolution technology increased the amount harvested from each hectare through improved varieties and inputs. Higher yield can raise total production even when crop area changes little.",
    "sourceFactIds": [
      "GR-YIELD-PER-HECTARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-086",
    "qlName": "Yield and foodgrain-output effects",
    "difficulty": "Medium",
    "stem": "Which measure would show a Green Revolution productivity gain most directly?",
    "answer": "More grain harvested from the same field area",
    "distractors": [
      "More uncultivated land",
      "Longer distance to markets",
      "Lower seed quality"
    ],
    "explanation": "Productivity refers to output per unit of land or input, so a larger harvest from the same field area is direct evidence of yield improvement. Land expansion alone would not show the same effect.",
    "sourceFactIds": [
      "GR-PRODUCTIVITY-MEASURE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-086",
    "qlName": "Yield and foodgrain-output effects",
    "difficulty": "Medium",
    "stem": "Why did improved irrigation help stabilise foodgrain output?",
    "answer": "It reduced crop exposure to rainfall failure during critical stages",
    "distractors": [
      "It removed all weather variation",
      "It eliminated the need for soil",
      "It made crops independent of water"
    ],
    "explanation": "Irrigation cannot remove every weather risk, but it can supply water when rainfall fails or pauses. This makes yields more dependable than under purely rain-fed conditions.",
    "sourceFactIds": [
      "GR-OUTPUT-STABILITY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-086",
    "qlName": "Yield and foodgrain-output effects",
    "difficulty": "Medium",
    "stem": "Which result is more consistent with successful HYV adoption?",
    "answer": "Higher cereal yield with adequate water and nutrients",
    "distractors": [
      "Lower yield despite perfect management by definition",
      "No response to irrigation",
      "Complete disappearance of cereals"
    ],
    "explanation": "High-yielding varieties were selected for strong response under good management, especially adequate water and nutrients. Successful adoption therefore tends to increase cereal productivity.",
    "sourceFactIds": [
      "GR-HYV-YIELD-RESULT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-086",
    "qlName": "Yield and foodgrain-output effects",
    "difficulty": "Hard",
    "stem": "Farm A and Farm B cultivate equal wheat area. A harvests twice as much after adopting HYV seed and irrigation. What changed most clearly?",
    "answer": "Land productivity increased on Farm A",
    "distractors": [
      "Farm A doubled its land area",
      "Farm B became a plantation",
      "Latitude changed on Farm A"
    ],
    "explanation": "Because the cultivated area stayed the same while output increased, the gain came from higher yield per unit area. That is a direct rise in land productivity.",
    "sourceFactIds": [
      "GR-PRODUCTIVITY-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-087",
    "qlName": "Regional concentration and uneven adoption",
    "difficulty": "Easy",
    "stem": "Why was Green Revolution adoption uneven across India at first?",
    "answer": "Regions differed in irrigation, infrastructure and access to inputs",
    "distractors": [
      "Every region had identical farming conditions",
      "HYV seed required no supporting resources",
      "Only latitude determined adoption"
    ],
    "explanation": "The technology package needed water, credit, fertiliser, markets and other support that were not equally available everywhere. Better-equipped regions adopted it faster.",
    "sourceFactIds": [
      "GR-UNEVEN-ADOPTION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-087",
    "qlName": "Regional concentration and uneven adoption",
    "difficulty": "Easy",
    "stem": "Which area was less likely to adopt Green Revolution technology early?",
    "answer": "Rain-fed region with weak irrigation access",
    "distractors": [
      "Well-irrigated cereal plain",
      "Area with reliable tube-wells",
      "Canal command area"
    ],
    "explanation": "Rain-fed regions faced greater water risk and often lacked the infrastructure needed for input-intensive HYV farming. Irrigated cereal plains had a stronger early advantage.",
    "sourceFactIds": [
      "GR-RAINFED-DISADVANTAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-087",
    "qlName": "Regional concentration and uneven adoption",
    "difficulty": "Medium",
    "stem": "How could uneven Green Revolution adoption widen regional differences?",
    "answer": "High-input irrigated regions could raise yields faster than rain-fed regions",
    "distractors": [
      "All regions gained at exactly the same rate",
      "Irrigation reduced every yield",
      "Rain-fed regions automatically had more inputs"
    ],
    "explanation": "Regions with irrigation and input access could exploit HYV technology sooner and more intensively. Areas without those supports often experienced slower productivity growth.",
    "sourceFactIds": [
      "GR-REGIONAL-DIFFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-087",
    "qlName": "Regional concentration and uneven adoption",
    "difficulty": "Medium",
    "stem": "Which factor could limit adoption by a small farmer even in a suitable climate?",
    "answer": "Limited access to credit and purchased inputs",
    "distractors": [
      "Presence of fertile soil",
      "Access to irrigation",
      "Nearby markets"
    ],
    "explanation": "The Green Revolution package required expenditure on seed, fertiliser, irrigation and sometimes machinery. Limited credit or cash could therefore restrict adoption even where physical conditions were favourable.",
    "sourceFactIds": [
      "GR-CREDIT-ACCESS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-087",
    "qlName": "Regional concentration and uneven adoption",
    "difficulty": "Medium",
    "stem": "Which comparison shows uneven adoption most clearly?",
    "answer": "Irrigated region using HYV seed widely while a nearby rain-fed region uses it little",
    "distractors": [
      "Two irrigated regions using the same seed",
      "Two rain-fed fields with identical methods",
      "Two farms with equal input access"
    ],
    "explanation": "A sharp difference in technology use linked with irrigation access is a classic sign of uneven adoption. Similar conditions and input use would not show the same regional contrast.",
    "sourceFactIds": [
      "GR-UNEVEN-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-087",
    "qlName": "Regional concentration and uneven adoption",
    "difficulty": "Hard",
    "stem": "Region A has canals, tube-wells, fertiliser supply and credit; Region B depends on erratic rain and has weak market access. Which region would likely adopt HYV farming earlier?",
    "answer": "Region A",
    "distractors": [
      "Region B",
      "Both at exactly the same pace",
      "Neither because HYV farming excludes irrigation"
    ],
    "explanation": "Region A has the water, inputs and financial support needed for high-yielding technology, while Region B faces several constraints. Early adoption would therefore be more likely in Region A.",
    "sourceFactIds": [
      "GR-ADOPTION-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-088",
    "qlName": "Environmental pressures from intensive farming",
    "difficulty": "Easy",
    "stem": "Which resource can decline when tube-well pumping repeatedly exceeds recharge?",
    "answer": "Groundwater level",
    "distractors": [
      "Latitude",
      "Length of daylight",
      "Mountain elevation"
    ],
    "explanation": "Heavy pumping can lower the water table when groundwater withdrawal exceeds natural or artificial recharge. This is an important environmental pressure in intensively irrigated farming areas.",
    "sourceFactIds": [
      "GR-GROUNDWATER-DECLINE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-088",
    "qlName": "Environmental pressures from intensive farming",
    "difficulty": "Easy",
    "stem": "Which soil problem can result from excessive irrigation and poor drainage?",
    "answer": "Waterlogging and salinity",
    "distractors": [
      "Permanent mountain uplift",
      "Longer winters",
      "More daylight"
    ],
    "explanation": "Excess irrigation can raise the water table, while evaporation can leave salts near the surface if drainage is poor. Both waterlogging and salinity can reduce crop productivity.",
    "sourceFactIds": [
      "GR-WATERLOGGING-SALINITY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-088",
    "qlName": "Environmental pressures from intensive farming",
    "difficulty": "Medium",
    "stem": "Why can intensive fertiliser use create environmental concern?",
    "answer": "Excess nutrients can move into soil and water beyond crop needs",
    "distractors": [
      "Fertilisers never contain nutrients",
      "More fertiliser always causes no loss",
      "Nutrients cannot move with water"
    ],
    "explanation": "When fertiliser application exceeds crop uptake, some nutrients can leach or run off into water bodies. Balanced nutrient use reduces waste and environmental pressure.",
    "sourceFactIds": [
      "GR-FERTILISER-ENVIRONMENT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-088",
    "qlName": "Environmental pressures from intensive farming",
    "difficulty": "Medium",
    "stem": "Which farming pattern puts the greatest pressure on groundwater?",
    "answer": "Water-intensive crops supported by heavy tube-well pumping",
    "distractors": [
      "Rain-fed millet with little irrigation",
      "Dryland pulses without pumping",
      "Orchards using only rainfall"
    ],
    "explanation": "Heavy groundwater use is most likely where water-demanding crops are irrigated repeatedly with tube-wells. Rain-fed and low-water systems place less direct pressure on aquifers.",
    "sourceFactIds": [
      "GR-GROUNDWATER-PRESSURE-CROPS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-088",
    "qlName": "Environmental pressures from intensive farming",
    "difficulty": "Medium",
    "stem": "Which change can reduce irrigation-related waterlogging?",
    "answer": "Improving drainage and matching water supply to crop need",
    "distractors": [
      "Keeping fields permanently flooded",
      "Blocking all drainage channels",
      "Applying water regardless of soil condition"
    ],
    "explanation": "Good drainage removes excess water, while careful irrigation prevents unnecessary saturation of the root zone. Both measures help control waterlogging and salinity.",
    "sourceFactIds": [
      "GR-WATERLOGGING-MANAGEMENT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-088",
    "qlName": "Environmental pressures from intensive farming",
    "difficulty": "Medium",
    "stem": "Which statement links intensive agriculture and resource use correctly?",
    "answer": "Higher output can come with greater pressure on water and soil if inputs are poorly managed",
    "distractors": [
      "High output never affects resources",
      "Irrigation cannot alter groundwater",
      "Soil condition is unrelated to farming intensity"
    ],
    "explanation": "Intensive systems can raise production substantially, but heavy pumping, fertiliser use or repeated cropping can stress natural resources. Management quality determines how severe those pressures become.",
    "sourceFactIds": [
      "GR-INTENSITY-RESOURCE-PRESSURE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-089",
    "qlName": "Crop-pattern and resource effects",
    "difficulty": "Easy",
    "stem": "Which crop sequence became prominent in parts of the Green Revolution northwest?",
    "answer": "Rice–wheat",
    "distractors": [
      "Tea–coffee",
      "Rubber–coconut",
      "Apple–jute"
    ],
    "explanation": "Irrigation and modern inputs enabled rice in the kharif season followed by wheat in rabi on the same fields. This intensive rice–wheat rotation became widespread in parts of the northwest.",
    "sourceFactIds": [
      "GR-CROP-PATTERN-RICE-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-089",
    "qlName": "Crop-pattern and resource effects",
    "difficulty": "Easy",
    "stem": "What can happen when the same cereal rotation is repeated intensively for many years?",
    "answer": "Soil and water pressures can accumulate",
    "distractors": [
      "Natural resources become unlimited",
      "Groundwater always rises",
      "Nutrient demand disappears"
    ],
    "explanation": "Repeated intensive cropping can increase nutrient removal, irrigation demand and pest pressure if rotations and inputs are not managed carefully. Resource stress can therefore build over time.",
    "sourceFactIds": [
      "GR-REPEATED-ROTATION-PRESSURE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-089",
    "qlName": "Crop-pattern and resource effects",
    "difficulty": "Medium",
    "stem": "Why can irrigated rice create resource pressure in a relatively dry region?",
    "answer": "The crop requires large water supplies that may depend on pumping",
    "distractors": [
      "Rice grows without water",
      "Dry regions always receive excess rain",
      "Pumping increases aquifer recharge automatically"
    ],
    "explanation": "Rice has a high water requirement, so growing it widely in a lower-rainfall region can place heavy demand on canals and groundwater. Repeated pumping can lower the water table.",
    "sourceFactIds": [
      "GR-RICE-DRY-REGION-WATER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-089",
    "qlName": "Crop-pattern and resource effects",
    "difficulty": "Medium",
    "stem": "Which change would diversify a cereal-dominated farming system?",
    "answer": "Adding pulses or other lower-water crops to the rotation",
    "distractors": [
      "Growing only the same cereal every season",
      "Increasing water use without changing crops",
      "Removing all crop rotation"
    ],
    "explanation": "Adding pulses or other crops breaks continuous cereal repetition and can reduce pressure on water or nutrients. Pulses can also contribute nitrogen through biological fixation.",
    "sourceFactIds": [
      "GR-CROP-DIVERSIFICATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-089",
    "qlName": "Crop-pattern and resource effects",
    "difficulty": "Medium",
    "stem": "How can crop choice affect groundwater stress?",
    "answer": "Water-demanding crops increase irrigation demand in dry regions",
    "distractors": [
      "Crop water needs are always identical",
      "Groundwater use depends only on latitude",
      "Crop choice cannot influence pumping"
    ],
    "explanation": "Different crops have different water requirements, so crop choice changes the amount of irrigation needed. Water-intensive crops can increase groundwater withdrawal where rainfall is insufficient.",
    "sourceFactIds": [
      "GR-CROP-CHOICE-GROUNDWATER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-089",
    "qlName": "Crop-pattern and resource effects",
    "difficulty": "Medium",
    "stem": "Which farming change can reduce pressure from a rice–wheat monoculture?",
    "answer": "More diversified crop rotations",
    "distractors": [
      "Repeating rice and wheat more frequently",
      "Removing all pulses",
      "Increasing unnecessary irrigation"
    ],
    "explanation": "Diversified rotations can spread water and nutrient demand across crops and interrupt repeated cereal cycles. They can also improve resilience to pests and market changes.",
    "sourceFactIds": [
      "GR-DIVERSIFIED-ROTATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-090",
    "qlName": "Integrated Green Revolution reasoning",
    "difficulty": "Easy",
    "stem": "Which combination most strongly identifies a Green Revolution region?",
    "answer": "HYV cereals, assured irrigation and intensive input use",
    "distractors": [
      "Shifting cultivation with low inputs",
      "Only rain-fed millet on dry slopes",
      "Plantation forestry without cereals"
    ],
    "explanation": "Green Revolution regions are characterised by high-yielding cereal varieties supported by irrigation, fertilisers and other modern inputs. The system is intensive rather than low-input.",
    "sourceFactIds": [
      "GR-INTEGRATED-IDENTITY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-090",
    "qlName": "Integrated Green Revolution reasoning",
    "difficulty": "Easy",
    "stem": "Which region–crop relation fits the classic early Green Revolution pattern?",
    "answer": "Punjab–Haryana — irrigated wheat",
    "distractors": [
      "Ladakh — rubber",
      "Thar Desert — jute without irrigation",
      "Andaman coast — wheat snow farming"
    ],
    "explanation": "The irrigated plains of Punjab and Haryana were central to early HYV wheat adoption. The distractor regions and crops do not match Green Revolution geography.",
    "sourceFactIds": [
      "GR-INTEGRATED-REGION-CROP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-090",
    "qlName": "Integrated Green Revolution reasoning",
    "difficulty": "Medium",
    "stem": "Which chain of cause and effect is most logical?",
    "answer": "Irrigation + HYV seed + nutrients → higher yield potential",
    "distractors": [
      "No water + poor seed → guaranteed high yield",
      "Groundwater decline → unlimited irrigation",
      "Permanent waterlogging → better root aeration"
    ],
    "explanation": "High-yielding varieties perform strongly when adequate water and nutrients support crop growth. Removing these inputs or creating waterlogging works against productivity.",
    "sourceFactIds": [
      "GR-INTEGRATED-CAUSE-EFFECT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-090",
    "qlName": "Integrated Green Revolution reasoning",
    "difficulty": "Medium",
    "stem": "Which statement gives both a benefit and a possible cost of intensive Green Revolution farming?",
    "answer": "Higher foodgrain yields can coincide with groundwater and soil stress",
    "distractors": [
      "Higher yields always eliminate resource pressure",
      "Irrigation cannot affect groundwater",
      "Modern inputs never influence soil or water"
    ],
    "explanation": "The Green Revolution raised cereal productivity, but intensive water and input use can create environmental pressure when poorly managed. Both outcomes can occur within the same production system.",
    "sourceFactIds": [
      "GR-INTEGRATED-BENEFIT-COST"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-090",
    "qlName": "Integrated Green Revolution reasoning",
    "difficulty": "Medium",
    "stem": "A region has fertile plains but weak irrigation and little input access. What is the main constraint on Green Revolution-style adoption?",
    "answer": "The supporting water and input package is incomplete",
    "distractors": [
      "Fertile soil prevents HYV use",
      "Cereals cannot grow on plains",
      "Latitude alone blocks adoption"
    ],
    "explanation": "Fertile soil helps, but HYV agriculture also depends on reliable water, nutrients and access to production inputs. Missing those supports can limit adoption despite suitable land.",
    "sourceFactIds": [
      "GR-INTEGRATED-CONSTRAINT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-090",
    "qlName": "Integrated Green Revolution reasoning",
    "difficulty": "Medium",
    "stem": "Which comparison is most accurate for early Green Revolution geography?",
    "answer": "Well-irrigated cereal regions adopted faster than many rain-fed regions",
    "distractors": [
      "Rain-fed regions always adopted first",
      "Irrigation reduced adoption",
      "All regions changed at exactly the same pace"
    ],
    "explanation": "The technology package rewarded reliable irrigation and input access, so well-equipped cereal regions moved faster. Rain-fed areas often lacked the same physical and institutional support.",
    "sourceFactIds": [
      "GR-INTEGRATED-REGIONAL-COMPARE"
    ]
  }
]);

export const GEO_AGR_001_CP004_GREEN_REVOLUTION_SEGMENT_V1: readonly GeoAgr001Question[] = Object.freeze(
  RAW.map((raw, index) => Object.freeze({
    questionId: `GEO-AGR-001-CP004-GR-Q${String(index + 1).padStart(3, "0")}`,
    qlId: raw.qlId, qlName: raw.qlName, difficulty: raw.difficulty, stem: raw.stem,
    options: placeGeoAgrOptions(raw.answer, raw.distractors, index % 4),
    correctIndex: index % 4, canonicalAnswer: raw.answer, explanation: raw.explanation,
    sourceIds: GEO_AGR_001_SOURCE_IDS, sourceFactIds: Object.freeze([...raw.sourceFactIds]),
    reviewOnly: true as const, runtimeRegistered: false as const,
  })),
);

export function auditGeoAgr001Cp004GreenRevolutionSegmentV1() {
  return auditGeoAgr001Batch(GEO_AGR_001_CP004_GREEN_REVOLUTION_SEGMENT_V1, 82, 90);
}
