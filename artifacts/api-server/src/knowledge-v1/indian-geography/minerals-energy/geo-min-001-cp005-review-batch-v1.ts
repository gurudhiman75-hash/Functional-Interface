import { buildGeoMinQl, finalizeGeoMinCp, auditGeoMinCp } from "./geo-min-001-review-builder";

const QL_037 = buildGeoMinQl("MICA-PROPERTIES-AND-ELECTRICAL-USE", "Mica properties and electrical use", [
  {
    "stem": "Which non-metallic mineral can be split into very thin sheets and is a good electrical insulator?",
    "answer": "Mica",
    "distractors": [
      "Limestone",
      "Gypsum",
      "Bauxite"
    ],
    "explanation": "Mica has a layered crystal structure that allows it to split into thin elastic sheets. Its insulating and heat-resistant properties make it useful in electrical and electronic equipment.",
    "sourceFactId": "MICA-PROPERTIES"
  },
  {
    "stem": "Which mineral is especially suitable for insulation in electrical equipment because it resists high voltage and heat?",
    "answer": "Mica",
    "distractors": [
      "Copper ore",
      "Hematite",
      "Manganese"
    ],
    "explanation": "Mica is non-metallic but has excellent dielectric strength and heat resistance. These properties explain its long-standing use as an insulating material in electrical equipment.",
    "sourceFactId": "MICA-INSULATION"
  },
  {
    "stem": "Consider the statements: I. Mica can be split into thin sheets. II. Mica is a metallic ore of iron. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Mica's perfect cleavage allows it to split into thin sheets, but it is a non-metallic mineral. It is therefore not an iron ore or part of the ferrous mineral group.",
    "sourceFactId": "MICA-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Mica — electrical insulation",
    "distractors": [
      "Mica — principal aluminium ore",
      "Mica — ferro-alloy mineral",
      "Mica — liquid fuel"
    ],
    "explanation": "Mica's insulating ability is one of its most important industrial properties. Aluminium comes from bauxite, while ferro-alloys and fuels belong to different mineral groups.",
    "sourceFactId": "MICA-MATCH"
  },
  {
    "stem": "A mineral sample is flexible in thin sheets and does not conduct electricity well. Which mineral is the best match?",
    "answer": "Mica",
    "distractors": [
      "Copper",
      "Magnetite",
      "Chromite"
    ],
    "explanation": "Thin, flexible sheets and strong electrical insulation are classic mica properties. Copper is a conductor, while magnetite and chromite are metallic mineral ores.",
    "sourceFactId": "MICA-CLUE"
  },
  {
    "stem": "Why can a non-metallic mineral like mica be strategically useful to the electrical industry?",
    "answer": "Its insulating properties complement conductive metals in electrical systems",
    "distractors": [
      "It replaces all copper conductors",
      "It is the principal fuel for power stations",
      "It supplies iron for transformer cores"
    ],
    "explanation": "Electrical systems need both conductors and insulating materials. Mica does not carry current like copper, but it safely separates and protects electrical components.",
    "sourceFactId": "MICA-REASONING"
  }
] as const);

