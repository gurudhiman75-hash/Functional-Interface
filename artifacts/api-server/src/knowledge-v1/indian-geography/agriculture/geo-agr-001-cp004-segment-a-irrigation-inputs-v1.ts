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
    "qlId": "GEO-AGR-001-QL-073",
    "qlName": "Sources of irrigation",
    "difficulty": "Easy",
    "stem": "Which is a common source of irrigation in Indian agriculture?",
    "answer": "Wells and tube-wells",
    "distractors": [
      "Sea tides",
      "Glacial ice on fields",
      "Only natural dew"
    ],
    "explanation": "Wells and tube-wells draw groundwater for use on farms and are important irrigation sources in many parts of India. Canals and tanks are other common irrigation systems.",
    "sourceFactIds": [
      "IRRIGATION-SOURCES-GROUNDWATER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-073",
    "qlName": "Sources of irrigation",
    "difficulty": "Easy",
    "stem": "Which pair contains two established irrigation sources?",
    "answer": "Canals and tanks",
    "distractors": [
      "Sea waves and snowdrifts",
      "Fog and dew only",
      "Ocean currents and tides"
    ],
    "explanation": "Canals carry surface water to fields, while tanks store runoff or local water for later use. Both are long-established irrigation sources in Indian agriculture.",
    "sourceFactIds": [
      "IRRIGATION-SOURCES-CANAL-TANK"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-073",
    "qlName": "Sources of irrigation",
    "difficulty": "Medium",
    "stem": "Which irrigation source depends directly on groundwater stored below the surface?",
    "answer": "Tube-well",
    "distractors": [
      "Canal from a river",
      "Surface tank",
      "Reservoir canal"
    ],
    "explanation": "A tube-well pumps water from an underground aquifer, so its supply comes directly from groundwater. Canals and tanks rely on surface-water storage or diversion.",
    "sourceFactIds": [
      "IRRIGATION-TUBEWELL-GROUNDWATER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-073",
    "qlName": "Sources of irrigation",
    "difficulty": "Medium",
    "stem": "Which irrigation system carries river or reservoir water through an artificial channel network?",
    "answer": "Canal irrigation",
    "distractors": [
      "Tube-well irrigation",
      "Rain-fed farming",
      "Dryland fallowing"
    ],
    "explanation": "Canal irrigation distributes surface water through constructed channels from rivers, barrages or reservoirs. It differs from wells, which lift water from underground.",
    "sourceFactIds": [
      "IRRIGATION-CANAL-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-073",
    "qlName": "Sources of irrigation",
    "difficulty": "Medium",
    "stem": "Which source is most likely to store local runoff for irrigation in a hard-rock plateau area?",
    "answer": "Tank",
    "distractors": [
      "Ocean current",
      "Glacier on the field",
      "Tidal estuary only"
    ],
    "explanation": "Tanks collect and store local runoff and have long been used in plateau regions where natural depressions and hard-rock terrain favour small reservoirs. They can support nearby fields during dry periods.",
    "sourceFactIds": [
      "IRRIGATION-TANK-RUNOFF"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-073",
    "qlName": "Sources of irrigation",
    "difficulty": "Hard",
    "stem": "Farm A receives water from a river-fed channel; Farm B pumps water from an aquifer. Which irrigation sources are used by A and B?",
    "answer": "A canal; B tube-well",
    "distractors": [
      "A tank; B canal",
      "A tube-well; B canal",
      "A rain-fed field; B tank"
    ],
    "explanation": "A river-fed artificial channel is a canal, while water pumped from an aquifer comes through a tube-well. The source and delivery method identify the two systems.",
    "sourceFactIds": [
      "IRRIGATION-SOURCE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-074",
    "qlName": "Need for irrigation in monsoon agriculture",
    "difficulty": "Easy",
    "stem": "Why is irrigation important in a monsoon-dependent farming system?",
    "answer": "Rainfall is seasonal and can be uncertain",
    "distractors": [
      "Rain falls equally every day of the year",
      "All crops grow without water",
      "Fields remain permanently flooded naturally"
    ],
    "explanation": "Most rainfall in India is concentrated in part of the year and its timing can vary. Irrigation supplies water when rainfall is insufficient or arrives at the wrong time.",
    "sourceFactIds": [
      "IRRIGATION-MONSOON-UNCERTAINTY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-074",
    "qlName": "Need for irrigation in monsoon agriculture",
    "difficulty": "Easy",
    "stem": "Which farming risk can irrigation reduce most directly?",
    "answer": "Crop moisture stress during dry spells",
    "distractors": [
      "Length of daylight",
      "Latitude of the farm",
      "Natural soil colour"
    ],
    "explanation": "Irrigation supplies water when rainfall pauses or fails, reducing moisture stress during critical crop stages. It cannot change latitude, daylight length or the natural colour of soil.",
    "sourceFactIds": [
      "IRRIGATION-DRY-SPELL-RISK"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-074",
    "qlName": "Need for irrigation in monsoon agriculture",
    "difficulty": "Medium",
    "stem": "Why can irrigation make rabi cultivation possible after the monsoon has withdrawn?",
    "answer": "It supplies soil moisture during the dry winter season",
    "distractors": [
      "It creates winter rainfall automatically",
      "It shortens the winter to one week",
      "It removes the need for soil moisture"
    ],
    "explanation": "Rabi crops grow largely after the monsoon season, when natural rainfall is limited in many regions. Irrigation provides the water needed for germination and later growth.",
    "sourceFactIds": [
      "IRRIGATION-RABI-SUPPORT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-074",
    "qlName": "Need for irrigation in monsoon agriculture",
    "difficulty": "Medium",
    "stem": "Which change would most reduce dependence on the exact arrival date of monsoon rain?",
    "answer": "Reliable irrigation",
    "distractors": [
      "Reducing all water storage",
      "Closing wells",
      "Removing canals"
    ],
    "explanation": "Reliable irrigation gives farmers an alternative source of moisture when monsoon onset is delayed. This reduces the direct dependence of sowing and early growth on rainfall timing.",
    "sourceFactIds": [
      "IRRIGATION-MONSOON-TIMING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-074",
    "qlName": "Need for irrigation in monsoon agriculture",
    "difficulty": "Medium",
    "stem": "How does irrigation support multiple cropping on the same field?",
    "answer": "It provides water beyond the rainy season",
    "distractors": [
      "It prevents any second crop",
      "It makes soil permanently dry",
      "It eliminates the growing season"
    ],
    "explanation": "A second or third crop often needs water when monsoon rainfall is absent. Irrigation extends water availability and therefore supports cultivation across more seasons.",
    "sourceFactIds": [
      "IRRIGATION-MULTIPLE-CROPPING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-074",
    "qlName": "Need for irrigation in monsoon agriculture",
    "difficulty": "Hard",
    "stem": "District A receives the same annual rainfall as District B, but A has reliable irrigation and B does not. Which district can more safely grow crops in the dry season?",
    "answer": "District A",
    "distractors": [
      "District B",
      "Both are identical because annual rainfall is the only factor",
      "Neither can farm after monsoon"
    ],
    "explanation": "Dry-season farming depends on water availability at the time crops need it, not just on annual rainfall totals. Reliable irrigation gives District A a clear advantage after the monsoon.",
    "sourceFactIds": [
      "IRRIGATION-DRY-SEASON-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-075",
    "qlName": "Canal irrigation geography",
    "difficulty": "Easy",
    "stem": "Which landform is especially suitable for a large canal network?",
    "answer": "Level alluvial plain",
    "distractors": [
      "Very steep rocky ridge",
      "Glaciated summit",
      "Deep ocean trench"
    ],
    "explanation": "Canals can distribute water efficiently across level or gently sloping plains because channels are easier to construct and control. Steep rugged terrain makes large canal systems more difficult.",
    "sourceFactIds": [
      "CANAL-LEVEL-PLAINS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-075",
    "qlName": "Canal irrigation geography",
    "difficulty": "Easy",
    "stem": "Which region is well known for extensive canal irrigation?",
    "answer": "Northern plains",
    "distractors": [
      "High Himalayan glaciers only",
      "Coral reefs",
      "Offshore islands only"
    ],
    "explanation": "The northern plains have large rivers, gentle relief and extensive farmland, which support major canal systems. These features make canal irrigation especially practical.",
    "sourceFactIds": [
      "CANAL-NORTHERN-PLAINS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-075",
    "qlName": "Canal irrigation geography",
    "difficulty": "Medium",
    "stem": "Why are canals well suited to the Punjab–Haryana plains?",
    "answer": "Flat terrain allows water to be distributed through channels",
    "distractors": [
      "The land is too steep for channels",
      "The region has no rivers or reservoirs",
      "Canals require permanent snowfall"
    ],
    "explanation": "Punjab and Haryana have extensive level plains where canal gradients can be managed over long distances. River and reservoir water can therefore be distributed across large farming areas.",
    "sourceFactIds": [
      "CANAL-PUNJAB-HARYANA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-075",
    "qlName": "Canal irrigation geography",
    "difficulty": "Medium",
    "stem": "Which canal feature distinguishes it from a tube-well?",
    "answer": "It conveys surface water horizontally through channels",
    "distractors": [
      "It always pumps groundwater vertically",
      "It stores water only in a village pond",
      "It depends only on rainfall falling directly on each field"
    ],
    "explanation": "Canals transport surface water through constructed channels, whereas tube-wells lift groundwater from aquifers. The water source and delivery path are different.",
    "sourceFactIds": [
      "CANAL-VS-TUBEWELL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-075",
    "qlName": "Canal irrigation geography",
    "difficulty": "Medium",
    "stem": "What problem can occur when canal irrigation is poorly managed in flat areas?",
    "answer": "Waterlogging and soil salinity",
    "distractors": [
      "Permanent mountain uplift",
      "Loss of daylight",
      "Conversion of soil into bedrock"
    ],
    "explanation": "Excess canal water and inadequate drainage can raise the water table and leave salts near the soil surface. Waterlogging and salinity can then reduce agricultural productivity.",
    "sourceFactIds": [
      "CANAL-WATERLOGGING-SALINITY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-075",
    "qlName": "Canal irrigation geography",
    "difficulty": "Hard",
    "stem": "Region A is an extensive level plain below a reservoir; Region B is a steep dissected hill area. Where is a large gravity-fed canal network easier to develop?",
    "answer": "Region A",
    "distractors": [
      "Region B",
      "Both are equally suitable regardless of relief",
      "Neither can use surface water"
    ],
    "explanation": "An extensive level plain allows canals to follow gentle gradients and distribute water over wide areas. Steep dissected terrain makes channel construction and control much harder.",
    "sourceFactIds": [
      "CANAL-RELIEF-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-076",
    "qlName": "Wells and tube-wells",
    "difficulty": "Easy",
    "stem": "Which irrigation source lifts water from below the ground?",
    "answer": "Well or tube-well",
    "distractors": [
      "River canal only",
      "Surface tank only",
      "Rain-fed field"
    ],
    "explanation": "Wells and tube-wells tap groundwater stored in aquifers beneath the surface. Pumps or lifting devices bring that water to fields for irrigation.",
    "sourceFactIds": [
      "WELL-GROUNDWATER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-076",
    "qlName": "Wells and tube-wells",
    "difficulty": "Easy",
    "stem": "Which condition favours tube-well irrigation?",
    "answer": "A productive groundwater aquifer",
    "distractors": [
      "No groundwater at any depth",
      "Only exposed bedrock without fractures",
      "Permanent ocean water"
    ],
    "explanation": "Tube-wells work best where aquifers store enough groundwater and can be recharged. Areas without usable groundwater cannot support extensive tube-well irrigation.",
    "sourceFactIds": [
      "TUBEWELL-AQUIFER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-076",
    "qlName": "Wells and tube-wells",
    "difficulty": "Medium",
    "stem": "Why are tube-wells common in many alluvial plains?",
    "answer": "Thick sediments can store accessible groundwater",
    "distractors": [
      "Alluvial plains contain no water underground",
      "Tube-wells require steep slopes",
      "Groundwater occurs only in deserts"
    ],
    "explanation": "Sand and gravel layers in alluvial deposits can hold substantial groundwater and are often easy to drill. This makes tube-wells practical across many river plains.",
    "sourceFactIds": [
      "TUBEWELL-ALLUVIAL-AQUIFER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-076",
    "qlName": "Wells and tube-wells",
    "difficulty": "Medium",
    "stem": "Which advantage does a private tube-well offer a farmer?",
    "answer": "Water can be supplied when the farmer needs it",
    "distractors": [
      "It guarantees unlimited groundwater forever",
      "It removes electricity or fuel needs",
      "It prevents all soil problems"
    ],
    "explanation": "A private tube-well can provide flexible irrigation according to crop timing rather than a shared canal schedule. Its usefulness still depends on groundwater availability and pumping costs.",
    "sourceFactIds": [
      "TUBEWELL-FLEXIBILITY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-076",
    "qlName": "Wells and tube-wells",
    "difficulty": "Medium",
    "stem": "What long-term risk arises when groundwater pumping greatly exceeds recharge?",
    "answer": "Falling groundwater levels",
    "distractors": [
      "Higher mountain peaks",
      "Longer daylight hours",
      "More river sediment automatically"
    ],
    "explanation": "When withdrawal repeatedly exceeds recharge, the water table can decline and wells may need to be deepened. Pumping can then become more costly and less reliable.",
    "sourceFactIds": [
      "TUBEWELL-GROUNDWATER-DECLINE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-076",
    "qlName": "Wells and tube-wells",
    "difficulty": "Hard",
    "stem": "District A has thick alluvium and a shallow aquifer; District B has little accessible groundwater. Which district is better suited to widespread tube-well irrigation?",
    "answer": "District A",
    "distractors": [
      "District B",
      "Both are identical because aquifers do not matter",
      "Neither can use groundwater"
    ],
    "explanation": "Tube-well irrigation depends on a usable aquifer, and thick alluvium often stores accessible groundwater. District A therefore offers much better physical conditions for pumping.",
    "sourceFactIds": [
      "TUBEWELL-AQUIFER-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-077",
    "qlName": "Tank irrigation geography",
    "difficulty": "Easy",
    "stem": "Tank irrigation is especially common in which type of region?",
    "answer": "Peninsular plateau areas with natural depressions",
    "distractors": [
      "Only glaciated peaks",
      "Open ocean",
      "Permanent snowfields"
    ],
    "explanation": "Peninsular plateau landscapes often contain undulating relief and natural depressions where runoff can be stored in tanks. These local reservoirs can irrigate nearby fields.",
    "sourceFactIds": [
      "TANK-PENINSULAR-PLATEAU"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-077",
    "qlName": "Tank irrigation geography",
    "difficulty": "Easy",
    "stem": "What does an irrigation tank primarily do?",
    "answer": "Stores surface runoff for later use",
    "distractors": [
      "Pumps water from deep aquifers",
      "Creates snowfall",
      "Carries ocean tides inland"
    ],
    "explanation": "An irrigation tank is a local surface-water storage structure that collects runoff or stream water. Farmers can then use the stored water during dry periods.",
    "sourceFactIds": [
      "TANK-STORAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-077",
    "qlName": "Tank irrigation geography",
    "difficulty": "Medium",
    "stem": "Why can hard-rock plateau relief favour tanks more than a dense canal network?",
    "answer": "Local depressions store runoff while rugged relief complicates long canals",
    "distractors": [
      "Hard rock automatically creates deep rivers everywhere",
      "Tanks need no runoff",
      "Canals work only on mountain summits"
    ],
    "explanation": "Undulating hard-rock terrain often contains depressions suitable for small reservoirs, while long canal routes are harder to maintain across uneven relief. Tanks fit this local water-storage pattern.",
    "sourceFactIds": [
      "TANK-VS-CANAL-RELIEF"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-077",
    "qlName": "Tank irrigation geography",
    "difficulty": "Medium",
    "stem": "Which condition can limit the reliability of a small irrigation tank?",
    "answer": "Low or highly variable seasonal runoff",
    "distractors": [
      "Excessively deep aquifers only",
      "Long daylight hours",
      "High latitude alone"
    ],
    "explanation": "Tanks depend on runoff entering their storage basin, so weak or erratic rainfall can leave them partly empty. Their reliability therefore varies with seasonal water inflow.",
    "sourceFactIds": [
      "TANK-RUNOFF-RELIABILITY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-077",
    "qlName": "Tank irrigation geography",
    "difficulty": "Medium",
    "stem": "Which irrigation source is most localised to a small catchment?",
    "answer": "Tank",
    "distractors": [
      "Major inter-basin canal",
      "Large river diversion canal",
      "Regional canal command system"
    ],
    "explanation": "A tank usually stores runoff from a relatively small local catchment and serves nearby fields. Large canal systems can distribute water over much wider areas.",
    "sourceFactIds": [
      "TANK-LOCAL-CATCHMENT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-077",
    "qlName": "Tank irrigation geography",
    "difficulty": "Hard",
    "stem": "A village lies on an undulating granite plateau where runoff collects in natural hollows. Which traditional irrigation source fits the setting?",
    "answer": "Tank",
    "distractors": [
      "Large delta canal only",
      "Ocean-tide irrigation",
      "Glacial melt channel"
    ],
    "explanation": "Natural hollows on hard-rock plateau terrain can be embanked to store seasonal runoff as tanks. This is a classic physical setting for tank irrigation.",
    "sourceFactIds": [
      "TANK-SETTING-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-078",
    "qlName": "Multiple cropping and cropping intensity",
    "difficulty": "Easy",
    "stem": "What does multiple cropping mean?",
    "answer": "Growing more than one crop on the same land within a year",
    "distractors": [
      "Growing only one crop for many years",
      "Leaving all fields uncultivated",
      "Using one seed variety across the country"
    ],
    "explanation": "Multiple cropping uses the same field for two or more crop cycles during a year. It increases the amount of land use without physically expanding the farm area.",
    "sourceFactIds": [
      "MULTIPLE-CROPPING-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-078",
    "qlName": "Multiple cropping and cropping intensity",
    "difficulty": "Easy",
    "stem": "Which factor strongly supports multiple cropping?",
    "answer": "Assured irrigation",
    "distractors": [
      "Permanent water shortage",
      "A very short growing season only",
      "No access to seed"
    ],
    "explanation": "Assured irrigation makes water available beyond the rainy season and allows additional crops to be planted. Fertile soil, inputs and suitable temperatures also help.",
    "sourceFactIds": [
      "MULTIPLE-CROPPING-IRRIGATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-078",
    "qlName": "Multiple cropping and cropping intensity",
    "difficulty": "Medium",
    "stem": "What happens to cropping intensity when the same field produces two crops instead of one in a year?",
    "answer": "Cropping intensity increases",
    "distractors": [
      "Cropping intensity becomes zero",
      "The cultivated area disappears",
      "Cropping intensity must decrease"
    ],
    "explanation": "Cropping intensity measures how often cultivated land is used for crops during a year. Producing two crops on the same field raises that intensity.",
    "sourceFactIds": [
      "CROPPING-INTENSITY-INCREASE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-078",
    "qlName": "Multiple cropping and cropping intensity",
    "difficulty": "Medium",
    "stem": "Which sequence is an example of multiple cropping?",
    "answer": "Rice in kharif followed by wheat in rabi",
    "distractors": [
      "Wheat once followed by a full year of fallow",
      "One plantation crop kept for years",
      "Only one rain-fed millet crop each year"
    ],
    "explanation": "Growing rice in the monsoon season and wheat on the same field in winter uses the land for two crop cycles within one year. That is multiple cropping.",
    "sourceFactIds": [
      "MULTIPLE-CROPPING-RICE-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-078",
    "qlName": "Multiple cropping and cropping intensity",
    "difficulty": "Medium",
    "stem": "Why can a long frost-free season raise cropping intensity?",
    "answer": "It provides more time for successive crop cycles",
    "distractors": [
      "It shortens the agricultural year",
      "It prevents second crops",
      "It removes the need for water"
    ],
    "explanation": "A longer suitable growing period gives farmers enough time to complete more than one crop cycle. Irrigation and inputs can then help use that climatic opportunity.",
    "sourceFactIds": [
      "CROPPING-INTENSITY-GROWING-SEASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-078",
    "qlName": "Multiple cropping and cropping intensity",
    "difficulty": "Hard",
    "stem": "Farm A grows one rain-fed crop each year; Farm B grows rice, wheat and a short summer crop using irrigation. Which farm has higher cropping intensity?",
    "answer": "Farm B",
    "distractors": [
      "Farm A",
      "Both are identical because field area is the same",
      "Cropping intensity cannot compare repeated use"
    ],
    "explanation": "Farm B uses the same land for three crop cycles within one year, while Farm A uses it once. Repeated annual use gives Farm B the higher cropping intensity.",
    "sourceFactIds": [
      "CROPPING-INTENSITY-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-079",
    "qlName": "HYV seeds, fertilisers and crop inputs",
    "difficulty": "Easy",
    "stem": "What does HYV mean in agriculture?",
    "answer": "High-yielding variety",
    "distractors": [
      "High-yearly valley",
      "Heavy-yield village",
      "High-yield vehicle"
    ],
    "explanation": "HYV stands for high-yielding variety and refers to crop varieties selected or bred for greater yield potential under suitable management. They often respond strongly to water and nutrients.",
    "sourceFactIds": [
      "HYV-FULL-FORM"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-079",
    "qlName": "HYV seeds, fertilisers and crop inputs",
    "difficulty": "Easy",
    "stem": "Which input supplies nutrients directly to crops?",
    "answer": "Fertiliser",
    "distractors": [
      "Harvest basket",
      "Road sign",
      "Weather map"
    ],
    "explanation": "Fertilisers provide plant nutrients such as nitrogen, phosphorus or potassium in forms crops can use. Their effect depends on balanced application, soil condition and water availability.",
    "sourceFactIds": [
      "FERTILISER-NUTRIENTS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-079",
    "qlName": "HYV seeds, fertilisers and crop inputs",
    "difficulty": "Medium",
    "stem": "Why do high-yielding crop varieties often need reliable irrigation?",
    "answer": "Their yield potential depends on avoiding moisture stress during growth",
    "distractors": [
      "HYV seeds grow only in standing seawater",
      "Irrigation reduces all plant growth",
      "They require drought at every stage"
    ],
    "explanation": "High-yielding varieties can produce strongly when water and nutrients are available, but moisture stress can limit that potential. Reliable irrigation therefore supports more stable performance.",
    "sourceFactIds": [
      "HYV-IRRIGATION-RESPONSE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-079",
    "qlName": "HYV seeds, fertilisers and crop inputs",
    "difficulty": "Medium",
    "stem": "Which combination forms a stronger productivity package than improved seed alone?",
    "answer": "Improved seed, irrigation and balanced nutrients",
    "distractors": [
      "Improved seed with no water or nutrients",
      "Only a new harvesting basket",
      "Seed plus permanent soil waterlogging"
    ],
    "explanation": "Improved seed performs best when moisture and nutrients are not limiting, so irrigation and balanced fertilisation complement genetic yield potential. Seed alone cannot remove every production constraint.",
    "sourceFactIds": [
      "HYV-INPUT-PACKAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-079",
    "qlName": "HYV seeds, fertilisers and crop inputs",
    "difficulty": "Medium",
    "stem": "Why should fertilisers be used in a balanced way?",
    "answer": "Excess or imbalanced nutrients can harm soil and crop efficiency",
    "distractors": [
      "More fertiliser always improves every soil without limit",
      "Crops never need nutrients",
      "Balanced use reduces all yields"
    ],
    "explanation": "Crops require nutrients in appropriate proportions, and excessive or unbalanced application can waste inputs and damage soil or water quality. Balanced nutrient management is more efficient.",
    "sourceFactIds": [
      "FERTILISER-BALANCED-USE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-079",
    "qlName": "HYV seeds, fertilisers and crop inputs",
    "difficulty": "Medium",
    "stem": "Which factor can prevent an HYV crop from reaching its yield potential?",
    "answer": "Severe shortage of water or nutrients",
    "distractors": [
      "Correct spacing",
      "Timely irrigation",
      "Adequate fertility"
    ],
    "explanation": "High-yielding varieties still depend on basic crop needs such as moisture and nutrients. A serious shortage of either can sharply limit the yield advantage of improved seed.",
    "sourceFactIds": [
      "HYV-LIMITING-FACTORS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-080",
    "qlName": "Mechanisation and farm power",
    "difficulty": "Easy",
    "stem": "Which machine is commonly used for rapid harvesting of grain crops?",
    "answer": "Combine harvester",
    "distractors": [
      "Tea plucking basket",
      "Jute retting tank",
      "Rubber tapping knife"
    ],
    "explanation": "A combine harvester can cut, thresh and clean grain in one operation, making harvest faster on suitable fields. It is especially useful in large, level cereal-growing areas.",
    "sourceFactIds": [
      "MECHANISATION-COMBINE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-080",
    "qlName": "Mechanisation and farm power",
    "difficulty": "Easy",
    "stem": "What is a major purpose of farm mechanisation?",
    "answer": "Completing agricultural operations more quickly and efficiently",
    "distractors": [
      "Stopping all crop production",
      "Removing all need for soil",
      "Changing the climate"
    ],
    "explanation": "Machines can speed land preparation, sowing, irrigation, harvesting and transport. This can help farmers complete time-sensitive operations within suitable weather windows.",
    "sourceFactIds": [
      "MECHANISATION-PURPOSE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-080",
    "qlName": "Mechanisation and farm power",
    "difficulty": "Medium",
    "stem": "Why are large level fields especially suitable for heavy farm machinery?",
    "answer": "Machines can move and operate efficiently across them",
    "distractors": [
      "Level land prevents machine movement",
      "Machines require steep cliffs",
      "Tractors work only in forests"
    ],
    "explanation": "Large level fields reduce turning, obstruction and slope problems for tractors and harvesters. This makes mechanised operations faster and easier than on tiny fragmented steep plots.",
    "sourceFactIds": [
      "MECHANISATION-LEVEL-FIELDS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-080",
    "qlName": "Mechanisation and farm power",
    "difficulty": "Medium",
    "stem": "Which farming problem can mechanisation help when harvest time is short?",
    "answer": "Labour bottlenecks during peak operations",
    "distractors": [
      "Latitude changes",
      "Length of the monsoon itself",
      "Natural soil colour"
    ],
    "explanation": "Harvest and sowing often must be completed within narrow time windows, and machines can substitute for large amounts of peak-season labour. They do not change geographic factors such as latitude.",
    "sourceFactIds": [
      "MECHANISATION-LABOUR-BOTTLENECK"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-080",
    "qlName": "Mechanisation and farm power",
    "difficulty": "Medium",
    "stem": "Why may very small fragmented holdings limit mechanisation?",
    "answer": "Large machines have less room to operate efficiently",
    "distractors": [
      "Small fields create permanent frost",
      "Machines require tidal water",
      "Fragmentation increases field size"
    ],
    "explanation": "Frequent boundaries and small plots reduce machine efficiency and increase turning or transport time. Consolidated or larger fields are generally easier to mechanise.",
    "sourceFactIds": [
      "MECHANISATION-FRAGMENTATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-080",
    "qlName": "Mechanisation and farm power",
    "difficulty": "Medium",
    "stem": "Which operation can a tractor support directly?",
    "answer": "Ploughing and field preparation",
    "distractors": [
      "Creating monsoon rainfall",
      "Changing soil parent rock",
      "Producing winter frost"
    ],
    "explanation": "Tractors provide mechanical power for ploughing, seed-bed preparation, hauling and other field operations. They cannot alter climate or the geological origin of soil.",
    "sourceFactIds": [
      "MECHANISATION-TRACTOR"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-081",
    "qlName": "Integrated irrigation and input suitability reasoning",
    "difficulty": "Easy",
    "stem": "Which combination most strongly supports intensive year-round cropping?",
    "answer": "Irrigation, improved seed and adequate nutrients",
    "distractors": [
      "No water, poor seed and depleted soil",
      "Only rainfall during one short period",
      "Permanent fallow"
    ],
    "explanation": "Year-round intensive cropping requires reliable moisture, productive seed and sufficient nutrients. These inputs together reduce constraints that would otherwise limit repeated crop cycles.",
    "sourceFactIds": [
      "INPUTS-INTEGRATED-YEARROUND"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-081",
    "qlName": "Integrated irrigation and input suitability reasoning",
    "difficulty": "Easy",
    "stem": "Which irrigation source is the strongest match for a shallow alluvial aquifer?",
    "answer": "Tube-well",
    "distractors": [
      "Tank on a rocky hill only",
      "Ocean tide",
      "Snowfield channel"
    ],
    "explanation": "A shallow productive aquifer in alluvial sediments is well suited to tube-well pumping. Tanks store surface runoff and do not directly tap groundwater.",
    "sourceFactIds": [
      "INPUTS-INTEGRATED-TUBEWELL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-081",
    "qlName": "Integrated irrigation and input suitability reasoning",
    "difficulty": "Medium",
    "stem": "Which irrigation source is more suitable for an undulating hard-rock plateau with runoff-filled depressions?",
    "answer": "Tank",
    "distractors": [
      "Large plain canal only",
      "Tube-well regardless of groundwater",
      "Ocean current"
    ],
    "explanation": "Undulating hard-rock terrain often contains natural depressions where runoff can be stored in tanks. A large canal network is less convenient across rugged relief.",
    "sourceFactIds": [
      "INPUTS-INTEGRATED-TANK"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-081",
    "qlName": "Integrated irrigation and input suitability reasoning",
    "difficulty": "Medium",
    "stem": "A farmer has HYV seed but unreliable water. Which investment most directly protects the seed's yield potential?",
    "answer": "Assured irrigation",
    "distractors": [
      "Removing field channels",
      "Reducing all water storage",
      "Leaving the crop without moisture"
    ],
    "explanation": "High-yielding seed needs adequate moisture to express its yield potential, so reliable irrigation directly addresses the limiting factor. Seed improvement cannot compensate for severe drought by itself.",
    "sourceFactIds": [
      "INPUTS-INTEGRATED-HYV-WATER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-081",
    "qlName": "Integrated irrigation and input suitability reasoning",
    "difficulty": "Medium",
    "stem": "Which farm setting is most favourable for mechanised multiple cropping?",
    "answer": "Level irrigated fields with road access",
    "distractors": [
      "Tiny steep isolated plots without water",
      "Permanent snowfields",
      "Waterlogged tidal marsh"
    ],
    "explanation": "Level irrigated land supports repeated cropping, while roads and regular field shapes make machinery easier to use and move. Steep isolated plots create several operational constraints.",
    "sourceFactIds": [
      "INPUTS-INTEGRATED-MECH-CROPPING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-081",
    "qlName": "Integrated irrigation and input suitability reasoning",
    "difficulty": "Medium",
    "stem": "Which statement links irrigation and cropping intensity correctly?",
    "answer": "Reliable irrigation can raise cropping intensity by supporting extra seasonal crops",
    "distractors": [
      "Irrigation always reduces the number of crops",
      "Cropping intensity depends only on farm size",
      "Water supply has no effect on dry-season cultivation"
    ],
    "explanation": "When water remains available after the monsoon, farmers can plant rabi or summer crops on the same land. This repeated annual use raises cropping intensity.",
    "sourceFactIds": [
      "INPUTS-INTEGRATED-IRRIGATION-INTENSITY"
    ]
  }
]);

export const GEO_AGR_001_CP004_IRRIGATION_INPUTS_SEGMENT_V1: readonly GeoAgr001Question[] = Object.freeze(
  RAW.map((raw, index) => Object.freeze({
    questionId: `GEO-AGR-001-CP004-II-Q${String(index + 1).padStart(3, "0")}`,
    qlId: raw.qlId, qlName: raw.qlName, difficulty: raw.difficulty, stem: raw.stem,
    options: placeGeoAgrOptions(raw.answer, raw.distractors, index % 4),
    correctIndex: index % 4, canonicalAnswer: raw.answer, explanation: raw.explanation,
    sourceIds: GEO_AGR_001_SOURCE_IDS, sourceFactIds: Object.freeze([...raw.sourceFactIds]),
    reviewOnly: true as const, runtimeRegistered: false as const,
  })),
);

export function auditGeoAgr001Cp004IrrigationInputsSegmentV1() {
  return auditGeoAgr001Batch(GEO_AGR_001_CP004_IRRIGATION_INPUTS_SEGMENT_V1, 73, 81);
}
