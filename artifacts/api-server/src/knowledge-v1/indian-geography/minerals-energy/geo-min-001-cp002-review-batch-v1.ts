import { buildGeoMinQl, finalizeGeoMinCp, auditGeoMinCp } from "./geo-min-001-review-builder";

const QLS = Object.freeze([
buildGeoMinQl("HEMATITE-IRON-ORE", "Hematite iron ore", [
  {
    "stem": "Which iron ore is widely used in India and has a high iron content suitable for steel making?",
    "answer": "Hematite",
    "distractors": [
      "Bauxite",
      "Mica",
      "Gypsum"
    ],
    "explanation": "Hematite is one of India's major iron ores and is extensively used by the iron and steel industry. It is an iron oxide ore and belongs to the ferrous mineral group.",
    "sourceFactId": "HEMATITE-IDENTITY"
  },
  {
    "stem": "A red to reddish-brown iron ore supplies raw material to many Indian steel plants. Which ore is indicated?",
    "answer": "Hematite",
    "distractors": [
      "Lignite",
      "Chromite",
      "Limestone"
    ],
    "explanation": "Hematite commonly has a reddish appearance because it is an iron oxide. Its importance comes from its widespread occurrence and suitability as a major source of iron.",
    "sourceFactId": "HEMATITE-CLUE"
  },
  {
    "stem": "Consider the statements: I. Hematite is an iron ore. II. It is a non-metallic mineral. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Hematite is a metallic ferrous mineral and an important source of iron. Calling it non-metallic would place it in the wrong mineral category.",
    "sourceFactId": "HEMATITE-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched in Hematite iron ore?",
    "answer": "Hematite — iron ore",
    "distractors": [
      "Hematite — aluminium ore",
      "Hematite — non-metallic insulator",
      "Hematite — fuel mineral"
    ],
    "explanation": "Hematite is a major ore of iron used in steel production. Aluminium comes from bauxite, mica is an insulator, and fuels such as coal belong to another resource group.",
    "sourceFactId": "HEMATITE-MATCH"
  },
  {
    "stem": "Which industry has the most direct dependence on hematite ore?",
    "answer": "Iron and steel industry",
    "distractors": [
      "Paper industry",
      "Sugar industry",
      "Jute industry"
    ],
    "explanation": "Hematite provides iron, the basic metallic input for steel making. The other industries use agricultural or forest-based raw materials rather than iron ore as their principal input.",
    "sourceFactId": "HEMATITE-INDUSTRY"
  },
  {
    "stem": "A district has large hematite reserves, coking coal access and rail links. Which heavy industry would this combination favour most strongly?",
    "answer": "Iron and steel production",
    "distractors": [
      "Tea processing",
      "Cotton ginning",
      "Marine fishing"
    ],
    "explanation": "Iron ore and coking coal are classic bulk inputs for iron and steel manufacture. Transport access further strengthens the location advantage for a heavy metallurgical plant.",
    "sourceFactId": "HEMATITE-REASONING"
  }
] as const),

buildGeoMinQl("MAGNETITE-IRON-ORE", "Magnetite iron ore", [
  {
    "stem": "Which iron ore is known for very high iron content and magnetic properties?",
    "answer": "Magnetite",
    "distractors": [
      "Limestone",
      "Bauxite",
      "Mica"
    ],
    "explanation": "Magnetite is an iron oxide ore with a high proportion of iron and distinctive magnetic behaviour. It is therefore a high-grade ferrous mineral resource.",
    "sourceFactId": "MAGNETITE-IDENTITY"
  },
  {
    "stem": "A sample of iron ore strongly attracts a magnet. Which ore is the most likely identification?",
    "answer": "Magnetite",
    "distractors": [
      "Hematite",
      "Gypsum",
      "Copper ore"
    ],
    "explanation": "Magnetite takes its name from its magnetic character and is readily distinguished from common hematite by this property. Both are iron ores, but magnetite is strongly magnetic.",
    "sourceFactId": "MAGNETITE-CLUE"
  },
  {
    "stem": "Consider the statements: I. Magnetite is a ferrous mineral. II. Its magnetic character helps distinguish it from hematite. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Magnetite is an iron-bearing ferrous mineral and has clear magnetic properties. Hematite is also an iron ore but does not show the same strong magnetic response.",
    "sourceFactId": "MAGNETITE-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched in Magnetite iron ore?",
    "answer": "Magnetite — magnetic iron ore",
    "distractors": [
      "Magnetite — principal aluminium ore",
      "Magnetite — non-metallic sheet mineral",
      "Magnetite — evaporite mineral"
    ],
    "explanation": "Magnetite is an iron oxide mineral recognised for strong magnetism and high iron content. The other descriptions refer to completely different mineral groups.",
    "sourceFactId": "MAGNETITE-MATCH"
  },
  {
    "stem": "Which comparison between hematite and magnetite is correct?",
    "answer": "Both are iron ores, but magnetite is strongly magnetic",
    "distractors": [
      "Only hematite contains iron",
      "Magnetite is non-metallic while hematite is metallic",
      "Both are fuel minerals"
    ],
    "explanation": "Hematite and magnetite are both important iron ores. Magnetite is especially noted for magnetism, while hematite is widely exploited in many Indian iron-ore belts.",
    "sourceFactId": "IRON-ORE-COMPARISON"
  },
  {
    "stem": "A beneficiation unit can separate magnetic particles from crushed ore using magnets. Which iron ore would respond most directly to this method?",
    "answer": "Magnetite",
    "distractors": [
      "Hematite only",
      "Bauxite",
      "Limestone"
    ],
    "explanation": "Magnetic separation is especially effective where magnetite is present because its particles respond strongly to magnetic fields. Bauxite and limestone do not behave as magnetic iron ores.",
    "sourceFactId": "MAGNETITE-BENEFICIATION"
  }
] as const),

buildGeoMinQl("ODISHA-JHARKHAND-IRON-ORE-BELT", "Odisha-Jharkhand iron ore belt", [
  {
    "stem": "The Badampahar mines and adjoining iron-ore deposits belong to which major belt?",
    "answer": "Odisha–Jharkhand belt",
    "distractors": [
      "Maharashtra–Goa belt",
      "Ballari–Chitradurga belt",
      "Durg–Bastar–Chandrapur belt"
    ],
    "explanation": "The Odisha–Jharkhand belt contains important iron-ore deposits around Mayurbhanj and Keonjhar in Odisha and adjoining areas of Jharkhand. Badampahar is a standard exam location in this belt.",
    "sourceFactId": "IRON-ODISHA-JHARKHAND"
  },
  {
    "stem": "Which state pair is linked by a major eastern Indian iron-ore belt?",
    "answer": "Odisha and Jharkhand",
    "distractors": [
      "Punjab and Haryana",
      "Kerala and Tamil Nadu",
      "Gujarat and Rajasthan"
    ],
    "explanation": "A major iron-ore belt spans northern Odisha and adjoining Jharkhand. This belt is one of the standard mineral-region associations taught in Indian geography.",
    "sourceFactId": "IRON-EASTERN-BELT"
  },
  {
    "stem": "Consider the statements: I. Keonjhar is part of an important iron-ore region. II. This region lies in the Odisha–Jharkhand belt. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Keonjhar is a major mineral district of Odisha and forms part of the Odisha–Jharkhand iron-ore belt. The two statements therefore describe the same eastern mineral region.",
    "sourceFactId": "KEONJHAR-IRON"
  },
  {
    "stem": "Which pair is correctly matched in Odisha-Jharkhand iron ore belt?",
    "answer": "Badampahar — Odisha–Jharkhand iron-ore belt",
    "distractors": [
      "Badampahar — Maharashtra–Goa belt",
      "Keonjhar — Punjab iron belt",
      "Singhbhum — Kerala iron belt"
    ],
    "explanation": "Badampahar in Odisha is a recognised iron-ore locality within the Odisha–Jharkhand belt. The alternative pairings place known eastern mineral locations in incorrect regions.",
    "sourceFactId": "BADAMPAHAR-MATCH"
  },
  {
    "stem": "A map marks Mayurbhanj, Keonjhar and adjoining Singhbhum. Which mineral belt is being shown?",
    "answer": "Iron ore belt of Odisha–Jharkhand",
    "distractors": [
      "Petroleum belt of western India",
      "Mica belt of Andhra Pradesh",
      "Lignite belt of Tamil Nadu"
    ],
    "explanation": "Mayurbhanj, Keonjhar and Singhbhum form a classic cluster in the eastern Indian iron-ore region. Their geographic proximity makes the belt easy to identify on a map.",
    "sourceFactId": "IRON-EAST-MAP"
  },
  {
    "stem": "A steel plant is planned near eastern India's Keonjhar–Singhbhum mineral zone. Which local raw-material advantage is most obvious?",
    "answer": "Access to iron ore",
    "distractors": [
      "Access to offshore petroleum",
      "Access to coastal lignite only",
      "Access to mica sheets as the main feedstock"
    ],
    "explanation": "Keonjhar and Singhbhum are important iron-ore areas in the Odisha–Jharkhand belt. Their deposits provide a direct raw-material advantage to iron and steel industries in eastern India.",
    "sourceFactId": "IRON-EAST-REASONING"
  }
] as const),

buildGeoMinQl("DURG-BASTAR-CHANDRAPUR-IRON-ORE-BELT", "Durg-Bastar-Chandrapur iron ore belt", [
  {
    "stem": "The Bailadila hills are part of which major iron-ore belt?",
    "answer": "Durg–Bastar–Chandrapur belt",
    "distractors": [
      "Odisha–Jharkhand belt",
      "Maharashtra–Goa coastal belt",
      "Ballari–Chitradurga belt"
    ],
    "explanation": "The Durg–Bastar–Chandrapur belt extends through Chhattisgarh into Maharashtra. Bailadila in Bastar is one of its best-known high-grade iron-ore locations.",
    "sourceFactId": "BAILADILA-BELT"
  },
  {
    "stem": "Bailadila iron-ore deposits are located in which state?",
    "answer": "Chhattisgarh",
    "distractors": [
      "Punjab",
      "Kerala",
      "Haryana"
    ],
    "explanation": "Bailadila lies in the Bastar region of Chhattisgarh and is famous for high-grade iron ore. It belongs to the Durg–Bastar–Chandrapur mineral belt.",
    "sourceFactId": "BAILADILA-STATE"
  },
  {
    "stem": "Consider the statements: I. Bastar is linked with major iron-ore deposits. II. It forms part of the Durg–Bastar–Chandrapur belt. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "The Bastar region contains the important Bailadila iron-ore deposits. It is a central part of the Durg–Bastar–Chandrapur iron-ore belt.",
    "sourceFactId": "BASTAR-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched in Durg-Bastar-Chandrapur iron ore belt?",
    "answer": "Bailadila — Chhattisgarh iron ore",
    "distractors": [
      "Bailadila — Rajasthan copper",
      "Durg — Kerala mica",
      "Bastar — Assam petroleum"
    ],
    "explanation": "Bailadila is a major iron-ore mining area in Chhattisgarh. The other options deliberately mix mineral regions from unrelated parts of India.",
    "sourceFactId": "BAILADILA-MATCH"
  },
  {
    "stem": "A map highlights Durg and Bastar in Chhattisgarh and Chandrapur in Maharashtra. What does this belt represent?",
    "answer": "A major iron-ore belt",
    "distractors": [
      "A major offshore oil belt",
      "A major mica belt",
      "A major lignite-only belt"
    ],
    "explanation": "These three areas give the Durg–Bastar–Chandrapur belt its name. The belt is an important iron-ore region extending across central India.",
    "sourceFactId": "DURG-BASTAR-MAP"
  },
  {
    "stem": "Why is the Bailadila region important in India's mineral geography?",
    "answer": "It contains high-grade iron ore within the Durg–Bastar–Chandrapur belt",
    "distractors": [
      "It is India's principal mica belt",
      "It is an offshore petroleum field",
      "It is known only for gypsum"
    ],
    "explanation": "Bailadila is important because of its rich, high-grade iron-ore deposits in Chhattisgarh. Its location within a major central Indian belt gives it strong industrial significance.",
    "sourceFactId": "BAILADILA-REASONING"
  }
] as const),

buildGeoMinQl("BALLARI-CHITRADURGA-CHIKKAMAGALURU-TUMAKURU-BELT", "Ballari-Chitradurga-Chikkamagaluru-Tumakuru belt", [
  {
    "stem": "Which state contains the Ballari–Chitradurga–Chikkamagaluru–Tumakuru iron-ore belt?",
    "answer": "Karnataka",
    "distractors": [
      "Odisha",
      "Assam",
      "Rajasthan"
    ],
    "explanation": "The Ballari–Chitradurga–Chikkamagaluru–Tumakuru belt lies in Karnataka. It is one of the major iron-ore belts identified in standard Indian geography.",
    "sourceFactId": "IRON-KARNATAKA-BELT"
  },
  {
    "stem": "Kudremukh, historically known for iron ore, is located in which state?",
    "answer": "Karnataka",
    "distractors": [
      "Jharkhand",
      "Goa",
      "Chhattisgarh"
    ],
    "explanation": "Kudremukh is located in Karnataka's Western Ghats and became well known for iron-ore mining and concentration. It belongs to the broader Karnataka mineral region.",
    "sourceFactId": "KUDREMUKH-STATE"
  },
  {
    "stem": "Consider the statements: I. Ballari is an important iron-ore district. II. It lies in Karnataka. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Ballari is a prominent iron-ore region in eastern Karnataka. Its name is central to the Ballari–Chitradurga–Chikkamagaluru–Tumakuru belt.",
    "sourceFactId": "BALLARI-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched in Ballari-Chitradurga-Chikkamagaluru-Tumakuru belt?",
    "answer": "Ballari — Karnataka iron-ore belt",
    "distractors": [
      "Ballari — Assam petroleum field",
      "Chitradurga — Rajasthan gypsum belt",
      "Kudremukh — Jharkhand coalfield"
    ],
    "explanation": "Ballari and Chitradurga are well-known parts of Karnataka's iron-ore belt. The other pairings place these locations in unrelated mineral regions.",
    "sourceFactId": "BALLARI-MATCH"
  },
  {
    "stem": "A map shows Ballari and Chitradurga in the Deccan interior. Which mineral should you identify first?",
    "answer": "Iron ore",
    "distractors": [
      "Petroleum",
      "Mica only",
      "Lignite only"
    ],
    "explanation": "Ballari and Chitradurga are classic Karnataka iron-ore locations. Their appearance together on a mineral map is a strong clue to the state's major iron-ore belt.",
    "sourceFactId": "KARNATAKA-IRON-MAP"
  },
  {
    "stem": "Which comparison is correct between Bailadila and Ballari?",
    "answer": "Bailadila is in Chhattisgarh, while Ballari is in Karnataka",
    "distractors": [
      "Both are in Odisha",
      "Both are in Goa",
      "Bailadila is in Karnataka and Ballari in Chhattisgarh"
    ],
    "explanation": "Bailadila belongs to the Bastar region of Chhattisgarh, whereas Ballari is a major iron-ore district of Karnataka. Both are important, but in different belts.",
    "sourceFactId": "BAILADILA-BALLARI-COMPARE"
  }
] as const),

buildGeoMinQl("MAHARASHTRA-GOA-IRON-ORE-BELT", "Maharashtra-Goa iron ore belt", [
  {
    "stem": "Which major iron-ore belt lies along parts of the western coast and adjoining Western Ghats?",
    "answer": "Maharashtra–Goa belt",
    "distractors": [
      "Odisha–Jharkhand belt",
      "Durg–Bastar–Chandrapur belt",
      "Ballari–Chitradurga belt"
    ],
    "explanation": "The Maharashtra–Goa belt forms an important western iron-ore region. Goa's ores historically benefited from short transport distances to west-coast ports.",
    "sourceFactId": "IRON-MAHARASHTRA-GOA"
  },
  {
    "stem": "Goa is especially known in Indian mineral geography for deposits of which mineral?",
    "answer": "Iron ore",
    "distractors": [
      "Uranium only",
      "Rock salt only",
      "Natural gas only"
    ],
    "explanation": "Goa has long been recognised as an iron-ore producing area in the Maharashtra–Goa belt. Its coastal setting also supported ore movement through nearby ports.",
    "sourceFactId": "GOA-IRON"
  },
  {
    "stem": "Consider the statements: I. Goa forms part of a major iron-ore belt. II. Its coastal location can assist mineral transport. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Goa lies within the Maharashtra–Goa iron-ore belt and is close to west-coast port infrastructure. That geography historically made seaborne transport comparatively convenient.",
    "sourceFactId": "GOA-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched in Maharashtra-Goa iron ore belt?",
    "answer": "Goa — western iron-ore belt",
    "distractors": [
      "Goa — eastern coalfield belt",
      "Maharashtra–Goa — mica belt",
      "Goa — principal bauxite-only belt"
    ],
    "explanation": "Goa is a standard location in the western iron-ore belt shared with Maharashtra. The other choices confuse it with unrelated mineral-resource regions.",
    "sourceFactId": "GOA-MATCH"
  },
  {
    "stem": "A mineral map marks a compact iron-ore zone near India's west coast south of Maharashtra. Which state is most likely highlighted?",
    "answer": "Goa",
    "distractors": [
      "Bihar",
      "Punjab",
      "Uttar Pradesh"
    ],
    "explanation": "Goa lies on the west coast and is part of the Maharashtra–Goa iron-ore belt. Its small area makes the iron-ore concentration particularly distinctive on maps.",
    "sourceFactId": "GOA-MAP"
  },
  {
    "stem": "Why did Goa's geography historically favour export-oriented movement of iron ore?",
    "answer": "Iron-ore deposits lie relatively close to west-coast port routes",
    "distractors": [
      "The state is landlocked beside Himalayan passes",
      "Its ores occur only in desert interiors",
      "The deposits are located beside eastern coalfields"
    ],
    "explanation": "Goa combines iron-ore deposits with a short distance to Arabian Sea transport routes. That location reduces the overland movement required before ore reaches a port.",
    "sourceFactId": "GOA-PORT-REASONING"
  }
] as const),

buildGeoMinQl("IRON-ORE-AS-STEEL-RAW-MATERIAL", "Iron ore as steel raw material", [
  {
    "stem": "Which mineral raw material supplies the iron required for steel manufacture?",
    "answer": "Iron ore",
    "distractors": [
      "Mica",
      "Gypsum",
      "Bauxite"
    ],
    "explanation": "Iron ore is the basic source of iron used in iron and steel production. Other minerals can support industrial processes, but they do not replace iron ore as the principal metal feedstock.",
    "sourceFactId": "IRON-STEEL-RAW"
  },
  {
    "stem": "A steel plant's raw-material plan omits iron ore. Which essential input is therefore missing?",
    "answer": "Source of iron",
    "distractors": [
      "Source of aluminium only",
      "Electrical insulation mineral",
      "Plaster raw material"
    ],
    "explanation": "Steel is fundamentally an iron-based alloy, so an iron source is essential to conventional steel making. Iron ore provides that metallic input before refining and alloying.",
    "sourceFactId": "IRON-STEEL-INPUT"
  },
  {
    "stem": "Consider the statements: I. Iron ore is a ferrous mineral. II. Steel production depends on a source of iron. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Iron ore belongs to the ferrous mineral group and supplies the iron base of steel. Both statements therefore express the direct mineral-industry relationship.",
    "sourceFactId": "IRON-STEEL-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched in Iron ore as steel raw material?",
    "answer": "Iron ore — steel industry",
    "distractors": [
      "Mica — primary source of iron",
      "Gypsum — aluminium smelting ore",
      "Bauxite — principal source of iron"
    ],
    "explanation": "Iron ore is the direct mineral feedstock for iron and steel manufacture. Mica, gypsum and bauxite serve very different industrial roles.",
    "sourceFactId": "IRON-STEEL-MATCH"
  },
  {
    "stem": "Which location factor would most directly reduce the bulk transport cost of an integrated steel plant?",
    "answer": "Proximity to major iron-ore deposits",
    "distractors": [
      "Distance from all mineral belts",
      "Absence of transport links",
      "Location far from raw materials"
    ],
    "explanation": "Iron ore is bulky and required in large quantities by steel plants. Locating near major ore deposits can reduce one important component of raw-material transport cost.",
    "sourceFactId": "STEEL-LOCATION-IRON"
  },
  {
    "stem": "A region has iron ore but no nearby market; another has a large market but must import all ore. Which fact still gives the first region a raw-material advantage for primary steel?",
    "answer": "Local access to bulky iron ore",
    "distractors": [
      "Absence of consumers",
      "Lack of power",
      "No transport requirement"
    ],
    "explanation": "Primary steel production requires large flows of mineral raw materials, especially iron ore. Local ore is therefore a real location advantage, although power, coal, transport and markets also matter.",
    "sourceFactId": "STEEL-RAW-MATERIAL-REASONING"
  }
] as const),

buildGeoMinQl("IRON-ORE-BELT-RECOGNITION-AND-MAPPING", "Iron ore belt recognition and mapping", [
  {
    "stem": "Which sequence lists only major Indian iron-ore belts?",
    "answer": "Odisha–Jharkhand; Durg–Bastar–Chandrapur; Ballari–Chitradurga; Maharashtra–Goa",
    "distractors": [
      "Koderma–Nellore; Jharia–Raniganj; Mumbai High–Assam; Neyveli–Khetri",
      "Punjab–Haryana; Kerala–Tamil Nadu; Assam–Meghalaya; Delhi–NCR",
      "Khetri–Singhbhum copper; Zawar zinc; Jharia coal; Digboi oil"
    ],
    "explanation": "India's standard iron-ore belts include the eastern Odisha–Jharkhand belt, central Durg–Bastar–Chandrapur belt, Karnataka belt and Maharashtra–Goa belt. The other lists mix unrelated resources.",
    "sourceFactId": "IRON-BELTS-LIST"
  },
  {
    "stem": "Which iron-ore belt is correctly paired with its region?",
    "answer": "Ballari–Chitradurga — Karnataka",
    "distractors": [
      "Odisha–Jharkhand — western coast",
      "Maharashtra–Goa — eastern plateau only",
      "Durg–Bastar–Chandrapur — Kerala"
    ],
    "explanation": "Ballari and Chitradurga are in Karnataka and form part of a major southern iron-ore belt. The other options shift established belts into incorrect regions.",
    "sourceFactId": "IRON-BELT-REGION"
  },
  {
    "stem": "Consider the statements: I. India's major iron-ore belts are spread across eastern, central, southern and western regions. II. All major belts lie in one state. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Major iron-ore belts occur in several states and physiographic regions of India. They are not confined to a single state or one part of the country.",
    "sourceFactId": "IRON-BELT-DISTRIBUTION"
  },
  {
    "stem": "Which location should NOT be placed on an iron-ore belt map?",
    "answer": "Digboi",
    "distractors": [
      "Bailadila",
      "Ballari",
      "Keonjhar"
    ],
    "explanation": "Digboi in Assam is famous for petroleum, not as a major iron-ore belt marker. Bailadila, Ballari and Keonjhar are standard iron-ore locations.",
    "sourceFactId": "IRON-MAP-NEGATIVE"
  },
  {
    "stem": "Which pair contains two iron-ore locations from different major belts?",
    "answer": "Bailadila and Keonjhar",
    "distractors": [
      "Digboi and Mumbai High",
      "Koderma and Nellore",
      "Khetri and Zawar"
    ],
    "explanation": "Bailadila belongs to the Durg–Bastar–Chandrapur belt, while Keonjhar lies in the Odisha–Jharkhand belt. The other pairs represent petroleum, mica or non-ferrous mineral locations.",
    "sourceFactId": "IRON-BELT-CROSSPAIR"
  },
  {
    "stem": "A map shows four clusters: Keonjhar, Bailadila, Ballari and Goa. What common resource connects all four?",
    "answer": "Iron ore",
    "distractors": [
      "Petroleum",
      "Mica",
      "Gypsum"
    ],
    "explanation": "Each location is a major marker of a different iron-ore region in India. Together they provide a useful east-central-south-west map pattern for iron-ore geography.",
    "sourceFactId": "IRON-FOUR-CLUSTER"
  }
] as const),

buildGeoMinQl("INTEGRATED-IRON-ORE-COMPARISON", "Integrated iron ore comparison", [
  {
    "stem": "Which statement correctly compares hematite and magnetite?",
    "answer": "Both are iron ores, while magnetite is strongly magnetic",
    "distractors": [
      "Only magnetite contains iron",
      "Hematite is non-metallic",
      "Both are aluminium ores"
    ],
    "explanation": "Hematite and magnetite are both iron-bearing minerals used as iron ores. Magnetite is distinguished by its strong magnetic property, whereas hematite is commonly reddish.",
    "sourceFactId": "IRON-ORE-INTEGRATED-1"
  },
  {
    "stem": "Which location-resource pair is incorrect for Integrated iron ore comparison?",
    "answer": "Digboi — iron ore",
    "distractors": [
      "Bailadila — iron ore",
      "Ballari — iron ore",
      "Keonjhar — iron ore"
    ],
    "explanation": "Digboi is a historic petroleum centre in Assam, not a standard iron-ore location. Bailadila, Ballari and Keonjhar are all major iron-ore geography markers.",
    "sourceFactId": "IRON-ORE-INTEGRATED-2"
  },
  {
    "stem": "Consider the statements: I. Bailadila is in Chhattisgarh. II. Ballari is in Karnataka. III. Keonjhar is in Odisha. Which is correct?",
    "answer": "I, II and III",
    "distractors": [
      "I and II only",
      "II and III only",
      "I and III only"
    ],
    "explanation": "All three locations are correctly placed: Bailadila in Chhattisgarh, Ballari in Karnataka and Keonjhar in Odisha. Each belongs to a different major iron-ore belt.",
    "sourceFactId": "IRON-ORE-INTEGRATED-3"
  },
  {
    "stem": "Which pair of belts lies respectively in eastern and western India?",
    "answer": "Odisha–Jharkhand and Maharashtra–Goa",
    "distractors": [
      "Ballari–Chitradurga and Durg–Bastar–Chandrapur",
      "Maharashtra–Goa and Odisha–Jharkhand",
      "Durg–Bastar–Chandrapur and Ballari–Chitradurga"
    ],
    "explanation": "The Odisha–Jharkhand belt occupies eastern India, while the Maharashtra–Goa belt lies toward the west coast. This east-west contrast is useful for map-based elimination.",
    "sourceFactId": "IRON-ORE-INTEGRATED-4"
  },
  {
    "stem": "A question gives the clues 'high-grade ore, Bastar, Chhattisgarh'. Which location should be selected?",
    "answer": "Bailadila",
    "distractors": [
      "Koderma",
      "Khetri",
      "Nellore"
    ],
    "explanation": "Bailadila is the prominent high-grade iron-ore area in Bastar, Chhattisgarh. Koderma and Nellore are known for mica, while Khetri is linked with copper.",
    "sourceFactId": "IRON-ORE-INTEGRATED-5"
  },
  {
    "stem": "Which chain is geographically and economically correct for Integrated iron ore comparison?",
    "answer": "Keonjhar → iron ore → ferrous mineral → steel raw material",
    "distractors": [
      "Koderma → iron ore → non-ferrous mineral → steel raw material",
      "Digboi → iron ore → ferrous mineral → aluminium raw material",
      "Khetri → hematite → non-metallic mineral → cement raw material"
    ],
    "explanation": "Keonjhar is a major iron-ore area, iron ore is ferrous, and it provides the iron input for steel. The other chains combine locations and mineral classes incorrectly.",
    "sourceFactId": "IRON-ORE-INTEGRATED-6"
  }
] as const),

buildGeoMinQl("NOAMUNDI-SINGHBHUM-IRON-ORE", "Noamundi and Singhbhum iron-ore geography", [
  {
    "stem": "Noamundi, an important iron-ore mining centre, is located in which state?",
    "answer": "Jharkhand",
    "distractors": [
      "Odisha",
      "Chhattisgarh",
      "Karnataka"
    ],
    "explanation": "Noamundi lies in West Singhbhum district of Jharkhand and is one of the classic iron-ore locations of the eastern mineral belt. It is closely linked with the wider Singhbhum iron-ore region.",
    "sourceFactId": "IRON-NOAMUNDI-STATE",
    "sourceIds": [
      "NCERT-CLASS10-CONTEMPORARY-INDIA-II-CH5-MINERALS-ENERGY-2025-26",
      "IBM-MINERAL-REVIEW-IRON-ORE",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "Which mineral is most strongly linked with Noamundi in Indian geography?",
    "answer": "Iron ore",
    "distractors": [
      "Bauxite",
      "Mica",
      "Gypsum"
    ],
    "explanation": "Noamundi is a major iron-ore mining centre in Jharkhand. Its location within the Singhbhum belt makes it a standard map and location question in Indian mineral geography.",
    "sourceFactId": "IRON-NOAMUNDI-RESOURCE",
    "sourceIds": [
      "NCERT-CLASS10-CONTEMPORARY-INDIA-II-CH5-MINERALS-ENERGY-2025-26",
      "IBM-MINERAL-REVIEW-IRON-ORE",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "Consider the statements: I. Noamundi lies in Jharkhand. II. It forms part of the Singhbhum iron-ore region. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Noamundi is in West Singhbhum district of Jharkhand and belongs to the important Singhbhum iron-ore belt. Both statements correctly describe the same mineral region.",
    "sourceFactId": "IRON-NOAMUNDI-STATEMENT",
    "sourceIds": [
      "NCERT-CLASS10-CONTEMPORARY-INDIA-II-CH5-MINERALS-ENERGY-2025-26",
      "IBM-MINERAL-REVIEW-IRON-ORE",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "Which pair is correctly matched in Noamundi and Singhbhum iron-ore geography?",
    "answer": "Noamundi — iron ore",
    "distractors": [
      "Noamundi — petroleum",
      "Noamundi — mica",
      "Noamundi — gypsum"
    ],
    "explanation": "Noamundi is a well-known iron-ore centre of Jharkhand. Petroleum, mica and gypsum have different principal regions and should not be confused with the Singhbhum iron belt.",
    "sourceFactId": "IRON-NOAMUNDI-MATCH",
    "sourceIds": [
      "NCERT-CLASS10-CONTEMPORARY-INDIA-II-CH5-MINERALS-ENERGY-2025-26",
      "IBM-MINERAL-REVIEW-IRON-ORE",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "A mineral map marks Noamundi and adjoining Singhbhum. Which resource should be identified first?",
    "answer": "Iron ore",
    "distractors": [
      "Lignite",
      "Natural gas",
      "Rock phosphate"
    ],
    "explanation": "Noamundi and Singhbhum together are strong clues to eastern India's iron-ore geography. The cluster is unrelated to lignite, gas or phosphate belts.",
    "sourceFactId": "IRON-NOAMUNDI-MAP",
    "sourceIds": [
      "NCERT-CLASS10-CONTEMPORARY-INDIA-II-CH5-MINERALS-ENERGY-2025-26",
      "IBM-MINERAL-REVIEW-IRON-ORE",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "Which comparison is correct for Noamundi and Singhbhum iron-ore geography?",
    "answer": "Noamundi is in Jharkhand, while Bailadila is in Chhattisgarh",
    "distractors": [
      "Both are in Karnataka",
      "Noamundi is in Goa and Bailadila in Odisha",
      "Both are petroleum fields"
    ],
    "explanation": "Noamundi represents the Singhbhum iron-ore region of Jharkhand, while Bailadila lies in Bastar, Chhattisgarh. Both are important iron-ore locations in different belts.",
    "sourceFactId": "IRON-NOAMUNDI-BAILADILA",
    "sourceIds": [
      "NCERT-CLASS10-CONTEMPORARY-INDIA-II-CH5-MINERALS-ENERGY-2025-26",
      "IBM-MINERAL-REVIEW-IRON-ORE",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  }
] as const)
]);

export const GEO_MIN_001_CP002_REVIEW_BATCH_V1 = finalizeGeoMinCp(2, QLS);
export function auditGeoMin001Cp002ReviewBatchV1() { return auditGeoMinCp(2, QLS, GEO_MIN_001_CP002_REVIEW_BATCH_V1); }
