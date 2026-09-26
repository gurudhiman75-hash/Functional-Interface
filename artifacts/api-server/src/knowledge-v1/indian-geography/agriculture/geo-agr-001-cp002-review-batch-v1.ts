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
    "qlId": "GEO-AGR-001-QL-010",
    "qlName": "Rice — season and temperature/rainfall needs",
    "difficulty": "Easy",
    "stem": "Rice is generally grown as which major crop season in India?",
    "answer": "Kharif",
    "distractors": [
      "Rabi",
      "Zaid only",
      "Winter plantation"
    ],
    "explanation": "Rice is commonly sown with the monsoon and harvested after the rainy season, placing it in the kharif cycle. Irrigation can modify timing locally, but the standard exam classification is kharif.",
    "sourceFactIds": [
      "RICE-KHARIF"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-010",
    "qlName": "Rice — season and temperature/rainfall needs",
    "difficulty": "Easy",
    "stem": "Which climate is most suitable for rice cultivation?",
    "answer": "High temperature with abundant moisture",
    "distractors": [
      "Cold dry winter with little water",
      "Cool arid climate with frost",
      "Very low humidity and sparse rainfall"
    ],
    "explanation": "Rice grows best under warm, humid conditions with plentiful water during much of its growing period. High temperature and abundant moisture therefore form the classic rice climate.",
    "sourceFactIds": [
      "RICE-WARM-MOIST"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-010",
    "qlName": "Rice — season and temperature/rainfall needs",
    "difficulty": "Medium",
    "stem": "Which rainfall condition naturally favours rice without heavy irrigation support?",
    "answer": "High and well-distributed rainfall",
    "distractors": [
      "Very low annual rainfall",
      "Long frost season",
      "Almost no monsoon rain"
    ],
    "explanation": "Rice needs abundant water, so regions with high and dependable rainfall can support it naturally. Drier regions can still grow rice when irrigation replaces the missing rainfall.",
    "sourceFactIds": [
      "RICE-HIGH-RAINFALL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-010",
    "qlName": "Rice — season and temperature/rainfall needs",
    "difficulty": "Medium",
    "stem": "Why is rice strongly linked with the monsoon season?",
    "answer": "Its growth requires warm conditions and a large water supply",
    "distractors": [
      "It needs winter frost for germination",
      "It grows only under dry winds",
      "It requires frozen soil at sowing"
    ],
    "explanation": "The monsoon provides both warm weather and much of the water needed by rice fields. That combination makes rice one of India's most characteristic kharif crops.",
    "sourceFactIds": [
      "RICE-MONSOON-LINK"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-010",
    "qlName": "Rice — season and temperature/rainfall needs",
    "difficulty": "Medium",
    "stem": "Which change would create the greatest difficulty for rain-fed rice cultivation?",
    "answer": "A prolonged monsoon rainfall deficit",
    "distractors": [
      "A cool night near harvest only",
      "A short spell of bright sunshine",
      "A mild breeze during field preparation"
    ],
    "explanation": "Rain-fed rice depends heavily on monsoon water through its growing period. A prolonged rainfall deficit reduces field moisture and can sharply limit the crop.",
    "sourceFactIds": [
      "RICE-RAINFALL-DEFICIT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-010",
    "qlName": "Rice — season and temperature/rainfall needs",
    "difficulty": "Hard",
    "stem": "Region A is hot and humid with heavy monsoon rain; Region B is cool and dry with limited irrigation. Which crop is more naturally suited to Region A than B?",
    "answer": "Rice",
    "distractors": [
      "Wheat",
      "Gram",
      "Mustard"
    ],
    "explanation": "Hot, humid conditions with abundant monsoon rainfall strongly favour rice. Wheat, gram and mustard fit the cooler and generally drier rabi season better.",
    "sourceFactIds": [
      "RICE-CLIMATE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-011",
    "qlName": "Rice — field/water conditions",
    "difficulty": "Easy",
    "stem": "Which field condition is especially useful for lowland rice cultivation?",
    "answer": "A dependable supply of standing or retained water",
    "distractors": [
      "Completely dry soil throughout growth",
      "Permanent frost cover",
      "Loose desert sand without irrigation"
    ],
    "explanation": "Lowland rice performs well where fields can retain or receive abundant water. Level land and controlled water supply help maintain the moist conditions the crop needs.",
    "sourceFactIds": [
      "RICE-FIELD-WATER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-011",
    "qlName": "Rice — field/water conditions",
    "difficulty": "Easy",
    "stem": "Why are level plains favourable for irrigated rice?",
    "answer": "Water can be spread and retained more easily across fields",
    "distractors": [
      "They prevent all water from reaching crops",
      "They create permanent frost",
      "They remove the need for soil moisture"
    ],
    "explanation": "Level fields make it easier to distribute irrigation water and maintain the wet conditions required by paddy. Uneven slopes make water control more difficult.",
    "sourceFactIds": [
      "RICE-LEVEL-PLAINS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-011",
    "qlName": "Rice — field/water conditions",
    "difficulty": "Medium",
    "stem": "Which soil-water combination is favourable for paddy cultivation?",
    "answer": "Moist soil that can hold water for crop growth",
    "distractors": [
      "Extremely dry sand with no water source",
      "Frozen soil with permanent snow",
      "Rocky ground that drains instantly"
    ],
    "explanation": "Rice needs sustained moisture, so soils and fields that retain water are especially useful. Very rapid drainage without irrigation makes paddy cultivation difficult.",
    "sourceFactIds": [
      "RICE-WATER-RETENTION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-011",
    "qlName": "Rice — field/water conditions",
    "difficulty": "Medium",
    "stem": "Why are river plains and deltaic lowlands often favourable for rice?",
    "answer": "They combine fertile soils with good access to water",
    "distractors": [
      "They are permanently too dry for crops",
      "They receive no sediment or moisture",
      "They remain frozen during the monsoon"
    ],
    "explanation": "River plains and deltas often provide fertile alluvial soils, level surfaces and plentiful water. These conditions support the moisture-demanding nature of rice.",
    "sourceFactIds": [
      "RICE-PLAINS-DELTAS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-011",
    "qlName": "Rice — field/water conditions",
    "difficulty": "Medium",
    "stem": "Which farming improvement can make rice possible in a lower-rainfall region?",
    "answer": "Reliable canal or groundwater irrigation",
    "distractors": [
      "Removal of all water sources",
      "Dependence only on winter frost",
      "Elimination of field levelling"
    ],
    "explanation": "Irrigation can replace part of the rainfall requirement of rice by supplying water when natural precipitation is insufficient. Canals and tube wells therefore extend its cultivation into drier areas.",
    "sourceFactIds": [
      "RICE-IRRIGATION-EXTENSION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-011",
    "qlName": "Rice — field/water conditions",
    "difficulty": "Hard",
    "stem": "Two districts are equally warm. District A has level irrigated fields, while District B has dry rapidly draining land without irrigation. Which district is better suited to paddy?",
    "answer": "District A",
    "distractors": [
      "District B",
      "Both are equally suited because water is unimportant",
      "Neither can grow rice under any condition"
    ],
    "explanation": "Warmth alone is not enough for paddy; the crop also needs dependable moisture. District A can retain and supply water, so it is much better suited to rice.",
    "sourceFactIds": [
      "RICE-FIELD-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-012",
    "qlName": "Rice — major geographic belt",
    "difficulty": "Easy",
    "stem": "Which region is a classic rice-growing belt in India?",
    "answer": "Eastern and northeastern plains",
    "distractors": [
      "Cold high-altitude deserts only",
      "Western arid desert without irrigation",
      "Dry interior plateaus only"
    ],
    "explanation": "The eastern and northeastern plains receive abundant monsoon rainfall and contain extensive alluvial lowlands. These conditions support widespread rice cultivation.",
    "sourceFactIds": [
      "RICE-EAST-NE-PLAINS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-012",
    "qlName": "Rice — major geographic belt",
    "difficulty": "Easy",
    "stem": "Rice is widely cultivated in which coastal setting?",
    "answer": "Coastal plains and river deltas",
    "distractors": [
      "Only snow-covered mountain summits",
      "Only dry rocky uplands",
      "Only inland salt deserts"
    ],
    "explanation": "Coastal plains and deltaic areas offer warm conditions, fertile alluvial soils and abundant water. These features make them important rice-growing environments.",
    "sourceFactIds": [
      "RICE-COASTAL-DELTAIC"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-012",
    "qlName": "Rice — major geographic belt",
    "difficulty": "Medium",
    "stem": "Which set contains regions naturally favourable for rice?",
    "answer": "Ganga-Brahmaputra plains, coastal plains, deltaic lowlands",
    "distractors": [
      "Cold desert, high Himalayan slopes, arid dunes",
      "Dry plateau without irrigation, salt flats, snowfields",
      "Rocky uplands only, desert basins, glaciated valleys"
    ],
    "explanation": "Major river plains, coastal plains and deltas combine water availability with warm growing conditions. These are recurring geographic settings for rice in India.",
    "sourceFactIds": [
      "RICE-REGION-SET"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-012",
    "qlName": "Rice — major geographic belt",
    "difficulty": "Medium",
    "stem": "Why is eastern India strongly linked with rice cultivation?",
    "answer": "Monsoon rainfall and extensive river plains provide favourable moisture and soils",
    "distractors": [
      "The region has almost no rainfall",
      "The land remains frozen through summer",
      "The area lacks rivers and alluvial soils"
    ],
    "explanation": "Eastern India receives substantial monsoon rainfall and contains large river plains and deltaic tracts. The combination of moisture and fertile soils favours rice.",
    "sourceFactIds": [
      "RICE-EASTERN-REASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-012",
    "qlName": "Rice — major geographic belt",
    "difficulty": "Medium",
    "stem": "Which geographic setting would most naturally support extensive paddy fields?",
    "answer": "Warm deltaic plain with abundant monsoon water",
    "distractors": [
      "Cold arid plateau without irrigation",
      "High snowy ridge with a short growing season",
      "Dry dune field far from water"
    ],
    "explanation": "Paddy requires warmth and plentiful moisture, while a deltaic plain also provides level fertile land. That combination is far more suitable than cold or arid settings.",
    "sourceFactIds": [
      "RICE-DELTA-SETTING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-012",
    "qlName": "Rice — major geographic belt",
    "difficulty": "Medium",
    "stem": "Which location clue points most strongly toward a rice belt?",
    "answer": "Low-lying fertile plain receiving heavy monsoon rainfall",
    "distractors": [
      "Dry interior plateau with sparse rain and no irrigation",
      "High-altitude cold desert",
      "Rocky slope with little soil"
    ],
    "explanation": "A low fertile plain with abundant monsoon rainfall provides the water, warmth and field conditions needed by rice. The other settings create major moisture or temperature constraints.",
    "sourceFactIds": [
      "RICE-BELT-CLUE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-013",
    "qlName": "Rice — irrigated extension beyond high-rainfall belt",
    "difficulty": "Easy",
    "stem": "How can rice be grown successfully in parts of northwestern India with lower natural rainfall?",
    "answer": "Through extensive irrigation",
    "distractors": [
      "By removing all water supply",
      "By depending on winter snowfall alone",
      "By sowing only on dry dunes"
    ],
    "explanation": "Canal and groundwater irrigation can supply the large amount of water that rice needs when monsoon rainfall is insufficient. This allows paddy to expand beyond naturally wet regions.",
    "sourceFactIds": [
      "RICE-NW-IRRIGATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-013",
    "qlName": "Rice — irrigated extension beyond high-rainfall belt",
    "difficulty": "Easy",
    "stem": "Which states are well-known examples of irrigated rice cultivation in the northwest?",
    "answer": "Punjab and Haryana",
    "distractors": [
      "Kerala and Tamil Nadu only",
      "Assam and Meghalaya only",
      "Sikkim and Arunachal Pradesh only"
    ],
    "explanation": "Punjab and Haryana have lower natural rainfall than the traditional eastern rice belt, yet irrigation supports extensive paddy cultivation. This is a standard example of technology altering crop geography.",
    "sourceFactIds": [
      "RICE-PUNJAB-HARYANA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-013",
    "qlName": "Rice — irrigated extension beyond high-rainfall belt",
    "difficulty": "Medium",
    "stem": "What explains rice cultivation in a region receiving less rainfall than the traditional paddy belt?",
    "answer": "A dense irrigation network can compensate for rainfall shortage",
    "distractors": [
      "Rice needs no water once sown",
      "Low rainfall automatically improves paddy yield",
      "Winter frost replaces field moisture"
    ],
    "explanation": "Rice requires abundant moisture, but irrigation can provide that water even where rainfall is lower. Crop geography can therefore change when water infrastructure improves.",
    "sourceFactIds": [
      "RICE-IRRIGATION-COMPENSATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-013",
    "qlName": "Rice — irrigated extension beyond high-rainfall belt",
    "difficulty": "Medium",
    "stem": "Which development would most directly expand rice cultivation into a drier plain?",
    "answer": "New canals and tube wells",
    "distractors": [
      "Closing irrigation channels",
      "Reducing groundwater access",
      "Replacing level fields with bare rocky slopes"
    ],
    "explanation": "Canals and tube wells make dependable water available during the rice-growing season. They can therefore overcome part of the natural rainfall limitation in drier plains.",
    "sourceFactIds": [
      "RICE-CANALS-TUBEWELLS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-013",
    "qlName": "Rice — irrigated extension beyond high-rainfall belt",
    "difficulty": "Medium",
    "stem": "Which comparison is accurate for rice geography in India?",
    "answer": "High-rainfall eastern regions grow rice naturally; drier northwestern regions depend more on irrigation",
    "distractors": [
      "Northwestern rice needs no water while eastern rice needs irrigation only",
      "Rice is restricted completely to one rainfall zone",
      "Irrigation cannot alter the geographic spread of rice"
    ],
    "explanation": "Eastern and deltaic regions often receive enough monsoon water for rice, while drier northwestern areas require greater irrigation support. Water infrastructure extends the crop beyond its natural rainfall belt.",
    "sourceFactIds": [
      "RICE-EAST-NW-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-013",
    "qlName": "Rice — irrigated extension beyond high-rainfall belt",
    "difficulty": "Medium",
    "stem": "Which factor best explains paddy fields in western Uttar Pradesh despite lower rainfall than eastern rice belts?",
    "answer": "Assured irrigation",
    "distractors": [
      "Permanent snow cover",
      "Absence of water demand",
      "Only coastal humidity"
    ],
    "explanation": "Western Uttar Pradesh has extensive irrigation from canals and groundwater. Assured water allows rice cultivation even though natural rainfall is lower than in the eastern rice belt.",
    "sourceFactIds": [
      "RICE-WUP-IRRIGATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-014",
    "qlName": "Wheat — season and temperature pattern",
    "difficulty": "Easy",
    "stem": "Wheat is generally grown as which crop season in India?",
    "answer": "Rabi",
    "distractors": [
      "Kharif",
      "Zaid only",
      "Monsoon plantation"
    ],
    "explanation": "Wheat is sown in the cooler post-monsoon months and harvested in spring. This timing places it firmly in the rabi season.",
    "sourceFactIds": [
      "WHEAT-RABI"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-014",
    "qlName": "Wheat — season and temperature pattern",
    "difficulty": "Easy",
    "stem": "Which temperature pattern suits wheat cultivation?",
    "answer": "Cool growing season followed by warmer sunny ripening weather",
    "distractors": [
      "Hot humid weather throughout with standing water",
      "Permanent frost from sowing to harvest",
      "Very hot monsoon conditions at every stage"
    ],
    "explanation": "Wheat grows well under cool conditions during much of its vegetative period and benefits from bright sunshine as the grain ripens. This matches India's winter-to-spring rabi cycle.",
    "sourceFactIds": [
      "WHEAT-COOL-SUNNY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-014",
    "qlName": "Wheat — season and temperature pattern",
    "difficulty": "Medium",
    "stem": "Why is wheat better suited to the rabi season than the peak monsoon season?",
    "answer": "It benefits from cooler growth conditions and dry sunny weather near ripening",
    "distractors": [
      "It needs permanent field flooding",
      "It requires continuous heavy monsoon rainfall",
      "It grows only under tropical humidity"
    ],
    "explanation": "Wheat prefers a cool growing season and relatively dry bright conditions as it matures. Peak monsoon humidity and heavy rainfall are not its ideal ripening environment.",
    "sourceFactIds": [
      "WHEAT-RABI-REASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-014",
    "qlName": "Wheat — season and temperature pattern",
    "difficulty": "Medium",
    "stem": "Which weather change is especially useful when wheat approaches maturity?",
    "answer": "Clear, bright sunshine",
    "distractors": [
      "Persistent heavy rain",
      "Waterlogging",
      "Continuous dense cloud and storms"
    ],
    "explanation": "Bright sunshine and comparatively dry weather support wheat ripening and harvest. Excess rain at maturity can damage grain quality and delay harvesting.",
    "sourceFactIds": [
      "WHEAT-RIPENING-SUNSHINE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-014",
    "qlName": "Wheat — season and temperature pattern",
    "difficulty": "Medium",
    "stem": "A crop is sown in cool weather and harvested as temperatures rise in spring. Which crop fits this pattern?",
    "answer": "Wheat",
    "distractors": [
      "Rice",
      "Jute",
      "Cotton"
    ],
    "explanation": "Wheat follows the classic rabi pattern of cool-season growth and spring harvest. Rice, jute and cotton are more closely linked with the warm kharif season.",
    "sourceFactIds": [
      "WHEAT-SEASON-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-014",
    "qlName": "Wheat — season and temperature pattern",
    "difficulty": "Hard",
    "stem": "Region A has a cool dry winter and sunny spring; Region B stays hot and waterlogged through the monsoon. Which region is more naturally suited to wheat?",
    "answer": "Region A",
    "distractors": [
      "Region B",
      "Both are equally suited because temperature is irrelevant",
      "Neither can grow wheat under any condition"
    ],
    "explanation": "Wheat benefits from cool winter growth and sunny conditions as it ripens, which Region A provides. Region B better resembles a wet rice environment.",
    "sourceFactIds": [
      "WHEAT-CLIMATE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-015",
    "qlName": "Wheat — rainfall/irrigation needs",
    "difficulty": "Easy",
    "stem": "Compared with rice, wheat generally requires what type of water regime?",
    "answer": "Moderate moisture rather than prolonged field flooding",
    "distractors": [
      "Permanent standing water throughout",
      "No water at any stage",
      "Only tidal seawater"
    ],
    "explanation": "Wheat needs adequate soil moisture but not the prolonged flooded conditions common in paddy fields. Moderate rainfall or irrigation is more suitable.",
    "sourceFactIds": [
      "WHEAT-MODERATE-MOISTURE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-015",
    "qlName": "Wheat — rainfall/irrigation needs",
    "difficulty": "Easy",
    "stem": "Which water source can support wheat when winter rainfall is insufficient?",
    "answer": "Irrigation",
    "distractors": [
      "Sea spray only",
      "Permanent snow cover",
      "No moisture source"
    ],
    "explanation": "Irrigation supplies soil moisture during the rabi season when natural rainfall is limited. It is especially important in dry wheat-growing plains.",
    "sourceFactIds": [
      "WHEAT-IRRIGATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-015",
    "qlName": "Wheat — rainfall/irrigation needs",
    "difficulty": "Medium",
    "stem": "Why is excessive rainfall near wheat harvest undesirable?",
    "answer": "It can interfere with ripening and harvesting",
    "distractors": [
      "Wheat requires fields to remain flooded",
      "Heavy rain is essential for grain drying",
      "It converts wheat into a kharif crop"
    ],
    "explanation": "Wheat benefits from dry bright weather near maturity, so heavy rain can lodge plants, delay harvest and affect grain quality. The crop does not need flooded fields.",
    "sourceFactIds": [
      "WHEAT-HARVEST-RAIN"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-015",
    "qlName": "Wheat — rainfall/irrigation needs",
    "difficulty": "Medium",
    "stem": "Which setting is favourable for irrigated wheat?",
    "answer": "Cool winter plain with controlled water supply",
    "distractors": [
      "Warm flooded delta during peak monsoon",
      "Hot coastal swamp throughout the year",
      "Dry desert with no irrigation"
    ],
    "explanation": "Wheat needs cool-season conditions and adequate but controlled moisture. A winter plain supplied by canals or groundwater can provide both.",
    "sourceFactIds": [
      "WHEAT-IRRIGATED-SETTING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-015",
    "qlName": "Wheat — rainfall/irrigation needs",
    "difficulty": "Medium",
    "stem": "Which statement fits wheat water requirements better than rice?",
    "answer": "Wheat can grow with moderate rainfall supplemented by irrigation",
    "distractors": [
      "Wheat requires continuous standing water",
      "Wheat needs heavier rainfall than paddy",
      "Wheat cannot use irrigation"
    ],
    "explanation": "Wheat generally needs less water than rice and can be supported by moderate rainfall plus irrigation. Paddy is far more closely linked with abundant water.",
    "sourceFactIds": [
      "WHEAT-VS-RICE-WATER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-015",
    "qlName": "Wheat — rainfall/irrigation needs",
    "difficulty": "Hard",
    "stem": "A rabi district receives limited winter rain but has reliable canal irrigation. Which major cereal can still be grown successfully?",
    "answer": "Wheat",
    "distractors": [
      "Rice only",
      "Jute only",
      "Rubber only"
    ],
    "explanation": "Wheat is a rabi cereal and can be supported by irrigation when winter rainfall is inadequate. Reliable canals can therefore sustain wheat in relatively dry regions.",
    "sourceFactIds": [
      "WHEAT-CANAL-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-016",
    "qlName": "Wheat — major geographic belt",
    "difficulty": "Easy",
    "stem": "Which plain is strongly linked with wheat cultivation in India?",
    "answer": "Ganga–Satluj plains",
    "distractors": [
      "Sundarbans tidal delta only",
      "Andaman island slopes only",
      "Cold desert valleys only"
    ],
    "explanation": "The Ganga–Satluj plains form one of India's important wheat belts because of fertile soils, cool winters and extensive irrigation. The setting is well suited to rabi cultivation.",
    "sourceFactIds": [
      "WHEAT-GANGA-SATLUJ"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-016",
    "qlName": "Wheat — major geographic belt",
    "difficulty": "Easy",
    "stem": "Which other physical region is known for wheat besides the northwestern plains?",
    "answer": "Black-soil parts of the Deccan",
    "distractors": [
      "Mangrove swamps only",
      "Coral islands only",
      "High Himalayan snowfields"
    ],
    "explanation": "Along with the Ganga–Satluj plains, black-soil areas of the Deccan form another important wheat zone. These regions provide suitable soils and seasonal conditions.",
    "sourceFactIds": [
      "WHEAT-DECCAN-BLACK-SOIL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-016",
    "qlName": "Wheat — major geographic belt",
    "difficulty": "Medium",
    "stem": "Which set contains states commonly linked with India's wheat belt?",
    "answer": "Punjab, Haryana, Uttar Pradesh, Madhya Pradesh",
    "distractors": [
      "Kerala, Goa, Nagaland, Mizoram",
      "Tamil Nadu, Tripura, Meghalaya, Goa",
      "Sikkim, Arunachal Pradesh, Kerala, Manipur"
    ],
    "explanation": "Punjab, Haryana, Uttar Pradesh and Madhya Pradesh are established wheat-growing states across the northern plains and central interior. The distractor groups do not form a standard wheat belt.",
    "sourceFactIds": [
      "WHEAT-STATE-BELT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-016",
    "qlName": "Wheat — major geographic belt",
    "difficulty": "Medium",
    "stem": "Why are Punjab and Haryana well suited to wheat?",
    "answer": "Cool rabi weather, fertile plains and extensive irrigation",
    "distractors": [
      "Permanent tropical flooding and tidal water",
      "Very high mountain snow throughout the year",
      "Absence of winter cultivation"
    ],
    "explanation": "Punjab and Haryana combine fertile alluvial plains with cool winter conditions and strong irrigation infrastructure. Together these factors support intensive wheat cultivation.",
    "sourceFactIds": [
      "WHEAT-PUNJAB-HARYANA-REASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-016",
    "qlName": "Wheat — major geographic belt",
    "difficulty": "Medium",
    "stem": "Which landscape clue points most strongly toward a wheat belt?",
    "answer": "Irrigated alluvial plain with cool winters",
    "distractors": [
      "Hot waterlogged delta throughout the monsoon",
      "Humid evergreen plantation slope",
      "Coastal mangrove swamp"
    ],
    "explanation": "Wheat thrives in cool-season plains with fertile soil and controlled moisture. An irrigated alluvial plain therefore fits wheat better than tropical wetland or plantation settings.",
    "sourceFactIds": [
      "WHEAT-BELT-CLUE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-016",
    "qlName": "Wheat — major geographic belt",
    "difficulty": "Medium",
    "stem": "Which regional combination represents the two classic wheat zones?",
    "answer": "Northwestern plains and black-soil Deccan",
    "distractors": [
      "Eastern delta and coral islands",
      "Himalayan snowfields and mangrove coast",
      "Western desert dunes and tidal swamps"
    ],
    "explanation": "India's standard wheat geography includes the Ganga–Satluj plains and black-soil areas of the Deccan. These two zones capture the crop's northern and central distribution.",
    "sourceFactIds": [
      "WHEAT-TWO-ZONES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-017",
    "qlName": "Rice vs wheat comparison",
    "difficulty": "Easy",
    "stem": "Which comparison of rice and wheat is accurate?",
    "answer": "Rice is generally kharif; wheat is generally rabi",
    "distractors": [
      "Rice is rabi; wheat is kharif",
      "Both are only zaid crops",
      "Both are plantation crops"
    ],
    "explanation": "Rice is commonly grown during the monsoon kharif season, while wheat is a cool-season rabi crop. Their seasonal contrast is fundamental to Indian crop geography.",
    "sourceFactIds": [
      "RICE-WHEAT-SEASON-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-017",
    "qlName": "Rice vs wheat comparison",
    "difficulty": "Easy",
    "stem": "Which crop generally needs more abundant water during growth?",
    "answer": "Rice",
    "distractors": [
      "Wheat",
      "Both need identical flooded fields",
      "Neither needs soil moisture"
    ],
    "explanation": "Rice has a much higher water requirement and is often grown in wet or irrigated fields. Wheat needs adequate moisture but does not require paddy-style flooding.",
    "sourceFactIds": [
      "RICE-WHEAT-WATER-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-017",
    "qlName": "Rice vs wheat comparison",
    "difficulty": "Medium",
    "stem": "Which climate pairing is accurate?",
    "answer": "Rice — warm and moist; wheat — cool growing season with sunny ripening",
    "distractors": [
      "Rice — cool and dry; wheat — hot and flooded",
      "Rice — frost climate; wheat — tropical swamp",
      "Both require permanent standing water"
    ],
    "explanation": "Rice fits warm humid conditions with abundant water, while wheat prefers cool-season growth and bright weather during ripening. The contrast helps distinguish their crop belts.",
    "sourceFactIds": [
      "RICE-WHEAT-CLIMATE-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-017",
    "qlName": "Rice vs wheat comparison",
    "difficulty": "Medium",
    "stem": "Which regional contrast is accurate?",
    "answer": "Rice is prominent in wetter eastern/deltaic areas; wheat is prominent in northwestern irrigated plains",
    "distractors": [
      "Wheat is restricted to deltas; rice is restricted to cold deserts",
      "Rice cannot grow with irrigation; wheat requires flooded fields",
      "Both crops occur only in coastal mangroves"
    ],
    "explanation": "Rice naturally favours wetter eastern and deltaic regions, while wheat has a strong belt in the cooler northwestern plains. Irrigation modifies both patterns but does not erase the contrast.",
    "sourceFactIds": [
      "RICE-WHEAT-REGIONAL-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-017",
    "qlName": "Rice vs wheat comparison",
    "difficulty": "Medium",
    "stem": "Which field condition separates paddy from wheat most clearly?",
    "answer": "Paddy commonly tolerates or uses standing water; wheat prefers controlled soil moisture",
    "distractors": [
      "Wheat requires deeper standing water than paddy",
      "Both crops need permanent waterlogging",
      "Rice grows only in dry soil"
    ],
    "explanation": "Paddy cultivation often maintains a wet field environment, while wheat grows better with moist but well-managed soil. Water regime is therefore a major contrast.",
    "sourceFactIds": [
      "RICE-WHEAT-FIELD-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-017",
    "qlName": "Rice vs wheat comparison",
    "difficulty": "Hard",
    "stem": "District A is hot, humid and rain-rich during monsoon; District B has a cool winter, irrigation and sunny spring. Which crop pairing fits best?",
    "answer": "A rice; B wheat",
    "distractors": [
      "A wheat; B rice",
      "A gram; B jute",
      "A mustard; B rice"
    ],
    "explanation": "District A matches the warm wet environment preferred by rice. District B matches the cool irrigated rabi conditions and sunny ripening weather favoured by wheat.",
    "sourceFactIds": [
      "RICE-WHEAT-DISTRICT-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-018",
    "qlName": "Rice/wheat map and season reasoning",
    "difficulty": "Easy",
    "stem": "A map marks a heavily irrigated northwestern plain under winter cereal cultivation. Which crop is the strongest match?",
    "answer": "Wheat",
    "distractors": [
      "Rice as the only possible answer",
      "Jute",
      "Rubber"
    ],
    "explanation": "A cool-season cereal on the irrigated northwestern plains strongly points to wheat. Rice can also occur there with irrigation, but its standard seasonal clue is kharif rather than winter.",
    "sourceFactIds": [
      "WHEAT-MAP-WINTER-NW"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-018",
    "qlName": "Rice/wheat map and season reasoning",
    "difficulty": "Easy",
    "stem": "A warm monsoon-fed delta is shown under extensive paddy cultivation. Which crop is indicated?",
    "answer": "Rice",
    "distractors": [
      "Wheat",
      "Gram",
      "Mustard"
    ],
    "explanation": "Paddy in a warm, water-rich delta is a classic rice landscape. Wheat, gram and mustard are better known as rabi crops under cooler conditions.",
    "sourceFactIds": [
      "RICE-MAP-DELTA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-018",
    "qlName": "Rice/wheat map and season reasoning",
    "difficulty": "Medium",
    "stem": "Which crop change is most likely when a dry northwestern plain gains reliable irrigation during the monsoon season?",
    "answer": "Rice becomes more feasible",
    "distractors": [
      "Rice becomes impossible",
      "All kharif cultivation must stop",
      "Only frost crops can be grown"
    ],
    "explanation": "Reliable monsoon-season irrigation supplies the water rice needs even in a lower-rainfall region. This is how irrigation can shift the geographic limits of paddy cultivation.",
    "sourceFactIds": [
      "RICE-MAP-IRRIGATION-CHANGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-018",
    "qlName": "Rice/wheat map and season reasoning",
    "difficulty": "Medium",
    "stem": "Which crop is more likely on an irrigated alluvial plain in January?",
    "answer": "Wheat",
    "distractors": [
      "Rice under normal kharif timing",
      "Jute",
      "Cotton"
    ],
    "explanation": "January falls within the cool rabi growing season, so wheat is the strongest match on an irrigated alluvial plain. Rice, jute and cotton are ordinarily linked with kharif timing.",
    "sourceFactIds": [
      "WHEAT-JANUARY-MAP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-018",
    "qlName": "Rice/wheat map and season reasoning",
    "difficulty": "Medium",
    "stem": "Which crop is more likely to dominate a rain-rich eastern delta during the monsoon?",
    "answer": "Rice",
    "distractors": [
      "Wheat",
      "Gram",
      "Mustard"
    ],
    "explanation": "A warm eastern delta with heavy monsoon rainfall provides the water and temperature conditions needed by rice. The other options are rabi crops.",
    "sourceFactIds": [
      "RICE-EASTERN-DELTA-MAP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-018",
    "qlName": "Rice/wheat map and season reasoning",
    "difficulty": "Hard",
    "stem": "Two map regions are shown: A is a humid delta with heavy monsoon rain; B is an irrigated plain with cool winters. Which crop distribution is most logical?",
    "answer": "Rice in A and wheat in B",
    "distractors": [
      "Wheat in A and rice only in B",
      "Jute in B and wheat only in A",
      "Mustard in A and rice impossible in both"
    ],
    "explanation": "Region A provides the warm wet setting of rice, while Region B offers the cool irrigated rabi environment of wheat. The paired geographic clues point to rice and wheat respectively.",
    "sourceFactIds": [
      "RICE-WHEAT-MAP-INFERENCE"
    ]
  }
]);

export const GEO_AGR_001_CP002_REVIEW_BATCH_V1: readonly GeoAgr001Question[] = Object.freeze(
  RAW.map((raw, index) => Object.freeze({
    questionId: `GEO-AGR-001-CP002-Q${String(index + 1).padStart(3, "0")}`,
    qlId: raw.qlId, qlName: raw.qlName, difficulty: raw.difficulty, stem: raw.stem,
    options: placeGeoAgrOptions(raw.answer, raw.distractors, index % 4),
    correctIndex: index % 4, canonicalAnswer: raw.answer, explanation: raw.explanation,
    sourceIds: GEO_AGR_001_SOURCE_IDS, sourceFactIds: Object.freeze([...raw.sourceFactIds]),
    reviewOnly: true as const, runtimeRegistered: false as const,
  })),
);

export function auditGeoAgr001Cp002ReviewBatchV1() {
  return auditGeoAgr001Batch(GEO_AGR_001_CP002_REVIEW_BATCH_V1, 10, 18);
}
