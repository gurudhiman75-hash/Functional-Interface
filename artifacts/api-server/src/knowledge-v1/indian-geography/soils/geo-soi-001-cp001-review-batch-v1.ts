import {
  GEO_SOI_001_SOURCE_IDS,
  placeGeoSoiOptions,
  type GeoSoi001Difficulty,
  type GeoSoi001Question,
} from "./geo-soi-001-review-types";

type RawQuestion = Readonly<{
  qlId: string;
  qlName: string;
  difficulty: GeoSoi001Difficulty;
  stem: string;
  answer: string;
  distractors: readonly string[];
  explanation: string;
  sourceFactIds: readonly string[];
}>;

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-SOI-001-QL-001",
    "qlName": "Soil as a natural resource",
    "difficulty": "Easy",
    "stem": "Soil is considered which type of natural resource in standard Indian geography?",
    "answer": "A renewable natural resource",
    "distractors": [
      "A non-renewable metallic resource",
      "A fossil-fuel resource",
      "An artificial agricultural input"
    ],
    "explanation": "Soil is treated as a renewable natural resource because natural processes can form and renew it, although this renewal is extremely slow. This matters because healthy topsoil stores water and nutrients for plants, while severe soil loss directly reduces the productivity of land.",
    "sourceFactIds": [
      "SOIL-RENEWABLE-RESOURCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-001",
    "qlName": "Soil as a natural resource",
    "difficulty": "Easy",
    "stem": "Which natural resource provides the basic medium for most land plants to grow?",
    "answer": "Soil",
    "distractors": [
      "Coal",
      "Groundwater alone",
      "Granite"
    ],
    "explanation": "Soil anchors plant roots and supplies water, air and nutrients. This makes it the basic growth medium for most terrestrial vegetation. This matters because healthy topsoil stores water and nutrients for plants, while severe soil loss directly reduces the productivity of land.",
    "sourceFactIds": [
      "SOIL-PLANT-GROWTH-MEDIUM"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-001",
    "qlName": "Soil as a natural resource",
    "difficulty": "Medium",
    "stem": "Why is soil especially important for agriculture?",
    "answer": "It supports roots and supplies water and nutrients to crops",
    "distractors": [
      "It fixes the amount of annual rainfall",
      "It determines the length of daylight",
      "It prevents all crop diseases"
    ],
    "explanation": "Agricultural plants depend on soil for root support, moisture and nutrients. Soil therefore directly influences crop growth and productivity. This matters because healthy topsoil stores water and nutrients for plants, while severe soil loss directly reduces the productivity of land.",
    "sourceFactIds": [
      "SOIL-AGRICULTURE-ROLE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-001",
    "qlName": "Soil as a natural resource",
    "difficulty": "Medium",
    "stem": "Which statement best explains why soil is both renewable and vulnerable?",
    "answer": "It can form naturally, but formation is much slower than rapid erosion or misuse",
    "distractors": [
      "It is renewed instantly after every crop",
      "It cannot be damaged by erosion",
      "It forms only through human activity"
    ],
    "explanation": "Soil can be renewed by natural formation processes, but those processes are very slow. Erosion or poor land use can remove fertile soil much faster. This matters because healthy topsoil stores water and nutrients for plants, while severe soil loss directly reduces the productivity of land.",
    "sourceFactIds": [
      "SOIL-RENEWAL-SLOW"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-001",
    "qlName": "Soil as a natural resource",
    "difficulty": "Medium",
    "stem": "A farmer loses the fertile surface layer after repeated erosion. Why is this a serious resource loss?",
    "answer": "The most useful plant-growing part of the soil has been removed",
    "distractors": [
      "Only the bedrock has been exposed to sunlight",
      "Rainfall over the farm will permanently stop",
      "The latitude of the farm will change"
    ],
    "explanation": "The surface soil contains much of the organic matter and active root zone. Losing it reduces the soil's capacity to support crops. This matters because healthy topsoil stores water and nutrients for plants, while severe soil loss directly reduces the productivity of land.",
    "sourceFactIds": [
      "TOPSOIL-RESOURCE-VALUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-001",
    "qlName": "Soil as a natural resource",
    "difficulty": "Medium",
    "stem": "Consider the following statements about soil:\nI. It supports terrestrial plant growth.\nII. It can be renewed by natural processes.\nIII. Its formation is generally rapid enough to replace severe erosion immediately.\nWhich statements are correct?",
    "answer": "I and II only",
    "distractors": [
      "I only",
      "II and III only",
      "I, II and III"
    ],
    "explanation": "Statements I and II are correct. Soil supports plant growth and is renewable, but soil formation is very slow compared with severe erosion. This matters because healthy topsoil stores water and nutrients for plants, while severe soil loss directly reduces the productivity of land.",
    "sourceFactIds": [
      "SOIL-RENEWABLE-SLOW"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-002",
    "qlName": "Factors of soil formation",
    "difficulty": "Easy",
    "stem": "Which set contains recognised factors of soil formation?",
    "answer": "Relief, parent material, climate, organisms and time",
    "distractors": [
      "Longitude, tides, ocean salinity and eclipses",
      "Population, literacy, trade and transport",
      "Latitude alone, with no other control"
    ],
    "explanation": "Soil develops through the combined influence of relief, parent material, climate, living organisms and time. These controls work together, so the same parent rock can produce different soils when climate, relief, organisms or time are different.",
    "sourceFactIds": [
      "SOIL-FORMATION-FACTORS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-002",
    "qlName": "Factors of soil formation",
    "difficulty": "Easy",
    "stem": "Which factor allows soil-forming processes to operate over long periods?",
    "answer": "Time",
    "distractors": [
      "Longitude",
      "Political boundary",
      "Crop price"
    ],
    "explanation": "Time is essential because weathering, organic activity and horizon development operate gradually. Mature soils require long periods to develop. These controls work together, so the same parent rock can produce different soils when climate, relief, organisms or time are different.",
    "sourceFactIds": [
      "SOIL-FORMATION-TIME"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-002",
    "qlName": "Factors of soil formation",
    "difficulty": "Medium",
    "stem": "Two places have the same parent rock but very different rainfall and vegetation. Why can their soils still differ?",
    "answer": "Climate and organisms also influence soil formation",
    "distractors": [
      "Parent rock fixes every soil property permanently",
      "Only longitude controls soil development",
      "Soil formation stops where vegetation differs"
    ],
    "explanation": "Parent material is only one control. Different climate and biological activity can change weathering, organic matter and other soil characteristics. These controls work together, so the same parent rock can produce different soils when climate, relief, organisms or time are different.",
    "sourceFactIds": [
      "SOIL-FACTORS-INTERACTION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-002",
    "qlName": "Factors of soil formation",
    "difficulty": "Medium",
    "stem": "A steep slope and a nearby level plain have the same climate and rock. Which soil-forming factor differs most directly?",
    "answer": "Relief",
    "distractors": [
      "Time zone",
      "Ocean current",
      "Latitude"
    ],
    "explanation": "The main difference is topography. Relief affects runoff, erosion, drainage and the amount of soil material that can accumulate. These controls work together, so the same parent rock can produce different soils when climate, relief, organisms or time are different.",
    "sourceFactIds": [
      "SOIL-RELIEF-FACTOR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-002",
    "qlName": "Factors of soil formation",
    "difficulty": "Medium",
    "stem": "Which pair correctly matches a soil-forming factor with its role?",
    "answer": "Parent material — supplies mineral material from which soil develops",
    "distractors": [
      "Time — fixes annual rainfall",
      "Relief — determines Earth's rotation",
      "Organisms — create the parent rock"
    ],
    "explanation": "Parent material provides much of the mineral base of a soil. Other factors then modify that material during soil development. These controls work together, so the same parent rock can produce different soils when climate, relief, organisms or time are different.",
    "sourceFactIds": [
      "SOIL-PARENT-MATERIAL-ROLE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-002",
    "qlName": "Factors of soil formation",
    "difficulty": "Hard",
    "stem": "A soil develops on basalt under a warm wet climate, dense vegetation and gentle relief for a long period. Which conclusion is most accurate?",
    "answer": "Its properties reflect several interacting soil-forming factors, not basalt alone",
    "distractors": [
      "Only basalt can influence the soil",
      "Climate matters only after the soil is fully formed",
      "Vegetation and relief cannot affect soil development"
    ],
    "explanation": "Soil properties result from interacting controls. Parent rock matters, but climate, organisms, relief and time also shape the developing soil. These controls work together, so the same parent rock can produce different soils when climate, relief, organisms or time are different.",
    "sourceFactIds": [
      "SOIL-MULTIFACTOR-FORMATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-003",
    "qlName": "Parent material and weathering",
    "difficulty": "Easy",
    "stem": "What is meant by parent material in soil formation?",
    "answer": "The mineral material from which the soil develops",
    "distractors": [
      "The crop grown after soil formation",
      "Only the organic litter at the surface",
      "The annual rainfall total"
    ],
    "explanation": "Parent material is the underlying or transported mineral material from which soil develops through weathering and other processes. Weathered mineral material is only the starting point; a developed soil also reflects moisture, organisms, organic matter and long-term change.",
    "sourceFactIds": [
      "PARENT-MATERIAL-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-003",
    "qlName": "Parent material and weathering",
    "difficulty": "Easy",
    "stem": "Which process breaks down rock and helps produce material for soil formation?",
    "answer": "Weathering",
    "distractors": [
      "Photosynthesis",
      "Irrigation",
      "Pollination"
    ],
    "explanation": "Weathering breaks and alters rock into smaller and chemically changed material that contributes to soil development. Weathered mineral material is only the starting point; a developed soil also reflects moisture, organisms, organic matter and long-term change.",
    "sourceFactIds": [
      "WEATHERING-SOIL-FORMATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-003",
    "qlName": "Parent material and weathering",
    "difficulty": "Medium",
    "stem": "Why can two soils formed from different parent rocks have different mineral characteristics?",
    "answer": "Parent material contributes different minerals to the developing soils",
    "distractors": [
      "Minerals are added only by rainfall",
      "All rocks weather into identical material",
      "Soils contain no mineral component"
    ],
    "explanation": "Different rocks contain different mineral mixtures. Their weathered material therefore gives developing soils different mineral characteristics. Weathered mineral material is only the starting point; a developed soil also reflects moisture, organisms, organic matter and long-term change.",
    "sourceFactIds": [
      "PARENT-MATERIAL-MINERALS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-003",
    "qlName": "Parent material and weathering",
    "difficulty": "Medium",
    "stem": "A freshly exposed rock surface has little or no developed soil. Which change is necessary before a soil profile can form?",
    "answer": "Weathering and accumulation of organic material over time",
    "distractors": [
      "A change in longitude",
      "A permanent stop in rainfall",
      "Removal of all living organisms"
    ],
    "explanation": "Rock must weather into mineral material, while biological activity adds organic matter. Continued development over time produces soil horizons. Weathered mineral material is only the starting point; a developed soil also reflects moisture, organisms, organic matter and long-term change.",
    "sourceFactIds": [
      "WEATHERING-ORGANIC-ACCUMULATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-003",
    "qlName": "Parent material and weathering",
    "difficulty": "Medium",
    "stem": "Which statement best distinguishes parent material from fully developed soil?",
    "answer": "Soil includes altered mineral material plus effects of climate, organisms and time",
    "distractors": [
      "They are always exactly the same",
      "Parent material contains the complete mature soil profile",
      "Developed soil has no relation to rock material"
    ],
    "explanation": "A developed soil is more than broken rock. Its properties reflect mineral material modified by climate, organisms, relief and time. Weathered mineral material is only the starting point; a developed soil also reflects moisture, organisms, organic matter and long-term change.",
    "sourceFactIds": [
      "PARENT-MATERIAL-VS-SOIL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-003",
    "qlName": "Parent material and weathering",
    "difficulty": "Hard",
    "stem": "Two sites have identical climate, vegetation, relief and age, but one develops on basalt and the other on sandstone. Which factor most directly explains mineral differences between their soils?",
    "answer": "Parent material",
    "distractors": [
      "Time zone",
      "Wind direction on one day",
      "Political administration"
    ],
    "explanation": "With the other major formation factors held similar, the contrasting parent rocks are the clearest reason for differences in mineral composition. Weathered mineral material is only the starting point; a developed soil also reflects moisture, organisms, organic matter and long-term change.",
    "sourceFactIds": [
      "PARENT-MATERIAL-CONTROL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-004",
    "qlName": "Climate and soil formation",
    "difficulty": "Easy",
    "stem": "Which climatic elements strongly influence soil formation?",
    "answer": "Temperature and rainfall",
    "distractors": [
      "Longitude and time zone",
      "Population and transport",
      "Magnetic declination only"
    ],
    "explanation": "Temperature and rainfall affect weathering, moisture, leaching and biological activity, making climate a major soil-forming control. Climate affects both the speed of weathering and the movement of materials through soil, so rainfall and temperature shape the developing profile.",
    "sourceFactIds": [
      "CLIMATE-TEMP-RAINFALL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-004",
    "qlName": "Climate and soil formation",
    "difficulty": "Easy",
    "stem": "How does rainfall contribute to soil development?",
    "answer": "It supplies moisture for weathering and movement of materials",
    "distractors": [
      "It prevents all chemical change",
      "It fixes the parent rock type",
      "It removes the need for time"
    ],
    "explanation": "Rainwater supports chemical weathering and can move dissolved or fine material through the soil profile. Climate affects both the speed of weathering and the movement of materials through soil, so rainfall and temperature shape the developing profile.",
    "sourceFactIds": [
      "RAINFALL-WEATHERING-MOVEMENT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-004",
    "qlName": "Climate and soil formation",
    "difficulty": "Medium",
    "stem": "Why does a warm, wet climate often promote stronger chemical weathering than a cold, dry climate?",
    "answer": "Heat and moisture increase many chemical reactions",
    "distractors": [
      "Warm climates stop rock breakdown",
      "Dry air produces more chemical solution than water",
      "Temperature has no effect on weathering"
    ],
    "explanation": "Chemical weathering generally becomes more active where both warmth and moisture are available for reactions involving minerals and water. Climate affects both the speed of weathering and the movement of materials through soil, so rainfall and temperature shape the developing profile.",
    "sourceFactIds": [
      "WARM-WET-CHEMICAL-WEATHERING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-004",
    "qlName": "Climate and soil formation",
    "difficulty": "Medium",
    "stem": "A region becomes much drier while its parent rock remains unchanged. Which soil-forming control has changed?",
    "answer": "Climate",
    "distractors": [
      "Parent material",
      "Latitude of the planet",
      "Bedrock age automatically"
    ],
    "explanation": "A major change in rainfall changes the climatic control of soil formation, even though the underlying parent material remains the same. Climate affects both the speed of weathering and the movement of materials through soil, so rainfall and temperature shape the developing profile.",
    "sourceFactIds": [
      "CLIMATE-CHANGE-SOIL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-004",
    "qlName": "Climate and soil formation",
    "difficulty": "Medium",
    "stem": "Which outcome is most directly linked with high rainfall in soil development?",
    "answer": "Greater movement and leaching of soluble materials",
    "distractors": [
      "Complete absence of weathering",
      "Automatic formation of black soil everywhere",
      "Permanent prevention of erosion"
    ],
    "explanation": "Abundant rainfall can move soluble materials downward through the soil and increase leaching, depending on drainage and other conditions. Climate affects both the speed of weathering and the movement of materials through soil, so rainfall and temperature shape the developing profile.",
    "sourceFactIds": [
      "RAINFALL-LEACHING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-004",
    "qlName": "Climate and soil formation",
    "difficulty": "Medium",
    "stem": "Site A is warm and humid; Site B is cool and dry. Both have similar rock, relief and age. Which difference is most likely to affect their rate of soil-forming reactions?",
    "answer": "The contrast in temperature and moisture",
    "distractors": [
      "Their political boundaries",
      "Their standard time meridians",
      "Their map scale"
    ],
    "explanation": "Climate differs strongly between the sites. Temperature and moisture directly influence weathering and biological processes that build soil. Climate affects both the speed of weathering and the movement of materials through soil, so rainfall and temperature shape the developing profile.",
    "sourceFactIds": [
      "CLIMATE-RATE-SOIL-FORMATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-005",
    "qlName": "Relief and topography",
    "difficulty": "Easy",
    "stem": "Which soil-forming factor includes slope and elevation?",
    "answer": "Relief",
    "distractors": [
      "Time",
      "Parent material",
      "Organisms"
    ],
    "explanation": "Relief refers to topographic conditions such as slope and elevation. It affects drainage, erosion and soil accumulation. Slope controls how quickly water and loose material move, which is why steep land often loses soil while gentler land can retain or collect it.",
    "sourceFactIds": [
      "RELIEF-SLOPE-ELEVATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-005",
    "qlName": "Relief and topography",
    "difficulty": "Easy",
    "stem": "Why are soils on steep slopes often thinner than those on nearby gentle slopes?",
    "answer": "Erosion removes soil material more easily from steep slopes",
    "distractors": [
      "Steep slopes receive no sunlight",
      "Parent rock disappears on slopes",
      "Humus cannot exist above sea level"
    ],
    "explanation": "Runoff and gravity remove loose material more readily from steep slopes, limiting the thickness of the developing soil. Slope controls how quickly water and loose material move, which is why steep land often loses soil while gentler land can retain or collect it.",
    "sourceFactIds": [
      "STEEP-SLOPE-THIN-SOIL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-005",
    "qlName": "Relief and topography",
    "difficulty": "Medium",
    "stem": "Where is eroded soil material more likely to accumulate?",
    "answer": "On lower or gentler positions where transport slows",
    "distractors": [
      "Only on the steepest ridge crest",
      "In the upper atmosphere",
      "At the same rate on every slope position"
    ],
    "explanation": "Material removed from upper slopes can be deposited where the slope becomes gentler and water or gravity loses transporting power. Slope controls how quickly water and loose material move, which is why steep land often loses soil while gentler land can retain or collect it.",
    "sourceFactIds": [
      "RELIEF-DEPOSITION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-005",
    "qlName": "Relief and topography",
    "difficulty": "Medium",
    "stem": "Two nearby sites share the same rock and rainfall. One is a steep hillside and the other a level valley floor. Why may the valley have deeper soil?",
    "answer": "Less erosion and greater accumulation favour deeper soil",
    "distractors": [
      "Valleys always have younger parent rock",
      "Slope has no effect on soil depth",
      "The valley receives a different latitude"
    ],
    "explanation": "Gentler terrain generally loses less soil and can receive deposited material from higher ground, allowing a deeper profile to develop. Slope controls how quickly water and loose material move, which is why steep land often loses soil while gentler land can retain or collect it.",
    "sourceFactIds": [
      "RELIEF-SOIL-DEPTH"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-005",
    "qlName": "Relief and topography",
    "difficulty": "Medium",
    "stem": "Which relation between relief and soil is correct?",
    "answer": "Topography influences drainage, erosion and soil thickness",
    "distractors": [
      "Relief determines all soil nutrients by itself",
      "Slope changes Earth's climate zone instantly",
      "Elevation prevents weathering"
    ],
    "explanation": "Relief affects how water moves, how strongly erosion acts and where material accumulates. These processes influence soil depth and development. Slope controls how quickly water and loose material move, which is why steep land often loses soil while gentler land can retain or collect it.",
    "sourceFactIds": [
      "RELIEF-DRAINAGE-EROSION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-005",
    "qlName": "Relief and topography",
    "difficulty": "Hard",
    "stem": "A hilltop, steep midslope and valley floor have the same parent rock and climate. Which sequence of soil depth is most plausible where erosion dominates the slope?",
    "answer": "Valley floor deepest, steep midslope thinnest",
    "distractors": [
      "Steep midslope deepest, valley floor thinnest",
      "All three must have identical depth",
      "Hilltop depth is fixed only by longitude"
    ],
    "explanation": "The steep midslope is most exposed to erosion, while the valley floor can accumulate transported material and therefore develop a deeper soil. Slope controls how quickly water and loose material move, which is why steep land often loses soil while gentler land can retain or collect it.",
    "sourceFactIds": [
      "RELIEF-SEQUENCE-SOIL-DEPTH"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-006",
    "qlName": "Vegetation, organisms and humus",
    "difficulty": "Easy",
    "stem": "What does vegetation add to soil when plant remains decompose?",
    "answer": "Organic matter or humus",
    "distractors": [
      "Granite bedrock",
      "Ocean salt only",
      "Longitude"
    ],
    "explanation": "Dead plant material decomposes and contributes organic matter. This helps form humus in the upper part of the soil. Organic matter from plants and other organisms becomes humus, which improves nutrient supply, moisture holding and the condition of the upper soil.",
    "sourceFactIds": [
      "VEGETATION-HUMUS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-006",
    "qlName": "Vegetation, organisms and humus",
    "difficulty": "Easy",
    "stem": "Which organisms help decompose dead organic material in soil?",
    "answer": "Microorganisms",
    "distractors": [
      "Only large grazing animals",
      "Ocean currents",
      "Clouds"
    ],
    "explanation": "Soil microorganisms break down dead plant and animal material, helping convert it into humus and release nutrients. Organic matter from plants and other organisms becomes humus, which improves nutrient supply, moisture holding and the condition of the upper soil.",
    "sourceFactIds": [
      "MICROORGANISMS-DECOMPOSITION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-006",
    "qlName": "Vegetation, organisms and humus",
    "difficulty": "Medium",
    "stem": "Why is humus important in the upper soil layer?",
    "answer": "It contributes organic matter and supports soil fertility",
    "distractors": [
      "It turns every soil into alluvial soil",
      "It prevents roots from entering soil",
      "It replaces all mineral particles"
    ],
    "explanation": "Humus adds organic material and helps improve nutrient supply and soil structure, making the upper soil layer more favourable for plants. Organic matter from plants and other organisms becomes humus, which improves nutrient supply, moisture holding and the condition of the upper soil.",
    "sourceFactIds": [
      "HUMUS-FERTILITY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-006",
    "qlName": "Vegetation, organisms and humus",
    "difficulty": "Medium",
    "stem": "A soil under dense vegetation receives continuous leaf litter. Which soil-forming influence is being added most directly?",
    "answer": "Biological input of organic matter",
    "distractors": [
      "A change in parent rock",
      "A change in longitude",
      "A change in Earth's orbit"
    ],
    "explanation": "Leaf litter is biological material. Its decomposition adds organic matter and contributes to the development of the soil's upper horizons. Organic matter from plants and other organisms becomes humus, which improves nutrient supply, moisture holding and the condition of the upper soil.",
    "sourceFactIds": [
      "LITTER-BIOLOGICAL-INPUT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-006",
    "qlName": "Vegetation, organisms and humus",
    "difficulty": "Medium",
    "stem": "Which statement best explains the role of living organisms in soil formation?",
    "answer": "They add and decompose organic matter and can mix the soil",
    "distractors": [
      "They determine the age of the parent rock",
      "They stop weathering completely",
      "They control national rainfall patterns"
    ],
    "explanation": "Plants, microorganisms and soil animals influence organic matter, nutrient cycling and mixing, so biological activity is an important soil-forming factor. Organic matter from plants and other organisms becomes humus, which improves nutrient supply, moisture holding and the condition of the upper soil.",
    "sourceFactIds": [
      "ORGANISMS-SOIL-ROLE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-006",
    "qlName": "Vegetation, organisms and humus",
    "difficulty": "Hard",
    "stem": "Two soils have similar rock, relief and rainfall, but one supports dense vegetation while the other has very sparse plant cover. Which property is most directly likely to differ because of vegetation?",
    "answer": "The amount of organic matter added to the surface soil",
    "distractors": [
      "The longitude of the site",
      "The mineral age of the parent rock",
      "The direction of Earth's rotation"
    ],
    "explanation": "Different vegetation cover changes how much litter and other organic material enters the soil, which can alter humus content and upper-horizon development. Organic matter from plants and other organisms becomes humus, which improves nutrient supply, moisture holding and the condition of the upper soil.",
    "sourceFactIds": [
      "VEGETATION-ORGANIC-MATTER"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-007",
    "qlName": "Soil profile and horizons",
    "difficulty": "Easy",
    "stem": "Which soil horizon is commonly called topsoil?",
    "answer": "A horizon",
    "distractors": [
      "B horizon",
      "C horizon",
      "Bedrock"
    ],
    "explanation": "The A horizon is the upper mineral soil layer and is commonly referred to as topsoil. It contains much of the active root zone and organic matter. In a simple soil profile, the A horizon is topsoil, the B horizon is subsoil, and the C horizon contains weathered parent material above bedrock.",
    "sourceFactIds": [
      "A-HORIZON-TOPSOIL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-007",
    "qlName": "Soil profile and horizons",
    "difficulty": "Easy",
    "stem": "Which soil horizon is commonly called subsoil?",
    "answer": "B horizon",
    "distractors": [
      "A horizon",
      "C horizon",
      "Surface litter only"
    ],
    "explanation": "The B horizon lies below the topsoil and is commonly called subsoil. Materials moved downward from above may accumulate there. In a simple soil profile, the A horizon is topsoil, the B horizon is subsoil, and the C horizon contains weathered parent material above bedrock.",
    "sourceFactIds": [
      "B-HORIZON-SUBSOIL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-007",
    "qlName": "Soil profile and horizons",
    "difficulty": "Medium",
    "stem": "Which layer contains partly weathered parent material below the main soil horizons?",
    "answer": "C horizon",
    "distractors": [
      "A horizon only",
      "B horizon only",
      "The atmosphere"
    ],
    "explanation": "The C horizon consists largely of weathered parent material and lies below the more developed A and B horizons. In a simple soil profile, the A horizon is topsoil, the B horizon is subsoil, and the C horizon contains weathered parent material above bedrock.",
    "sourceFactIds": [
      "C-HORIZON-PARENT-MATERIAL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-007",
    "qlName": "Soil profile and horizons",
    "difficulty": "Medium",
    "stem": "A plant root begins at the surface and grows downward through topsoil and then subsoil. Which sequence is correct?",
    "answer": "A horizon → B horizon",
    "distractors": [
      "B horizon → A horizon",
      "C horizon → atmosphere",
      "Bedrock → A horizon"
    ],
    "explanation": "Topsoil is the A horizon, and the B horizon lies beneath it as subsoil. This is the normal downward order in a simple soil profile. In a simple soil profile, the A horizon is topsoil, the B horizon is subsoil, and the C horizon contains weathered parent material above bedrock.",
    "sourceFactIds": [
      "A-B-HORIZON-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-007",
    "qlName": "Soil profile and horizons",
    "difficulty": "Medium",
    "stem": "Which part of a soil profile is closest to unweathered bedrock?",
    "answer": "The C horizon",
    "distractors": [
      "The A horizon",
      "The surface litter layer",
      "The crop canopy"
    ],
    "explanation": "The C horizon is the lowest major soil horizon in the simplified profile and consists of weathered parent material above bedrock. In a simple soil profile, the A horizon is topsoil, the B horizon is subsoil, and the C horizon contains weathered parent material above bedrock.",
    "sourceFactIds": [
      "C-HORIZON-BEDROCK"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-007",
    "qlName": "Soil profile and horizons",
    "difficulty": "Medium",
    "stem": "A profile shows a dark root-rich surface layer, a lower zone of accumulation, and weathered rock beneath. Which sequence identifies these layers?",
    "answer": "A horizon → B horizon → C horizon",
    "distractors": [
      "C horizon → A horizon → B horizon",
      "B horizon → C horizon → A horizon",
      "A horizon → C horizon → B horizon"
    ],
    "explanation": "The A horizon forms the topsoil, the B horizon is the subsoil and zone of accumulation, and the C horizon contains weathered parent material. In a simple soil profile, the A horizon is topsoil, the B horizon is subsoil, and the C horizon contains weathered parent material above bedrock.",
    "sourceFactIds": [
      "ABC-HORIZON-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-008",
    "qlName": "Major soil groups of India",
    "difficulty": "Easy",
    "stem": "Which of the following is a major soil group of India?",
    "answer": "Alluvial soil",
    "distractors": [
      "Coral reef soil only",
      "Glacial ice soil",
      "Tundra permafrost soil"
    ],
    "explanation": "Alluvial soil is one of India's major soil groups and is especially extensive across the northern plains and major river deposits. Soil groups classify whole soil types across regions, while horizons such as A, B and C describe vertical layers inside a single soil profile.",
    "sourceFactIds": [
      "INDIA-MAJOR-SOIL-ALLUVIAL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-008",
    "qlName": "Major soil groups of India",
    "difficulty": "Easy",
    "stem": "Which list contains only major soil groups commonly used in Indian geography?",
    "answer": "Alluvial, black, red and yellow, laterite",
    "distractors": [
      "Alluvial, tundra, podzol, prairie",
      "Chernozem, tundra, coral, loess only",
      "Black, oceanic, polar, volcanic ash only"
    ],
    "explanation": "Alluvial, black, red and yellow, and laterite are among the standard major soil groups used in Indian geography. Soil groups classify whole soil types across regions, while horizons such as A, B and C describe vertical layers inside a single soil profile.",
    "sourceFactIds": [
      "INDIA-MAJOR-SOIL-GROUPS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-008",
    "qlName": "Major soil groups of India",
    "difficulty": "Medium",
    "stem": "Which pair contains two major Indian soil groups rather than soil horizons?",
    "answer": "Arid soil and forest soil",
    "distractors": [
      "A horizon and B horizon",
      "Topsoil and subsoil",
      "Bedrock and parent material"
    ],
    "explanation": "Arid and forest soils are major Indian soil groups. A and B horizons are layers within a soil profile, not national soil classes. Soil groups classify whole soil types across regions, while horizons such as A, B and C describe vertical layers inside a single soil profile.",
    "sourceFactIds": [
      "SOIL-GROUP-VS-HORIZON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-008",
    "qlName": "Major soil groups of India",
    "difficulty": "Medium",
    "stem": "A question asks for India's major soil classes. Which item should be excluded because it is a horizon rather than a soil group?",
    "answer": "B horizon",
    "distractors": [
      "Black soil",
      "Laterite soil",
      "Alluvial soil"
    ],
    "explanation": "The B horizon is the subsoil layer within a profile. Black, laterite and alluvial are recognised major soil groups. Soil groups classify whole soil types across regions, while horizons such as A, B and C describe vertical layers inside a single soil profile.",
    "sourceFactIds": [
      "HORIZON-NOT-SOIL-GROUP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-008",
    "qlName": "Major soil groups of India",
    "difficulty": "Medium",
    "stem": "Which set best represents the standard major soil classification used in school-level Indian geography?",
    "answer": "Alluvial, black, red and yellow, laterite, arid, forest",
    "distractors": [
      "Topsoil, subsoil, bedrock, mantle, crust, core",
      "Delta, plateau, desert, coast, island, glacier",
      "Wheat, rice, cotton, tea, coffee, jute"
    ],
    "explanation": "Indian school geography commonly groups soils into alluvial, black, red and yellow, laterite, arid, and forest/mountain soils. Soil groups classify whole soil types across regions, while horizons such as A, B and C describe vertical layers inside a single soil profile.",
    "sourceFactIds": [
      "STANDARD-INDIA-SOIL-CLASSIFICATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-008",
    "qlName": "Major soil groups of India",
    "difficulty": "Hard",
    "stem": "Consider the following:\nI. Alluvial soil\nII. Black soil\nIII. B horizon\nIV. Laterite soil\nWhich of these are soil groups rather than soil-profile layers?",
    "answer": "I, II and IV only",
    "distractors": [
      "I and III only",
      "II and III only",
      "I, II, III and IV"
    ],
    "explanation": "Alluvial, black and laterite are soil groups. The B horizon is a layer within a soil profile and is commonly called subsoil. Soil groups classify whole soil types across regions, while horizons such as A, B and C describe vertical layers inside a single soil profile.",
    "sourceFactIds": [
      "SOIL-GROUPS-VS-HORIZON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-009",
    "qlName": "Integrated soil-formation reasoning",
    "difficulty": "Easy",
    "stem": "A soil forms slowly from weathered rock and decaying plant material. Which two components are being combined?",
    "answer": "Mineral material and organic matter",
    "distractors": [
      "Latitude and longitude",
      "Rainfall and political boundary",
      "Bedrock and daylight only"
    ],
    "explanation": "Soil development combines mineral material produced by weathering with organic matter supplied by living organisms and their remains. The important idea is that soil development is a combined process involving mineral material, climate, relief, living organisms and enough time.",
    "sourceFactIds": [
      "INTEGRATED-MINERAL-ORGANIC"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-009",
    "qlName": "Integrated soil-formation reasoning",
    "difficulty": "Easy",
    "stem": "Which sequence best shows a simple path from rock to developed soil?",
    "answer": "Weathering of parent material → organic input → horizon development",
    "distractors": [
      "Horizon development → parent rock forms → weathering stops",
      "Crop harvest → longitude changes → bedrock forms",
      "Bedrock disappears → climate stops → soil forms instantly"
    ],
    "explanation": "Weathering first supplies mineral material, organic inputs are added, and continued soil-forming processes gradually produce distinct horizons. The important idea is that soil development is a combined process involving mineral material, climate, relief, living organisms and enough time.",
    "sourceFactIds": [
      "SOIL-DEVELOPMENT-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-009",
    "qlName": "Integrated soil-formation reasoning",
    "difficulty": "Medium",
    "stem": "A steep, dry site with sparse vegetation develops a thin soil. Which combination of factors helps explain this?",
    "answer": "Relief, climate and biological activity",
    "distractors": [
      "Time zone, longitude and trade",
      "Magnetic field, eclipse and tides",
      "Political boundary, language and transport"
    ],
    "explanation": "Steep relief favours erosion, dry climate limits moisture-driven processes and sparse vegetation reduces organic inputs. These controls can combine to limit soil development. The important idea is that soil development is a combined process involving mineral material, climate, relief, living organisms and enough time.",
    "sourceFactIds": [
      "INTEGRATED-THIN-SOIL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-009",
    "qlName": "Integrated soil-formation reasoning",
    "difficulty": "Medium",
    "stem": "A deep soil profile develops on gentle terrain under favourable moisture for a long period. Which explanation is most complete?",
    "answer": "Several formation factors have allowed weathering and accumulation to continue",
    "distractors": [
      "Only one factor can ever shape a soil",
      "Soil depth is unrelated to time or relief",
      "The profile formed without parent material"
    ],
    "explanation": "Gentle relief reduces erosion, moisture supports weathering, and long periods allow horizons to develop. Soil formation is therefore multi-factorial. The important idea is that soil development is a combined process involving mineral material, climate, relief, living organisms and enough time.",
    "sourceFactIds": [
      "INTEGRATED-DEEP-PROFILE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-009",
    "qlName": "Integrated soil-formation reasoning",
    "difficulty": "Medium",
    "stem": "Which observation shows a soil-profile feature rather than a soil-forming factor?",
    "answer": "A distinct B horizon below the topsoil",
    "distractors": [
      "Warm humid climate",
      "Steep relief",
      "Dense vegetation"
    ],
    "explanation": "A B horizon is part of the developed soil profile. Climate, relief and vegetation are controls that help create the profile. The important idea is that soil development is a combined process involving mineral material, climate, relief, living organisms and enough time.",
    "sourceFactIds": [
      "PROFILE-VS-FACTOR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-009",
    "qlName": "Integrated soil-formation reasoning",
    "difficulty": "Hard",
    "stem": "Site A has gentle relief, warm humid climate and dense vegetation; Site B is steep, dry and sparsely vegetated. If parent material and age are similar, which result is more plausible?",
    "answer": "Site A is more likely to develop a deeper, more strongly developed profile",
    "distractors": [
      "Site B must always have the deeper profile",
      "Both sites must develop identical horizons",
      "Relief and climate cannot affect soil development"
    ],
    "explanation": "Gentle terrain limits erosion while warmth, moisture and biological activity promote weathering and organic inputs. These conditions favour stronger profile development at Site A. The important idea is that soil development is a combined process involving mineral material, climate, relief, living organisms and enough time.",
    "sourceFactIds": [
      "INTEGRATED-SITE-COMPARISON"
    ]
  }
]);

export const GEO_SOI_001_CP001_REVIEW_BATCH_V1: readonly GeoSoi001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-SOI-001-CP001-Q${String(index + 1).padStart(3, "0")}`,
      qlId: raw.qlId,
      qlName: raw.qlName,
      difficulty: raw.difficulty,
      stem: raw.stem,
      options: placeGeoSoiOptions(raw.answer, raw.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: raw.answer,
      explanation: raw.explanation,
      sourceIds: GEO_SOI_001_SOURCE_IDS,
      sourceFactIds: Object.freeze([...raw.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED = /associated with|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|sourceFact|runtimeRegistered|review-only|generator/i;

export function auditGeoSoi001Cp001ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoSoi001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_SOI_001_CP001_REVIEW_BATCH_V1) {
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
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push("PROVENANCE:" + q.questionId);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push("LIFECYCLE:" + q.questionId);
    const learnerText = q.stem + "\n" + q.options.join("\n") + "\n" + q.explanation;
    if (BANNED.test(learnerText)) issues.push("STYLE:" + q.questionId);
    if (q.stem.length < 25 || q.stem.length > 360 || !q.stem.trim().endsWith("?")) issues.push("STEM_SHAPE:" + q.questionId);
    if (q.explanation.length < 150) issues.push("SHORT_EXPLANATION:" + q.questionId);
    if ((q.explanation.match(/[.!?](?:\\s|$)/g) ?? []).length < 2) issues.push("EXPLANATION_DEPTH:" + q.questionId);
  }

  if (GEO_SOI_001_CP001_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_SOI_001_CP001_REVIEW_BATCH_V1.length);
  for (let n = 1; n < 10; n += 1) {
    const qlId = "GEO-SOI-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_SOI_001_CP001_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
