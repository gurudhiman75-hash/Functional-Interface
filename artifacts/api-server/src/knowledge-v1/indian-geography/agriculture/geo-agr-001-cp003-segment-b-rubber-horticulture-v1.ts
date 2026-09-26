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
    "qlId": "GEO-AGR-001-QL-064",
    "qlName": "Rubber climate requirements",
    "difficulty": "Easy",
    "stem": "Which climate is most favourable for natural rubber cultivation?",
    "answer": "Hot, humid climate with heavy rainfall",
    "distractors": [
      "Cold arid climate",
      "Permanent frost",
      "Dry desert climate"
    ],
    "explanation": "Natural rubber is a tropical crop that needs sustained warmth, high humidity and abundant rainfall. Frost and prolonged dryness reduce growth and latex production.",
    "sourceFactIds": [
      "RUBBER-HOT-HUMID"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-064",
    "qlName": "Rubber climate requirements",
    "difficulty": "Easy",
    "stem": "Which temperature condition suits rubber plantations?",
    "answer": "High temperatures through most of the year",
    "distractors": [
      "Frequent freezing weather",
      "Permanent snow cover",
      "Long sub-zero winters"
    ],
    "explanation": "Rubber trees grow best under warm tropical conditions and need a long frost-free period. Repeated low temperatures can damage growth and reduce latex yield.",
    "sourceFactIds": [
      "RUBBER-HIGH-TEMP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-064",
    "qlName": "Rubber climate requirements",
    "difficulty": "Medium",
    "stem": "Why is high humidity useful for rubber cultivation?",
    "answer": "It supports continuous tropical tree growth and latex production",
    "distractors": [
      "Rubber trees need dry air throughout the year",
      "Humidity creates winter frost",
      "The crop grows only in deserts"
    ],
    "explanation": "Rubber is adapted to moist tropical environments where high humidity supports vigorous growth. Those conditions also help maintain the physiological activity needed for latex production.",
    "sourceFactIds": [
      "RUBBER-HUMIDITY-REASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-064",
    "qlName": "Rubber climate requirements",
    "difficulty": "Medium",
    "stem": "Which weather pattern is least suitable for rubber?",
    "answer": "A long cool dry season with frequent frost",
    "distractors": [
      "Warm humid weather",
      "Heavy seasonal rainfall",
      "Long frost-free conditions"
    ],
    "explanation": "Rubber requires warmth and moisture for much of the year, so repeated frost and prolonged dryness are harmful. Warm humid conditions are much closer to its natural plantation environment.",
    "sourceFactIds": [
      "RUBBER-UNSUITABLE-WEATHER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-064",
    "qlName": "Rubber climate requirements",
    "difficulty": "Medium",
    "stem": "Which crop needs a more continuously tropical climate than wheat?",
    "answer": "Rubber",
    "distractors": [
      "Wheat",
      "Mustard",
      "Gram"
    ],
    "explanation": "Rubber is a perennial tropical tree crop that needs year-round warmth and high humidity. Wheat, mustard and gram are cool-season rabi crops with very different climatic requirements.",
    "sourceFactIds": [
      "RUBBER-VS-WHEAT-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-064",
    "qlName": "Rubber climate requirements",
    "difficulty": "Hard",
    "stem": "Region A is hot, humid and frost-free with heavy rain; Region B has cool dry winters. Which crop is more naturally suited to Region A?",
    "answer": "Rubber",
    "distractors": [
      "Wheat",
      "Mustard",
      "Gram"
    ],
    "explanation": "Region A matches the warm humid tropical environment required by rubber trees. Region B instead fits cool-season field crops such as wheat, mustard and gram.",
    "sourceFactIds": [
      "RUBBER-CLIMATE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-065",
    "qlName": "Rubber latex and tapping",
    "difficulty": "Easy",
    "stem": "Natural rubber is obtained from which substance in the rubber tree?",
    "answer": "Latex",
    "distractors": [
      "Bast fibre",
      "Dry grain",
      "Cane juice"
    ],
    "explanation": "Rubber trees produce a milky fluid called latex in tissues beneath the bark. This latex is collected and processed to make natural rubber.",
    "sourceFactIds": [
      "RUBBER-LATEX"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-065",
    "qlName": "Rubber latex and tapping",
    "difficulty": "Easy",
    "stem": "What is tapping in rubber cultivation?",
    "answer": "Making controlled cuts in the bark to collect latex",
    "distractors": [
      "Soaking stems for retting",
      "Picking cotton bolls",
      "Cutting sugarcane for crushing"
    ],
    "explanation": "Tapping uses carefully made bark cuts so latex flows into collecting cups. The tree remains alive and can be tapped repeatedly over time.",
    "sourceFactIds": [
      "RUBBER-TAPPING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-065",
    "qlName": "Rubber latex and tapping",
    "difficulty": "Medium",
    "stem": "Why must rubber tapping be done carefully?",
    "answer": "Deep or damaging cuts can injure the tree and reduce future latex flow",
    "distractors": [
      "The bark must be removed completely each time",
      "Latex forms only after the tree dies",
      "Tapping requires permanent flooding"
    ],
    "explanation": "Rubber tapping depends on repeated use of the same living tree, so cuts must reach latex-bearing tissues without causing excessive damage. Poor tapping can shorten the productive life of the tree.",
    "sourceFactIds": [
      "RUBBER-TAPPING-CARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-065",
    "qlName": "Rubber latex and tapping",
    "difficulty": "Medium",
    "stem": "Which harvested product separates rubber from tea?",
    "answer": "Rubber yields latex, while tea yields tender leaves",
    "distractors": [
      "Both are harvested as cane stalks",
      "Both yield bast fibre",
      "Both are harvested as underground pods"
    ],
    "explanation": "Rubber is tapped for latex from beneath the bark, whereas tea is harvested by plucking young leaves and shoots. Their plantation products are therefore very different.",
    "sourceFactIds": [
      "RUBBER-TEA-PRODUCT-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-065",
    "qlName": "Rubber latex and tapping",
    "difficulty": "Medium",
    "stem": "Which plantation operation points most strongly to rubber?",
    "answer": "Collecting milky liquid from shallow bark cuts",
    "distractors": [
      "Plucking two leaves and a bud",
      "Picking red coffee berries",
      "Retting fibrous stems"
    ],
    "explanation": "Milky latex flowing from controlled bark incisions is the defining harvest clue for rubber. Tea, coffee and jute use entirely different harvesting or processing methods.",
    "sourceFactIds": [
      "RUBBER-HARVEST-CLUE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-065",
    "qlName": "Rubber latex and tapping",
    "difficulty": "Hard",
    "stem": "Estate A repeatedly removes tender leaves; Estate B makes bark cuts and collects a milky fluid. Which crops are A and B?",
    "answer": "A tea; B rubber",
    "distractors": [
      "A rubber; B coffee",
      "A cotton; B jute",
      "A sugarcane; B wheat"
    ],
    "explanation": "Repeated plucking of tender leaves identifies tea, while collection of milky latex from bark cuts identifies rubber. The harvest methods clearly separate the two plantation crops.",
    "sourceFactIds": [
      "RUBBER-TEA-HARVEST-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-066",
    "qlName": "Rubber regional geography",
    "difficulty": "Easy",
    "stem": "Which state has a long-established natural-rubber belt?",
    "answer": "Kerala",
    "distractors": [
      "Punjab",
      "Rajasthan",
      "Haryana"
    ],
    "explanation": "Kerala's warm humid climate and heavy rainfall provide excellent conditions for rubber. The state has a long history of plantation rubber cultivation.",
    "sourceFactIds": [
      "RUBBER-KERALA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-066",
    "qlName": "Rubber regional geography",
    "difficulty": "Easy",
    "stem": "Which southern state also contains rubber-growing areas?",
    "answer": "Tamil Nadu",
    "distractors": [
      "Punjab",
      "Haryana",
      "Rajasthan"
    ],
    "explanation": "Parts of Tamil Nadu with warm humid conditions support rubber cultivation, especially near the wetter southern uplands. Rubber is not a crop of the dry northwestern plains.",
    "sourceFactIds": [
      "RUBBER-TAMIL-NADU"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-066",
    "qlName": "Rubber regional geography",
    "difficulty": "Medium",
    "stem": "Which group contains regions where natural rubber is cultivated in India?",
    "answer": "Kerala, Tamil Nadu and Karnataka",
    "distractors": [
      "Punjab, Haryana and Rajasthan",
      "Ladakh, Himachal Pradesh and Punjab",
      "Rajasthan, Gujarat and Haryana only"
    ],
    "explanation": "Kerala, Tamil Nadu and Karnataka all contain warm humid zones suitable for rubber plantations. Their tropical southern settings provide the crop's required climate.",
    "sourceFactIds": [
      "RUBBER-SOUTHERN-STATES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-066",
    "qlName": "Rubber regional geography",
    "difficulty": "Medium",
    "stem": "Which northeastern hill region is also known for rubber cultivation?",
    "answer": "Garo hills of Meghalaya",
    "distractors": [
      "Cold desert of Ladakh",
      "Thar Desert",
      "Upper Sutlej snowfields"
    ],
    "explanation": "The Garo hills of Meghalaya provide warm humid conditions that can support rubber. This shows that rubber is not confined only to peninsular plantation areas.",
    "sourceFactIds": [
      "RUBBER-GARO-HILLS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-066",
    "qlName": "Rubber regional geography",
    "difficulty": "Medium",
    "stem": "Why is rubber concentrated in southern and humid northeastern regions rather than the dry northwest?",
    "answer": "Those regions provide higher humidity, rainfall and frost-free warmth",
    "distractors": [
      "The dry northwest receives more tropical rain",
      "Rubber needs desert drought",
      "The crop grows only under winter frost"
    ],
    "explanation": "Rubber requires a moist tropical climate with dependable warmth, conditions common in southern and some northeastern regions. The dry northwest lacks this humidity and rainfall regime.",
    "sourceFactIds": [
      "RUBBER-REGIONAL-REASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-066",
    "qlName": "Rubber regional geography",
    "difficulty": "Hard",
    "stem": "A map highlights Kerala, parts of Tamil Nadu and a humid hill pocket in Meghalaya. Which plantation crop links these areas?",
    "answer": "Rubber",
    "distractors": [
      "Wheat",
      "Mustard",
      "Bajra"
    ],
    "explanation": "All three highlighted areas can provide the warm humid conditions needed for rubber cultivation. Wheat, mustard and bajra belong to very different seasonal or dryland environments.",
    "sourceFactIds": [
      "RUBBER-MAP-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-067",
    "qlName": "Horticulture: fruits and vegetables",
    "difficulty": "Easy",
    "stem": "Horticulture primarily deals with the cultivation of which crops?",
    "answer": "Fruits, vegetables and related garden crops",
    "distractors": [
      "Only field cereals",
      "Only fibre crops",
      "Only sugarcane"
    ],
    "explanation": "Horticulture includes fruit, vegetable and other high-value garden crops such as flowers and some plantation produce. It differs from large-scale cereal field cultivation.",
    "sourceFactIds": [
      "HORTICULTURE-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-067",
    "qlName": "Horticulture: fruits and vegetables",
    "difficulty": "Easy",
    "stem": "Which crop is clearly horticultural?",
    "answer": "Apple",
    "distractors": [
      "Wheat",
      "Jute",
      "Mustard"
    ],
    "explanation": "Apple is a fruit crop and therefore belongs to horticulture. Wheat is a cereal, jute a fibre crop and mustard an oilseed.",
    "sourceFactIds": [
      "HORTICULTURE-APPLE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-067",
    "qlName": "Horticulture: fruits and vegetables",
    "difficulty": "Medium",
    "stem": "Why are horticultural crops often called high-value crops?",
    "answer": "They can produce high market value per unit area but need careful management",
    "distractors": [
      "They never need labour",
      "They are always low-priced staples",
      "They require no transport or storage"
    ],
    "explanation": "Fruits, vegetables and similar crops can generate substantial value from limited land, but quality, handling and timing matter greatly. This makes management and market access especially important.",
    "sourceFactIds": [
      "HORTICULTURE-HIGH-VALUE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-067",
    "qlName": "Horticulture: fruits and vegetables",
    "difficulty": "Medium",
    "stem": "Which feature is more important for many fresh horticultural crops than for dry grains?",
    "answer": "Rapid handling and access to markets",
    "distractors": [
      "Permanent field flooding",
      "Long storage in the field after harvest",
      "Complete isolation from roads"
    ],
    "explanation": "Fresh fruits and vegetables can lose quality quickly after harvest, so transport, storage and market access are important. Dry grains are generally less perishable.",
    "sourceFactIds": [
      "HORTICULTURE-MARKET-ACCESS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-067",
    "qlName": "Horticulture: fruits and vegetables",
    "difficulty": "Medium",
    "stem": "Which farming choice fits horticulture better than cereal monoculture?",
    "answer": "Orchards and vegetable plots with intensive crop care",
    "distractors": [
      "Only wheat on very large fields",
      "Only jute retting",
      "Only cane crushing"
    ],
    "explanation": "Horticulture commonly uses orchards, vegetable fields and intensive management of high-value crops. Large cereal monoculture belongs to a different agricultural system.",
    "sourceFactIds": [
      "HORTICULTURE-ORCHARDS-VEGETABLES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-067",
    "qlName": "Horticulture: fruits and vegetables",
    "difficulty": "Hard",
    "stem": "A small irrigated farm near a city grows vegetables and fruit for rapid sale. Which agricultural branch does this most closely represent?",
    "answer": "Horticulture",
    "distractors": [
      "Plantation forestry",
      "Shifting cultivation",
      "Large-scale grain farming"
    ],
    "explanation": "Fruit and vegetable cultivation on intensively managed land for nearby markets is a classic horticultural pattern. Perishability and market access strengthen that identification.",
    "sourceFactIds": [
      "HORTICULTURE-SCENARIO-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-068",
    "qlName": "Tropical and subtropical fruit geography",
    "difficulty": "Easy",
    "stem": "Which fruit is strongly linked with tropical and subtropical India?",
    "answer": "Mango",
    "distractors": [
      "Apple only",
      "Apricot only",
      "Pear only"
    ],
    "explanation": "Mango is one of India's classic tropical and subtropical fruit crops and grows across warm plains and plateau regions. Apples and apricots need cooler temperate conditions.",
    "sourceFactIds": [
      "FRUIT-MANGO-TROPICAL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-068",
    "qlName": "Tropical and subtropical fruit geography",
    "difficulty": "Easy",
    "stem": "Which fruit crop prefers warm, humid conditions and is common in southern India?",
    "answer": "Banana",
    "distractors": [
      "Apple",
      "Apricot",
      "Pear"
    ],
    "explanation": "Banana is a tropical fruit crop that grows well under warm humid conditions with dependable moisture. It is widely cultivated in southern and other frost-free regions.",
    "sourceFactIds": [
      "FRUIT-BANANA-TROPICAL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-068",
    "qlName": "Tropical and subtropical fruit geography",
    "difficulty": "Medium",
    "stem": "Which climate is suitable for pineapple?",
    "answer": "Warm humid tropical climate",
    "distractors": [
      "Cold dry alpine climate",
      "Permanent frost",
      "Snow-covered plateau"
    ],
    "explanation": "Pineapple is a tropical fruit that prefers warm humid conditions and adequate rainfall. Severe cold and frost are unsuitable for normal growth.",
    "sourceFactIds": [
      "FRUIT-PINEAPPLE-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-068",
    "qlName": "Tropical and subtropical fruit geography",
    "difficulty": "Medium",
    "stem": "How do mango, banana and apple differ by climate?",
    "answer": "Mango and banana suit warmer regions; apple suits cooler temperate hills",
    "distractors": [
      "Mango needs snow while apple needs tropical heat",
      "All three need identical climates",
      "Banana is a cold-desert fruit"
    ],
    "explanation": "Mango and banana are warm-climate fruits, whereas apple needs a cooler temperate environment with winter chilling. Their climatic zones are therefore different.",
    "sourceFactIds": [
      "FRUIT-WARM-COOL-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-068",
    "qlName": "Tropical and subtropical fruit geography",
    "difficulty": "Medium",
    "stem": "Which orchard is more likely in a frost-free humid lowland?",
    "answer": "Banana orchard",
    "distractors": [
      "Apple orchard only",
      "Apricot orchard only",
      "Temperate pear orchard only"
    ],
    "explanation": "Banana needs sustained warmth and moisture and is damaged by frost, so a frost-free humid lowland is favourable. Temperate fruits need cooler conditions.",
    "sourceFactIds": [
      "FRUIT-BANANA-LOWLAND"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-068",
    "qlName": "Tropical and subtropical fruit geography",
    "difficulty": "Hard",
    "stem": "Region A is warm and frost-free; Region B has cold winters and temperate hills. Which fruit pairing fits A and B?",
    "answer": "A banana; B apple",
    "distractors": [
      "A apple; B banana",
      "A apricot; B mango",
      "A pear; B pineapple"
    ],
    "explanation": "Banana fits the warm frost-free region, while apple needs a cooler temperate hill climate. The temperature contrast identifies the pairing clearly.",
    "sourceFactIds": [
      "FRUIT-TROPICAL-TEMPERATE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-069",
    "qlName": "Temperate fruit geography",
    "difficulty": "Easy",
    "stem": "Which fruit is typical of India's temperate hill regions?",
    "answer": "Apple",
    "distractors": [
      "Banana",
      "Pineapple",
      "Coconut"
    ],
    "explanation": "Apple requires cool temperate conditions and a winter chilling period, so it is concentrated in Himalayan and other suitable hill regions. Tropical fruits need much warmer climates.",
    "sourceFactIds": [
      "FRUIT-APPLE-TEMPERATE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-069",
    "qlName": "Temperate fruit geography",
    "difficulty": "Easy",
    "stem": "Which state is well known for temperate fruit orchards?",
    "answer": "Himachal Pradesh",
    "distractors": [
      "Kerala only",
      "Goa only",
      "Tamil Nadu coast only"
    ],
    "explanation": "Himachal Pradesh has extensive cool hill environments suitable for apples and other temperate fruits. Elevation provides the winter chill these orchards need.",
    "sourceFactIds": [
      "FRUIT-HIMACHAL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-069",
    "qlName": "Temperate fruit geography",
    "difficulty": "Medium",
    "stem": "Which group contains states and regions known for temperate fruit cultivation?",
    "answer": "Himachal Pradesh, Jammu and Kashmir, Uttarakhand",
    "distractors": [
      "Kerala coast, Goa coast, Lakshadweep",
      "Rajasthan desert, Kutch, western Haryana",
      "Andaman coast, coastal Tamil Nadu, Kerala lowlands"
    ],
    "explanation": "The western Himalayan states and regions provide cool winters and elevated terrain suitable for apples, pears and related temperate fruits. Coastal tropical regions do not.",
    "sourceFactIds": [
      "FRUIT-TEMPERATE-REGIONS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-069",
    "qlName": "Temperate fruit geography",
    "difficulty": "Medium",
    "stem": "Why are hill elevations useful for apple orchards in India?",
    "answer": "Elevation provides cooler conditions and winter chilling",
    "distractors": [
      "Elevation creates tropical heat",
      "Apple requires permanent flooding",
      "Higher land removes all winter cold"
    ],
    "explanation": "Apples need a cool growing environment and sufficient winter chill for normal dormancy and flowering. Hill elevations provide these conditions in subtropical latitudes.",
    "sourceFactIds": [
      "FRUIT-APPLE-ELEVATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-069",
    "qlName": "Temperate fruit geography",
    "difficulty": "Medium",
    "stem": "Which fruit is a better match for a cool Himalayan orchard than a humid coastal plantation?",
    "answer": "Apple",
    "distractors": [
      "Coconut",
      "Banana",
      "Pineapple"
    ],
    "explanation": "Apple is adapted to temperate hill climates with cold winters, while coconut, banana and pineapple are tropical or subtropical crops. The Himalayan orchard therefore points to apple.",
    "sourceFactIds": [
      "FRUIT-HIMALAYAN-APPLE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-069",
    "qlName": "Temperate fruit geography",
    "difficulty": "Hard",
    "stem": "Farm A is at high elevation with cold winters; Farm B is a warm humid coast. Which fruit crops fit A and B respectively?",
    "answer": "Apple and coconut",
    "distractors": [
      "Coconut and apple",
      "Banana and apple",
      "Pineapple and apricot"
    ],
    "explanation": "Cold winter conditions at elevation favour apple, while a warm humid coast is well suited to coconut. The contrasting climates determine the crop pairing.",
    "sourceFactIds": [
      "FRUIT-HILL-COAST-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-070",
    "qlName": "Spice-crop geography",
    "difficulty": "Easy",
    "stem": "Which crop is a major spice of the humid Western Ghats?",
    "answer": "Black pepper",
    "distractors": [
      "Wheat",
      "Jute",
      "Mustard"
    ],
    "explanation": "Black pepper is a high-value spice crop that grows well in warm humid conditions, especially along the Western Ghats. Wheat, jute and mustard occupy different crop environments.",
    "sourceFactIds": [
      "SPICE-BLACK-PEPPER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-070",
    "qlName": "Spice-crop geography",
    "difficulty": "Easy",
    "stem": "Cardamom is commonly grown in which type of environment?",
    "answer": "Humid shaded hill environment",
    "distractors": [
      "Hot bare desert",
      "Permanent snowfield",
      "Dry alluvial plain without shade"
    ],
    "explanation": "Cardamom is a humid tropical spice that grows well under partial shade in hill environments. Moisture and moderated sunlight are important for the crop.",
    "sourceFactIds": [
      "SPICE-CARDAMOM"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-070",
    "qlName": "Spice-crop geography",
    "difficulty": "Medium",
    "stem": "Which region is strongly linked with black pepper and cardamom?",
    "answer": "Western Ghats",
    "distractors": [
      "Thar Desert",
      "Ladakh plateau",
      "Indo-Gangetic wheat plain only"
    ],
    "explanation": "The Western Ghats provide warm humid conditions, high rainfall and shaded slopes suitable for spices such as black pepper and cardamom. Dry or cold regions do not.",
    "sourceFactIds": [
      "SPICE-WESTERN-GHATS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-070",
    "qlName": "Spice-crop geography",
    "difficulty": "Medium",
    "stem": "Why can spice cultivation be considered high-value agriculture?",
    "answer": "A relatively small crop volume can have high market value",
    "distractors": [
      "Spices have no market demand",
      "They are always low-value staples",
      "They require no labour or care"
    ],
    "explanation": "Spices such as pepper and cardamom can command high prices relative to their physical volume. Careful cultivation, processing and market quality therefore matter greatly.",
    "sourceFactIds": [
      "SPICE-HIGH-VALUE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-070",
    "qlName": "Spice-crop geography",
    "difficulty": "Medium",
    "stem": "Which crop is a better fit for a humid shaded Western Ghats slope than a dry Rajasthan plain?",
    "answer": "Cardamom",
    "distractors": [
      "Bajra",
      "Mustard",
      "Wheat"
    ],
    "explanation": "Cardamom needs a humid shaded hill environment, which the Western Ghats can provide. Bajra and mustard fit drier conditions, while wheat is a cool-season cereal.",
    "sourceFactIds": [
      "SPICE-CARDAMOM-SLOPE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-070",
    "qlName": "Spice-crop geography",
    "difficulty": "Medium",
    "stem": "Which pairing is accurate?",
    "answer": "Black pepper — warm humid plantation belt",
    "distractors": [
      "Black pepper — cold desert",
      "Cardamom — arid dune field",
      "Pepper — permanent snowfield"
    ],
    "explanation": "Black pepper is a tropical spice crop of warm humid regions, especially the Western Ghats. Cold deserts and snowfields do not provide the crop's required moisture and temperature.",
    "sourceFactIds": [
      "SPICE-PAIRING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-071",
    "qlName": "Coconut and coastal plantation geography",
    "difficulty": "Easy",
    "stem": "Which climate is favourable for coconut cultivation?",
    "answer": "Warm, humid, frost-free coastal climate",
    "distractors": [
      "Cold continental climate",
      "Permanent frost",
      "High alpine snow climate"
    ],
    "explanation": "Coconut palms need sustained warmth, humidity and freedom from frost. Coastal tropical regions therefore provide a favourable environment for the crop.",
    "sourceFactIds": [
      "COCONUT-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-071",
    "qlName": "Coconut and coastal plantation geography",
    "difficulty": "Easy",
    "stem": "Which state is strongly linked with coconut cultivation?",
    "answer": "Kerala",
    "distractors": [
      "Punjab",
      "Haryana",
      "Rajasthan"
    ],
    "explanation": "Kerala's warm humid coast is a classic coconut-growing region. The crop also occurs widely along other tropical coastal belts of southern India.",
    "sourceFactIds": [
      "COCONUT-KERALA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-071",
    "qlName": "Coconut and coastal plantation geography",
    "difficulty": "Medium",
    "stem": "Why can coconut grow well on many coastal soils?",
    "answer": "The palm tolerates sandy well-drained soils when moisture is available",
    "distractors": [
      "It requires permanent frozen soil",
      "It grows only in inland black soil",
      "It needs standing freshwater throughout the field"
    ],
    "explanation": "Coconut palms can grow on sandy and alluvial coastal soils provided warmth and moisture are adequate. Good drainage is useful even though the crop needs humid conditions.",
    "sourceFactIds": [
      "COCONUT-COASTAL-SOIL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-071",
    "qlName": "Coconut and coastal plantation geography",
    "difficulty": "Medium",
    "stem": "Which regional belt is a strong match for coconut?",
    "answer": "Kerala–Karnataka–Tamil Nadu coastal belt",
    "distractors": [
      "Ladakh–Himachal cold desert belt",
      "Punjab–Haryana wheat belt only",
      "Rajasthan desert belt"
    ],
    "explanation": "Southern coastal regions of Kerala, Karnataka and Tamil Nadu provide warm humid conditions suitable for coconut. Cold and arid inland regions are much less suitable.",
    "sourceFactIds": [
      "COCONUT-SOUTH-COAST"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-071",
    "qlName": "Coconut and coastal plantation geography",
    "difficulty": "Medium",
    "stem": "Which crop is more naturally suited to a humid tropical coast than an apple orchard?",
    "answer": "Coconut",
    "distractors": [
      "Apple",
      "Apricot",
      "Temperate pear"
    ],
    "explanation": "Coconut requires year-round warmth and humidity, while apple and related temperate fruits need colder winters. A humid tropical coast therefore fits coconut much better.",
    "sourceFactIds": [
      "COCONUT-VS-APPLE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-071",
    "qlName": "Coconut and coastal plantation geography",
    "difficulty": "Medium",
    "stem": "Which landscape clue points toward coconut cultivation?",
    "answer": "Frost-free tropical coast with sandy soil and abundant moisture",
    "distractors": [
      "Cold high-altitude valley",
      "Arid dune field without water",
      "Glaciated plateau"
    ],
    "explanation": "Coconut palms thrive in warm humid frost-free coastal environments and tolerate sandy soils with adequate moisture. The other landscapes are too cold or dry.",
    "sourceFactIds": [
      "COCONUT-LANDSCAPE-CLUE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-072",
    "qlName": "Integrated plantation and horticulture reasoning",
    "difficulty": "Easy",
    "stem": "Which crop–product match is accurate?",
    "answer": "Rubber — latex",
    "distractors": [
      "Tea — bast fibre",
      "Coffee — cane sugar",
      "Coconut — jute fibre"
    ],
    "explanation": "Rubber trees are tapped for latex, which is processed into natural rubber. Tea, coffee and coconut produce leaves, beans and nuts rather than bast fibre or cane sugar.",
    "sourceFactIds": [
      "PLANTATION-INTEGRATED-PRODUCT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-072",
    "qlName": "Integrated plantation and horticulture reasoning",
    "difficulty": "Easy",
    "stem": "Which crop–region match is accurate?",
    "answer": "Coffee — southern humid uplands",
    "distractors": [
      "Apple — tropical coast",
      "Rubber — cold desert",
      "Coconut — high Himalayan snowfield"
    ],
    "explanation": "Coffee is concentrated in humid southern uplands, especially Karnataka, Kerala and Tamil Nadu. The other crop–region pairings conflict with their climatic needs.",
    "sourceFactIds": [
      "PLANTATION-INTEGRATED-REGION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-072",
    "qlName": "Integrated plantation and horticulture reasoning",
    "difficulty": "Medium",
    "stem": "Which sequence matches crop with its key field clue?",
    "answer": "Tea—leaf plucking; coffee—shade; rubber—latex tapping",
    "distractors": [
      "Tea—retting; coffee—cane crushing; rubber—ginning",
      "Tea—boll picking; coffee—flooding; rubber—grain harvest",
      "Tea—root digging; coffee—snow cover; rubber—jute retting"
    ],
    "explanation": "Tea is harvested by plucking leaves, coffee is commonly grown under shade, and rubber is tapped for latex. The sequence combines three distinctive plantation features.",
    "sourceFactIds": [
      "PLANTATION-INTEGRATED-FIELD-CLUES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-072",
    "qlName": "Integrated plantation and horticulture reasoning",
    "difficulty": "Medium",
    "stem": "Which climate pairing is accurate?",
    "answer": "Rubber—hot humid tropics; apple—cool temperate hills",
    "distractors": [
      "Rubber—cold desert; apple—tropical coast",
      "Both require identical tropical heat",
      "Both require permanent flooding"
    ],
    "explanation": "Rubber is a tropical plantation tree needing heat and humidity. Apple is a temperate fruit requiring cooler hill conditions and winter chilling.",
    "sourceFactIds": [
      "PLANTATION-INTEGRATED-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-072",
    "qlName": "Integrated plantation and horticulture reasoning",
    "difficulty": "Medium",
    "stem": "A humid Western Ghats farm grows a high-value spice under shade. Which crop is a strong match?",
    "answer": "Cardamom",
    "distractors": [
      "Bajra",
      "Wheat",
      "Mustard"
    ],
    "explanation": "Cardamom grows well in humid shaded hill environments such as parts of the Western Ghats. Bajra, wheat and mustard fit dry or cool-season field agriculture instead.",
    "sourceFactIds": [
      "PLANTATION-INTEGRATED-SPICE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-072",
    "qlName": "Integrated plantation and horticulture reasoning",
    "difficulty": "Medium",
    "stem": "Which statement captures the main geographic contrast within CP003 crops?",
    "answer": "Plantation and horticultural crops occupy distinct climate belts from tropical coasts to temperate hills",
    "distractors": [
      "All crops require the same climate and soil",
      "Every crop is confined to dry plains",
      "All crops are winter cereals"
    ],
    "explanation": "Rubber, coconut and many spices favour warm humid regions, while apples need cool temperate hills and coffee prefers shaded uplands. High-value crop geography is therefore strongly climate-specific.",
    "sourceFactIds": [
      "PLANTATION-INTEGRATED-SUMMARY"
    ]
  }
]);

export const GEO_AGR_001_CP003_RUBBER_HORTICULTURE_SEGMENT_V1: readonly GeoAgr001Question[] = Object.freeze(
  RAW.map((raw, index) => Object.freeze({
    questionId: `GEO-AGR-001-CP003-RH-Q${String(index + 1).padStart(3, "0")}`,
    qlId: raw.qlId, qlName: raw.qlName, difficulty: raw.difficulty, stem: raw.stem,
    options: placeGeoAgrOptions(raw.answer, raw.distractors, index % 4),
    correctIndex: index % 4, canonicalAnswer: raw.answer, explanation: raw.explanation,
    sourceIds: GEO_AGR_001_SOURCE_IDS, sourceFactIds: Object.freeze([...raw.sourceFactIds]),
    reviewOnly: true as const, runtimeRegistered: false as const,
  })),
);

export function auditGeoAgr001Cp003RubberHorticultureSegmentV1() {
  return auditGeoAgr001Batch(GEO_AGR_001_CP003_RUBBER_HORTICULTURE_SEGMENT_V1, 64, 72);
}