const QL_038 = buildGeoMinQl("KODERMA-GAYA-HAZARIBAGH-MICA-BELT", "Koderma-Gaya-Hazaribagh mica belt", [
  {
    "stem": "The Koderma–Gaya–Hazaribagh belt is famous for which mineral?",
    "answer": "Mica",
    "distractors": [
      "Iron ore",
      "Petroleum",
      "Bauxite"
    ],
    "explanation": "The Koderma–Gaya–Hazaribagh belt of the Jharkhand–Bihar region is a classic mica-producing area. It is one of the best-known mica belts in Indian geography.",
    "sourceFactId": "MICA-KODERMA"
  },
  {
    "stem": "Koderma, historically known for mica mining, is located in which state?",
    "answer": "Jharkhand",
    "distractors": [
      "Rajasthan",
      "Goa",
      "Kerala"
    ],
    "explanation": "Koderma lies in Jharkhand and forms part of the important Koderma–Gaya–Hazaribagh mica belt. Its mineral identity is frequently tested in location-based questions.",
    "sourceFactId": "KODERMA-STATE"
  },
  {
    "stem": "Consider the statements: I. Koderma is linked with mica. II. Hazaribagh lies within the same broad mica region. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Koderma and Hazaribagh are both part of the eastern Indian mica belt, with Gaya forming another well-known location in the same broad region.",
    "sourceFactId": "MICA-EASTERN-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Koderma — mica",
    "distractors": [
      "Koderma — offshore petroleum",
      "Hazaribagh — bauxite only",
      "Gaya — chromite valley"
    ],
    "explanation": "Koderma is synonymous with the mica belt of Jharkhand and adjoining Bihar. The alternative pairings attach unrelated mineral resources to the same region.",
    "sourceFactId": "KODERMA-MATCH"
  },
  {
    "stem": "A mineral map marks Koderma, Gaya and Hazaribagh. Which resource should be identified?",
    "answer": "Mica",
    "distractors": [
      "Coal only",
      "Copper only",
      "Natural gas"
    ],
    "explanation": "The three locations form one of India's classic mica belts. Their appearance together on a map is a strong clue to mica rather than fuel or metallic ore resources.",
    "sourceFactId": "MICA-EAST-MAP"
  },
  {
    "stem": "Which comparison is correct?",
    "answer": "Koderma is a mica centre, while Khetri is a copper centre",
    "distractors": [
      "Both are petroleum fields",
      "Koderma is copper and Khetri is mica",
      "Both are iron-ore belts"
    ],
    "explanation": "Koderma in Jharkhand is famous for mica, whereas Khetri in Rajasthan is known for copper. The comparison separates a non-metallic mineral belt from a non-ferrous metallic one.",
    "sourceFactId": "KODERMA-KHETRI-COMPARE"
  }
] as const);

const QL_039 = buildGeoMinQl("RAJASTHAN-MICA-BELT", "Rajasthan mica belt", [
  {
    "stem": "Which state contains an important mica belt around Ajmer and nearby areas?",
    "answer": "Rajasthan",
    "distractors": [
      "Punjab",
      "Assam",
      "Odisha"
    ],
    "explanation": "Rajasthan has an important mica belt extending through parts of the Aravalli region, including areas around Ajmer. It complements the better-known eastern and Andhra mica belts.",
    "sourceFactId": "MICA-RAJASTHAN"
  },
  {
    "stem": "Ajmer is linked in mineral geography with which non-metallic mineral?",
    "answer": "Mica",
    "distractors": [
      "Coal",
      "Petroleum",
      "Chromite"
    ],
    "explanation": "Ajmer and adjoining parts of Rajasthan form an important mica-producing region. Mica's sheet structure and insulating properties give it significant industrial value.",
    "sourceFactId": "AJMER-MICA"
  },
  {
    "stem": "Consider the statements: I. Rajasthan has important mica deposits. II. Khetri copper and Rajasthan mica belong to different mineral categories. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Rajasthan contains both mica and copper resources, but mica is non-metallic while copper is non-ferrous metallic. The state therefore illustrates mineral diversity.",
    "sourceFactId": "RAJASTHAN-MICA-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Ajmer region — mica",
    "distractors": [
      "Ajmer region — offshore petroleum",
      "Khetri — mica only",
      "Zawar — mica only"
    ],
    "explanation": "The Ajmer region is associated with mica in Rajasthan. Khetri and Zawar are better known respectively for copper and lead-zinc.",
    "sourceFactId": "AJMER-MATCH"
  },
  {
    "stem": "A map marks a mica belt in western India near the Aravalli region. Which state is indicated?",
    "answer": "Rajasthan",
    "distractors": [
      "Jharkhand",
      "Andhra Pradesh",
      "Chhattisgarh"
    ],
    "explanation": "Rajasthan's mica deposits occur within the western Indian Aravalli region. This location distinguishes the belt from Koderma in the east and Nellore in the southeast.",
    "sourceFactId": "MICA-RAJASTHAN-MAP"
  },
  {
    "stem": "Which sequence correctly identifies three mica regions from east to west/south-west?",
    "answer": "Koderma belt — Nellore belt — Rajasthan belt",
    "distractors": [
      "Jharia — Mumbai High — Bailadila",
      "Khetri — Sukinda — Digboi",
      "Bailadila — Koderma — Jharia"
    ],
    "explanation": "Koderma represents the eastern mica belt, Nellore the southeastern belt and Rajasthan the western belt. The sequence brings together India's three classic mica-region associations.",
    "sourceFactId": "MICA-BELTS-SEQUENCE"
  }
] as const);

