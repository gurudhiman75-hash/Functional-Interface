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
    "qlId": "GEO-SOI-001-QL-064",
    "qlName": "Alluvial soil in the northern plains and western corridor",
    "difficulty": "Easy",
    "stem": "Which soil covers large parts of the northern plains of India?",
    "answer": "Alluvial soil",
    "distractors": [
      "Black soil",
      "Laterite soil",
      "Arid soil"
    ],
    "explanation": "Alluvial soil is the dominant soil of the northern plains, where major river systems have deposited large quantities of sediment. This extensive river-built plain is one of India's classic alluvial regions.",
    "sourceFactIds": [
      "ALLUVIAL-NORTHERN-PLAINS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-064",
    "qlName": "Alluvial soil in the northern plains and western corridor",
    "difficulty": "Easy",
    "stem": "The Indo-Gangetic-Brahmaputra plains are most strongly linked with which soil group?",
    "answer": "Alluvial soil",
    "distractors": [
      "Forest soil",
      "Black soil",
      "Laterite soil"
    ],
    "explanation": "The Indo-Gangetic-Brahmaputra plains are built largely from river-borne deposits, so alluvial soil is widespread there. Repeated deposition over long periods created one of the country's largest continuous alluvial belts.",
    "sourceFactIds": [
      "ALLUVIAL-IGB-PLAINS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-064",
    "qlName": "Alluvial soil in the northern plains and western corridor",
    "difficulty": "Medium",
    "stem": "A soil map shows a continuous belt across Punjab, Haryana, Uttar Pradesh, Bihar and much of Assam. Which soil is being shown?",
    "answer": "Alluvial soil",
    "distractors": [
      "Black soil",
      "Laterite soil",
      "Arid soil"
    ],
    "explanation": "A belt through the northern plains from Punjab-Haryana across Uttar Pradesh and Bihar toward Assam is characteristic of alluvial soil. The pattern follows major river plains rather than volcanic or strongly leached uplands.",
    "sourceFactIds": [
      "ALLUVIAL-NORTH-MAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-064",
    "qlName": "Alluvial soil in the northern plains and western corridor",
    "difficulty": "Medium",
    "stem": "Which westward extension of alluvial soil is recognised beyond the core northern plains?",
    "answer": "Parts of Rajasthan and Gujarat",
    "distractors": [
      "Only Ladakh and Sikkim",
      "Only Kerala and Tamil Nadu",
      "Only the Nilgiri summits"
    ],
    "explanation": "Alluvial soil extends westward from the northern plains into parts of Rajasthan and Gujarat through a narrower corridor. This explains why alluvium is not confined only to the humid Ganga-Brahmaputra plain.",
    "sourceFactIds": [
      "ALLUVIAL-WEST-CORRIDOR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-064",
    "qlName": "Alluvial soil in the northern plains and western corridor",
    "difficulty": "Medium",
    "stem": "Which state pair can contain alluvial soil despite lying west of the main Ganga plain?",
    "answer": "Rajasthan and Gujarat",
    "distractors": [
      "Kerala and Tamil Nadu only",
      "Nagaland and Mizoram only",
      "Goa and Sikkim only"
    ],
    "explanation": "Parts of Rajasthan and Gujarat contain alluvial soil as a westward continuation of the northern alluvial system. The occurrence is narrower than the vast alluvial spread across the northern plains.",
    "sourceFactIds": [
      "ALLUVIAL-RAJ-GUJ"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-064",
    "qlName": "Alluvial soil in the northern plains and western corridor",
    "difficulty": "Hard",
    "stem": "A map shades the northern plains continuously but also shows a narrower belt entering western India. Which interpretation is most accurate?",
    "answer": "It represents alluvial soil extending into parts of Rajasthan and Gujarat",
    "distractors": [
      "It represents black soil extending into Punjab and Assam",
      "It represents laterite soil spreading across the entire Ganga plain",
      "It represents forest soil occupying the desert belt"
    ],
    "explanation": "The extensive northern belt plus a narrower western extension fits the distribution of alluvial soil. River deposition dominates the northern plains, and the alluvial zone continues into parts of Rajasthan and Gujarat.",
    "sourceFactIds": [
      "ALLUVIAL-CORRIDOR-REASONING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-065",
    "qlName": "Alluvial soil in eastern coastal deltas",
    "difficulty": "Easy",
    "stem": "Which soil is common in the deltas of the Mahanadi, Godavari, Krishna and Kaveri rivers?",
    "answer": "Alluvial soil",
    "distractors": [
      "Arid soil",
      "Black soil",
      "Forest soil"
    ],
    "explanation": "The deltas of the Mahanadi, Godavari, Krishna and Kaveri contain extensive alluvial deposits. Rivers slow near the coast and spread sediment across their deltaic plains, producing fertile alluvial soils.",
    "sourceFactIds": [
      "ALLUVIAL-EAST-DELTAS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-065",
    "qlName": "Alluvial soil in eastern coastal deltas",
    "difficulty": "Easy",
    "stem": "The major river deltas along India's eastern coast are strongly linked with which soil?",
    "answer": "Alluvial soil",
    "distractors": [
      "Laterite soil only",
      "Black soil only",
      "Arid soil"
    ],
    "explanation": "Large east-coast deltas are important areas of alluvial soil because rivers deposit fine material before entering the sea. This pattern is especially clear in the Mahanadi, Godavari, Krishna and Kaveri deltas.",
    "sourceFactIds": [
      "ALLUVIAL-EAST-COAST"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-065",
    "qlName": "Alluvial soil in eastern coastal deltas",
    "difficulty": "Medium",
    "stem": "A map highlights the Mahanadi and Godavari deltas. Which soil should be expected there?",
    "answer": "Alluvial soil",
    "distractors": [
      "Black soil",
      "Arid soil",
      "Mountain forest soil"
    ],
    "explanation": "Both deltas are built from river deposits, so alluvial soil is the expected soil type. Their coastal location does not change the basic depositional origin of the soil.",
    "sourceFactIds": [
      "ALLUVIAL-MAHANADI-GODAVARI"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-065",
    "qlName": "Alluvial soil in eastern coastal deltas",
    "difficulty": "Medium",
    "stem": "Which pair of river deltas is correctly linked with alluvial soil?",
    "answer": "Krishna and Kaveri",
    "distractors": [
      "Narmada and Tapi only",
      "Luni and Sabarmati only",
      "Indus and Sutlej only"
    ],
    "explanation": "The Krishna and Kaveri form major east-coast deltas where alluvial soil is widespread. Sediment carried by the rivers is deposited across the lower coastal plain before the rivers meet the sea.",
    "sourceFactIds": [
      "ALLUVIAL-KRISHNA-KAVERI"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-065",
    "qlName": "Alluvial soil in eastern coastal deltas",
    "difficulty": "Medium",
    "stem": "Why can an east-coast district have alluvial soil even though it lies far from the northern plains?",
    "answer": "Large rivers deposit sediment across their deltas",
    "distractors": [
      "Black lava covers every coastal plain",
      "Desert winds carry kankar to the coast",
      "Permanent snow supplies the soil"
    ],
    "explanation": "Alluvial soil is defined by river deposition, not by one single latitude or region. Eastern coastal deltas receive large amounts of river-borne material and therefore develop alluvial soils independently of the northern plains.",
    "sourceFactIds": [
      "ALLUVIAL-DELTA-LOGIC"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-065",
    "qlName": "Alluvial soil in eastern coastal deltas",
    "difficulty": "Hard",
    "stem": "Which map pattern best represents alluvial soil at the national scale?",
    "answer": "A vast northern plain belt plus major eastern coastal deltas",
    "distractors": [
      "Only the Deccan lava plateau",
      "Only the Western Ghats crest",
      "Only the western desert"
    ],
    "explanation": "Alluvial soil has two major national-scale expressions: the extensive northern plains and important deltaic tracts on the eastern coast. Reading both zones together prevents the common mistake of limiting alluvium to north India.",
    "sourceFactIds": [
      "ALLUVIAL-NATIONAL-PATTERN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-066",
    "qlName": "Black soil across the western and central Deccan",
    "difficulty": "Easy",
    "stem": "Which state is especially well known for extensive black soil?",
    "answer": "Maharashtra",
    "distractors": [
      "Punjab",
      "Assam",
      "Kerala"
    ],
    "explanation": "Maharashtra has large areas of black soil linked with the Deccan volcanic region. The state lies within the major black-soil belt of western and central India.",
    "sourceFactIds": [
      "BLACK-MAHARASHTRA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-066",
    "qlName": "Black soil across the western and central Deccan",
    "difficulty": "Easy",
    "stem": "Which region is a major black-soil zone?",
    "answer": "The Deccan Plateau",
    "distractors": [
      "The active Ganga floodplain",
      "The Thar dune belt only",
      "The high Himalayan snow zone"
    ],
    "explanation": "Black soil is strongly concentrated across parts of the Deccan Plateau. Its distribution reflects the widespread basaltic lava region of western and central India.",
    "sourceFactIds": [
      "BLACK-DECCAN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-066",
    "qlName": "Black soil across the western and central Deccan",
    "difficulty": "Medium",
    "stem": "Which state group best fits the main black-soil distribution?",
    "answer": "Maharashtra, Madhya Pradesh and Gujarat",
    "distractors": [
      "Punjab, Haryana and Assam",
      "Kerala, Meghalaya and Sikkim",
      "Bihar, West Bengal and Odisha only"
    ],
    "explanation": "Maharashtra, Madhya Pradesh and Gujarat all contain important black-soil areas. Together they form a major part of the western-central black-soil belt.",
    "sourceFactIds": [
      "BLACK-WEST-CENTRAL-STATES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-066",
    "qlName": "Black soil across the western and central Deccan",
    "difficulty": "Medium",
    "stem": "The Malwa region is commonly linked with which soil?",
    "answer": "Black soil",
    "distractors": [
      "Arid soil",
      "Forest soil",
      "Khadar only"
    ],
    "explanation": "Malwa is one of the recognised regions of black soil in central India. Its plateau setting connects it with the larger western-central Deccan black-soil zone.",
    "sourceFactIds": [
      "BLACK-MALWA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-066",
    "qlName": "Black soil across the western and central Deccan",
    "difficulty": "Medium",
    "stem": "Saurashtra in Gujarat is a recognised region for which soil?",
    "answer": "Black soil",
    "distractors": [
      "Laterite soil only",
      "Mountain forest soil",
      "Khadar only"
    ],
    "explanation": "Saurashtra contains important black-soil tracts and lies within the broader basalt-influenced western Indian belt. It is therefore a frequent region-soil match in Indian geography questions.",
    "sourceFactIds": [
      "BLACK-SAURASHTRA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-066",
    "qlName": "Black soil across the western and central Deccan",
    "difficulty": "Hard",
    "stem": "A map shades Maharashtra, parts of Gujarat, Malwa and adjoining Madhya Pradesh. Which soil distribution is being shown?",
    "answer": "Black soil",
    "distractors": [
      "Alluvial soil",
      "Arid soil",
      "Forest soil"
    ],
    "explanation": "This western-central pattern is characteristic of black soil. Maharashtra, Saurashtra, Malwa and adjoining Madhya Pradesh are standard black-soil regions tied to the Deccan volcanic landscape.",
    "sourceFactIds": [
      "BLACK-MAP-REASONING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-067",
    "qlName": "Black soil in the Godavari-Krishna valleys and adjoining belt",
    "difficulty": "Easy",
    "stem": "Which two river valleys contain important black-soil areas?",
    "answer": "Godavari and Krishna",
    "distractors": [
      "Ganga and Yamuna only",
      "Teesta and Subansiri only",
      "Luni and Ghaggar only"
    ],
    "explanation": "The Godavari and Krishna valleys include important black-soil areas within the Deccan region. These valleys cut across the volcanic plateau where black soil is widespread.",
    "sourceFactIds": [
      "BLACK-GODAVARI-KRISHNA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-067",
    "qlName": "Black soil in the Godavari-Krishna valleys and adjoining belt",
    "difficulty": "Easy",
    "stem": "Black soil extends into parts of which central Indian state east of Madhya Pradesh?",
    "answer": "Chhattisgarh",
    "distractors": [
      "Punjab",
      "Assam",
      "Kerala"
    ],
    "explanation": "Parts of Chhattisgarh are included in the recognised black-soil distribution. This eastern extension connects with the wider central and Deccan black-soil belt.",
    "sourceFactIds": [
      "BLACK-CHHATTISGARH"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-067",
    "qlName": "Black soil in the Godavari-Krishna valleys and adjoining belt",
    "difficulty": "Medium",
    "stem": "A soil map follows parts of the Godavari and Krishna basins across the Deccan. Which soil is most likely shown?",
    "answer": "Black soil",
    "distractors": [
      "Arid soil",
      "Forest soil",
      "Alluvial soil only"
    ],
    "explanation": "Black soil occurs in parts of both the Godavari and Krishna valleys. The basin pattern fits the Deccan black-soil distribution rather than a northern floodplain or desert belt.",
    "sourceFactIds": [
      "BLACK-BASIN-MAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-067",
    "qlName": "Black soil in the Godavari-Krishna valleys and adjoining belt",
    "difficulty": "Medium",
    "stem": "Which regional set is correctly linked with black soil?",
    "answer": "Maharashtra, Malwa and the Godavari-Krishna valleys",
    "distractors": [
      "Punjab plains, Assam hills and Kerala coast",
      "Thar dunes, Ladakh and the Kaveri delta",
      "Sundarbans, Nilgiri crest and Kashmir valley"
    ],
    "explanation": "Maharashtra, Malwa and the Godavari-Krishna valleys are all recognised black-soil regions. Together they show how the distribution spans western, central and peninsular India.",
    "sourceFactIds": [
      "BLACK-REGIONAL-SET"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-067",
    "qlName": "Black soil in the Godavari-Krishna valleys and adjoining belt",
    "difficulty": "Medium",
    "stem": "Why can black soil occur across both plateau surfaces and river valleys in the Deccan?",
    "answer": "The wider volcanic region extends across both kinds of terrain",
    "distractors": [
      "Annual Himalayan floods spread black clay there",
      "Desert winds carry black soil across the plateau",
      "Coastal tides deposit basaltic soil inland"
    ],
    "explanation": "Black soil is tied to the extensive Deccan volcanic region rather than to one single landform. River valleys cut through the same broad basaltic landscape, so black-soil tracts occur in both plateau and valley settings.",
    "sourceFactIds": [
      "BLACK-PLATEAU-VALLEY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-067",
    "qlName": "Black soil in the Godavari-Krishna valleys and adjoining belt",
    "difficulty": "Hard",
    "stem": "A question lists Saurashtra, Malwa, Maharashtra, Chhattisgarh and parts of the Godavari-Krishna valleys. Which common soil link joins these places?",
    "answer": "Black soil",
    "distractors": [
      "Alluvial soil",
      "Laterite soil",
      "Arid soil"
    ],
    "explanation": "All of these regions fall within the recognised national distribution of black soil. The list spans the western and central Deccan belt and its river-valley extensions.",
    "sourceFactIds": [
      "BLACK-INTEGRATED-DISTRIBUTION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-068",
    "qlName": "Red and yellow soil distribution",
    "difficulty": "Easy",
    "stem": "Red and yellow soils are widespread over which part of the Deccan Plateau?",
    "answer": "Eastern and southern parts",
    "distractors": [
      "Only the far northwestern desert",
      "Only the active Ganga floodplain",
      "Only snow-covered Himalayan peaks"
    ],
    "explanation": "Red and yellow soils are widespread in the eastern and southern parts of the Deccan Plateau. Their distribution is especially important where crystalline rocks occur under suitable climatic conditions.",
    "sourceFactIds": [
      "REDYELLOW-DECCAN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-068",
    "qlName": "Red and yellow soil distribution",
    "difficulty": "Easy",
    "stem": "Which eastern state has important red and yellow soil areas?",
    "answer": "Odisha",
    "distractors": [
      "Punjab",
      "Haryana",
      "Goa only"
    ],
    "explanation": "Odisha contains extensive red and yellow soil tracts, especially over upland and crystalline-rock areas. The state forms part of the eastern Indian red-soil belt.",
    "sourceFactIds": [
      "REDYELLOW-ODISHA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-068",
    "qlName": "Red and yellow soil distribution",
    "difficulty": "Medium",
    "stem": "Which state pair is correctly linked with red and yellow soils?",
    "answer": "Odisha and Chhattisgarh",
    "distractors": [
      "Punjab and Haryana",
      "Kerala and Goa only",
      "Rajasthan and Punjab only"
    ],
    "explanation": "Odisha and Chhattisgarh both contain important red and yellow soil areas. Their uplands form part of the wider eastern and southern peninsular distribution.",
    "sourceFactIds": [
      "REDYELLOW-ODISHA-CHHATTISGARH"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-068",
    "qlName": "Red and yellow soil distribution",
    "difficulty": "Medium",
    "stem": "Red and yellow soils also extend into which part of the Ganga plain?",
    "answer": "Southern parts of the middle Ganga plain",
    "distractors": [
      "The entire active floodplain from Punjab to Assam",
      "Only the delta mouth",
      "No part of the Ganga plain"
    ],
    "explanation": "Red and yellow soils extend into southern parts of the middle Ganga plain where peninsular uplands meet the plain. This is a limited extension, not the dominant soil of the whole Ganga plain.",
    "sourceFactIds": [
      "REDYELLOW-MIDDLE-GANGA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-068",
    "qlName": "Red and yellow soil distribution",
    "difficulty": "Medium",
    "stem": "Which western peninsular location is noted for red loamy soil?",
    "answer": "The piedmont zone of the Western Ghats",
    "distractors": [
      "The high Himalayan snowfields",
      "The active Brahmaputra floodplain",
      "The Thar dune core"
    ],
    "explanation": "Red loamy soil occurs in the piedmont zone along parts of the Western Ghats. This foothill occurrence adds a western peninsular expression to the larger red-and-yellow soil distribution.",
    "sourceFactIds": [
      "REDYELLOW-WESTERN-GHATS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-068",
    "qlName": "Red and yellow soil distribution",
    "difficulty": "Medium",
    "stem": "A map shades eastern and southern Deccan uplands, parts of Odisha and Chhattisgarh, and a limited middle-Ganga margin. Which soil fits best?",
    "answer": "Red and yellow soil",
    "distractors": [
      "Black soil",
      "Arid soil",
      "Khadar"
    ],
    "explanation": "That pattern matches red and yellow soil distribution across peninsular uplands with extensions into Odisha, Chhattisgarh and the southern middle Ganga plain. It is not a continuous floodplain or desert belt.",
    "sourceFactIds": [
      "REDYELLOW-MAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-069",
    "qlName": "Laterite soil distribution",
    "difficulty": "Easy",
    "stem": "Which southern state contains important laterite-soil areas?",
    "answer": "Karnataka",
    "distractors": [
      "Punjab",
      "Haryana",
      "Bihar only"
    ],
    "explanation": "Karnataka contains extensive laterite-soil tracts in suitable high-rainfall upland areas. It is one of the standard southern states used to identify laterite distribution.",
    "sourceFactIds": [
      "LATERITE-KARNATAKA-DIST"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-069",
    "qlName": "Laterite soil distribution",
    "difficulty": "Easy",
    "stem": "Which state pair is strongly linked with laterite soil in south India?",
    "answer": "Kerala and Tamil Nadu",
    "distractors": [
      "Punjab and Haryana",
      "Bihar and Uttar Pradesh only",
      "Rajasthan and Punjab only"
    ],
    "explanation": "Kerala and Tamil Nadu both contain important laterite-soil areas. Their warm, rainy uplands provide the conditions that support lateritic weathering and leaching.",
    "sourceFactIds": [
      "LATERITE-KERALA-TN-DIST"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-069",
    "qlName": "Laterite soil distribution",
    "difficulty": "Medium",
    "stem": "Which state outside far south India also contains recognised laterite-soil tracts?",
    "answer": "Madhya Pradesh",
    "distractors": [
      "Punjab",
      "Haryana",
      "Delhi only"
    ],
    "explanation": "Parts of Madhya Pradesh contain laterite soil, showing that laterite distribution is not limited to the southern coastal states. Local upland climate and weathering conditions support its occurrence.",
    "sourceFactIds": [
      "LATERITE-MP-DIST"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-069",
    "qlName": "Laterite soil distribution",
    "difficulty": "Medium",
    "stem": "Hilly parts of which two states are recognised laterite-soil areas?",
    "answer": "Odisha and Assam",
    "distractors": [
      "Punjab and Haryana",
      "Rajasthan and Gujarat only",
      "Bihar and Uttar Pradesh only"
    ],
    "explanation": "Hilly areas of Odisha and Assam contain laterite soil where rainfall and warm conditions favour strong leaching. These eastern and northeastern occurrences extend the national laterite pattern beyond peninsular south India.",
    "sourceFactIds": [
      "LATERITE-ODISHA-ASSAM"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-069",
    "qlName": "Laterite soil distribution",
    "difficulty": "Medium",
    "stem": "Which group best represents the national distribution of laterite soil?",
    "answer": "Karnataka, Kerala, Tamil Nadu, Madhya Pradesh, hilly Odisha and hilly Assam",
    "distractors": [
      "Punjab, Haryana, western Uttar Pradesh and the Thar desert",
      "Only Bihar, Delhi and Punjab",
      "Only Ladakh and high Himalayan valleys"
    ],
    "explanation": "Laterite soil occurs across several separated warm, rainy upland regions rather than one continuous belt. The listed southern, central, eastern and northeastern areas form the standard school-level distribution.",
    "sourceFactIds": [
      "LATERITE-NATIONAL-GROUP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-069",
    "qlName": "Laterite soil distribution",
    "difficulty": "Medium",
    "stem": "A map shows laterite patches in the southern peninsula, central India and hilly parts of eastern and northeastern India. Which interpretation is correct?",
    "answer": "Laterite soil has a scattered upland distribution across these regions",
    "distractors": [
      "Laterite forms one continuous belt across the northern plains",
      "Laterite is confined to western Rajasthan",
      "Laterite occurs only in active river deltas"
    ],
    "explanation": "Laterite soil appears in separated upland tracts where climate and relief favour intense weathering and leaching. Its map pattern is therefore patchier than the continuous alluvial belt of the northern plains.",
    "sourceFactIds": [
      "LATERITE-SCATTERED-MAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-070",
    "qlName": "Arid soil distribution in western India",
    "difficulty": "Easy",
    "stem": "Arid soil is most strongly concentrated in which part of India?",
    "answer": "Western Rajasthan",
    "distractors": [
      "The Brahmaputra valley",
      "The Kerala coast",
      "The eastern Himalayan foothills"
    ],
    "explanation": "Western Rajasthan is the principal arid-soil region of India. The hot dry climate, sparse vegetation and strong evaporation create the classic setting for this soil group.",
    "sourceFactIds": [
      "ARID-WESTERN-RAJASTHAN-DIST"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-070",
    "qlName": "Arid soil distribution in western India",
    "difficulty": "Easy",
    "stem": "Which soil is expected across much of the dry western Rajasthan belt?",
    "answer": "Arid soil",
    "distractors": [
      "Forest soil",
      "Black soil",
      "Laterite soil"
    ],
    "explanation": "Arid soil dominates large dry tracts of western Rajasthan. The regional climate produces sandy, low-moisture and often saline soil conditions.",
    "sourceFactIds": [
      "ARID-RAJASTHAN-BELT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-070",
    "qlName": "Arid soil distribution in western India",
    "difficulty": "Medium",
    "stem": "A national soil map highlights the Thar-region belt in western Rajasthan. Which soil group is being emphasised?",
    "answer": "Arid soil",
    "distractors": [
      "Alluvial soil",
      "Black soil",
      "Forest soil"
    ],
    "explanation": "The Thar-region belt is the country's clearest arid-soil zone. Its extreme dryness and desert environment separate it from the humid alluvial and mountain-soil regions.",
    "sourceFactIds": [
      "ARID-THAR-MAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-070",
    "qlName": "Arid soil distribution in western India",
    "difficulty": "Medium",
    "stem": "Which state provides the strongest map clue for arid soil in standard Indian geography?",
    "answer": "Rajasthan",
    "distractors": [
      "Assam",
      "Kerala",
      "Odisha"
    ],
    "explanation": "Rajasthan, especially its western part, is the strongest state-level clue for arid soil. Other states may have dry tracts, but western Rajasthan is the standard core region in school geography.",
    "sourceFactIds": [
      "ARID-STATE-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-070",
    "qlName": "Arid soil distribution in western India",
    "difficulty": "Medium",
    "stem": "Which soil-region match is correct?",
    "answer": "Western Rajasthan — arid soil",
    "distractors": [
      "Kerala uplands — arid soil",
      "Assam hills — arid soil",
      "Mahanadi delta — arid soil"
    ],
    "explanation": "Western Rajasthan is the standard core area of arid soil. The other locations are much wetter and are linked with laterite, forest or alluvial soils instead.",
    "sourceFactIds": [
      "ARID-REGION-MATCH"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-070",
    "qlName": "Arid soil distribution in western India",
    "difficulty": "Medium",
    "stem": "A map shows sandy dry soils concentrated near India's western desert margin. Which distribution does this represent?",
    "answer": "Arid soil distribution",
    "distractors": [
      "Black soil distribution",
      "Laterite soil distribution",
      "Forest soil distribution"
    ],
    "explanation": "A sandy dry belt along the western desert margin is characteristic of arid soil. The location and climate together make the map interpretation straightforward.",
    "sourceFactIds": [
      "ARID-WEST-MAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-071",
    "qlName": "Forest and mountain soil distribution",
    "difficulty": "Easy",
    "stem": "Forest and mountain soils are found chiefly in which areas?",
    "answer": "Hilly and mountainous regions",
    "distractors": [
      "Flat desert plains only",
      "Active coastal deltas only",
      "Volcanic lava plains only"
    ],
    "explanation": "Forest and mountain soils occur chiefly in hilly and mountainous regions where rainfall supports forest vegetation. Their properties change with altitude, slope and local relief.",
    "sourceFactIds": [
      "FOREST-MOUNTAIN-DIST"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-071",
    "qlName": "Forest and mountain soil distribution",
    "difficulty": "Easy",
    "stem": "Which major physiographic region is a key zone for forest and mountain soils?",
    "answer": "The Himalayas",
    "distractors": [
      "The Thar Desert only",
      "The Ganga delta only",
      "The Deccan Trap only"
    ],
    "explanation": "The Himalayan region contains extensive forest and mountain soils because of its large area of wooded slopes and strong altitudinal variation. Soil texture and fertility change markedly from high slopes to lower valleys.",
    "sourceFactIds": [
      "FOREST-HIMALAYA-DIST"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-071",
    "qlName": "Forest and mountain soil distribution",
    "difficulty": "Medium",
    "stem": "A soil map highlights wooded hill belts rather than plains or deserts. Which soil group is most likely?",
    "answer": "Forest and mountain soil",
    "distractors": [
      "Arid soil",
      "Black soil",
      "Alluvial soil"
    ],
    "explanation": "Wooded hilly and mountainous belts are the natural setting for forest and mountain soils. Relief, altitude and vegetation shape their local texture and fertility.",
    "sourceFactIds": [
      "FOREST-HILL-MAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-071",
    "qlName": "Forest and mountain soil distribution",
    "difficulty": "Medium",
    "stem": "Why is forest-soil distribution shown by mountain belts rather than one continuous lowland plain?",
    "answer": "Its occurrence follows hilly relief and forested environments",
    "distractors": [
      "It is deposited only by large rivers",
      "It forms only from desert sand",
      "It requires flat coastal terrain"
    ],
    "explanation": "Forest soil distribution follows mountain relief because slope, altitude and forest cover are central to its development. This creates belts and patches along highland systems rather than a single flat plain.",
    "sourceFactIds": [
      "FOREST-DIST-RELIEF"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-071",
    "qlName": "Forest and mountain soil distribution",
    "difficulty": "Medium",
    "stem": "Which map contrast is most accurate?",
    "answer": "Forest soil follows mountain belts, while alluvial soil dominates major river plains",
    "distractors": [
      "Forest soil dominates the Thar desert, while arid soil covers the Himalayas",
      "Black soil dominates active floodplains, while alluvial soil covers lava plateaus",
      "Laterite soil forms one continuous northern plain belt"
    ],
    "explanation": "Forest soil is tied to hilly and mountainous terrain, whereas alluvial soil is tied to large depositional plains and deltas. The contrast is useful for reading national soil maps correctly.",
    "sourceFactIds": [
      "FOREST-VS-ALLUVIAL-MAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-071",
    "qlName": "Forest and mountain soil distribution",
    "difficulty": "Medium",
    "stem": "A region has steep wooded slopes and high-altitude valleys rather than a large depositional plain. Which soil distribution is most likely?",
    "answer": "Forest and mountain soil",
    "distractors": [
      "Khadar",
      "Arid soil",
      "Black soil"
    ],
    "explanation": "Steep wooded mountain terrain points toward forest and mountain soil. Khadar is tied to active floodplains, while arid and black soils belong to very different regional settings.",
    "sourceFactIds": [
      "FOREST-TERRAIN-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-072",
    "qlName": "Integrated soil-distribution map reasoning",
    "difficulty": "Easy",
    "stem": "Which soil-region pair is correctly matched?",
    "answer": "Black soil — Maharashtra",
    "distractors": [
      "Arid soil — Assam hills",
      "Laterite soil — Punjab plains",
      "Forest soil — Mahanadi delta"
    ],
    "explanation": "Maharashtra lies at the heart of India's black-soil belt. The other pairs place soils in regions that do not match their standard national distribution.",
    "sourceFactIds": [
      "DIST-INTEGRATED-BLACK"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-072",
    "qlName": "Integrated soil-distribution map reasoning",
    "difficulty": "Easy",
    "stem": "Which soil-region pair is correctly matched?",
    "answer": "Laterite soil — hilly Odisha",
    "distractors": [
      "Black soil — Punjab floodplain",
      "Arid soil — Kerala coast",
      "Alluvial soil — high Himalayan snow zone"
    ],
    "explanation": "Hilly Odisha contains recognised laterite-soil areas. The remaining options mix soil groups with regions belonging to different climatic or physiographic settings.",
    "sourceFactIds": [
      "DIST-INTEGRATED-LATERITE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-072",
    "qlName": "Integrated soil-distribution map reasoning",
    "difficulty": "Medium",
    "stem": "Which sequence correctly matches three regions with their dominant soil clues?",
    "answer": "Northern plains — alluvial; Maharashtra — black; western Rajasthan — arid",
    "distractors": [
      "Northern plains — black; Maharashtra — forest; western Rajasthan — laterite",
      "Northern plains — arid; Maharashtra — alluvial; western Rajasthan — forest",
      "Northern plains — laterite; Maharashtra — arid; western Rajasthan — black"
    ],
    "explanation": "The northern plains are dominated by alluvial soil, Maharashtra is a major black-soil state, and western Rajasthan is the core arid-soil region. These three contrasts are central to national soil-map reading.",
    "sourceFactIds": [
      "DIST-THREE-REGIONS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-072",
    "qlName": "Integrated soil-distribution map reasoning",
    "difficulty": "Medium",
    "stem": "A map marks four locations: Ganga plain, Maharashtra plateau, Kerala upland and western Rajasthan. Which soil sequence is most plausible?",
    "answer": "Alluvial, black, laterite, arid",
    "distractors": [
      "Black, alluvial, arid, forest",
      "Laterite, arid, black, alluvial",
      "Forest, laterite, alluvial, black"
    ],
    "explanation": "The Ganga plain is alluvial, the Maharashtra plateau is strongly linked with black soil, Kerala uplands include laterite, and western Rajasthan is arid. The sequence combines four distinct distribution patterns.",
    "sourceFactIds": [
      "DIST-FOUR-REGIONS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-072",
    "qlName": "Integrated soil-distribution map reasoning",
    "difficulty": "Medium",
    "stem": "Which national distribution pattern is correctly stated?",
    "answer": "Alluvial soil is extensive in northern plains, while black soil is concentrated in western-central Deccan regions",
    "distractors": [
      "Black soil dominates the entire northern plain, while alluvial soil is confined to the Thar",
      "Laterite soil forms a continuous belt from Punjab to Assam",
      "Arid soil dominates Kerala and Assam"
    ],
    "explanation": "Alluvial and black soils occupy very different national belts. Alluvium dominates the great northern river plains, while black soil is concentrated across the western-central Deccan and adjoining valleys.",
    "sourceFactIds": [
      "DIST-ALLUVIAL-BLACK-CONTRAST"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-072",
    "qlName": "Integrated soil-distribution map reasoning",
    "difficulty": "Medium",
    "stem": "A soil map shows five clues: northern river plain, Deccan black-soil belt, eastern red-soil uplands, western desert and Himalayan hills. Which reading is correct?",
    "answer": "Alluvial, black, red-yellow, arid and forest soils respectively",
    "distractors": [
      "Black, forest, alluvial, laterite and arid soils respectively",
      "Arid, alluvial, forest, black and laterite soils respectively",
      "Laterite, arid, black, forest and alluvial soils respectively"
    ],
    "explanation": "Each map clue points to a standard national distribution: alluvial in the northern plains, black in the Deccan belt, red-yellow in eastern uplands, arid in the western desert and forest soil in the Himalayas.",
    "sourceFactIds": [
      "DIST-FIVE-ZONES"
    ]
  }
]);

export const GEO_SOI_001_CP008_REVIEW_BATCH_V1: readonly GeoSoi001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-SOI-001-CP008-Q${String(index + 1).padStart(3, "0")}`,
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

export function auditGeoSoi001Cp008ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoSoi001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_SOI_001_CP008_REVIEW_BATCH_V1) {
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

  if (GEO_SOI_001_CP008_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_SOI_001_CP008_REVIEW_BATCH_V1.length);
  for (let n = 64; n <= 72; n += 1) {
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
    questionCount: GEO_SOI_001_CP008_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
