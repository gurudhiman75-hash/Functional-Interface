import {
  GEO_VEG_001_SOURCE_IDS,
  placeGeoVegOptions,
  type GeoVeg001Difficulty,
  type GeoVeg001Question,
} from "./geo-veg-001-review-types";
type RawQuestion=Readonly<{qlId:string;qlName:string;difficulty:GeoVeg001Difficulty;stem:string;answer:string;distractors:readonly string[];explanation:string;sourceFactIds:readonly string[]}>;
const RAW:readonly RawQuestion[]=Object.freeze([
  {
    "qlId": "GEO-VEG-001-QL-046",
    "qlName": "Mangrove and tidal forest conditions",
    "difficulty": "Easy",
    "stem": "Mangrove forests in India are best developed in which environment?",
    "answer": "Tidal coasts and river deltas",
    "distractors": [
      "High alpine slopes",
      "Interior dry plateaus",
      "Cold desert basins"
    ],
    "explanation": "Mangroves grow where land and sea interact under tidal influence. River deltas and sheltered coasts provide muddy, waterlogged conditions suitable for these forests.",
    "sourceFactIds": [
      "MANGROVE-TIDAL-DELTA"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-046",
    "qlName": "Mangrove and tidal forest conditions",
    "difficulty": "Easy",
    "stem": "What type of water is common in mangrove habitats?",
    "answer": "Saline or brackish water",
    "distractors": [
      "Only fresh mountain snowmelt",
      "Completely dry soil water",
      "Deep groundwater with no tidal influence"
    ],
    "explanation": "Mangrove habitats often contain a mixture of seawater and river water. Plants there must tolerate salinity as well as waterlogged soil.",
    "sourceFactIds": [
      "MANGROVE-BRACKISH"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-046",
    "qlName": "Mangrove and tidal forest conditions",
    "difficulty": "Medium",
    "stem": "Why are river deltas especially favourable for mangrove forests?",
    "answer": "Tides, fine sediment and waterlogging create suitable coastal wetland conditions",
    "distractors": [
      "The land is permanently dry and sandy",
      "Temperatures remain below freezing",
      "River water removes all salinity from the coast"
    ],
    "explanation": "Deltas receive fine silt and are repeatedly influenced by tides. The resulting muddy, waterlogged and often brackish environment supports mangrove vegetation.",
    "sourceFactIds": [
      "MANGROVE-DELTA-REASON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-046",
    "qlName": "Mangrove and tidal forest conditions",
    "difficulty": "Medium",
    "stem": "A low-lying coast is flooded by tides and has muddy saline soil. Which natural vegetation is most likely?",
    "answer": "Mangrove forest",
    "distractors": [
      "Tropical thorn scrub",
      "Temperate conifer forest",
      "Alpine grassland"
    ],
    "explanation": "Tidal flooding, mud and salinity form the classic mangrove setting. The other vegetation types develop under dry or high-altitude conditions.",
    "sourceFactIds": [
      "MANGROVE-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-046",
    "qlName": "Mangrove and tidal forest conditions",
    "difficulty": "Medium",
    "stem": "Which physical process helps build many mangrove habitats at river mouths?",
    "answer": "Deposition of fine river-borne sediment",
    "distractors": [
      "Glacial erosion above the snow line",
      "Wind erosion in hot deserts",
      "Formation of lava plateaus"
    ],
    "explanation": "Rivers deposit fine silt as they enter quieter coastal waters. This creates muddy deltaic surfaces where mangrove plants can establish.",
    "sourceFactIds": [
      "MANGROVE-SEDIMENT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-046",
    "qlName": "Mangrove and tidal forest conditions",
    "difficulty": "Hard",
    "stem": "Two tropical coasts receive similar rainfall. Coast A is a sheltered muddy delta with tidal flooding, while Coast B is a steep rocky shore. Why is mangrove forest more likely at Coast A?",
    "answer": "Mangroves need intertidal muddy or silty surfaces where roots can anchor in waterlogged sediment",
    "distractors": [
      "Mangroves grow only where cliffs are steep",
      "Rainfall alone determines all coastal vegetation",
      "Rocky shores always have deeper deltaic silt"
    ],
    "explanation": "Rainfall is not enough to explain mangrove distribution. The sheltered intertidal sediment of a delta provides the waterlogged rooting environment mangroves require.",
    "sourceFactIds": [
      "MANGROVE-COAST-COMPARE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-047",
    "qlName": "Mangrove root adaptations",
    "difficulty": "Easy",
    "stem": "What is the main purpose of breathing roots in many mangrove plants?",
    "answer": "They help obtain oxygen from waterlogged soil",
    "distractors": [
      "They store snow for winter",
      "They increase leaf area",
      "They prevent tidal water from reaching the coast"
    ],
    "explanation": "Waterlogged mangrove mud contains little air. Breathing roots rise above the surface and allow gas exchange with the atmosphere.",
    "sourceFactIds": [
      "MANGROVE-BREATHING-ROOTS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-047",
    "qlName": "Mangrove root adaptations",
    "difficulty": "Easy",
    "stem": "Why do some mangrove roots grow upward out of the mud?",
    "answer": "To take in oxygen",
    "distractors": [
      "To reach colder air",
      "To capture desert sand",
      "To avoid all contact with water"
    ],
    "explanation": "Oxygen is limited in saturated coastal mud. Upward-growing aerial roots expose tissues to the air and help the plant respire.",
    "sourceFactIds": [
      "MANGROVE-UPWARD-ROOTS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-047",
    "qlName": "Mangrove root adaptations",
    "difficulty": "Medium",
    "stem": "A tree has roots projecting above tidal mud around its trunk. Which adaptation is being shown?",
    "answer": "Pneumatophores or breathing roots",
    "distractors": [
      "Deep desert tap roots",
      "Alpine needle leaves",
      "Deciduous leaf fall"
    ],
    "explanation": "Pneumatophores are specialized aerial roots found in many mangrove environments. They improve oxygen intake when the soil remains flooded and poorly aerated.",
    "sourceFactIds": [
      "MANGROVE-PNEUMATOPHORE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-047",
    "qlName": "Mangrove root adaptations",
    "difficulty": "Medium",
    "stem": "Why is ordinary underground root respiration difficult in a mangrove swamp?",
    "answer": "Waterlogged mud has very little available oxygen",
    "distractors": [
      "The soil is always frozen solid",
      "The soil contains no water",
      "The roots receive too much mountain air"
    ],
    "explanation": "Saturated mud fills soil pores with water and reduces air spaces. Mangrove root adaptations compensate for this shortage of oxygen.",
    "sourceFactIds": [
      "MANGROVE-LOW-OXYGEN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-047",
    "qlName": "Mangrove root adaptations",
    "difficulty": "Medium",
    "stem": "Which adaptation most clearly separates mangrove trees from typical dry thorn plants?",
    "answer": "Aerial breathing roots",
    "distractors": [
      "Reduced leaf area",
      "Deep roots for scarce water",
      "Thorns that reduce grazing"
    ],
    "explanation": "Mangroves face waterlogging and poor soil aeration rather than simple drought. Aerial breathing roots address this wet-soil problem directly.",
    "sourceFactIds": [
      "MANGROVE-VS-THORN-ROOT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-047",
    "qlName": "Mangrove root adaptations",
    "difficulty": "Hard",
    "stem": "A coastal tree grows in salty mud, receives abundant water and still develops roots above the soil surface. What problem are these roots primarily solving?",
    "answer": "Lack of oxygen in waterlogged sediment",
    "distractors": [
      "Lack of liquid water",
      "Permanent freezing of the root zone",
      "Excessive dryness of the upper soil"
    ],
    "explanation": "The plant is not short of water; its main root-zone problem is poor aeration. Breathing roots provide access to atmospheric oxygen above the flooded mud.",
    "sourceFactIds": [
      "MANGROVE-ROOT-REASONING"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-048",
    "qlName": "Sundari and the Sundarbans",
    "difficulty": "Easy",
    "stem": "Which tree gives the Sundarbans their name?",
    "answer": "Sundari",
    "distractors": [
      "Deodar",
      "Teak",
      "Babool"
    ],
    "explanation": "Sundari is a characteristic mangrove tree of the Ganga–Brahmaputra delta. The Sundarbans derive their name from this tree.",
    "sourceFactIds": [
      "SUNDARI-NAME"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-048",
    "qlName": "Sundari and the Sundarbans",
    "difficulty": "Easy",
    "stem": "The Sundarbans are part of which major delta?",
    "answer": "Ganga–Brahmaputra delta",
    "distractors": [
      "Narmada estuary only",
      "Luni basin",
      "Upper Indus mountain valley"
    ],
    "explanation": "The Sundarbans occupy the lower Ganga–Brahmaputra delta along the Bay of Bengal. Extensive tidal creeks and muddy islands support mangrove forest.",
    "sourceFactIds": [
      "SUNDARBANS-DELTA"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-048",
    "qlName": "Sundari and the Sundarbans",
    "difficulty": "Medium",
    "stem": "Which vegetation type dominates much of the Sundarbans?",
    "answer": "Mangrove or tidal forest",
    "distractors": [
      "Tropical thorn scrub",
      "Alpine meadow",
      "Temperate conifer forest"
    ],
    "explanation": "The Sundarbans are a low-lying tidal delta with brackish channels and muddy sediment. These conditions favour mangrove vegetation.",
    "sourceFactIds": [
      "SUNDARBANS-VEGETATION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-048",
    "qlName": "Sundari and the Sundarbans",
    "difficulty": "Medium",
    "stem": "Why is the Sundarbans landscape suitable for Sundari and other mangrove trees?",
    "answer": "It is a tidal delta with waterlogged saline or brackish mud",
    "distractors": [
      "It is a cold high-altitude valley",
      "It receives very little water and has desert soil",
      "It lies above the Himalayan tree line"
    ],
    "explanation": "Tidal flooding, fine sediment and brackish water create a classic mangrove habitat. Sundari is adapted to these coastal delta conditions.",
    "sourceFactIds": [
      "SUNDARI-HABITAT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-048",
    "qlName": "Sundari and the Sundarbans",
    "difficulty": "Medium",
    "stem": "Which region–tree pair is correct for Indian mangrove vegetation?",
    "answer": "Sundarbans — Sundari",
    "distractors": [
      "Western Himalaya — Sundari",
      "Thar Desert — Sundari",
      "Deccan rain shadow — Sundari"
    ],
    "explanation": "Sundari is characteristic of the Sundarbans mangrove region. The other locations have montane, thorn or dry deciduous vegetation instead.",
    "sourceFactIds": [
      "SUNDARI-PAIR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-048",
    "qlName": "Sundari and the Sundarbans",
    "difficulty": "Hard",
    "stem": "A question gives three clues: Ganga–Brahmaputra delta, tidal creeks and Sundari trees. Which conclusion follows most directly?",
    "answer": "The area is part of the Sundarbans mangrove ecosystem",
    "distractors": [
      "The area is an alpine forest belt",
      "The area is tropical thorn scrub",
      "The area is a temperate conifer zone"
    ],
    "explanation": "All three clues reinforce one another. The Sundarbans are the mangrove forests of the lower Ganga–Brahmaputra delta and Sundari is a key tree there.",
    "sourceFactIds": [
      "SUNDARBANS-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-049",
    "qlName": "East-coast delta mangroves",
    "difficulty": "Easy",
    "stem": "Which Indian river delta supports mangrove vegetation?",
    "answer": "Mahanadi delta",
    "distractors": [
      "Luni inland basin",
      "Upper Sutlej gorge",
      "Cold desert drainage basin"
    ],
    "explanation": "The Mahanadi reaches the Bay of Bengal through a broad delta. Tidal and muddy parts of the delta support mangrove vegetation.",
    "sourceFactIds": [
      "MANGROVE-MAHANADI"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-049",
    "qlName": "East-coast delta mangroves",
    "difficulty": "Easy",
    "stem": "Mangrove forests occur in the deltas of which pair of rivers?",
    "answer": "Godavari and Krishna",
    "distractors": [
      "Beas and Ravi",
      "Jhelum and Chenab",
      "Luni and Sabarmati upper courses"
    ],
    "explanation": "The Godavari and Krishna form major east-coast deltas opening into the Bay of Bengal. Their tidal delta areas contain mangrove vegetation.",
    "sourceFactIds": [
      "MANGROVE-GODAVARI-KRISHNA"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-049",
    "qlName": "East-coast delta mangroves",
    "difficulty": "Medium",
    "stem": "Which group contains major Indian deltas where mangroves occur?",
    "answer": "Mahanadi, Godavari, Krishna and Kaveri",
    "distractors": [
      "Ravi, Beas, Chenab and Jhelum",
      "Luni, Ghaggar, Banas and Chambal",
      "Teesta, Sutlej, Beas and Son"
    ],
    "explanation": "Large east-coast deltas provide low-lying tidal and sediment-rich environments. Mahanadi, Godavari, Krishna and Kaveri all have mangrove-bearing delta areas.",
    "sourceFactIds": [
      "MANGROVE-DELTA-GROUP"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-049",
    "qlName": "East-coast delta mangroves",
    "difficulty": "Medium",
    "stem": "Why are mangroves common in several east-coast river deltas?",
    "answer": "Large rivers deposit fine sediment on low tidal coasts",
    "distractors": [
      "The coast is entirely made of high cliffs",
      "All rivers enter the sea through narrow mountain gorges",
      "Tidal influence is absent from the deltas"
    ],
    "explanation": "Broad deltas create muddy, sheltered surfaces at river mouths. Tidal flooding and sediment deposition make these sites suitable for mangroves.",
    "sourceFactIds": [
      "EAST-COAST-MANGROVE-REASON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-049",
    "qlName": "East-coast delta mangroves",
    "difficulty": "Medium",
    "stem": "Which river–vegetation match is correct?",
    "answer": "Godavari delta — mangrove forest",
    "distractors": [
      "Upper Ganga plain — alpine meadow",
      "Luni basin — mangrove forest",
      "High Himalaya — tidal forest"
    ],
    "explanation": "The Godavari forms a large delta on the Bay of Bengal with mangrove habitats. The alternative settings are inland, arid or high-altitude.",
    "sourceFactIds": [
      "GODAVARI-MATCH"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-049",
    "qlName": "East-coast delta mangroves",
    "difficulty": "Hard",
    "stem": "A student memorises only the Sundarbans and says Indian mangroves occur nowhere else. Which evidence best corrects that view?",
    "answer": "Mangroves also occur in deltas such as the Mahanadi, Godavari, Krishna and Kaveri",
    "distractors": [
      "All inland river valleys contain mangroves",
      "Mangroves occur only above 3,000 metres",
      "Every dry plateau has tidal forest"
    ],
    "explanation": "The Sundarbans are the best-known mangrove area, but they are not the only one. Several east-coast deltas also support mangrove vegetation.",
    "sourceFactIds": [
      "MANGROVE-BEYOND-SUNDARBANS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-050",
    "qlName": "Island and coastal mangroves",
    "difficulty": "Easy",
    "stem": "Which Indian island group has important mangrove vegetation?",
    "answer": "Andaman and Nicobar Islands",
    "distractors": [
      "Lakshadweep high mountains",
      "Cold desert islands of Ladakh",
      "Interior Malwa Plateau"
    ],
    "explanation": "The Andaman and Nicobar Islands have many sheltered tropical coasts and tidal creeks. These environments support extensive mangrove communities.",
    "sourceFactIds": [
      "MANGROVE-ANDAMAN-NICOBAR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-050",
    "qlName": "Island and coastal mangroves",
    "difficulty": "Easy",
    "stem": "Why can mangroves grow along suitable island coasts?",
    "answer": "Sheltered tidal shores can provide muddy saline or brackish habitats",
    "distractors": [
      "Mangroves require permanent alpine snow",
      "They grow only in dry interior valleys",
      "They need completely fresh upland soil"
    ],
    "explanation": "Where island coasts are sheltered and sediment can accumulate, tidal mudflats develop. Mangrove plants can root in these saline or brackish wetlands.",
    "sourceFactIds": [
      "MANGROVE-ISLAND-COAST"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-050",
    "qlName": "Island and coastal mangroves",
    "difficulty": "Medium",
    "stem": "A tropical island has a sheltered creek with tidal mud and brackish water. Which vegetation is expected?",
    "answer": "Mangrove forest",
    "distractors": [
      "Dry thorn scrub",
      "Alpine grassland",
      "Temperate conifer forest"
    ],
    "explanation": "The habitat combines tidal flooding, mud and brackish water. These are stronger mangrove clues than the island setting alone.",
    "sourceFactIds": [
      "MANGROVE-ISLAND-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-050",
    "qlName": "Island and coastal mangroves",
    "difficulty": "Medium",
    "stem": "Why do mangroves not cover every tropical coastline?",
    "answer": "They need suitable sheltered intertidal sediment, not just tropical temperature",
    "distractors": [
      "They grow only where rainfall is zero",
      "They cannot tolerate any salt",
      "They require high mountain slopes"
    ],
    "explanation": "Warm climate helps, but mangroves also need appropriate coastal landforms and substrates. Exposed rocky shores may not provide the muddy intertidal surface they require.",
    "sourceFactIds": [
      "MANGROVE-NOT-EVERY-COAST"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-050",
    "qlName": "Island and coastal mangroves",
    "difficulty": "Medium",
    "stem": "Which coastal feature most favours mangrove establishment?",
    "answer": "Sheltered mudflat or tidal creek",
    "distractors": [
      "Exposed vertical sea cliff",
      "Dry inland dune far from tides",
      "Rocky alpine slope"
    ],
    "explanation": "Mangrove roots establish best in low-energy coastal environments where fine sediment accumulates. Sheltered creeks and mudflats provide that setting.",
    "sourceFactIds": [
      "MANGROVE-MUDFLAT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-050",
    "qlName": "Island and coastal mangroves",
    "difficulty": "Hard",
    "stem": "Two warm island shores receive similar rainfall. One has sheltered muddy creeks and the other has wave-battered rock. Which shore is more likely to support mangroves, and why?",
    "answer": "The muddy sheltered shore, because sediment and tidal water create a suitable rooting zone",
    "distractors": [
      "The rocky shore, because roots need no sediment",
      "Both must have identical mangroves because climate is warm",
      "The rocky shore, because stronger waves increase soil stability"
    ],
    "explanation": "Mangrove distribution depends on coastal form as well as climate. Sheltered sedimentary shores allow roots to anchor and tolerate regular tidal flooding.",
    "sourceFactIds": [
      "MANGROVE-ISLAND-COMPARE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-051",
    "qlName": "Salinity, waterlogging and mangrove tolerance",
    "difficulty": "Easy",
    "stem": "What environmental stress must mangrove plants tolerate that most inland forest trees do not?",
    "answer": "Saline or brackish tidal water",
    "distractors": [
      "Permanent alpine frost only",
      "Complete absence of water",
      "Year-round desert drought only"
    ],
    "explanation": "Mangroves live where seawater mixes with freshwater or where saline tides enter coastal soils. Their physiology must cope with salt as well as waterlogging.",
    "sourceFactIds": [
      "MANGROVE-SALT-TOLERANCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-051",
    "qlName": "Salinity, waterlogging and mangrove tolerance",
    "difficulty": "Easy",
    "stem": "Why is mangrove soil often poorly aerated?",
    "answer": "It remains saturated with water for long periods",
    "distractors": [
      "It is always completely dry",
      "It is exposed to constant mountain winds",
      "It contains no fine sediment"
    ],
    "explanation": "Water fills the spaces between soil particles in tidal mud. With little air in those pores, roots face a shortage of oxygen.",
    "sourceFactIds": [
      "MANGROVE-WATERLOGGED-SOIL"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-051",
    "qlName": "Salinity, waterlogging and mangrove tolerance",
    "difficulty": "Medium",
    "stem": "Which pair of stresses is typical of mangrove habitats?",
    "answer": "Salinity and waterlogging",
    "distractors": [
      "Severe drought and permanent snow",
      "High altitude and thin air only",
      "Cold desert winds and frozen soil"
    ],
    "explanation": "Mangroves must manage both salt exposure and oxygen-poor saturated soil. Their specialized roots and salt tolerance address these stresses.",
    "sourceFactIds": [
      "MANGROVE-STRESS-PAIR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-051",
    "qlName": "Salinity, waterlogging and mangrove tolerance",
    "difficulty": "Medium",
    "stem": "A coastal plant tolerates salt but cannot survive waterlogged oxygen-poor soil. Why may it still fail in a mangrove swamp?",
    "answer": "Salt tolerance alone does not solve root aeration problems",
    "distractors": [
      "Mangrove swamps never contain salt",
      "All coastal mud is dry",
      "Waterlogging increases soil oxygen"
    ],
    "explanation": "Mangrove survival requires several adaptations at once. A plant must handle salinity and also obtain oxygen despite flooded soil.",
    "sourceFactIds": [
      "MANGROVE-MULTIPLE-STRESS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-051",
    "qlName": "Salinity, waterlogging and mangrove tolerance",
    "difficulty": "Medium",
    "stem": "What makes brackish water different from purely fresh river water?",
    "answer": "It contains a mixture of freshwater and seawater",
    "distractors": [
      "It is water frozen into glacier ice",
      "It contains no dissolved salts",
      "It exists only above the tree line"
    ],
    "explanation": "Brackish water forms where river water mixes with seawater, especially in estuaries and deltas. Many mangrove species are adapted to this intermediate salinity.",
    "sourceFactIds": [
      "BRACKISH-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-051",
    "qlName": "Salinity, waterlogging and mangrove tolerance",
    "difficulty": "Hard",
    "stem": "A delta becomes less tidal and much fresher after a channel shifts inland. Which mangrove control has changed most directly?",
    "answer": "The salinity and tidal flooding regime",
    "distractors": [
      "Mountain altitude",
      "Length of the alpine growing season",
      "Desert evaporation alone"
    ],
    "explanation": "Mangroves respond strongly to how often tides flood the soil and how saline the water is. A major change in these conditions can alter the mangrove community.",
    "sourceFactIds": [
      "MANGROVE-HYDROLOGY-CHANGE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-052",
    "qlName": "Mangrove wildlife habitat",
    "difficulty": "Easy",
    "stem": "Which famous animal is strongly linked with the Sundarbans mangrove region?",
    "answer": "Royal Bengal Tiger",
    "distractors": [
      "Snow leopard",
      "Wild yak",
      "Himalayan tahr"
    ],
    "explanation": "The Sundarbans are famous for the Royal Bengal Tiger living in a tidal mangrove landscape. The other animals are characteristic of high mountain environments.",
    "sourceFactIds": [
      "SUNDARBANS-TIGER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-052",
    "qlName": "Mangrove wildlife habitat",
    "difficulty": "Easy",
    "stem": "Which animal group is well suited to the wet channels of mangrove forests?",
    "answer": "Crocodiles and turtles",
    "distractors": [
      "Alpine ibex only",
      "Desert camel only",
      "High-altitude yak only"
    ],
    "explanation": "Mangrove creeks and tidal waterways provide aquatic and semi-aquatic habitats. Crocodiles and turtles can use these wet coastal environments.",
    "sourceFactIds": [
      "MANGROVE-AQUATIC-WILDLIFE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-052",
    "qlName": "Mangrove wildlife habitat",
    "difficulty": "Medium",
    "stem": "Why do mangrove forests support both terrestrial and aquatic wildlife?",
    "answer": "They form a transition zone of land, tidal creeks and shallow water",
    "distractors": [
      "They are completely dry inland forests",
      "They contain no open water",
      "They occur only on mountain peaks"
    ],
    "explanation": "Mangrove landscapes combine wooded islands, mudflats and tidal channels. This mixture creates habitats for animals that use land, water or both.",
    "sourceFactIds": [
      "MANGROVE-HABITAT-MOSAIC"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-052",
    "qlName": "Mangrove wildlife habitat",
    "difficulty": "Medium",
    "stem": "Which habitat–animal pair fits Indian mangroves?",
    "answer": "Sundarbans — Royal Bengal Tiger",
    "distractors": [
      "Alpine meadow — Sundari tree",
      "Thar Desert — crocodile-dominated tidal creek",
      "High conifer belt — mangrove turtle habitat"
    ],
    "explanation": "The Royal Bengal Tiger is a famous animal of the Sundarbans mangrove ecosystem. The other pairs combine species or habitats from different vegetation zones.",
    "sourceFactIds": [
      "MANGROVE-ANIMAL-PAIR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-052",
    "qlName": "Mangrove wildlife habitat",
    "difficulty": "Medium",
    "stem": "A wetland forest contains tidal creeks, muddy islands, crocodiles and mangrove trees. Which habitat is indicated?",
    "answer": "Mangrove ecosystem",
    "distractors": [
      "Dry deciduous woodland",
      "Alpine meadow",
      "Thorn scrub"
    ],
    "explanation": "The combination of tidal channels, coastal mud and mangrove trees is decisive. Aquatic reptiles further reinforce the wetland identification.",
    "sourceFactIds": [
      "MANGROVE-WILDLIFE-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-052",
    "qlName": "Mangrove wildlife habitat",
    "difficulty": "Medium",
    "stem": "Why is wildlife identification useful in vegetation questions?",
    "answer": "Some animals provide an extra habitat clue when combined with landform and plant evidence",
    "distractors": [
      "One animal always fixes the forest type by itself",
      "Animals are unrelated to habitat",
      "Vegetation can be identified only by state boundaries"
    ],
    "explanation": "A familiar animal can strengthen a habitat identification, but it should be used with vegetation and physical-setting clues. The combination is more reliable than a single fact.",
    "sourceFactIds": [
      "MANGROVE-WILDLIFE-CLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-053",
    "qlName": "Mangrove and inland forest comparison",
    "difficulty": "Easy",
    "stem": "Which feature most clearly separates mangrove forest from tropical evergreen forest?",
    "answer": "Regular tidal influence and saline or brackish water",
    "distractors": [
      "Warm temperature",
      "Presence of trees",
      "High biological productivity"
    ],
    "explanation": "Both can occur in warm, wet climates, so temperature alone is not enough. Tides and saline or brackish water are distinctive mangrove controls.",
    "sourceFactIds": [
      "MANGROVE-VS-EVERGREEN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-053",
    "qlName": "Mangrove and inland forest comparison",
    "difficulty": "Easy",
    "stem": "Which root feature is more typical of mangroves than deciduous forests?",
    "answer": "Breathing roots rising above waterlogged soil",
    "distractors": [
      "Seasonal leaf shedding",
      "Deep dryland tap roots only",
      "Needle leaves adapted to snow"
    ],
    "explanation": "Mangroves often need aerial roots because their flooded soils lack oxygen. Deciduous forests face seasonal water shortage rather than permanent root-zone waterlogging.",
    "sourceFactIds": [
      "MANGROVE-VS-DECIDUOUS-ROOT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-053",
    "qlName": "Mangrove and inland forest comparison",
    "difficulty": "Medium",
    "stem": "A warm forest is very wet but lies far inland with no tidal influence. Why is it not automatically a mangrove forest?",
    "answer": "Mangroves require a suitable coastal or estuarine tidal setting",
    "distractors": [
      "Mangroves cannot grow in warm climates",
      "All inland forests are thorn scrub",
      "Mangroves need permanent snow"
    ],
    "explanation": "High rainfall alone does not define mangroves. Their habitat depends on tidal water, coastal sediment and tolerance of salinity or brackish conditions.",
    "sourceFactIds": [
      "MANGROVE-INLAND-DIFFERENCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-053",
    "qlName": "Mangrove and inland forest comparison",
    "difficulty": "Medium",
    "stem": "Which comparison is correct?",
    "answer": "Mangroves cope with waterlogging; thorn plants cope with severe moisture shortage",
    "distractors": [
      "Both face exactly the same root problem",
      "Thorn plants require tidal mud",
      "Mangroves survive because soil remains dry"
    ],
    "explanation": "The two vegetation types solve opposite water problems. Mangroves have too much water around roots, while thorn plants survive chronic water scarcity.",
    "sourceFactIds": [
      "MANGROVE-VS-THORN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-053",
    "qlName": "Mangrove and inland forest comparison",
    "difficulty": "Medium",
    "stem": "What distinguishes mangrove roots from alpine plant adaptations?",
    "answer": "Mangrove roots solve oxygen shortage in flooded mud, while alpine plants cope with cold",
    "distractors": [
      "Both are adaptations to desert drought only",
      "Alpine plants need tidal salinity",
      "Mangroves depend on freezing temperatures"
    ],
    "explanation": "Mangroves and alpine plants face very different stresses. One deals with saline waterlogging, while the other must survive low temperatures and short growing seasons.",
    "sourceFactIds": [
      "MANGROVE-VS-ALPINE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-053",
    "qlName": "Mangrove and inland forest comparison",
    "difficulty": "Medium",
    "stem": "Which set correctly contrasts two forest types?",
    "answer": "Mangrove — tidal mud; evergreen — continuously moist tropical land",
    "distractors": [
      "Mangrove — alpine snow; evergreen — tidal mud",
      "Mangrove — desert sand; evergreen — permanent frost",
      "Mangrove — high conifer belt; evergreen — thorn scrub"
    ],
    "explanation": "Mangroves occupy intertidal coastal wetlands, while tropical evergreen forests develop on humid tropical land with sustained rainfall. The settings are distinct.",
    "sourceFactIds": [
      "MANGROVE-EVERGREEN-CONTRAST"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-054",
    "qlName": "Mangrove integrated identification",
    "difficulty": "Easy",
    "stem": "A forest grows in a muddy river delta flooded by tides. Which vegetation type fits?",
    "answer": "Mangrove forest",
    "distractors": [
      "Temperate conifer forest",
      "Tropical thorn scrub",
      "Alpine grassland"
    ],
    "explanation": "A muddy tidal delta is a classic mangrove environment. The vegetation must tolerate waterlogging and often saline or brackish water.",
    "sourceFactIds": [
      "MANGROVE-INTEGRATED-EASY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-054",
    "qlName": "Mangrove integrated identification",
    "difficulty": "Easy",
    "stem": "Which set of clues points most strongly to the Sundarbans?",
    "answer": "Ganga–Brahmaputra delta + Sundari + tidal mangroves",
    "distractors": [
      "Western Himalaya + deodar + alpine meadow",
      "Thar Desert + cactus + acacia",
      "Deccan Plateau + teak + dry deciduous forest"
    ],
    "explanation": "The Ganga–Brahmaputra delta, Sundari tree and tidal mangroves together identify the Sundarbans. The other sets describe different vegetation regions.",
    "sourceFactIds": [
      "SUNDARBANS-CONSISTENT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-054",
    "qlName": "Mangrove integrated identification",
    "difficulty": "Medium",
    "stem": "A coastal tree has breathing roots and grows in brackish mud. What is the best identification?",
    "answer": "Mangrove tree",
    "distractors": [
      "Dry deciduous tree",
      "Temperate conifer",
      "Alpine shrub"
    ],
    "explanation": "Breathing roots solve oxygen shortage in flooded soil, while brackish mud indicates tidal salinity. Together these are strong mangrove clues.",
    "sourceFactIds": [
      "MANGROVE-MULTICLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-054",
    "qlName": "Mangrove integrated identification",
    "difficulty": "Medium",
    "stem": "Which regional set is entirely compatible with mangrove occurrence?",
    "answer": "Sundarbans, Godavari delta and Andaman–Nicobar coasts",
    "distractors": [
      "Ladakh, Thar Desert and alpine Himalaya",
      "Upper Ganga plain, Malwa Plateau and cold desert",
      "Western Rajasthan, Deccan rain shadow and high conifer belt"
    ],
    "explanation": "The first group contains tidal delta or island coastal environments where mangroves occur. The other groups are inland dry, plain or high-altitude regions.",
    "sourceFactIds": [
      "MANGROVE-REGION-SET"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-054",
    "qlName": "Mangrove integrated identification",
    "difficulty": "Medium",
    "stem": "A delta has fine silt, daily tidal flooding and roots that rise above the mud. Which environmental problem explains the root form?",
    "answer": "Low oxygen in waterlogged soil",
    "distractors": [
      "Lack of any water",
      "Permanent frost",
      "Extreme inland drought"
    ],
    "explanation": "The sediment remains saturated during tidal flooding, leaving little air in the soil. Aerial roots allow the plant to obtain oxygen above the mud surface.",
    "sourceFactIds": [
      "MANGROVE-INTEGRATED-ROOT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-054",
    "qlName": "Mangrove integrated identification",
    "difficulty": "Medium",
    "stem": "Which single additional clue would most strengthen a mangrove identification in a warm coastal forest?",
    "answer": "Brackish tidal creeks",
    "distractors": [
      "A snow-covered ridge",
      "A long desert dry season",
      "A deodar-dominated slope"
    ],
    "explanation": "Brackish tidal creeks directly indicate an estuarine or deltaic coastal setting. That physical environment is much more diagnostic of mangroves than warmth alone.",
    "sourceFactIds": [
      "MANGROVE-ADDITIONAL-CLUE"
    ]
  }
]);
export const GEO_VEG_001_CP006_REVIEW_BATCH_V1:readonly GeoVeg001Question[]=Object.freeze(RAW.map((raw,index)=>{const correctIndex=index%4;return Object.freeze({
 questionId:`GEO-VEG-001-CP006-Q${String(index+1).padStart(3,"0")}`,qlId:raw.qlId,qlName:raw.qlName,difficulty:raw.difficulty,stem:raw.stem,
 options:placeGeoVegOptions(raw.answer,raw.distractors,correctIndex),correctIndex,canonicalAnswer:raw.answer,explanation:raw.explanation,
 sourceIds:GEO_VEG_001_SOURCE_IDS,sourceFactIds:Object.freeze([...raw.sourceFactIds]),reviewOnly:true as const,runtimeRegistered:false as const});}));
const BANNED=/associated with|described as|in the context of|\bbroadly\b|\bmainly\b|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR=/currency|population census|political boundary|time zone|magnetic declination|crop price|road density|literacy|mineral price|calendar month|map projection/i;
export function auditGeoVeg001Cp006ReviewBatchV1(){const issues:string[]=[];const ids=new Set<string>();const stems=new Set<string>();const explanations=new Set<string>();const qlCounts:Record<string,number>={};const difficultyCounts:Record<GeoVeg001Difficulty,number>={Easy:0,Medium:0,Hard:0};const answerPositions=[0,0,0,0];
 for(const q of GEO_VEG_001_CP006_REVIEW_BATCH_V1){if(ids.has(q.questionId))issues.push("DUPLICATE_ID:"+q.questionId);ids.add(q.questionId);const st=q.stem.replace(/\s+/g," ").trim().toLowerCase();if(stems.has(st))issues.push("DUPLICATE_STEM:"+q.questionId);stems.add(st);const ex=q.explanation.replace(/\s+/g," ").trim().toLowerCase();if(explanations.has(ex))issues.push("DUPLICATE_EXPLANATION:"+q.questionId);explanations.add(ex);qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]+=1;answerPositions[q.correctIndex]+=1;if(q.options.length!==4||new Set(q.options).size!==4)issues.push("OPTIONS:"+q.questionId);if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push("ANSWER:"+q.questionId);const ds=q.options.filter((_,i)=>i!==q.correctIndex);if(ds.some(o=>TRIVIAL_DISTRACTOR.test(o)))issues.push("TRIVIAL_DISTRACTOR:"+q.questionId);if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push("PROVENANCE:"+q.questionId);if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);const learner=q.stem+"\n"+q.options.join("\n")+"\n"+q.explanation;if(BANNED.test(learner))issues.push("STYLE:"+q.questionId);if(q.stem.length<22||q.stem.length>360||!q.stem.trim().endsWith("?"))issues.push("STEM_SHAPE:"+q.questionId);if(q.explanation.length<110)issues.push("SHORT_EXPLANATION:"+q.questionId);}
 if(GEO_VEG_001_CP006_REVIEW_BATCH_V1.length!==54)issues.push("COUNT:"+GEO_VEG_001_CP006_REVIEW_BATCH_V1.length);for(let n=46;n<=54;n++){const id="GEO-VEG-001-QL-"+String(n).padStart(3,"0");if(qlCounts[id]!==6)issues.push("QL_COUNT:"+id+":"+(qlCounts[id]??0));}if(difficultyCounts.Easy!==18||difficultyCounts.Medium!==30||difficultyCounts.Hard!==6)issues.push("DIFFICULTY:"+JSON.stringify(difficultyCounts));if(answerPositions.join(",")!=="14,14,13,13")issues.push("ANSWER_POSITIONS:"+answerPositions.join(","));if(stems.size!==54)issues.push("STEM_COUNT:"+stems.size);if(explanations.size!==54)issues.push("EXPLANATION_COUNT:"+explanations.size);return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_VEG_001_CP006_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});}
