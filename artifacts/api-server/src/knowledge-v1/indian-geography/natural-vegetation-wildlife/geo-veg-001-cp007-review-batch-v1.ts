import { GEO_VEG_001_SOURCE_IDS, placeGeoVegOptions, type GeoVeg001Difficulty, type GeoVeg001Question } from "./geo-veg-001-review-types";
type RawQuestion=Readonly<{qlId:string;qlName:string;difficulty:GeoVeg001Difficulty;stem:string;answer:string;distractors:readonly string[];explanation:string;sourceFactIds:readonly string[]}>;
const RAW:readonly RawQuestion[]=Object.freeze([
  {
    "qlId": "GEO-VEG-001-QL-055",
    "qlName": "Western Ghats vegetation pattern",
    "difficulty": "Easy",
    "stem": "Which vegetation is most typical of the very wet windward side of the Western Ghats?",
    "answer": "Tropical evergreen forest",
    "distractors": [
      "Tropical thorn scrub",
      "Alpine grassland",
      "Mangrove forest throughout the slope"
    ],
    "explanation": "The windward Western Ghats receive very heavy orographic rainfall from moisture-bearing monsoon winds. Warm and wet conditions support evergreen vegetation.",
    "sourceFactIds": [
      "WG-EVERGREEN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-055",
    "qlName": "Western Ghats vegetation pattern",
    "difficulty": "Easy",
    "stem": "What vegetation change is common from the wet western face of the Ghats toward the drier interior?",
    "answer": "Evergreen forest grades into deciduous vegetation",
    "distractors": [
      "Thorn scrub changes directly into mangrove",
      "Alpine vegetation replaces all lowland forest",
      "Mangroves spread upslope with altitude"
    ],
    "explanation": "Rainfall decreases after moist air crosses the Western Ghats. Greater seasonal dryness favours deciduous forest east of the wet evergreen belt.",
    "sourceFactIds": [
      "WG-EVERGREEN-DECIDUOUS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-055",
    "qlName": "Western Ghats vegetation pattern",
    "difficulty": "Medium",
    "stem": "Why can two sides of the Western Ghats support different natural vegetation at similar latitude?",
    "answer": "Orographic rainfall creates a wetter windward side and a drier leeward side",
    "distractors": [
      "Latitude changes sharply across the mountain",
      "Tides flood the eastern slope",
      "The western side is permanently colder than the Himalayas"
    ],
    "explanation": "Relief changes rainfall distribution across the Ghats. The windward side is very wet, while descending air leaves the interior relatively drier.",
    "sourceFactIds": [
      "WG-OROGRAPHIC"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-055",
    "qlName": "Western Ghats vegetation pattern",
    "difficulty": "Medium",
    "stem": "A station lies on the western slope of the Ghats and receives over 200 cm of rain. Which forest is the strongest match?",
    "answer": "Tropical evergreen forest",
    "distractors": [
      "Dry deciduous forest",
      "Thorn scrub",
      "Alpine forest"
    ],
    "explanation": "Very high rainfall and tropical warmth favour dense evergreen vegetation. Dry deciduous and thorn types indicate much stronger seasonal water stress.",
    "sourceFactIds": [
      "WG-200CM"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-055",
    "qlName": "Western Ghats vegetation pattern",
    "difficulty": "Medium",
    "stem": "A second station east of the Ghats receives much less rainfall and has a clear dry season. Which vegetation becomes more likely?",
    "answer": "Tropical deciduous forest",
    "distractors": [
      "Dense evergreen rainforest",
      "Tidal mangrove forest",
      "Alpine grassland"
    ],
    "explanation": "The leeward interior receives less moisture than the windward slope. A pronounced dry season favours seasonal leaf-shedding deciduous vegetation.",
    "sourceFactIds": [
      "WG-LEEWARD"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-055",
    "qlName": "Western Ghats vegetation pattern",
    "difficulty": "Hard",
    "stem": "A transect crosses the Ghats from a humid coast to the rain-shadow interior. Which sequence is most reasonable before very dry scrub appears?",
    "answer": "Evergreen → moist deciduous → dry deciduous",
    "distractors": [
      "Mangrove → alpine → evergreen",
      "Thorn scrub → evergreen → tidal forest",
      "Alpine meadow → mangrove → deciduous"
    ],
    "explanation": "The rainfall gradient weakens from the windward coast toward the interior. Vegetation therefore becomes progressively more seasonal and open.",
    "sourceFactIds": [
      "WG-TRANSECT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-056",
    "qlName": "Northeast India humid vegetation",
    "difficulty": "Easy",
    "stem": "Which part of India is well known for extensive evergreen and semi-evergreen vegetation?",
    "answer": "Northeastern India",
    "distractors": [
      "Western Rajasthan",
      "Cold desert of Ladakh",
      "Interior rain-shadow Deccan"
    ],
    "explanation": "Large parts of northeastern India receive high rainfall and remain humid. These conditions support dense evergreen and semi-evergreen forests.",
    "sourceFactIds": [
      "NE-EVERGREEN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-056",
    "qlName": "Northeast India humid vegetation",
    "difficulty": "Easy",
    "stem": "Why is humid forest vegetation common in much of northeastern India?",
    "answer": "High rainfall combines with warm conditions at lower elevations",
    "distractors": [
      "Rainfall is extremely low",
      "The region is entirely above the tree line",
      "Tidal salinity covers all hills"
    ],
    "explanation": "Abundant monsoon rainfall and warmth provide strong growing conditions. Mountain height can modify the forest type locally, but moisture remains a major control.",
    "sourceFactIds": [
      "NE-HUMID-CLIMATE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-056",
    "qlName": "Northeast India humid vegetation",
    "difficulty": "Medium",
    "stem": "A warm valley in Assam receives heavy rainfall and has dense year-round green vegetation. Which forest type fits best?",
    "answer": "Tropical evergreen or semi-evergreen forest",
    "distractors": [
      "Thorn scrub",
      "Dry deciduous forest",
      "Alpine meadow"
    ],
    "explanation": "The warm, very wet setting favours evergreen or semi-evergreen vegetation. Thorn and dry deciduous forests need greater moisture stress.",
    "sourceFactIds": [
      "NE-VALLEY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-056",
    "qlName": "Northeast India humid vegetation",
    "difficulty": "Medium",
    "stem": "Why can vegetation in the Northeast change from tropical forest in valleys to temperate forest on high slopes?",
    "answer": "Altitude lowers temperature even within the same rainy region",
    "distractors": [
      "Rainfall becomes zero at every high slope",
      "Latitude changes from tropical to polar within one hill",
      "Tidal water reaches mountain summits"
    ],
    "explanation": "The region can remain moist while temperature falls sharply with elevation. This produces a vertical vegetation sequence on mountain slopes.",
    "sourceFactIds": [
      "NE-ALTITUDE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-056",
    "qlName": "Northeast India humid vegetation",
    "difficulty": "Medium",
    "stem": "Which regional clue most strongly points to humid evergreen vegetation?",
    "answer": "Heavy-rainfall hills and valleys of the Northeast",
    "distractors": [
      "Semi-arid plains of western Rajasthan",
      "Cold high-altitude Ladakh",
      "Dry interior parts of the Deccan Plateau"
    ],
    "explanation": "Evergreen vegetation requires abundant moisture. The Northeast provides far wetter conditions than the dry or cold alternatives.",
    "sourceFactIds": [
      "NE-REGIONAL-CLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-056",
    "qlName": "Northeast India humid vegetation",
    "difficulty": "Hard",
    "stem": "Two nearby northeastern sites receive heavy rainfall, but one low valley has tropical evergreen trees while a high ridge has temperate vegetation. Which factor explains the difference best?",
    "answer": "Elevation and temperature",
    "distractors": [
      "State boundary",
      "River length",
      "Distance from the Equator changes by thousands of kilometres"
    ],
    "explanation": "Rainfall can be high at both sites, so the key contrast is elevation. Cooler temperatures on the ridge favour temperate vegetation over tropical forest.",
    "sourceFactIds": [
      "NE-VALLEY-RIDGE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-057",
    "qlName": "Central and eastern deciduous belt",
    "difficulty": "Easy",
    "stem": "Which forest type is widespread across large parts of central India?",
    "answer": "Tropical deciduous forest",
    "distractors": [
      "Mangrove forest",
      "Alpine vegetation",
      "Tropical thorn scrub everywhere"
    ],
    "explanation": "Central India has a strongly seasonal monsoon climate. This supports extensive deciduous forests that shed leaves during the dry season.",
    "sourceFactIds": [
      "CENTRAL-DECIDUOUS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-057",
    "qlName": "Central and eastern deciduous belt",
    "difficulty": "Easy",
    "stem": "Which states are well known for broad deciduous forest belts?",
    "answer": "Madhya Pradesh, Chhattisgarh and Odisha",
    "distractors": [
      "Punjab, Haryana and western Rajasthan only",
      "Goa coast and Andaman Islands only",
      "Ladakh and high Himachal snowfields"
    ],
    "explanation": "Large parts of Madhya Pradesh, Chhattisgarh and Odisha lie in the tropical deciduous belt. Rainfall is seasonal rather than continuously wet.",
    "sourceFactIds": [
      "CENTRAL-DECIDUOUS-STATES"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-057",
    "qlName": "Central and eastern deciduous belt",
    "difficulty": "Medium",
    "stem": "Why are tropical deciduous forests extensive in central and eastern India?",
    "answer": "The region receives substantial but strongly seasonal monsoon rainfall",
    "distractors": [
      "The climate is permanently frozen",
      "Tidal flooding covers most of the plateau",
      "Rainfall remains above 300 cm everywhere"
    ],
    "explanation": "The monsoon provides enough rain for forest growth, but the dry season creates water stress. Trees respond by shedding leaves seasonally.",
    "sourceFactIds": [
      "CENTRAL-MONSOON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-057",
    "qlName": "Central and eastern deciduous belt",
    "difficulty": "Medium",
    "stem": "A plateau in Chhattisgarh has teak and sal with clear dry-season leaf fall. Which vegetation is indicated?",
    "answer": "Tropical deciduous forest",
    "distractors": [
      "Tropical evergreen forest",
      "Thorn scrub only",
      "Mangrove swamp"
    ],
    "explanation": "Teak, sal and seasonal leaf fall are strong deciduous clues. The plateau setting is also consistent with central India's monsoon forest belt.",
    "sourceFactIds": [
      "CENTRAL-SPECIES"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-057",
    "qlName": "Central and eastern deciduous belt",
    "difficulty": "Medium",
    "stem": "Which change from eastern humid areas toward drier central interiors can be expected?",
    "answer": "Moist deciduous forest may grade into dry deciduous forest",
    "distractors": [
      "Mangrove forest becomes alpine vegetation",
      "Evergreen forest becomes denser as rainfall falls",
      "Thorn scrub changes into tidal forest"
    ],
    "explanation": "As rainfall decreases and the dry season strengthens, deciduous vegetation becomes more open. The shift from moist to dry deciduous is gradual.",
    "sourceFactIds": [
      "CENTRAL-MOIST-DRY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-057",
    "qlName": "Central and eastern deciduous belt",
    "difficulty": "Hard",
    "stem": "Region A in eastern India gets about 160 cm of rain and Region B farther inland gets about 80 cm, with similar tropical temperatures. Which forest contrast is plausible?",
    "answer": "A moist deciduous; B dry deciduous",
    "distractors": [
      "A thorn scrub; B evergreen",
      "Both alpine",
      "A mangrove; B tidal evergreen"
    ],
    "explanation": "Both sites can support deciduous vegetation, but the wetter site supports denser moist deciduous forest. The drier inland site fits dry deciduous conditions.",
    "sourceFactIds": [
      "CENTRAL-RAINFALL-COMPARE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-058",
    "qlName": "Northwestern thorn and scrub belt",
    "difficulty": "Easy",
    "stem": "Which vegetation is characteristic of western Rajasthan?",
    "answer": "Tropical thorn forest and scrub",
    "distractors": [
      "Tropical evergreen forest",
      "Montane conifer forest",
      "Mangrove forest"
    ],
    "explanation": "Western Rajasthan receives scanty rainfall and has high evaporation. Drought-resistant thorn and scrub vegetation is therefore common.",
    "sourceFactIds": [
      "NW-THORN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-058",
    "qlName": "Northwestern thorn and scrub belt",
    "difficulty": "Easy",
    "stem": "Which neighbouring region also contains dry thorn and scrub vegetation?",
    "answer": "Parts of Gujarat and Haryana",
    "distractors": [
      "Wettest parts of Meghalaya",
      "Andaman tidal forests",
      "High Himalayan alpine zone"
    ],
    "explanation": "Semi-arid parts of Gujarat and Haryana share low-moisture conditions with the wider northwestern dry belt. Thorny vegetation can extend across these areas.",
    "sourceFactIds": [
      "NW-GUJARAT-HARYANA"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-058",
    "qlName": "Northwestern thorn and scrub belt",
    "difficulty": "Medium",
    "stem": "Why does vegetation in northwestern India differ sharply from that of the Northeast?",
    "answer": "The northwest receives much less rainfall",
    "distractors": [
      "The northwest lies above the tree line everywhere",
      "The Northeast is entirely tidal",
      "Temperature alone makes the regions identical"
    ],
    "explanation": "Moisture availability is the clearest contrast. The Northeast is humid, while the northwest is dry to semi-arid and supports thorn vegetation.",
    "sourceFactIds": [
      "NW-VS-NE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-058",
    "qlName": "Northwestern thorn and scrub belt",
    "difficulty": "Medium",
    "stem": "A semi-arid plain has acacia, euphorbia and open scrub. Which regional setting fits best?",
    "answer": "Northwestern dry belt",
    "distractors": [
      "Windward Western Ghats",
      "Lower Brahmaputra valley",
      "High Himalayan conifer belt"
    ],
    "explanation": "Acacia and euphorbia are drought-adapted plants typical of low-rainfall landscapes. The open scrub structure fits northwestern semi-arid conditions.",
    "sourceFactIds": [
      "NW-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-058",
    "qlName": "Northwestern thorn and scrub belt",
    "difficulty": "Medium",
    "stem": "Which physical condition most strongly supports thorn vegetation in the northwest?",
    "answer": "Low effective moisture because rainfall is scanty and evaporation is high",
    "distractors": [
      "Persistent tidal waterlogging",
      "Very high rainfall throughout the year",
      "Permanent snow cover"
    ],
    "explanation": "Plants face chronic water shortage because little rainfall is available and heat increases evaporation. Drought-resistant shrubs and scattered trees are favoured.",
    "sourceFactIds": [
      "NW-MOISTURE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-058",
    "qlName": "Northwestern thorn and scrub belt",
    "difficulty": "Hard",
    "stem": "A map shows open thorn scrub in western Rajasthan but dry deciduous woodland farther east. What change most reasonably explains the transition?",
    "answer": "Effective moisture increases eastward",
    "distractors": [
      "Altitude rises above the alpine tree line",
      "Tidal salinity spreads inland",
      "Rainfall decreases sharply eastward"
    ],
    "explanation": "Moving into somewhat wetter areas can support more continuous tree cover. Thorn scrub gives way to dry deciduous woodland as water availability improves.",
    "sourceFactIds": [
      "NW-EASTWARD-TRANSITION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-059",
    "qlName": "Himalayan regional vegetation",
    "difficulty": "Easy",
    "stem": "What pattern best characterizes natural vegetation in the Himalayas?",
    "answer": "Vegetation changes in belts with altitude",
    "distractors": [
      "One forest type covers all elevations",
      "Mangroves extend from valleys to peaks",
      "Thorn scrub dominates every slope"
    ],
    "explanation": "Mountain climate changes strongly with height. This produces subtropical, temperate and alpine vegetation belts at different elevations.",
    "sourceFactIds": [
      "HIMALAYAN-BELTS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-059",
    "qlName": "Himalayan regional vegetation",
    "difficulty": "Easy",
    "stem": "Which vegetation is expected above the main temperate conifer belt?",
    "answer": "Alpine shrubs and grasslands",
    "distractors": [
      "Tropical evergreen forest",
      "Mangrove forest",
      "Dry deciduous lowland forest"
    ],
    "explanation": "At very high elevations, temperatures become too low for tall forest. Alpine shrubs, grasses and later sparse mosses and lichens replace conifers.",
    "sourceFactIds": [
      "HIMALAYAN-ABOVE-CONIFER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-059",
    "qlName": "Himalayan regional vegetation",
    "difficulty": "Medium",
    "stem": "A Himalayan slope has oak at lower temperate elevations and deodar higher up. What controls this regional pattern?",
    "answer": "Cooling with altitude",
    "distractors": [
      "Tidal flooding",
      "Desert salinity",
      "Ocean currents alone"
    ],
    "explanation": "Elevation lowers temperature and changes the suitability of tree species. Broadleaf temperate forest gives way to colder-climate conifers higher on the slope.",
    "sourceFactIds": [
      "HIMALAYAN-OAK-DEODAR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-059",
    "qlName": "Himalayan regional vegetation",
    "difficulty": "Medium",
    "stem": "Which regional clue points most strongly to temperate conifer vegetation?",
    "answer": "Middle Himalayan elevations with deodar, fir and spruce",
    "distractors": [
      "Ganga delta with tidal creeks",
      "Western Rajasthan with cactus",
      "Windward Western Ghats at low altitude with ebony"
    ],
    "explanation": "Deodar, fir and spruce are classic Himalayan conifers. Their presence at middle elevations identifies a temperate mountain forest belt.",
    "sourceFactIds": [
      "HIMALAYAN-CONIFER-CLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-059",
    "qlName": "Himalayan regional vegetation",
    "difficulty": "Medium",
    "stem": "Why does the Himalayan vegetation map show vertical rather than simple east–west forest belts in many places?",
    "answer": "Rapid climatic change with elevation creates altitudinal zones",
    "distractors": [
      "State boundaries create forest belts",
      "Tides rise up mountain slopes",
      "Latitude is identical at all heights"
    ],
    "explanation": "Relief creates large temperature differences over short horizontal distances. As a result, vegetation can change quickly with height.",
    "sourceFactIds": [
      "HIMALAYAN-VERTICAL"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-059",
    "qlName": "Himalayan regional vegetation",
    "difficulty": "Hard",
    "stem": "A mountain route moves from subtropical forest through oak, then conifers, then alpine grassland. Which single process organizes the entire sequence?",
    "answer": "Increasing altitude and falling temperature",
    "distractors": [
      "Increasing tidal salinity",
      "Decreasing latitude toward the Equator",
      "Increasing desert dryness at every step"
    ],
    "explanation": "The route climbs through progressively cooler climatic zones. Each vegetation belt reflects the temperature and growing conditions of its elevation.",
    "sourceFactIds": [
      "HIMALAYAN-ROUTE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-060",
    "qlName": "Delta and coastal mangrove regions",
    "difficulty": "Easy",
    "stem": "Which Indian region is the best-known mangrove area?",
    "answer": "Sundarbans",
    "distractors": [
      "Malwa Plateau",
      "Ladakh plateau",
      "Aravalli uplands"
    ],
    "explanation": "The Sundarbans occupy the tidal Ganga–Brahmaputra delta and contain extensive mangrove forest. Sundari trees are a well-known feature.",
    "sourceFactIds": [
      "DELTA-SUNDARBANS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-060",
    "qlName": "Delta and coastal mangrove regions",
    "difficulty": "Easy",
    "stem": "Which coast contains several large river deltas with mangrove vegetation?",
    "answer": "Eastern coast of India",
    "distractors": [
      "High Himalayan interior",
      "Western Rajasthan desert belt",
      "Central plateau uplands only"
    ],
    "explanation": "Major rivers such as the Mahanadi, Godavari, Krishna and Kaveri form east-coast deltas. Their tidal parts support mangrove vegetation.",
    "sourceFactIds": [
      "EAST-COAST-DELTAS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-060",
    "qlName": "Delta and coastal mangrove regions",
    "difficulty": "Medium",
    "stem": "Which regional set fits mangrove distribution?",
    "answer": "Sundarbans, Godavari delta and Andaman–Nicobar coasts",
    "distractors": [
      "Thar Desert, Ladakh and Malwa",
      "Western Himalayan conifer belt, Punjab plain and Rajasthan",
      "Aravalli uplands, Deccan rain shadow and alpine meadows"
    ],
    "explanation": "All three locations in the first set have suitable tidal coastal environments. The other groups contain dry inland or high-altitude landscapes.",
    "sourceFactIds": [
      "MANGROVE-DISTRIBUTION-SET"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-060",
    "qlName": "Delta and coastal mangrove regions",
    "difficulty": "Medium",
    "stem": "Why are broad east-coast deltas more favourable to mangroves than steep rocky mountain coasts?",
    "answer": "They provide low-lying muddy intertidal surfaces",
    "distractors": [
      "They are always colder",
      "They receive no river sediment",
      "They lie above the tree line"
    ],
    "explanation": "Deltas accumulate fine sediment and contain tidal creeks and mudflats. These surfaces provide the waterlogged rooting habitat mangroves need.",
    "sourceFactIds": [
      "DELTA-VS-ROCKY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-060",
    "qlName": "Delta and coastal mangrove regions",
    "difficulty": "Medium",
    "stem": "Which river-mouth clue should make a student think of mangrove vegetation first?",
    "answer": "Tidal mudflat with brackish channels",
    "distractors": [
      "Dry gravel terrace far inland",
      "Snow-covered pass",
      "Semi-arid plateau with cactus"
    ],
    "explanation": "Tidal mud and brackish water are direct mangrove habitat clues. They indicate an estuarine or deltaic coastal wetland.",
    "sourceFactIds": [
      "RIVER-MOUTH-MANGROVE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-060",
    "qlName": "Delta and coastal mangrove regions",
    "difficulty": "Hard",
    "stem": "Two river mouths reach the sea: one forms a wide silty tidal delta and the other enters through a steep rocky estuary. Which is more likely to support extensive mangroves?",
    "answer": "The wide silty tidal delta",
    "distractors": [
      "The steep rocky estuary in every case",
      "Both equally, because landform does not matter",
      "Neither, because mangroves cannot grow near rivers"
    ],
    "explanation": "Mangroves establish best where fine sediment accumulates in sheltered intertidal areas. A broad silty delta provides more of that habitat.",
    "sourceFactIds": [
      "DELTA-LANDFORM"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-061",
    "qlName": "Andaman and Nicobar vegetation",
    "difficulty": "Easy",
    "stem": "Which Indian island group contains tropical evergreen forests as well as mangroves?",
    "answer": "Andaman and Nicobar Islands",
    "distractors": [
      "Lakshadweep highlands",
      "Ladakh islands",
      "Interior Deccan plateau"
    ],
    "explanation": "The Andaman and Nicobar Islands have humid tropical interiors and suitable tidal coasts. This allows evergreen forest and mangrove vegetation to occur in different settings.",
    "sourceFactIds": [
      "ANDAMAN-MULTI-VEG"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-061",
    "qlName": "Andaman and Nicobar vegetation",
    "difficulty": "Easy",
    "stem": "What condition supports tropical evergreen vegetation in the Andaman and Nicobar Islands?",
    "answer": "Warm humid climate with abundant rainfall",
    "distractors": [
      "Permanent alpine frost",
      "Very low annual rainfall",
      "Cold desert conditions"
    ],
    "explanation": "The islands have a maritime tropical climate with warmth and abundant moisture. These conditions support dense evergreen vegetation.",
    "sourceFactIds": [
      "ANDAMAN-EVERGREEN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-061",
    "qlName": "Andaman and Nicobar vegetation",
    "difficulty": "Medium",
    "stem": "Why can the same island group contain evergreen forest inland and mangroves along some shores?",
    "answer": "Different landforms and water conditions create different habitats",
    "distractors": [
      "One forest type must cover the entire island",
      "Mangroves require high mountain peaks",
      "Evergreen forest requires tidal salinity"
    ],
    "explanation": "Humid uplands can support evergreen forest while sheltered tidal creeks support mangroves. Local physical setting changes the vegetation even within one region.",
    "sourceFactIds": [
      "ANDAMAN-HABITAT-CONTRAST"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-061",
    "qlName": "Andaman and Nicobar vegetation",
    "difficulty": "Medium",
    "stem": "A sheltered Andaman creek has brackish mud, while a nearby inland slope is humid and well drained. Which vegetation pair fits?",
    "answer": "Mangrove at the creek; evergreen forest inland",
    "distractors": [
      "Alpine meadow at the creek; thorn scrub inland",
      "Thorn scrub at the creek; mangrove inland",
      "Conifer forest at both sites"
    ],
    "explanation": "The creek has the tidal, waterlogged conditions required by mangroves. The humid inland slope fits tropical evergreen vegetation.",
    "sourceFactIds": [
      "ANDAMAN-CREEK-INLAND"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-061",
    "qlName": "Andaman and Nicobar vegetation",
    "difficulty": "Medium",
    "stem": "Which statement best explains the vegetation diversity of the Andaman and Nicobar Islands?",
    "answer": "Tropical moisture combines with varied coastal and inland habitats",
    "distractors": [
      "The islands are entirely arid",
      "All vegetation is controlled by snowfall",
      "Only one soil and landform occurs everywhere"
    ],
    "explanation": "Climate provides abundant moisture, while topography and coastal conditions create different ecological settings. This supports more than one tropical vegetation type.",
    "sourceFactIds": [
      "ANDAMAN-DIVERSITY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-061",
    "qlName": "Andaman and Nicobar vegetation",
    "difficulty": "Medium",
    "stem": "Which regional clue is strongest for identifying Andaman–Nicobar vegetation?",
    "answer": "Humid tropical islands with evergreen interiors and mangrove coasts",
    "distractors": [
      "Cold high mountains with conifers only",
      "Semi-arid plains with thorn scrub",
      "Dry plateau with seasonal teak forest only"
    ],
    "explanation": "The combination of tropical humidity and tidal island coasts distinguishes the island group. Evergreen and mangrove vegetation can both occur there.",
    "sourceFactIds": [
      "ANDAMAN-REGIONAL-CLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-062",
    "qlName": "Rainfall and regional forest matching",
    "difficulty": "Easy",
    "stem": "Which region–forest match is correct?",
    "answer": "Western Rajasthan — thorn forest and scrub",
    "distractors": [
      "Windward Western Ghats — thorn scrub",
      "Sundarbans — temperate conifer forest",
      "High Himalayas — mangrove forest"
    ],
    "explanation": "Western Rajasthan has low rainfall and semi-arid conditions that favour thorn vegetation. The other pairings place forests in unsuitable environments.",
    "sourceFactIds": [
      "REGION-FOREST-THORN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-062",
    "qlName": "Rainfall and regional forest matching",
    "difficulty": "Easy",
    "stem": "Which region–forest match is correct for a high-rainfall area?",
    "answer": "Windward Western Ghats — tropical evergreen forest",
    "distractors": [
      "Western Rajasthan — tropical evergreen forest",
      "Ladakh — tropical evergreen forest",
      "Interior rain-shadow Deccan — mangrove forest"
    ],
    "explanation": "The windward Western Ghats receive very heavy monsoon rainfall and support evergreen forest. The alternative regions are much drier or high-altitude.",
    "sourceFactIds": [
      "REGION-FOREST-EVERGREEN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-062",
    "qlName": "Rainfall and regional forest matching",
    "difficulty": "Medium",
    "stem": "Which sequence matches regions from wetter to drier tropical conditions?",
    "answer": "Windward Western Ghats → central deciduous belt → western Rajasthan",
    "distractors": [
      "Western Rajasthan → Sundarbans → alpine Himalaya",
      "Ladakh → Andaman Islands → Western Ghats",
      "Sundarbans → alpine meadow → thorn scrub"
    ],
    "explanation": "The windward Ghats are very wet, central India has seasonal monsoon rainfall, and western Rajasthan is semi-arid. Their vegetation becomes progressively more drought-adapted.",
    "sourceFactIds": [
      "REGIONAL-MOISTURE-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-062",
    "qlName": "Rainfall and regional forest matching",
    "difficulty": "Medium",
    "stem": "A map point lies in central India with seasonal rainfall and teak forest. Which vegetation category fits?",
    "answer": "Tropical deciduous forest",
    "distractors": [
      "Tropical evergreen forest",
      "Mangrove forest",
      "Alpine vegetation"
    ],
    "explanation": "Seasonal monsoon rainfall and teak strongly indicate deciduous vegetation. Central India contains extensive moist and dry deciduous forest belts.",
    "sourceFactIds": [
      "CENTRAL-MAP-POINT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-062",
    "qlName": "Rainfall and regional forest matching",
    "difficulty": "Medium",
    "stem": "A map point lies in the Ganga–Brahmaputra delta and is crossed by tidal channels. Which vegetation should be marked?",
    "answer": "Mangrove forest",
    "distractors": [
      "Thorn scrub",
      "Temperate broadleaf forest",
      "Alpine grassland"
    ],
    "explanation": "The deltaic landform and tidal channels are direct mangrove clues. The Sundarbans occupy this lower delta region.",
    "sourceFactIds": [
      "DELTA-MAP-POINT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-062",
    "qlName": "Rainfall and regional forest matching",
    "difficulty": "Medium",
    "stem": "A map point is on a high Himalayan slope above the conifer zone. Which vegetation is most likely?",
    "answer": "Alpine shrubs and grasslands",
    "distractors": [
      "Tropical evergreen forest",
      "Dry deciduous forest",
      "Mangrove forest"
    ],
    "explanation": "Above the main tree line, cold conditions restrict forest growth. Alpine shrubs and grasses become the dominant vegetation.",
    "sourceFactIds": [
      "HIMALAYAN-MAP-POINT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-063",
    "qlName": "India vegetation integrated mapping",
    "difficulty": "Easy",
    "stem": "Which set correctly links three Indian regions with their typical vegetation?",
    "answer": "Western Ghats–evergreen; central India–deciduous; western Rajasthan–thorn",
    "distractors": [
      "Western Ghats–thorn; central India–mangrove; Rajasthan–alpine",
      "Western Ghats–alpine; central India–evergreen; Rajasthan–mangrove",
      "Western Ghats–mangrove only; central India–alpine; Rajasthan–evergreen"
    ],
    "explanation": "The three regions form a useful rainfall-based contrast. Very wet Ghats support evergreen, seasonal central India supports deciduous, and dry Rajasthan supports thorn vegetation.",
    "sourceFactIds": [
      "INDIA-THREE-REGIONS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-063",
    "qlName": "India vegetation integrated mapping",
    "difficulty": "Easy",
    "stem": "Which set correctly matches a mountain, delta and island region?",
    "answer": "Himalayas–montane; Sundarbans–mangrove; Andaman–evergreen and mangrove",
    "distractors": [
      "Himalayas–mangrove; Sundarbans–alpine; Andaman–thorn",
      "Himalayas–thorn; Sundarbans–conifer; Andaman–alpine",
      "Himalayas–evergreen only; Sundarbans–thorn; Andaman–dry deciduous only"
    ],
    "explanation": "Each region has a distinctive physical setting. Altitude controls Himalayan vegetation, tides control the Sundarbans, and humid tropical island conditions support evergreen and mangrove forests in the Andamans.",
    "sourceFactIds": [
      "INDIA-MOUNTAIN-DELTA-ISLAND"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-063",
    "qlName": "India vegetation integrated mapping",
    "difficulty": "Medium",
    "stem": "A question gives four clues: heavy orographic rain, windward slope, dense canopy and ebony. Which Indian region is most likely?",
    "answer": "Western Ghats evergreen belt",
    "distractors": [
      "Western Rajasthan thorn belt",
      "High Himalayan conifer belt",
      "Central dry deciduous plateau"
    ],
    "explanation": "Heavy windward rainfall and evergreen hardwoods point to the wet Western Ghats. The other regions are drier or colder.",
    "sourceFactIds": [
      "INDIA-WG-MULTICLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-063",
    "qlName": "India vegetation integrated mapping",
    "difficulty": "Medium",
    "stem": "A question gives acacia, scanty rainfall and open scrub. Which region is the strongest fit?",
    "answer": "Western Rajasthan and adjoining semi-arid northwest",
    "distractors": [
      "Lower Assam valley",
      "Windward Western Ghats",
      "Sundarbans delta"
    ],
    "explanation": "Acacia, low rainfall and open scrub indicate thorn vegetation. The northwestern semi-arid belt provides the best regional match.",
    "sourceFactIds": [
      "INDIA-NW-MULTICLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-063",
    "qlName": "India vegetation integrated mapping",
    "difficulty": "Medium",
    "stem": "A question gives deodar, cooler temperatures and a middle mountain slope. Which region is indicated?",
    "answer": "Himalayan temperate belt",
    "distractors": [
      "Ganga delta",
      "Western Rajasthan",
      "Andaman coast"
    ],
    "explanation": "Deodar is a Himalayan conifer and grows in cool middle-elevation forests. The physical and species clues point to the temperate mountain belt.",
    "sourceFactIds": [
      "INDIA-HIMALAYA-MULTICLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-063",
    "qlName": "India vegetation integrated mapping",
    "difficulty": "Medium",
    "stem": "Which principle is most useful when solving Indian vegetation map questions?",
    "answer": "Combine rainfall, altitude, tidal setting and characteristic species rather than relying on one clue",
    "distractors": [
      "Use state boundaries alone",
      "Use only latitude and ignore relief",
      "Assume every wet area is mangrove forest"
    ],
    "explanation": "Indian vegetation reflects several environmental controls at once. Combining climate, relief, coastal setting and species produces a more reliable identification.",
    "sourceFactIds": [
      "INDIA-MAP-PRINCIPLE"
    ]
  }
]);
export const GEO_VEG_001_CP007_REVIEW_BATCH_V1:readonly GeoVeg001Question[]=Object.freeze(RAW.map((raw,index)=>{const correctIndex=index%4;return Object.freeze({questionId:`GEO-VEG-001-CP007-Q${String(index+1).padStart(3,"0")}`,qlId:raw.qlId,qlName:raw.qlName,difficulty:raw.difficulty,stem:raw.stem,options:placeGeoVegOptions(raw.answer,raw.distractors,correctIndex),correctIndex,canonicalAnswer:raw.answer,explanation:raw.explanation,sourceIds:GEO_VEG_001_SOURCE_IDS,sourceFactIds:Object.freeze([...raw.sourceFactIds]),reviewOnly:true as const,runtimeRegistered:false as const});}));
const BANNED=/associated with|described as|in the context of|\bbroadly\b|\bmainly\b|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR=/currency|population census|political boundary|time zone|magnetic declination|crop price|road density|literacy|mineral price|calendar month|map projection/i;
export function auditGeoVeg001Cp007ReviewBatchV1(){const issues:string[]=[];const ids=new Set<string>();const stems=new Set<string>();const explanations=new Set<string>();const qlCounts:Record<string,number>={};const difficultyCounts:Record<GeoVeg001Difficulty,number>={Easy:0,Medium:0,Hard:0};const answerPositions=[0,0,0,0];
for(const q of GEO_VEG_001_CP007_REVIEW_BATCH_V1){if(ids.has(q.questionId))issues.push("DUPLICATE_ID:"+q.questionId);ids.add(q.questionId);const st=q.stem.replace(/\s+/g," ").trim().toLowerCase();if(stems.has(st))issues.push("DUPLICATE_STEM:"+q.questionId);stems.add(st);const ex=q.explanation.replace(/\s+/g," ").trim().toLowerCase();if(explanations.has(ex))issues.push("DUPLICATE_EXPLANATION:"+q.questionId);explanations.add(ex);qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]+=1;answerPositions[q.correctIndex]+=1;if(q.options.length!==4||new Set(q.options).size!==4)issues.push("OPTIONS:"+q.questionId);if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push("ANSWER:"+q.questionId);const ds=q.options.filter((_,i)=>i!==q.correctIndex);if(ds.some(o=>TRIVIAL_DISTRACTOR.test(o)))issues.push("TRIVIAL_DISTRACTOR:"+q.questionId);if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push("PROVENANCE:"+q.questionId);if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);const learner=q.stem+"\n"+q.options.join("\n")+"\n"+q.explanation;if(BANNED.test(learner))issues.push("STYLE:"+q.questionId);if(q.stem.length<22||q.stem.length>360||!q.stem.trim().endsWith("?"))issues.push("STEM_SHAPE:"+q.questionId);if(q.explanation.length<110)issues.push("SHORT_EXPLANATION:"+q.questionId);}
if(GEO_VEG_001_CP007_REVIEW_BATCH_V1.length!==54)issues.push("COUNT:"+GEO_VEG_001_CP007_REVIEW_BATCH_V1.length);for(let n=55;n<=63;n++){const id="GEO-VEG-001-QL-"+String(n).padStart(3,"0");if(qlCounts[id]!==6)issues.push("QL_COUNT:"+id+":"+(qlCounts[id]??0));}if(difficultyCounts.Easy!==18||difficultyCounts.Medium!==30||difficultyCounts.Hard!==6)issues.push("DIFFICULTY:"+JSON.stringify(difficultyCounts));if(answerPositions.join(",")!=="14,14,13,13")issues.push("ANSWER_POSITIONS:"+answerPositions.join(","));if(stems.size!==54)issues.push("STEM_COUNT:"+stems.size);if(explanations.size!==54)issues.push("EXPLANATION_COUNT:"+explanations.size);return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_VEG_001_CP007_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});}