const QL_040 = buildGeoMinQl("NELLORE-MICA-BELT", "Nellore mica belt", [
  {
    "stem": "The Nellore mica belt is located in which state?",
    "answer": "Andhra Pradesh",
    "distractors": [
      "Punjab",
      "Rajasthan",
      "Assam"
    ],
    "explanation": "Nellore in Andhra Pradesh is one of India's classic mica-producing regions. It forms the important southeastern mica belt.",
    "sourceFactId": "NELLORE-STATE"
  },
  {
    "stem": "Which mineral is historically linked with Nellore district?",
    "answer": "Mica",
    "distractors": [
      "Iron ore",
      "Petroleum",
      "Lignite only"
    ],
    "explanation": "Nellore has long been known for mica deposits and forms a standard location-resource pair in Indian geography. The belt is distinct from Koderma and Rajasthan mica regions.",
    "sourceFactId": "NELLORE-MICA"
  },
  {
    "stem": "Consider the statements: I. Nellore is in Andhra Pradesh. II. It is an important mica region. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Nellore lies in Andhra Pradesh and is widely recognised as a mica-producing belt. Both the location and resource association are correct.",
    "sourceFactId": "NELLORE-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Nellore — mica",
    "distractors": [
      "Nellore — chromite",
      "Nellore — offshore oilfield",
      "Nellore — iron-ore belt"
    ],
    "explanation": "Nellore is a classic mica location in Andhra Pradesh. Chromite, offshore petroleum and iron ore have different principal regions.",
    "sourceFactId": "NELLORE-MATCH"
  },
  {
    "stem": "A map marks a mica belt on the southeastern side of peninsular India. Which location is most likely shown?",
    "answer": "Nellore",
    "distractors": [
      "Koderma",
      "Khetri",
      "Bailadila"
    ],
    "explanation": "Nellore is the prominent southeastern mica belt, whereas Koderma is eastern-central, Khetri is a copper belt and Bailadila is an iron-ore region.",
    "sourceFactId": "NELLORE-MAP"
  },
  {
    "stem": "Which comparison is correct among India's mica belts?",
    "answer": "Koderma is in Jharkhand, Nellore in Andhra Pradesh and an important western belt lies in Rajasthan",
    "distractors": [
      "All three are in one state",
      "Nellore is in Rajasthan and Koderma in Andhra Pradesh",
      "Koderma and Nellore are coalfields"
    ],
    "explanation": "India's classic mica geography spans several regions: Koderma in Jharkhand, Nellore in Andhra Pradesh and parts of Rajasthan in the west. The distribution is therefore not confined to one state.",
    "sourceFactId": "MICA-BELT-COMPARE"
  }
] as const);

const QL_041 = buildGeoMinQl("LIMESTONE-AND-CEMENT", "Limestone and cement", [
  {
    "stem": "Which non-metallic mineral is a basic raw material for the cement industry?",
    "answer": "Limestone",
    "distractors": [
      "Mica",
      "Copper ore",
      "Chromite"
    ],
    "explanation": "Limestone provides calcium carbonate and is a fundamental raw material in cement manufacture. It is therefore one of India's most important industrial non-metallic minerals.",
    "sourceFactId": "LIMESTONE-CEMENT"
  },
  {
    "stem": "A cement plant would seek reliable nearby supplies of which mineral?",
    "answer": "Limestone",
    "distractors": [
      "Bauxite only",
      "Mica only",
      "Manganese only"
    ],
    "explanation": "Cement manufacturing consumes large quantities of limestone, so proximity to deposits can reduce bulk transport costs. Other minerals have different primary uses.",
    "sourceFactId": "LIMESTONE-PLANT"
  },
  {
    "stem": "Consider the statements: I. Limestone is non-metallic. II. It is important in cement manufacture. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Limestone is a non-metallic mineral and a major cement raw material. Both statements correctly describe its classification and industrial importance.",
    "sourceFactId": "LIMESTONE-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Limestone — cement raw material",
    "distractors": [
      "Limestone — principal aluminium ore",
      "Limestone — chromium ore",
      "Limestone — electrical conductor"
    ],
    "explanation": "Limestone is widely used to make cement. Bauxite supplies aluminium, chromite supplies chromium, and copper rather than limestone is an important electrical conductor.",
    "sourceFactId": "LIMESTONE-MATCH"
  },
  {
    "stem": "Why are many cement plants located close to limestone deposits?",
    "answer": "Limestone is bulky and required in large quantities",
    "distractors": [
      "Limestone is a liquid fuel",
      "It must be transported only by air",
      "Cement contains no mineral raw material"
    ],
    "explanation": "Cement plants use large quantities of limestone, making raw-material transport an important location factor. Nearby deposits can lower freight costs and ensure steady supply.",
    "sourceFactId": "LIMESTONE-LOCATION"
  },
  {
    "stem": "A district has abundant limestone, gypsum and good transport links. Which industry would this mineral combination favour?",
    "answer": "Cement manufacture",
    "distractors": [
      "Aluminium smelting",
      "Copper wiring",
      "Petroleum refining"
    ],
    "explanation": "Limestone is the main cement raw material and gypsum is commonly added during cement production to regulate setting. Together they provide a strong mineral base for cement manufacturing.",
    "sourceFactId": "LIMESTONE-GYPSUM-REASONING"
  }
] as const);

