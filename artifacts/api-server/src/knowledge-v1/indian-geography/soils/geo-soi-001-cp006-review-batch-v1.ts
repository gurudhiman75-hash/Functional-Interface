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
    "qlId": "GEO-SOI-001-QL-046",
    "qlName": "Colour range of arid soils",
    "difficulty": "Easy",
    "stem": "Arid soils in India generally range between which colours?",
    "answer": "Red and brown",
    "distractors": [
      "Black and blue",
      "Grey and white only",
      "Yellow and green"
    ],
    "explanation": "Arid soils commonly range from red to brown in colour. The dry climate and limited organic matter help give these soils their typical reddish-brown appearance.",
    "sourceFactIds": [
      "ARID-COLOUR-RANGE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-046",
    "qlName": "Colour range of arid soils",
    "difficulty": "Easy",
    "stem": "A reddish-brown soil occurs in a very dry part of India. Which soil group best fits this clue?",
    "answer": "Arid soil",
    "distractors": [
      "Alluvial soil",
      "Black soil",
      "Forest soil"
    ],
    "explanation": "A red-to-brown colour is a standard feature of arid soil. The clue becomes stronger when the location is also dry and the soil shows sandy or saline properties.",
    "sourceFactIds": [
      "ARID-COLOUR-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-046",
    "qlName": "Colour range of arid soils",
    "difficulty": "Medium",
    "stem": "Which pair is correctly matched?",
    "answer": "Arid soil — red to brown",
    "distractors": [
      "Black soil — red to brown",
      "Khadar — red to brown as its defining feature",
      "Forest soil — always red to brown"
    ],
    "explanation": "Arid soil is commonly red to brown in colour. Black soil is dark and clay-rich, while khadar is younger alluvium and is identified more by deposition than by this colour range.",
    "sourceFactIds": [
      "ARID-COLOUR-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-046",
    "qlName": "Colour range of arid soils",
    "difficulty": "Medium",
    "stem": "A soil map uses a red-brown shade for the dry western belt. Which soil is most likely being represented?",
    "answer": "Arid soil",
    "distractors": [
      "Laterite soil",
      "Black soil",
      "Khadar"
    ],
    "explanation": "The red-brown colour combined with a dry western setting points to arid soil. Colour alone is not enough, but the climate clue makes the identification much stronger.",
    "sourceFactIds": [
      "ARID-COLOUR-MAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-046",
    "qlName": "Colour range of arid soils",
    "difficulty": "Medium",
    "stem": "Which colour clue best supports the identification of arid soil in an exam question?",
    "answer": "A red-to-brown range",
    "distractors": [
      "A deep black colour only",
      "A permanent white ice cover",
      "A blue-green surface"
    ],
    "explanation": "Red to brown is the standard colour range used for arid soil in school geography. It should be read together with clues such as dryness, sandiness and salinity.",
    "sourceFactIds": [
      "ARID-COLOUR-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-046",
    "qlName": "Colour range of arid soils",
    "difficulty": "Hard",
    "stem": "A soil is red-brown, sandy and saline, and it occurs under a dry climate. Which soil is indicated?",
    "answer": "Arid soil",
    "distractors": [
      "Black soil",
      "Laterite soil",
      "Alluvial soil"
    ],
    "explanation": "All four clues point toward arid soil: red-brown colour, sandy texture, salinity and a dry climate. The combination is more reliable than identifying the soil from colour alone.",
    "sourceFactIds": [
      "ARID-COLOUR-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-047",
    "qlName": "Sandy texture of arid soils",
    "difficulty": "Easy",
    "stem": "What is the usual texture of arid soil?",
    "answer": "Sandy",
    "distractors": [
      "Heavy clayey",
      "Silty clay only",
      "Peaty"
    ],
    "explanation": "Arid soil is generally sandy in texture. The loose mineral material reflects the dry environment and differs clearly from the heavy clay of black soil.",
    "sourceFactIds": [
      "ARID-SANDY-TEXTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-047",
    "qlName": "Sandy texture of arid soils",
    "difficulty": "Easy",
    "stem": "Which physical property is typical of arid soil?",
    "answer": "A sandy texture",
    "distractors": [
      "A deep sticky clay texture",
      "A permanently frozen surface",
      "A thick peat layer"
    ],
    "explanation": "A sandy texture is one of the most direct physical clues for arid soil. It often appears together with low moisture and saline conditions in dry regions.",
    "sourceFactIds": [
      "ARID-PHYSICAL-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-047",
    "qlName": "Sandy texture of arid soils",
    "difficulty": "Medium",
    "stem": "A dry-region soil feels loose and sandy rather than heavy and sticky. Which soil group is the best fit?",
    "answer": "Arid soil",
    "distractors": [
      "Black soil",
      "Laterite soil",
      "Mountain forest soil"
    ],
    "explanation": "Loose sandy material is typical of arid soil, especially when the region is very dry. Black soil is much more clay-rich and becomes sticky when wet.",
    "sourceFactIds": [
      "ARID-SANDY-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-047",
    "qlName": "Sandy texture of arid soils",
    "difficulty": "Medium",
    "stem": "Which comparison is correct?",
    "answer": "Arid soil is generally sandy, while black soil is generally clayey",
    "distractors": [
      "Both soils are usually heavy clay",
      "Arid soil is mainly peat, while black soil is pure sand",
      "Black soil is always coarser than arid soil"
    ],
    "explanation": "Arid soil is usually sandy, whereas black soil has a fine clay-rich texture. This contrast is useful for separating two soil groups that occur in different climatic settings.",
    "sourceFactIds": [
      "ARID-VS-BLACK-TEXTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-047",
    "qlName": "Sandy texture of arid soils",
    "difficulty": "Medium",
    "stem": "Why is 'sandy' an important identification clue for arid soil?",
    "answer": "It is a common physical feature of soils formed in dry regions",
    "distractors": [
      "It proves the soil was deposited by glaciers",
      "It shows the soil is always waterlogged",
      "It means the soil is black cotton soil"
    ],
    "explanation": "Sandy texture is repeatedly noted as a physical feature of arid soil. When it appears with dryness, salinity or low humus, the identification becomes especially strong.",
    "sourceFactIds": [
      "ARID-SANDY-IMPORTANCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-047",
    "qlName": "Sandy texture of arid soils",
    "difficulty": "Hard",
    "stem": "Field A is sandy and saline under a dry climate; Field B is deep clayey soil that cracks on drying. Which field better represents arid soil?",
    "answer": "Field A",
    "distractors": [
      "Field B",
      "Both are equally typical",
      "Neither can be arid soil"
    ],
    "explanation": "Field A matches the sandy and saline character of arid soil under dry conditions. Field B instead matches the heavy clay and shrink-crack behaviour of black soil.",
    "sourceFactIds": [
      "ARID-TEXTURE-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-048",
    "qlName": "Salinity and common-salt occurrence",
    "difficulty": "Easy",
    "stem": "Arid soils are often what in chemical nature?",
    "answer": "Saline",
    "distractors": [
      "Strongly peaty",
      "Always acidic",
      "Completely salt-free"
    ],
    "explanation": "Arid soils are often saline in nature. Limited rainfall and strong evaporation allow salts to remain concentrated in the soil rather than being washed away.",
    "sourceFactIds": [
      "ARID-SALINITY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-048",
    "qlName": "Salinity and common-salt occurrence",
    "difficulty": "Easy",
    "stem": "What may be obtained from highly saline arid-soil areas by evaporating water?",
    "answer": "Common salt",
    "distractors": [
      "Coal",
      "Limestone",
      "Petroleum"
    ],
    "explanation": "Some arid areas contain enough salt for common salt to be obtained by evaporating water. This reflects the high salt concentration found in parts of the dry-region soil system.",
    "sourceFactIds": [
      "ARID-COMMON-SALT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-048",
    "qlName": "Salinity and common-salt occurrence",
    "difficulty": "Medium",
    "stem": "Which feature commonly accompanies the sandy texture of arid soil?",
    "answer": "Salinity",
    "distractors": [
      "Permanent waterlogging",
      "Very high humus",
      "Annual renewal by river silt"
    ],
    "explanation": "Arid soil is commonly both sandy and saline. The dry climate limits leaching, so salts can remain concentrated instead of being removed by abundant rainfall.",
    "sourceFactIds": [
      "ARID-SANDY-SALINE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-048",
    "qlName": "Salinity and common-salt occurrence",
    "difficulty": "Medium",
    "stem": "Why can salts accumulate in arid soil?",
    "answer": "Evaporation is strong and rainfall is too limited to wash them away effectively",
    "distractors": [
      "Glaciers deposit salt each year",
      "Heavy rain removes all water instantly",
      "Annual floods create a fresh clay layer"
    ],
    "explanation": "Dry climates have little rainfall but strong evaporation. Water is lost quickly while dissolved salts remain behind, allowing salinity to build in the soil.",
    "sourceFactIds": [
      "ARID-SALT-ACCUMULATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-048",
    "qlName": "Salinity and common-salt occurrence",
    "difficulty": "Medium",
    "stem": "Which soil clue would most strongly support an arid-soil identification?",
    "answer": "A sandy soil with noticeable salinity",
    "distractors": [
      "A clay soil with deep summer cracks",
      "Fresh flood silt renewed every year",
      "A thick humus-rich mountain soil"
    ],
    "explanation": "The combination of sandiness and salinity is highly characteristic of arid soil. Adding a dry-climate clue would make the identification even more secure.",
    "sourceFactIds": [
      "ARID-SALINITY-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-048",
    "qlName": "Salinity and common-salt occurrence",
    "difficulty": "Hard",
    "stem": "Consider the following statements about arid soil: I. It is generally sandy. II. It may be saline. III. In some places common salt is obtained after evaporation. Which statements are correct?",
    "answer": "I, II and III",
    "distractors": [
      "I and II only",
      "II and III only",
      "I and III only"
    ],
    "explanation": "All three statements are standard features of arid soil. Its sandy texture and salinity reflect the dry environment, and some highly saline areas are used for obtaining common salt by evaporation.",
    "sourceFactIds": [
      "ARID-SALT-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-049",
    "qlName": "Dry climate and rapid evaporation",
    "difficulty": "Easy",
    "stem": "Which climatic condition strongly shapes arid soil?",
    "answer": "A dry climate",
    "distractors": [
      "Heavy year-round rainfall",
      "Permanent snow cover",
      "Frequent river flooding"
    ],
    "explanation": "Arid soil develops under a dry climate with limited rainfall. This dryness influences moisture, humus, salinity and the overall physical condition of the soil.",
    "sourceFactIds": [
      "ARID-DRY-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-049",
    "qlName": "Dry climate and rapid evaporation",
    "difficulty": "Easy",
    "stem": "What happens to evaporation in the hot, dry regions where arid soil occurs?",
    "answer": "It is rapid",
    "distractors": [
      "It stops completely",
      "It becomes slower than in cold regions",
      "It occurs only during floods"
    ],
    "explanation": "Evaporation is rapid in hot, dry regions because temperatures are high and the air is dry. This removes soil moisture quickly and helps salts remain concentrated.",
    "sourceFactIds": [
      "ARID-RAPID-EVAPORATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-049",
    "qlName": "Dry climate and rapid evaporation",
    "difficulty": "Medium",
    "stem": "Why does arid soil often contain little moisture?",
    "answer": "High temperature causes rapid evaporation under a dry climate",
    "distractors": [
      "Annual floods remove the soil each year",
      "Cold weather freezes all water permanently",
      "Heavy rain keeps the soil saturated"
    ],
    "explanation": "High temperature speeds the loss of water from the soil surface. Because rainfall is limited, this moisture is not replaced quickly, so arid soil remains dry for long periods.",
    "sourceFactIds": [
      "ARID-MOISTURE-EVAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-049",
    "qlName": "Dry climate and rapid evaporation",
    "difficulty": "Medium",
    "stem": "Which sequence best explains the moisture condition of arid soil?",
    "answer": "Dry climate → high evaporation → low soil moisture",
    "distractors": [
      "Heavy rainfall → weak evaporation → saline crust",
      "Flood deposition → deep clay → arid soil",
      "Snowfall → melting → dry desert soil"
    ],
    "explanation": "Limited rainfall supplies little water, while high temperature drives rapid evaporation. Together these processes leave arid soil with a low moisture content.",
    "sourceFactIds": [
      "ARID-CLIMATE-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-049",
    "qlName": "Dry climate and rapid evaporation",
    "difficulty": "Medium",
    "stem": "Which factor helps explain both low moisture and salt concentration in arid soil?",
    "answer": "Rapid evaporation",
    "distractors": [
      "Annual river deposition",
      "Permanent snow cover",
      "High humus production"
    ],
    "explanation": "Rapid evaporation removes water but leaves many dissolved salts behind. It therefore contributes both to dryness and to the saline character of arid soil.",
    "sourceFactIds": [
      "ARID-EVAP-DUAL-EFFECT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-049",
    "qlName": "Dry climate and rapid evaporation",
    "difficulty": "Hard",
    "stem": "Two regions have similar parent material, but one is hot and dry while the other is cool and wet. Which region is more likely to develop typical arid-soil features?",
    "answer": "The hot and dry region",
    "distractors": [
      "The cool and wet region",
      "Both must develop identical soils",
      "Climate cannot affect soil properties"
    ],
    "explanation": "The hot and dry region favours rapid evaporation, low moisture and salt concentration. These conditions are central to the development of typical arid-soil characteristics.",
    "sourceFactIds": [
      "ARID-CLIMATE-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-050",
    "qlName": "Low humus and low moisture",
    "difficulty": "Easy",
    "stem": "What is the usual humus condition of arid soil?",
    "answer": "Low humus",
    "distractors": [
      "Very high humus",
      "A thick peat layer",
      "Humus renewed by floods"
    ],
    "explanation": "Arid soil generally contains little humus because dry conditions support sparse biological production and rapid moisture loss. The result is a weak organic-matter reserve.",
    "sourceFactIds": [
      "ARID-LOW-HUMUS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-050",
    "qlName": "Low humus and low moisture",
    "difficulty": "Easy",
    "stem": "Which pair best describes arid soil?",
    "answer": "Low humus and low moisture",
    "distractors": [
      "High humus and high moisture",
      "Thick peat and permanent saturation",
      "Fresh silt and annual renewal"
    ],
    "explanation": "Arid soil is typically poor in both humus and moisture. Dry climate and rapid evaporation limit the water and organic matter available in the soil.",
    "sourceFactIds": [
      "ARID-HUMUS-MOISTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-050",
    "qlName": "Low humus and low moisture",
    "difficulty": "Medium",
    "stem": "Why is humus generally limited in arid soil?",
    "answer": "Dry conditions restrict the build-up of organic matter",
    "distractors": [
      "Heavy floods remove fresh river silt",
      "Permanent snow creates a peat layer",
      "Intense rainfall adds humus continuously"
    ],
    "explanation": "Very dry conditions support less vegetation and less organic input into the soil. With little moisture available, the soil does not develop a thick humus-rich surface layer.",
    "sourceFactIds": [
      "ARID-HUMUS-CAUSE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-050",
    "qlName": "Low humus and low moisture",
    "difficulty": "Medium",
    "stem": "A soil sample from a dry region is sandy, saline and poor in humus. Which soil is most likely?",
    "answer": "Arid soil",
    "distractors": [
      "Black soil",
      "Alluvial soil",
      "Forest soil"
    ],
    "explanation": "Sandy texture, salinity and low humus are a strong cluster of arid-soil features. The dry climate explains why both moisture and organic matter remain limited.",
    "sourceFactIds": [
      "ARID-LOW-HUMUS-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-050",
    "qlName": "Low humus and low moisture",
    "difficulty": "Medium",
    "stem": "Which statement correctly links climate with arid-soil fertility?",
    "answer": "Low moisture and low humus reduce the soil's natural fertility",
    "distractors": [
      "Annual flood silt keeps fertility uniformly high",
      "Permanent waterlogging creates thick humus",
      "Snow cover supplies nutrients throughout the year"
    ],
    "explanation": "Arid soil has limited moisture and little humus, so its natural fertility is often restricted. Irrigation can improve its agricultural usefulness by correcting the water shortage.",
    "sourceFactIds": [
      "ARID-FERTILITY-LINK"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-050",
    "qlName": "Low humus and low moisture",
    "difficulty": "Hard",
    "stem": "A dry-region soil has low moisture, low humus and high salt content. Which climatic process best connects these features?",
    "answer": "Limited rainfall combined with strong evaporation",
    "distractors": [
      "Heavy rainfall combined with slow evaporation",
      "Annual flooding combined with river deposition",
      "Permanent snow combined with glacial melting"
    ],
    "explanation": "Limited rainfall restricts both vegetation and soil moisture, while strong evaporation removes water and concentrates salts. This combination explains several major arid-soil features at once.",
    "sourceFactIds": [
      "ARID-HUMUS-MOISTURE-REASONING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-051",
    "qlName": "Kankar and calcium in lower horizons",
    "difficulty": "Easy",
    "stem": "What commonly accumulates in the lower horizons of arid soil?",
    "answer": "Kankar",
    "distractors": [
      "Fresh humus",
      "Peat",
      "River silt"
    ],
    "explanation": "Lower horizons of arid soil commonly contain kankar, or calcium-rich nodules. Calcium content tends to increase downward, leading to this characteristic accumulation.",
    "sourceFactIds": [
      "ARID-KANKAR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-051",
    "qlName": "Kankar and calcium in lower horizons",
    "difficulty": "Easy",
    "stem": "Which mineral component increases downward in arid-soil profiles and contributes to kankar formation?",
    "answer": "Calcium",
    "distractors": [
      "Carbon only",
      "Gold",
      "Coal"
    ],
    "explanation": "Calcium content increases toward the lower horizons of many arid soils. This promotes the formation of kankar layers or calcium-carbonate nodules below the surface.",
    "sourceFactIds": [
      "ARID-CALCIUM-DOWNWARD"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-051",
    "qlName": "Kankar and calcium in lower horizons",
    "difficulty": "Medium",
    "stem": "Where is the kankar layer usually found in arid soil?",
    "answer": "In the lower soil horizons",
    "distractors": [
      "Only on the leaf surface",
      "Only in river water",
      "Only above permanent snow"
    ],
    "explanation": "Kankar develops in the lower horizons as calcium becomes more concentrated downward. This subsurface layer is one of the important profile features of arid soil.",
    "sourceFactIds": [
      "ARID-KANKAR-LOCATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-051",
    "qlName": "Kankar and calcium in lower horizons",
    "difficulty": "Medium",
    "stem": "Which sequence best explains kankar formation in arid soil?",
    "answer": "Calcium increases downward → calcium-rich nodules accumulate → kankar layer forms",
    "distractors": [
      "Humus increases downward → peat forms → kankar develops",
      "Flood silt accumulates → clay cracks → kankar forms",
      "Snow melts → salts vanish → kankar forms"
    ],
    "explanation": "Calcium becomes increasingly concentrated in the lower part of the soil profile. Over time it forms hard calcium-rich nodules that produce a kankar layer.",
    "sourceFactIds": [
      "ARID-KANKAR-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-051",
    "qlName": "Kankar and calcium in lower horizons",
    "difficulty": "Medium",
    "stem": "A soil pit in a dry region shows calcium-rich nodules in the lower horizon. Which soil is the best fit?",
    "answer": "Arid soil",
    "distractors": [
      "Khadar",
      "Black soil",
      "Forest soil"
    ],
    "explanation": "Calcium-rich kankar in lower horizons is a standard feature of arid soil. Combined with a dry setting, it strongly supports the identification.",
    "sourceFactIds": [
      "ARID-KANKAR-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-051",
    "qlName": "Kankar and calcium in lower horizons",
    "difficulty": "Hard",
    "stem": "Consider the following statements: I. Calcium content may increase downward in arid soil. II. Kankar often develops in lower horizons. III. This layer can affect water movement. Which statements are correct?",
    "answer": "I, II and III",
    "distractors": [
      "I and II only",
      "II and III only",
      "I and III only"
    ],
    "explanation": "All three statements fit the standard arid-soil profile. Calcium accumulates downward, forms kankar in lower horizons and creates a hard layer that can restrict infiltration.",
    "sourceFactIds": [
      "ARID-KANKAR-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-052",
    "qlName": "Kankar layer and restricted infiltration",
    "difficulty": "Easy",
    "stem": "What effect can a kankar layer have on arid soil?",
    "answer": "It can restrict water infiltration",
    "distractors": [
      "It increases annual flood deposition",
      "It creates permanent snow",
      "It produces thick peat"
    ],
    "explanation": "A hard kankar layer can restrict the downward movement of water. This makes infiltration more difficult and can limit how effectively rainfall or irrigation penetrates the soil.",
    "sourceFactIds": [
      "ARID-KANKAR-INFILTRATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-052",
    "qlName": "Kankar layer and restricted infiltration",
    "difficulty": "Easy",
    "stem": "Why may water move slowly through the lower part of an arid-soil profile?",
    "answer": "A hard kankar layer may block infiltration",
    "distractors": [
      "The soil is renewed by floods",
      "The lower horizon is made of peat",
      "Permanent ice seals the surface"
    ],
    "explanation": "Kankar can form a dense calcium-rich layer in the lower horizons. That hard layer reduces the ease with which water passes downward through the profile.",
    "sourceFactIds": [
      "ARID-INFILTRATION-BLOCK"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-052",
    "qlName": "Kankar layer and restricted infiltration",
    "difficulty": "Medium",
    "stem": "Which arid-soil feature most directly limits downward water movement?",
    "answer": "The kankar layer",
    "distractors": [
      "The red-brown colour",
      "The sandy surface alone",
      "The absence of annual flooding"
    ],
    "explanation": "The kankar layer is the feature that directly restricts infiltration. Its hardened calcium-rich material creates a physical barrier below the surface.",
    "sourceFactIds": [
      "ARID-KANKAR-WATER"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-052",
    "qlName": "Kankar layer and restricted infiltration",
    "difficulty": "Medium",
    "stem": "How can kankar affect irrigation efficiency in arid soil?",
    "answer": "It may slow the downward entry of irrigation water",
    "distractors": [
      "It guarantees unlimited drainage",
      "It creates fresh river silt",
      "It removes all salts instantly"
    ],
    "explanation": "Irrigation water must move into and through the soil to reach roots effectively. A hard kankar layer can slow this movement and reduce deep infiltration.",
    "sourceFactIds": [
      "ARID-KANKAR-IRRIGATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-052",
    "qlName": "Kankar layer and restricted infiltration",
    "difficulty": "Medium",
    "stem": "Which chain correctly links calcium accumulation with water movement in arid soil?",
    "answer": "Calcium accumulates → kankar forms → infiltration becomes restricted",
    "distractors": [
      "Humus accumulates → peat forms → infiltration increases without limit",
      "Floods deposit silt → kankar disappears → soil freezes",
      "Sand becomes clay → salts vanish → water stops"
    ],
    "explanation": "Calcium enrichment in lower horizons produces kankar. Once the layer becomes hard and continuous, it can obstruct the downward movement of water.",
    "sourceFactIds": [
      "ARID-KANKAR-WATER-CHAIN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-052",
    "qlName": "Kankar layer and restricted infiltration",
    "difficulty": "Medium",
    "stem": "A farmer finds that water enters the sandy surface but moves poorly through a hard subsurface layer. Which arid-soil feature is the likely cause?",
    "answer": "Kankar accumulation",
    "distractors": [
      "Fresh khadar deposition",
      "Peat formation",
      "Glacial ice"
    ],
    "explanation": "The sandy surface alone would not explain a hard subsurface barrier. Kankar accumulation in the lower horizon can create exactly this kind of restricted infiltration.",
    "sourceFactIds": [
      "ARID-KANKAR-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-053",
    "qlName": "Irrigation and cultivability",
    "difficulty": "Easy",
    "stem": "What can make arid soil cultivable in many areas?",
    "answer": "Proper irrigation",
    "distractors": [
      "Permanent snow cover",
      "Annual river flooding only",
      "Removing all soil moisture"
    ],
    "explanation": "Proper irrigation can make arid soil cultivable by correcting its severe moisture shortage. This transformation is well known in parts of western Rajasthan.",
    "sourceFactIds": [
      "ARID-IRRIGATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-053",
    "qlName": "Irrigation and cultivability",
    "difficulty": "Easy",
    "stem": "Which region is a standard example of arid soil becoming cultivable after irrigation?",
    "answer": "Western Rajasthan",
    "distractors": [
      "The high Himalaya",
      "The Ganga delta only",
      "The Brahmaputra floodplain only"
    ],
    "explanation": "Western Rajasthan is a standard example where irrigation has increased the agricultural use of arid soil. Supplying water helps overcome the natural dryness of the region.",
    "sourceFactIds": [
      "ARID-WESTERN-RAJASTHAN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-053",
    "qlName": "Irrigation and cultivability",
    "difficulty": "Medium",
    "stem": "Why does irrigation improve the agricultural value of arid soil?",
    "answer": "It supplies the moisture that the dry climate fails to provide",
    "distractors": [
      "It converts sand directly into black soil",
      "It creates annual Himalayan floods",
      "It removes every mineral from the soil"
    ],
    "explanation": "The main limitation of arid soil is severe water shortage under dry conditions. Irrigation supplies dependable moisture, allowing crops to grow where rainfall alone would be insufficient.",
    "sourceFactIds": [
      "ARID-IRRIGATION-REASON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-053",
    "qlName": "Irrigation and cultivability",
    "difficulty": "Medium",
    "stem": "Which statement best explains the change in irrigated arid land?",
    "answer": "A naturally dry soil can become productive when adequate water is supplied",
    "distractors": [
      "Irrigation permanently changes arid soil into alluvium",
      "Irrigation eliminates all salts in one day",
      "The soil becomes fertile only because of snowmelt"
    ],
    "explanation": "Arid soil is not necessarily unusable for farming. When sufficient irrigation is provided and other problems are managed, the land can support regular cultivation.",
    "sourceFactIds": [
      "ARID-CULTIVABLE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-053",
    "qlName": "Irrigation and cultivability",
    "difficulty": "Medium",
    "stem": "A dry sandy field in western Rajasthan becomes productive after canal irrigation. Which soil principle does this illustrate?",
    "answer": "Arid soil can be cultivated with proper irrigation",
    "distractors": [
      "Black soil requires annual floods",
      "Laterite soil requires permanent waterlogging",
      "Forest soil forms after canal construction"
    ],
    "explanation": "The example shows how water supply can overcome one of the strongest limits of arid soil. Irrigation changes the agricultural potential without changing the soil into a different soil group.",
    "sourceFactIds": [
      "ARID-CANAL-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-053",
    "qlName": "Irrigation and cultivability",
    "difficulty": "Medium",
    "stem": "Which improvement most directly addresses the low-moisture problem of arid soil?",
    "answer": "Reliable irrigation",
    "distractors": [
      "Increasing evaporation",
      "Removing vegetation",
      "Encouraging salt accumulation"
    ],
    "explanation": "Reliable irrigation directly replaces the water missing under arid conditions. Other management may also be needed, but water supply is the first requirement for regular cultivation.",
    "sourceFactIds": [
      "ARID-WATER-MANAGEMENT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-054",
    "qlName": "Integrated arid-soil reasoning",
    "difficulty": "Easy",
    "stem": "A sandy, saline soil with low humus occurs under a hot dry climate. Which soil is it?",
    "answer": "Arid soil",
    "distractors": [
      "Black soil",
      "Laterite soil",
      "Forest soil"
    ],
    "explanation": "The combination of sandiness, salinity, low humus and dry climate identifies arid soil. These clues work together and are stronger than any one feature taken alone.",
    "sourceFactIds": [
      "ARID-INTEGRATED-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-054",
    "qlName": "Integrated arid-soil reasoning",
    "difficulty": "Easy",
    "stem": "Which soil may contain lower-horizon kankar and become cultivable after proper irrigation?",
    "answer": "Arid soil",
    "distractors": [
      "Khadar",
      "Black soil",
      "Laterite soil"
    ],
    "explanation": "Arid soil often contains kankar in its lower horizons because calcium accumulates downward. Proper irrigation can improve its agricultural use despite the naturally dry conditions.",
    "sourceFactIds": [
      "ARID-INTEGRATED-KANKAR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-054",
    "qlName": "Integrated arid-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which combination correctly describes arid soil?",
    "answer": "Red-brown colour, sandy texture and salinity",
    "distractors": [
      "Deep black clay, strong cracking and basaltic origin",
      "Heavy rainfall, intense leaching and low humus",
      "Fresh flood silt, annual renewal and khadar"
    ],
    "explanation": "Arid soil is commonly red to brown, sandy and saline. The combination reflects the hot dry climate in which evaporation is high and rainfall is limited.",
    "sourceFactIds": [
      "ARID-INTEGRATED-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-054",
    "qlName": "Integrated arid-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which chain best explains several features of arid soil?",
    "answer": "Dry climate → rapid evaporation → low moisture and salt concentration",
    "distractors": [
      "Heavy rainfall → intense leaching → salt concentration",
      "Annual flooding → fresh silt → kankar formation",
      "Permanent snow → rapid evaporation → sandy soil"
    ],
    "explanation": "Dry climate limits the water supply, while high temperature drives strong evaporation. This leaves little soil moisture and can concentrate salts in the profile.",
    "sourceFactIds": [
      "ARID-INTEGRATED-CHAIN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-054",
    "qlName": "Integrated arid-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which statement best distinguishes arid soil from laterite soil?",
    "answer": "Arid soil forms under dryness and may be saline, while laterite forms under heavy rainfall and strong leaching",
    "distractors": [
      "Both require heavy rainfall and intense leaching",
      "Laterite is always sandy and saline",
      "Arid soil is renewed annually by rivers"
    ],
    "explanation": "Arid and laterite soils form under almost opposite moisture conditions. Arid soil reflects dryness and evaporation, whereas laterite reflects abundant rainfall and strong leaching.",
    "sourceFactIds": [
      "ARID-VS-LATERITE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-054",
    "qlName": "Integrated arid-soil reasoning",
    "difficulty": "Medium",
    "stem": "A soil profile is sandy at the surface, saline, low in humus and has a hard calcium-rich layer below. Which diagnosis is most consistent?",
    "answer": "Arid soil with kankar accumulation",
    "distractors": [
      "Black soil with self-ploughing",
      "Khadar with annual renewal",
      "Forest soil with a humus-rich surface"
    ],
    "explanation": "The surface clues identify a dry saline soil, while the hard calcium-rich lower layer points to kankar. Together these are standard features of arid soil.",
    "sourceFactIds": [
      "ARID-INTEGRATED-PROFILE"
    ]
  }
]);

export const GEO_SOI_001_CP006_REVIEW_BATCH_V1: readonly GeoSoi001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-SOI-001-CP006-Q${String(index + 1).padStart(3, "0")}`,
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

export function auditGeoSoi001Cp006ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoSoi001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_SOI_001_CP006_REVIEW_BATCH_V1) {
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

  if (GEO_SOI_001_CP006_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_SOI_001_CP006_REVIEW_BATCH_V1.length);
  for (let n = 46; n <= 54; n += 1) {
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
    questionCount: GEO_SOI_001_CP006_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
