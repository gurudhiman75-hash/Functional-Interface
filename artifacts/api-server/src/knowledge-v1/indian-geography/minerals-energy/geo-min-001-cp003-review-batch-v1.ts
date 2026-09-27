import { buildGeoMinQl, finalizeGeoMinCp, auditGeoMinCp } from "./geo-min-001-review-builder";

const QLS = Object.freeze([
buildGeoMinQl("MANGANESE-USES-IN-STEEL-AND-INDUSTRY", "Manganese uses in steel and industry", [
  {
    "stem": "Which mineral is widely used in steel making as an alloying and deoxidising material?",
    "answer": "Manganese",
    "distractors": [
      "Mica",
      "Gypsum",
      "Bauxite"
    ],
    "explanation": "Manganese is important in iron and steel manufacture because it improves alloy properties and helps remove unwanted oxygen and sulphur. It is therefore a key ferro-alloy mineral.",
    "sourceFactId": "MANGANESE-STEEL"
  },
  {
    "stem": "Ferro-manganese production depends directly on which mineral?",
    "answer": "Manganese ore",
    "distractors": [
      "Limestone only",
      "Mica",
      "Bauxite"
    ],
    "explanation": "Ferro-manganese is an alloy containing manganese and iron, so manganese ore is an essential input. Its use links manganese geography closely with the steel industry.",
    "sourceFactId": "MANGANESE-FERROALLOY"
  },
  {
    "stem": "Consider the statements: I. Manganese is used in steel manufacture. II. It is only a decorative stone. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Manganese has major metallurgical uses, especially in steel and ferro-alloys. Describing it only as a decorative material ignores its principal industrial role.",
    "sourceFactId": "MANGANESE-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Manganese — ferro-alloy mineral",
    "distractors": [
      "Manganese — non-metallic sheet mineral",
      "Manganese — aluminium ore",
      "Manganese — fuel mineral"
    ],
    "explanation": "Manganese is a metallic mineral used in ferro-alloys and steel. The other descriptions belong to mica, bauxite or energy resources rather than manganese.",
    "sourceFactId": "MANGANESE-MATCH"
  },
  {
    "stem": "Which non-steel use is also commonly linked with manganese compounds?",
    "answer": "Manufacture of paints and chemicals",
    "distractors": [
      "Making cotton fibre",
      "Producing crude petroleum",
      "Forming mica sheets"
    ],
    "explanation": "Manganese compounds have uses in products such as paints, chemicals and batteries in addition to metallurgy. This broader use explains its industrial importance beyond steel.",
    "sourceFactId": "MANGANESE-OTHER-USES"
  },
  {
    "stem": "A region with iron ore and manganese has an advantage for which activity?",
    "answer": "Production of alloy and steel materials",
    "distractors": [
      "Tea cultivation",
      "Jute retting",
      "Offshore oil drilling"
    ],
    "explanation": "Iron ore supplies iron while manganese contributes alloying value in steel manufacture. Their proximity can therefore support metallurgical activity more directly than agricultural processing.",
    "sourceFactId": "MANGANESE-REASONING"
  }
] as const),

buildGeoMinQl("ODISHA-MANGANESE-GEOGRAPHY", "Odisha manganese geography", [
  {
    "stem": "Which state is an important manganese-producing region in eastern India?",
    "answer": "Odisha",
    "distractors": [
      "Punjab",
      "Kerala",
      "Haryana"
    ],
    "explanation": "Odisha contains significant manganese deposits along with several other metallic minerals. Its mineral-rich plateau and hill regions make it important in India's metallurgical geography.",
    "sourceFactId": "MANGANESE-ODISHA"
  },
  {
    "stem": "A mineral map shows manganese deposits in the mineral-rich belt of Odisha. Which broader region does this reflect?",
    "answer": "Eastern peninsular mineral belt",
    "distractors": [
      "Indo-Gangetic alluvial plain",
      "Western Himalayan snow belt",
      "Coral island region"
    ],
    "explanation": "Odisha lies within the mineral-rich eastern peninsular plateau belt. Manganese occurs there alongside iron ore and other metallic resources.",
    "sourceFactId": "MANGANESE-EASTERN-BELT"
  },
  {
    "stem": "Consider the statements: I. Odisha has important manganese deposits. II. Odisha has no major metallic mineral resources. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Odisha is one of India's major mineral-rich states and contains manganese as well as iron ore, chromite and bauxite. The second statement is therefore incorrect.",
    "sourceFactId": "MANGANESE-ODISHA-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Odisha — manganese deposits",
    "distractors": [
      "Punjab — major manganese belt",
      "Haryana — Sukinda chromite valley",
      "Kerala — Bailadila manganese"
    ],
    "explanation": "Odisha is a recognised manganese-bearing state in the eastern mineral belt. The other pairings place well-known mineral locations or belts in the wrong states.",
    "sourceFactId": "MANGANESE-ODISHA-MATCH"
  },
  {
    "stem": "Which mineral can occur with iron-ore regions in Odisha and also support ferro-alloy industries?",
    "answer": "Manganese",
    "distractors": [
      "Mica",
      "Gypsum",
      "Rock salt"
    ],
    "explanation": "Manganese occurs in Odisha and is a major ferro-alloy input. Its metallurgical role complements the state's large iron-ore resource base.",
    "sourceFactId": "MANGANESE-ODISHA-CLUE"
  },
  {
    "stem": "Why can Odisha support both iron and ferro-alloy industries from a mineral-resource perspective?",
    "answer": "It has important iron ore, manganese and chromite resources",
    "distractors": [
      "It depends only on imported metallic minerals",
      "It has no plateau mineral belt",
      "Its resources are limited to gypsum"
    ],
    "explanation": "Odisha has a diversified metallic mineral base including iron ore, manganese and chromite. This combination is especially relevant to iron, steel and ferro-alloy industries.",
    "sourceFactId": "ODISHA-METALLURGY"
  }
] as const),

buildGeoMinQl("KARNATAKA-MANGANESE-GEOGRAPHY", "Karnataka manganese geography", [
  {
    "stem": "Which southern state is important for both iron ore and manganese deposits?",
    "answer": "Karnataka",
    "distractors": [
      "Punjab",
      "Bihar",
      "West Bengal"
    ],
    "explanation": "Karnataka has significant iron-ore belts and also manganese resources. The overlap strengthens its place in southern India's metallurgical mineral geography.",
    "sourceFactId": "MANGANESE-KARNATAKA"
  },
  {
    "stem": "A question links Ballari region with iron ore and asks for another metallic mineral found in Karnataka. Which is a likely answer?",
    "answer": "Manganese",
    "distractors": [
      "Petroleum only",
      "Rock salt only",
      "Gypsum only"
    ],
    "explanation": "Karnataka's mineral base includes manganese in addition to major iron-ore deposits. This makes the state important for several ferrous and ferro-alloy minerals.",
    "sourceFactId": "MANGANESE-KARNATAKA-CLUE"
  },
  {
    "stem": "Consider the statements: I. Karnataka has important manganese deposits. II. The state is also known for iron ore. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Karnataka is a significant state for both manganese and iron ore. The two resources together are important to the regional metallurgical economy.",
    "sourceFactId": "MANGANESE-KARNATAKA-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Karnataka — manganese and iron ore",
    "distractors": [
      "Karnataka — only petroleum resources",
      "Karnataka — no metallic minerals",
      "Karnataka — gypsum as its sole mineral"
    ],
    "explanation": "Karnataka has a broad metallic mineral base that includes iron ore and manganese. The alternatives incorrectly reduce the state's mineral geography to unrelated or exclusive resources.",
    "sourceFactId": "MANGANESE-KARNATAKA-MATCH"
  },
  {
    "stem": "Which mineral pair would be most relevant to a ferro-alloy plant in mineral-rich Karnataka?",
    "answer": "Iron ore and manganese",
    "distractors": [
      "Mica and gypsum",
      "Petroleum and natural gas only",
      "Salt and limestone only"
    ],
    "explanation": "Iron ore provides iron and manganese supplies an alloying element used in steel and ferro-alloys. Their presence creates a natural raw-material link to metallurgical industries.",
    "sourceFactId": "KARNATAKA-FERROALLOY"
  },
  {
    "stem": "A state is identified by the clues 'Ballari iron ore, Chitradurga mineral belt, manganese deposits'. Which state is it?",
    "answer": "Karnataka",
    "distractors": [
      "Odisha",
      "Rajasthan",
      "Assam"
    ],
    "explanation": "Ballari and Chitradurga are classic Karnataka iron-ore locations, and the state also contains manganese deposits. The combined clues point clearly to Karnataka.",
    "sourceFactId": "KARNATAKA-INTEGRATED"
  }
] as const),

buildGeoMinQl("MADHYA-PRADESH-MAHARASHTRA-MANGANESE-BELT", "Madhya Pradesh-Maharashtra manganese belt", [
  {
    "stem": "Which pair of states forms an important central Indian manganese region?",
    "answer": "Madhya Pradesh and Maharashtra",
    "distractors": [
      "Punjab and Haryana",
      "Kerala and Tamil Nadu",
      "Assam and Arunachal Pradesh"
    ],
    "explanation": "Madhya Pradesh and Maharashtra contain significant manganese deposits in central India. Their adjoining mineral districts form an important manganese-producing zone.",
    "sourceFactId": "MANGANESE-MP-MH"
  },
  {
    "stem": "The Balaghat region, known for manganese, is located in which state?",
    "answer": "Madhya Pradesh",
    "distractors": [
      "Goa",
      "Punjab",
      "Kerala"
    ],
    "explanation": "Balaghat in Madhya Pradesh is an important manganese-bearing district and also has copper resources. It is a standard central Indian mineral location.",
    "sourceFactId": "BALAGHAT-MANGANESE"
  },
  {
    "stem": "Consider the statements: I. Balaghat is linked with manganese. II. Maharashtra also has important manganese deposits. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Balaghat is a major manganese area in Madhya Pradesh, while adjoining Maharashtra also contains significant manganese deposits. Together they form an important central belt.",
    "sourceFactId": "MANGANESE-CENTRAL-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Balaghat — Madhya Pradesh manganese",
    "distractors": [
      "Balaghat — Kerala mica",
      "Nagpur region — offshore petroleum only",
      "Maharashtra — no manganese deposits"
    ],
    "explanation": "Balaghat is a recognised manganese area of Madhya Pradesh. The wider central Indian manganese zone extends toward parts of Maharashtra.",
    "sourceFactId": "BALAGHAT-MATCH"
  },
  {
    "stem": "A map shows a manganese cluster straddling central India around eastern Maharashtra and southeastern Madhya Pradesh. Which resource is indicated?",
    "answer": "Manganese",
    "distractors": [
      "Mica",
      "Petroleum",
      "Gypsum"
    ],
    "explanation": "The Madhya Pradesh–Maharashtra region is a classic manganese zone. Its central position distinguishes it from mica belts or offshore petroleum fields.",
    "sourceFactId": "MANGANESE-CENTRAL-MAP"
  },
  {
    "stem": "Which comparison is correct?",
    "answer": "Balaghat is linked with manganese in Madhya Pradesh, while Sukinda is linked with chromite in Odisha",
    "distractors": [
      "Both are petroleum fields",
      "Both are mica belts",
      "Sukinda is in Madhya Pradesh and Balaghat in Odisha"
    ],
    "explanation": "Balaghat is a central Indian manganese location, whereas Sukinda in Odisha is famous for chromite. The contrast helps separate two important ferro-alloy mineral regions.",
    "sourceFactId": "BALAGHAT-SUKINDA-COMPARE"
  }
] as const),

buildGeoMinQl("CHROMITE-AND-CHROMIUM", "Chromite and chromium", [
  {
    "stem": "Which mineral is the principal ore of chromium?",
    "answer": "Chromite",
    "distractors": [
      "Bauxite",
      "Mica",
      "Gypsum"
    ],
    "explanation": "Chromite is the chief ore from which chromium is obtained. Chromium is important in stainless steel and other alloy applications because it improves hardness and corrosion resistance.",
    "sourceFactId": "CHROMITE-CHROMIUM"
  },
  {
    "stem": "Stainless steel production requires chromium. Which mineral supplies this metal?",
    "answer": "Chromite",
    "distractors": [
      "Limestone",
      "Mica",
      "Lignite"
    ],
    "explanation": "Chromium used in stainless and alloy steels is obtained chiefly from chromite ore. This makes chromite a strategic ferro-alloy mineral.",
    "sourceFactId": "CHROMITE-STAINLESS"
  },
  {
    "stem": "Consider the statements: I. Chromite is an ore of chromium. II. Chromium is important in alloy steel. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Chromite supplies chromium, and chromium is widely used to make special and stainless steels. Both statements express the direct ore-to-industry relationship.",
    "sourceFactId": "CHROMITE-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Chromite — chromium",
    "distractors": [
      "Bauxite — chromium",
      "Mica — chromium",
      "Gypsum — chromium"
    ],
    "explanation": "Chromite is the principal chromium ore. Bauxite provides aluminium, while mica and gypsum are non-metallic industrial minerals.",
    "sourceFactId": "CHROMITE-MATCH"
  },
  {
    "stem": "Which mineral would be most relevant to an industry making corrosion-resistant stainless steel?",
    "answer": "Chromite",
    "distractors": [
      "Gypsum",
      "Mica",
      "Rock salt"
    ],
    "explanation": "Chromium improves corrosion resistance and is obtained from chromite. That gives chromite a direct connection with stainless-steel production.",
    "sourceFactId": "CHROMITE-CLUE"
  },
  {
    "stem": "A mineral is classified with ferro-alloy resources but does not supply iron itself; instead it supplies chromium. Which mineral is it?",
    "answer": "Chromite",
    "distractors": [
      "Hematite",
      "Magnetite",
      "Bauxite"
    ],
    "explanation": "Chromite is grouped with ferro-alloy minerals because chromium is added to iron-based alloys. Hematite and magnetite supply iron itself, while bauxite supplies aluminium.",
    "sourceFactId": "CHROMITE-REASONING"
  }
] as const),

buildGeoMinQl("SUKINDA-CHROMITE-BELT", "Sukinda chromite belt", [
  {
    "stem": "Sukinda Valley, famous for chromite deposits, is located in which state?",
    "answer": "Odisha",
    "distractors": [
      "Punjab",
      "Kerala",
      "Rajasthan"
    ],
    "explanation": "Sukinda Valley in Odisha is one of India's best-known chromite regions. It lies within the mineral-rich eastern peninsular belt.",
    "sourceFactId": "SUKINDA-STATE"
  },
  {
    "stem": "Which mineral is most strongly linked with Sukinda Valley?",
    "answer": "Chromite",
    "distractors": [
      "Mica",
      "Limestone",
      "Petroleum"
    ],
    "explanation": "Sukinda Valley is internationally known for chromite deposits. The mineral supplies chromium for ferro-alloys and stainless steel.",
    "sourceFactId": "SUKINDA-CHROMITE"
  },
  {
    "stem": "Consider the statements: I. Sukinda lies in Odisha. II. It is an important chromite region. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Sukinda Valley is in Odisha and contains major chromite deposits. The location-resource pair is one of the most important chromite facts in Indian geography.",
    "sourceFactId": "SUKINDA-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Sukinda — chromite",
    "distractors": [
      "Sukinda — petroleum",
      "Sukinda — mica",
      "Sukinda — lignite"
    ],
    "explanation": "Sukinda is a classic chromite location in Odisha. The alternative resources belong to completely different geological regions and industries.",
    "sourceFactId": "SUKINDA-MATCH"
  },
  {
    "stem": "A map marks a mineral valley in Odisha important for stainless-steel raw material. Which place is indicated?",
    "answer": "Sukinda",
    "distractors": [
      "Digboi",
      "Koderma",
      "Neyveli"
    ],
    "explanation": "Sukinda's chromite deposits supply chromium used in stainless and alloy steels. Digboi is petroleum, Koderma is mica and Neyveli is lignite.",
    "sourceFactId": "SUKINDA-MAP"
  },
  {
    "stem": "Which chain is correct?",
    "answer": "Sukinda → chromite → chromium → stainless steel",
    "distractors": [
      "Sukinda → bauxite → iron → steel",
      "Sukinda → mica → aluminium → aircraft",
      "Sukinda → gypsum → chromium → cement"
    ],
    "explanation": "Sukinda is a chromite region; chromite yields chromium; chromium is a key alloying metal in stainless steel. The full chain links location, ore, metal and use correctly.",
    "sourceFactId": "SUKINDA-CHAIN"
  }
] as const),

buildGeoMinQl("MANGANESE-CHROMITE-COMPARISON", "Manganese-chromite comparison", [
  {
    "stem": "Which comparison is correct?",
    "answer": "Manganese and chromite are both important ferro-alloy minerals",
    "distractors": [
      "Both are non-metallic minerals",
      "Both are fuels",
      "Both are principal aluminium ores"
    ],
    "explanation": "Manganese and chromium from chromite are used in iron and steel alloys. Their common metallurgical role places both within the ferro-alloy mineral group.",
    "sourceFactId": "MN-CR-COMPARE"
  },
  {
    "stem": "Which mineral pair is most directly connected with alloy steel rather than cement manufacture?",
    "answer": "Manganese and chromite",
    "distractors": [
      "Limestone and gypsum",
      "Mica and limestone",
      "Gypsum and mica"
    ],
    "explanation": "Manganese and chromium are alloying materials used in steel. Limestone and gypsum are more directly connected with cement and other non-metallic industries.",
    "sourceFactId": "MN-CR-ALLOY"
  },
  {
    "stem": "Consider the statements: I. Manganese can be used in ferro-manganese. II. Chromite supplies chromium. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Manganese is used to make ferro-manganese, while chromite is the chief chromium ore. Both minerals therefore serve important metallurgical functions.",
    "sourceFactId": "MN-CR-STATEMENT"
  },
  {
    "stem": "Which pair is incorrectly matched?",
    "answer": "Chromite — aluminium ore",
    "distractors": [
      "Manganese — ferro-alloy mineral",
      "Chromite — chromium ore",
      "Manganese — steel-related mineral"
    ],
    "explanation": "Chromite is the ore of chromium, not aluminium. Aluminium is obtained from bauxite, while manganese and chromite are both important to alloy metallurgy.",
    "sourceFactId": "MN-CR-NEGATIVE"
  },
  {
    "stem": "Which state is especially notable for both manganese and chromite resources?",
    "answer": "Odisha",
    "distractors": [
      "Punjab",
      "Haryana",
      "Delhi"
    ],
    "explanation": "Odisha has important deposits of both manganese and chromite within its mineral-rich plateau belt. Sukinda adds particular importance to the state's chromite geography.",
    "sourceFactId": "MN-CR-ODISHA"
  },
  {
    "stem": "A plant requires manganese for one alloy and chromium for another. Which ores should its supply chain target?",
    "answer": "Manganese ore and chromite",
    "distractors": [
      "Mica and gypsum",
      "Bauxite and limestone",
      "Coal and petroleum"
    ],
    "explanation": "Manganese ore supplies manganese directly, while chromite supplies chromium. The pair therefore fits an alloy-oriented metallurgical supply chain.",
    "sourceFactId": "MN-CR-SUPPLY"
  }
] as const),

buildGeoMinQl("FERRO-ALLOY-RESOURCE-LOGIC", "Ferro-alloy resource logic", [
  {
    "stem": "What is the common industrial link among iron ore, manganese and chromite?",
    "answer": "They support iron, steel and alloy production",
    "distractors": [
      "They are all building stones",
      "They are all liquid fuels",
      "They are all non-metallic insulators"
    ],
    "explanation": "Iron ore supplies the base metal, while manganese and chromium are important alloying inputs. Together they form a core mineral set for metallurgical industries.",
    "sourceFactId": "FERROALLOY-LOGIC"
  },
  {
    "stem": "Which resource combination would favour a ferro-alloy industrial cluster?",
    "answer": "Iron ore plus manganese and chromite",
    "distractors": [
      "Mica plus gypsum only",
      "Petroleum plus salt only",
      "Limestone plus clay only"
    ],
    "explanation": "Ferro-alloy industries need iron-based inputs together with alloying minerals such as manganese and chromium. A region containing these resources has a clear raw-material advantage.",
    "sourceFactId": "FERROALLOY-CLUSTER"
  },
  {
    "stem": "Consider the statements: I. Ferro-alloys combine iron with one or more alloying elements. II. Manganese and chromium are common alloying elements. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Ferro-alloys are iron-based combinations used to introduce specific alloying elements into steel. Manganese and chromium are among the most important such elements.",
    "sourceFactId": "FERROALLOY-STATEMENT"
  },
  {
    "stem": "Which pair contributes an alloying element rather than the main iron base?",
    "answer": "Manganese and chromite",
    "distractors": [
      "Hematite and magnetite",
      "Hematite and iron ore",
      "Magnetite and hematite"
    ],
    "explanation": "Hematite and magnetite primarily supply iron, whereas manganese and chromite supply alloying elements. This distinction is central to ferro-alloy resource logic.",
    "sourceFactId": "FERROALLOY-PAIR"
  },
  {
    "stem": "Why are chromite and manganese often mapped near metallurgical-industry discussions?",
    "answer": "Both supply important alloying elements for steel",
    "distractors": [
      "Both are major cement raw materials",
      "Both are petroleum products",
      "Both are non-metallic electrical insulators"
    ],
    "explanation": "Chromium and manganese modify steel properties and are essential to many alloy grades. Their mineral geography therefore has a direct industrial connection with metallurgy.",
    "sourceFactId": "FERROALLOY-WHY"
  },
  {
    "stem": "A region has abundant iron ore but lacks manganese and chromite. What mineral advantage is missing for specialised alloy production?",
    "answer": "Local sources of important alloying elements",
    "distractors": [
      "Local sources of all iron",
      "Local sources of limestone only",
      "Local sources of petroleum for drilling"
    ],
    "explanation": "Iron ore can supply the base metal, but specialised alloys also require elements such as manganese and chromium. Without those minerals, the region lacks part of the ferro-alloy resource chain.",
    "sourceFactId": "FERROALLOY-REASONING"
  }
] as const),

buildGeoMinQl("INTEGRATED-MANGANESE-AND-CHROMITE-REASONING", "Integrated manganese and chromite reasoning", [
  {
    "stem": "Which location-resource pair is correct?",
    "answer": "Sukinda — chromite",
    "distractors": [
      "Balaghat — petroleum",
      "Koderma — manganese",
      "Neyveli — chromite"
    ],
    "explanation": "Sukinda in Odisha is a major chromite region. Balaghat is linked with manganese and copper, Koderma with mica and Neyveli with lignite.",
    "sourceFactId": "MN-CR-INTEGRATED-1"
  },
  {
    "stem": "Which chain is correct?",
    "answer": "Balaghat → manganese → ferro-alloy use",
    "distractors": [
      "Sukinda → mica → insulation",
      "Koderma → chromite → stainless steel",
      "Digboi → manganese → ferro-alloy"
    ],
    "explanation": "Balaghat in Madhya Pradesh is an important manganese location, and manganese is used in ferro-alloys. The other chains combine locations and minerals incorrectly.",
    "sourceFactId": "MN-CR-INTEGRATED-2"
  },
  {
    "stem": "Consider the statements: I. Sukinda is in Odisha. II. Balaghat is in Madhya Pradesh. III. Both are linked with ferro-alloy minerals. Which is correct?",
    "answer": "I, II and III",
    "distractors": [
      "I and II only",
      "II and III only",
      "I and III only"
    ],
    "explanation": "Sukinda is a chromite region in Odisha and Balaghat is a manganese region in Madhya Pradesh. Both minerals are important to ferro-alloy and steel industries.",
    "sourceFactId": "MN-CR-INTEGRATED-3"
  },
  {
    "stem": "Which mineral-location combination would most directly support stainless-steel alloying?",
    "answer": "Chromite from Sukinda",
    "distractors": [
      "Mica from Koderma",
      "Gypsum from Rajasthan",
      "Limestone from a cement belt"
    ],
    "explanation": "Chromite from Sukinda supplies chromium, the alloying metal central to stainless steel. Mica, gypsum and limestone have important but different industrial uses.",
    "sourceFactId": "MN-CR-INTEGRATED-4"
  },
  {
    "stem": "Which state can be identified by the combined clues 'Sukinda chromite, manganese deposits, major iron ore'?",
    "answer": "Odisha",
    "distractors": [
      "Punjab",
      "Haryana",
      "Kerala"
    ],
    "explanation": "Odisha combines major iron ore, manganese and chromite resources, with Sukinda as a famous chromite location. The three clues strongly identify the state.",
    "sourceFactId": "MN-CR-INTEGRATED-5"
  },
  {
    "stem": "A question asks for one base-metal ore and two alloy minerals used in steel. Which set is correct?",
    "answer": "Iron ore, manganese and chromite",
    "distractors": [
      "Bauxite, mica and gypsum",
      "Copper, limestone and mica",
      "Gypsum, coal and petroleum"
    ],
    "explanation": "Iron ore supplies the iron base, while manganese and chromite provide alloying elements. This three-resource set directly matches the structure of iron and alloy-steel production.",
    "sourceFactId": "MN-CR-INTEGRATED-6"
  }
] as const),

buildGeoMinQl("NAGPUR-BHANDARA-MANGANESE-BELT", "Nagpur–Bhandara manganese belt", [
  {
    "stem": "The Nagpur–Bhandara belt is best known for which mineral?",
    "answer": "Manganese ore",
    "distractors": [
      "Mica",
      "Bauxite",
      "Rock phosphate"
    ],
    "explanation": "Nagpur and Bhandara districts in Maharashtra form an important manganese-bearing region. Their recurring appearance in official mineral records makes the belt a durable location-resource association.",
    "sourceFactId": "MN-NAGPUR-BHANDARA-RESOURCE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-MANGANESE-ORE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "Which state contains the important Nagpur and Bhandara manganese districts?",
    "answer": "Maharashtra",
    "distractors": [
      "Odisha",
      "Rajasthan",
      "Jharkhand"
    ],
    "explanation": "Nagpur and Bhandara are districts of Maharashtra and both contain important manganese mines. They form part of the broader central Indian manganese belt.",
    "sourceFactId": "MN-NAGPUR-BHANDARA-STATE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-MANGANESE-ORE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "Consider the statements: I. Nagpur is an important manganese district. II. Bhandara also has manganese deposits. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Official IBM mineral records identify manganese mining in both Nagpur and Bhandara districts of Maharashtra. The two districts therefore belong to the same broad manganese geography.",
    "sourceFactId": "MN-NAGPUR-BHANDARA-STATEMENT",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-MANGANESE-ORE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Bhandara — manganese ore",
    "distractors": [
      "Bhandara — offshore petroleum",
      "Nagpur — mica only",
      "Bhandara — gypsum only"
    ],
    "explanation": "Bhandara is a recognised manganese district in Maharashtra, while Nagpur is another important manganese district nearby. The alternative resources belong to unrelated mineral regions.",
    "sourceFactId": "MN-BHANDARA-MATCH",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-MANGANESE-ORE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "A map marks Dongri Buzurg in Bhandara and manganese mines around Nagpur. Which mineral belt is being indicated?",
    "answer": "Central Indian manganese belt",
    "distractors": [
      "Eastern mica belt",
      "Western petroleum belt",
      "Rajasthan gypsum belt"
    ],
    "explanation": "Dongri Buzurg in Bhandara and several Nagpur mines are manganese locations recorded by IBM. Together they identify the central Indian manganese belt of Maharashtra.",
    "sourceFactId": "MN-NAGPUR-BHANDARA-MAP",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-MANGANESE-ORE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "Which comparison is correct?",
    "answer": "Nagpur–Bhandara is a manganese region, while Sukinda is a chromite region",
    "distractors": [
      "Both are mica belts",
      "Both are petroleum fields",
      "Sukinda is manganese-only and Nagpur–Bhandara is gypsum"
    ],
    "explanation": "Nagpur–Bhandara is strongly linked with manganese in Maharashtra, whereas Sukinda in Odisha is famous for chromite. The comparison separates two major ferro-alloy mineral regions.",
    "sourceFactId": "MN-NAGPUR-SUKINDA-COMPARE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-MANGANESE-ORE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  }
] as const)
]);

export const GEO_MIN_001_CP003_REVIEW_BATCH_V1 = finalizeGeoMinCp(3, QLS);
export function auditGeoMin001Cp003ReviewBatchV1() { return auditGeoMinCp(3, QLS, GEO_MIN_001_CP003_REVIEW_BATCH_V1); }