const QL_042 = buildGeoMinQl("LIMESTONE-IN-METALLURGY-AND-INDUSTRIAL-USE", "Limestone in metallurgy and industrial use", [
  {
    "stem": "Besides cement manufacture, limestone is used in which major metallurgical activity?",
    "answer": "Iron and steel smelting as a flux",
    "distractors": [
      "As the principal source of copper",
      "As an electrical insulator replacing mica",
      "As a liquid fuel"
    ],
    "explanation": "Limestone acts as a flux in iron and steel smelting, helping combine with impurities so they can be removed as slag. This gives it importance beyond cement.",
    "sourceFactId": "LIMESTONE-FLUX"
  },
  {
    "stem": "What is the purpose of limestone when used as a flux in a blast furnace?",
    "answer": "To help remove impurities by forming slag",
    "distractors": [
      "To supply chromium to steel",
      "To replace iron ore",
      "To act as the main fuel"
    ],
    "explanation": "Fluxing limestone reacts with unwanted mineral impurities and helps form slag that can be separated from molten metal. It does not supply the main iron or fuel input.",
    "sourceFactId": "LIMESTONE-SLAG"
  },
  {
    "stem": "Consider the statements: I. Limestone has a role in cement. II. Limestone can also act as a flux in metallurgy. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Limestone is important in both cement manufacture and metallurgical processes. Its chemical composition makes it useful for cement and for removing impurities during smelting.",
    "sourceFactId": "LIMESTONE-DUAL-USE"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Limestone — flux in iron smelting",
    "distractors": [
      "Mica — flux in blast furnace",
      "Bauxite — cement-setting regulator",
      "Copper — non-metallic flux"
    ],
    "explanation": "Limestone is used as a flux in iron smelting because it helps remove impurities. Mica, bauxite and copper serve unrelated industrial functions.",
    "sourceFactId": "LIMESTONE-FLUX-MATCH"
  },
  {
    "stem": "A mineral is needed by both a cement plant and an integrated steel plant, though for different reasons. Which mineral is it?",
    "answer": "Limestone",
    "distractors": [
      "Mica",
      "Bauxite",
      "Copper"
    ],
    "explanation": "A cement plant uses limestone as a core raw material, while a steel plant can use it as a flux. The shared demand arises from two different industrial processes.",
    "sourceFactId": "LIMESTONE-CROSSINDUSTRY"
  },
  {
    "stem": "Why can limestone deposits support more than one heavy industry in the same region?",
    "answer": "The mineral serves as cement feedstock and as a metallurgical flux",
    "distractors": [
      "It is simultaneously an iron ore and a fuel",
      "It replaces copper in all electrical uses",
      "It is the principal aluminium ore"
    ],
    "explanation": "Limestone has multiple bulk industrial uses, especially in cement and metallurgy. A large deposit can therefore support several mineral-based industries rather than only one.",
    "sourceFactId": "LIMESTONE-REASONING"
  }
] as const);

