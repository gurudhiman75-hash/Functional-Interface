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
    "qlId": "GEO-AGR-001-QL-001",
    "qlName": "Kharif season timing",
    "difficulty": "Easy",
    "stem": "Kharif crops are generally sown with the onset of which season in India?",
    "answer": "Southwest monsoon season",
    "distractors": [
      "Winter season",
      "Retreating winter period",
      "Early spring season"
    ],
    "explanation": "Kharif crops are sown when the southwest monsoon begins and moisture becomes available for field preparation. Their growing period therefore coincides with the rainy season.",
    "sourceFactIds": [
      "KHARIF-ONSET-MONSOON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-001",
    "qlName": "Kharif season timing",
    "difficulty": "Easy",
    "stem": "In the standard Indian crop calendar, kharif sowing usually begins around which months?",
    "answer": "June–July",
    "distractors": [
      "October–November",
      "January–February",
      "March–April"
    ],
    "explanation": "Kharif sowing normally begins around June and July as monsoon rainfall spreads across India. The exact date varies regionally, but the season is tied to monsoon onset.",
    "sourceFactIds": [
      "KHARIF-SOW-JUNE-JULY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-001",
    "qlName": "Kharif season timing",
    "difficulty": "Medium",
    "stem": "A crop is sown soon after monsoon rain arrives and harvested after the rainy season. Which crop season does this describe?",
    "answer": "Kharif",
    "distractors": [
      "Rabi",
      "Zaid",
      "Perennial plantation only"
    ],
    "explanation": "A monsoon-onset sowing and post-rainy-season harvest pattern is characteristic of kharif agriculture. Rabi begins in winter, while zaid occupies the short summer interval.",
    "sourceFactIds": [
      "KHARIF-SEASON-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-001",
    "qlName": "Kharif season timing",
    "difficulty": "Medium",
    "stem": "Which sequence fits the normal kharif cycle?",
    "answer": "Monsoon onset → sowing → rainy-season growth → autumn harvest",
    "distractors": [
      "Winter onset → sowing → spring growth → monsoon harvest",
      "Summer heat → sowing → winter growth → spring harvest",
      "Autumn harvest → sowing → monsoon growth → winter harvest"
    ],
    "explanation": "Kharif cultivation begins with monsoon onset, continues through the rainy months and is commonly harvested in autumn. The sequence follows the seasonal moisture cycle.",
    "sourceFactIds": [
      "KHARIF-CYCLE-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-001",
    "qlName": "Kharif season timing",
    "difficulty": "Medium",
    "stem": "Which weather change is most important for starting the kharif sowing season?",
    "answer": "Arrival of dependable monsoon rainfall",
    "distractors": [
      "Sharp winter cooling",
      "Withdrawal of all rainfall",
      "Spring frost formation"
    ],
    "explanation": "Kharif sowing depends on sufficient soil moisture at the beginning of the rainy season. Farmers therefore watch the arrival and reliability of monsoon rain closely.",
    "sourceFactIds": [
      "KHARIF-START-RAINFALL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-001",
    "qlName": "Kharif season timing",
    "difficulty": "Hard",
    "stem": "A farmer harvests wheat in April and wants to prepare the same field for a monsoon crop. Which season will the next crop belong to?",
    "answer": "Kharif",
    "distractors": [
      "Rabi",
      "Zaid only",
      "Winter plantation"
    ],
    "explanation": "Wheat is generally harvested near the end of the rabi season in spring. A crop sown next with monsoon onset belongs to the kharif season.",
    "sourceFactIds": [
      "KHARIF-AFTER-RABI-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-002",
    "qlName": "Rabi season timing",
    "difficulty": "Easy",
    "stem": "Rabi crops are generally sown during which part of the year?",
    "answer": "Winter season",
    "distractors": [
      "Peak monsoon season",
      "Late summer before monsoon",
      "Only during spring"
    ],
    "explanation": "Rabi crops are sown after the monsoon, during the cooler winter period. They grow through winter and are generally harvested in spring or early summer.",
    "sourceFactIds": [
      "RABI-WINTER-SEASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-002",
    "qlName": "Rabi season timing",
    "difficulty": "Easy",
    "stem": "Rabi sowing in India commonly takes place around which months?",
    "answer": "October–December",
    "distractors": [
      "June–July",
      "March–May",
      "August–September only"
    ],
    "explanation": "Rabi sowing usually follows the retreat of the monsoon and is concentrated from about October to December. Cooler temperatures support the early growth of important rabi crops.",
    "sourceFactIds": [
      "RABI-SOW-OCT-DEC"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-002",
    "qlName": "Rabi season timing",
    "difficulty": "Medium",
    "stem": "A crop is sown after the monsoon and harvested in April. Which season does it most likely belong to?",
    "answer": "Rabi",
    "distractors": [
      "Kharif",
      "Zaid",
      "Monsoon plantation"
    ],
    "explanation": "Rabi crops are sown in the cool post-monsoon months and mature by spring. An April harvest fits the standard rabi calendar.",
    "sourceFactIds": [
      "RABI-APRIL-HARVEST"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-002",
    "qlName": "Rabi season timing",
    "difficulty": "Medium",
    "stem": "Which sequence fits the normal rabi crop cycle?",
    "answer": "Post-monsoon sowing → winter growth → spring harvest",
    "distractors": [
      "Monsoon sowing → rainy growth → autumn harvest",
      "Summer sowing → monsoon growth → winter harvest",
      "Spring sowing → winter growth → monsoon harvest"
    ],
    "explanation": "Rabi crops are planted after the monsoon, use the cool winter growing period and are harvested in spring. This separates them clearly from kharif crops.",
    "sourceFactIds": [
      "RABI-CYCLE-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-002",
    "qlName": "Rabi season timing",
    "difficulty": "Medium",
    "stem": "Which condition helps many rabi crops at the time of sowing?",
    "answer": "Cool weather with moisture available in the soil",
    "distractors": [
      "Continuous heavy monsoon rain",
      "Very high humidity with waterlogging",
      "Tropical storm conditions"
    ],
    "explanation": "Rabi crops begin in the cool season and need enough soil moisture for germination and early growth. Excessive monsoon-style rainfall is not the defining sowing condition.",
    "sourceFactIds": [
      "RABI-SOWING-CONDITION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-002",
    "qlName": "Rabi season timing",
    "difficulty": "Hard",
    "stem": "A field is planted after monsoon withdrawal and harvested before the next monsoon arrives. Which season is indicated?",
    "answer": "Rabi",
    "distractors": [
      "Kharif",
      "Zaid only",
      "Perennial plantation"
    ],
    "explanation": "The period after monsoon withdrawal and before the next monsoon is the winter-to-spring rabi window. This timing distinguishes rabi from monsoon-grown kharif crops.",
    "sourceFactIds": [
      "RABI-BETWEEN-MONSOONS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-003",
    "qlName": "Zaid season timing",
    "difficulty": "Easy",
    "stem": "The zaid season falls between which two major crop seasons?",
    "answer": "Rabi and kharif",
    "distractors": [
      "Kharif and rabi of the same monsoon",
      "Only two rabi seasons",
      "Only two kharif seasons"
    ],
    "explanation": "Zaid is the short summer cropping period after rabi harvest and before kharif sowing. It fills the seasonal gap between the two major crop seasons.",
    "sourceFactIds": [
      "ZAID-BETWEEN-RABI-KHARIF"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-003",
    "qlName": "Zaid season timing",
    "difficulty": "Easy",
    "stem": "Which part of the year is commonly used for zaid cultivation?",
    "answer": "Short summer period",
    "distractors": [
      "Peak winter period",
      "Full monsoon period",
      "Late autumn only"
    ],
    "explanation": "Zaid crops are grown during the warm summer interval between rabi and kharif. Irrigation is often important because this period precedes widespread monsoon rainfall.",
    "sourceFactIds": [
      "ZAID-SUMMER-PERIOD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-003",
    "qlName": "Zaid season timing",
    "difficulty": "Medium",
    "stem": "A farmer grows a short-duration crop after the rabi harvest but before monsoon sowing. Which season is being used?",
    "answer": "Zaid",
    "distractors": [
      "Kharif",
      "Rabi",
      "Plantation cycle"
    ],
    "explanation": "The interval after rabi harvest and before the kharif monsoon crop is called the zaid season. Short-duration summer crops fit this calendar.",
    "sourceFactIds": [
      "ZAID-SHORT-DURATION-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-003",
    "qlName": "Zaid season timing",
    "difficulty": "Medium",
    "stem": "Why is irrigation often important for zaid crops?",
    "answer": "They grow in the hot pre-monsoon summer period",
    "distractors": [
      "They always grow under snow",
      "They are sown during peak monsoon flooding",
      "They require winter frost"
    ],
    "explanation": "Zaid cultivation occurs during the hot months before the monsoon is fully established. Rainfall can be limited, so irrigation supports the short summer crop.",
    "sourceFactIds": [
      "ZAID-IRRIGATION-REASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-003",
    "qlName": "Zaid season timing",
    "difficulty": "Medium",
    "stem": "Which crop calendar order is correct?",
    "answer": "Rabi harvest → zaid crop → kharif sowing",
    "distractors": [
      "Kharif harvest → rabi sowing → monsoon onset only",
      "Zaid harvest → winter sowing → rabi harvest only",
      "Kharif sowing → zaid crop → rabi sowing"
    ],
    "explanation": "Zaid occupies the summer interval after rabi harvest and before the next kharif sowing. The order therefore runs rabi harvest, zaid cultivation, then kharif.",
    "sourceFactIds": [
      "ZAID-CALENDAR-ORDER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-003",
    "qlName": "Zaid season timing",
    "difficulty": "Hard",
    "stem": "A farmer harvests a winter crop in March, grows watermelon for a few months and then prepares for paddy with monsoon onset. Which season is the watermelon crop?",
    "answer": "Zaid",
    "distractors": [
      "Rabi",
      "Kharif",
      "Plantation"
    ],
    "explanation": "The watermelon crop occupies the short summer interval between a rabi harvest and kharif paddy sowing. That timing places it in the zaid season.",
    "sourceFactIds": [
      "ZAID-WATERMELON-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-004",
    "qlName": "Kharif crop examples",
    "difficulty": "Easy",
    "stem": "Which crop is a standard kharif crop?",
    "answer": "Rice",
    "distractors": [
      "Wheat",
      "Gram",
      "Mustard"
    ],
    "explanation": "Rice is commonly sown with the monsoon and is a major kharif crop. Wheat, gram and mustard are standard rabi examples.",
    "sourceFactIds": [
      "KHARIF-EXAMPLE-RICE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-004",
    "qlName": "Kharif crop examples",
    "difficulty": "Easy",
    "stem": "Which group contains only common kharif crops?",
    "answer": "Rice, maize, cotton",
    "distractors": [
      "Wheat, gram, mustard",
      "Peas, wheat, barley",
      "Mustard, gram, linseed"
    ],
    "explanation": "Rice, maize and cotton are widely treated as kharif crops in the Indian crop calendar. The other groups consist of typical rabi crops.",
    "sourceFactIds": [
      "KHARIF-EXAMPLE-GROUP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-004",
    "qlName": "Kharif crop examples",
    "difficulty": "Medium",
    "stem": "Which crop should be removed from rice, maize, cotton and wheat to leave a kharif-only set?",
    "answer": "Wheat",
    "distractors": [
      "Rice",
      "Maize",
      "Cotton"
    ],
    "explanation": "Rice, maize and cotton are common kharif crops, while wheat is a major rabi crop. Removing wheat leaves a consistent kharif group.",
    "sourceFactIds": [
      "KHARIF-REMOVE-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-004",
    "qlName": "Kharif crop examples",
    "difficulty": "Medium",
    "stem": "Which pair is most naturally grouped under kharif cultivation?",
    "answer": "Rice and cotton",
    "distractors": [
      "Wheat and gram",
      "Mustard and wheat",
      "Barley and peas"
    ],
    "explanation": "Rice and cotton are both commonly grown during the kharif season. The other pairs contain standard winter-season rabi crops.",
    "sourceFactIds": [
      "KHARIF-PAIR-RICE-COTTON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-004",
    "qlName": "Kharif crop examples",
    "difficulty": "Medium",
    "stem": "A crop list includes rice, maize, groundnut and mustard. Which item belongs to a different major season?",
    "answer": "Mustard",
    "distractors": [
      "Rice",
      "Maize",
      "Groundnut"
    ],
    "explanation": "Rice, maize and groundnut are common kharif crops, while mustard is a major rabi oilseed. It is therefore the seasonal outlier.",
    "sourceFactIds": [
      "KHARIF-OUTLIER-MUSTARD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-004",
    "qlName": "Kharif crop examples",
    "difficulty": "Medium",
    "stem": "Which crop is likely to be sown with monsoon onset rather than in winter?",
    "answer": "Soybean",
    "distractors": [
      "Wheat",
      "Gram",
      "Mustard"
    ],
    "explanation": "Soybean is commonly cultivated as a kharif crop and is sown with monsoon moisture. Wheat, gram and mustard belong to the rabi season.",
    "sourceFactIds": [
      "KHARIF-SOYBEAN"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-005",
    "qlName": "Rabi crop examples",
    "difficulty": "Easy",
    "stem": "Which crop is a standard rabi crop?",
    "answer": "Wheat",
    "distractors": [
      "Rice",
      "Cotton",
      "Jute"
    ],
    "explanation": "Wheat is one of India's principal rabi crops and grows through the cool winter season. Rice, cotton and jute are common kharif examples.",
    "sourceFactIds": [
      "RABI-EXAMPLE-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-005",
    "qlName": "Rabi crop examples",
    "difficulty": "Easy",
    "stem": "Which group contains only common rabi crops?",
    "answer": "Wheat, gram, mustard",
    "distractors": [
      "Rice, maize, cotton",
      "Jute, rice, soybean",
      "Cotton, groundnut, rice"
    ],
    "explanation": "Wheat, gram and mustard are typical rabi crops grown after the monsoon. The other groups contain crops strongly linked with kharif cultivation.",
    "sourceFactIds": [
      "RABI-EXAMPLE-GROUP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-005",
    "qlName": "Rabi crop examples",
    "difficulty": "Medium",
    "stem": "Which crop should be removed from wheat, gram, mustard and rice to leave a rabi-only set?",
    "answer": "Rice",
    "distractors": [
      "Wheat",
      "Gram",
      "Mustard"
    ],
    "explanation": "Wheat, gram and mustard are standard rabi crops, whereas rice is commonly a kharif crop. Removing rice leaves the winter-season group.",
    "sourceFactIds": [
      "RABI-REMOVE-RICE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-005",
    "qlName": "Rabi crop examples",
    "difficulty": "Medium",
    "stem": "Which pair is most naturally grouped under rabi cultivation?",
    "answer": "Wheat and gram",
    "distractors": [
      "Rice and cotton",
      "Jute and rice",
      "Maize and cotton"
    ],
    "explanation": "Wheat and gram are major rabi crops and are commonly grown in the cool season. The other pairs are dominated by kharif crops.",
    "sourceFactIds": [
      "RABI-PAIR-WHEAT-GRAM"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-005",
    "qlName": "Rabi crop examples",
    "difficulty": "Medium",
    "stem": "A crop list includes wheat, barley, gram and cotton. Which item belongs to a different major season?",
    "answer": "Cotton",
    "distractors": [
      "Wheat",
      "Barley",
      "Gram"
    ],
    "explanation": "Wheat, barley and gram are rabi crops, while cotton is commonly a kharif crop. Cotton is therefore the seasonal outlier in the list.",
    "sourceFactIds": [
      "RABI-OUTLIER-COTTON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-005",
    "qlName": "Rabi crop examples",
    "difficulty": "Medium",
    "stem": "Which crop is more likely to be sown after monsoon withdrawal than with monsoon onset?",
    "answer": "Mustard",
    "distractors": [
      "Rice",
      "Jute",
      "Cotton"
    ],
    "explanation": "Mustard is a major rabi crop sown in the cooler post-monsoon period. Rice, jute and cotton are commonly linked with kharif sowing.",
    "sourceFactIds": [
      "RABI-MUSTARD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-006",
    "qlName": "Zaid crop examples",
    "difficulty": "Easy",
    "stem": "Which crop is commonly grown in the zaid season?",
    "answer": "Watermelon",
    "distractors": [
      "Wheat",
      "Mustard",
      "Gram"
    ],
    "explanation": "Watermelon is a common short-duration summer crop grown in the zaid interval. Wheat, mustard and gram are typical rabi crops.",
    "sourceFactIds": [
      "ZAID-EXAMPLE-WATERMELON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-006",
    "qlName": "Zaid crop examples",
    "difficulty": "Easy",
    "stem": "Which group is most suitable for zaid cultivation?",
    "answer": "Watermelon, muskmelon, cucumber",
    "distractors": [
      "Wheat, barley, gram",
      "Rice, jute, cotton",
      "Mustard, gram, peas"
    ],
    "explanation": "Watermelon, muskmelon and cucumber are classic summer crops of the zaid season. The other groups belong mostly to rabi or kharif agriculture.",
    "sourceFactIds": [
      "ZAID-EXAMPLE-GROUP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-006",
    "qlName": "Zaid crop examples",
    "difficulty": "Medium",
    "stem": "Which item does not fit a zaid crop list containing watermelon, cucumber and muskmelon?",
    "answer": "Wheat",
    "distractors": [
      "Watermelon",
      "Cucumber",
      "Muskmelon"
    ],
    "explanation": "Watermelon, cucumber and muskmelon are standard zaid examples. Wheat is a rabi crop and therefore does not fit the summer zaid group.",
    "sourceFactIds": [
      "ZAID-OUTLIER-WHEAT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-006",
    "qlName": "Zaid crop examples",
    "difficulty": "Medium",
    "stem": "Which pair is most suitable for the short summer season between rabi and kharif?",
    "answer": "Cucumber and watermelon",
    "distractors": [
      "Wheat and mustard",
      "Rice and jute",
      "Gram and barley"
    ],
    "explanation": "Cucumber and watermelon are suited to the short zaid summer interval. The other pairs represent crops normally grouped with rabi or kharif seasons.",
    "sourceFactIds": [
      "ZAID-PAIR-CUCUMBER-WATERMELON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-006",
    "qlName": "Zaid crop examples",
    "difficulty": "Medium",
    "stem": "A farmer wants a short summer crop before monsoon paddy. Which choice fits the crop calendar?",
    "answer": "Muskmelon",
    "distractors": [
      "Wheat",
      "Mustard",
      "Gram"
    ],
    "explanation": "Muskmelon is a common zaid crop grown during the pre-monsoon summer interval. Wheat, mustard and gram need the winter rabi season.",
    "sourceFactIds": [
      "ZAID-MUSKMELON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-006",
    "qlName": "Zaid crop examples",
    "difficulty": "Medium",
    "stem": "Which crop-season match is accurate?",
    "answer": "Cucumber — zaid",
    "distractors": [
      "Wheat — kharif",
      "Rice — rabi",
      "Mustard — kharif"
    ],
    "explanation": "Cucumber is commonly grown during the summer zaid season. Wheat and mustard are rabi crops, while rice is generally a kharif crop.",
    "sourceFactIds": [
      "ZAID-CUCUMBER-MATCH"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-007",
    "qlName": "Primitive subsistence / shifting cultivation",
    "difficulty": "Easy",
    "stem": "Which farming system uses small plots, simple tools and family or community labour with low outside inputs?",
    "answer": "Primitive subsistence farming",
    "distractors": [
      "Large-scale commercial farming",
      "Plantation farming",
      "Highly mechanised export farming"
    ],
    "explanation": "Primitive subsistence farming relies on small holdings, simple tools and local labour with limited purchased inputs. Production is focused strongly on household needs.",
    "sourceFactIds": [
      "PRIMITIVE-SUBSISTENCE-FEATURES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-007",
    "qlName": "Primitive subsistence / shifting cultivation",
    "difficulty": "Easy",
    "stem": "Slash-and-burn cultivation is linked with which farming system?",
    "answer": "Shifting cultivation",
    "distractors": [
      "Plantation farming",
      "Intensive irrigated farming",
      "Urban horticulture"
    ],
    "explanation": "Shifting cultivation clears a plot, cultivates it for a limited period and later moves to another site. Slash-and-burn is a common method used in this system.",
    "sourceFactIds": [
      "SHIFTING-SLASH-BURN"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-007",
    "qlName": "Primitive subsistence / shifting cultivation",
    "difficulty": "Medium",
    "stem": "Why does shifting cultivation move from one plot to another after a few years?",
    "answer": "Soil fertility declines after repeated use of the cleared plot",
    "distractors": [
      "The crop must always move closer to cities",
      "Winter snowfall permanently covers the field",
      "Large machines require a new field every year"
    ],
    "explanation": "A cleared plot can lose fertility after repeated cultivation without intensive nutrient replacement. Farmers then leave it fallow and shift cultivation to another plot.",
    "sourceFactIds": [
      "SHIFTING-FERTILITY-DECLINE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-007",
    "qlName": "Primitive subsistence / shifting cultivation",
    "difficulty": "Medium",
    "stem": "Which combination fits primitive subsistence cultivation most closely?",
    "answer": "Small plot, simple tools, low capital input",
    "distractors": [
      "Large estate, heavy machinery, export processing",
      "High capital, single plantation crop, factory link",
      "Large irrigation network, combine harvesters, contract market"
    ],
    "explanation": "Primitive subsistence farming operates with limited capital and simple implements on small plots. The other combinations describe capital-intensive commercial systems.",
    "sourceFactIds": [
      "PRIMITIVE-SUBSISTENCE-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-007",
    "qlName": "Primitive subsistence / shifting cultivation",
    "difficulty": "Medium",
    "stem": "Which statement separates shifting cultivation from settled intensive farming?",
    "answer": "The cultivated plot may be abandoned and a new plot cleared after fertility falls",
    "distractors": [
      "The same small field is continuously cropped with high labour input",
      "A single estate crop is processed near the farm",
      "Production is organised around large mechanised farms"
    ],
    "explanation": "Shifting cultivation changes plots after a period of use, often allowing old land to recover. Intensive settled farming keeps using the same limited land more continuously.",
    "sourceFactIds": [
      "SHIFTING-VS-INTENSIVE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-007",
    "qlName": "Primitive subsistence / shifting cultivation",
    "difficulty": "Hard",
    "stem": "A community clears a forest patch, grows food crops for a few seasons, then leaves the plot fallow and moves elsewhere. Which system is shown?",
    "answer": "Shifting cultivation",
    "distractors": [
      "Plantation agriculture",
      "Intensive subsistence farming",
      "Large-scale commercial grain farming"
    ],
    "explanation": "The movement from one cleared plot to another after a short cultivation period is the defining clue. Leaving the old plot fallow also fits shifting cultivation.",
    "sourceFactIds": [
      "SHIFTING-SCENARIO-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-008",
    "qlName": "Intensive subsistence farming",
    "difficulty": "Easy",
    "stem": "Which farming system is common where population pressure on agricultural land is high?",
    "answer": "Intensive subsistence farming",
    "distractors": [
      "Shifting cultivation only",
      "Large plantation farming only",
      "Nomadic pastoralism only"
    ],
    "explanation": "Intensive subsistence farming develops where many people depend on limited farmland. Farmers use small holdings very carefully and apply substantial labour per unit area.",
    "sourceFactIds": [
      "INTENSIVE-POPULATION-PRESSURE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-008",
    "qlName": "Intensive subsistence farming",
    "difficulty": "Easy",
    "stem": "Which feature is typical of intensive subsistence agriculture?",
    "answer": "High labour input on relatively small holdings",
    "distractors": [
      "Very low labour use on huge estates",
      "Abandoning fields after every harvest",
      "Only one plantation crop on a large estate"
    ],
    "explanation": "Intensive subsistence farming tries to obtain high output from limited land through heavy labour use and careful cultivation. Holdings are often relatively small.",
    "sourceFactIds": [
      "INTENSIVE-LABOUR-SMALL-HOLDINGS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-008",
    "qlName": "Intensive subsistence farming",
    "difficulty": "Medium",
    "stem": "Why is land used very intensively in subsistence farming regions with dense rural population?",
    "answer": "Many cultivators depend on limited agricultural land",
    "distractors": [
      "Farmers have unlimited unused land",
      "Fields must remain fallow for many years",
      "Plantation companies require one crop only"
    ],
    "explanation": "High population pressure means each household has limited land available for cultivation. Farmers therefore work the same holdings intensively to meet food and income needs.",
    "sourceFactIds": [
      "INTENSIVE-LAND-PRESSURE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-008",
    "qlName": "Intensive subsistence farming",
    "difficulty": "Medium",
    "stem": "Which practice fits intensive subsistence farming better than shifting cultivation?",
    "answer": "Repeated cultivation of the same small field with high labour input",
    "distractors": [
      "Leaving a used forest plot and clearing another",
      "Growing one estate crop for processing",
      "Using huge mechanised farms with low labour density"
    ],
    "explanation": "Intensive subsistence farming keeps limited land under close and repeated cultivation. Shifting cultivation instead moves between plots after periods of use.",
    "sourceFactIds": [
      "INTENSIVE-VS-SHIFTING"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-008",
    "qlName": "Intensive subsistence farming",
    "difficulty": "Medium",
    "stem": "Which combination is most consistent with intensive subsistence agriculture?",
    "answer": "Small holdings, family labour, irrigation and repeated cropping",
    "distractors": [
      "Large estate, hired labour, single plantation crop",
      "Temporary clearing, low inputs, shifting plots",
      "Very large fields, low labour, export grain specialisation"
    ],
    "explanation": "Small holdings and heavy family labour are central to intensive subsistence farming. Irrigation and repeated cropping help raise output from limited land.",
    "sourceFactIds": [
      "INTENSIVE-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-008",
    "qlName": "Intensive subsistence farming",
    "difficulty": "Hard",
    "stem": "Farm A uses a small permanent holding with heavy family labour and repeated crops; Farm B clears a new plot after soil fertility falls. Which systems are shown?",
    "answer": "A intensive subsistence; B shifting cultivation",
    "distractors": [
      "A shifting cultivation; B plantation farming",
      "A plantation farming; B intensive subsistence",
      "A commercial grain farming; B plantation farming"
    ],
    "explanation": "Farm A keeps using a small permanent plot intensively, which fits intensive subsistence farming. Farm B moves after fertility decline, which identifies shifting cultivation.",
    "sourceFactIds": [
      "INTENSIVE-SHIFTING-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-009",
    "qlName": "Commercial and plantation farming",
    "difficulty": "Easy",
    "stem": "Which feature is typical of commercial farming?",
    "answer": "Production for the market with higher use of purchased inputs",
    "distractors": [
      "Production only for household use with almost no market link",
      "Abandoning every field after one season",
      "Growing crops without any sale objective"
    ],
    "explanation": "Commercial farming is organised strongly around market sale and often uses improved seeds, fertilisers, machinery or irrigation. The production objective differs from pure subsistence.",
    "sourceFactIds": [
      "COMMERCIAL-MARKET-INPUTS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-009",
    "qlName": "Commercial and plantation farming",
    "difficulty": "Easy",
    "stem": "Plantation agriculture usually concentrates on what type of production?",
    "answer": "A single crop grown on a large estate",
    "distractors": [
      "Many unrelated crops on tiny shifting plots",
      "Only household vegetables around a home",
      "Pastoral grazing without crop cultivation"
    ],
    "explanation": "Plantation farming typically grows one major commercial crop over a large area. It requires organised labour, capital and links to processing or markets.",
    "sourceFactIds": [
      "PLANTATION-SINGLE-CROP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-009",
    "qlName": "Commercial and plantation farming",
    "difficulty": "Medium",
    "stem": "Which group contains crops commonly grown under plantation agriculture?",
    "answer": "Tea, coffee, rubber",
    "distractors": [
      "Wheat, gram, mustard",
      "Rice, wheat, barley",
      "Gram, peas, lentils"
    ],
    "explanation": "Tea, coffee and rubber are classic plantation crops grown for commercial markets. The other groups are foodgrain or pulse crops rather than plantation estates.",
    "sourceFactIds": [
      "PLANTATION-CROP-EXAMPLES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-009",
    "qlName": "Commercial and plantation farming",
    "difficulty": "Medium",
    "stem": "Why are processing and transport links important for plantation farming?",
    "answer": "Large commercial output must reach factories and markets efficiently",
    "distractors": [
      "Plantation crops are never sold outside the farm",
      "The system avoids all market connections",
      "Plantations depend only on seasonal shifting of plots"
    ],
    "explanation": "Plantation agriculture produces a concentrated commercial crop that often needs processing and organised marketing. Reliable transport links therefore connect estates with factories and markets.",
    "sourceFactIds": [
      "PLANTATION-PROCESSING-MARKET"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-009",
    "qlName": "Commercial and plantation farming",
    "difficulty": "Medium",
    "stem": "Which feature separates plantation farming from intensive subsistence farming?",
    "answer": "Large estate with specialised commercial crop production",
    "distractors": [
      "Heavy family labour on a small food-producing holding",
      "Permanent use of small fields for household needs",
      "Multiple food crops on tiny holdings"
    ],
    "explanation": "Plantation farming is organised around a specialised commercial crop on a large estate. Intensive subsistence farming is centred on small holdings and high labour use for livelihood needs.",
    "sourceFactIds": [
      "PLANTATION-VS-INTENSIVE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-009",
    "qlName": "Commercial and plantation farming",
    "difficulty": "Hard",
    "stem": "An estate grows tea over a large area, employs hired labour and sends leaves quickly to a nearby processing unit. Which farming form is this?",
    "answer": "Plantation farming",
    "distractors": [
      "Shifting cultivation",
      "Primitive subsistence farming",
      "Intensive subsistence farming"
    ],
    "explanation": "A large estate devoted to one commercial crop, organised labour and nearby processing is a plantation pattern. Tea is a standard example of this farming form.",
    "sourceFactIds": [
      "PLANTATION-SCENARIO-INFERENCE"
    ]
  }
]);

export const GEO_AGR_001_CP001_REVIEW_BATCH_V1: readonly GeoAgr001Question[] = Object.freeze(
  RAW.map((raw, index) => Object.freeze({
    questionId: `GEO-AGR-001-CP001-Q${String(index + 1).padStart(3, "0")}`,
    qlId: raw.qlId, qlName: raw.qlName, difficulty: raw.difficulty, stem: raw.stem,
    options: placeGeoAgrOptions(raw.answer, raw.distractors, index % 4),
    correctIndex: index % 4, canonicalAnswer: raw.answer, explanation: raw.explanation,
    sourceIds: GEO_AGR_001_SOURCE_IDS, sourceFactIds: Object.freeze([...raw.sourceFactIds]),
    reviewOnly: true as const, runtimeRegistered: false as const,
  })),
);

export function auditGeoAgr001Cp001ReviewBatchV1() {
  return auditGeoAgr001Batch(GEO_AGR_001_CP001_REVIEW_BATCH_V1, 1, 9);
}
