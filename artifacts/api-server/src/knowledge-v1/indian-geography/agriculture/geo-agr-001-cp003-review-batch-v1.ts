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
    "qlId": "GEO-AGR-001-QL-019",
    "qlName": "Jowar geography",
    "difficulty": "Easy",
    "stem": "Jowar belongs to which crop group?",
    "answer": "Millets",
    "distractors": [
      "Plantation crops",
      "Fibre crops",
      "Beverage crops"
    ],
    "explanation": "Jowar is one of India's important millets and is valued as a hardy cereal crop. It is especially suitable for areas where rainfall is lower than in traditional rice belts.",
    "sourceFactIds": [
      "JOWAR-MILLET"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-019",
    "qlName": "Jowar geography",
    "difficulty": "Easy",
    "stem": "Which moisture condition suits much of India's jowar cultivation?",
    "answer": "Moderate rainfall with limited irrigation need",
    "distractors": [
      "Permanent field flooding",
      "Heavy snowfall through the season",
      "Tidal seawater irrigation"
    ],
    "explanation": "Jowar is often grown as a rain-fed crop and can perform under moderate moisture conditions. It generally needs less water than paddy and is suited to semi-dry farming areas.",
    "sourceFactIds": [
      "JOWAR-RAINFED"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-019",
    "qlName": "Jowar geography",
    "difficulty": "Medium",
    "stem": "Which state group is strongly linked with jowar cultivation?",
    "answer": "Maharashtra, Karnataka and Madhya Pradesh",
    "distractors": [
      "Kerala, Sikkim and Goa",
      "Assam, Meghalaya and Tripura",
      "Punjab, Himachal Pradesh and Jammu and Kashmir only"
    ],
    "explanation": "Jowar is widely grown across the Deccan and central Indian interior, including Maharashtra, Karnataka and Madhya Pradesh. These regions contain large semi-arid farming tracts.",
    "sourceFactIds": [
      "JOWAR-REGION-SET"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-019",
    "qlName": "Jowar geography",
    "difficulty": "Medium",
    "stem": "Why is jowar suitable for many interior plateau regions?",
    "answer": "It tolerates relatively dry conditions better than water-demanding rice",
    "distractors": [
      "It requires permanent standing water",
      "It grows only under coastal tidal influence",
      "It needs winter snow cover"
    ],
    "explanation": "Jowar is a hardy millet that can grow with less water than rice. This makes it useful in semi-arid plateau and interior farming regions.",
    "sourceFactIds": [
      "JOWAR-DRY-REGION-REASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-019",
    "qlName": "Jowar geography",
    "difficulty": "Medium",
    "stem": "Which field would be more suitable for jowar than paddy?",
    "answer": "A rain-fed semi-dry field with moderate seasonal rainfall",
    "distractors": [
      "A permanently flooded delta field",
      "A tidal mangrove swamp",
      "A snow-covered mountain meadow"
    ],
    "explanation": "Jowar can succeed under moderate rainfall and rain-fed conditions, while paddy requires far more water. A semi-dry field therefore fits jowar better.",
    "sourceFactIds": [
      "JOWAR-VS-RICE-FIELD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-019",
    "qlName": "Jowar geography",
    "difficulty": "Hard",
    "stem": "Farm A has reliable standing water; Farm B is rain-fed on a semi-arid plateau. Which crop is more naturally suited to Farm B?",
    "answer": "Jowar",
    "distractors": [
      "Rice",
      "Jute",
      "Rubber"
    ],
    "explanation": "The semi-arid rain-fed setting of Farm B fits a hardy millet such as jowar. Rice, jute and rubber require much wetter or more humid growing environments.",
    "sourceFactIds": [
      "JOWAR-SCENARIO-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-020",
    "qlName": "Bajra geography",
    "difficulty": "Easy",
    "stem": "Bajra is commonly known as which cereal?",
    "answer": "Pearl millet",
    "distractors": [
      "Finger millet",
      "Paddy rice",
      "Barley"
    ],
    "explanation": "Bajra is pearl millet, a hardy cereal widely grown in dry and semi-dry regions. It is especially important where rainfall is too limited for water-demanding crops.",
    "sourceFactIds": [
      "BAJRA-PEARL-MILLET"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-020",
    "qlName": "Bajra geography",
    "difficulty": "Easy",
    "stem": "Which climate is well suited to bajra?",
    "answer": "Hot and relatively dry climate",
    "distractors": [
      "Cool humid climate with continuous flooding",
      "Permanent snowy climate",
      "Tidal wetland climate"
    ],
    "explanation": "Bajra tolerates high temperatures and low to moderate rainfall better than many cereals. This makes it an important crop of arid and semi-arid regions.",
    "sourceFactIds": [
      "BAJRA-HOT-DRY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-020",
    "qlName": "Bajra geography",
    "difficulty": "Medium",
    "stem": "Which soil condition can support bajra well?",
    "answer": "Sandy or shallow black soil in dry regions",
    "distractors": [
      "Only permanently waterlogged clay",
      "Only glacial ice deposits",
      "Only tidal saline mud"
    ],
    "explanation": "Bajra is adapted to relatively poor, sandy and shallow soils under dry conditions. It can therefore grow where more demanding crops perform poorly.",
    "sourceFactIds": [
      "BAJRA-SOIL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-020",
    "qlName": "Bajra geography",
    "difficulty": "Medium",
    "stem": "Which state is strongly linked with bajra cultivation because of its dry climate?",
    "answer": "Rajasthan",
    "distractors": [
      "Kerala",
      "Assam",
      "Sikkim"
    ],
    "explanation": "Rajasthan has extensive arid and semi-arid tracts where bajra is well suited to low rainfall and sandy soils. The crop is a classic dryland cereal there.",
    "sourceFactIds": [
      "BAJRA-RAJASTHAN"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-020",
    "qlName": "Bajra geography",
    "difficulty": "Medium",
    "stem": "Why does bajra fit western dryland agriculture better than paddy?",
    "answer": "It needs much less water and tolerates dry soils",
    "distractors": [
      "It requires deeper standing water than paddy",
      "It grows only in humid deltas",
      "It depends on tidal irrigation"
    ],
    "explanation": "Bajra is drought-tolerant and can grow with limited rainfall, while paddy needs abundant moisture. This contrast makes bajra better suited to dry western regions.",
    "sourceFactIds": [
      "BAJRA-VS-RICE-WATER"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-020",
    "qlName": "Bajra geography",
    "difficulty": "Hard",
    "stem": "A district has sandy soil, high summer temperatures and uncertain rainfall. Which cereal is the strongest geographic match?",
    "answer": "Bajra",
    "distractors": [
      "Rice",
      "Jute",
      "Wheat under flooded conditions"
    ],
    "explanation": "Sandy soil, heat and uncertain rainfall are classic conditions for bajra. Rice and jute need far more moisture, while wheat is a cool-season crop.",
    "sourceFactIds": [
      "BAJRA-CLIMATE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-021",
    "qlName": "Ragi geography",
    "difficulty": "Easy",
    "stem": "Ragi is commonly known as which millet?",
    "answer": "Finger millet",
    "distractors": [
      "Pearl millet",
      "Foxtail rice",
      "Winter barley"
    ],
    "explanation": "Ragi is finger millet, a nutritious cereal grown in several dry and upland regions of India. It belongs to the millet group rather than rice or barley.",
    "sourceFactIds": [
      "RAGI-FINGER-MILLET"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-021",
    "qlName": "Ragi geography",
    "difficulty": "Easy",
    "stem": "Which state is strongly linked with ragi cultivation?",
    "answer": "Karnataka",
    "distractors": [
      "Punjab",
      "Goa only",
      "Assam only"
    ],
    "explanation": "Karnataka has a long-established ragi belt and the crop is widely grown in its dry farming areas. Ragi also occurs in several other southern and hill regions.",
    "sourceFactIds": [
      "RAGI-KARNATAKA"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-021",
    "qlName": "Ragi geography",
    "difficulty": "Medium",
    "stem": "Which soil range can support ragi?",
    "answer": "Red, black and sandy loam soils",
    "distractors": [
      "Only permanently flooded delta mud",
      "Only glacial deposits",
      "Only tidal saline marsh"
    ],
    "explanation": "Ragi can grow on several relatively light or upland soils, including red, black and sandy loams. This adaptability helps it survive in dry farming areas.",
    "sourceFactIds": [
      "RAGI-SOILS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-021",
    "qlName": "Ragi geography",
    "difficulty": "Medium",
    "stem": "Which nutritional feature is often noted for ragi?",
    "answer": "It is rich in calcium and iron",
    "distractors": [
      "It contains no minerals",
      "It is grown only for fibre",
      "It is used only as a beverage crop"
    ],
    "explanation": "Ragi is valued not only as a hardy millet but also for its nutritional content, including calcium and iron. This makes it an important food grain in several regions.",
    "sourceFactIds": [
      "RAGI-NUTRITION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-021",
    "qlName": "Ragi geography",
    "difficulty": "Medium",
    "stem": "Why can ragi fit dry upland farming?",
    "answer": "It tolerates relatively modest moisture and varied soils",
    "distractors": [
      "It requires deep standing water",
      "It needs tidal flooding",
      "It grows only under snow"
    ],
    "explanation": "Ragi is adapted to dry conditions and a range of soils, including red and sandy loams. It can therefore grow in upland areas where paddy is less suitable.",
    "sourceFactIds": [
      "RAGI-DRY-UPLAND"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-021",
    "qlName": "Ragi geography",
    "difficulty": "Hard",
    "stem": "A farmer in a dry upland area with red soil wants a hardy nutritious cereal rather than paddy. Which crop fits best?",
    "answer": "Ragi",
    "distractors": [
      "Rice",
      "Jute",
      "Rubber"
    ],
    "explanation": "Ragi suits red upland soils, tolerates lower moisture and is nutritionally rich. The wet or humid requirements of rice, jute and rubber make them poorer matches.",
    "sourceFactIds": [
      "RAGI-UPLAND-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-022",
    "qlName": "Maize — season and conditions",
    "difficulty": "Easy",
    "stem": "Maize is generally grown in India during which major crop season?",
    "answer": "Kharif",
    "distractors": [
      "Rabi only",
      "Zaid only",
      "Plantation season"
    ],
    "explanation": "Maize is commonly sown with the monsoon and is classified as a kharif crop in the standard Indian crop calendar. Some regions also grow it in other seasons with suitable conditions.",
    "sourceFactIds": [
      "MAIZE-KHARIF"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-022",
    "qlName": "Maize — season and conditions",
    "difficulty": "Easy",
    "stem": "Which temperature range is suitable for maize growth?",
    "answer": "Warm conditions around the low-to-mid twenties Celsius",
    "distractors": [
      "Permanent sub-zero temperatures",
      "Only near-freezing weather",
      "Extreme cold throughout the season"
    ],
    "explanation": "Maize is a warm-season crop and performs well under moderate to high temperatures during growth. It does not require the prolonged cold conditions of high mountains.",
    "sourceFactIds": [
      "MAIZE-WARM-TEMP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-022",
    "qlName": "Maize — season and conditions",
    "difficulty": "Medium",
    "stem": "Which soil type is commonly suitable for maize?",
    "answer": "Well-drained fertile loam or alluvial soil",
    "distractors": [
      "Permanent waterlogged marsh only",
      "Bare rock without soil",
      "Glacial ice"
    ],
    "explanation": "Maize grows well on fertile, well-drained soils such as loams and alluvial soils. Persistent waterlogging is less suitable because roots need aerated soil.",
    "sourceFactIds": [
      "MAIZE-SOIL"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-022",
    "qlName": "Maize — season and conditions",
    "difficulty": "Medium",
    "stem": "Why does maize require good drainage?",
    "answer": "Its roots need moisture without prolonged waterlogging",
    "distractors": [
      "The crop grows only under standing water",
      "Drainage prevents any root growth",
      "Maize requires tidal saltwater"
    ],
    "explanation": "Maize needs adequate moisture but does not thrive in continuously waterlogged fields. Good drainage allows roots to receive both water and air.",
    "sourceFactIds": [
      "MAIZE-DRAINAGE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-022",
    "qlName": "Maize — season and conditions",
    "difficulty": "Medium",
    "stem": "Which field condition favours maize more than paddy?",
    "answer": "Fertile well-drained field with warm weather",
    "distractors": [
      "Deep standing water throughout growth",
      "Tidal swamp with saline water",
      "Permanent snow cover"
    ],
    "explanation": "Maize prefers warm conditions and well-drained fertile soil rather than flooded paddy-style fields. The distinction is useful in crop-condition questions.",
    "sourceFactIds": [
      "MAIZE-VS-RICE-FIELD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-022",
    "qlName": "Maize — season and conditions",
    "difficulty": "Hard",
    "stem": "District A is warm with well-drained loam; District B is warm but fields remain deeply flooded. Which district is better for maize?",
    "answer": "District A",
    "distractors": [
      "District B",
      "Both require deep flooding",
      "Neither can grow maize"
    ],
    "explanation": "Maize benefits from warm weather, fertile soil and good drainage. Deep persistent flooding in District B can damage roots and reduce crop performance.",
    "sourceFactIds": [
      "MAIZE-DRAINAGE-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-023",
    "qlName": "Maize — regional associations",
    "difficulty": "Easy",
    "stem": "Which broad region is well suited to maize where warm weather and well-drained soils occur?",
    "answer": "Interior plains and plateaus",
    "distractors": [
      "Permanent mangrove swamps only",
      "Glaciated high peaks only",
      "Tidal mudflats only"
    ],
    "explanation": "Maize grows widely on warm, well-drained plains and plateaus across India. It does not require permanently flooded or glaciated environments.",
    "sourceFactIds": [
      "MAIZE-PLAINS-PLATEAUS"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-023",
    "qlName": "Maize — regional associations",
    "difficulty": "Easy",
    "stem": "In some parts of India, maize can also be grown outside the usual kharif season when what is available?",
    "answer": "Suitable temperature and irrigation",
    "distractors": [
      "Permanent snow",
      "Tidal seawater only",
      "Complete absence of moisture"
    ],
    "explanation": "Although maize is usually a kharif crop, irrigation and suitable temperatures can support it in other seasons in some regions. Crop calendars can therefore vary locally.",
    "sourceFactIds": [
      "MAIZE-OTHER-SEASON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-023",
    "qlName": "Maize — regional associations",
    "difficulty": "Medium",
    "stem": "Which state is known for growing maize in both monsoon and winter settings in parts of the state?",
    "answer": "Bihar",
    "distractors": [
      "Lakshadweep",
      "Goa only",
      "Sikkim only"
    ],
    "explanation": "Bihar is a familiar example where maize can be cultivated beyond the usual kharif season under suitable winter conditions. This shows that season classification can have regional exceptions.",
    "sourceFactIds": [
      "MAIZE-BIHAR-RABI"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-023",
    "qlName": "Maize — regional associations",
    "difficulty": "Medium",
    "stem": "Which development can increase maize cultivation in a region with uncertain rainfall?",
    "answer": "Reliable irrigation and improved seed",
    "distractors": [
      "Removing all water access",
      "Maintaining permanent field flooding",
      "Eliminating soil nutrients"
    ],
    "explanation": "Reliable irrigation reduces dependence on rainfall, while improved seed can raise productivity under suitable management. Together they can expand maize cultivation.",
    "sourceFactIds": [
      "MAIZE-IRRIGATION-SEED"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-023",
    "qlName": "Maize — regional associations",
    "difficulty": "Medium",
    "stem": "Which landscape is more suitable for maize than jute?",
    "answer": "Well-drained interior loam",
    "distractors": [
      "Humid floodplain requiring retting water",
      "Tidal marsh",
      "Permanent waterlogged delta"
    ],
    "explanation": "Maize prefers well-drained fertile land, while jute is strongly linked with humid alluvial floodplains. The interior loam therefore fits maize better.",
    "sourceFactIds": [
      "MAIZE-VS-JUTE-LANDSCAPE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-023",
    "qlName": "Maize — regional associations",
    "difficulty": "Medium",
    "stem": "Which factor allows maize to have a wider seasonal range than a strict monsoon-only crop?",
    "answer": "Irrigation can supply water when rainfall is absent",
    "distractors": [
      "Maize never needs moisture",
      "The crop grows only in snow",
      "It can use seawater for irrigation"
    ],
    "explanation": "Irrigation can provide water outside the rainy season, allowing maize to be grown in additional seasonal windows where temperature is suitable. This is seen in some regional crop calendars.",
    "sourceFactIds": [
      "MAIZE-SEASON-FLEXIBILITY"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-024",
    "qlName": "Pulses — nitrogen fixation / soil role",
    "difficulty": "Easy",
    "stem": "Why are pulse crops useful in crop rotation?",
    "answer": "They help restore soil nitrogen",
    "distractors": [
      "They remove all nitrogen permanently",
      "They create permanent waterlogging",
      "They increase soil salinity by seawater"
    ],
    "explanation": "Most pulses are leguminous crops whose root bacteria help fix atmospheric nitrogen. Growing them in rotation can therefore improve soil fertility.",
    "sourceFactIds": [
      "PULSES-NITROGEN-FIXATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-024",
    "qlName": "Pulses — nitrogen fixation / soil role",
    "difficulty": "Easy",
    "stem": "Pulses belong largely to which botanical farming group?",
    "answer": "Leguminous crops",
    "distractors": [
      "Fibre crops only",
      "Plantation tree crops",
      "Aquatic crops only"
    ],
    "explanation": "Gram, lentil, pea, moong and many other pulses are legumes. Their root nodules support nitrogen-fixing bacteria, giving them an important soil-fertility role.",
    "sourceFactIds": [
      "PULSES-LEGUMES"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-024",
    "qlName": "Pulses — nitrogen fixation / soil role",
    "difficulty": "Medium",
    "stem": "What happens to soil fertility when pulses are included in rotation with cereals?",
    "answer": "Nitrogen availability can improve",
    "distractors": [
      "All soil nutrients disappear",
      "The soil becomes permanently flooded",
      "The field must be abandoned immediately"
    ],
    "explanation": "Nitrogen-fixing bacteria linked with legume roots add usable nitrogen to the soil system. This can benefit crops grown later in the rotation.",
    "sourceFactIds": [
      "PULSES-ROTATION-BENEFIT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-024",
    "qlName": "Pulses — nitrogen fixation / soil role",
    "difficulty": "Medium",
    "stem": "Why do many pulse crops suit relatively dry farming areas?",
    "answer": "They generally need less moisture than rice",
    "distractors": [
      "They require deeper standing water than rice",
      "They need tidal flooding",
      "They cannot tolerate any dry period"
    ],
    "explanation": "Many pulses are adapted to lower moisture conditions and can be grown in drier regions. Their water requirement is generally far below that of paddy.",
    "sourceFactIds": [
      "PULSES-LOW-MOISTURE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-024",
    "qlName": "Pulses — nitrogen fixation / soil role",
    "difficulty": "Medium",
    "stem": "Which rotation would most directly add a nitrogen-fixing crop after a cereal?",
    "answer": "Wheat followed by gram",
    "distractors": [
      "Rice followed by rice",
      "Wheat followed by wheat",
      "Maize followed by maize only"
    ],
    "explanation": "Gram is a leguminous pulse and can contribute nitrogen through biological fixation. Including it after wheat creates a cereal–pulse rotation with soil benefits.",
    "sourceFactIds": [
      "PULSES-CEREAL-ROTATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-024",
    "qlName": "Pulses — nitrogen fixation / soil role",
    "difficulty": "Hard",
    "stem": "A farmer wants to reduce continuous cereal pressure and improve soil nitrogen without leaving the field fallow. Which crop group should be added?",
    "answer": "Pulses",
    "distractors": [
      "Fibre crops only",
      "Plantation crops only",
      "Aquatic weeds"
    ],
    "explanation": "Pulse crops are legumes and can improve nitrogen status through root-associated bacteria. They are therefore a logical rotational choice after repeated cereal cultivation.",
    "sourceFactIds": [
      "PULSES-SOIL-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-025",
    "qlName": "Gram and tur/arhar",
    "difficulty": "Easy",
    "stem": "Gram is generally grown in which major crop season?",
    "answer": "Rabi",
    "distractors": [
      "Kharif only",
      "Zaid only",
      "Plantation season"
    ],
    "explanation": "Gram is a major pulse of the rabi season and is usually sown after the monsoon. It grows well under cooler conditions with relatively limited moisture.",
    "sourceFactIds": [
      "GRAM-RABI"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-025",
    "qlName": "Gram and tur/arhar",
    "difficulty": "Easy",
    "stem": "Tur is also commonly known by which name?",
    "answer": "Arhar",
    "distractors": [
      "Bajra",
      "Ragi",
      "Jowar"
    ],
    "explanation": "Tur and arhar are two common names for the same pulse crop. It is an important source of dal and is widely grown in Indian agriculture.",
    "sourceFactIds": [
      "TUR-ARHAR"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-025",
    "qlName": "Gram and tur/arhar",
    "difficulty": "Medium",
    "stem": "Which comparison is accurate?",
    "answer": "Gram is commonly rabi; tur/arhar is commonly kharif",
    "distractors": [
      "Gram is kharif; tur is rabi only",
      "Both are plantation crops",
      "Both require flooded paddy fields"
    ],
    "explanation": "Gram is a winter rabi pulse, while tur or arhar is usually grown during the kharif season. The two pulses therefore differ in their standard crop calendar.",
    "sourceFactIds": [
      "GRAM-TUR-SEASON-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-025",
    "qlName": "Gram and tur/arhar",
    "difficulty": "Medium",
    "stem": "Which pulse is more likely to be sown after monsoon withdrawal?",
    "answer": "Gram",
    "distractors": [
      "Tur/arhar under normal kharif timing",
      "Rice",
      "Jute"
    ],
    "explanation": "Gram is a rabi pulse and is sown in the cooler post-monsoon period. Tur is more commonly linked with kharif cultivation.",
    "sourceFactIds": [
      "GRAM-POST-MONSOON"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-025",
    "qlName": "Gram and tur/arhar",
    "difficulty": "Medium",
    "stem": "Which pulse is more naturally linked with the monsoon crop calendar?",
    "answer": "Tur/arhar",
    "distractors": [
      "Gram",
      "Wheat",
      "Mustard"
    ],
    "explanation": "Tur or arhar is commonly grown during the kharif season and develops through the monsoon period. Gram, wheat and mustard are standard rabi crops.",
    "sourceFactIds": [
      "TUR-KHARIF"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-025",
    "qlName": "Gram and tur/arhar",
    "difficulty": "Hard",
    "stem": "Farm A sows a pulse in November; Farm B sows another pulse with the monsoon. Which pairing fits best?",
    "answer": "A gram; B tur/arhar",
    "distractors": [
      "A tur; B gram",
      "A rice; B gram",
      "A jute; B wheat"
    ],
    "explanation": "November sowing fits the rabi pulse gram, while monsoon sowing fits tur or arhar. The calendar clues identify the two pulses in that order.",
    "sourceFactIds": [
      "GRAM-TUR-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-026",
    "qlName": "Other pulses and season grouping",
    "difficulty": "Easy",
    "stem": "Which crop is a pulse?",
    "answer": "Moong",
    "distractors": [
      "Cotton",
      "Jute",
      "Sugarcane"
    ],
    "explanation": "Moong is a pulse crop and a legume, used widely as dal. Cotton and jute are fibre crops, while sugarcane is a commercial sugar crop.",
    "sourceFactIds": [
      "MOONG-PULSE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-026",
    "qlName": "Other pulses and season grouping",
    "difficulty": "Easy",
    "stem": "Which group contains only pulse crops?",
    "answer": "Gram, moong, masur",
    "distractors": [
      "Rice, wheat, maize",
      "Cotton, jute, sugarcane",
      "Tea, coffee, rubber"
    ],
    "explanation": "Gram, moong and masur are all pulses. The other groups consist of cereals, commercial fibre/sugar crops or plantation crops.",
    "sourceFactIds": [
      "PULSE-GROUP"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-026",
    "qlName": "Other pulses and season grouping",
    "difficulty": "Medium",
    "stem": "Which pulse is commonly grouped with rabi crops?",
    "answer": "Masur",
    "distractors": [
      "Jute",
      "Cotton",
      "Rice"
    ],
    "explanation": "Masur or lentil is commonly grown in the rabi season under cool, relatively dry conditions. Jute, cotton and rice are generally linked with kharif cultivation.",
    "sourceFactIds": [
      "MASUR-RABI"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-026",
    "qlName": "Other pulses and season grouping",
    "difficulty": "Medium",
    "stem": "Which pair contains two pulses rather than a cereal and a fibre crop?",
    "answer": "Moong and urad",
    "distractors": [
      "Rice and cotton",
      "Wheat and jute",
      "Maize and cotton"
    ],
    "explanation": "Moong and urad are both pulse crops and belong to the legume family. The other pairs combine cereals with fibre crops.",
    "sourceFactIds": [
      "MOONG-URAD-PAIR"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-026",
    "qlName": "Other pulses and season grouping",
    "difficulty": "Medium",
    "stem": "Which crop should be removed from gram, masur, moong and maize to leave a pulse-only set?",
    "answer": "Maize",
    "distractors": [
      "Gram",
      "Masur",
      "Moong"
    ],
    "explanation": "Gram, masur and moong are pulses, while maize is a cereal. Removing maize leaves a group made entirely of leguminous pulse crops.",
    "sourceFactIds": [
      "PULSE-REMOVE-MAIZE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-026",
    "qlName": "Other pulses and season grouping",
    "difficulty": "Medium",
    "stem": "Which farming objective is supported by including moong or urad in a crop rotation?",
    "answer": "Adding a nitrogen-fixing legume to the sequence",
    "distractors": [
      "Creating permanent field flooding",
      "Replacing all soil moisture with saltwater",
      "Keeping the field under one cereal continuously"
    ],
    "explanation": "Moong and urad are legumes whose root systems support nitrogen-fixing bacteria. Their inclusion can improve soil fertility within a rotation.",
    "sourceFactIds": [
      "PULSE-ROTATION-MOONG-URAD"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-027",
    "qlName": "Millet/maize/pulse integrated reasoning",
    "difficulty": "Easy",
    "stem": "Which crop group is generally more drought-tolerant than paddy?",
    "answer": "Millets",
    "distractors": [
      "Jute only",
      "Rubber only",
      "Tea only"
    ],
    "explanation": "Millets such as jowar and bajra can grow with much less water than paddy. Their drought tolerance makes them important cereals in dry regions.",
    "sourceFactIds": [
      "MILLET-DROUGHT-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-027",
    "qlName": "Millet/maize/pulse integrated reasoning",
    "difficulty": "Easy",
    "stem": "Which set contains a millet, a cereal and a pulse respectively?",
    "answer": "Bajra, maize, gram",
    "distractors": [
      "Rice, jute, cotton",
      "Tea, coffee, rubber",
      "Cotton, wheat, jute"
    ],
    "explanation": "Bajra is a millet, maize is a cereal and gram is a pulse. The set therefore combines three different agricultural crop categories.",
    "sourceFactIds": [
      "MILLET-MAIZE-PULSE-SET"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-027",
    "qlName": "Millet/maize/pulse integrated reasoning",
    "difficulty": "Medium",
    "stem": "Which crop fits a dry sandy district better than maize on waterlogged soil or rice without irrigation?",
    "answer": "Bajra",
    "distractors": [
      "Rice",
      "Jute",
      "Rubber"
    ],
    "explanation": "Bajra tolerates dry conditions and sandy soils, so it fits the district well. Rice and jute need much more water, while rubber requires a humid plantation climate.",
    "sourceFactIds": [
      "MILLET-DRY-DISTRICT"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-027",
    "qlName": "Millet/maize/pulse integrated reasoning",
    "difficulty": "Medium",
    "stem": "Which rotation combines a cereal with a crop that can improve soil nitrogen?",
    "answer": "Maize followed by gram",
    "distractors": [
      "Maize followed by maize",
      "Rice followed by rice",
      "Bajra followed by bajra only"
    ],
    "explanation": "Maize is a cereal, while gram is a nitrogen-fixing pulse. The cereal–pulse sequence can improve soil nutrient balance compared with continuous cereal cropping.",
    "sourceFactIds": [
      "MAIZE-GRAM-ROTATION"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-027",
    "qlName": "Millet/maize/pulse integrated reasoning",
    "difficulty": "Medium",
    "stem": "Which comparison is accurate?",
    "answer": "Bajra suits drier soils; maize prefers better-drained fertile soils; pulses can improve nitrogen",
    "distractors": [
      "Bajra requires flooding; maize grows only in marshes; pulses remove all nitrogen",
      "All three crops require standing water",
      "All three are plantation crops"
    ],
    "explanation": "Bajra is adapted to dryland conditions, maize performs best on fertile well-drained soils, and pulses contribute to soil nitrogen through biological fixation. The three crop groups therefore have distinct geographic roles.",
    "sourceFactIds": [
      "BAJRA-MAIZE-PULSE-COMPARE"
    ]
  },
  {
    "qlId": "GEO-AGR-001-QL-027",
    "qlName": "Millet/maize/pulse integrated reasoning",
    "difficulty": "Hard",
    "stem": "Farm A is sandy and dry, Farm B has fertile well-drained loam, and Farm C needs a rotational crop to improve nitrogen. Which crops fit A, B and C?",
    "answer": "Bajra, maize, gram",
    "distractors": [
      "Rice, jute, cotton",
      "Maize, rice, jute",
      "Gram, rubber, rice"
    ],
    "explanation": "Bajra matches the dry sandy field, maize fits fertile well-drained loam, and gram is a nitrogen-fixing pulse suited to rotation. The three clues point to those crops in order.",
    "sourceFactIds": [
      "MILLET-MAIZE-PULSE-INFERENCE"
    ]
  }
]);

export const GEO_AGR_001_CP003_REVIEW_BATCH_V1: readonly GeoAgr001Question[] = Object.freeze(
  RAW.map((raw, index) => Object.freeze({
    questionId: `GEO-AGR-001-CP003-Q${String(index + 1).padStart(3, "0")}`,
    qlId: raw.qlId, qlName: raw.qlName, difficulty: raw.difficulty, stem: raw.stem,
    options: placeGeoAgrOptions(raw.answer, raw.distractors, index % 4),
    correctIndex: index % 4, canonicalAnswer: raw.answer, explanation: raw.explanation,
    sourceIds: GEO_AGR_001_SOURCE_IDS, sourceFactIds: Object.freeze([...raw.sourceFactIds]),
    reviewOnly: true as const, runtimeRegistered: false as const,
  })),
);

export function auditGeoAgr001Cp003ReviewBatchV1() {
  return auditGeoAgr001Batch(GEO_AGR_001_CP003_REVIEW_BATCH_V1, 19, 27);
}