const QL_043 = buildGeoMinQl("GYPSUM-USES-AND-INDUSTRIAL-ROLE", "Gypsum uses and industrial role", [
  {
    "stem": "Which non-metallic mineral is widely used in plaster and also added to cement?",
    "answer": "Gypsum",
    "distractors": [
      "Chromite",
      "Hematite",
      "Copper"
    ],
    "explanation": "Gypsum is used to make plaster products and is also added in cement manufacture to control setting. It is an important non-metallic industrial mineral.",
    "sourceFactId": "GYPSUM-USES"
  },
  {
    "stem": "Which mineral is the raw material for plaster of Paris?",
    "answer": "Gypsum",
    "distractors": [
      "Bauxite",
      "Manganese",
      "Magnetite"
    ],
    "explanation": "Plaster of Paris is produced by controlled heating of gypsum. The mineral is therefore closely linked with building materials and plaster products.",
    "sourceFactId": "GYPSUM-POP"
  },
  {
    "stem": "Consider the statements: I. Gypsum is non-metallic. II. It is used in cement and plaster products. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Gypsum belongs to the non-metallic mineral group and has important uses in construction materials. Its roles include plaster manufacture and regulating cement setting.",
    "sourceFactId": "GYPSUM-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Gypsum — plaster of Paris",
    "distractors": [
      "Gypsum — chromium ore",
      "Gypsum — iron ore",
      "Gypsum — electrical conductor"
    ],
    "explanation": "Gypsum is the mineral source used to make plaster of Paris. Chromium and iron come from metallic ores, while good electrical conductors are metals such as copper.",
    "sourceFactId": "GYPSUM-MATCH"
  },
  {
    "stem": "A cement manufacturer adds a small quantity of which mineral to regulate the setting behaviour of cement?",
    "answer": "Gypsum",
    "distractors": [
      "Magnetite",
      "Bauxite",
      "Manganese"
    ],
    "explanation": "Gypsum is commonly added during cement manufacture to control the rate at which cement sets. This role differs from limestone, which forms the main mineral feedstock.",
    "sourceFactId": "GYPSUM-CEMENT"
  },
  {
    "stem": "Which comparison is correct?",
    "answer": "Limestone is a major cement raw material, while gypsum helps regulate cement setting",
    "distractors": [
      "Gypsum supplies iron and limestone supplies copper",
      "Both are metallic ores",
      "Limestone is used only for plaster and gypsum only for steel"
    ],
    "explanation": "Limestone contributes the major calcium-bearing feedstock to cement, while gypsum is added in smaller amounts to control setting. Both are non-metallic but perform different roles.",
    "sourceFactId": "GYPSUM-LIMESTONE-COMPARE"
  }
] as const);

const QL_044 = buildGeoMinQl("GYPSUM-GEOGRAPHY-AND-RAJASTHAN", "Gypsum geography and Rajasthan", [
  {
    "stem": "Which state is especially well known for large gypsum deposits in India?",
    "answer": "Rajasthan",
    "distractors": [
      "Kerala",
      "Punjab",
      "Jharkhand"
    ],
    "explanation": "Rajasthan's arid and semi-arid sedimentary regions contain important gypsum deposits. The state is therefore a standard gypsum-location association in Indian geography.",
    "sourceFactId": "GYPSUM-RAJASTHAN"
  },
  {
    "stem": "A mineral map highlights gypsum deposits across western Rajasthan. Which broad environment helps explain this occurrence?",
    "answer": "Arid sedimentary and evaporative conditions",
    "distractors": [
      "Humid tropical rainforest only",
      "Deep offshore volcanic trenches",
      "Glacial valley placers only"
    ],
    "explanation": "Gypsum can form in sedimentary and evaporative settings where dissolved salts precipitate as water evaporates. Rajasthan's dry climate and sedimentary basins fit this occurrence.",
    "sourceFactId": "GYPSUM-ENVIRONMENT"
  },
  {
    "stem": "Consider the statements: I. Rajasthan has important gypsum deposits. II. Gypsum is a metallic ferrous mineral. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Rajasthan is an important gypsum state, but gypsum is a non-metallic mineral. The second statement therefore assigns it to the wrong mineral category.",
    "sourceFactId": "GYPSUM-RAJASTHAN-STATEMENT"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Rajasthan — gypsum",
    "distractors": [
      "Odisha — gypsum as its only mineral",
      "Goa — principal gypsum belt",
      "Jharkhand — offshore gypsum field"
    ],
    "explanation": "Rajasthan is particularly important for gypsum deposits. The other options either misuse resource exclusivity or attach gypsum to unrelated settings.",
    "sourceFactId": "GYPSUM-RAJASTHAN-MATCH"
  },
  {
    "stem": "Which resource-location combination would support plaster and cement-related industries in western India?",
    "answer": "Gypsum deposits of Rajasthan",
    "distractors": [
      "Offshore petroleum of Mumbai High",
      "Iron ore of Bailadila",
      "Chromite of Sukinda"
    ],
    "explanation": "Gypsum is used in plaster and cement, and Rajasthan contains major deposits. The other resources support energy, steel or alloy industries instead.",
    "sourceFactId": "GYPSUM-LOCATION-USE"
  },
  {
    "stem": "Why is Rajasthan a logical answer when a question combines arid-region mineral deposition with plaster raw material?",
    "answer": "Its sedimentary basins contain important gypsum deposits",
    "distractors": [
      "It is India's principal offshore mica field",
      "It contains no non-metallic minerals",
      "Its gypsum forms only in igneous lodes"
    ],
    "explanation": "Gypsum can develop in evaporative sedimentary environments, and Rajasthan has important deposits in such settings. Its use in plaster completes the location-process-use chain.",
    "sourceFactId": "GYPSUM-REASONING"
  }
] as const);

