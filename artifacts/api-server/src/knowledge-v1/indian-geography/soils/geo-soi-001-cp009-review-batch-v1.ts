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
    "qlId": "GEO-SOI-001-QL-073",
    "qlName": "Alluvial soil and sugarcane",
    "difficulty": "Easy",
    "stem": "Which soil is especially suitable for sugarcane cultivation in the fertile northern plains?",
    "answer": "Alluvial soil",
    "distractors": [
      "Arid soil",
      "Forest soil",
      "Laterite soil"
    ],
    "explanation": "Alluvial soil is highly fertile and contains useful proportions of potash, phosphoric acid and lime. These conditions make it well suited to sugarcane cultivation in many river-plain regions.",
    "sourceFactIds": [
      "ALLUVIAL-SUGARCANE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-073",
    "qlName": "Alluvial soil and sugarcane",
    "difficulty": "Easy",
    "stem": "Sugarcane is a standard crop match for which major soil group of India?",
    "answer": "Alluvial soil",
    "distractors": [
      "Arid soil",
      "Forest soil",
      "Laterite soil"
    ],
    "explanation": "Alluvial soil is a standard sugarcane soil because of its high fertility and balanced mineral supply. Large alluvial tracts are therefore intensively cultivated for crops such as sugarcane.",
    "sourceFactIds": [
      "ALLUVIAL-SUGARCANE-MATCH"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-073",
    "qlName": "Alluvial soil and sugarcane",
    "difficulty": "Medium",
    "stem": "A fertile river-plain field is rich in potash, phosphoric acid and lime. Which crop-soil pair is most likely?",
    "answer": "Sugarcane — alluvial soil",
    "distractors": [
      "Tea — arid soil",
      "Cotton — forest soil",
      "Cashew — khadar only"
    ],
    "explanation": "The nutrient pattern and river-plain setting indicate alluvial soil. NCERT specifically lists sugarcane among the crops for which this fertile soil is highly suitable.",
    "sourceFactIds": [
      "ALLUVIAL-SUGARCANE-NUTRIENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-073",
    "qlName": "Alluvial soil and sugarcane",
    "difficulty": "Medium",
    "stem": "Why is sugarcane often grown successfully on alluvial soil?",
    "answer": "The soil is fertile and contains useful plant nutrients",
    "distractors": [
      "The soil is permanently frozen",
      "The soil is extremely saline and dry",
      "The soil has no fine particles"
    ],
    "explanation": "Alluvial soils are generally very fertile and contain adequate potash, phosphoric acid and lime. That nutrient supply supports demanding crops such as sugarcane when moisture and management are suitable.",
    "sourceFactIds": [
      "ALLUVIAL-SUGARCANE-REASON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-073",
    "qlName": "Alluvial soil and sugarcane",
    "difficulty": "Medium",
    "stem": "Which crop would be the strongest clue for fertile alluvial soil in a standard soil-crop question?",
    "answer": "Sugarcane",
    "distractors": [
      "Saffron",
      "Apple only",
      "Tea on steep laterite slopes"
    ],
    "explanation": "Sugarcane is one of the crops explicitly linked with fertile alluvial soil in NCERT. The clue becomes stronger when the question also mentions river plains or high soil fertility.",
    "sourceFactIds": [
      "ALLUVIAL-SUGARCANE-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-073",
    "qlName": "Alluvial soil and sugarcane",
    "difficulty": "Hard",
    "stem": "Field A is fertile river alluvium with adequate potash, phosphoric acid and lime; Field B is dry saline sand. Which field is better suited to sugarcane?",
    "answer": "Field A",
    "distractors": [
      "Field B",
      "Both are equally suitable because soil does not matter",
      "Neither can support sugarcane"
    ],
    "explanation": "Field A has the fertility and nutrient balance typical of productive alluvial soil. Field B has the low moisture and salinity of arid soil, so it is a much weaker match for sugarcane without major improvement.",
    "sourceFactIds": [
      "ALLUVIAL-SUGARCANE-COMPARE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-074",
    "qlName": "Alluvial soil and paddy",
    "difficulty": "Easy",
    "stem": "Paddy is commonly grown on which fertile soil group mentioned in NCERT?",
    "answer": "Alluvial soil",
    "distractors": [
      "Arid soil",
      "Forest soil",
      "Black soil only"
    ],
    "explanation": "Alluvial soil is one of the major soils suitable for paddy because it is generally fertile and supports intensive cultivation. River plains and deltaic tracts provide extensive areas of this soil.",
    "sourceFactIds": [
      "ALLUVIAL-PADDY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-074",
    "qlName": "Alluvial soil and paddy",
    "difficulty": "Easy",
    "stem": "Which soil-crop pair is correctly matched?",
    "answer": "Alluvial soil — paddy",
    "distractors": [
      "Arid soil — tea",
      "Forest soil — sugarcane as its defining crop",
      "Laterite soil — wheat as its standard crop"
    ],
    "explanation": "Paddy is explicitly listed among the crops suited to fertile alluvial soil. This relation is common across river plains and deltaic areas where water availability also supports rice cultivation.",
    "sourceFactIds": [
      "ALLUVIAL-PADDY-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-074",
    "qlName": "Alluvial soil and paddy",
    "difficulty": "Medium",
    "stem": "A deltaic tract has deep fertile alluvium and reliable water. Which crop is a natural exam-grade match?",
    "answer": "Paddy",
    "distractors": [
      "Saffron",
      "Apple",
      "Cotton as the defining clue"
    ],
    "explanation": "Deltaic alluvial soil is fertile and often occurs where irrigation or surface water is readily available. Paddy is therefore a strong crop match for such alluvial tracts.",
    "sourceFactIds": [
      "ALLUVIAL-PADDY-DELTA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-074",
    "qlName": "Alluvial soil and paddy",
    "difficulty": "Medium",
    "stem": "Why is paddy a useful clue for alluvial regions?",
    "answer": "Alluvial soil is fertile and extensive across major river plains and deltas",
    "distractors": [
      "Alluvial soil is always dry and saline",
      "Alluvial soil forms only on steep mountain slopes",
      "Alluvial soil is poor in plant nutrients"
    ],
    "explanation": "Alluvial soil combines high fertility with extensive river-plain and deltaic distribution. These conditions support intensive cultivation, and paddy is one of the standard crops listed for this soil.",
    "sourceFactIds": [
      "ALLUVIAL-PADDY-REASON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-074",
    "qlName": "Alluvial soil and paddy",
    "difficulty": "Medium",
    "stem": "Which setting best supports the soil-crop relation 'alluvial soil — paddy'?",
    "answer": "A fertile river plain or delta",
    "distractors": [
      "A snow-covered Himalayan ridge",
      "A dry desert dune belt",
      "A steep lateritic hill without treatment"
    ],
    "explanation": "Alluvial soil is formed by river deposition and is widespread across plains and deltas. Paddy fits these fertile lowland settings far better than dry desert or exposed mountain environments.",
    "sourceFactIds": [
      "ALLUVIAL-PADDY-SETTING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-074",
    "qlName": "Alluvial soil and paddy",
    "difficulty": "Hard",
    "stem": "A question gives three clues: river deposition, high fertility and paddy cultivation. Which soil is the best identification?",
    "answer": "Alluvial soil",
    "distractors": [
      "Arid soil",
      "Black soil",
      "Forest soil"
    ],
    "explanation": "River deposition identifies the soil as alluvial, and its high fertility supports the crop clue. Paddy is one of the standard crops grown on fertile alluvial soils, so all three clues point to the same answer.",
    "sourceFactIds": [
      "ALLUVIAL-PADDY-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-075",
    "qlName": "Alluvial soil with wheat, cereals and pulses",
    "difficulty": "Easy",
    "stem": "Wheat is one of the major crops suited to which fertile Indian soil?",
    "answer": "Alluvial soil",
    "distractors": [
      "Arid soil",
      "Laterite soil",
      "Forest soil"
    ],
    "explanation": "NCERT lists wheat among the crops well suited to alluvial soil. The soil's fertility and useful mineral content support intensive cereal cultivation across large parts of the northern plains.",
    "sourceFactIds": [
      "ALLUVIAL-WHEAT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-075",
    "qlName": "Alluvial soil with wheat, cereals and pulses",
    "difficulty": "Easy",
    "stem": "Which crop group is commonly supported by fertile alluvial soils?",
    "answer": "Cereals and pulses",
    "distractors": [
      "Only plantation crops",
      "Only orchard crops",
      "Only desert shrubs"
    ],
    "explanation": "Alluvial soils support a wide range of crops, including cereals and pulses. Their high fertility and balanced mineral supply make them important agricultural soils across India's major plains.",
    "sourceFactIds": [
      "ALLUVIAL-CEREALS-PULSES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-075",
    "qlName": "Alluvial soil with wheat, cereals and pulses",
    "difficulty": "Medium",
    "stem": "A farmer has fertile alluvial land in the northern plains. Which crop is a standard soil match?",
    "answer": "Wheat",
    "distractors": [
      "Tea on a steep laterite hill",
      "Cashew on red laterite soil",
      "Saffron on mountain soil"
    ],
    "explanation": "Wheat is explicitly listed among the crops suited to alluvial soil. The northern plains contain vast fertile alluvial tracts, making the soil-crop relation especially common there.",
    "sourceFactIds": [
      "ALLUVIAL-WHEAT-NORTH"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-075",
    "qlName": "Alluvial soil with wheat, cereals and pulses",
    "difficulty": "Medium",
    "stem": "Which statement best reflects the crop range of alluvial soil?",
    "answer": "It supports wheat and other cereal and pulse crops",
    "distractors": [
      "It is restricted to cotton only",
      "It cannot support food grains",
      "It is useful only after desert irrigation"
    ],
    "explanation": "Alluvial soil is not tied to one crop. Its fertility supports wheat as well as other cereals and pulses, which helps explain the intensive agriculture of major alluvial regions.",
    "sourceFactIds": [
      "ALLUVIAL-CROP-RANGE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-075",
    "qlName": "Alluvial soil with wheat, cereals and pulses",
    "difficulty": "Medium",
    "stem": "Why are alluvial regions often intensively cultivated with cereals and pulses?",
    "answer": "The soil is generally fertile and nutrient-supplied",
    "distractors": [
      "The soil is permanently frozen",
      "The soil is always highly acidic",
      "The soil lacks mineral nutrients"
    ],
    "explanation": "Alluvial soil commonly contains useful proportions of potash, phosphoric acid and lime. This fertility supports repeated cultivation of wheat, other cereals and pulse crops under suitable moisture conditions.",
    "sourceFactIds": [
      "ALLUVIAL-CEREAL-FERTILITY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-075",
    "qlName": "Alluvial soil with wheat, cereals and pulses",
    "difficulty": "Hard",
    "stem": "A soil supports sugarcane, paddy, wheat, other cereals and pulses. Which soil has the strongest textbook fit?",
    "answer": "Alluvial soil",
    "distractors": [
      "Arid soil",
      "Forest soil",
      "Laterite soil"
    ],
    "explanation": "This wide crop list is characteristic of fertile alluvial soil in NCERT. The same soil group supports several food grains and commercial crops because of its favourable nutrient status and extensive plain distribution.",
    "sourceFactIds": [
      "ALLUVIAL-CROP-LIST"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-076",
    "qlName": "Black soil and cotton",
    "difficulty": "Easy",
    "stem": "Which crop is black soil especially ideal for growing?",
    "answer": "Cotton",
    "distractors": [
      "Tea",
      "Cashew nut",
      "Paddy as its defining crop"
    ],
    "explanation": "Black soil is ideal for cotton cultivation and is therefore also called black cotton soil. Its fine clay and high moisture-holding capacity help support the crop during dry periods.",
    "sourceFactIds": [
      "BLACK-COTTON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-076",
    "qlName": "Black soil and cotton",
    "difficulty": "Easy",
    "stem": "The name 'black cotton soil' directly reflects its suitability for which crop?",
    "answer": "Cotton",
    "distractors": [
      "Wheat only",
      "Tea",
      "Cashew nut"
    ],
    "explanation": "Black soil is widely known as black cotton soil because cotton is its classic crop relation. The soil's moisture-retaining clay is especially useful in cotton-growing parts of the Deccan.",
    "sourceFactIds": [
      "BLACK-COTTON-NAME"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-076",
    "qlName": "Black soil and cotton",
    "difficulty": "Medium",
    "stem": "A Deccan field has deep black clay with strong moisture retention. Which crop-soil pair is the best match?",
    "answer": "Cotton — black soil",
    "distractors": [
      "Tea — arid soil",
      "Paddy — forest soil",
      "Cashew — khadar"
    ],
    "explanation": "Deep clayey black soil retains moisture well and is the standard soil for cotton. The Deccan setting strengthens the match because major black-soil tracts occur across the plateau.",
    "sourceFactIds": [
      "BLACK-COTTON-DECCAN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-076",
    "qlName": "Black soil and cotton",
    "difficulty": "Medium",
    "stem": "Why is cotton a strong identification clue for black soil?",
    "answer": "Black soil is explicitly ideal for cotton and is called black cotton soil",
    "distractors": [
      "Cotton grows only on new alluvium",
      "Black soil is defined by annual floods",
      "Cotton requires intense lateritic leaching"
    ],
    "explanation": "The crop relation is direct and textbook-standard: black soil is ideal for cotton. The alternative name 'black cotton soil' makes this one of the clearest crop-based soil identifications in Indian geography.",
    "sourceFactIds": [
      "BLACK-COTTON-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-076",
    "qlName": "Black soil and cotton",
    "difficulty": "Medium",
    "stem": "Which soil property helps explain the suitability of black soil for cotton?",
    "answer": "High moisture-holding capacity",
    "distractors": [
      "Very low moisture retention",
      "Permanent waterlogging",
      "Rapid loss of all water through coarse sand"
    ],
    "explanation": "Black soil contains extremely fine clayey material and is well known for holding moisture. That stored moisture helps crops such as cotton continue growing through periods between rainfall events.",
    "sourceFactIds": [
      "BLACK-COTTON-MOISTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-076",
    "qlName": "Black soil and cotton",
    "difficulty": "Hard",
    "stem": "Field A is fine clayey black soil that holds moisture; Field B is strongly leached acidic laterite. Which field is the better textbook match for cotton?",
    "answer": "Field A",
    "distractors": [
      "Field B",
      "Both are equally defined by cotton",
      "Neither can grow cotton"
    ],
    "explanation": "Field A matches the defining features of black cotton soil: dark colour, fine clay and strong moisture retention. Field B is laterite, which has different crop relations and usually needs fertility management.",
    "sourceFactIds": [
      "BLACK-COTTON-COMPARE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-077",
    "qlName": "Laterite soil and tea after conservation",
    "difficulty": "Easy",
    "stem": "Which plantation crop can grow well on suitably managed laterite soil?",
    "answer": "Tea",
    "distractors": [
      "Cotton",
      "Wheat as the defining crop",
      "Barley only"
    ],
    "explanation": "Laterite soil can become useful for tea cultivation after appropriate soil-conservation measures, especially in hilly areas. Management is important because laterite is often leached and nutrient-poor.",
    "sourceFactIds": [
      "LATERITE-TEA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-077",
    "qlName": "Laterite soil and tea after conservation",
    "difficulty": "Easy",
    "stem": "Tea is a standard crop relation for which soil after proper conservation measures?",
    "answer": "Laterite soil",
    "distractors": [
      "Arid soil",
      "Black soil",
      "Khadar only"
    ],
    "explanation": "NCERT links tea cultivation with laterite soil after suitable conservation treatment. This is especially relevant in hilly lateritic regions where erosion and nutrient loss must be controlled.",
    "sourceFactIds": [
      "LATERITE-TEA-MATCH"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-077",
    "qlName": "Laterite soil and tea after conservation",
    "difficulty": "Medium",
    "stem": "Why does tea cultivation on laterite soil usually require careful management?",
    "answer": "The soil is often leached, nutrient-deficient and erosion-prone",
    "distractors": [
      "The soil is renewed annually by rivers",
      "The soil is permanently frozen",
      "The soil naturally contains unlimited nutrients"
    ],
    "explanation": "Laterite soil is strongly leached and often deficient in plant nutrients, while many lateritic tracts lie on erosion-prone slopes. Conservation and fertility management therefore improve its usefulness for tea.",
    "sourceFactIds": [
      "LATERITE-TEA-MANAGEMENT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-077",
    "qlName": "Laterite soil and tea after conservation",
    "difficulty": "Medium",
    "stem": "A hilly laterite tract has undergone erosion control and soil improvement. Which crop is a strong plantation choice?",
    "answer": "Tea",
    "distractors": [
      "Cotton as the defining crop",
      "Wheat only",
      "Jute only"
    ],
    "explanation": "Tea is one of the plantation crops specifically linked with improved laterite soil. The hilly setting and conservation measures fit the textbook condition under which laterite becomes agriculturally useful.",
    "sourceFactIds": [
      "LATERITE-TEA-HILLY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-077",
    "qlName": "Laterite soil and tea after conservation",
    "difficulty": "Medium",
    "stem": "Which sequence best explains successful tea cultivation on laterite soil?",
    "answer": "Laterite soil → conservation and improvement → tea cultivation",
    "distractors": [
      "Arid soil → salt accumulation → tea cultivation",
      "Black soil → annual floods → tea cultivation",
      "Khadar → permanent snow → tea cultivation"
    ],
    "explanation": "Laterite is not automatically ideal farmland because of leaching and erosion risk. Appropriate conservation and improvement can make hilly lateritic land productive for tea cultivation.",
    "sourceFactIds": [
      "LATERITE-TEA-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-077",
    "qlName": "Laterite soil and tea after conservation",
    "difficulty": "Hard",
    "stem": "A plantation lies on a strongly leached hilly soil that became productive after conservation measures. Which soil-crop relation fits best?",
    "answer": "Laterite soil — tea",
    "distractors": [
      "Arid soil — tea",
      "Black soil — tea",
      "Khadar — tea"
    ],
    "explanation": "The combination of leaching, hilly relief, conservation treatment and plantation use points to laterite soil. Tea is one of the crops specifically mentioned for improved lateritic areas.",
    "sourceFactIds": [
      "LATERITE-TEA-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-078",
    "qlName": "Laterite soil and coffee after conservation",
    "difficulty": "Easy",
    "stem": "Coffee can be grown successfully on which soil after suitable conservation treatment?",
    "answer": "Laterite soil",
    "distractors": [
      "Arid soil",
      "Khadar only",
      "Black soil as its defining crop"
    ],
    "explanation": "Laterite soil can support coffee when appropriate soil-conservation and fertility measures are used. This relation is especially important in hilly lateritic parts of southern India.",
    "sourceFactIds": [
      "LATERITE-COFFEE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-078",
    "qlName": "Laterite soil and coffee after conservation",
    "difficulty": "Easy",
    "stem": "Which soil-crop pair is correctly matched after proper soil management?",
    "answer": "Laterite soil — coffee",
    "distractors": [
      "Arid soil — coffee",
      "Black soil — coffee as its defining crop",
      "Khadar — coffee only"
    ],
    "explanation": "Coffee is explicitly linked with suitably managed laterite soil. Because laterite is often leached and erosion-prone, conservation and soil improvement are part of the relation.",
    "sourceFactIds": [
      "LATERITE-COFFEE-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-078",
    "qlName": "Laterite soil and coffee after conservation",
    "difficulty": "Medium",
    "stem": "Why does coffee on laterite soil benefit from conservation measures?",
    "answer": "They reduce erosion and help improve a leached nutrient-poor soil",
    "distractors": [
      "They create annual flood deposits",
      "They convert the soil into black cotton soil",
      "They increase desert salinity"
    ],
    "explanation": "Laterite often occurs on slopes and has lost nutrients through strong leaching. Conservation protects the soil from further loss, while management improves conditions for coffee cultivation.",
    "sourceFactIds": [
      "LATERITE-COFFEE-REASON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-078",
    "qlName": "Laterite soil and coffee after conservation",
    "difficulty": "Medium",
    "stem": "A coffee estate occupies hilly land in a region with lateritic soil. Which practice best fits the textbook relation?",
    "answer": "Use soil-conservation and fertility measures",
    "distractors": [
      "Encourage surface erosion",
      "Remove all organic inputs",
      "Increase salt accumulation"
    ],
    "explanation": "Coffee can use laterite soil productively when the land is protected and improved. Hilly laterite is erosion-prone, so conservation and fertility management are essential parts of the crop-soil match.",
    "sourceFactIds": [
      "LATERITE-COFFEE-PRACTICE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-078",
    "qlName": "Laterite soil and coffee after conservation",
    "difficulty": "Medium",
    "stem": "Which plantation pair is commonly linked with improved laterite soil?",
    "answer": "Tea and coffee",
    "distractors": [
      "Cotton and wheat",
      "Paddy and gram only",
      "Jute and barley only"
    ],
    "explanation": "Tea and coffee are the two plantation crops specifically named for suitably conserved laterite soil. Their cultivation shows how management can overcome some of the soil's natural fertility limits.",
    "sourceFactIds": [
      "LATERITE-TEA-COFFEE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-078",
    "qlName": "Laterite soil and coffee after conservation",
    "difficulty": "Hard",
    "stem": "A soil is acidic, strongly leached and located on hilly terrain; after conservation it supports a plantation crop. Which crop is a textbook possibility?",
    "answer": "Coffee",
    "distractors": [
      "Cotton as the defining relation",
      "Wheat as the only suitable crop",
      "Saffron only"
    ],
    "explanation": "The clues point to laterite soil, which is often acidic and strongly leached. After conservation and improvement, coffee is one of the plantation crops that can be grown successfully on this soil.",
    "sourceFactIds": [
      "LATERITE-COFFEE-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-079",
    "qlName": "Red laterite soil and cashew",
    "difficulty": "Easy",
    "stem": "Red laterite soil is especially suitable for which crop in parts of southern India?",
    "answer": "Cashew nut",
    "distractors": [
      "Cotton",
      "Wheat only",
      "Jute"
    ],
    "explanation": "Red laterite soils in parts of Tamil Nadu, Andhra Pradesh and Kerala are particularly suitable for cashew nut. This is a standard crop-soil-region relation in Indian geography.",
    "sourceFactIds": [
      "LATERITE-CASHEW"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-079",
    "qlName": "Red laterite soil and cashew",
    "difficulty": "Easy",
    "stem": "Which crop is strongly linked with red laterite soils of Tamil Nadu, Andhra Pradesh and Kerala?",
    "answer": "Cashew nut",
    "distractors": [
      "Tea only",
      "Cotton",
      "Barley"
    ],
    "explanation": "Cashew nut is a recognised crop of red laterite soils in these southern states. The relation combines both soil type and regional distribution, making it useful for exam identification.",
    "sourceFactIds": [
      "LATERITE-CASHEW-STATES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-079",
    "qlName": "Red laterite soil and cashew",
    "difficulty": "Medium",
    "stem": "Which soil-crop-region match is correct?",
    "answer": "Red laterite — cashew — Tamil Nadu, Andhra Pradesh and Kerala",
    "distractors": [
      "Arid soil — tea — western Rajasthan",
      "Black soil — coffee — Punjab",
      "Khadar — cashew — Himalayan snow zone"
    ],
    "explanation": "The red laterite–cashew relation is specifically noted for Tamil Nadu, Andhra Pradesh and Kerala. The other combinations mix crops with soil and climate settings that do not fit the standard textbook pattern.",
    "sourceFactIds": [
      "LATERITE-CASHEW-REGION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-079",
    "qlName": "Red laterite soil and cashew",
    "difficulty": "Medium",
    "stem": "A warm southern upland has red laterite soil and plans a tree crop. Which crop is the strongest textbook match?",
    "answer": "Cashew nut",
    "distractors": [
      "Cotton as the defining crop",
      "Wheat only",
      "Jute only"
    ],
    "explanation": "Cashew is a standard crop relation for red laterite soil in parts of southern India. The regional and soil clues together make it a stronger match than crops tied to alluvial or black soils.",
    "sourceFactIds": [
      "LATERITE-CASHEW-UPLAND"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-079",
    "qlName": "Red laterite soil and cashew",
    "difficulty": "Medium",
    "stem": "Why is cashew a useful clue in a laterite-soil question?",
    "answer": "It is specifically suited to red laterite soils in parts of south India",
    "distractors": [
      "It is the defining crop of black soil",
      "It requires annual flood deposition",
      "It grows only in arid saline soil"
    ],
    "explanation": "Cashew is not a generic crop clue here; it is specifically linked with red laterite soils in Tamil Nadu, Andhra Pradesh and Kerala. That makes the crop-region combination especially diagnostic.",
    "sourceFactIds": [
      "LATERITE-CASHEW-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-079",
    "qlName": "Red laterite soil and cashew",
    "difficulty": "Medium",
    "stem": "Which state trio strengthens a cashew–laterite identification?",
    "answer": "Tamil Nadu, Andhra Pradesh and Kerala",
    "distractors": [
      "Punjab, Haryana and Rajasthan",
      "Bihar, Punjab and Delhi",
      "Assam, Sikkim and Ladakh"
    ],
    "explanation": "Tamil Nadu, Andhra Pradesh and Kerala are the states specifically cited for cashew on red laterite soil. Combining the crop with this southern trio gives a strong exam-grade identification.",
    "sourceFactIds": [
      "LATERITE-CASHEW-TRIO"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-080",
    "qlName": "Arid soil cultivation after irrigation",
    "difficulty": "Easy",
    "stem": "What can make arid soil cultivable in dry regions such as western Rajasthan?",
    "answer": "Proper irrigation",
    "distractors": [
      "Permanent snow cover",
      "Annual river flooding only",
      "Increased evaporation"
    ],
    "explanation": "Arid soils become cultivable after proper irrigation because water is their major natural limitation. Western Rajasthan is the standard example used to show this improvement in agricultural potential.",
    "sourceFactIds": [
      "ARID-IRRIGATION-CULTIVATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-080",
    "qlName": "Arid soil cultivation after irrigation",
    "difficulty": "Easy",
    "stem": "Which soil's agricultural use can improve greatly after proper irrigation?",
    "answer": "Arid soil",
    "distractors": [
      "Forest soil only",
      "Laterite soil only",
      "Black soil only"
    ],
    "explanation": "Arid soil has low moisture because of dry climate and rapid evaporation. Supplying dependable irrigation can overcome this limitation and make the land suitable for cultivation.",
    "sourceFactIds": [
      "ARID-IRRIGATION-USE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-080",
    "qlName": "Arid soil cultivation after irrigation",
    "difficulty": "Medium",
    "stem": "Why does irrigation have such a large effect on arid-soil agriculture?",
    "answer": "It directly corrects the severe moisture shortage",
    "distractors": [
      "It changes all sand into clay",
      "It creates volcanic parent rock",
      "It removes every salt instantly"
    ],
    "explanation": "The main physical limitation of arid soil is lack of water under a dry climate. Irrigation supplies the missing moisture, allowing crops to be grown where rainfall alone is insufficient.",
    "sourceFactIds": [
      "ARID-IRRIGATION-REASON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-080",
    "qlName": "Arid soil cultivation after irrigation",
    "difficulty": "Medium",
    "stem": "A field in western Rajasthan becomes regularly cultivated after canal water arrives. Which soil relation does this illustrate?",
    "answer": "Arid soil becomes cultivable after irrigation",
    "distractors": [
      "Laterite soil becomes black soil",
      "Forest soil becomes khadar",
      "Black soil requires annual floods"
    ],
    "explanation": "Western Rajasthan is the textbook example of arid soil becoming cultivable after proper irrigation. The water supply improves agricultural use without changing the soil into another soil group.",
    "sourceFactIds": [
      "ARID-WEST-RAJ-CULTIVATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-080",
    "qlName": "Arid soil cultivation after irrigation",
    "difficulty": "Medium",
    "stem": "Which management-crop principle is most accurate for arid soil?",
    "answer": "Cultivation depends heavily on dependable water supply",
    "distractors": [
      "The soil is naturally waterlogged",
      "Annual floods are necessary everywhere",
      "The soil cannot be cultivated under any condition"
    ],
    "explanation": "Arid soil is naturally short of moisture, so dependable irrigation is central to successful cultivation. Once water is supplied and other problems are managed, the land can become agriculturally productive.",
    "sourceFactIds": [
      "ARID-WATER-PRINCIPLE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-080",
    "qlName": "Arid soil cultivation after irrigation",
    "difficulty": "Medium",
    "stem": "Which statement best explains the agricultural transformation of arid soil?",
    "answer": "Irrigation overcomes climatic dryness and allows regular cultivation",
    "distractors": [
      "High evaporation alone improves crop growth",
      "Salt accumulation supplies all crop water",
      "Kankar automatically creates fertile topsoil"
    ],
    "explanation": "Irrigation changes the water balance of arid land by providing moisture that rainfall cannot supply. This is why dry soils in western Rajasthan can become cultivable under proper irrigation.",
    "sourceFactIds": [
      "ARID-TRANSFORMATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-081",
    "qlName": "Integrated soil-crop reasoning",
    "difficulty": "Easy",
    "stem": "Which cotton-soil pair is correctly matched?",
    "answer": "Cotton — black soil",
    "distractors": [
      "Tea — arid soil",
      "Cashew — khadar",
      "Sugarcane — forest soil"
    ],
    "explanation": "Cotton is the classic crop of black soil and gives the soil its common name, black cotton soil. The other crop-soil pairs conflict with standard textbook relations.",
    "sourceFactIds": [
      "CROP-INTEGRATED-COTTON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-081",
    "qlName": "Integrated soil-crop reasoning",
    "difficulty": "Easy",
    "stem": "Which sugarcane-soil pair is correctly matched?",
    "answer": "Sugarcane — alluvial soil",
    "distractors": [
      "Coffee — arid soil",
      "Cotton — laterite soil",
      "Cashew — black soil"
    ],
    "explanation": "Sugarcane is one of the crops specifically suited to fertile alluvial soil. This relation is strongest in river-plain regions where the soil is intensively cultivated.",
    "sourceFactIds": [
      "CROP-INTEGRATED-SUGARCANE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-081",
    "qlName": "Integrated soil-crop reasoning",
    "difficulty": "Medium",
    "stem": "Which set contains only correct soil-crop relations?",
    "answer": "Alluvial—wheat; black—cotton; improved laterite—tea",
    "distractors": [
      "Alluvial—tea; black—cashew; arid—coffee",
      "Forest—cotton; arid—tea; black—paddy only",
      "Laterite—wheat only; alluvial—cashew; black—coffee"
    ],
    "explanation": "Wheat is suited to fertile alluvial soil, cotton is the defining crop of black soil and tea can be grown on suitably managed laterite. The set combines three standard textbook crop relations.",
    "sourceFactIds": [
      "CROP-INTEGRATED-SET"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-081",
    "qlName": "Integrated soil-crop reasoning",
    "difficulty": "Medium",
    "stem": "A question gives three clues: fertile river plain with wheat, dark clayey Deccan soil with cotton, and conserved hilly laterite with coffee. Which soil sequence is correct?",
    "answer": "Alluvial, black, laterite",
    "distractors": [
      "Black, arid, alluvial",
      "Laterite, alluvial, forest",
      "Arid, forest, black"
    ],
    "explanation": "Wheat on a fertile river plain points to alluvial soil, while cotton on dark Deccan clay points to black soil. Coffee on conserved hilly laterite completes the sequence with laterite soil.",
    "sourceFactIds": [
      "CROP-INTEGRATED-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-081",
    "qlName": "Integrated soil-crop reasoning",
    "difficulty": "Medium",
    "stem": "Which crop clue most clearly separates black soil from laterite soil?",
    "answer": "Cotton for black soil versus tea or coffee for improved laterite",
    "distractors": [
      "Both are defined only by paddy",
      "Both are defined only by wheat",
      "Neither has a crop relation"
    ],
    "explanation": "Cotton is the classic black-soil crop, while improved laterite can support tea and coffee. Using these crop clues alongside soil properties gives a reliable comparative identification.",
    "sourceFactIds": [
      "CROP-BLACK-LATERITE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-081",
    "qlName": "Integrated soil-crop reasoning",
    "difficulty": "Medium",
    "stem": "Which relation correctly combines soil, management and crop?",
    "answer": "Laterite + conservation measures → tea or coffee",
    "distractors": [
      "Arid + more evaporation → tea",
      "Black + annual flooding → cashew",
      "Alluvial + permanent snow → cotton"
    ],
    "explanation": "Laterite soil often needs conservation and fertility management because it is leached and erosion-prone. After suitable treatment it can support plantation crops such as tea and coffee.",
    "sourceFactIds": [
      "CROP-MANAGEMENT-INTEGRATED"
    ]
  }
]);

export const GEO_SOI_001_CP009_REVIEW_BATCH_V1: readonly GeoSoi001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = (index + 2) % 4;
    return Object.freeze({
      questionId: `GEO-SOI-001-CP009-Q${String(index + 1).padStart(3, "0")}`,
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

export function auditGeoSoi001Cp009ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoSoi001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_SOI_001_CP009_REVIEW_BATCH_V1) {
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

  if (GEO_SOI_001_CP009_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_SOI_001_CP009_REVIEW_BATCH_V1.length);
  for (let n = 73; n <= 81; n += 1) {
    const qlId = "GEO-SOI-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "13,13,14,14") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_SOI_001_CP009_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
