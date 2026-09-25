import {
  GEO_VEG_001_SOURCE_IDS,
  placeGeoVegOptions,
  type GeoVeg001Difficulty,
  type GeoVeg001Question,
} from "./geo-veg-001-review-types";
type RawQuestion=Readonly<{qlId:string;qlName:string;difficulty:GeoVeg001Difficulty;stem:string;answer:string;distractors:readonly string[];explanation:string;sourceFactIds:readonly string[]}>;
const RAW:readonly RawQuestion[]=Object.freeze([
  {
    "qlId": "GEO-VEG-001-QL-028",
    "qlName": "Thorn forest climate",
    "difficulty": "Easy",
    "stem": "Tropical thorn forests and scrub are most common in areas receiving roughly how much annual rainfall?",
    "answer": "Less than about 70 cm",
    "distractors": [
      "About 100–200 cm",
      "Above 200 cm",
      "Only heavy winter snowfall"
    ],
    "explanation": "Thorn vegetation develops under low rainfall and high moisture stress. Rainfall below about 70 cm is a standard climatic clue for this vegetation type.",
    "sourceFactIds": [
      "THORN-RAINFALL"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-028",
    "qlName": "Thorn forest climate",
    "difficulty": "Easy",
    "stem": "Which climatic combination favours thorn forest and scrub?",
    "answer": "Low rainfall with high temperature and evaporation",
    "distractors": [
      "Heavy rain with low evaporation",
      "Cold climate with deep snow",
      "Very high rainfall through the year"
    ],
    "explanation": "Hot, dry conditions create strong water shortage for plants. Thorny, drought-resistant vegetation is adapted to this environment.",
    "sourceFactIds": [
      "THORN-HOT-DRY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-028",
    "qlName": "Thorn forest climate",
    "difficulty": "Medium",
    "stem": "Why are thorn forests open rather than forming a closed canopy?",
    "answer": "Limited moisture restricts dense tree growth",
    "distractors": [
      "Rainfall is too high for trees",
      "All thorn species are grasses",
      "Cold temperatures prevent any woody growth"
    ],
    "explanation": "Low rainfall means fewer trees can grow close together. The vegetation therefore becomes open, with scattered trees, shrubs and grasses.",
    "sourceFactIds": [
      "THORN-OPEN-CANOPY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-028",
    "qlName": "Thorn forest climate",
    "difficulty": "Medium",
    "stem": "A hot region receives only about 50 cm of rain annually. Which natural vegetation is most likely?",
    "answer": "Tropical thorn forest and scrub",
    "distractors": [
      "Tropical evergreen forest",
      "Moist deciduous forest",
      "Montane conifer forest"
    ],
    "explanation": "Around 50 cm is well below the deciduous rainfall range. Strong water stress favours drought-resistant thorn and scrub vegetation.",
    "sourceFactIds": [
      "THORN-50CM"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-028",
    "qlName": "Thorn forest climate",
    "difficulty": "Medium",
    "stem": "Which environmental change would most likely shift dry deciduous woodland toward thorn scrub?",
    "answer": "Further decline in rainfall and longer moisture stress",
    "distractors": [
      "Increase in rainfall toward 150 cm",
      "Shorter dry season",
      "Higher year-round soil moisture"
    ],
    "explanation": "As available moisture falls, trees become more scattered and drought-resistant forms increase. This creates a transition from dry deciduous woodland toward thorn scrub.",
    "sourceFactIds": [
      "DRY-DECIDUOUS-TO-THORN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-028",
    "qlName": "Thorn forest climate",
    "difficulty": "Hard",
    "stem": "Two equally warm regions differ mainly in rainfall: one gets 85 cm and the other 45 cm. Which vegetation contrast is most plausible?",
    "answer": "The wetter region may support dry deciduous forest, while the drier region favours thorn scrub",
    "distractors": [
      "The drier region should support denser evergreen forest",
      "Both must have identical vegetation",
      "The wetter region must be alpine"
    ],
    "explanation": "The rainfall totals fall on different sides of the dry deciduous–thorn transition. Lower rainfall increases water stress and favours more open, drought-adapted vegetation.",
    "sourceFactIds": [
      "THORN-RAINFALL-COMPARE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-029",
    "qlName": "Thorn forest distribution",
    "difficulty": "Easy",
    "stem": "Which region of India is strongly linked with tropical thorn forest and scrub?",
    "answer": "Western Rajasthan",
    "distractors": [
      "Windward Western Ghats",
      "Wettest parts of Meghalaya",
      "High alpine Himalaya"
    ],
    "explanation": "Western Rajasthan has hot, dry conditions and scanty rainfall. These conditions favour thorny shrubs, scattered trees and grasses.",
    "sourceFactIds": [
      "THORN-WESTERN-RAJASTHAN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-029",
    "qlName": "Thorn forest distribution",
    "difficulty": "Easy",
    "stem": "Which state is part of India's northwestern thorn-forest belt?",
    "answer": "Gujarat",
    "distractors": [
      "Kerala only",
      "Sikkim only",
      "Arunachal Pradesh only"
    ],
    "explanation": "Dry and semi-arid parts of Gujarat form part of the wider thorn and scrub belt of western India. Rainfall is much lower than in humid forest regions.",
    "sourceFactIds": [
      "THORN-GUJARAT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-029",
    "qlName": "Thorn forest distribution",
    "difficulty": "Medium",
    "stem": "Why is thorn vegetation widespread in parts of Rajasthan and Gujarat?",
    "answer": "Rainfall is low and evaporation demand is high",
    "distractors": [
      "Both states receive the heaviest monsoon rainfall",
      "The regions remain snow-covered",
      "Tidal flooding controls the vegetation"
    ],
    "explanation": "The combination of scanty rain and hot conditions produces strong water stress. Plants with drought-resistant features are therefore favoured.",
    "sourceFactIds": [
      "THORN-NW-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-029",
    "qlName": "Thorn forest distribution",
    "difficulty": "Medium",
    "stem": "Which group includes areas where thorn and scrub vegetation can occur?",
    "answer": "Rajasthan, Gujarat and parts of Haryana",
    "distractors": [
      "Kerala, coastal Karnataka and Meghalaya",
      "Sikkim, Arunachal highlands and Ladakh snowfields",
      "Sundarbans, Andaman Islands and western coast"
    ],
    "explanation": "Northwestern and adjoining semi-arid regions receive limited rainfall and support thorn vegetation. The other groups contain wetter, tidal or high-altitude environments.",
    "sourceFactIds": [
      "THORN-REGION-GROUP"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-029",
    "qlName": "Thorn forest distribution",
    "difficulty": "Medium",
    "stem": "A semi-arid plain in northwestern India has scattered acacia and thorny shrubs. Which vegetation type fits?",
    "answer": "Tropical thorn forest and scrub",
    "distractors": [
      "Tropical evergreen forest",
      "Moist deciduous forest",
      "Montane wet temperate forest"
    ],
    "explanation": "Scattered acacia in a semi-arid northwestern setting is a classic thorn-forest clue. The open structure reflects chronic moisture shortage.",
    "sourceFactIds": [
      "THORN-NW-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-029",
    "qlName": "Thorn forest distribution",
    "difficulty": "Hard",
    "stem": "Why can thorn vegetation extend beyond the Thar Desert into adjoining semi-arid states?",
    "answer": "The controlling factor is low moisture availability, not the desert boundary itself",
    "distractors": [
      "Thorn vegetation requires true desert sand everywhere",
      "Only temperature controls thorn distribution",
      "Semi-arid rainfall is too high for thorn vegetation"
    ],
    "explanation": "Vegetation follows climate and soil conditions rather than administrative or desert map lines. Semi-arid areas with similar water stress can support the same thorny plant forms.",
    "sourceFactIds": [
      "THORN-DISTRIBUTION-REASONING"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-030",
    "qlName": "Thorn leaf and branch adaptations",
    "difficulty": "Easy",
    "stem": "Why do many thorn-forest plants have small leaves?",
    "answer": "Small leaves reduce water loss through transpiration",
    "distractors": [
      "Small leaves increase water loss",
      "They are caused by permanent frost",
      "They absorb more rainfall from the ground"
    ],
    "explanation": "Reducing leaf area lowers the surface through which water can be lost. This is useful in hot, dry environments.",
    "sourceFactIds": [
      "THORN-SMALL-LEAVES"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-030",
    "qlName": "Thorn leaf and branch adaptations",
    "difficulty": "Easy",
    "stem": "What is the advantage of leaves being modified into thorns in dry vegetation?",
    "answer": "They reduce water loss and can also discourage grazing",
    "distractors": [
      "They increase transpiration",
      "They store snow",
      "They make roots shallower"
    ],
    "explanation": "Thorns have far less surface area than broad leaves and help conserve water. They can also protect plants from herbivores.",
    "sourceFactIds": [
      "THORN-THORNS-ADAPTATION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-030",
    "qlName": "Thorn leaf and branch adaptations",
    "difficulty": "Medium",
    "stem": "Which feature would be most useful to a plant in a hot semi-arid region?",
    "answer": "Reduced leaf area",
    "distractors": [
      "Large thin leaves throughout the year",
      "Very shallow roots only",
      "Constant high transpiration"
    ],
    "explanation": "Reduced leaf area helps limit water loss when soil moisture is scarce. Large thin leaves would increase evaporative loss.",
    "sourceFactIds": [
      "THORN-REDUCED-LEAF"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-030",
    "qlName": "Thorn leaf and branch adaptations",
    "difficulty": "Medium",
    "stem": "Why are broad, soft leaves less common among many thorn-scrub plants?",
    "answer": "They would lose too much water under hot dry conditions",
    "distractors": [
      "They prevent photosynthesis in humid climates",
      "They require permanent snow",
      "They cannot grow in any tropical climate"
    ],
    "explanation": "Large soft leaves expose more surface for transpiration. Drought-adapted plants often reduce leaf size or replace leaves with thorns.",
    "sourceFactIds": [
      "THORN-BROAD-LEAVES"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-030",
    "qlName": "Thorn leaf and branch adaptations",
    "difficulty": "Medium",
    "stem": "A shrub has tiny leaves and many thorns. What environmental pressure do these traits most directly address?",
    "answer": "Water shortage",
    "distractors": [
      "Excess rainfall",
      "Permanent flooding",
      "Low oxygen in tidal mud"
    ],
    "explanation": "Both traits help the plant conserve water in a dry climate. They are classic xerophytic responses to limited moisture.",
    "sourceFactIds": [
      "THORN-XEROPHYTIC-TRAITS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-030",
    "qlName": "Thorn leaf and branch adaptations",
    "difficulty": "Hard",
    "stem": "Two shrubs grow under the same high temperature, but one is in a dry region and has tiny leaves and thorns while the other has large leaves in a wet region. What explains the contrast?",
    "answer": "Different water availability selects different leaf adaptations",
    "distractors": [
      "Temperature alone should make their leaves identical",
      "Dry climates favour larger leaf area",
      "Leaf form is unrelated to moisture stress"
    ],
    "explanation": "The key difference is moisture availability. In the dry region, reduced leaf area lowers transpiration, while abundant water permits larger leaves in the wet region.",
    "sourceFactIds": [
      "THORN-LEAF-COMPARE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-031",
    "qlName": "Thorn root and stem adaptations",
    "difficulty": "Easy",
    "stem": "Why do many thorn-forest plants develop long roots?",
    "answer": "To reach moisture deeper in the soil",
    "distractors": [
      "To avoid all contact with soil",
      "To increase surface leaf area",
      "To remain above the canopy"
    ],
    "explanation": "Deep roots can reach water stored below the dry surface layers. This improves survival through long rainless periods.",
    "sourceFactIds": [
      "THORN-DEEP-ROOTS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-031",
    "qlName": "Thorn root and stem adaptations",
    "difficulty": "Easy",
    "stem": "What is the role of a thick or fleshy stem in some dry-region plants?",
    "answer": "It stores water",
    "distractors": [
      "It produces snowfall",
      "It increases leaf transpiration",
      "It creates tidal water"
    ],
    "explanation": "Succulent stems act as water reservoirs. Stored water helps the plant survive between infrequent rain events.",
    "sourceFactIds": [
      "THORN-WATER-STORAGE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-031",
    "qlName": "Thorn root and stem adaptations",
    "difficulty": "Medium",
    "stem": "Which combination shows drought adaptation?",
    "answer": "Deep roots and water-storing stems",
    "distractors": [
      "Shallow roots and very large leaves",
      "Breathing roots and tidal flooding",
      "Needle leaves caused by alpine frost"
    ],
    "explanation": "Deep roots improve access to scarce soil moisture, while succulent stems store water. Together they increase drought survival.",
    "sourceFactIds": [
      "THORN-ROOT-STEM-COMBO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-031",
    "qlName": "Thorn root and stem adaptations",
    "difficulty": "Medium",
    "stem": "Why may roots of thorn vegetation extend far below the surface?",
    "answer": "Surface soil dries quickly, so deeper layers can provide more reliable moisture",
    "distractors": [
      "Deep roots increase evaporation from leaves",
      "Dry plants cannot absorb water near the surface",
      "The plants require underground snow"
    ],
    "explanation": "Hot dry conditions rapidly remove moisture from upper soil. Deeper roots provide access to water that persists longer below.",
    "sourceFactIds": [
      "THORN-DEEP-ROOT-REASON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-031",
    "qlName": "Thorn root and stem adaptations",
    "difficulty": "Medium",
    "stem": "A cactus survives months without rain after storing water from a short shower. Which adaptation is most important?",
    "answer": "Succulent water-storing tissue",
    "distractors": [
      "A dense evergreen canopy",
      "Very large thin leaves",
      "Pneumatophores for tidal mud"
    ],
    "explanation": "Succulent tissues absorb and retain water when it becomes available. This stored supply supports the plant during prolonged drought.",
    "sourceFactIds": [
      "THORN-SUCCULENCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-031",
    "qlName": "Thorn root and stem adaptations",
    "difficulty": "Hard",
    "stem": "A dry-region plant combines thorns, deep roots and a fleshy stem. Why is this combination effective?",
    "answer": "It reduces water loss, reaches scarce moisture and stores water",
    "distractors": [
      "It increases transpiration, shallow rooting and runoff",
      "It depends on permanent flooding",
      "It is adapted chiefly to freezing conditions"
    ],
    "explanation": "Each feature solves a different part of the drought problem. Together they conserve, obtain and store limited water.",
    "sourceFactIds": [
      "THORN-INTEGRATED-ADAPTATIONS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-032",
    "qlName": "Thorn characteristic species",
    "difficulty": "Easy",
    "stem": "Which plant is characteristic of India's thorn vegetation?",
    "answer": "Acacia",
    "distractors": [
      "Mahogany",
      "Deodar",
      "Fir"
    ],
    "explanation": "Acacia is well adapted to hot, dry conditions and is common in thorn and scrub vegetation. The other trees fit humid evergreen or montane forests.",
    "sourceFactIds": [
      "THORN-ACACIA"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-032",
    "qlName": "Thorn characteristic species",
    "difficulty": "Easy",
    "stem": "Which plant group is typical of very dry thorn-scrub conditions?",
    "answer": "Cacti and euphorbias",
    "distractors": [
      "Ebony and mahogany",
      "Fir and spruce",
      "Sal and teak only"
    ],
    "explanation": "Cacti and euphorbias have strong drought adaptations such as water storage and reduced leaves. They fit semi-arid and arid vegetation.",
    "sourceFactIds": [
      "THORN-CACTI-EUPHORBIA"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-032",
    "qlName": "Thorn characteristic species",
    "difficulty": "Medium",
    "stem": "A landscape contains acacia, euphorbia and cactus. Which vegetation type is indicated?",
    "answer": "Tropical thorn forest and scrub",
    "distractors": [
      "Tropical evergreen forest",
      "Moist deciduous forest",
      "Montane conifer forest"
    ],
    "explanation": "These plants are strongly drought-adapted and are classic thorn-scrub indicators. Their combination points to low rainfall.",
    "sourceFactIds": [
      "THORN-SPECIES-ID"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-032",
    "qlName": "Thorn characteristic species",
    "difficulty": "Medium",
    "stem": "Which pair is correctly matched?",
    "answer": "Acacia — thorn forest",
    "distractors": [
      "Mahogany — thorn forest",
      "Deodar — thorn forest",
      "Rosewood — thorn forest"
    ],
    "explanation": "Acacia is characteristic of dry thorn vegetation. Mahogany and rosewood belong to wetter tropical forests, while deodar is montane.",
    "sourceFactIds": [
      "THORN-ACACIA-PAIR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-032",
    "qlName": "Thorn characteristic species",
    "difficulty": "Medium",
    "stem": "Which species would be least expected in a typical thorn-scrub region?",
    "answer": "Mahogany",
    "distractors": [
      "Acacia",
      "Euphorbia",
      "Cactus"
    ],
    "explanation": "Mahogany needs much wetter tropical forest conditions. The other plants possess adaptations suited to strong moisture stress.",
    "sourceFactIds": [
      "THORN-LEAST-EXPECTED"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-032",
    "qlName": "Thorn characteristic species",
    "difficulty": "Hard",
    "stem": "A plant community is dominated by acacia and euphorbia, with scattered cactus and open ground. Which environmental setting best fits?",
    "answer": "Hot semi-arid climate with low rainfall",
    "distractors": [
      "Warm climate with over 200 cm of rainfall",
      "Cold high-altitude conifer belt",
      "Tidal delta with saline flooding"
    ],
    "explanation": "The species and open structure indicate chronic water shortage. Hot semi-arid conditions fit these drought-adapted plants.",
    "sourceFactIds": [
      "THORN-SPECIES-ENVIRONMENT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-033",
    "qlName": "Thorn vegetation structure",
    "difficulty": "Easy",
    "stem": "What is a common structural feature of thorn forest and scrub?",
    "answer": "Scattered trees and shrubs with open spaces",
    "distractors": [
      "A closed multi-layered rainforest canopy",
      "Continuous tall conifers",
      "Permanent treeless snow cover"
    ],
    "explanation": "Low moisture prevents a dense closed forest from developing. Trees and shrubs are therefore widely spaced.",
    "sourceFactIds": [
      "THORN-OPEN-STRUCTURE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-033",
    "qlName": "Thorn vegetation structure",
    "difficulty": "Easy",
    "stem": "Why are grasses often present between thorny shrubs and trees?",
    "answer": "Open spacing leaves ground area and light available",
    "distractors": [
      "The canopy blocks all sunlight",
      "Grasses require permanent flooding",
      "Thorn forests contain no woody plants"
    ],
    "explanation": "The open canopy allows sunlight to reach the ground. Seasonal grasses can grow where short periods of moisture are available.",
    "sourceFactIds": [
      "THORN-GRASS-PATCHES"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-033",
    "qlName": "Thorn vegetation structure",
    "difficulty": "Medium",
    "stem": "Which landscape view best fits thorn scrub?",
    "answer": "Widely spaced drought-resistant shrubs and small trees",
    "distractors": [
      "Dense tall evergreen trees touching overhead",
      "A uniform stand of high-altitude fir",
      "A flooded mangrove swamp"
    ],
    "explanation": "Thorn scrub is open because water shortage limits dense tree growth. Drought-resistant shrubs and small trees dominate the scene.",
    "sourceFactIds": [
      "THORN-LANDSCAPE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-033",
    "qlName": "Thorn vegetation structure",
    "difficulty": "Medium",
    "stem": "Why does thorn vegetation have more bare ground than wetter forests?",
    "answer": "Plant growth is limited by scarce moisture",
    "distractors": [
      "Rainfall is too high for ground plants",
      "Tree shade is always complete",
      "Snow covers the soil for most of the year"
    ],
    "explanation": "Low rainfall limits both the number and density of plants. Gaps remain between shrubs, grasses and scattered trees.",
    "sourceFactIds": [
      "THORN-BARE-GROUND"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-033",
    "qlName": "Thorn vegetation structure",
    "difficulty": "Medium",
    "stem": "A vegetation belt has low trees, thorny bushes and seasonal grasses. Which type is most likely?",
    "answer": "Tropical thorn forest and scrub",
    "distractors": [
      "Tropical evergreen forest",
      "Moist deciduous forest",
      "Subalpine forest"
    ],
    "explanation": "The open mix of drought-adapted woody plants and grasses is typical of thorn vegetation. It reflects low and unreliable moisture.",
    "sourceFactIds": [
      "THORN-STRUCTURE-ID"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-033",
    "qlName": "Thorn vegetation structure",
    "difficulty": "Hard",
    "stem": "Why can thorn vegetation survive where a closed deciduous canopy cannot?",
    "answer": "Its open, drought-adapted structure demands less continuous water",
    "distractors": [
      "It uses more water than deciduous forest",
      "It depends on year-round heavy rainfall",
      "It requires colder temperatures than alpine forest"
    ],
    "explanation": "Thorn plants reduce water loss and occur at lower density. These adaptations allow survival where moisture is insufficient for closed woodland.",
    "sourceFactIds": [
      "THORN-STRUCTURE-REASONING"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-034",
    "qlName": "Thorn and dry deciduous comparison",
    "difficulty": "Easy",
    "stem": "Which vegetation type generally receives less rainfall?",
    "answer": "Thorn forest and scrub",
    "distractors": [
      "Dry deciduous forest",
      "Both always receive equal rainfall",
      "Moist deciduous forest receives the least"
    ],
    "explanation": "Thorn vegetation lies beyond the dry deciduous belt on the drier end of the moisture gradient. It usually occurs below about 70 cm rainfall.",
    "sourceFactIds": [
      "THORN-VS-DRY-RAINFALL"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-034",
    "qlName": "Thorn and dry deciduous comparison",
    "difficulty": "Easy",
    "stem": "Which type normally has the more continuous tree cover?",
    "answer": "Dry deciduous forest",
    "distractors": [
      "Thorn scrub",
      "Both are equally open",
      "Neither contains trees"
    ],
    "explanation": "Dry deciduous forest still forms woodland because it receives more moisture. Thorn scrub has wider spacing and more exposed ground.",
    "sourceFactIds": [
      "THORN-VS-DRY-COVER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-034",
    "qlName": "Thorn and dry deciduous comparison",
    "difficulty": "Medium",
    "stem": "Which sequence follows decreasing rainfall?",
    "answer": "Dry deciduous → thorn scrub",
    "distractors": [
      "Thorn scrub → dry deciduous",
      "Evergreen → alpine only",
      "Mangrove → thorn due to greater flooding"
    ],
    "explanation": "As rainfall falls below the dry deciduous range, tree cover opens further and drought adaptations become stronger. Thorn scrub occupies this drier stage.",
    "sourceFactIds": [
      "DRY-TO-THORN-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-034",
    "qlName": "Thorn and dry deciduous comparison",
    "difficulty": "Medium",
    "stem": "How do leaves typically differ between dry deciduous trees and many thorn plants?",
    "answer": "Deciduous trees shed leaves seasonally; thorn plants often reduce leaves permanently",
    "distractors": [
      "Thorn plants always have larger leaves",
      "Dry deciduous trees never lose leaves",
      "Both require identical leaf form"
    ],
    "explanation": "Deciduous trees cope with seasonal drought by temporary leaf fall. Many thorn plants face stronger water stress and keep leaf area very small or thorn-like.",
    "sourceFactIds": [
      "DRY-THORN-LEAF-COMPARE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-034",
    "qlName": "Thorn and dry deciduous comparison",
    "difficulty": "Medium",
    "stem": "A woodland becomes increasingly open, with acacia and thorny shrubs replacing larger deciduous trees. What change is likely occurring?",
    "answer": "Moisture availability is decreasing",
    "distractors": [
      "Rainfall is increasing sharply",
      "The climate is becoming permanently snowy",
      "Tidal flooding is becoming dominant"
    ],
    "explanation": "Declining moisture favours plants with stronger drought adaptations. The vegetation moves from dry deciduous woodland toward thorn scrub.",
    "sourceFactIds": [
      "DRY-THORN-TRANSITION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-034",
    "qlName": "Thorn and dry deciduous comparison",
    "difficulty": "Medium",
    "stem": "Which clue favours thorn scrub rather than dry deciduous forest?",
    "answer": "Rainfall below about 70 cm with abundant drought-resistant shrubs",
    "distractors": [
      "Around 80–100 cm rainfall with seasonal woodland",
      "Teak-sal woodland with a clear dry season",
      "More continuous tree cover"
    ],
    "explanation": "Very low rainfall and strong xerophytic traits are better clues for thorn scrub. Dry deciduous forest generally receives somewhat more moisture.",
    "sourceFactIds": [
      "THORN-VS-DRY-CLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-035",
    "qlName": "Rainfall gradient and thorn transition",
    "difficulty": "Easy",
    "stem": "What happens to natural vegetation as rainfall drops from dry deciduous levels into semi-arid conditions?",
    "answer": "Tree cover becomes more open and thorny scrub increases",
    "distractors": [
      "Evergreen canopy becomes denser",
      "Alpine conifers replace all lowland trees",
      "Mangroves spread inland"
    ],
    "explanation": "Lower moisture limits large tree growth and favours drought-resistant shrubs. Vegetation becomes more open along the rainfall decline.",
    "sourceFactIds": [
      "THORN-GRADIENT-EASY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-035",
    "qlName": "Rainfall gradient and thorn transition",
    "difficulty": "Easy",
    "stem": "Which vegetation lies on the driest end of the warm lowland forest sequence?",
    "answer": "Thorn forest and scrub",
    "distractors": [
      "Tropical evergreen forest",
      "Moist deciduous forest",
      "Semi-evergreen forest"
    ],
    "explanation": "Among these tropical lowland types, thorn vegetation tolerates the strongest water shortage. It occupies the low-rainfall end of the gradient.",
    "sourceFactIds": [
      "THORN-DRIEST-END"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-035",
    "qlName": "Rainfall gradient and thorn transition",
    "difficulty": "Medium",
    "stem": "Which sequence follows decreasing moisture availability?",
    "answer": "Evergreen → deciduous → thorn scrub",
    "distractors": [
      "Thorn scrub → evergreen → deciduous",
      "Alpine → mangrove → evergreen",
      "Mangrove → evergreen → alpine"
    ],
    "explanation": "Forest density and leaf traits change as water becomes less available. The sequence moves from dense evergreen forest to seasonal deciduous woodland and then open thorn scrub.",
    "sourceFactIds": [
      "THORN-MOISTURE-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-035",
    "qlName": "Rainfall gradient and thorn transition",
    "difficulty": "Medium",
    "stem": "A region's rainfall falls over decades from about 90 cm to around 55 cm, with other controls similar. Which vegetation shift is plausible?",
    "answer": "Dry deciduous toward thorn scrub",
    "distractors": [
      "Thorn scrub toward evergreen forest",
      "Alpine toward mangrove",
      "Evergreen toward denser rainforest"
    ],
    "explanation": "The lower rainfall crosses into stronger semi-arid water stress. Drought-resistant shrubs and scattered trees become more competitive.",
    "sourceFactIds": [
      "THORN-CLIMATE-SHIFT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-035",
    "qlName": "Rainfall gradient and thorn transition",
    "difficulty": "Medium",
    "stem": "Why is there no single sharp line everywhere between dry deciduous forest and thorn scrub?",
    "answer": "Vegetation changes gradually with rainfall, soil and local relief",
    "distractors": [
      "Rainfall alone changes abruptly at one fixed line",
      "Soil differences cannot affect vegetation transitions",
      "Dry deciduous and thorn species cannot occur together"
    ],
    "explanation": "Natural vegetation responds to several continuous environmental gradients. Transitional areas can therefore contain a mix of dry woodland and thorny scrub.",
    "sourceFactIds": [
      "THORN-ECOTONE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-035",
    "qlName": "Rainfall gradient and thorn transition",
    "difficulty": "Medium",
    "stem": "Which factor can modify the exact position of the dry deciduous–thorn transition even at similar rainfall?",
    "answer": "Soil moisture-holding capacity",
    "distractors": [
      "Annual rainfall total alone",
      "Temperature alone",
      "Slope direction alone"
    ],
    "explanation": "Soils that hold water well can reduce plant stress, while sandy or shallow soils dry faster. Soil therefore modifies the effect of the same rainfall total.",
    "sourceFactIds": [
      "THORN-SOIL-MODIFIER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-036",
    "qlName": "Thorn integrated identification",
    "difficulty": "Easy",
    "stem": "A hot area has scanty rainfall, acacia and cactus, and widely spaced shrubs. Which vegetation type fits?",
    "answer": "Tropical thorn forest and scrub",
    "distractors": [
      "Tropical evergreen forest",
      "Moist deciduous forest",
      "Montane conifer forest"
    ],
    "explanation": "Every clue points to strong drought stress: low rainfall, xerophytic species and open structure. This is typical thorn vegetation.",
    "sourceFactIds": [
      "THORN-INTEGRATED-EASY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-036",
    "qlName": "Thorn integrated identification",
    "difficulty": "Easy",
    "stem": "Which set is consistent with thorn vegetation?",
    "answer": "Low rainfall + small leaves + deep roots",
    "distractors": [
      "Heavy rainfall + broad evergreen leaves + closed canopy",
      "Permanent snow + tropical cactus",
      "Tidal flooding + dry acacia scrub"
    ],
    "explanation": "Low rainfall creates water stress, and small leaves plus deep roots help plants survive it. The other sets combine incompatible conditions.",
    "sourceFactIds": [
      "THORN-CONSISTENT-SET"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-036",
    "qlName": "Thorn integrated identification",
    "difficulty": "Medium",
    "stem": "A shrub has thorns, deep roots and a water-storing stem. Which climate is it adapted to?",
    "answer": "Hot semi-arid climate",
    "distractors": [
      "Very wet equatorial climate",
      "Cold alpine climate",
      "Permanently flooded delta"
    ],
    "explanation": "The traits reduce water loss, obtain scarce moisture and store water. Together they indicate adaptation to dry, hot conditions.",
    "sourceFactIds": [
      "THORN-MULTICLUE-PLANT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-036",
    "qlName": "Thorn integrated identification",
    "difficulty": "Medium",
    "stem": "Which regional and species pairing supports thorn-forest identification?",
    "answer": "Western Rajasthan with acacia and euphorbia",
    "distractors": [
      "Western Ghats windward slope with mahogany",
      "High Himalaya with fir and spruce",
      "Sundarbans with tidal mangroves"
    ],
    "explanation": "Western Rajasthan is dry and semi-arid, while acacia and euphorbia are drought-adapted. The pairing therefore fits thorn vegetation.",
    "sourceFactIds": [
      "THORN-REGION-SPECIES"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-036",
    "qlName": "Thorn integrated identification",
    "difficulty": "Medium",
    "stem": "A warm region has rainfall below 70 cm, open scrub and seasonal grasses. Which conclusion is strongest?",
    "answer": "Moisture shortage is the dominant control on its vegetation",
    "distractors": [
      "Excess rainfall is closing the canopy",
      "Altitude is producing alpine forest",
      "Tidal flooding is selecting mangroves"
    ],
    "explanation": "The rainfall and open scrub structure point to chronic water shortage. This is the central environmental control behind thorn vegetation.",
    "sourceFactIds": [
      "THORN-DOMINANT-CONTROL"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-036",
    "qlName": "Thorn integrated identification",
    "difficulty": "Medium",
    "stem": "Which change would most likely make thorn scrub denser without changing temperature greatly?",
    "answer": "A sustained increase in effective rainfall",
    "distractors": [
      "A further decline in rainfall",
      "Faster evaporation",
      "Shallower, drier soil"
    ],
    "explanation": "More available moisture can support greater plant density and a shift toward dry deciduous woodland. The other changes intensify water stress.",
    "sourceFactIds": [
      "THORN-DENSER-CHANGE"
    ]
  }
]);
export const GEO_VEG_001_CP004_REVIEW_BATCH_V1:readonly GeoVeg001Question[]=Object.freeze(RAW.map((raw,index)=>{const correctIndex=index%4;return Object.freeze({
 questionId:`GEO-VEG-001-CP004-Q${String(index+1).padStart(3,"0")}`,qlId:raw.qlId,qlName:raw.qlName,difficulty:raw.difficulty,stem:raw.stem,
 options:placeGeoVegOptions(raw.answer,raw.distractors,correctIndex),correctIndex,canonicalAnswer:raw.answer,explanation:raw.explanation,
 sourceIds:GEO_VEG_001_SOURCE_IDS,sourceFactIds:Object.freeze([...raw.sourceFactIds]),reviewOnly:true as const,runtimeRegistered:false as const});}));
const BANNED=/associated with|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR=/currency|population census|political boundary|time zone|magnetic declination|crop price|road density|literacy|mineral price/i;
export function auditGeoVeg001Cp004ReviewBatchV1(){const issues:string[]=[];const ids=new Set<string>();const stems=new Set<string>();const explanations=new Set<string>();
 const qlCounts:Record<string,number>={};const difficultyCounts:Record<GeoVeg001Difficulty,number>={Easy:0,Medium:0,Hard:0};const answerPositions=[0,0,0,0];
 for(const q of GEO_VEG_001_CP004_REVIEW_BATCH_V1){if(ids.has(q.questionId))issues.push("DUPLICATE_ID:"+q.questionId);ids.add(q.questionId);
  const st=q.stem.replace(/\s+/g," ").trim().toLowerCase();if(stems.has(st))issues.push("DUPLICATE_STEM:"+q.questionId);stems.add(st);
  const ex=q.explanation.replace(/\s+/g," ").trim().toLowerCase();if(explanations.has(ex))issues.push("DUPLICATE_EXPLANATION:"+q.questionId);explanations.add(ex);
  qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]+=1;answerPositions[q.correctIndex]+=1;
  if(q.options.length!==4||new Set(q.options).size!==4)issues.push("OPTIONS:"+q.questionId);if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push("ANSWER:"+q.questionId);
  const ds=q.options.filter((_,i)=>i!==q.correctIndex);if(ds.some(o=>TRIVIAL_DISTRACTOR.test(o)))issues.push("TRIVIAL_DISTRACTOR:"+q.questionId);
  if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push("PROVENANCE:"+q.questionId);if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);
  const learner=q.stem+"\n"+q.options.join("\n")+"\n"+q.explanation;if(BANNED.test(learner))issues.push("STYLE:"+q.questionId);
  if(q.stem.length<22||q.stem.length>360||!q.stem.trim().endsWith("?"))issues.push("STEM_SHAPE:"+q.questionId);if(q.explanation.length<110)issues.push("SHORT_EXPLANATION:"+q.questionId);
 }
 if(GEO_VEG_001_CP004_REVIEW_BATCH_V1.length!==54)issues.push("COUNT:"+GEO_VEG_001_CP004_REVIEW_BATCH_V1.length);
 for(let n=28;n<=36;n++){const id="GEO-VEG-001-QL-"+String(n).padStart(3,"0");if(qlCounts[id]!==6)issues.push("QL_COUNT:"+id+":"+(qlCounts[id]??0));}
 if(difficultyCounts.Easy!==18||difficultyCounts.Medium!==30||difficultyCounts.Hard!==6)issues.push("DIFFICULTY:"+JSON.stringify(difficultyCounts));
 if(answerPositions.join(",")!=="14,14,13,13")issues.push("ANSWER_POSITIONS:"+answerPositions.join(","));if(stems.size!==54)issues.push("STEM_COUNT:"+stems.size);if(explanations.size!==54)issues.push("EXPLANATION_COUNT:"+explanations.size);
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_VEG_001_CP004_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});}