const QL_045 = buildGeoMinQl("INTEGRATED-NON-METALLIC-MINERAL-REASONING", "Integrated non-metallic mineral reasoning", [
  {
    "stem": "Which set consists only of non-metallic industrial minerals?",
    "answer": "Mica, limestone and gypsum",
    "distractors": [
      "Iron ore, manganese and chromite",
      "Bauxite, copper and zinc",
      "Coal, petroleum and natural gas"
    ],
    "explanation": "Mica, limestone and gypsum are non-metallic minerals with major industrial uses. The other groups represent metallic or energy resources.",
    "sourceFactId": "NONMETALLIC-INTEGRATED-1"
  },
  {
    "stem": "Which location-resource pair is incorrect?",
    "answer": "Khetri — mica",
    "distractors": [
      "Koderma — mica",
      "Nellore — mica",
      "Rajasthan — gypsum"
    ],
    "explanation": "Khetri is a copper belt in Rajasthan, not a mica location. Koderma and Nellore are classic mica belts, while Rajasthan is important for gypsum.",
    "sourceFactId": "NONMETALLIC-INTEGRATED-2"
  },
  {
    "stem": "Consider the statements: I. Mica is an electrical insulator. II. Limestone is important in cement. III. Gypsum is used in plaster. Which is correct?",
    "answer": "I, II and III",
    "distractors": [
      "I and II only",
      "II and III only",
      "I and III only"
    ],
    "explanation": "All three statements correctly link a non-metallic mineral with a major industrial property or use. Together they cover the core exam distinctions among mica, limestone and gypsum.",
    "sourceFactId": "NONMETALLIC-INTEGRATED-3"
  },
  {
    "stem": "Which chain is correct?",
    "answer": "Koderma → mica → electrical insulation",
    "distractors": [
      "Nellore → iron ore → steel",
      "Rajasthan gypsum → copper wiring",
      "Limestone → aluminium → aircraft"
    ],
    "explanation": "Koderma is a mica centre and mica is valued for electrical insulation. The other chains combine locations, minerals and uses incorrectly.",
    "sourceFactId": "NONMETALLIC-INTEGRATED-4"
  },
  {
    "stem": "A district has limestone and gypsum but no metallic ore. Which industry could still have a strong mineral-resource base there?",
    "answer": "Cement industry",
    "distractors": [
      "Primary aluminium smelting without imported ore",
      "Copper mining",
      "Iron-ore beneficiation"
    ],
    "explanation": "Limestone is the principal cement raw material and gypsum is used to control setting. Their combination can support cement manufacture even without local metallic ores.",
    "sourceFactId": "NONMETALLIC-INTEGRATED-5"
  },
  {
    "stem": "Which comparison correctly separates three non-metallic minerals?",
    "answer": "Mica insulates, limestone feeds cement and metallurgy, gypsum serves plaster and cement setting",
    "distractors": [
      "Mica supplies iron, limestone supplies copper, gypsum supplies aluminium",
      "All three are fuel minerals",
      "All three are ferro-alloy ores"
    ],
    "explanation": "Mica, limestone and gypsum are all non-metallic, but their uses differ sharply. Understanding those functional differences is more useful than memorising the classification alone.",
    "sourceFactId": "NONMETALLIC-INTEGRATED-6"
  }
] as const);

export const GEO_MIN_001_CP005_REVIEW_BATCH_V1 = finalizeGeoMinCp(5, [QL_037, QL_038, QL_039, QL_040, QL_041, QL_042, QL_043, QL_044, QL_045]);
export function auditGeoMin001Cp005ReviewBatchV1() { return auditGeoMinCp(5, [QL_037, QL_038, QL_039, QL_040, QL_041, QL_042, QL_043, QL_044, QL_045], GEO_MIN_001_CP005_REVIEW_BATCH_V1); }
