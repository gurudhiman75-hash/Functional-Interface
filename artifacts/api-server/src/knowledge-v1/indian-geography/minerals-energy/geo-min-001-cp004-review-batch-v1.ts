import { buildGeoMinQl, finalizeGeoMinCp, auditGeoMinCp } from "./geo-min-001-review-builder";

const QLS = Object.freeze([
buildGeoMinQl("BAUXITE-AS-ALUMINIUM-ORE", "Bauxite as aluminium ore", [
  {
    "stem": "Which mineral is the principal ore of aluminium?",
    "answer": "Bauxite",
    "distractors": [
      "Hematite",
      "Mica",
      "Gypsum"
    ],
    "explanation": "Bauxite is the chief ore from which aluminium is extracted. It is therefore a non-ferrous metallic mineral with major importance to transport, electrical and engineering industries.",
    "sourceFactId": "BAUXITE-ALUMINIUM"
  },
  {
    "stem": "An aluminium smelter depends on which mineral raw material before refining and electrolysis?",
    "answer": "Bauxite",
    "distractors": [
      "Chromite",
      "Limestone",
      "Manganese"
    ],
    "explanation": "Bauxite is processed to obtain alumina, which is then used to produce aluminium metal. Chromite, limestone and manganese serve very different metallurgical or industrial roles.",
    "sourceFactId": "BAUXITE-SMELTER"
  },
  {
    "stem": "Consider the statements: I. Bauxite is non-ferrous. II. It is the principal aluminium ore. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Bauxite belongs to the non-ferrous metallic mineral group and is the main raw material for aluminium production. Both statements therefore describe the same mineral correctly.",
    "sourceFactId": "BAUXITE-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched in Bauxite as aluminium ore?",
    "answer": "Bauxite — aluminium",
    "distractors": [
      "Bauxite — chromium",
      "Bauxite — iron only",
      "Bauxite — mica sheets"
    ],
    "explanation": "Bauxite yields aluminium after refining and smelting. Chromium comes from chromite, iron from iron ores such as hematite and magnetite, and mica is a separate non-metallic mineral.",
    "sourceFactId": "BAUXITE-MATCH"
  },
  {
    "stem": "Which industry would be affected most directly by a shortage of bauxite?",
    "answer": "Aluminium industry",
    "distractors": [
      "Jute textile industry",
      "Sugar industry",
      "Tea processing industry"
    ],
    "explanation": "Bauxite is the essential ore used to make aluminium, so its availability directly affects aluminium refining and smelting. The other industries depend primarily on agricultural raw materials.",
    "sourceFactId": "BAUXITE-INDUSTRY"
  },
  {
    "stem": "A mineral is non-ferrous, forms through intense weathering in many regions and supplies a light metal. Which mineral is it?",
    "answer": "Bauxite",
    "distractors": [
      "Manganese",
      "Mica",
      "Limestone"
    ],
    "explanation": "Bauxite can form as a residual weathering product and is the principal source of aluminium, a light non-ferrous metal. The combined clues separate it from manganese and non-metallic minerals.",
    "sourceFactId": "BAUXITE-REASONING"
  }
] as const),

buildGeoMinQl("BAUXITE-FORMATION-AND-RESIDUAL-OCCURRENCE", "Bauxite formation and residual occurrence", [
  {
    "stem": "Bauxite commonly forms through which process in tropical and subtropical conditions?",
    "answer": "Intense weathering and leaching of rocks rich in aluminium compounds",
    "distractors": [
      "River sorting of heavy metallic grains",
      "Coalification of plant remains",
      "Cooling of magma in a narrow fissure"
    ],
    "explanation": "Bauxite commonly develops where prolonged chemical weathering removes silica and other soluble materials while aluminium-rich residues remain. This is a residual mode of mineral concentration.",
    "sourceFactId": "BAUXITE-FORMATION"
  },
  {
    "stem": "Why is bauxite often found on old plateau surfaces?",
    "answer": "Long exposure allows strong weathering and residual concentration",
    "distractors": [
      "Plateaus are the only places where rivers deposit gold",
      "Bauxite requires deep marine water",
      "It forms only inside coal seams"
    ],
    "explanation": "Stable plateau surfaces may remain exposed to weathering for long periods, allowing leaching and concentration of aluminium-rich material. This favours residual bauxite deposits.",
    "sourceFactId": "BAUXITE-PLATEAU"
  },
  {
    "stem": "Consider the statements: I. Bauxite can be a residual deposit. II. Its formation may involve leaching. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Bauxite is a classic residual mineral and often forms after intense chemical weathering. Leaching removes more soluble constituents and leaves aluminium-rich material behind.",
    "sourceFactId": "BAUXITE-STATEMENT-FORM"
  },
  {
    "stem": "A deeply weathered upland has a reddish aluminium-rich mantle rather than a river-sorted heavy-mineral layer. What deposit is indicated?",
    "answer": "Residual bauxite",
    "distractors": [
      "Placer gold",
      "Bedded coal",
      "Petroleum reservoir"
    ],
    "explanation": "The combination of deep weathering, upland location and aluminium-rich residue points to bauxite. A placer would instead reflect mechanical concentration in alluvial material.",
    "sourceFactId": "BAUXITE-CLUE-FORM"
  },
  {
    "stem": "Which pair is correctly matched in Bauxite formation and residual occurrence?",
    "answer": "Bauxite — residual weathering deposit",
    "distractors": [
      "Gold in alluvium — residual deposit",
      "Coal seam — lode deposit",
      "Chromite in a fissure — sedimentary bed"
    ],
    "explanation": "Bauxite commonly forms residually by weathering and leaching. Gold in alluvium is a placer, coal is typically bedded, and fissure minerals are veins or lodes.",
    "sourceFactId": "BAUXITE-MATCH-FORM"
  },
  {
    "stem": "Deposit X formed by leaching on a plateau; deposit Y formed by river sorting of dense grains. Which identification is correct?",
    "answer": "X may be bauxite; Y may be a placer deposit",
    "distractors": [
      "X must be coal; Y must be bauxite",
      "Both must be petroleum deposits",
      "Both must be lode deposits"
    ],
    "explanation": "Leaching on a stable surface can create residual bauxite, whereas flowing water can concentrate heavy resistant grains into placers. The processes are fundamentally different.",
    "sourceFactId": "BAUXITE-VS-PLACER"
  }
] as const),

buildGeoMinQl("MAJOR-BAUXITE-REGIONS-AND-PLATEAUS", "Major bauxite regions and plateaus", [
  {
    "stem": "Which plateau-region association is well known for bauxite deposits in central India?",
    "answer": "Amarkantak–Maikal plateau region",
    "distractors": [
      "Indo-Gangetic plain",
      "Punjab plains",
      "Sundarbans delta only"
    ],
    "explanation": "The Amarkantak and Maikal hill-plateau region is a standard bauxite association in central India. Its old weathered surfaces favour residual bauxite formation.",
    "sourceFactId": "BAUXITE-AMARKANTAK"
  },
  {
    "stem": "Panchpatmali hills, an important bauxite location, are in which state?",
    "answer": "Odisha",
    "distractors": [
      "Punjab",
      "Haryana",
      "Assam"
    ],
    "explanation": "Panchpatmali in Odisha is a major bauxite-bearing hill region. It is part of the mineral-rich eastern peninsular plateau zone.",
    "sourceFactId": "BAUXITE-PANCHPATMALI"
  },
  {
    "stem": "Consider the statements: I. Odisha contains important bauxite deposits. II. Bauxite is often linked with plateau and hill surfaces. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Odisha has major bauxite-bearing uplands, and bauxite commonly develops on deeply weathered plateau surfaces. The two facts fit the mineral's residual origin.",
    "sourceFactId": "BAUXITE-ODISHA-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched in Major bauxite regions and plateaus?",
    "answer": "Panchpatmali — bauxite",
    "distractors": [
      "Panchpatmali — petroleum",
      "Amarkantak — offshore gas",
      "Maikal hills — mica belt only"
    ],
    "explanation": "Panchpatmali is a recognised bauxite area, while the Amarkantak–Maikal region is also associated with bauxite. The alternative resources do not fit these upland locations.",
    "sourceFactId": "BAUXITE-REGION-MATCH"
  },
  {
    "stem": "A mineral map marks high plateaus of Odisha and central India rather than river valleys. Which resource is a likely focus?",
    "answer": "Bauxite",
    "distractors": [
      "Placer gold only",
      "Offshore petroleum",
      "Natural gas from coastal basins only"
    ],
    "explanation": "Bauxite commonly occurs on old weathered uplands in Odisha and central India. Its map pattern is therefore quite different from river placers or offshore hydrocarbons.",
    "sourceFactId": "BAUXITE-MAP"
  },
  {
    "stem": "Why do Panchpatmali and Amarkantak appear together in mineral-geography questions?",
    "answer": "Both are important bauxite-bearing upland regions",
    "distractors": [
      "Both are major offshore oilfields",
      "Both are coastal mica ports",
      "Both are coal seams in the Damodar valley"
    ],
    "explanation": "The two locations are widely used examples of bauxite geography in India's plateau regions. Their shared link is aluminium ore rather than fuel or mica resources.",
    "sourceFactId": "BAUXITE-REGION-REASONING"
  }
] as const),

buildGeoMinQl("COPPER-PROPERTIES-AND-INDUSTRIAL-USES", "Copper properties and industrial uses", [
  {
    "stem": "Which metal is especially important for electrical cables because of its high electrical conductivity?",
    "answer": "Copper",
    "distractors": [
      "Lead",
      "Manganese",
      "Chromium"
    ],
    "explanation": "Copper conducts electricity very well and can be drawn into wires, making it a major material for electrical and electronic applications. It is a non-ferrous metal.",
    "sourceFactId": "COPPER-CONDUCTIVITY"
  },
  {
    "stem": "Which mineral resource is most directly linked with electrical wiring and electronic equipment?",
    "answer": "Copper ore",
    "distractors": [
      "Gypsum",
      "Mica as an ore",
      "Limestone"
    ],
    "explanation": "Copper ore supplies the copper used in wiring, motors, electronics and many alloys. Its electrical conductivity gives it a distinct industrial role among metallic minerals.",
    "sourceFactId": "COPPER-USE"
  },
  {
    "stem": "Consider the statements: I. Copper is non-ferrous. II. It is widely used in electrical equipment. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Copper belongs to the non-ferrous metallic group and is an excellent conductor of electricity. That combination explains its major role in electrical industries.",
    "sourceFactId": "COPPER-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched in Copper properties and industrial uses?",
    "answer": "Copper — electrical conductor",
    "distractors": [
      "Copper — principal iron ore",
      "Copper — non-metallic cement raw material",
      "Copper — fuel mineral"
    ],
    "explanation": "Copper's conductivity makes it important in electrical systems. It is neither an iron ore nor a non-metallic cement material or fuel.",
    "sourceFactId": "COPPER-MATCH"
  },
  {
    "stem": "A manufacturer needs a ductile metal for electrical coils and cables. Which metal is the most suitable among these options?",
    "answer": "Copper",
    "distractors": [
      "Gypsum",
      "Limestone",
      "Mica"
    ],
    "explanation": "Copper combines good electrical conductivity with ductility, allowing it to be formed into wires. Gypsum, limestone and mica are non-metallic minerals with other uses.",
    "sourceFactId": "COPPER-CLUE"
  },
  {
    "stem": "Why can rising electrification increase strategic demand for copper even when steel demand is unchanged?",
    "answer": "Copper is a major conductor used in electrical networks and equipment",
    "distractors": [
      "Copper replaces all cement in construction",
      "Copper is the principal fuel in power plants",
      "Copper is needed only to make glass"
    ],
    "explanation": "Electric networks, motors, transformers and electronics use substantial copper because of its conductivity. This demand channel is distinct from the iron-and-steel mineral chain.",
    "sourceFactId": "COPPER-REASONING"
  }
] as const),

buildGeoMinQl("MAJOR-COPPER-FIELDS-KHETRI-BALAGHAT-AND-SINGHBHUM", "Major copper fields: Khetri, Balaghat and Singhbhum", [
  {
    "stem": "Khetri copper belt is located in which state?",
    "answer": "Rajasthan",
    "distractors": [
      "Odisha",
      "Assam",
      "Kerala"
    ],
    "explanation": "Khetri in Rajasthan is one of India's best-known copper-mining regions. It forms an important part of the Aravalli mineral belt.",
    "sourceFactId": "KHETRI-STATE"
  },
  {
    "stem": "Balaghat district, important for copper as well as manganese, lies in which state?",
    "answer": "Madhya Pradesh",
    "distractors": [
      "Goa",
      "Punjab",
      "Tamil Nadu"
    ],
    "explanation": "Balaghat in Madhya Pradesh is an important copper-bearing region and is also known for manganese. This dual mineral identity makes it a useful exam location.",
    "sourceFactId": "BALAGHAT-COPPER"
  },
  {
    "stem": "Consider the statements: I. Khetri is linked with copper. II. Singhbhum is also a recognised copper region. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Khetri in Rajasthan and Singhbhum in Jharkhand are both classic copper-mining regions. They lie in different mineral belts but share the same resource link.",
    "sourceFactId": "COPPER-FIELDS-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched in Major copper fields: Khetri, Balaghat and Singhbhum?",
    "answer": "Singhbhum — copper",
    "distractors": [
      "Khetri — petroleum",
      "Balaghat — mica only",
      "Singhbhum — gypsum only"
    ],
    "explanation": "Singhbhum has important copper deposits, while Khetri and Balaghat are also standard copper locations. The alternatives assign unrelated resources to these regions.",
    "sourceFactId": "SINGHBHUM-COPPER"
  },
  {
    "stem": "Which set lists three important copper regions of India?",
    "answer": "Khetri, Balaghat and Singhbhum",
    "distractors": [
      "Koderma, Nellore and Ajmer",
      "Jharia, Raniganj and Bokaro",
      "Digboi, Mumbai High and Ankleshwar"
    ],
    "explanation": "Khetri, Balaghat and Singhbhum are widely taught copper locations. The other sets correspond more closely to mica, coal or petroleum geography.",
    "sourceFactId": "COPPER-FIELDS-LIST"
  },
  {
    "stem": "A map marks one copper region in Rajasthan, one in Madhya Pradesh and one in Jharkhand. Which sequence is correct?",
    "answer": "Khetri — Balaghat — Singhbhum",
    "distractors": [
      "Singhbhum — Khetri — Balaghat",
      "Balaghat — Singhbhum — Khetri",
      "Koderma — Nellore — Jharia"
    ],
    "explanation": "Khetri lies in Rajasthan, Balaghat in Madhya Pradesh and Singhbhum in Jharkhand. The three together form a standard west-central-east copper-location sequence.",
    "sourceFactId": "COPPER-MAP-REASONING"
  }
] as const),

buildGeoMinQl("LEAD-AND-ZINC-AS-NON-FERROUS-MINERALS", "Lead and zinc as non-ferrous minerals", [
  {
    "stem": "Lead and zinc belong to which mineral category?",
    "answer": "Non-ferrous metallic minerals",
    "distractors": [
      "Ferrous iron ores",
      "Non-metallic minerals",
      "Fuel minerals"
    ],
    "explanation": "Lead and zinc are metallic minerals but are not part of the iron-based ferrous group. They are therefore classified as non-ferrous metals.",
    "sourceFactId": "LEAD-ZINC-CLASS"
  },
  {
    "stem": "Which metal pair is often obtained from closely related sulphide ore deposits?",
    "answer": "Lead and zinc",
    "distractors": [
      "Iron and aluminium",
      "Mica and gypsum",
      "Coal and petroleum"
    ],
    "explanation": "Lead and zinc commonly occur together in sulphide mineralisation and are often mined within the same mineral districts. Both are important non-ferrous metals.",
    "sourceFactId": "LEAD-ZINC-PAIR"
  },
  {
    "stem": "Consider the statements: I. Zinc is non-ferrous. II. Lead is a non-metallic mineral. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Zinc and lead are both non-ferrous metallic resources. Calling lead non-metallic would place it in the wrong mineral class.",
    "sourceFactId": "LEAD-ZINC-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched in Lead and zinc as non-ferrous minerals?",
    "answer": "Zinc — non-ferrous metal",
    "distractors": [
      "Lead — ferrous mineral",
      "Zinc — fuel mineral",
      "Lead — non-metallic cement mineral"
    ],
    "explanation": "Zinc is a non-ferrous metal, as is lead. Neither belongs to the ferrous iron group or to fuel and cement-mineral categories.",
    "sourceFactId": "LEAD-ZINC-MATCH"
  },
  {
    "stem": "Which metal is widely used to protect iron and steel from corrosion through galvanising?",
    "answer": "Zinc",
    "distractors": [
      "Manganese",
      "Gypsum",
      "Mica"
    ],
    "explanation": "Zinc coatings protect iron and steel from corrosion in the galvanising process. This industrial use makes zinc important even though it is not a ferrous mineral itself.",
    "sourceFactId": "ZINC-GALVANISING"
  },
  {
    "stem": "Why can lead and zinc be treated together in regional mineral geography?",
    "answer": "Their ores commonly occur together in polymetallic deposits",
    "distractors": [
      "Both are varieties of coal",
      "Both are non-metallic sheet minerals",
      "Both occur only in river placers"
    ],
    "explanation": "Lead and zinc frequently occur together in sulphide ore bodies, so mining districts can produce both metals. Their shared geological occurrence supports combined regional treatment.",
    "sourceFactId": "LEAD-ZINC-REASONING"
  }
] as const),

buildGeoMinQl("RAJASTHAN-LEAD-ZINC-BELT", "Rajasthan lead-zinc belt", [
  {
    "stem": "Which state is especially important for India's lead-zinc mineral belt?",
    "answer": "Rajasthan",
    "distractors": [
      "Punjab",
      "West Bengal",
      "Kerala"
    ],
    "explanation": "Rajasthan contains several major lead-zinc deposits in the Aravalli region. Zawar and Rampura Agucha are among the best-known locations.",
    "sourceFactId": "LEAD-ZINC-RAJASTHAN"
  },
  {
    "stem": "Zawar mines are most strongly linked with which minerals?",
    "answer": "Lead and zinc",
    "distractors": [
      "Iron ore and coal",
      "Mica and gypsum only",
      "Petroleum and natural gas"
    ],
    "explanation": "Zawar in Rajasthan is a historic lead-zinc mining area. Its location in the Aravalli mineral belt makes it a standard non-ferrous mineral fact.",
    "sourceFactId": "ZAWAR-LEAD-ZINC"
  },
  {
    "stem": "Consider the statements: I. Zawar lies in Rajasthan. II. Zawar is a major lead-zinc mining area. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Zawar is located in Rajasthan and is a classic lead-zinc mining district. Both statements correctly identify its geography and resource.",
    "sourceFactId": "ZAWAR-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched in Rajasthan lead-zinc belt?",
    "answer": "Rampura Agucha — lead-zinc",
    "distractors": [
      "Khetri — mica",
      "Zawar — petroleum",
      "Singhbhum — gypsum"
    ],
    "explanation": "Rampura Agucha in Rajasthan is a major lead-zinc deposit. Khetri is known for copper, while the other pairings attach unrelated resources.",
    "sourceFactId": "RAMPURA-AGUCHA"
  },
  {
    "stem": "A map marks Zawar and Rampura Agucha in the Aravalli region. Which resource should be identified?",
    "answer": "Lead-zinc",
    "distractors": [
      "Offshore petroleum",
      "Coal only",
      "Mica only"
    ],
    "explanation": "Both Zawar and Rampura Agucha are prominent lead-zinc locations in Rajasthan. Their joint appearance strongly indicates the state's non-ferrous lead-zinc belt.",
    "sourceFactId": "LEAD-ZINC-MAP"
  },
  {
    "stem": "Which comparison is correct for Rajasthan lead-zinc belt?",
    "answer": "Khetri is known for copper, while Zawar is known for lead-zinc",
    "distractors": [
      "Both are major coalfields",
      "Khetri is lead-zinc and Zawar is petroleum",
      "Both are mica belts"
    ],
    "explanation": "Khetri and Zawar are both in Rajasthan but represent different non-ferrous mineral resources. Khetri is a copper belt, whereas Zawar is linked with lead and zinc.",
    "sourceFactId": "KHETRI-ZAWAR-COMPARE"
  }
] as const),

buildGeoMinQl("ALUMINIUM-PROPERTIES-AND-USES", "Aluminium properties and uses", [
  {
    "stem": "Which property helps explain aluminium's extensive use in aircraft and transport equipment?",
    "answer": "Low density combined with useful strength",
    "distractors": [
      "Very high brittleness",
      "Poor corrosion resistance",
      "Inability to form alloys"
    ],
    "explanation": "Aluminium is light and can form strong alloys, making it valuable where reducing weight matters. It also resists corrosion and can be shaped easily.",
    "sourceFactId": "ALUMINIUM-LIGHT"
  },
  {
    "stem": "Which metal obtained from bauxite is both a good conductor and corrosion resistant?",
    "answer": "Aluminium",
    "distractors": [
      "Manganese",
      "Chromium",
      "Lead only"
    ],
    "explanation": "Aluminium combines electrical conductivity with a protective oxide layer that resists corrosion. These properties support uses in power lines, packaging and engineering.",
    "sourceFactId": "ALUMINIUM-PROPERTIES"
  },
  {
    "stem": "Consider the statements: I. Aluminium is obtained from bauxite. II. Aluminium is a ferrous metal. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Bauxite is the principal aluminium ore, but aluminium is non-ferrous because it is not an iron-based metal. The first statement is therefore correct and the second is not.",
    "sourceFactId": "ALUMINIUM-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched in Aluminium properties and uses?",
    "answer": "Aluminium — light non-ferrous metal",
    "distractors": [
      "Aluminium — iron ore",
      "Aluminium — non-metallic mineral",
      "Aluminium — coal product"
    ],
    "explanation": "Aluminium is a lightweight non-ferrous metal obtained from bauxite. It is neither an iron ore nor a non-metallic or fuel-derived material.",
    "sourceFactId": "ALUMINIUM-MATCH"
  },
  {
    "stem": "Why is aluminium used in overhead electrical transmission lines despite copper's excellent conductivity?",
    "answer": "Its low weight and useful conductivity can be advantageous",
    "distractors": [
      "It is a non-conductor",
      "It is denser than lead",
      "It is obtained from coal"
    ],
    "explanation": "Aluminium conducts electricity reasonably well while being much lighter than many metals. For long overhead lines, the combination of conductivity and low mass can be valuable.",
    "sourceFactId": "ALUMINIUM-TRANSMISSION"
  },
  {
    "stem": "Which resource chain is correct?",
    "answer": "Bauxite → alumina → aluminium → transport/electrical uses",
    "distractors": [
      "Chromite → alumina → aluminium",
      "Mica → iron → aluminium",
      "Gypsum → copper → aircraft metal"
    ],
    "explanation": "Bauxite is refined to alumina and then smelted to produce aluminium. The resulting metal is widely used because it is light, workable, conductive and corrosion resistant.",
    "sourceFactId": "BAUXITE-ALUMINIUM-CHAIN"
  }
] as const),

buildGeoMinQl("INTEGRATED-NON-FERROUS-MINERAL-REASONING", "Integrated non-ferrous mineral reasoning", [
  {
    "stem": "Which set contains only non-ferrous mineral resources?",
    "answer": "Bauxite, copper and lead-zinc",
    "distractors": [
      "Iron ore, manganese and chromite",
      "Mica, limestone and gypsum",
      "Coal, lignite and petroleum"
    ],
    "explanation": "Bauxite, copper, lead and zinc are all metallic resources outside the ferrous iron group. The other sets represent ferro-alloy, non-metallic or energy resources.",
    "sourceFactId": "NONFERROUS-INTEGRATED-1"
  },
  {
    "stem": "Which location-resource pair is incorrect for Integrated non-ferrous mineral reasoning?",
    "answer": "Khetri — bauxite",
    "distractors": [
      "Khetri — copper",
      "Zawar — lead-zinc",
      "Panchpatmali — bauxite"
    ],
    "explanation": "Khetri in Rajasthan is known for copper, not bauxite. Zawar is a lead-zinc region and Panchpatmali is an important bauxite location.",
    "sourceFactId": "NONFERROUS-INTEGRATED-2"
  },
  {
    "stem": "Consider the statements: I. Bauxite supplies aluminium. II. Khetri is linked with copper. III. Zawar is linked with lead-zinc. Which is correct?",
    "answer": "I, II and III",
    "distractors": [
      "I and II only",
      "II and III only",
      "I and III only"
    ],
    "explanation": "All three are standard non-ferrous mineral relationships: bauxite–aluminium, Khetri–copper and Zawar–lead-zinc. Together they cover ore, metal and location knowledge.",
    "sourceFactId": "NONFERROUS-INTEGRATED-3"
  },
  {
    "stem": "Which state is identified by the clues 'Khetri copper' and 'Zawar lead-zinc'?",
    "answer": "Rajasthan",
    "distractors": [
      "Odisha",
      "Assam",
      "Karnataka"
    ],
    "explanation": "Both Khetri and Zawar are in Rajasthan, though they represent different non-ferrous minerals. The combined clues strongly identify the state's Aravalli mineral belt.",
    "sourceFactId": "NONFERROUS-INTEGRATED-4"
  },
  {
    "stem": "Which chain is correct for Integrated non-ferrous mineral reasoning?",
    "answer": "Panchpatmali → bauxite → aluminium",
    "distractors": [
      "Khetri → bauxite → aluminium",
      "Zawar → copper → electrical wiring",
      "Singhbhum → gypsum → cement"
    ],
    "explanation": "Panchpatmali is a bauxite region and bauxite is the principal aluminium ore. Khetri and Singhbhum are copper areas, while Zawar is lead-zinc.",
    "sourceFactId": "NONFERROUS-INTEGRATED-5"
  },
  {
    "stem": "A map marks Panchpatmali, Khetri and Zawar. What common classification links the principal minerals of these locations?",
    "answer": "They are non-ferrous metallic mineral resources",
    "distractors": [
      "They are all coalfields",
      "They are all non-metallic minerals",
      "They are all iron-ore belts"
    ],
    "explanation": "Panchpatmali represents bauxite, Khetri copper and Zawar lead-zinc. Although the metals differ, all belong to the non-ferrous metallic group.",
    "sourceFactId": "NONFERROUS-INTEGRATED-6"
  }
] as const),

buildGeoMinQl("MALANJKHAND-COPPER-BALAGHAT", "Malanjkhand copper mine and Balaghat", [
  {
    "stem": "Malanjkhand, one of India's best-known copper mines, is located in which state?",
    "answer": "Madhya Pradesh",
    "distractors": [
      "Rajasthan",
      "Jharkhand",
      "Odisha"
    ],
    "explanation": "Malanjkhand Copper Mine is in Balaghat district of Madhya Pradesh. It is a major copper location and should be distinguished from Khetri in Rajasthan and Singhbhum in Jharkhand.",
    "sourceFactId": "CU-MALANJKHAND-STATE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-COPPER",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "Which mineral is extracted at Malanjkhand in Balaghat district?",
    "answer": "Copper ore",
    "distractors": [
      "Iron ore",
      "Mica",
      "Gypsum"
    ],
    "explanation": "IBM records Malanjkhand as a copper mine in Balaghat district, Madhya Pradesh. The location-resource pair is one of the most important copper facts in Indian geography.",
    "sourceFactId": "CU-MALANJKHAND-RESOURCE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-COPPER",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "Consider the statements: I. Malanjkhand is in Balaghat district. II. It is linked with copper ore. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Malanjkhand lies in Balaghat district of Madhya Pradesh and is worked for copper ore. Both statements correctly identify its location and mineral resource.",
    "sourceFactId": "CU-MALANJKHAND-STATEMENT",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-COPPER",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "Which pair is correctly matched in Malanjkhand copper mine and Balaghat?",
    "answer": "Malanjkhand — copper",
    "distractors": [
      "Malanjkhand — mica",
      "Malanjkhand — petroleum",
      "Malanjkhand — gypsum"
    ],
    "explanation": "Malanjkhand is a major copper-mining centre. Mica, petroleum and gypsum belong to different mineral belts and should not be attached to this Balaghat location.",
    "sourceFactId": "CU-MALANJKHAND-MATCH",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-COPPER",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "A map marks Khetri, Malanjkhand and Singhbhum. Which mineral links all three locations?",
    "answer": "Copper",
    "distractors": [
      "Manganese",
      "Mica",
      "Lignite"
    ],
    "explanation": "Khetri in Rajasthan, Malanjkhand in Madhya Pradesh and Singhbhum in Jharkhand are classic copper locations. Together they provide a useful west-central-east map pattern.",
    "sourceFactId": "CU-THREE-FIELDS-MAP",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-COPPER",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  },
  {
    "stem": "Which comparison is correct for Malanjkhand copper mine and Balaghat?",
    "answer": "Khetri is in Rajasthan, Malanjkhand in Madhya Pradesh and Singhbhum in Jharkhand",
    "distractors": [
      "All three are in Rajasthan",
      "Malanjkhand is in Odisha and Khetri in Jharkhand",
      "All three are iron-ore belts"
    ],
    "explanation": "The three copper regions lie in different states: Khetri in Rajasthan, Malanjkhand in Madhya Pradesh and Singhbhum in Jharkhand. This spatial contrast is valuable for elimination questions.",
    "sourceFactId": "CU-THREE-FIELDS-COMPARE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-COPPER",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024",
      "GEOLOGICAL-SURVEY-OF-INDIA-MINERAL-GEOLOGY"
    ]
  }
] as const),

buildGeoMinQl("GOLD-HUTTI-KOLAR-KARNATAKA", "Gold geography: Hutti, Kolar and Karnataka", [
  {
    "stem": "Hutti, one of India's best-known gold-mining centres, is located in which state?",
    "answer": "Karnataka",
    "distractors": [
      "Rajasthan",
      "Jharkhand",
      "Odisha"
    ],
    "explanation": "Hutti lies in Raichur district of Karnataka and remains one of the country's best-known gold-mining locations. It is a standard state-location pair in Indian mineral geography.",
    "sourceFactId": "GOLD-HUTTI-STATE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-GOLD",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which mineral is most strongly linked with Hutti in Raichur district?",
    "answer": "Gold",
    "distractors": [
      "Copper",
      "Chromite",
      "Mica"
    ],
    "explanation": "IBM records Hutti as a gold mine in Raichur district of Karnataka. The location should be distinguished from copper belts such as Khetri and chromite centres such as Sukinda.",
    "sourceFactId": "GOLD-HUTTI-RESOURCE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-GOLD",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Consider the statements: I. Hutti is in Karnataka. II. Kolar is historically linked with gold mining. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Hutti is an active gold-mining centre in Karnataka, while Kolar Gold Fields are historically important in the same state's gold geography. Both associations are durable exam facts.",
    "sourceFactId": "GOLD-HUTTI-KOLAR-STATEMENT",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-GOLD",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which pair is correctly matched in Gold geography: Hutti, Kolar and Karnataka?",
    "answer": "Hutti — gold",
    "distractors": [
      "Hutti — mica",
      "Kolar — petroleum",
      "Raichur — chromite only"
    ],
    "explanation": "Hutti in Raichur district is a major gold location, and Kolar is also historically famous for gold. The alternative pairings attach unrelated resources to these Karnataka locations.",
    "sourceFactId": "GOLD-HUTTI-MATCH",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-GOLD",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "A mineral map marks Hutti in Raichur and the historic Kolar Gold Fields. Which resource is being shown?",
    "answer": "Gold",
    "distractors": [
      "Bauxite",
      "Gypsum",
      "Rock phosphate"
    ],
    "explanation": "Hutti and Kolar are two of the best-known names in India's gold geography. Their joint appearance on a map strongly identifies gold rather than industrial non-metallic minerals.",
    "sourceFactId": "GOLD-MAP",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-GOLD",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which comparison is correct for Gold geography: Hutti, Kolar and Karnataka?",
    "answer": "Hutti is linked with gold in Karnataka, while Panna is linked with diamond in Madhya Pradesh",
    "distractors": [
      "Both are copper mines",
      "Panna is a goldfield and Hutti a diamond belt",
      "Both are iron-ore regions"
    ],
    "explanation": "Hutti is a major Karnataka gold centre, whereas Panna in Madhya Pradesh is famous for diamonds. The contrast separates two high-value mineral regions frequently tested in static GK.",
    "sourceFactId": "GOLD-DIAMOND-COMPARE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-GOLD",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  }
] as const),

buildGeoMinQl("DIAMOND-PANNA-AND-INDIAN-DIAMOND-TRACTS", "Diamond, Panna and Indian diamond tracts", [
  {
    "stem": "Panna, India's best-known diamond-mining district, is located in which state?",
    "answer": "Madhya Pradesh",
    "distractors": [
      "Karnataka",
      "Rajasthan",
      "Odisha"
    ],
    "explanation": "Panna district in Madhya Pradesh is the principal modern diamond-mining location highlighted by IBM. It is the core of the central Indian diamond tract.",
    "sourceFactId": "DIAMOND-PANNA-STATE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-DIAMOND",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which mineral is most strongly linked with Panna in Indian geography?",
    "answer": "Diamond",
    "distractors": [
      "Mica",
      "Iron ore",
      "Gypsum"
    ],
    "explanation": "Panna is the classic diamond location of Madhya Pradesh and one of India's most familiar mineral-location pairs. It should not be confused with metallic or non-metallic industrial minerals.",
    "sourceFactId": "DIAMOND-PANNA-RESOURCE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-DIAMOND",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Consider the statements: I. Diamond is composed of carbon. II. Panna lies in the central Indian diamond tract. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Diamond is crystalline carbon, and IBM groups Panna within the central Indian diamond tract of Madhya Pradesh. Both the mineral property and location statement are correct.",
    "sourceFactId": "DIAMOND-STATEMENT",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-DIAMOND",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which pair is correctly matched in Diamond, Panna and Indian diamond tracts?",
    "answer": "Panna — diamond",
    "distractors": [
      "Panna — petroleum",
      "Panna — mica",
      "Panna — chromite"
    ],
    "explanation": "Panna in Madhya Pradesh is synonymous with diamond mining in India. Petroleum, mica and chromite belong to different resource regions and geological settings.",
    "sourceFactId": "DIAMOND-MATCH",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-DIAMOND",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Diamond deposits may occur in primary igneous rocks and also in which secondary setting?",
    "answer": "Alluvial deposits derived from primary sources",
    "distractors": [
      "Coal seams only",
      "Evaporite beds only",
      "Limestone caves only"
    ],
    "explanation": "IBM notes that diamonds occur both in primary igneous settings and in alluvial deposits formed after weathering and transport from primary sources. This explains placer-type diamond occurrences.",
    "sourceFactId": "DIAMOND-OCCURRENCE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-DIAMOND",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "A question gives the clues 'Madhya Pradesh, central Indian tract, Panna'. Which mineral should be selected?",
    "answer": "Diamond",
    "distractors": [
      "Gold",
      "Copper",
      "Manganese"
    ],
    "explanation": "The combination of Madhya Pradesh and Panna is one of the strongest diamond clues in Indian mineral geography. Gold, copper and manganese have other principal location patterns.",
    "sourceFactId": "DIAMOND-PANNA-CLUE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-DIAMOND",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  }
] as const),

buildGeoMinQl("TIN-CASSITERITE-CHHATTISGARH-DANTEWADA", "Tin, cassiterite and Chhattisgarh", [
  {
    "stem": "Which mineral is the most important ore of tin?",
    "answer": "Cassiterite",
    "distractors": [
      "Chromite",
      "Bauxite",
      "Magnesite"
    ],
    "explanation": "Cassiterite, chemically tin oxide, is the principal ore of tin. It is much more important economically than the less common tin mineral stannite.",
    "sourceFactId": "TIN-CASSITERITE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-TIN",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "The Govindpal–Tongpal tin-bearing area is located in which state?",
    "answer": "Chhattisgarh",
    "distractors": [
      "Rajasthan",
      "Karnataka",
      "Odisha"
    ],
    "explanation": "IBM records tin mineralisation and cassiterite mining in the Govindpal–Tongpal area of Dantewada district, Chhattisgarh. The location is a distinctive tin-geography fact.",
    "sourceFactId": "TIN-GOVINDPAL-TONGPAL",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-TIN",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Consider the statements: I. Cassiterite is a tin ore. II. Dantewada is linked with tin mineralisation. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Cassiterite is the principal tin mineral, and IBM records cassiterite-bearing stream sediments in Dantewada district of Chhattisgarh. Both statements are correct.",
    "sourceFactId": "TIN-STATEMENT",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-TIN",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which pair is correctly matched in Tin, cassiterite and Chhattisgarh?",
    "answer": "Dantewada — tin ore",
    "distractors": [
      "Dantewada — mica",
      "Panna — tin ore",
      "Koderma — cassiterite"
    ],
    "explanation": "Dantewada in Chhattisgarh is an important Indian tin-ore region. Panna is known for diamond and Koderma for mica, so those alternatives mix unrelated mineral locations.",
    "sourceFactId": "TIN-MATCH",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-TIN",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Cassiterite in parts of Dantewada is recovered from which type of material?",
    "answer": "Stream sediments",
    "distractors": [
      "Coal seams",
      "Marine salt pans",
      "Residual bauxite caps"
    ],
    "explanation": "IBM describes cassiterite being recovered from stream sediments in the Govindpal–Tongpal area. Panning separates the heavier cassiterite from lighter material, giving the occurrence a placer-like character.",
    "sourceFactId": "TIN-STREAM-SEDIMENT",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-TIN",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which chain is correct for Tin, cassiterite and Chhattisgarh?",
    "answer": "Dantewada → cassiterite → tin",
    "distractors": [
      "Sukinda → cassiterite → chromium",
      "Koderma → tin → mica",
      "Panna → cassiterite → diamond"
    ],
    "explanation": "Dantewada is linked with cassiterite, and cassiterite is the principal tin ore. The other chains combine unrelated mineral locations and commodities.",
    "sourceFactId": "TIN-CHAIN",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-TIN",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  }
] as const)
]);

export const GEO_MIN_001_CP004_REVIEW_BATCH_V1 = finalizeGeoMinCp(4, QLS);
export function auditGeoMin001Cp004ReviewBatchV1() { return auditGeoMinCp(4, QLS, GEO_MIN_001_CP004_REVIEW_BATCH_V1); }
