import { buildGeoMinQl, finalizeGeoMinCp, auditGeoMinCp } from "./geo-min-001-review-builder";

const QLS = Object.freeze([
buildGeoMinQl("MICA-PROPERTIES-AND-ELECTRICAL-USE", "Mica properties and electrical use", [
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
] as const),

buildGeoMinQl("KODERMA-GAYA-HAZARIBAGH-MICA-BELT", "Koderma-Gaya-Hazaribagh mica belt", [
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
] as const),

buildGeoMinQl("RAJASTHAN-MICA-BELT", "Rajasthan mica belt", [
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
] as const),

buildGeoMinQl("NELLORE-MICA-BELT", "Nellore mica belt", [
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
] as const),

buildGeoMinQl("LIMESTONE-AND-CEMENT", "Limestone and cement", [
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
] as const),

buildGeoMinQl("LIMESTONE-IN-METALLURGY-AND-INDUSTRIAL-USE", "Limestone in metallurgy and industrial use", [
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
] as const),

buildGeoMinQl("GYPSUM-USES-AND-INDUSTRIAL-ROLE", "Gypsum uses and industrial role", [
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
] as const),

buildGeoMinQl("GYPSUM-GEOGRAPHY-AND-RAJASTHAN", "Gypsum geography and Rajasthan", [
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
] as const),

buildGeoMinQl("INTEGRATED-NON-METALLIC-MINERAL-REASONING", "Integrated non-metallic mineral reasoning", [
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
] as const),

buildGeoMinQl("GRAPHITE-PROPERTIES-USES-AND-INDIAN-BELTS", "Graphite properties, uses and Indian belts", [
  {
    "stem": "Which mineral is a naturally occurring form of carbon with a layered structure?",
    "answer": "Graphite",
    "distractors": [
      "Gypsum",
      "Dolomite",
      "Bauxite"
    ],
    "explanation": "Graphite is a naturally occurring form of carbon and has a layered structure. Its layers help explain properties such as softness, lubrication and use in several industrial applications.",
    "sourceFactId": "GRAPHITE-CARBON",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-GRAPHITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which mineral is used in crucibles, refractories, pencils and battery applications?",
    "answer": "Graphite",
    "distractors": [
      "Limestone",
      "Mica",
      "Gypsum"
    ],
    "explanation": "IBM lists graphite uses across crucibles, refractories, pencils, lubricants and batteries. The combination of thermal stability, conductivity and layered structure gives it this wide industrial range.",
    "sourceFactId": "GRAPHITE-USES",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-GRAPHITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Consider the statements: I. Graphite occurs in flaky and amorphous varieties. II. Graphite is a metallic iron ore. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Natural graphite is commercially recognised in crystalline flaky and amorphous forms. It is a non-metallic carbon mineral, not an iron ore or ferrous metallic mineral.",
    "sourceFactId": "GRAPHITE-VARIETIES",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-GRAPHITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Palamu — graphite",
    "distractors": [
      "Palamu — petroleum",
      "Balangir — iron ore only",
      "Sivagangai — chromite"
    ],
    "explanation": "IBM records graphite mining centres in Palamu district of Jharkhand, Balangir in Odisha and Sivagangai in Tamil Nadu. Palamu is therefore a durable graphite-location association.",
    "sourceFactId": "GRAPHITE-PALAMU",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-GRAPHITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "A mineral map marks Palamu in Jharkhand, Balangir in Odisha and Sivagangai in Tamil Nadu. Which mineral links these locations?",
    "answer": "Graphite",
    "distractors": [
      "Mica",
      "Copper",
      "Rock salt"
    ],
    "explanation": "These three locations are established graphite areas recorded in IBM mineral reviews. Their spread across eastern and southern India makes them useful for map-based identification.",
    "sourceFactId": "GRAPHITE-MAP",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-GRAPHITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Why is graphite useful in lithium-ion battery anodes?",
    "answer": "Its layered structure can host lithium ions while conducting electrical charge",
    "distractors": [
      "It is a liquid electrolyte",
      "It supplies aluminium metal",
      "It acts only as a cement flux"
    ],
    "explanation": "Graphite's layered atomic structure can accommodate lithium ions and it also conducts electricity. This combination explains its important role as an anode material in lithium-ion batteries.",
    "sourceFactId": "GRAPHITE-BATTERY",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-GRAPHITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  }
] as const),

buildGeoMinQl("MAGNESITE-SALEM-REFRACTORY-GEOGRAPHY", "Magnesite, Salem and refractory use", [
  {
    "stem": "Magnesite is chemically a carbonate of which element?",
    "answer": "Magnesium",
    "distractors": [
      "Iron",
      "Aluminium",
      "Copper"
    ],
    "explanation": "Magnesite is magnesium carbonate, written chemically as MgCO3. This composition distinguishes it from limestone and dolomite and underlies its importance in refractory materials.",
    "sourceFactId": "MAGNESITE-CHEMISTRY",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-MAGNESITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which industry uses magnesite extensively for basic refractory materials?",
    "answer": "Iron and steel industry",
    "distractors": [
      "Jute industry",
      "Tea industry",
      "Cotton spinning only"
    ],
    "explanation": "Calcined magnesite is an important basic refractory material capable of withstanding high temperatures. It is therefore used widely in furnace linings and other applications in the steel industry.",
    "sourceFactId": "MAGNESITE-REFRACTORY",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-MAGNESITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Salem is an important magnesite centre in which state?",
    "answer": "Tamil Nadu",
    "distractors": [
      "Odisha",
      "Rajasthan",
      "Jharkhand"
    ],
    "explanation": "The Salem area of Tamil Nadu is one of India's best-known magnesite regions. IBM describes magnesite there as occurring in veins and stringers within ultrabasic rocks.",
    "sourceFactId": "MAGNESITE-SALEM",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-MAGNESITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Consider the statements: I. Magnesite occurs around Salem in Tamil Nadu. II. It is important for refractory manufacture. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Salem is a major magnesite area and calcined magnesite is widely used for refractory products. Both the location and industrial-use statements are therefore correct.",
    "sourceFactId": "MAGNESITE-STATEMENT",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-MAGNESITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Bageshwar — magnesite",
    "distractors": [
      "Bageshwar — chromite",
      "Salem — rock phosphate",
      "Pithoragarh — petroleum"
    ],
    "explanation": "IBM records important magnesite occurrences and workings in Uttarakhand, including Bageshwar and Pithoragarh, as well as the major Salem region in Tamil Nadu.",
    "sourceFactId": "MAGNESITE-BAGESHWAR",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-MAGNESITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "A mineral occurs as veins in ultrabasic rocks near Salem and is used after calcination in furnace linings. Which mineral is it?",
    "answer": "Magnesite",
    "distractors": [
      "Graphite",
      "Gypsum",
      "Mica"
    ],
    "explanation": "The combination of Salem, veins in ultrabasic rocks and refractory use points directly to magnesite. These geological and industrial clues make a stronger identification than location alone.",
    "sourceFactId": "MAGNESITE-INTEGRATED",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-MAGNESITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  }
] as const),

buildGeoMinQl("DOLOMITE-FLUX-REFRACTORY-INDUSTRIAL-USE", "Dolomite as flux and refractory mineral", [
  {
    "stem": "Which mineral is used as a flux in iron and steel manufacture and also in refractory applications?",
    "answer": "Dolomite",
    "distractors": [
      "Mica",
      "Graphite",
      "Rock salt"
    ],
    "explanation": "Dolomite is used as a flux in iron and steel and ferro-alloy industries and, after suitable treatment, as a refractory material. Its industrial role overlaps partly with limestone but is not identical.",
    "sourceFactId": "DOLOMITE-USES",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-DOLOMITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "In which industry is flux-grade dolomite especially important?",
    "answer": "Iron and steel industry",
    "distractors": [
      "Tea processing",
      "Jute retting",
      "Paper made only from bamboo"
    ],
    "explanation": "Flux-grade dolomite is used in iron and steel making to assist metallurgical processing. IBM also records refractory and glass uses for suitable grades of dolomite.",
    "sourceFactId": "DOLOMITE-STEEL",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-DOLOMITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Consider the statements: I. Dolomite can be used as a metallurgical flux. II. High-purity dolomite can also be used in refractories. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Dolomite has important metallurgical and refractory uses. Flux-grade material serves iron and steel industries, while high-purity dead-burnt dolomite can be used in furnace linings.",
    "sourceFactId": "DOLOMITE-STATEMENT",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-DOLOMITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Dolomite — flux and refractory use",
    "distractors": [
      "Dolomite — principal copper ore",
      "Dolomite — petroleum source rock only",
      "Dolomite — electrical sheet insulator"
    ],
    "explanation": "Dolomite is an industrial non-metallic mineral used as flux and refractory material. Copper ores, petroleum source rocks and mica insulation belong to different resource chains.",
    "sourceFactId": "DOLOMITE-MATCH",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-DOLOMITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which states are among India's important dolomite-bearing regions?",
    "answer": "Chhattisgarh and Odisha",
    "distractors": [
      "Punjab and Haryana only",
      "Delhi and Chandigarh",
      "Goa and Lakshadweep only"
    ],
    "explanation": "IBM resource tables record substantial dolomite resources in states including Chhattisgarh and Odisha, along with Madhya Pradesh, Karnataka, Rajasthan and others. The fact is geographic rather than a production-rank claim.",
    "sourceFactId": "DOLOMITE-STATES",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-DOLOMITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "A steel plant seeks a non-metallic mineral that can serve both as flux and refractory feedstock. Which resource is the best fit?",
    "answer": "Dolomite",
    "distractors": [
      "Mica",
      "Salt",
      "Graphite only"
    ],
    "explanation": "Dolomite can support steel making in more than one way: as a flux in metallurgical processes and as a raw material for refractory products. That dual role makes it distinct among industrial minerals.",
    "sourceFactId": "DOLOMITE-REASONING",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-DOLOMITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  }
] as const),

buildGeoMinQl("ROCK-PHOSPHATE-JHAMARKOTRA-FERTILIZER", "Rock phosphate, Jhamarkotra and fertilizer use", [
  {
    "stem": "Rock phosphate is an important raw material for which industry?",
    "answer": "Phosphatic fertilizer industry",
    "distractors": [
      "Iron and steel industry",
      "Copper smelting only",
      "Jute textile industry"
    ],
    "explanation": "Rock phosphate is valued chiefly as a source of phosphorus for phosphatic fertilizers and phosphoric-acid products. Its industrial importance is therefore closely linked with agriculture and fertilizer manufacture.",
    "sourceFactId": "PHOSPHATE-FERTILIZER",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-APATITE-ROCK-PHOSPHATE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Jhamarkotra, an important rock-phosphate mine, is located in which state?",
    "answer": "Rajasthan",
    "distractors": [
      "Odisha",
      "Jharkhand",
      "Karnataka"
    ],
    "explanation": "Jhamarkotra is in Udaipur district of Rajasthan and is one of India's best-known rock-phosphate locations. IBM continues to record the mine and its beneficiation activity in official mineral reports.",
    "sourceFactId": "PHOSPHATE-JHAMARKOTRA-STATE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-APATITE-ROCK-PHOSPHATE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Consider the statements: I. Jhamarkotra is linked with rock phosphate. II. Rock phosphate is used in phosphatic fertilizer manufacture. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Jhamarkotra is a major Rajasthan rock-phosphate mine, and phosphate concentrates are used in fertilizer and phosphoric-acid production. Both statements correctly connect location and use.",
    "sourceFactId": "PHOSPHATE-STATEMENT",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-APATITE-ROCK-PHOSPHATE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Jhamarkotra — rock phosphate",
    "distractors": [
      "Jhamarkotra — petroleum",
      "Jhamarkotra — mica",
      "Jhamarkotra — chromite"
    ],
    "explanation": "Jhamarkotra is a standard rock-phosphate location in Rajasthan. Petroleum, mica and chromite belong to different mineral regions and geological settings.",
    "sourceFactId": "PHOSPHATE-MATCH",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-APATITE-ROCK-PHOSPHATE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "A mineral deposit in Udaipur district supplies phosphorus-bearing material for SSP and related fertilizer products. Which mineral is indicated?",
    "answer": "Rock phosphate",
    "distractors": [
      "Magnesite",
      "Graphite",
      "Gypsum"
    ],
    "explanation": "IBM records Jhamarkotra rock phosphate as a feedstock for phosphatic products including SSP-related uses. The location and fertilizer clue together point to rock phosphate.",
    "sourceFactId": "PHOSPHATE-CLUE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-APATITE-ROCK-PHOSPHATE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which chain is geographically and economically correct?",
    "answer": "Jhamarkotra → rock phosphate → phosphatic fertilizer",
    "distractors": [
      "Salem → rock phosphate → steel refractory",
      "Sukinda → rock phosphate → stainless steel",
      "Koderma → phosphate → electrical insulation"
    ],
    "explanation": "Jhamarkotra in Rajasthan is a rock-phosphate centre, and phosphate mineral is processed for fertilizer and phosphoric-acid uses. The other chains mix unrelated mineral locations and industries.",
    "sourceFactId": "PHOSPHATE-CHAIN",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-APATITE-ROCK-PHOSPHATE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  }
] as const),

buildGeoMinQl("SALT-SOURCES-SAMBHAR-AND-COASTAL-CENTRES", "Salt sources, Sambhar and coastal centres", [
  {
    "stem": "Which is a major inland salt-producing centre in Rajasthan?",
    "answer": "Sambhar Lake",
    "distractors": [
      "Noamundi",
      "Sukinda",
      "Khetri"
    ],
    "explanation": "The Salt Commissioner's official material lists Sambhar Lake among Rajasthan's inland salt works using lake brine. It is a classic inland-salt location in Indian geography.",
    "sourceFactId": "SALT-SAMBHAR",
    "sourceIds": [
      "SALT-COMMISSIONER-INDIA-SALT-INDUSTRY",
      "IBM-MINERAL-REVIEW-SALT"
    ]
  },
  {
    "stem": "Which source of salt is used at Sambhar Lake?",
    "answer": "Lake brine",
    "distractors": [
      "Offshore petroleum",
      "Iron-ore lode",
      "Coal seam water"
    ],
    "explanation": "Sambhar is an inland salt centre where lake brine is used for salt production. This contrasts with marine salt works along the coasts of Gujarat and Tamil Nadu.",
    "sourceFactId": "SALT-LAKE-BRINE",
    "sourceIds": [
      "SALT-COMMISSIONER-INDIA-SALT-INDUSTRY",
      "IBM-MINERAL-REVIEW-SALT"
    ]
  },
  {
    "stem": "Consider the statements: I. Gujarat has major marine salt works. II. Rajasthan has inland salt works using lake and sub-soil brine. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Official Salt Commissioner material identifies extensive marine salt centres along Gujarat's coast and inland salt works in Rajasthan. The two states illustrate different salt-producing environments.",
    "sourceFactId": "SALT-STATEMENT",
    "sourceIds": [
      "SALT-COMMISSIONER-INDIA-SALT-INDUSTRY",
      "IBM-MINERAL-REVIEW-SALT"
    ]
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Tuticorin — marine salt works",
    "distractors": [
      "Sambhar — iron ore",
      "Kharaghoda — mica belt",
      "Mandi — offshore salt works"
    ],
    "explanation": "Tuticorin in Tamil Nadu is a major marine salt centre. Sambhar is an inland Rajasthan salt lake, Kharaghoda is linked with salt in Gujarat, and Mandi is known for rock-salt deposits.",
    "sourceFactId": "SALT-TUTICORIN",
    "sourceIds": [
      "SALT-COMMISSIONER-INDIA-SALT-INDUSTRY",
      "IBM-MINERAL-REVIEW-SALT"
    ]
  },
  {
    "stem": "Which location is linked with rock-salt deposits rather than marine or lake-brine salt?",
    "answer": "Mandi in Himachal Pradesh",
    "distractors": [
      "Sambhar in Rajasthan",
      "Tuticorin in Tamil Nadu",
      "Kandla in Gujarat"
    ],
    "explanation": "The Salt Commissioner identifies rock-salt deposits at Mandi in Himachal Pradesh. Sambhar uses inland brine, while Tuticorin and Kandla belong to coastal salt-producing regions.",
    "sourceFactId": "SALT-ROCK-MANDI",
    "sourceIds": [
      "SALT-COMMISSIONER-INDIA-SALT-INDUSTRY",
      "IBM-MINERAL-REVIEW-SALT"
    ]
  },
  {
    "stem": "A question lists Sambhar, Kharaghoda and Tuticorin. What common resource connects them?",
    "answer": "Salt",
    "distractors": [
      "Iron ore",
      "Copper",
      "Chromite"
    ],
    "explanation": "Sambhar is an inland salt centre, Kharaghoda a Gujarat salt centre and Tuticorin a marine salt centre in Tamil Nadu. The shared resource is salt despite their different production settings.",
    "sourceFactId": "SALT-INTEGRATED",
    "sourceIds": [
      "SALT-COMMISSIONER-INDIA-SALT-INDUSTRY",
      "IBM-MINERAL-REVIEW-SALT"
    ]
  }
] as const),

buildGeoMinQl("ILMENITE-RUTILE-BEACH-SAND-TITANIUM", "Ilmenite, rutile and beach-sand titanium minerals", [
  {
    "stem": "Which two beach-sand minerals are important ores of titanium?",
    "answer": "Ilmenite and rutile",
    "distractors": [
      "Mica and gypsum",
      "Limestone and dolomite",
      "Manganese and chromite"
    ],
    "explanation": "Ilmenite and rutile are important titanium-bearing heavy minerals found in coastal placer deposits. Their occurrence in beach sands links mineral geography with India's coastal sediment systems.",
    "sourceFactId": "TITANIUM-ILMENITE-RUTILE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-ILMENITE-RUTILE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Chavara, an important beach-sand mineral centre, is located in which state?",
    "answer": "Kerala",
    "distractors": [
      "Punjab",
      "Rajasthan",
      "Jharkhand"
    ],
    "explanation": "Chavara in Kerala is a major beach-sand mineral location where ilmenite, rutile and other heavy minerals are processed. Its coastal setting is central to the deposit type.",
    "sourceFactId": "TITANIUM-CHAVARA",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-ILMENITE-RUTILE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Consider the statements: I. Manavalakurichi in Tamil Nadu is linked with beach-sand minerals. II. Gopalpur in Odisha is another such processing location. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Official IBM material identifies Manavalakurichi in Tamil Nadu and Gopalpur in Odisha among important beach-sand mineral centres. Both are associated with heavy-mineral processing.",
    "sourceFactId": "TITANIUM-COASTAL-CENTRES",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-ILMENITE-RUTILE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Chavara — ilmenite-rich beach sands",
    "distractors": [
      "Chavara — inland rock salt",
      "Manavalakurichi — coalfield",
      "Gopalpur — copper belt"
    ],
    "explanation": "Chavara in Kerala is a major ilmenite-bearing beach-sand region. Manavalakurichi and Gopalpur also belong to India's coastal heavy-mineral geography, not coal or copper belts.",
    "sourceFactId": "TITANIUM-MATCH",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-ILMENITE-RUTILE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "A coastal placer contains ilmenite, rutile, zircon and monazite. What type of deposit is being described?",
    "answer": "Heavy-mineral beach-sand deposit",
    "distractors": [
      "Coal seam",
      "Residual bauxite cap",
      "Copper lode"
    ],
    "explanation": "Ilmenite, rutile, zircon and monazite commonly occur together as dense heavy minerals concentrated by coastal processes. This assemblage is characteristic of beach-sand placers.",
    "sourceFactId": "TITANIUM-BEACH-PLACER",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-ILMENITE-RUTILE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which sequence correctly matches three important beach-sand centres with their states?",
    "answer": "Chavara—Kerala; Manavalakurichi—Tamil Nadu; Gopalpur—Odisha",
    "distractors": [
      "Chavara—Rajasthan; Manavalakurichi—Punjab; Gopalpur—Jharkhand",
      "All three—Madhya Pradesh",
      "Chavara—Goa; Manavalakurichi—Assam; Gopalpur—Gujarat"
    ],
    "explanation": "The three centres lie on different parts of India's coast: Chavara in Kerala, Manavalakurichi in Tamil Nadu and Gopalpur in Odisha. Together they form a strong coastal-mineral map pattern.",
    "sourceFactId": "TITANIUM-THREE-CENTRES",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-ILMENITE-RUTILE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  }
] as const),

buildGeoMinQl("KYANITE-SILLIMANITE-ANDALUSITE-REFRACTORY-MINERALS", "Kyanite, sillimanite and andalusite as refractory minerals", [
  {
    "stem": "Kyanite, sillimanite and andalusite share which chemical composition?",
    "answer": "Aluminium silicate, Al2SiO5",
    "distractors": [
      "Calcium carbonate",
      "Magnesium carbonate",
      "Calcium fluoride"
    ],
    "explanation": "Kyanite, sillimanite and andalusite are polymorphs with the same Al2SiO5 composition but different crystal structures. Their high-temperature behaviour makes them important refractory minerals.",
    "sourceFactId": "KSA-COMPOSITION",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-KYANITE-SILLIMANITE-ANDALUSITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which industrial use is most directly linked with kyanite, sillimanite and andalusite?",
    "answer": "Refractory materials for high-temperature furnaces",
    "distractors": [
      "Petroleum refining feedstock",
      "Electrical wiring metal",
      "Phosphatic fertilizer"
    ],
    "explanation": "When heated, these aluminium-silicate minerals form mullite and silica, producing heat-resistant materials. They are therefore used in refractory applications for metallurgical and other high-temperature industries.",
    "sourceFactId": "KSA-REFRACTORY",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-KYANITE-SILLIMANITE-ANDALUSITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Consider the statements: I. Kyanite, sillimanite and andalusite are polymorphs. II. They are important refractory minerals. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "The three minerals have the same chemical formula but different crystal structures, making them polymorphs. Their conversion to refractory phases at high temperatures gives them industrial importance.",
    "sourceFactId": "KSA-STATEMENT",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-KYANITE-SILLIMANITE-ANDALUSITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Kyanite — refractory mineral",
    "distractors": [
      "Kyanite — liquid fuel",
      "Sillimanite — principal copper ore",
      "Andalusite — rock salt"
    ],
    "explanation": "Kyanite, sillimanite and andalusite are aluminium-silicate refractory minerals. They should not be confused with metallic ores, fuels or evaporite minerals.",
    "sourceFactId": "KSA-MATCH",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-KYANITE-SILLIMANITE-ANDALUSITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which process most commonly forms kyanite, sillimanite and andalusite?",
    "answer": "Metamorphism of aluminium-rich rocks",
    "distractors": [
      "Evaporation of seawater only",
      "Coalification of plant matter",
      "Petroleum migration"
    ],
    "explanation": "IBM describes these minerals as metamorphic products formed in aluminium-rich rocks under different pressure-temperature conditions. Their occurrence therefore reflects metamorphic geology.",
    "sourceFactId": "KSA-METAMORPHIC",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-KYANITE-SILLIMANITE-ANDALUSITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Why are these minerals grouped together despite having different crystal structures?",
    "answer": "They have the same chemical formula and related refractory behaviour",
    "distractors": [
      "They are all fuels",
      "They are all iron ores",
      "They are all salts"
    ],
    "explanation": "Their shared Al2SiO5 composition makes them polymorphs, while their high-temperature transformation gives them similar refractory uses. The grouping is both mineralogical and industrial.",
    "sourceFactId": "KSA-REASONING",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-KYANITE-SILLIMANITE-ANDALUSITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  }
] as const),

buildGeoMinQl("FLUORITE-FLUORSPAR-FLUORINE-AND-INDIAN-REGIONS", "Fluorite, fluorine and Indian regions", [
  {
    "stem": "Fluorite, also called fluorspar, has which chemical composition?",
    "answer": "Calcium fluoride",
    "distractors": [
      "Calcium carbonate",
      "Magnesium carbonate",
      "Aluminium oxide"
    ],
    "explanation": "Fluorite is calcium fluoride, CaF2, and is the principal commercial mineral source of fluorine. This composition separates it clearly from limestone, magnesite and bauxite.",
    "sourceFactId": "FLUORITE-CHEMISTRY",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-FLUORITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which mineral is an important commercial source of fluorine?",
    "answer": "Fluorite",
    "distractors": [
      "Mica",
      "Graphite",
      "Gypsum"
    ],
    "explanation": "Fluorite or fluorspar is the principal commercial source of fluorine. It has uses in metallurgical, chemical and several specialised industrial processes.",
    "sourceFactId": "FLUORITE-FLUORINE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-FLUORITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Consider the statements: I. Fluorite is also called fluorspar. II. It is used in metallurgical and chemical industries. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Fluorite and fluorspar are names for the same CaF2 mineral, and its uses extend to metallurgy and fluorine-based chemical industries. Both statements are correct.",
    "sourceFactId": "FLUORITE-STATEMENT",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-FLUORITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Kadipani — fluorite",
    "distractors": [
      "Kadipani — gold",
      "Panna — fluorite",
      "Hutti — fluorspar"
    ],
    "explanation": "Kadipani in Gujarat is a recognised fluorite-mining and beneficiation centre. Panna is famous for diamond and Hutti for gold, so those alternatives mix unrelated mineral locations.",
    "sourceFactId": "FLUORITE-KADIPANI",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-FLUORITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "Which states contain important fluorite resources according to IBM mineral reviews?",
    "answer": "Gujarat and Rajasthan",
    "distractors": [
      "Punjab and Haryana only",
      "Kerala and Goa only",
      "Delhi and Chandigarh"
    ],
    "explanation": "IBM records major fluorite resources in Gujarat and Rajasthan, with additional resources in states such as Chhattisgarh and Maharashtra. This is a durable resource-geography fact, not an annual production rank.",
    "sourceFactId": "FLUORITE-STATES",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-FLUORITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  },
  {
    "stem": "A mineral clue reads 'CaF2, fluorspar, source of fluorine'. Which answer should be selected?",
    "answer": "Fluorite",
    "distractors": [
      "Dolomite",
      "Magnesite",
      "Rock phosphate"
    ],
    "explanation": "The formula CaF2 and the alternative name fluorspar uniquely identify fluorite. Its role as a fluorine source reinforces the identification.",
    "sourceFactId": "FLUORITE-CLUE",
    "sourceIds": [
      "IBM-MINERAL-REVIEW-FLUORITE",
      "IBM-INDIAN-MINERALS-YEARBOOK-2024"
    ]
  }
] as const)
]);

export const GEO_MIN_001_CP005_REVIEW_BATCH_V1 = finalizeGeoMinCp(5, QLS);
export function auditGeoMin001Cp005ReviewBatchV1() { return auditGeoMinCp(5, QLS, GEO_MIN_001_CP005_REVIEW_BATCH_V1); }
