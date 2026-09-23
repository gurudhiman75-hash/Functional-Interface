import {
  GEO_VEG_001_SOURCE_IDS,
  placeGeoVegOptions,
  type GeoVeg001Difficulty,
  type GeoVeg001Question,
} from "./geo-veg-001-review-types";

type RawQuestion = Readonly<{
  qlId: string;
  qlName: string;
  difficulty: GeoVeg001Difficulty;
  stem: string;
  answer: string;
  distractors: readonly string[];
  explanation: string;
  sourceFactIds: readonly string[];
}>;

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-VEG-001-QL-001",
    "qlName": "Natural vegetation meaning",
    "difficulty": "Easy",
    "stem": "Which statement best defines natural vegetation?",
    "answer": "A plant community that grows naturally without human aid and remains undisturbed for a long time",
    "distractors": [
      "A crop raised every season with irrigation",
      "Trees planted along roads by people",
      "Any group of plants grown for commercial use"
    ],
    "explanation": "Natural vegetation develops without direct human planting or cultivation and remains undisturbed long enough to adjust to local conditions. The idea refers to how the plant community develops, not simply to the presence of trees.",
    "sourceFactIds": [
      "NATURAL-VEGETATION-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-001",
    "qlName": "Natural vegetation meaning",
    "difficulty": "Easy",
    "stem": "Which of the following is an example of natural vegetation?",
    "answer": "A naturally growing forest community",
    "distractors": [
      "A mango orchard",
      "A tea plantation",
      "A city park planted with decorative trees"
    ],
    "explanation": "A naturally growing forest community fits the definition because it develops without deliberate human cultivation. Orchards, plantations and landscaped parks are vegetation, but they are created or managed by people.",
    "sourceFactIds": [
      "NATURAL-VEGETATION-EXAMPLE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-001",
    "qlName": "Natural vegetation meaning",
    "difficulty": "Medium",
    "stem": "The same tree species grows wild in a forest and is also planted in a garden. What determines whether it forms part of natural vegetation?",
    "answer": "Whether it developed naturally without human planting and remained undisturbed",
    "distractors": [
      "Whether the tree is tall",
      "Whether the tree produces fruit",
      "Whether the tree has broad leaves"
    ],
    "explanation": "Natural vegetation is identified by its natural development and long undisturbed growth, not by the species alone. A wild tree in a natural community may qualify even when the same species is also planted in a garden.",
    "sourceFactIds": [
      "NATURAL-VEGETATION-WILD-VS-PLANTED"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-001",
    "qlName": "Natural vegetation meaning",
    "difficulty": "Medium",
    "stem": "Why is a long undisturbed period important in the idea of natural vegetation?",
    "answer": "It allows plant species to adjust to local climate and soil conditions",
    "distractors": [
      "It guarantees that all plants become evergreen",
      "It removes the influence of rainfall",
      "It makes every soil equally fertile"
    ],
    "explanation": "When vegetation remains undisturbed for a long time, its species can adjust to the local climate and soil. This is why the definition stresses both natural growth and a prolonged period without human interference.",
    "sourceFactIds": [
      "NATURAL-VEGETATION-ADJUSTMENT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-001",
    "qlName": "Natural vegetation meaning",
    "difficulty": "Medium",
    "stem": "Which feature most clearly separates natural vegetation from a cultivated plant community?",
    "answer": "Natural development without deliberate human cultivation",
    "distractors": [
      "Presence of green leaves",
      "Growth on fertile soil",
      "Occurrence in a warm climate"
    ],
    "explanation": "Both natural and cultivated plants can be green, fertile-soil plants or warm-climate plants. The decisive difference is whether the community developed naturally rather than through deliberate planting and cultivation.",
    "sourceFactIds": [
      "NATURAL-VEGETATION-DISTINCTION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-001",
    "qlName": "Natural vegetation meaning",
    "difficulty": "Hard",
    "stem": "Site A contains a forest community that developed naturally for many years; Site B contains the same tree species in a managed plantation. Which conclusion is correct?",
    "answer": "Site A is natural vegetation, while Site B is planted vegetation",
    "distractors": [
      "Both are natural because the species are identical",
      "Only Site B is natural because it is managed",
      "Neither can be called vegetation"
    ],
    "explanation": "The species may be the same, but the origin and management of the plant community are different. Site A developed naturally and remained undisturbed, while Site B was deliberately established and managed by people.",
    "sourceFactIds": [
      "NATURAL-VEGETATION-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-002",
    "qlName": "Virgin vegetation",
    "difficulty": "Easy",
    "stem": "Natural vegetation that has grown without human aid and remained undisturbed for a long time is termed what?",
    "answer": "Virgin vegetation",
    "distractors": [
      "Plantation vegetation",
      "Seasonal crop cover",
      "Urban landscaping"
    ],
    "explanation": "Virgin vegetation is the term used for a naturally developed plant community that has remained undisturbed for a long period. It contrasts with vegetation created through deliberate cultivation or planting.",
    "sourceFactIds": [
      "VIRGIN-VEGETATION-TERM"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-002",
    "qlName": "Virgin vegetation",
    "difficulty": "Easy",
    "stem": "Which of the following is not treated as natural or virgin vegetation in the NCERT definition?",
    "answer": "A cultivated fruit orchard",
    "distractors": [
      "An undisturbed natural forest",
      "Naturally growing woodland",
      "Wild plant communities in an uncultivated area"
    ],
    "explanation": "A cultivated orchard is established and managed by people, so it is not natural or virgin vegetation. A wild community that grows naturally and remains undisturbed fits the textbook definition.",
    "sourceFactIds": [
      "VIRGIN-VEGETATION-ORCHARD"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-002",
    "qlName": "Virgin vegetation",
    "difficulty": "Medium",
    "stem": "Which statement correctly distinguishes virgin vegetation from a plantation?",
    "answer": "Virgin vegetation develops naturally, whereas a plantation is deliberately established by people",
    "distractors": [
      "Virgin vegetation always contains only one species",
      "A plantation can never contain trees",
      "Virgin vegetation occurs only in mountains"
    ],
    "explanation": "The distinction is based on origin and human intervention. Virgin vegetation develops naturally and remains undisturbed, while a plantation is created and usually managed for a planned purpose.",
    "sourceFactIds": [
      "VIRGIN-VS-PLANTATION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-002",
    "qlName": "Virgin vegetation",
    "difficulty": "Medium",
    "stem": "Consider the statements: I. Virgin vegetation develops without human aid. II. Cultivated crops are included in virgin vegetation. Which option is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "The first statement matches the textbook meaning of virgin vegetation. Cultivated crops are vegetation in a general sense, but they are not treated as natural or virgin vegetation because people raise them deliberately.",
    "sourceFactIds": [
      "VIRGIN-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-002",
    "qlName": "Virgin vegetation",
    "difficulty": "Medium",
    "stem": "Why are cultivated crops excluded from the category of virgin vegetation?",
    "answer": "Their growth is deliberately directed by human cultivation",
    "distractors": [
      "They always grow in deserts",
      "They contain no plant species",
      "They cannot survive rainfall"
    ],
    "explanation": "Cultivated crops depend on human decisions such as sowing, selection and field management, so their origin is not natural in the required sense. Virgin vegetation develops without such deliberate cultivation.",
    "sourceFactIds": [
      "VIRGIN-CULTIVATED-EXCLUSION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-002",
    "qlName": "Virgin vegetation",
    "difficulty": "Hard",
    "stem": "Which site most clearly represents virgin vegetation: an old natural forest, a managed timber plantation, a fruit orchard or a landscaped park?",
    "answer": "The old natural forest",
    "distractors": [
      "The managed timber plantation",
      "The fruit orchard",
      "The landscaped park"
    ],
    "explanation": "The old natural forest is the only site in the group that developed as a natural plant community without deliberate establishment by people. The other three sites were created or maintained through human planting and management.",
    "sourceFactIds": [
      "VIRGIN-SITE-DIAGNOSIS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-003",
    "qlName": "Flora and fauna",
    "difficulty": "Easy",
    "stem": "What does the term 'flora' refer to?",
    "answer": "Plants of a particular region or period",
    "distractors": [
      "Animals of a particular region",
      "Only cultivated crops",
      "Only forest trees"
    ],
    "explanation": "Flora refers to the plant life of a particular region or period. It can include many kinds of plants and is not limited to forest trees or cultivated crops.",
    "sourceFactIds": [
      "FLORA-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-003",
    "qlName": "Flora and fauna",
    "difficulty": "Easy",
    "stem": "What does the term 'fauna' refer to?",
    "answer": "Animal species of a particular region",
    "distractors": [
      "Plant species of a region",
      "Only domestic animals",
      "Only aquatic plants"
    ],
    "explanation": "Fauna refers to the animal life of a region. The term is used as the animal counterpart of flora, which refers to plant life.",
    "sourceFactIds": [
      "FAUNA-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-003",
    "qlName": "Flora and fauna",
    "difficulty": "Medium",
    "stem": "Which pair is correctly matched?",
    "answer": "Flora—plants; fauna—animals",
    "distractors": [
      "Flora—animals; fauna—plants",
      "Flora—soil; fauna—rainfall",
      "Flora—climate; fauna—relief"
    ],
    "explanation": "Flora denotes plant life, while fauna denotes animal life. The two terms are commonly used together when describing the biological diversity of a region.",
    "sourceFactIds": [
      "FLORA-FAUNA-PAIR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-003",
    "qlName": "Flora and fauna",
    "difficulty": "Medium",
    "stem": "A study lists the trees, grasses and shrubs of a district. Which term best describes the subject of the study?",
    "answer": "Flora",
    "distractors": [
      "Fauna",
      "Relief",
      "Drainage"
    ],
    "explanation": "Trees, grasses and shrubs are plant life, so the study concerns the flora of the district. Fauna would refer to the animals living in the same region, making the plant–animal distinction clear.",
    "sourceFactIds": [
      "FLORA-STUDY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-003",
    "qlName": "Flora and fauna",
    "difficulty": "Medium",
    "stem": "A survey records deer, birds, reptiles and insects in a forest. Which term covers these organisms collectively?",
    "answer": "Fauna",
    "distractors": [
      "Flora",
      "Soil profile",
      "Vegetation type only"
    ],
    "explanation": "Deer, birds, reptiles and insects are animals, so collectively they form part of the fauna of the forest. Flora would cover the plants present in that area.",
    "sourceFactIds": [
      "FAUNA-SURVEY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-003",
    "qlName": "Flora and fauna",
    "difficulty": "Medium",
    "stem": "Which statement is correct about flora and fauna?",
    "answer": "They refer respectively to plant life and animal life of a region",
    "distractors": [
      "Both terms refer only to forests",
      "Flora refers only to crops and fauna only to livestock",
      "Both terms refer to climatic factors"
    ],
    "explanation": "Flora and fauna are general biological terms for the plant and animal life of a region. They are not restricted to cultivated species, forests, livestock or any one climatic setting.",
    "sourceFactIds": [
      "FLORA-FAUNA-REGION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-004",
    "qlName": "Indigenous and endemic vegetation",
    "difficulty": "Easy",
    "stem": "In the NCERT usage for this chapter, virgin vegetation that is purely Indian is called what?",
    "answer": "Endemic or indigenous vegetation",
    "distractors": [
      "Exotic vegetation",
      "Plantation vegetation",
      "Seasonal vegetation"
    ],
    "explanation": "NCERT uses the terms endemic or indigenous for virgin vegetation regarded as purely Indian. These terms are contrasted in the chapter with plants that have come from outside India.",
    "sourceFactIds": [
      "INDIGENOUS-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-004",
    "qlName": "Indigenous and endemic vegetation",
    "difficulty": "Easy",
    "stem": "Which term is used in the chapter for vegetation native to India rather than introduced from outside?",
    "answer": "Indigenous",
    "distractors": [
      "Exotic",
      "Cultivated only",
      "Artificial"
    ],
    "explanation": "Indigenous vegetation refers to vegetation native to the country in the chapter's terminology. It is contrasted with exotic plants that originated outside India and were introduced later.",
    "sourceFactIds": [
      "INDIGENOUS-NATIVE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-004",
    "qlName": "Indigenous and endemic vegetation",
    "difficulty": "Medium",
    "stem": "Which pair is correctly matched according to the chapter's terminology?",
    "answer": "Indigenous—native to India; exotic—introduced from outside India",
    "distractors": [
      "Indigenous—introduced from abroad; exotic—native to India",
      "Indigenous—cultivated crop only; exotic—wild animal",
      "Indigenous—rainfall; exotic—soil"
    ],
    "explanation": "The distinction is based on origin. Indigenous vegetation is native to India in the chapter's usage, while exotic plants have come from outside the country.",
    "sourceFactIds": [
      "INDIGENOUS-EXOTIC-PAIR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-004",
    "qlName": "Indigenous and endemic vegetation",
    "difficulty": "Medium",
    "stem": "A plant belongs naturally to India's original virgin vegetation. Which label fits the chapter's classification?",
    "answer": "Indigenous or endemic",
    "distractors": [
      "Exotic",
      "Imported plantation only",
      "Seasonal crop"
    ],
    "explanation": "A plant that belongs to India's original virgin vegetation is treated as indigenous or endemic in the NCERT chapter. The label reflects native origin rather than present-day cultivation or commercial use.",
    "sourceFactIds": [
      "INDIGENOUS-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-004",
    "qlName": "Indigenous and endemic vegetation",
    "difficulty": "Medium",
    "stem": "What is the key idea behind the term 'indigenous' in this vegetation chapter?",
    "answer": "Native origin within India",
    "distractors": [
      "High commercial value",
      "Growth only above the snowline",
      "Dependence on irrigation"
    ],
    "explanation": "The key idea is geographic origin: indigenous vegetation is native to India in the textbook classification. Commercial value, altitude and irrigation do not determine whether a plant is indigenous.",
    "sourceFactIds": [
      "INDIGENOUS-KEY-IDEA"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-004",
    "qlName": "Indigenous and endemic vegetation",
    "difficulty": "Hard",
    "stem": "Consider the statements: I. Indigenous vegetation is native to India in the chapter's classification. II. A plant introduced from another country is classified as exotic. Which option is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Both statements follow the chapter's origin-based terminology. Indigenous vegetation is native to India, while plants brought from outside India are placed in the exotic category.",
    "sourceFactIds": [
      "INDIGENOUS-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-005",
    "qlName": "Exotic vegetation",
    "difficulty": "Easy",
    "stem": "Plants that have come to India from outside the country are termed what?",
    "answer": "Exotic plants",
    "distractors": [
      "Indigenous plants",
      "Virgin vegetation only",
      "Endemic animals"
    ],
    "explanation": "Exotic plants are those that originated outside India and were introduced into the country. The term is based on geographic origin rather than on whether a plant is useful, wild or cultivated.",
    "sourceFactIds": [
      "EXOTIC-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-005",
    "qlName": "Exotic vegetation",
    "difficulty": "Easy",
    "stem": "Which term best fits a plant introduced into India from another country?",
    "answer": "Exotic",
    "distractors": [
      "Indigenous",
      "Endemic in the chapter's usage",
      "Native"
    ],
    "explanation": "A plant introduced from another country is exotic because its origin lies outside India. Indigenous or native vegetation refers to plants belonging naturally to the country.",
    "sourceFactIds": [
      "EXOTIC-INTRODUCED"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-005",
    "qlName": "Exotic vegetation",
    "difficulty": "Medium",
    "stem": "What is the decisive feature for classifying a plant as exotic?",
    "answer": "It originated outside India and was introduced into the country",
    "distractors": [
      "It grows in a forest",
      "It needs heavy rainfall",
      "It is commercially valuable"
    ],
    "explanation": "Exotic status depends on the plant's geographic origin and introduction from outside India. Forest habitat, rainfall requirement or commercial value does not by itself make a plant exotic.",
    "sourceFactIds": [
      "EXOTIC-CRITERION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-005",
    "qlName": "Exotic vegetation",
    "difficulty": "Medium",
    "stem": "Which statement is correct?",
    "answer": "A plant can be cultivated in India and still be exotic if its origin is outside India",
    "distractors": [
      "Every cultivated plant is indigenous",
      "Every forest plant is exotic",
      "Exotic plants must grow only in deserts"
    ],
    "explanation": "Cultivation within India does not change the original geographic origin of a species. If the plant came from outside India, it remains exotic in this classification even when widely grown here.",
    "sourceFactIds": [
      "EXOTIC-CULTIVATION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-005",
    "qlName": "Exotic vegetation",
    "difficulty": "Medium",
    "stem": "Which distinction between indigenous and exotic plants is correct?",
    "answer": "The distinction concerns native versus introduced origin",
    "distractors": [
      "The distinction concerns tall versus short plants",
      "The distinction concerns trees versus grasses",
      "The distinction concerns wet versus dry climate"
    ],
    "explanation": "Indigenous and exotic are origin-based categories. They do not classify plants by height, growth form or the amount of rainfall in the place where they currently grow.",
    "sourceFactIds": [
      "EXOTIC-VS-INDIGENOUS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-005",
    "qlName": "Exotic vegetation",
    "difficulty": "Medium",
    "stem": "A species grows successfully in India but historical evidence shows that it was introduced from abroad. How should it be classified in this chapter?",
    "answer": "Exotic",
    "distractors": [
      "Indigenous solely because it grows in India",
      "Virgin solely because it is old",
      "Fauna"
    ],
    "explanation": "Successful growth in India does not make an introduced species indigenous. Because the species came from outside the country, the chapter's origin-based classification treats it as exotic.",
    "sourceFactIds": [
      "EXOTIC-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-006",
    "qlName": "Relief and land controls",
    "difficulty": "Easy",
    "stem": "Which physical factor can influence natural vegetation by affecting the use and form of land?",
    "answer": "Relief",
    "distractors": [
      "Longitude alone",
      "Currency",
      "Population census"
    ],
    "explanation": "Relief influences natural vegetation because slope, elevation and the nature of the land affect both plant growth and human land use. It works together with soil and climate rather than acting in isolation.",
    "sourceFactIds": [
      "RELIEF-FACTOR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-006",
    "qlName": "Relief and land controls",
    "difficulty": "Easy",
    "stem": "Fertile level land is commonly used for which purpose, reducing the area available for natural vegetation?",
    "answer": "Agriculture",
    "distractors": [
      "Glacial erosion",
      "Coral growth",
      "Volcanic activity"
    ],
    "explanation": "Fertile and level land is often preferred for agriculture because it is easier to cultivate. As a result, such land may retain less natural vegetation than rough terrain unsuitable for intensive farming.",
    "sourceFactIds": [
      "RELIEF-LEVEL-LAND"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-006",
    "qlName": "Relief and land controls",
    "difficulty": "Medium",
    "stem": "Why do undulating and rough terrains often retain more grassland or woodland than fertile plains?",
    "answer": "They are less suitable for intensive cultivation and can support natural cover",
    "distractors": [
      "They always receive more than 200 cm of rain",
      "They contain no soil",
      "They remain permanently snow-covered"
    ],
    "explanation": "Rough and undulating land is generally harder to cultivate intensively than fertile level plains. Such terrain can therefore retain grassland and woodland that also provide habitat for wildlife.",
    "sourceFactIds": [
      "RELIEF-ROUGH-TERRAIN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-006",
    "qlName": "Relief and land controls",
    "difficulty": "Medium",
    "stem": "Which comparison best shows the effect of landform on vegetation?",
    "answer": "Level fertile plains are often cultivated, while rough terrain may retain grassland and woodland",
    "distractors": [
      "Both landforms always carry identical vegetation",
      "Rough terrain is always used for paddy cultivation",
      "Level plains can never support plants"
    ],
    "explanation": "Landform affects both natural growth and human use. Fertile level plains are commonly converted to agriculture, whereas rough terrain often retains more natural grassland or woodland.",
    "sourceFactIds": [
      "RELIEF-LAND-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-006",
    "qlName": "Relief and land controls",
    "difficulty": "Medium",
    "stem": "How can relief influence wildlife habitat indirectly?",
    "answer": "By helping determine where grassland and woodland remain",
    "distractors": [
      "By changing animals into plants",
      "By removing all soil from every slope",
      "By making rainfall unnecessary"
    ],
    "explanation": "Relief affects the pattern of natural vegetation, and that vegetation provides food and shelter for wildlife. Rough terrains that retain grassland and woodland can therefore support important habitats.",
    "sourceFactIds": [
      "RELIEF-WILDLIFE-LINK"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-006",
    "qlName": "Relief and land controls",
    "difficulty": "Hard",
    "stem": "Two areas have similar regional climate: Area A is fertile and level, while Area B is rough and undulating. Why might Area B retain more natural woodland?",
    "answer": "Area A is more likely to be converted to cultivation, while rough Area B is less suitable for intensive farming",
    "distractors": [
      "Area B must receive twice as much rainfall",
      "Area A cannot support any vegetation",
      "Rough land automatically becomes evergreen forest"
    ],
    "explanation": "Even under similar regional climate, landform can change how people use the surface. Fertile level land is attractive for agriculture, while rough terrain is less easily cultivated and may therefore retain more natural vegetation.",
    "sourceFactIds": [
      "RELIEF-INTEGRATED-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-007",
    "qlName": "Soil controls on vegetation",
    "difficulty": "Easy",
    "stem": "Which vegetation is a common match for sandy desert soil?",
    "answer": "Cactus and thorny bushes",
    "distractors": [
      "Mangroves",
      "Dense alpine meadow only",
      "Tropical evergreen canopy only"
    ],
    "explanation": "Sandy desert soils have low moisture availability and support drought-resistant vegetation such as cactus and thorny bushes. The vegetation reflects the dry soil and climate conditions of desert regions.",
    "sourceFactIds": [
      "SOIL-DESERT-VEGETATION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-007",
    "qlName": "Soil controls on vegetation",
    "difficulty": "Easy",
    "stem": "Wet, marshy and deltaic soils are especially suitable for which vegetation?",
    "answer": "Mangroves and deltaic vegetation",
    "distractors": [
      "Cactus and thorn scrub",
      "Alpine grasses only",
      "Dry deciduous teak only"
    ],
    "explanation": "Wet marshy deltaic soils support mangroves and related deltaic vegetation because plants there are adapted to waterlogged and often tidal conditions. This contrasts with the dry vegetation of sandy desert soils.",
    "sourceFactIds": [
      "SOIL-DELTA-MANGROVE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-007",
    "qlName": "Soil controls on vegetation",
    "difficulty": "Medium",
    "stem": "Which soil–vegetation pair is correctly matched?",
    "answer": "Sandy desert soil—cactus and thorny bushes",
    "distractors": [
      "Marshy deltaic soil—desert cactus",
      "Sandy desert soil—mangrove forest",
      "Waterlogged deltaic soil—dry thorn scrub"
    ],
    "explanation": "Sandy desert soil is naturally linked with drought-resistant cactus and thorny bushes. Mangroves instead fit wet, marshy and deltaic soils where waterlogging is common.",
    "sourceFactIds": [
      "SOIL-PAIR-DESERT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-007",
    "qlName": "Soil controls on vegetation",
    "difficulty": "Medium",
    "stem": "Why can different soils support different kinds of natural vegetation even within the same country?",
    "answer": "Soil properties influence water, nutrients and rooting conditions available to plants",
    "distractors": [
      "All soils have identical physical properties",
      "Vegetation is unrelated to the ground it grows in",
      "Only latitude controls plant growth"
    ],
    "explanation": "Soil affects moisture storage, nutrient supply, drainage and the space available for roots. These differences help explain why vegetation changes from sandy deserts to marshy deltas and mountain slopes.",
    "sourceFactIds": [
      "SOIL-CONTROL-REASON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-007",
    "qlName": "Soil controls on vegetation",
    "difficulty": "Medium",
    "stem": "A low-lying delta has wet, marshy soil and regular waterlogging. Which vegetation clue fits best?",
    "answer": "Mangrove vegetation",
    "distractors": [
      "Desert thorn scrub",
      "Cactus-dominated vegetation",
      "Cold alpine scrub only"
    ],
    "explanation": "Wet marshy deltaic soil is a strong clue for mangrove vegetation. Mangroves are adapted to waterlogged coastal and deltaic settings rather than the dry conditions required by cactus and thorn scrub.",
    "sourceFactIds": [
      "SOIL-DELTA-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-007",
    "qlName": "Soil controls on vegetation",
    "difficulty": "Hard",
    "stem": "Site A has dry sandy soil; Site B has wet marshy deltaic soil. Which vegetation sequence is most likely?",
    "answer": "Cactus and thorny bushes at A; mangroves at B",
    "distractors": [
      "Mangroves at A; cactus at B",
      "Evergreen forest at A; alpine meadow at B",
      "Identical vegetation at both sites"
    ],
    "explanation": "Dry sandy soil favours drought-resistant cactus and thorny bushes, while wet marshy deltaic soil favours mangroves. The contrast shows how soil moisture and drainage can strongly shape vegetation type.",
    "sourceFactIds": [
      "SOIL-INTEGRATED-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-008",
    "qlName": "Temperature and photoperiod controls",
    "difficulty": "Easy",
    "stem": "Which climatic factor changes with altitude and strongly affects the type and growth of vegetation?",
    "answer": "Temperature",
    "distractors": [
      "Currency value",
      "Political boundary",
      "Time zone alone"
    ],
    "explanation": "Temperature strongly affects vegetation, and it generally falls as altitude increases. This helps produce changes from tropical to subtropical, temperate and alpine vegetation on high mountain slopes.",
    "sourceFactIds": [
      "TEMPERATURE-CONTROL"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-008",
    "qlName": "Temperature and photoperiod controls",
    "difficulty": "Easy",
    "stem": "What does 'photoperiod' mean in the study of vegetation?",
    "answer": "The duration of sunlight received by a place",
    "distractors": [
      "The amount of soil in a field",
      "The speed of a river",
      "The depth of groundwater only"
    ],
    "explanation": "Photoperiod is the duration of sunlight received at a place. Differences in latitude, altitude, season and length of day change this duration and can influence plant growth.",
    "sourceFactIds": [
      "PHOTOPERIOD-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-008",
    "qlName": "Temperature and photoperiod controls",
    "difficulty": "Medium",
    "stem": "Why does vegetation change with increasing altitude on Himalayan and Peninsular hills?",
    "answer": "Temperature falls with height and alters growing conditions",
    "distractors": [
      "Rainfall becomes unnecessary at higher elevations",
      "Soil disappears at exactly the same height everywhere",
      "Photoperiod becomes zero above 915 m"
    ],
    "explanation": "Higher altitude generally brings lower temperature, which changes the conditions available to plants. This produces altitudinal changes from warmer-climate vegetation toward temperate and alpine forms.",
    "sourceFactIds": [
      "TEMPERATURE-ALTITUDE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-008",
    "qlName": "Temperature and photoperiod controls",
    "difficulty": "Medium",
    "stem": "Above about 915 m on many Himalayan and Peninsular slopes, which change becomes important for vegetation?",
    "answer": "The fall in temperature with height",
    "distractors": [
      "A sudden end to all rainfall",
      "Permanent conversion of soil to sand",
      "Complete disappearance of sunlight"
    ],
    "explanation": "NCERT highlights the fall in temperature above about 915 m as an important influence on vegetation type and growth. The effect combines with moisture, soil and other local conditions rather than acting alone.",
    "sourceFactIds": [
      "TEMPERATURE-915M"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-008",
    "qlName": "Temperature and photoperiod controls",
    "difficulty": "Medium",
    "stem": "Why can trees grow faster during seasons with longer daylight, other conditions being suitable?",
    "answer": "A longer photoperiod provides more time for sunlight-dependent growth processes",
    "distractors": [
      "Longer days remove the need for water",
      "Sunlight changes fauna into flora",
      "Longer days make every soil fertile"
    ],
    "explanation": "Longer daylight increases the duration during which plants receive sunlight, supporting photosynthetic activity when moisture and temperature are suitable. This is why photoperiod is included among vegetation controls.",
    "sourceFactIds": [
      "PHOTOPERIOD-GROWTH"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-008",
    "qlName": "Temperature and photoperiod controls",
    "difficulty": "Medium",
    "stem": "Which factors can cause the duration of sunlight to vary from place to place or season to season?",
    "answer": "Latitude, altitude and season",
    "distractors": [
      "Soil colour alone",
      "River length and dam height",
      "Crop price and population"
    ],
    "explanation": "Photoperiod varies because the duration of daylight changes with latitude, altitude and season. These changes influence plant growth together with temperature, moisture and soil conditions.",
    "sourceFactIds": [
      "PHOTOPERIOD-VARIATION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-009",
    "qlName": "Precipitation and integrated vegetation controls",
    "difficulty": "Easy",
    "stem": "How does natural vegetation generally differ between high-rainfall and low-rainfall areas?",
    "answer": "High-rainfall areas usually support denser vegetation",
    "distractors": [
      "Low-rainfall areas always support denser forests",
      "Rainfall has no effect on vegetation",
      "All rainfall zones support identical vegetation"
    ],
    "explanation": "Areas receiving heavier rainfall generally support denser natural vegetation because more moisture is available for plant growth. Drier areas tend to have more open vegetation adapted to water shortage.",
    "sourceFactIds": [
      "PRECIPITATION-DENSITY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-009",
    "qlName": "Precipitation and integrated vegetation controls",
    "difficulty": "Easy",
    "stem": "Which climatic element directly supplies much of the moisture needed by natural vegetation?",
    "answer": "Precipitation",
    "distractors": [
      "Longitude",
      "Magnetic declination",
      "Political boundary"
    ],
    "explanation": "Precipitation supplies water to soils and plants and is therefore a major control on vegetation density and type. Its effect works together with temperature, soil, relief and evaporation.",
    "sourceFactIds": [
      "PRECIPITATION-MOISTURE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-009",
    "qlName": "Precipitation and integrated vegetation controls",
    "difficulty": "Medium",
    "stem": "Why are forests usually denser in areas of heavier rainfall than in areas of scanty rainfall?",
    "answer": "Greater moisture availability supports more continuous plant growth",
    "distractors": [
      "Heavy rain removes the need for soil",
      "Low rainfall always produces mangroves",
      "Rainfall changes elevation"
    ],
    "explanation": "More rainfall generally increases the moisture available to plants and supports denser, taller vegetation where other conditions are favourable. Limited rainfall favours more open and drought-resistant plant forms.",
    "sourceFactIds": [
      "PRECIPITATION-REASON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-009",
    "qlName": "Precipitation and integrated vegetation controls",
    "difficulty": "Medium",
    "stem": "Which group contains the main climatic controls on natural vegetation discussed in the chapter?",
    "answer": "Temperature, photoperiod and precipitation",
    "distractors": [
      "Currency, language and population",
      "River length, longitude and mineral price",
      "Political boundary, road density and literacy"
    ],
    "explanation": "The chapter identifies temperature, duration of sunlight and precipitation as important climatic controls on natural vegetation. Their effects combine with relief and soil to create regional vegetation patterns.",
    "sourceFactIds": [
      "CLIMATE-CONTROLS-GROUP"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-009",
    "qlName": "Precipitation and integrated vegetation controls",
    "difficulty": "Medium",
    "stem": "A region becomes cooler with altitude but also receives adequate rainfall. Why can its vegetation still differ from a warm wet lowland?",
    "answer": "Vegetation responds to several controls, including temperature as well as moisture",
    "distractors": [
      "Rainfall is the only factor that ever matters",
      "Altitude affects animals but never plants",
      "Cooler conditions always produce desert scrub"
    ],
    "explanation": "Adequate rainfall alone does not determine vegetation type. Lower temperature with altitude changes growing conditions, so a cool wet slope can support vegetation different from that of a warm wet lowland.",
    "sourceFactIds": [
      "INTEGRATED-TEMP-RAIN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-009",
    "qlName": "Precipitation and integrated vegetation controls",
    "difficulty": "Hard",
    "stem": "Region A is warm and very wet, Region B is hot and dry with sandy soil, and Region C is cooler because of high altitude. What best explains their different natural vegetation?",
    "answer": "Different combinations of climate, soil and relief create different growing conditions",
    "distractors": [
      "Only latitude matters in every region",
      "Vegetation differences are unrelated to physical conditions",
      "All three regions should naturally carry the same forest type"
    ],
    "explanation": "Natural vegetation reflects several interacting controls rather than a single universal factor. Rainfall and temperature shape moisture and energy conditions, while soil and relief further modify the plants that can thrive in each region.",
    "sourceFactIds": [
      "INTEGRATED-CONTROLS"
    ]
  }
]);

export const GEO_VEG_001_CP001_REVIEW_BATCH_V1: readonly GeoVeg001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-VEG-001-CP001-Q${String(index + 1).padStart(3, "0")}`,
      qlId: raw.qlId,
      qlName: raw.qlName,
      difficulty: raw.difficulty,
      stem: raw.stem,
      options: placeGeoVegOptions(raw.answer, raw.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: raw.answer,
      explanation: raw.explanation,
      sourceIds: GEO_VEG_001_SOURCE_IDS,
      sourceFactIds: Object.freeze([...raw.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED = /associated with|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|sourceFact|runtimeRegistered|review-only|generator/i;

export function auditGeoVeg001Cp001ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoVeg001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_VEG_001_CP001_REVIEW_BATCH_V1) {
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

  if (GEO_VEG_001_CP001_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_VEG_001_CP001_REVIEW_BATCH_V1.length);
  for (let n = 1; n <= 9; n += 1) {
    const qlId = "GEO-VEG-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_VEG_001_CP001_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
