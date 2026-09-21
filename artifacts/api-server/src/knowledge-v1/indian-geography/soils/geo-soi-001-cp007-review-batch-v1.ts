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
    "qlId": "GEO-SOI-001-QL-055",
    "qlName": "Mountain occurrence and forest setting",
    "difficulty": "Easy",
    "stem": "Forest soils are commonly found in which type of terrain?",
    "answer": "Hilly and mountainous areas",
    "distractors": [
      "Active river floodplains only",
      "Hot desert dunes only",
      "Coastal salt flats only"
    ],
    "explanation": "Forest soils are common in hilly and mountainous areas where rainfall supports natural forest cover. Their properties change with altitude, slope and local mountain conditions.",
    "sourceFactIds": [
      "FOREST-MOUNTAIN-OCCURRENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-055",
    "qlName": "Mountain occurrence and forest setting",
    "difficulty": "Easy",
    "stem": "Which environment best fits the occurrence of forest soil?",
    "answer": "A rainy mountain region with forest cover",
    "distractors": [
      "A dry desert with sparse vegetation",
      "An active floodplain renewed each year",
      "A coastal saline marsh only"
    ],
    "explanation": "Forest soil develops widely in mountain regions where there is sufficient rainfall for forests. Relief and vegetation together help shape the soil profile.",
    "sourceFactIds": [
      "FOREST-RAINY-MOUNTAIN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-055",
    "qlName": "Mountain occurrence and forest setting",
    "difficulty": "Medium",
    "stem": "Which combination is most typical of forest-soil occurrence?",
    "answer": "Hilly relief with adequate rainfall and forest vegetation",
    "distractors": [
      "Flat desert terrain with extreme dryness",
      "Annual river deposition with no slope",
      "Coastal dunes with strong salinity"
    ],
    "explanation": "Forest soil is linked with hilly or mountainous relief and enough rainfall to support forests. This setting distinguishes it from arid and alluvial soil environments.",
    "sourceFactIds": [
      "FOREST-OCCURRENCE-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-055",
    "qlName": "Mountain occurrence and forest setting",
    "difficulty": "Medium",
    "stem": "A highland district has steep slopes, regular rainfall and extensive forest cover. Which soil group is most likely?",
    "answer": "Forest soil",
    "distractors": [
      "Arid soil",
      "Khadar",
      "Black soil"
    ],
    "explanation": "The combination of mountain relief, rainfall and forest vegetation strongly supports forest soil. Its exact texture can still vary from upper slopes to valley sides.",
    "sourceFactIds": [
      "FOREST-HIGHLAND-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-055",
    "qlName": "Mountain occurrence and forest setting",
    "difficulty": "Medium",
    "stem": "Why does forest soil vary greatly from place to place within one mountain system?",
    "answer": "Relief, altitude and local mountain conditions change over short distances",
    "distractors": [
      "Annual floods make every slope identical",
      "Desert winds control all mountain soils",
      "The parent material is always the same everywhere"
    ],
    "explanation": "Mountain environments change quickly with elevation, slope position and vegetation. Forest soil therefore shows noticeable differences in texture and fertility within the same mountain region.",
    "sourceFactIds": [
      "FOREST-MOUNTAIN-VARIATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-055",
    "qlName": "Mountain occurrence and forest setting",
    "difficulty": "Hard",
    "stem": "Two sites receive similar rainfall: one is a forested mountain slope and the other is a flat active floodplain. Which site better fits forest-soil formation?",
    "answer": "The forested mountain slope",
    "distractors": [
      "The active floodplain",
      "Both must form khadar",
      "Relief has no role in soil formation"
    ],
    "explanation": "The forested mountain slope matches the relief and vegetation setting of forest soil. The flat active floodplain is more likely to carry alluvium deposited by rivers.",
    "sourceFactIds": [
      "FOREST-TERRAIN-REASONING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-056",
    "qlName": "Texture varies with mountain environment",
    "difficulty": "Easy",
    "stem": "What is a key feature of forest-soil texture in mountains?",
    "answer": "It varies with the mountain environment",
    "distractors": [
      "It is identical on every slope",
      "It is always heavy clay",
      "It is always pure sand"
    ],
    "explanation": "Forest-soil texture changes with slope position and local mountain conditions. Upper slopes, valley sides and lower terraces can therefore have noticeably different particle sizes.",
    "sourceFactIds": [
      "FOREST-TEXTURE-VARIES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-056",
    "qlName": "Texture varies with mountain environment",
    "difficulty": "Easy",
    "stem": "Why is there no single uniform texture for forest soil?",
    "answer": "Mountain relief creates different soil-forming conditions",
    "distractors": [
      "River floods renew all mountain soils yearly",
      "Permanent snow makes every layer identical",
      "Desert winds remove all fine material everywhere"
    ],
    "explanation": "Mountain relief affects erosion, deposition and drainage over short distances. These differences cause forest soils to range from coarse material on slopes to finer material lower down.",
    "sourceFactIds": [
      "FOREST-NONUNIFORM-TEXTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-056",
    "qlName": "Texture varies with mountain environment",
    "difficulty": "Medium",
    "stem": "Which statement best describes forest-soil texture?",
    "answer": "Texture changes according to slope and mountain setting",
    "distractors": [
      "Texture is always clayey regardless of relief",
      "Texture is fixed by colour alone",
      "Texture does not change with altitude"
    ],
    "explanation": "Forest-soil texture is strongly influenced by the local mountain environment. Steeper upper slopes tend to retain coarser material, while lower positions can collect finer particles.",
    "sourceFactIds": [
      "FOREST-TEXTURE-RELIEF"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-056",
    "qlName": "Texture varies with mountain environment",
    "difficulty": "Medium",
    "stem": "A soil survey finds coarse material upslope and finer loamy material downslope. What does this illustrate?",
    "answer": "Forest-soil texture varies with relief",
    "distractors": [
      "Arid soil becomes black soil downslope",
      "Khadar forms on mountain summits",
      "Texture is unrelated to topography"
    ],
    "explanation": "The contrast reflects how erosion removes fine particles from steeper positions and deposition favours lower areas. Forest soils therefore change texture along a mountain slope.",
    "sourceFactIds": [
      "FOREST-TEXTURE-TRANSECT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-056",
    "qlName": "Texture varies with mountain environment",
    "difficulty": "Medium",
    "stem": "Which factor most directly explains textural differences within forest soils?",
    "answer": "Position on the mountain slope",
    "distractors": [
      "Annual flood renewal everywhere",
      "Uniform desert climate",
      "Permanent waterlogging at all elevations"
    ],
    "explanation": "Slope position affects both erosion and the movement of soil particles. Upper and lower parts of a mountain therefore develop different textures even within the same soil group.",
    "sourceFactIds": [
      "FOREST-SLOPE-POSITION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-056",
    "qlName": "Texture varies with mountain environment",
    "difficulty": "Hard",
    "stem": "A mountain profile shows coarse soil near the upper slope, loamy material on the valley side and fertile deposits lower down. What is the best explanation?",
    "answer": "Relief controls erosion and deposition along the slope",
    "distractors": [
      "All layers were deposited by one annual flood",
      "Texture changes randomly without environmental control",
      "The profile must be arid soil"
    ],
    "explanation": "Mountain relief redistributes soil material from higher to lower positions. Erosion dominates steeper slopes, while finer material and deposits collect in valleys and lower terraces.",
    "sourceFactIds": [
      "FOREST-RELIEF-PROFILE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-057",
    "qlName": "Loamy and silty valley-side soils",
    "difficulty": "Easy",
    "stem": "Forest soils on valley sides are often what in texture?",
    "answer": "Loamy and silty",
    "distractors": [
      "Only coarse gravel",
      "Pure peat",
      "Heavy black clay only"
    ],
    "explanation": "Valley-side forest soils are commonly loamy and silty. Finer particles are more easily retained or deposited there than on steep upper slopes, producing a softer and more workable texture.",
    "sourceFactIds": [
      "FOREST-VALLEY-LOAMY-SILTY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-057",
    "qlName": "Loamy and silty valley-side soils",
    "difficulty": "Easy",
    "stem": "Which texture is more typical of forest soil on mountain valley sides?",
    "answer": "Loamy to silty",
    "distractors": [
      "Very coarse only",
      "Pure sand only",
      "Massive clay everywhere"
    ],
    "explanation": "Loamy and silty textures are common on valley sides because these positions can hold finer material. This contrasts with the coarser texture of upper mountain slopes.",
    "sourceFactIds": [
      "FOREST-VALLEY-TEXTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-057",
    "qlName": "Loamy and silty valley-side soils",
    "difficulty": "Medium",
    "stem": "Which high-Himalayan soil-property pair is correct?",
    "answer": "Valley sides — loamy and silty forest soil",
    "distractors": [
      "Upper slopes — always silty clay",
      "Desert dunes — loamy forest soil",
      "Active floodplains — coarse mountain forest soil"
    ],
    "explanation": "Forest soil on valley sides is commonly loamy or silty. Upper slopes usually contain coarser material because erosion removes many fine particles and carries them downslope.",
    "sourceFactIds": [
      "FOREST-VALLEY-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-057",
    "qlName": "Loamy and silty valley-side soils",
    "difficulty": "Medium",
    "stem": "Why are valley-side forest soils often finer than soils on upper slopes?",
    "answer": "Finer particles can accumulate more easily in lower slope positions",
    "distractors": [
      "Valleys have stronger wind erosion than summits",
      "Permanent ice adds clay each year",
      "Annual floods cover every mountain slope"
    ],
    "explanation": "Gravity and runoff move material downslope, and lower positions can retain finer particles. This helps produce loamy and silty textures along many valley sides.",
    "sourceFactIds": [
      "FOREST-VALLEY-FINE-MATERIAL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-057",
    "qlName": "Loamy and silty valley-side soils",
    "difficulty": "Medium",
    "stem": "A mountain farmer finds a loamy-silty soil on a valley side. Which soil group does this fit best?",
    "answer": "Forest soil",
    "distractors": [
      "Arid soil",
      "Black soil",
      "Coastal saline soil"
    ],
    "explanation": "Loamy and silty textures on valley sides are a standard feature of forest soil in mountainous regions. The slope position is an important part of the identification.",
    "sourceFactIds": [
      "FOREST-VALLEY-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-057",
    "qlName": "Loamy and silty valley-side soils",
    "difficulty": "Hard",
    "stem": "Site A lies on a valley side with loamy-silty soil; Site B lies on a steep upper slope with coarse soil. Which statement is most accurate?",
    "answer": "Both can be forest soils shaped by different slope positions",
    "distractors": [
      "Only Site A can ever be forest soil",
      "Only Site B can ever be forest soil",
      "Both must be alluvial soil"
    ],
    "explanation": "Forest-soil texture changes within mountain terrain. Valley sides can be loamy or silty, while upper slopes are often coarse because erosion is stronger there.",
    "sourceFactIds": [
      "FOREST-VALLEY-UPPER-COMPARE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-058",
    "qlName": "Coarse-grained upper-slope soils",
    "difficulty": "Easy",
    "stem": "Forest soils on upper mountain slopes are often what in texture?",
    "answer": "Coarse-grained",
    "distractors": [
      "Fine silty clay only",
      "Peaty everywhere",
      "Fresh river silt"
    ],
    "explanation": "Upper mountain slopes commonly have coarse-grained forest soil. Steeper relief encourages erosion of fine particles and leaves a larger share of coarse material behind.",
    "sourceFactIds": [
      "FOREST-UPPER-COARSE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-058",
    "qlName": "Coarse-grained upper-slope soils",
    "difficulty": "Easy",
    "stem": "Which slope position is most likely to have coarse forest soil?",
    "answer": "Upper slopes",
    "distractors": [
      "Lower river terraces",
      "Alluvial fans at valley bottoms",
      "Flat floodplains only"
    ],
    "explanation": "Upper slopes are more exposed to erosion, so fine material is removed more easily. The remaining soil is therefore often coarse-grained and thinner than soil in protected lower positions.",
    "sourceFactIds": [
      "FOREST-COARSE-SLOPE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-058",
    "qlName": "Coarse-grained upper-slope soils",
    "difficulty": "Medium",
    "stem": "Why is forest soil often coarse on upper slopes?",
    "answer": "Erosion removes finer particles from steep terrain",
    "distractors": [
      "Floods deposit fine silt every year",
      "High humus turns clay into gravel",
      "Irrigation removes all fine material"
    ],
    "explanation": "Steep upper slopes experience stronger runoff and denudation. Fine particles are carried downslope, leaving a coarser soil texture behind and reducing the amount of fine material that can accumulate.",
    "sourceFactIds": [
      "FOREST-UPPER-EROSION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-058",
    "qlName": "Coarse-grained upper-slope soils",
    "difficulty": "Medium",
    "stem": "Which comparison is correct for mountain forest soils?",
    "answer": "Upper slopes are coarser than many valley-side soils",
    "distractors": [
      "Upper slopes are always finer than valley sides",
      "Valley sides contain only gravel",
      "Slope position does not affect texture"
    ],
    "explanation": "Upper slopes lose more fine material through erosion, so they are commonly coarse. Valley sides can retain or receive finer loamy and silty material, producing a clear slope-based contrast.",
    "sourceFactIds": [
      "FOREST-UPPER-VS-VALLEY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-058",
    "qlName": "Coarse-grained upper-slope soils",
    "difficulty": "Medium",
    "stem": "A steep forested slope has shallow coarse soil. Which process most likely helped create this texture?",
    "answer": "Removal of fine material by erosion",
    "distractors": [
      "Annual deposition of river silt",
      "Permanent waterlogging",
      "Salt crystallisation in a desert"
    ],
    "explanation": "Steep slopes encourage runoff and soil removal, especially of finer particles. The soil left behind becomes relatively coarse and can also be thinner.",
    "sourceFactIds": [
      "FOREST-COARSE-PROCESS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-058",
    "qlName": "Coarse-grained upper-slope soils",
    "difficulty": "Hard",
    "stem": "A mountain transect becomes coarser as elevation and slope steepness increase. Which forest-soil process best explains the pattern?",
    "answer": "Stronger erosion at higher, steeper positions",
    "distractors": [
      "Increasing annual flood deposition upslope",
      "Greater peat formation on bare rock",
      "Uniform deposition across the whole mountain"
    ],
    "explanation": "Steeper high slopes lose fine particles more rapidly through erosion and denudation. Lower positions receive or retain more fine material, producing the observed textural contrast.",
    "sourceFactIds": [
      "FOREST-UPPER-TRANSECT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-059",
    "qlName": "Denudation in snow-covered Himalayan areas",
    "difficulty": "Easy",
    "stem": "What process strongly affects forest soils in snow-covered Himalayan areas?",
    "answer": "Denudation",
    "distractors": [
      "Annual delta deposition",
      "Desert salinisation only",
      "Coral accumulation"
    ],
    "explanation": "Forest soils in snow-covered Himalayan areas experience strong denudation. Steep relief, runoff and mass movement can remove soil material and keep the profile relatively thin.",
    "sourceFactIds": [
      "FOREST-HIMALAYA-DENUDATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-059",
    "qlName": "Denudation in snow-covered Himalayan areas",
    "difficulty": "Easy",
    "stem": "Which condition can reduce soil depth in high Himalayan forest-soil zones?",
    "answer": "Denudation on steep slopes",
    "distractors": [
      "Annual deposition of thick river silt on summits",
      "Permanent addition of peat",
      "Repeated desert-dune formation"
    ],
    "explanation": "Denudation removes weathered material from steep highland surfaces. As soil is carried away, the remaining profile may stay thin and poorly developed.",
    "sourceFactIds": [
      "FOREST-DENUDATION-DEPTH"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-059",
    "qlName": "Denudation in snow-covered Himalayan areas",
    "difficulty": "Medium",
    "stem": "Why are high Himalayan forest soils especially vulnerable to denudation?",
    "answer": "Steep relief makes soil removal easier",
    "distractors": [
      "The land is flat and permanently flooded",
      "There is no gravity-driven movement",
      "All fine material is trapped on summits"
    ],
    "explanation": "Steep mountain slopes promote runoff, erosion and downslope movement of loose material. These processes increase denudation and prevent thick soil from accumulating easily.",
    "sourceFactIds": [
      "FOREST-STEEP-DENUDATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-059",
    "qlName": "Denudation in snow-covered Himalayan areas",
    "difficulty": "Medium",
    "stem": "Which clue best points to denudation in a mountain-soil question?",
    "answer": "A thin soil profile on steep snow-zone slopes",
    "distractors": [
      "A deep fresh flood deposit on a flat plain",
      "A thick desert salt crust",
      "A black clay profile with summer cracks"
    ],
    "explanation": "Thin soil on steep high Himalayan slopes is consistent with continued removal of material. Denudation limits profile development by stripping weathered soil from exposed positions.",
    "sourceFactIds": [
      "FOREST-DENUDATION-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-059",
    "qlName": "Denudation in snow-covered Himalayan areas",
    "difficulty": "Medium",
    "stem": "How does denudation affect forest soils in high mountains?",
    "answer": "It removes soil material and limits profile development",
    "distractors": [
      "It creates annual alluvial renewal",
      "It increases peat thickness everywhere",
      "It converts the soil into black cotton soil"
    ],
    "explanation": "Denudation carries soil and weathered rock downslope. Continued removal keeps high-slope soils relatively thin and less developed than soils in protected lower positions.",
    "sourceFactIds": [
      "FOREST-DENUDATION-EFFECT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-059",
    "qlName": "Denudation in snow-covered Himalayan areas",
    "difficulty": "Hard",
    "stem": "A snow-covered Himalayan slope has acidic, low-humus soil and frequent removal of surface material. Which process explains the repeated soil loss?",
    "answer": "Denudation",
    "distractors": [
      "Floodplain deposition",
      "Capillary salt rise in a desert",
      "Self-ploughing of black soil"
    ],
    "explanation": "Denudation is the removal of soil and weathered material from mountain slopes. In high Himalayan settings it occurs alongside acidic, low-humus soil conditions.",
    "sourceFactIds": [
      "FOREST-HIGH-HIMALAYA-DENUDATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-060",
    "qlName": "Acidic character in high Himalayan soils",
    "difficulty": "Easy",
    "stem": "Forest soils in snow-covered Himalayan areas are often what in reaction?",
    "answer": "Acidic",
    "distractors": [
      "Strongly alkaline everywhere",
      "Neutral in every location",
      "Saline because of desert evaporation"
    ],
    "explanation": "Forest soils in high snow-covered Himalayan areas are often acidic. Cool, wet mountain conditions and leaching can reduce the amount of basic material in the upper soil.",
    "sourceFactIds": [
      "FOREST-HIMALAYA-ACIDIC"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-060",
    "qlName": "Acidic character in high Himalayan soils",
    "difficulty": "Easy",
    "stem": "Which chemical property is common in high Himalayan forest soil?",
    "answer": "Acidity",
    "distractors": [
      "Extreme salinity",
      "Strong alkalinity only",
      "High calcium carbonate crusts everywhere"
    ],
    "explanation": "Acidity is a standard feature of forest soil in high Himalayan snow-zone areas. It commonly appears together with low humus and strong denudation in exposed high-altitude settings.",
    "sourceFactIds": [
      "FOREST-ACIDITY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-060",
    "qlName": "Acidic character in high Himalayan soils",
    "difficulty": "Medium",
    "stem": "Which lower-valley soil-location pair is correct?",
    "answer": "High Himalayan forest soil — acidic",
    "distractors": [
      "Arid soil — acidic because of heavy rainfall",
      "Black soil — acidic because of annual snow",
      "Khadar — acidic because of denudation"
    ],
    "explanation": "High Himalayan forest soil is often acidic. Arid soil is shaped by dryness and salinity, while black and alluvial soils have different formation controls.",
    "sourceFactIds": [
      "FOREST-ACIDIC-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-060",
    "qlName": "Acidic character in high Himalayan soils",
    "difficulty": "Medium",
    "stem": "A soil from a cold high Himalayan slope is acidic and low in humus. Which soil group is most likely?",
    "answer": "Forest soil",
    "distractors": [
      "Arid soil",
      "Black soil",
      "Khadar"
    ],
    "explanation": "Acidity and low humus in a high Himalayan setting are standard features of forest soil. The mountain location is essential because forest-soil properties vary greatly with altitude.",
    "sourceFactIds": [
      "FOREST-ACIDIC-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-060",
    "qlName": "Acidic character in high Himalayan soils",
    "difficulty": "Medium",
    "stem": "Why should acidity in forest soil be linked to altitude and local conditions rather than applied to every forest soil?",
    "answer": "Forest-soil properties change across mountain environments",
    "distractors": [
      "All forest soils have exactly the same chemistry",
      "Acidity occurs only on river floodplains",
      "Mountain relief never affects soil properties"
    ],
    "explanation": "Forest soil is not chemically uniform across all elevations. High snow-covered Himalayan areas are especially noted for acidic conditions, while lower valley soils can be more fertile.",
    "sourceFactIds": [
      "FOREST-ACIDITY-ALTITUDE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-060",
    "qlName": "Acidic character in high Himalayan soils",
    "difficulty": "Hard",
    "stem": "Which combination best fits high Himalayan forest soil rather than lower-valley forest soil?",
    "answer": "Acidic reaction, low humus and strong denudation",
    "distractors": [
      "High fertility, thick recent alluvium and no slope erosion",
      "Sandy salinity and kankar accumulation",
      "Heavy black clay and self-ploughing"
    ],
    "explanation": "High Himalayan forest soil is commonly acidic, low in humus and affected by denudation. Lower valleys and terraces can instead contain much more fertile soil material.",
    "sourceFactIds": [
      "FOREST-ACIDIC-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-061",
    "qlName": "Low humus in high Himalayan soils",
    "difficulty": "Easy",
    "stem": "What is the usual humus condition of forest soil in snow-covered Himalayan areas?",
    "answer": "Low humus",
    "distractors": [
      "Very high peat everywhere",
      "Unlimited humus",
      "Humus renewed by annual floods"
    ],
    "explanation": "Forest soils in the high snow-covered Himalayas often have low humus content. Harsh conditions limit vegetation growth and organic-matter accumulation in these exposed zones.",
    "sourceFactIds": [
      "FOREST-HIGH-LOW-HUMUS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-061",
    "qlName": "Low humus in high Himalayan soils",
    "difficulty": "Easy",
    "stem": "Which organic-matter feature is common in high Himalayan forest soil?",
    "answer": "Low humus content",
    "distractors": [
      "A thick peat layer everywhere",
      "Continuous fresh flood humus",
      "Very high humus at every altitude"
    ],
    "explanation": "Low humus is one of the standard traits of forest soil in snow-covered Himalayan areas. It is usually mentioned together with acidity and denudation on exposed high slopes.",
    "sourceFactIds": [
      "FOREST-HUMUS-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-061",
    "qlName": "Low humus in high Himalayan soils",
    "difficulty": "Medium",
    "stem": "Why should low humus in forest soil be linked specifically to high Himalayan conditions?",
    "answer": "Forest-soil properties change with altitude and vegetation conditions",
    "distractors": [
      "Every forest soil in India has equally low humus",
      "Humus is controlled only by river floods",
      "Mountain climate has no effect on organic matter"
    ],
    "explanation": "Forest soil varies greatly along mountain slopes. High cold areas have different vegetation and soil-development conditions from lower valleys, so humus content is not uniform everywhere.",
    "sourceFactIds": [
      "FOREST-HUMUS-ALTITUDE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-061",
    "qlName": "Low humus in high Himalayan soils",
    "difficulty": "Medium",
    "stem": "A high-altitude forest soil is acidic and has little organic matter. Which property does 'little organic matter' indicate?",
    "answer": "Low humus",
    "distractors": [
      "High salinity",
      "High kankar content",
      "Fresh alluvial deposition"
    ],
    "explanation": "Humus is the decomposed organic component of soil. A low organic-matter reserve therefore means the soil has low humus content and a weaker organic nutrient store.",
    "sourceFactIds": [
      "FOREST-HUMUS-MEANING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-061",
    "qlName": "Low humus in high Himalayan soils",
    "difficulty": "Medium",
    "stem": "Which combination is typical of forest soil in snow-covered Himalayan zones?",
    "answer": "Acidic soil with low humus",
    "distractors": [
      "Saline sand with kankar",
      "Deep black clay with cracks",
      "Fresh khadar with annual renewal"
    ],
    "explanation": "High Himalayan forest soil is often both acidic and low in humus. These features reflect the severe mountain environment and differ from arid, black and alluvial soil profiles.",
    "sourceFactIds": [
      "FOREST-HUMUS-ACIDITY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-061",
    "qlName": "Low humus in high Himalayan soils",
    "difficulty": "Medium",
    "stem": "Which statement best distinguishes high Himalayan forest soil from fertile lower-valley forest soil?",
    "answer": "High Himalayan soil often has less humus and stronger denudation",
    "distractors": [
      "Lower valleys always have coarser soil than upper slopes",
      "High Himalayan soil is renewed by river floods each year",
      "Both positions have identical fertility"
    ],
    "explanation": "High Himalayan soils face harsher conditions and stronger denudation, so humus and fertility are often lower. Lower valley positions can receive finer material and develop more fertile soils.",
    "sourceFactIds": [
      "FOREST-HUMUS-VS-VALLEY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-062",
    "qlName": "Fertile lower valleys, terraces and alluvial fans",
    "difficulty": "Easy",
    "stem": "Where are forest soils particularly fertile in mountain regions?",
    "answer": "Lower valleys and river terraces",
    "distractors": [
      "Bare upper summits only",
      "Snow-covered ridges only",
      "Steep rocky cliffs only"
    ],
    "explanation": "Forest soils are especially fertile in lower valley areas and on river terraces. These positions receive and retain finer material more easily than steep upper slopes.",
    "sourceFactIds": [
      "FOREST-LOWER-VALLEY-FERTILE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-062",
    "qlName": "Fertile lower valleys, terraces and alluvial fans",
    "difficulty": "Easy",
    "stem": "Which landform in mountain valleys can contain fertile forest soil?",
    "answer": "Alluvial fans",
    "distractors": [
      "Sand dunes",
      "Coral reefs",
      "Salt pans only"
    ],
    "explanation": "Alluvial fans at the foot of mountain slopes can collect fertile transported material. These lower positions are much more favourable for soil accumulation than exposed upper slopes.",
    "sourceFactIds": [
      "FOREST-ALLUVIAL-FANS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-062",
    "qlName": "Fertile lower valleys, terraces and alluvial fans",
    "difficulty": "Medium",
    "stem": "Why are lower valley forest soils often more fertile than high-slope soils?",
    "answer": "They receive and retain finer transported material",
    "distractors": [
      "They experience stronger denudation than summits",
      "They lose all fine particles to wind",
      "They remain permanently frozen"
    ],
    "explanation": "Lower valley positions act as zones of deposition and accumulation. Fine particles and nutrients moved from upper slopes can collect there, improving soil depth and fertility.",
    "sourceFactIds": [
      "FOREST-VALLEY-FERTILITY-CAUSE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-062",
    "qlName": "Fertile lower valleys, terraces and alluvial fans",
    "difficulty": "Medium",
    "stem": "Which pair is correctly matched?",
    "answer": "River terraces — relatively fertile forest soil",
    "distractors": [
      "Upper snowy slopes — deepest fertile soil everywhere",
      "Desert dunes — fertile forest soil",
      "Salt pans — loamy mountain soil"
    ],
    "explanation": "River terraces in lower mountain valleys can support relatively fertile forest soil. They receive more stable deposits and suffer less severe erosion than steep high slopes.",
    "sourceFactIds": [
      "FOREST-TERRACE-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-062",
    "qlName": "Fertile lower valleys, terraces and alluvial fans",
    "difficulty": "Medium",
    "stem": "A mountain valley has a river terrace and an alluvial fan. What soil tendency is most likely there?",
    "answer": "Finer and more fertile forest soil",
    "distractors": [
      "Only coarse skeletal soil",
      "Strong desert salinity",
      "Permanent absence of soil"
    ],
    "explanation": "River terraces and alluvial fans collect material moved downslope or by streams. This accumulation produces deeper, finer and often more fertile soil than on exposed upper slopes.",
    "sourceFactIds": [
      "FOREST-FAN-TERRACE-FERTILITY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-062",
    "qlName": "Fertile lower valleys, terraces and alluvial fans",
    "difficulty": "Medium",
    "stem": "Which slope position offers the best chance of deeper fertile forest soil?",
    "answer": "A lower valley terrace",
    "distractors": [
      "A steep upper ridge",
      "A snow-covered summit",
      "A bare cliff face"
    ],
    "explanation": "Lower valley terraces are more stable and receive transported soil material. This allows deeper and more fertile profiles to develop compared with exposed upper-slope positions.",
    "sourceFactIds": [
      "FOREST-LOWER-POSITION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-063",
    "qlName": "Integrated mountain-soil profile reasoning",
    "difficulty": "Easy",
    "stem": "A mountain soil is coarse upslope but loamy-silty along valley sides. Which soil group is indicated?",
    "answer": "Forest soil",
    "distractors": [
      "Arid soil",
      "Black soil",
      "Khadar"
    ],
    "explanation": "Forest soil commonly changes texture with slope position. Coarse upper-slope material and finer valley-side soil form a standard mountain profile pattern.",
    "sourceFactIds": [
      "FOREST-INTEGRATED-TEXTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-063",
    "qlName": "Integrated mountain-soil profile reasoning",
    "difficulty": "Easy",
    "stem": "Which soil can be acidic and low in humus high in the Himalayas but fertile in lower valleys?",
    "answer": "Forest soil",
    "distractors": [
      "Arid soil",
      "Black soil",
      "Laterite soil"
    ],
    "explanation": "Forest soil varies greatly with altitude and relief. High Himalayan zones may be acidic and low in humus, while lower terraces and valley positions can be much more fertile.",
    "sourceFactIds": [
      "FOREST-INTEGRATED-ALTITUDE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-063",
    "qlName": "Integrated mountain-soil profile reasoning",
    "difficulty": "Medium",
    "stem": "Which combination correctly describes forest soil in mountains?",
    "answer": "Coarse upper slopes, finer valley sides and fertile lower terraces",
    "distractors": [
      "Uniform clay texture at every altitude",
      "Sandy salinity with kankar at every slope",
      "Annual flood renewal from summit to valley"
    ],
    "explanation": "Forest-soil properties change down a mountain profile. Erosion leaves coarse material higher up, while finer and more fertile deposits collect in lower positions.",
    "sourceFactIds": [
      "FOREST-INTEGRATED-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-063",
    "qlName": "Integrated mountain-soil profile reasoning",
    "difficulty": "Medium",
    "stem": "Which chain best explains a mountain forest-soil profile?",
    "answer": "Upper-slope erosion → downslope movement → finer accumulation in valleys",
    "distractors": [
      "Valley erosion → uphill deposition → coarse river terraces",
      "Annual floods → summit deposition → acidic desert soil",
      "Snowfall → salt concentration → black soil"
    ],
    "explanation": "Gravity and runoff move weathered material from higher to lower positions. This creates coarser upper slopes and finer, often more fertile valley-side and terrace soils.",
    "sourceFactIds": [
      "FOREST-INTEGRATED-CHAIN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-063",
    "qlName": "Integrated mountain-soil profile reasoning",
    "difficulty": "Medium",
    "stem": "Which statement best distinguishes high Himalayan forest soil from arid soil?",
    "answer": "High Himalayan forest soil may be acidic and denuded, while arid soil is sandy and often saline",
    "distractors": [
      "Both are formed by rapid evaporation and salt accumulation",
      "Arid soil is always acidic because of snow",
      "Forest soil always contains kankar in lower horizons"
    ],
    "explanation": "High Himalayan forest soil reflects steep relief, cold conditions and denudation. Arid soil reflects dryness, rapid evaporation, sandiness and salt concentration.",
    "sourceFactIds": [
      "FOREST-VS-ARID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-063",
    "qlName": "Integrated mountain-soil profile reasoning",
    "difficulty": "Medium",
    "stem": "A soil survey finds coarse upper slopes, acidic low-humus soil in the snow zone and fertile lower terraces. What is the best overall interpretation?",
    "answer": "Different mountain positions are producing different forms of forest soil",
    "distractors": [
      "Three unrelated soil groups must be present",
      "All positions are arid soil",
      "The entire profile is fresh alluvium"
    ],
    "explanation": "The pattern is internally consistent with forest soil because mountain position controls texture, erosion, acidity and fertility. Forest soil should therefore be understood as a variable mountain soil rather than one uniform type.",
    "sourceFactIds": [
      "FOREST-INTEGRATED-PROFILE"
    ]
  }
]);

export const GEO_SOI_001_CP007_REVIEW_BATCH_V1: readonly GeoSoi001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-SOI-001-CP007-Q${String(index + 1).padStart(3, "0")}`,
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

export function auditGeoSoi001Cp007ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoSoi001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_SOI_001_CP007_REVIEW_BATCH_V1) {
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
    if ((q.explanation.match(/[.!?](?:\s|$)/g) ?? []).length < 2) issues.push("EXPLANATION_DEPTH:" + q.questionId);
  }

  if (GEO_SOI_001_CP007_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_SOI_001_CP007_REVIEW_BATCH_V1.length);
  for (let n = 55; n <= 63; n += 1) {
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
    questionCount: GEO_SOI_001_CP007_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
