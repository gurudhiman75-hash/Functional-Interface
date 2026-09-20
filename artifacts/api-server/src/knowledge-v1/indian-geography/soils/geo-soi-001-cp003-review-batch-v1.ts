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
    "qlId": "GEO-SOI-001-QL-019",
    "qlName": "Names and identity of black soil",
    "difficulty": "Easy",
    "stem": "Which Indian soil is also known as regur soil?",
    "answer": "Black soil",
    "distractors": [
      "Alluvial soil",
      "Laterite soil",
      "Arid soil"
    ],
    "explanation": "Black soil is commonly called regur soil in Indian geography. It is also widely known as black cotton soil because of its strong link with cotton cultivation in the Deccan region.",
    "sourceFactIds": [
      "BLACK-REGUR-NAME"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-019",
    "qlName": "Names and identity of black soil",
    "difficulty": "Easy",
    "stem": "The term 'black cotton soil' refers to which soil group?",
    "answer": "Black soil",
    "distractors": [
      "Red and yellow soil",
      "Forest soil",
      "Alluvial soil"
    ],
    "explanation": "Black soil is often called black cotton soil because it is especially suitable for cotton. Its fine clay content and ability to hold moisture are important reasons for this agricultural value.",
    "sourceFactIds": [
      "BLACK-COTTON-SOIL-NAME"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-019",
    "qlName": "Names and identity of black soil",
    "difficulty": "Medium",
    "stem": "Which pair is correctly matched?",
    "answer": "Regur — black soil",
    "distractors": [
      "Khadar — black soil",
      "Bhangar — laterite soil",
      "Regur — alluvial soil"
    ],
    "explanation": "Regur is another name for black soil. Khadar and bhangar are two forms of alluvial soil, so they should not be confused with the black-soil terminology.",
    "sourceFactIds": [
      "BLACK-REGUR-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-019",
    "qlName": "Names and identity of black soil",
    "difficulty": "Medium",
    "stem": "A question mentions regur, deep clay and cotton cultivation. Which soil is being described?",
    "answer": "Black soil",
    "distractors": [
      "Laterite soil",
      "Arid soil",
      "Red and yellow soil"
    ],
    "explanation": "The combination of the name regur, a clay-rich texture and cotton cultivation points to black soil. These clues commonly appear together in school geography and competitive-exam questions.",
    "sourceFactIds": [
      "BLACK-IDENTITY-CLUES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-019",
    "qlName": "Names and identity of black soil",
    "difficulty": "Medium",
    "stem": "Which statement about black soil terminology is correct?",
    "answer": "Regur and black cotton soil are commonly used names for black soil",
    "distractors": [
      "Regur means newer alluvium",
      "Black cotton soil is a form of laterite",
      "Regur refers only to mountain soil"
    ],
    "explanation": "Regur and black cotton soil are accepted names for black soil in Indian geography. The names reflect both regional usage and the soil's well-known suitability for cotton.",
    "sourceFactIds": [
      "BLACK-TERMINOLOGY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-019",
    "qlName": "Names and identity of black soil",
    "difficulty": "Hard",
    "stem": "Consider the following terms: I. Regur II. Black cotton soil III. Khadar. Which terms refer to black soil?",
    "answer": "I and II only",
    "distractors": [
      "I only",
      "II and III only",
      "I, II and III"
    ],
    "explanation": "Regur and black cotton soil both refer to black soil. Khadar is newer alluvium of active floodplains, so it belongs to the alluvial-soil classification rather than black soil.",
    "sourceFactIds": [
      "BLACK-NAME-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-020",
    "qlName": "Basaltic origin and Deccan Trap relation",
    "difficulty": "Easy",
    "stem": "Black soil is closely linked with which type of parent rock in the Deccan region?",
    "answer": "Basalt",
    "distractors": [
      "Sandstone",
      "Limestone only",
      "River silt"
    ],
    "explanation": "Black soil is strongly linked with basaltic rocks of the Deccan Trap region. Weathering of this lava-derived material helped form extensive black-soil areas over the plateau.",
    "sourceFactIds": [
      "BLACK-BASALT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-020",
    "qlName": "Basaltic origin and Deccan Trap relation",
    "difficulty": "Easy",
    "stem": "Which geological region is most strongly connected with the origin of black soil?",
    "answer": "The Deccan Trap region",
    "distractors": [
      "The Ganga delta",
      "The Thar dune field",
      "The Himalayan snow zone"
    ],
    "explanation": "The Deccan Trap is a vast basaltic lava region, and black soil developed extensively over these rocks. This is why black-soil distribution closely follows large parts of the Deccan plateau.",
    "sourceFactIds": [
      "BLACK-DECCAN-TRAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-020",
    "qlName": "Basaltic origin and Deccan Trap relation",
    "difficulty": "Medium",
    "stem": "Why is black soil common over large parts of the Deccan plateau?",
    "answer": "It developed extensively from weathered basaltic lava rocks",
    "distractors": [
      "It was deposited only by Himalayan rivers",
      "It formed only from coastal coral",
      "It developed from permanent snow"
    ],
    "explanation": "Much of the Deccan plateau is underlain by basaltic lava flows. Long weathering of these rocks produced the material from which extensive black soils developed.",
    "sourceFactIds": [
      "BLACK-WEATHERED-BASALT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-020",
    "qlName": "Basaltic origin and Deccan Trap relation",
    "difficulty": "Medium",
    "stem": "A plateau is underlain by old lava flows and carries deep dark clayey soil. Which origin is most likely?",
    "answer": "Weathering of basaltic Deccan Trap material",
    "distractors": [
      "Recent river deposition",
      "Wind-blown desert sand",
      "Marine coral accumulation"
    ],
    "explanation": "Old basaltic lava is a major parent material for black soil in India. When this rock weathers over time, it produces the clay-rich material typical of many black-soil tracts.",
    "sourceFactIds": [
      "BLACK-LAVA-ORIGIN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-020",
    "qlName": "Basaltic origin and Deccan Trap relation",
    "difficulty": "Medium",
    "stem": "Which sequence best explains the basic origin of much black soil in peninsular India?",
    "answer": "Basaltic lava rock → weathering → black soil development",
    "distractors": [
      "River silt → delta formation → black soil",
      "Coral reef → uplift → black soil",
      "Glacier ice → melting → black soil"
    ],
    "explanation": "The common school-level explanation begins with basaltic lava rocks of the Deccan Trap. Weathering changes this rock into fine mineral material from which black soil develops.",
    "sourceFactIds": [
      "BLACK-ORIGIN-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-020",
    "qlName": "Basaltic origin and Deccan Trap relation",
    "difficulty": "Hard",
    "stem": "Two regions have similar climate, but one lies on basaltic Deccan Trap rocks and the other on recent river deposits. Which region is more likely to develop typical black soil?",
    "answer": "The basaltic Deccan Trap region",
    "distractors": [
      "The recent river-deposit region",
      "Both must develop alluvial soil",
      "Rock type cannot influence soil formation"
    ],
    "explanation": "Parent material is a major control of soil formation. With climate held similar, basaltic Deccan Trap rock strongly favours black-soil development, while recent river deposits are more closely linked with alluvial soil.",
    "sourceFactIds": [
      "BLACK-PARENT-MATERIAL-REASONING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-021",
    "qlName": "Distribution of black soils",
    "difficulty": "Easy",
    "stem": "Black soil is especially extensive in which Indian state?",
    "answer": "Maharashtra",
    "distractors": [
      "Punjab",
      "Assam",
      "Kerala only"
    ],
    "explanation": "Maharashtra contains a very large area of black soil because much of the state lies over the basaltic Deccan Trap. This makes it one of the most important black-soil regions in India.",
    "sourceFactIds": [
      "BLACK-MAHARASHTRA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-021",
    "qlName": "Distribution of black soils",
    "difficulty": "Easy",
    "stem": "Which region is well known for black soils?",
    "answer": "The Malwa plateau",
    "distractors": [
      "The Ganga delta only",
      "The Brahmaputra floodplain",
      "The high Himalaya"
    ],
    "explanation": "The Malwa plateau is one of the important black-soil regions. Its volcanic and plateau setting connects it with the wider black-soil belt of central and western India.",
    "sourceFactIds": [
      "BLACK-MALWA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-021",
    "qlName": "Distribution of black soils",
    "difficulty": "Medium",
    "stem": "Which group contains major black-soil areas?",
    "answer": "Maharashtra, Madhya Pradesh and Gujarat",
    "distractors": [
      "Punjab, Haryana and Bihar only",
      "Assam, Meghalaya and Nagaland only",
      "Kerala, Goa and Lakshadweep only"
    ],
    "explanation": "Large black-soil tracts occur in Maharashtra, Madhya Pradesh and Gujarat, along with nearby plateau regions. Their distribution closely reflects the basaltic terrain of western and central India.",
    "sourceFactIds": [
      "BLACK-STATE-GROUP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-021",
    "qlName": "Distribution of black soils",
    "difficulty": "Medium",
    "stem": "Black soil extends into which plateau and adjoining region in western India?",
    "answer": "Saurashtra and the Malwa region",
    "distractors": [
      "The Sundarbans and Brahmaputra valley",
      "The Kashmir valley and Ladakh",
      "The Coromandel delta only"
    ],
    "explanation": "Black soil occurs in parts of Saurashtra and the Malwa plateau as part of the wider western-central soil belt. These regions share links with old basaltic geology and plateau relief.",
    "sourceFactIds": [
      "BLACK-SAURASHTRA-MALWA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-021",
    "qlName": "Distribution of black soils",
    "difficulty": "Medium",
    "stem": "Which river valleys also contain extensions of black soil from the Deccan plateau?",
    "answer": "Godavari and Krishna valleys",
    "distractors": [
      "Ganga and Yamuna floodplains only",
      "Teesta and Subansiri valleys only",
      "Jhelum and Chenab valleys only"
    ],
    "explanation": "Black soils extend southeastward along parts of the Godavari and Krishna valleys. This shows that the soil is not limited to plateau tops and can continue into adjoining valley regions.",
    "sourceFactIds": [
      "BLACK-GODAVARI-KRISHNA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-021",
    "qlName": "Distribution of black soils",
    "difficulty": "Hard",
    "stem": "A map marks Maharashtra, western Madhya Pradesh, parts of Gujarat and stretches toward the Godavari-Krishna valleys. Which soil belt is being shown?",
    "answer": "Black soil belt",
    "distractors": [
      "Alluvial soil belt",
      "Laterite-only belt",
      "Mountain forest soil belt"
    ],
    "explanation": "This distribution closely matches the major black-soil zone of western and central peninsular India. Maharashtra, Malwa, Gujarat and extensions toward the Godavari-Krishna system are standard location clues.",
    "sourceFactIds": [
      "BLACK-DISTRIBUTION-MAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-022",
    "qlName": "Clayey texture and moisture retention",
    "difficulty": "Easy",
    "stem": "What is a common texture of black soil?",
    "answer": "Fine and clayey",
    "distractors": [
      "Very coarse and stony everywhere",
      "Pure sand only",
      "Loose gravel only"
    ],
    "explanation": "Black soil commonly has a fine, clayey texture. The high clay content allows it to hold considerable moisture, which is an important feature in seasonal farming areas.",
    "sourceFactIds": [
      "BLACK-CLAYEY-TEXTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-022",
    "qlName": "Clayey texture and moisture retention",
    "difficulty": "Easy",
    "stem": "Which property of black soil helps it retain water for a long time?",
    "answer": "High clay content",
    "distractors": [
      "Complete absence of fine particles",
      "Only coarse sand",
      "Permanent surface ice"
    ],
    "explanation": "Clay particles are very small and hold water strongly. Because black soil contains much clay, it can store moisture longer than many coarser-textured soils.",
    "sourceFactIds": [
      "BLACK-MOISTURE-RETENTION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-022",
    "qlName": "Clayey texture and moisture retention",
    "difficulty": "Medium",
    "stem": "Why can black soil support crops even after rainfall has stopped for some time?",
    "answer": "Its clay-rich structure stores moisture",
    "distractors": [
      "It creates rainfall continuously",
      "It contains no drainage at all",
      "It receives river floods every day"
    ],
    "explanation": "Black soil has a strong moisture-holding capacity because of its fine clay content. Stored soil moisture can remain available to crops after the rainy period has weakened or ended.",
    "sourceFactIds": [
      "BLACK-STORED-MOISTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-022",
    "qlName": "Clayey texture and moisture retention",
    "difficulty": "Medium",
    "stem": "Which combination best describes typical black soil?",
    "answer": "Fine texture and high moisture-holding capacity",
    "distractors": [
      "Coarse sand and very low water retention",
      "Loose gravel and no clay",
      "Fresh river silt renewed yearly"
    ],
    "explanation": "Black soil is generally fine-textured and clay-rich, so it can retain substantial moisture. This combination distinguishes it from coarse sandy soils and recently renewed alluvial deposits.",
    "sourceFactIds": [
      "BLACK-TEXTURE-MOISTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-022",
    "qlName": "Clayey texture and moisture retention",
    "difficulty": "Medium",
    "stem": "A soil becomes sticky when wet and holds water strongly. Which feature of black soil explains this behaviour?",
    "answer": "Its high proportion of clay",
    "distractors": [
      "A complete lack of mineral particles",
      "Only wind-blown sand",
      "Its position on an active floodplain"
    ],
    "explanation": "Clay gives black soil its sticky character when wet and also explains its strong moisture retention. These same properties can make cultivation difficult if the soil is worked at the wrong moisture level.",
    "sourceFactIds": [
      "BLACK-STICKY-CLAY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-022",
    "qlName": "Clayey texture and moisture retention",
    "difficulty": "Hard",
    "stem": "Field A has deep clay-rich soil that stores moisture well; Field B has loose sandy soil that dries quickly. Which field is more typical of black soil?",
    "answer": "Field A",
    "distractors": [
      "Field B",
      "Both are equally typical",
      "Neither can contain mineral soil"
    ],
    "explanation": "Black soil is characteristically fine and clay-rich, so Field A fits its usual physical properties. The loose sandy texture of Field B would lose moisture much more quickly and is not typical of black soil.",
    "sourceFactIds": [
      "BLACK-TEXTURE-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-023",
    "qlName": "Cracking and self-ploughing character",
    "difficulty": "Easy",
    "stem": "What happens to black soil during hot, dry weather?",
    "answer": "It develops deep cracks",
    "distractors": [
      "It becomes permanent ice",
      "It turns into fresh river silt",
      "It stops containing clay"
    ],
    "explanation": "Black soil commonly develops deep cracks as it dries in hot weather. The shrinkage of its clay-rich material opens the surface and allows air to enter the soil.",
    "sourceFactIds": [
      "BLACK-DEEP-CRACKS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-023",
    "qlName": "Cracking and self-ploughing character",
    "difficulty": "Easy",
    "stem": "Why is black soil sometimes called 'self-ploughing'?",
    "answer": "Drying creates deep cracks that loosen and aerate the soil",
    "distractors": [
      "Floods plough it every year",
      "Wind removes all topsoil",
      "Roots disappear during summer"
    ],
    "explanation": "When black soil dries, it shrinks and forms wide cracks. These cracks loosen the soil and improve aeration, producing the effect often called self-ploughing.",
    "sourceFactIds": [
      "BLACK-SELF-PLOUGHING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-023",
    "qlName": "Cracking and self-ploughing character",
    "difficulty": "Medium",
    "stem": "Which seasonal change is typical of black soil?",
    "answer": "Swelling when wet and cracking when dry",
    "distractors": [
      "Freezing all year and melting in summer",
      "Becoming sand when wet and clay when dry",
      "Remaining unchanged in every season"
    ],
    "explanation": "Clay-rich black soil expands when it absorbs water and shrinks during dry periods. This repeated swelling and cracking is a distinctive physical behaviour of the soil.",
    "sourceFactIds": [
      "BLACK-SWELL-SHRINK"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-023",
    "qlName": "Cracking and self-ploughing character",
    "difficulty": "Medium",
    "stem": "How do dry-season cracks help black soil?",
    "answer": "They improve aeration and naturally loosen the surface",
    "distractors": [
      "They remove every nutrient from the soil",
      "They prevent roots from entering",
      "They convert the soil into alluvium"
    ],
    "explanation": "The cracks open spaces through the soil and allow air to move downward. They also loosen the compact clayey mass, which is why this process is linked with the idea of self-ploughing.",
    "sourceFactIds": [
      "BLACK-CRACK-AERATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-023",
    "qlName": "Cracking and self-ploughing character",
    "difficulty": "Medium",
    "stem": "A farmer notices wide cracks appearing after a long dry spell in a dark clayey field. Which soil is most likely present?",
    "answer": "Black soil",
    "distractors": [
      "Alluvial soil",
      "Laterite soil",
      "Forest soil"
    ],
    "explanation": "Wide dry-season cracks are a strong clue for black soil because its clay minerals shrink considerably as moisture is lost. The dark colour and clayey texture strengthen the identification.",
    "sourceFactIds": [
      "BLACK-CRACK-IDENTIFICATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-023",
    "qlName": "Cracking and self-ploughing character",
    "difficulty": "Hard",
    "stem": "Which sequence best explains the self-ploughing nature of black soil?",
    "answer": "Clay absorbs water → soil swells → drying causes shrinkage and deep cracks",
    "distractors": [
      "Sand absorbs water → soil freezes → cracks form",
      "River floods deposit silt → dunes form",
      "Lava erupts each summer → soil loosens"
    ],
    "explanation": "The clay-rich soil expands when wet and contracts strongly as it dries. The resulting cracks naturally loosen and aerate the surface, creating the characteristic self-ploughing effect.",
    "sourceFactIds": [
      "BLACK-SELF-PLOUGHING-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-024",
    "qlName": "Mineral and nutrient characteristics",
    "difficulty": "Easy",
    "stem": "Black soil is commonly rich in which material?",
    "answer": "Calcium carbonate",
    "distractors": [
      "Fresh river humus only",
      "Sea salt alone",
      "Coal particles"
    ],
    "explanation": "Black soil commonly contains appreciable calcium carbonate along with other basic minerals. This mineral composition is one reason its chemical character differs from many strongly leached soils.",
    "sourceFactIds": [
      "BLACK-CALCIUM-CARBONATE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-024",
    "qlName": "Mineral and nutrient characteristics",
    "difficulty": "Easy",
    "stem": "Which group of nutrients or minerals is commonly noted in black soil?",
    "answer": "Magnesium, potash and lime",
    "distractors": [
      "Gold, silver and petroleum",
      "Only nitrogen and humus",
      "Salt, gypsum and coral only"
    ],
    "explanation": "School geography commonly notes magnesium, potash and lime among the useful mineral constituents of black soil. These occur along with calcium carbonate in many black-soil regions.",
    "sourceFactIds": [
      "BLACK-MAGNESIUM-POTASH-LIME"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-024",
    "qlName": "Mineral and nutrient characteristics",
    "difficulty": "Medium",
    "stem": "Black soil is generally poor in which nutrient component?",
    "answer": "Phosphoric content",
    "distractors": [
      "Lime",
      "Magnesium",
      "Potash"
    ],
    "explanation": "Black soil contains useful amounts of lime, magnesium and potash, but its phosphoric content is comparatively low. This contrast is frequently tested in soil-composition questions.",
    "sourceFactIds": [
      "BLACK-LOW-PHOSPHORUS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-024",
    "qlName": "Mineral and nutrient characteristics",
    "difficulty": "Medium",
    "stem": "Which statement best describes the nutrient pattern of black soil?",
    "answer": "It has useful basic minerals but relatively low phosphoric content",
    "distractors": [
      "It contains no mineral nutrients",
      "It is rich only in river-borne humus",
      "It is composed entirely of quartz sand"
    ],
    "explanation": "Black soil has a notable supply of calcium carbonate, magnesium, potash and lime. At the same time, its phosphoric content is relatively low, so its nutrient profile is not uniformly rich.",
    "sourceFactIds": [
      "BLACK-NUTRIENT-PATTERN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-024",
    "qlName": "Mineral and nutrient characteristics",
    "difficulty": "Medium",
    "stem": "Which pair is correctly matched for black soil?",
    "answer": "Potash — commonly present in useful amount",
    "distractors": [
      "Phosphoric content — especially high",
      "Clay — completely absent",
      "Calcium carbonate — never present"
    ],
    "explanation": "Potash is commonly listed among the useful constituents of black soil. By contrast, phosphoric content is relatively low and clay is a major physical component rather than something absent.",
    "sourceFactIds": [
      "BLACK-POTASH-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-024",
    "qlName": "Mineral and nutrient characteristics",
    "difficulty": "Hard",
    "stem": "Consider the following statements about black soil: I. It commonly contains lime and magnesium. II. It is rich in clay. III. Its phosphoric content is relatively low. Which statements are correct?",
    "answer": "I, II and III",
    "distractors": [
      "I and II only",
      "II and III only",
      "I and III only"
    ],
    "explanation": "All three statements fit the standard description of black soil. Its clay-rich physical structure and its mineral pattern, including lime and magnesium with relatively low phosphoric content, are important exam facts.",
    "sourceFactIds": [
      "BLACK-NUTRIENT-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-025",
    "qlName": "Black soil and cotton cultivation",
    "difficulty": "Easy",
    "stem": "Which crop is most famously suited to black soil?",
    "answer": "Cotton",
    "distractors": [
      "Jute",
      "Tea",
      "Saffron"
    ],
    "explanation": "Black soil is especially well known for cotton cultivation, which is why it is often called black cotton soil. Its deep clayey profile and moisture retention suit the crop in many Deccan areas.",
    "sourceFactIds": [
      "BLACK-COTTON-CROP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-025",
    "qlName": "Black soil and cotton cultivation",
    "difficulty": "Easy",
    "stem": "Why is black soil valuable for cotton farming?",
    "answer": "It retains moisture well",
    "distractors": [
      "It remains permanently flooded",
      "It is renewed every year by rivers",
      "It contains no clay"
    ],
    "explanation": "Cotton benefits from soil that can store moisture through dry periods. Black soil's fine clay content gives it strong water-holding capacity, helping crops use stored moisture between rains.",
    "sourceFactIds": [
      "BLACK-COTTON-MOISTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-025",
    "qlName": "Black soil and cotton cultivation",
    "difficulty": "Medium",
    "stem": "Which soil-crop pair is correctly matched?",
    "answer": "Black soil — cotton",
    "distractors": [
      "Laterite soil — cotton as its defining crop",
      "Khadar — tea as its defining crop",
      "Arid soil — jute as its defining crop"
    ],
    "explanation": "Black soil and cotton form one of the best-known soil-crop relations in Indian geography. The connection is strong enough that black soil is commonly called black cotton soil.",
    "sourceFactIds": [
      "BLACK-COTTON-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-025",
    "qlName": "Black soil and cotton cultivation",
    "difficulty": "Medium",
    "stem": "A cotton-growing district has deep dark clayey soil that holds moisture well. Which soil is the best fit?",
    "answer": "Black soil",
    "distractors": [
      "Red and yellow soil",
      "Laterite soil",
      "Arid soil"
    ],
    "explanation": "Deep dark clay, strong moisture retention and cotton cultivation together strongly indicate black soil. These clues are especially typical of the Deccan plateau and adjoining black-soil regions.",
    "sourceFactIds": [
      "BLACK-COTTON-DISTRICT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-025",
    "qlName": "Black soil and cotton cultivation",
    "difficulty": "Medium",
    "stem": "Which property of black soil is especially useful where cotton depends on stored soil moisture?",
    "answer": "High moisture-holding capacity",
    "distractors": [
      "Very rapid drying of coarse sand",
      "Annual renewal by flood silt",
      "Permanent waterlogging"
    ],
    "explanation": "The clay-rich soil can store water and release it gradually to crops. This moisture reserve is particularly useful in seasonal-rainfall regions where long dry intervals may follow monsoon showers.",
    "sourceFactIds": [
      "BLACK-COTTON-STORED-WATER"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-025",
    "qlName": "Black soil and cotton cultivation",
    "difficulty": "Medium",
    "stem": "A farmer must choose between a deep clayey soil with strong moisture retention and a loose sandy soil for rain-fed cotton. Which soil condition is more favourable?",
    "answer": "The deep clayey, moisture-retaining soil",
    "distractors": [
      "The loose sandy soil that dries quickly",
      "Both are equally favourable for the same reason",
      "Soil texture has no effect on moisture storage"
    ],
    "explanation": "Rain-fed cotton benefits from a soil that can store water after rainfall. Deep clayey black soil provides this reserve much better than loose sand, which loses water rapidly through drainage and evaporation.",
    "sourceFactIds": [
      "BLACK-COTTON-REASONING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-026",
    "qlName": "Agricultural use and workability",
    "difficulty": "Easy",
    "stem": "When is black soil difficult to work with farm tools?",
    "answer": "When it is very wet and sticky",
    "distractors": [
      "Only when completely dry and cracked",
      "Only during winter nights",
      "Whenever it contains potash"
    ],
    "explanation": "Black soil becomes sticky when wet because of its high clay content. If cultivation is attempted at the wrong moisture stage, the heavy sticky mass can be difficult to plough and prepare.",
    "sourceFactIds": [
      "BLACK-WET-WORKABILITY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-026",
    "qlName": "Agricultural use and workability",
    "difficulty": "Easy",
    "stem": "Why must farmers pay attention to the moisture condition of black soil before tillage?",
    "answer": "Its clay makes it sticky when too wet and hard when too dry",
    "distractors": [
      "It becomes river silt after rainfall",
      "It loses all minerals in one day",
      "It contains no workable surface layer"
    ],
    "explanation": "The same clay that stores water also changes the soil's workability. Very wet black soil is sticky, while very dry soil can become hard, so timing of tillage is important.",
    "sourceFactIds": [
      "BLACK-TILLAGE-TIMING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-026",
    "qlName": "Agricultural use and workability",
    "difficulty": "Medium",
    "stem": "Which farming practice best suits the workability of black soil?",
    "answer": "Tilling it when moisture is suitable rather than when it is waterlogged",
    "distractors": [
      "Ploughing only during heavy standing water",
      "Avoiding all tillage for the entire year",
      "Waiting until the soil becomes loose sand"
    ],
    "explanation": "Black soil is easiest to work when it contains enough moisture to soften the clay but is not saturated and sticky. Proper timing reduces the difficulty caused by its shrink-swell behaviour.",
    "sourceFactIds": [
      "BLACK-TILLAGE-SUITABLE-MOISTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-026",
    "qlName": "Agricultural use and workability",
    "difficulty": "Medium",
    "stem": "How can the same clay content be both useful and troublesome for farmers?",
    "answer": "It stores moisture but can make wet soil sticky and difficult to work",
    "distractors": [
      "It creates rainfall but removes all nutrients",
      "It prevents crops from using water",
      "It turns soil into rock during every shower"
    ],
    "explanation": "High clay content gives black soil excellent moisture retention, which helps crops. However, clay also makes the soil sticky when wet and harder to till if field operations are poorly timed.",
    "sourceFactIds": [
      "BLACK-CLAY-ADVANTAGE-DISADVANTAGE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-026",
    "qlName": "Agricultural use and workability",
    "difficulty": "Medium",
    "stem": "A field stays moist after rain but becomes sticky under machinery. Which black-soil property explains both observations?",
    "answer": "High clay content",
    "distractors": [
      "Low mineral content",
      "Only coarse sand",
      "Annual river deposition"
    ],
    "explanation": "Clay particles hold water strongly, so the field stays moist for longer. The same fine particles become sticky when wet, linking moisture retention and difficult workability to one basic soil property.",
    "sourceFactIds": [
      "BLACK-CLAY-DUAL-EFFECT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-026",
    "qlName": "Agricultural use and workability",
    "difficulty": "Medium",
    "stem": "Which statement best describes black soil for farming?",
    "answer": "It can be highly useful for crops but requires careful timing of tillage",
    "distractors": [
      "It cannot support major crops",
      "It is always easy to plough at any moisture level",
      "It must be renewed by annual floods"
    ],
    "explanation": "Black soil supports important crops because it is deep and moisture-retentive, but its heavy clay can complicate tillage. Farmers therefore benefit from working it at a suitable moisture stage.",
    "sourceFactIds": [
      "BLACK-FARMING-BALANCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-027",
    "qlName": "Integrated black-soil reasoning",
    "difficulty": "Easy",
    "stem": "A dark clayey soil develops deep cracks in summer and is widely used for cotton. Which soil is it?",
    "answer": "Black soil",
    "distractors": [
      "Alluvial soil",
      "Laterite soil",
      "Arid soil"
    ],
    "explanation": "Dark colour, clayey texture, dry-season cracking and cotton cultivation form a classic set of black-soil clues. Together they make the identification much stronger than any single clue alone.",
    "sourceFactIds": [
      "BLACK-INTEGRATED-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-027",
    "qlName": "Integrated black-soil reasoning",
    "difficulty": "Easy",
    "stem": "A soil occurs over basaltic Deccan rocks and is known as regur. Which soil is indicated?",
    "answer": "Black soil",
    "distractors": [
      "Red and yellow soil",
      "Forest soil",
      "Alluvial soil"
    ],
    "explanation": "Regur is the common alternative name for black soil, and its large Deccan occurrence is tied to basaltic parent material. The combination of name and geology gives a clear identification.",
    "sourceFactIds": [
      "BLACK-INTEGRATED-REGUR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-027",
    "qlName": "Integrated black-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which combination correctly describes black soil?",
    "answer": "Basaltic origin, high clay content and strong moisture retention",
    "distractors": [
      "Recent river deposition, low clay and annual renewal",
      "Coral origin, coarse sand and poor moisture storage",
      "Glacial origin, permanent freezing and no cracking"
    ],
    "explanation": "Black soil is strongly linked with basaltic Deccan material and commonly has a fine clay-rich texture. The clay gives it strong moisture retention and contributes to its characteristic seasonal cracking.",
    "sourceFactIds": [
      "BLACK-INTEGRATED-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-027",
    "qlName": "Integrated black-soil reasoning",
    "difficulty": "Medium",
    "stem": "A soil is rich in lime and potash, relatively low in phosphoric content, and develops cracks in dry weather. Which soil is it?",
    "answer": "Black soil",
    "distractors": [
      "Khadar",
      "Laterite soil",
      "Mountain forest soil"
    ],
    "explanation": "The nutrient pattern and shrink-crack behaviour both match black soil. Lime and potash are commonly present, phosphoric content is relatively low, and clay shrinkage produces deep dry-season cracks.",
    "sourceFactIds": [
      "BLACK-INTEGRATED-NUTRIENT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-027",
    "qlName": "Integrated black-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which chain best connects black soil with cotton cultivation?",
    "answer": "Clay-rich soil → strong moisture retention → stored water available to cotton",
    "distractors": [
      "Coarse sand → rapid drying → stored water increases",
      "Annual flooding → new silt → black soil forms",
      "Permanent ice → slow drainage → cotton grows"
    ],
    "explanation": "Black soil's fine clay stores moisture after rainfall. That stored water can support cotton during dry intervals, explaining the strong soil-crop relation in many Deccan farming areas.",
    "sourceFactIds": [
      "BLACK-INTEGRATED-COTTON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-027",
    "qlName": "Integrated black-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which statement best distinguishes black soil from alluvial khadar?",
    "answer": "Black soil is linked with basaltic terrain and cracking, while khadar is newer river alluvium",
    "distractors": [
      "Both are renewed by every flood",
      "Khadar forms from basaltic lava",
      "Black soil is a recent river deposit"
    ],
    "explanation": "Black soil is strongly linked with Deccan basalt, clay and seasonal cracking. Khadar, in contrast, is younger alluvium deposited and renewed on active river floodplains.",
    "sourceFactIds": [
      "BLACK-VS-KHADAR"
    ]
  }
]);

export const GEO_SOI_001_CP003_REVIEW_BATCH_V1: readonly GeoSoi001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-SOI-001-CP003-Q${String(index + 1).padStart(3, "0")}`,
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

export function auditGeoSoi001Cp003ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoSoi001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_SOI_001_CP003_REVIEW_BATCH_V1) {
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

  if (GEO_SOI_001_CP003_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_SOI_001_CP003_REVIEW_BATCH_V1.length);
  for (let n = 19; n <= 27; n += 1) {
    const qlId = "GEO-SOI-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_SOI_001_CP003_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
