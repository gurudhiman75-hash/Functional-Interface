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
    "qlId": "GEO-SOI-001-QL-010",
    "qlName": "Extent and distribution of alluvial soils",
    "difficulty": "Easy",
    "stem": "Which soil is the most widely spread soil type in India?",
    "answer": "Alluvial soil",
    "distractors": [
      "Black soil",
      "Laterite soil",
      "Arid soil"
    ],
    "explanation": "Alluvial soil is the most widely spread and one of the most important soil groups in India, especially across the great northern plains. Its distribution follows major depositional plains and deltas because rivers have repeatedly spread sediment over large lowland areas.",
    "sourceFactIds": [
      "ALLUVIAL-WIDESPREAD"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-010",
    "qlName": "Extent and distribution of alluvial soils",
    "difficulty": "Easy",
    "stem": "In which major region are alluvial soils especially extensive?",
    "answer": "The northern plains",
    "distractors": [
      "The high Himalayan summits",
      "The central Thar dunes only",
      "The exposed Deccan lava plateau only"
    ],
    "explanation": "The northern plains contain very extensive alluvial deposits laid down by the Indus, Ganga and Brahmaputra river systems. Its distribution follows major depositional plains and deltas because rivers have repeatedly spread sediment over large lowland areas.",
    "sourceFactIds": [
      "ALLUVIAL-NORTHERN-PLAINS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-010",
    "qlName": "Extent and distribution of alluvial soils",
    "difficulty": "Medium",
    "stem": "Alluvial soils are found beyond the northern plains in which important setting?",
    "answer": "Eastern coastal plains and river deltas",
    "distractors": [
      "Only snow-covered mountain crests",
      "Only bare rocky plateaus",
      "Only salt marshes with no river deposits"
    ],
    "explanation": "Alluvial soils also occur in eastern coastal plains, especially in the deltas built by major east-flowing rivers. Its distribution follows major depositional plains and deltas because rivers have repeatedly spread sediment over large lowland areas.",
    "sourceFactIds": [
      "ALLUVIAL-EAST-COAST-DELTAS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-010",
    "qlName": "Extent and distribution of alluvial soils",
    "difficulty": "Medium",
    "stem": "Which distribution pattern best fits alluvial soil in India?",
    "answer": "Extensive northern plains plus important river-delta deposits",
    "distractors": [
      "Restricted entirely to the Western Ghats",
      "Confined to high-altitude forest slopes",
      "Found only in the interior Deccan rain shadow"
    ],
    "explanation": "Alluvial soil has a very wide distribution, dominated by the northern plains but also present in river valleys and major eastern deltas. Its distribution follows major depositional plains and deltas because rivers have repeatedly spread sediment over large lowland areas.",
    "sourceFactIds": [
      "ALLUVIAL-DISTRIBUTION-PATTERN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-010",
    "qlName": "Extent and distribution of alluvial soils",
    "difficulty": "Medium",
    "stem": "Why does alluvial soil cover such large parts of the northern plains?",
    "answer": "Large river systems have deposited sediments over vast areas",
    "distractors": [
      "Volcanic lava covers the entire plain",
      "Wind has removed all river material",
      "The plains contain no active rivers"
    ],
    "explanation": "The Indus, Ganga and Brahmaputra systems have transported and deposited enormous quantities of sediment, building extensive alluvial plains. Its distribution follows major depositional plains and deltas because rivers have repeatedly spread sediment over large lowland areas.",
    "sourceFactIds": [
      "ALLUVIAL-RIVER-DEPOSITION-EXTENT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-010",
    "qlName": "Extent and distribution of alluvial soils",
    "difficulty": "Medium",
    "stem": "A map highlights the Indo-Gangetic-Brahmaputra plains and the deltas of major east-flowing rivers. Which soil group best matches both highlighted areas?",
    "answer": "Alluvial soil",
    "distractors": [
      "Black soil",
      "Laterite soil",
      "Arid soil"
    ],
    "explanation": "Both the great northern plains and large eastern river deltas are major zones of sediment deposition and therefore extensive alluvial soils. Its distribution follows major depositional plains and deltas because rivers have repeatedly spread sediment over large lowland areas.",
    "sourceFactIds": [
      "ALLUVIAL-MAP-INTEGRATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-011",
    "qlName": "River deposition and alluvial material",
    "difficulty": "Easy",
    "stem": "Alluvial soil is formed largely by the deposition of material carried by what?",
    "answer": "Rivers",
    "distractors": [
      "Glaciers alone across all India",
      "Volcanic eruptions only",
      "Coral reefs"
    ],
    "explanation": "Rivers erode, transport and deposit sediments such as sand, silt and clay. These deposits form alluvial soils. This is why alluvial soil is called a transported soil: rivers carry weathered material from elsewhere and deposit it when their flow loses energy.",
    "sourceFactIds": [
      "ALLUVIAL-RIVER-DEPOSITION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-011",
    "qlName": "River deposition and alluvial material",
    "difficulty": "Easy",
    "stem": "Which materials commonly make up river alluvium?",
    "answer": "Sand, silt and clay",
    "distractors": [
      "Coal, petroleum and natural gas",
      "Only solid basalt blocks",
      "Only undecomposed leaves"
    ],
    "explanation": "Alluvial deposits contain varying proportions of sand, silt and clay carried and laid down by rivers. This is why alluvial soil is called a transported soil: rivers carry weathered material from elsewhere and deposit it when their flow loses energy.",
    "sourceFactIds": [
      "ALLUVIAL-SAND-SILT-CLAY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-011",
    "qlName": "River deposition and alluvial material",
    "difficulty": "Medium",
    "stem": "Why can the texture of alluvial soil vary from place to place?",
    "answer": "Rivers deposit different proportions of sand, silt and clay",
    "distractors": [
      "Every river carries exactly the same sediment",
      "Alluvial soil contains no mineral particles",
      "Texture is fixed only by latitude"
    ],
    "explanation": "Sediment size and river energy vary along a river system, so one alluvial deposit may be sandier while another contains more silt or clay. This is why alluvial soil is called a transported soil: rivers carry weathered material from elsewhere and deposit it when their flow loses energy.",
    "sourceFactIds": [
      "ALLUVIAL-TEXTURE-VARIATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-011",
    "qlName": "River deposition and alluvial material",
    "difficulty": "Medium",
    "stem": "What happens when a river loses carrying power on a plain?",
    "answer": "It deposits part of its sediment load",
    "distractors": [
      "It turns all sediment into bedrock instantly",
      "It stops containing water permanently",
      "It converts sediment into lava"
    ],
    "explanation": "As river velocity and carrying power fall, some of the transported sediment settles out and becomes part of the alluvial deposit. This is why alluvial soil is called a transported soil: rivers carry weathered material from elsewhere and deposit it when their flow loses energy.",
    "sourceFactIds": [
      "RIVER-LOSS-CARRYING-POWER"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-011",
    "qlName": "River deposition and alluvial material",
    "difficulty": "Medium",
    "stem": "Which process directly links Himalayan river systems with formation of northern alluvial plains?",
    "answer": "Erosion upstream followed by transport and deposition downstream",
    "distractors": [
      "Volcanism followed by lava cooling",
      "Coral growth followed by uplift",
      "Wind erosion with no river transport"
    ],
    "explanation": "Rivers collect sediment from their catchments, transport it downstream and deposit it across plains and floodplains, producing alluvium. This is why alluvial soil is called a transported soil: rivers carry weathered material from elsewhere and deposit it when their flow loses energy.",
    "sourceFactIds": [
      "ALLUVIAL-EROSION-TRANSPORT-DEPOSITION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-011",
    "qlName": "River deposition and alluvial material",
    "difficulty": "Hard",
    "stem": "A river emerges from a high-relief region, slows across a plain and spreads fine sediment during floods. Which sequence best explains the resulting soil?",
    "answer": "Transport of rock material → loss of river energy → sediment deposition",
    "distractors": [
      "Soil formation → river disappears → volcanic eruption",
      "Deposition → sediment becomes magma → river forms",
      "Wind erosion → coral growth → floodplain formation"
    ],
    "explanation": "River alluvium develops through sediment transport followed by deposition when flow energy decreases, especially across floodplains and low-gradient areas. This is why alluvial soil is called a transported soil: rivers carry weathered material from elsewhere and deposit it when their flow loses energy.",
    "sourceFactIds": [
      "ALLUVIAL-DEPOSITION-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-012",
    "qlName": "Alluvial soils of the northern plains",
    "difficulty": "Easy",
    "stem": "Which river systems are chiefly responsible for the vast alluvial deposits of the northern plains?",
    "answer": "Indus, Ganga and Brahmaputra systems",
    "distractors": [
      "Narmada, Tapi and Mahi only",
      "Luni and Sabarmati only",
      "Periyar and Vaigai only"
    ],
    "explanation": "The Indus, Ganga and Brahmaputra river systems and their tributaries have built the extensive alluvial deposits of northern India. The northern plains were built by long-term deposition from large river systems, and active floodplains can still receive fresh layers of sediment.",
    "sourceFactIds": [
      "ALLUVIAL-IGB-SYSTEMS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-012",
    "qlName": "Alluvial soils of the northern plains",
    "difficulty": "Easy",
    "stem": "The Indo-Gangetic-Brahmaputra plain is dominated by which soil group?",
    "answer": "Alluvial soil",
    "distractors": [
      "Laterite soil",
      "Black soil",
      "Arid soil"
    ],
    "explanation": "The great northern plain is built from river-borne sediments and is therefore dominated by alluvial soils. The northern plains were built by long-term deposition from large river systems, and active floodplains can still receive fresh layers of sediment.",
    "sourceFactIds": [
      "ALLUVIAL-IGB-PLAIN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-012",
    "qlName": "Alluvial soils of the northern plains",
    "difficulty": "Medium",
    "stem": "Why is alluvial soil so extensive from Punjab toward the Ganga-Brahmaputra plains?",
    "answer": "Long-term river deposition has built a continuous sedimentary plain",
    "distractors": [
      "One lava flow covered the whole region",
      "Only wind-blown sand formed the plain",
      "The region has no sediment transport"
    ],
    "explanation": "Large connected river systems have repeatedly deposited sediment over the northern lowlands, producing an extensive alluvial belt. The northern plains were built by long-term deposition from large river systems, and active floodplains can still receive fresh layers of sediment.",
    "sourceFactIds": [
      "ALLUVIAL-NORTH-CONTINUITY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-012",
    "qlName": "Alluvial soils of the northern plains",
    "difficulty": "Medium",
    "stem": "Which feature of the northern plains supports repeated renewal of alluvial deposits?",
    "answer": "Active rivers and floodplains",
    "distractors": [
      "Absence of drainage",
      "Continuous volcanic eruptions",
      "Permanent frozen ground"
    ],
    "explanation": "Active river channels and floodplains allow new sediment to be laid down during floods and channel shifts, renewing parts of the alluvial cover. The northern plains were built by long-term deposition from large river systems, and active floodplains can still receive fresh layers of sediment.",
    "sourceFactIds": [
      "ALLUVIAL-FLOODPLAINS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-012",
    "qlName": "Alluvial soils of the northern plains",
    "difficulty": "Medium",
    "stem": "Alluvial deposits also extend into parts of Rajasthan and Gujarat in what general form?",
    "answer": "A narrower river-deposited belt connected with the northern plains",
    "distractors": [
      "A continuous high-mountain snow belt",
      "A laterite cap over every plateau",
      "A coral-reef zone"
    ],
    "explanation": "Alluvial material extends westward into parts of Rajasthan and Gujarat, though the major continuous expanse lies across the northern plains. The northern plains were built by long-term deposition from large river systems, and active floodplains can still receive fresh layers of sediment.",
    "sourceFactIds": [
      "ALLUVIAL-RAJASTHAN-GUJARAT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-012",
    "qlName": "Alluvial soils of the northern plains",
    "difficulty": "Hard",
    "stem": "Consider the following statements about northern alluvial soils:\nI. They are linked with large Himalayan river systems.\nII. Floodplains can receive fresh sediment.\nIII. Their distribution is unrelated to river deposition.\nWhich statements are correct?",
    "answer": "I and II only",
    "distractors": [
      "I only",
      "II and III only",
      "I, II and III"
    ],
    "explanation": "Statements I and II are correct. Northern alluvial soils are fundamentally depositional, and active floodplains may receive newer sediment during floods. The northern plains were built by long-term deposition from large river systems, and active floodplains can still receive fresh layers of sediment.",
    "sourceFactIds": [
      "ALLUVIAL-NORTH-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-013",
    "qlName": "Alluvial soils of eastern coastal deltas",
    "difficulty": "Easy",
    "stem": "Which coastal setting contains important alluvial soils in peninsular India?",
    "answer": "The deltas of major east-flowing rivers",
    "distractors": [
      "Only the western coastal cliffs",
      "Only offshore coral islands",
      "Only high plateau summits"
    ],
    "explanation": "Major east-flowing rivers build deltas along the eastern coast, and these deltaic areas contain extensive alluvial deposits. Near the coast, rivers slow down and divide into distributaries, allowing fine sediment to settle and build fertile deltaic alluvial plains.",
    "sourceFactIds": [
      "ALLUVIAL-EASTERN-DELTAS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-013",
    "qlName": "Alluvial soils of eastern coastal deltas",
    "difficulty": "Easy",
    "stem": "Which group of rivers has important alluvial deltas on the eastern coast?",
    "answer": "Mahanadi, Godavari, Krishna and Kaveri",
    "distractors": [
      "Narmada, Tapi, Mahi and Luni",
      "Jhelum, Chenab, Ravi and Beas only",
      "Periyar, Mandovi, Zuari and Sharavati only"
    ],
    "explanation": "The Mahanadi, Godavari, Krishna and Kaveri form major east-coast deltas where river deposition creates alluvial soils. Near the coast, rivers slow down and divide into distributaries, allowing fine sediment to settle and build fertile deltaic alluvial plains.",
    "sourceFactIds": [
      "ALLUVIAL-DELTA-RIVERS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-013",
    "qlName": "Alluvial soils of eastern coastal deltas",
    "difficulty": "Medium",
    "stem": "Why are alluvial soils common in large eastern coastal deltas?",
    "answer": "Rivers deposit fine sediment as they approach the sea",
    "distractors": [
      "The sea converts lava directly into soil",
      "No rivers enter the eastern coast",
      "Only wind carries material into the deltas"
    ],
    "explanation": "As rivers lose gradient and velocity near their mouths, they deposit sediment and build deltas with extensive alluvial soils. Near the coast, rivers slow down and divide into distributaries, allowing fine sediment to settle and build fertile deltaic alluvial plains.",
    "sourceFactIds": [
      "ALLUVIAL-DELTA-DEPOSITION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-013",
    "qlName": "Alluvial soils of eastern coastal deltas",
    "difficulty": "Medium",
    "stem": "Which pair is correctly matched?",
    "answer": "Godavari delta — alluvial deposits",
    "distractors": [
      "Western Ghats crest — deltaic alluvium",
      "Thar dune crest — river delta alluvium",
      "High Himalaya — coastal delta alluvium"
    ],
    "explanation": "The Godavari is a major east-flowing river that builds a delta, and its lower course and delta contain important alluvial deposits. Near the coast, rivers slow down and divide into distributaries, allowing fine sediment to settle and build fertile deltaic alluvial plains.",
    "sourceFactIds": [
      "GODAVARI-DELTA-ALLUVIUM"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-013",
    "qlName": "Alluvial soils of eastern coastal deltas",
    "difficulty": "Medium",
    "stem": "A low-lying coastal plain contains distributaries and recently deposited river sediment. Which soil origin is most likely?",
    "answer": "Deltaic alluvium",
    "distractors": [
      "Residual black soil from fresh lava only",
      "Mountain forest soil",
      "Wind-formed arid soil only"
    ],
    "explanation": "Distributaries and fresh river deposits are typical of a deltaic environment, where alluvial sediments accumulate near the river mouth. Near the coast, rivers slow down and divide into distributaries, allowing fine sediment to settle and build fertile deltaic alluvial plains.",
    "sourceFactIds": [
      "DELTAIC-ALLUVIUM-CLUES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-013",
    "qlName": "Alluvial soils of eastern coastal deltas",
    "difficulty": "Medium",
    "stem": "A soil occurs in both the Ganga plain and the Krishna delta. Which common process best explains its presence in these distant regions?",
    "answer": "Deposition of sediments by river systems",
    "distractors": [
      "Identical volcanic eruptions in both regions",
      "Permanent glacial cover",
      "Formation only from wind-blown desert sand"
    ],
    "explanation": "The two regions differ greatly, but both receive large amounts of river-deposited sediment. That common process produces alluvial soil in each setting. Near the coast, rivers slow down and divide into distributaries, allowing fine sediment to settle and build fertile deltaic alluvial plains.",
    "sourceFactIds": [
      "ALLUVIAL-COMMON-PROCESS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-014",
    "qlName": "Khadar or newer alluvium",
    "difficulty": "Easy",
    "stem": "What is the newer alluvium of the northern plains called?",
    "answer": "Khadar",
    "distractors": [
      "Bhangar",
      "Regur",
      "Laterite"
    ],
    "explanation": "Khadar is the newer alluvial deposit found in active floodplain areas where rivers can add fresh sediment. Khadar lies on younger, lower floodplain surfaces, so floods can add fresh silt and renew this alluvium more often than older deposits.",
    "sourceFactIds": [
      "KHADAR-NEW-ALLUVIUM"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-014",
    "qlName": "Khadar or newer alluvium",
    "difficulty": "Easy",
    "stem": "Why is khadar renewed more frequently than bhangar?",
    "answer": "It lies in floodplain areas that receive fresh river deposits",
    "distractors": [
      "It is formed only by lava flows",
      "It occurs only on high terraces beyond floods",
      "It contains no river sediment"
    ],
    "explanation": "Khadar occupies lower floodplain areas and can receive fresh layers of alluvium during floods, making it younger and more frequently renewed. Khadar lies on younger, lower floodplain surfaces, so floods can add fresh silt and renew this alluvium more often than older deposits.",
    "sourceFactIds": [
      "KHADAR-FLOOD-RENEWAL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-014",
    "qlName": "Khadar or newer alluvium",
    "difficulty": "Medium",
    "stem": "Which setting is most typical of khadar?",
    "answer": "A low floodplain close to an active river channel",
    "distractors": [
      "An old elevated terrace above frequent floods",
      "A basalt plateau far from rivers",
      "A steep lateritic hill crest"
    ],
    "explanation": "Khadar is newer alluvium of active or recently active floodplains, so it is commonly found close to river channels and low floodplain surfaces. Khadar lies on younger, lower floodplain surfaces, so floods can add fresh silt and renew this alluvium more often than older deposits.",
    "sourceFactIds": [
      "KHADAR-LOW-FLOODPLAIN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-014",
    "qlName": "Khadar or newer alluvium",
    "difficulty": "Medium",
    "stem": "How does khadar generally compare with bhangar in age?",
    "answer": "Khadar is younger",
    "distractors": [
      "Khadar is older",
      "They are both bedrock units",
      "Age has no meaning for alluvial deposits"
    ],
    "explanation": "Khadar represents newer alluvium, while bhangar is older alluvium deposited on relatively higher and older surfaces. Khadar lies on younger, lower floodplain surfaces, so floods can add fresh silt and renew this alluvium more often than older deposits.",
    "sourceFactIds": [
      "KHADAR-YOUNGER-BHANGAR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-014",
    "qlName": "Khadar or newer alluvium",
    "difficulty": "Medium",
    "stem": "Why is khadar often considered highly fertile?",
    "answer": "Fresh fine sediments are deposited repeatedly on floodplains",
    "distractors": [
      "It never contains mineral material",
      "It forms only under permanent snow",
      "It cannot support crops"
    ],
    "explanation": "Periodic deposition brings fresh mineral sediment to khadar areas, helping maintain the fertility of these younger alluvial soils. Khadar lies on younger, lower floodplain surfaces, so floods can add fresh silt and renew this alluvium more often than older deposits.",
    "sourceFactIds": [
      "KHADAR-FERTILITY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-014",
    "qlName": "Khadar or newer alluvium",
    "difficulty": "Hard",
    "stem": "A village has two fields: Field A is on a low floodplain that receives fresh silt during floods; Field B is on an older raised terrace. Which identification is correct?",
    "answer": "Field A — khadar; Field B — bhangar",
    "distractors": [
      "Field A — bhangar; Field B — khadar",
      "Both fields — black soil",
      "Both fields — laterite soil"
    ],
    "explanation": "Fresh floodplain deposits identify Field A as khadar, while the older elevated alluvial surface of Field B is characteristic of bhangar. Khadar lies on younger, lower floodplain surfaces, so floods can add fresh silt and renew this alluvium more often than older deposits.",
    "sourceFactIds": [
      "KHADAR-BHANGAR-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-015",
    "qlName": "Bhangar or older alluvium",
    "difficulty": "Easy",
    "stem": "What is the older alluvium of the northern plains called?",
    "answer": "Bhangar",
    "distractors": [
      "Khadar",
      "Regur",
      "Laterite"
    ],
    "explanation": "Bhangar is the older alluvial deposit, generally found on older and relatively higher surfaces above the frequently flooded zone. Bhangar occurs on older, higher alluvial surfaces that are flooded less often, and calcareous kankar nodules are a common identifying feature.",
    "sourceFactIds": [
      "BHANGAR-OLD-ALLUVIUM"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-015",
    "qlName": "Bhangar or older alluvium",
    "difficulty": "Easy",
    "stem": "Which feature is characteristic of bhangar soil?",
    "answer": "Kankar or calcareous nodules may occur in it",
    "distractors": [
      "It is renewed by every flood",
      "It is formed only from fresh lava",
      "It contains no calcium compounds"
    ],
    "explanation": "Older alluvium often contains calcareous concretions known as kankar, a standard feature used to distinguish bhangar from khadar. Bhangar occurs on older, higher alluvial surfaces that are flooded less often, and calcareous kankar nodules are a common identifying feature.",
    "sourceFactIds": [
      "BHANGAR-KANKAR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-015",
    "qlName": "Bhangar or older alluvium",
    "difficulty": "Medium",
    "stem": "Where is bhangar more likely to occur?",
    "answer": "On older elevated terraces above active floodplains",
    "distractors": [
      "On the lowest frequently flooded surface",
      "Only in coastal mangroves",
      "Only on new volcanic cones"
    ],
    "explanation": "Bhangar is older alluvium preserved on relatively high terraces that are less frequently reached by present-day floods. Bhangar occurs on older, higher alluvial surfaces that are flooded less often, and calcareous kankar nodules are a common identifying feature.",
    "sourceFactIds": [
      "BHANGAR-HIGH-TERRACE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-015",
    "qlName": "Bhangar or older alluvium",
    "difficulty": "Medium",
    "stem": "Which comparison between bhangar and khadar is correct?",
    "answer": "Bhangar is older and less frequently renewed by floods",
    "distractors": [
      "Bhangar is the newer floodplain deposit",
      "Khadar contains older terrace surfaces",
      "Both terms refer to black soil"
    ],
    "explanation": "Bhangar represents older alluvium on higher ground, while khadar is younger alluvium more regularly renewed on floodplains. Bhangar occurs on older, higher alluvial surfaces that are flooded less often, and calcareous kankar nodules are a common identifying feature.",
    "sourceFactIds": [
      "BHANGAR-VS-KHADAR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-015",
    "qlName": "Bhangar or older alluvium",
    "difficulty": "Medium",
    "stem": "A raised alluvial surface contains noticeable calcareous nodules and is rarely flooded. Which soil is indicated?",
    "answer": "Bhangar",
    "distractors": [
      "Khadar",
      "Black soil",
      "Laterite soil"
    ],
    "explanation": "The combination of an older raised alluvial surface, infrequent flooding and kankar nodules is characteristic of bhangar. Bhangar occurs on older, higher alluvial surfaces that are flooded less often, and calcareous kankar nodules are a common identifying feature.",
    "sourceFactIds": [
      "BHANGAR-CLUES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-015",
    "qlName": "Bhangar or older alluvium",
    "difficulty": "Hard",
    "stem": "Consider the following statements:\nI. Bhangar is older alluvium.\nII. It is generally found above the active floodplain.\nIII. It is renewed more frequently than khadar.\nWhich statements are correct?",
    "answer": "I and II only",
    "distractors": [
      "I only",
      "II and III only",
      "I, II and III"
    ],
    "explanation": "Statements I and II are correct. Bhangar is older alluvium on relatively elevated surfaces and is renewed less often than khadar. Bhangar occurs on older, higher alluvial surfaces that are flooded less often, and calcareous kankar nodules are a common identifying feature.",
    "sourceFactIds": [
      "BHANGAR-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-016",
    "qlName": "Texture, composition and fertility",
    "difficulty": "Easy",
    "stem": "Which three particle sizes are commonly present in alluvial soil?",
    "answer": "Sand, silt and clay",
    "distractors": [
      "Coal, iron and petroleum",
      "Only gravel and bedrock",
      "Only organic litter"
    ],
    "explanation": "Alluvial soil consists of river-deposited mineral particles, with varying proportions of sand, silt and clay. Alluvial texture varies with the mix of sand, silt and clay, but many deposits are deep and workable enough to support intensive cultivation.",
    "sourceFactIds": [
      "ALLUVIAL-PARTICLE-SIZES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-016",
    "qlName": "Texture, composition and fertility",
    "difficulty": "Easy",
    "stem": "Alluvial soils are generally well suited to agriculture because they are what?",
    "answer": "Fertile and easy to cultivate in many regions",
    "distractors": [
      "Always extremely acidic and barren",
      "Permanently frozen",
      "Composed only of coarse stones"
    ],
    "explanation": "Many alluvial soils are fertile, deep and workable, which helps explain the intense agriculture of India's great river plains and deltas. Alluvial texture varies with the mix of sand, silt and clay, but many deposits are deep and workable enough to support intensive cultivation.",
    "sourceFactIds": [
      "ALLUVIAL-GENERAL-FERTILITY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-016",
    "qlName": "Texture, composition and fertility",
    "difficulty": "Medium",
    "stem": "Which nutrients are commonly noted as adequate in alluvial soils in school geography?",
    "answer": "Potash, phosphoric acid and lime",
    "distractors": [
      "Gold, silver and copper",
      "Petroleum, coal and natural gas",
      "Only sodium chloride"
    ],
    "explanation": "NCERT notes that alluvial soils generally contain adequate proportions of potash, phosphoric acid and lime, supporting a wide range of crops. Alluvial texture varies with the mix of sand, silt and clay, but many deposits are deep and workable enough to support intensive cultivation.",
    "sourceFactIds": [
      "ALLUVIAL-POTASH-PHOSPHORIC-LIME"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-016",
    "qlName": "Texture, composition and fertility",
    "difficulty": "Medium",
    "stem": "Why does alluvial soil texture differ between upper and lower river courses?",
    "answer": "The size of deposited sediment changes with river energy and distance",
    "distractors": [
      "All rivers deposit only clay everywhere",
      "Texture depends only on crop choice",
      "Sediment size is unrelated to flow conditions"
    ],
    "explanation": "Coarser material is more easily deposited where river energy falls sharply, while finer silt and clay can travel farther before settling. Alluvial texture varies with the mix of sand, silt and clay, but many deposits are deep and workable enough to support intensive cultivation.",
    "sourceFactIds": [
      "ALLUVIAL-TEXTURE-RIVER-ENERGY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-016",
    "qlName": "Texture, composition and fertility",
    "difficulty": "Medium",
    "stem": "Which property is most useful for recognising alluvial soil as a transported soil?",
    "answer": "It is built from sediments deposited by rivers",
    "distractors": [
      "It forms only from rock weathering at the exact same spot",
      "It has no mineral particles",
      "It occurs only where there are no rivers"
    ],
    "explanation": "Alluvial soil is transported soil because rivers carry sediment from elsewhere and deposit it on plains, floodplains and deltas. Alluvial texture varies with the mix of sand, silt and clay, but many deposits are deep and workable enough to support intensive cultivation.",
    "sourceFactIds": [
      "ALLUVIAL-TRANSPORTED-SOIL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-016",
    "qlName": "Texture, composition and fertility",
    "difficulty": "Medium",
    "stem": "A soil is deep, river-deposited, contains mixed sand-silt-clay fractions and supports intensive farming. Which soil group is the best fit?",
    "answer": "Alluvial soil",
    "distractors": [
      "Laterite soil",
      "Arid soil",
      "Mountain forest soil"
    ],
    "explanation": "The combination of fluvial deposition, mixed sediment sizes, depth and agricultural importance strongly identifies alluvial soil. Alluvial texture varies with the mix of sand, silt and clay, but many deposits are deep and workable enough to support intensive cultivation.",
    "sourceFactIds": [
      "ALLUVIAL-PROPERTY-IDENTIFICATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-017",
    "qlName": "Alluvial soils and crop suitability",
    "difficulty": "Easy",
    "stem": "Which cereal is widely grown on fertile alluvial soils of the northern plains?",
    "answer": "Wheat",
    "distractors": [
      "Tea only",
      "Rubber only",
      "Coffee only"
    ],
    "explanation": "Wheat is a major crop of the fertile alluvial plains, especially in the irrigated and well-drained parts of northern India. Alluvial soil can support many crops, but actual crop choice still depends on temperature, rainfall, irrigation and the needs of each crop.",
    "sourceFactIds": [
      "ALLUVIAL-WHEAT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-017",
    "qlName": "Alluvial soils and crop suitability",
    "difficulty": "Easy",
    "stem": "Which crop is strongly linked with fertile alluvial soils in many parts of the Ganga plain?",
    "answer": "Sugarcane",
    "distractors": [
      "Natural rubber only",
      "Cardamom only",
      "Saffron only"
    ],
    "explanation": "Sugarcane grows extensively in fertile alluvial tracts of the Ganga plain where moisture and irrigation are also favourable. Alluvial soil can support many crops, but actual crop choice still depends on temperature, rainfall, irrigation and the needs of each crop.",
    "sourceFactIds": [
      "ALLUVIAL-SUGARCANE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-017",
    "qlName": "Alluvial soils and crop suitability",
    "difficulty": "Medium",
    "stem": "Which crop combination is well suited to fertile alluvial soils under suitable moisture conditions?",
    "answer": "Rice, wheat and sugarcane",
    "distractors": [
      "Tea, coffee and rubber only",
      "Apple, saffron and walnut only",
      "Coconut, cashew and rubber only"
    ],
    "explanation": "Alluvial soils support major food and cash crops such as rice, wheat and sugarcane when climate and water supply are suitable. Alluvial soil can support many crops, but actual crop choice still depends on temperature, rainfall, irrigation and the needs of each crop.",
    "sourceFactIds": [
      "ALLUVIAL-CROP-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-017",
    "qlName": "Alluvial soils and crop suitability",
    "difficulty": "Medium",
    "stem": "Why do alluvial plains support intensive agriculture?",
    "answer": "Their soils are extensive, generally fertile and often occur on level terrain",
    "distractors": [
      "They are always steep and rocky",
      "They lack river water everywhere",
      "They contain no fine sediment"
    ],
    "explanation": "Fertile alluvial deposits spread across extensive level plains that are easy to cultivate and often have good access to river or groundwater irrigation. Alluvial soil can support many crops, but actual crop choice still depends on temperature, rainfall, irrigation and the needs of each crop.",
    "sourceFactIds": [
      "ALLUVIAL-INTENSIVE-AGRICULTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-017",
    "qlName": "Alluvial soils and crop suitability",
    "difficulty": "Medium",
    "stem": "A farmer chooses between a fertile alluvial floodplain and a bare rocky slope for cereal cultivation. Why is the floodplain usually favoured?",
    "answer": "It offers deeper workable soil with better moisture and nutrient conditions",
    "distractors": [
      "Its latitude changes each season",
      "It contains no sediment",
      "Floodplains cannot support roots"
    ],
    "explanation": "Alluvial floodplains commonly provide deep, fine-textured and fertile soil that is easier to cultivate than a shallow rocky slope. Alluvial soil can support many crops, but actual crop choice still depends on temperature, rainfall, irrigation and the needs of each crop.",
    "sourceFactIds": [
      "ALLUVIAL-FLOODPLAIN-FARMING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-017",
    "qlName": "Alluvial soils and crop suitability",
    "difficulty": "Hard",
    "stem": "A district has deep alluvial soil, irrigation and warm summers. Which crop set is most plausible for intensive cultivation?",
    "answer": "Rice, wheat, sugarcane and pulses",
    "distractors": [
      "Rubber, tea and coffee only",
      "Alpine grasses and saffron only",
      "No crops because alluvial soil is infertile"
    ],
    "explanation": "Fertile alluvial soils can support rice, wheat, sugarcane, cereals and pulses when water and climate meet the needs of each crop. Alluvial soil can support many crops, but actual crop choice still depends on temperature, rainfall, irrigation and the needs of each crop.",
    "sourceFactIds": [
      "ALLUVIAL-MULTICROP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-018",
    "qlName": "Integrated alluvial-soil reasoning",
    "difficulty": "Easy",
    "stem": "A soil is deposited by rivers and occurs across much of the northern plains. Which soil is it?",
    "answer": "Alluvial soil",
    "distractors": [
      "Black soil",
      "Laterite soil",
      "Forest soil"
    ],
    "explanation": "River deposition across the northern plains is the defining setting of India's extensive alluvial soils. The connecting idea is river deposition: it explains the northern plains, khadar and bhangar differences, and the alluvial soils of major deltas.",
    "sourceFactIds": [
      "ALLUVIAL-INTEGRATED-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-018",
    "qlName": "Integrated alluvial-soil reasoning",
    "difficulty": "Easy",
    "stem": "A low floodplain receives fresh silt almost every year. Which type of alluvium is most likely?",
    "answer": "Khadar",
    "distractors": [
      "Bhangar",
      "Regur",
      "Laterite"
    ],
    "explanation": "Fresh sediment deposition on an active floodplain indicates khadar, the newer alluvium that is renewed more frequently by floods. The connecting idea is river deposition: it explains the northern plains, khadar and bhangar differences, and the alluvial soils of major deltas.",
    "sourceFactIds": [
      "ALLUVIAL-INTEGRATED-KHADAR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-018",
    "qlName": "Integrated alluvial-soil reasoning",
    "difficulty": "Medium",
    "stem": "An older raised terrace has kankar nodules, while the lower floodplain receives fresh silt. Which pair is correct?",
    "answer": "Raised terrace — bhangar; floodplain — khadar",
    "distractors": [
      "Raised terrace — khadar; floodplain — bhangar",
      "Both — black soil",
      "Both — laterite soil"
    ],
    "explanation": "Bhangar is older alluvium on higher terraces and may contain kankar. Khadar is newer alluvium of active floodplains. The connecting idea is river deposition: it explains the northern plains, khadar and bhangar differences, and the alluvial soils of major deltas.",
    "sourceFactIds": [
      "ALLUVIAL-INTEGRATED-BHANGAR-KHADAR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-018",
    "qlName": "Integrated alluvial-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which sequence best explains formation of fertile deltaic alluvium?",
    "answer": "River transport → slowing near the coast → sediment deposition",
    "distractors": [
      "Lava eruption → glaciation → delta formation",
      "Wind erosion → bedrock uplift → no deposition",
      "Coral growth → river capture → desert soil"
    ],
    "explanation": "A river carries sediment downstream, loses energy near its lower course and mouth, and deposits material that builds a deltaic alluvial plain. The connecting idea is river deposition: it explains the northern plains, khadar and bhangar differences, and the alluvial soils of major deltas.",
    "sourceFactIds": [
      "ALLUVIAL-INTEGRATED-DELTA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-018",
    "qlName": "Integrated alluvial-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which statement best connects alluvial soil distribution and agriculture?",
    "answer": "Large depositional plains provide extensive fertile land for intensive cultivation",
    "distractors": [
      "Alluvial soil occurs only on steep barren slopes",
      "Alluvial regions have no major river systems",
      "River deposits prevent cereal cultivation"
    ],
    "explanation": "The same river systems that build extensive alluvial plains also create deep, fertile and workable soils that support dense agricultural use. The connecting idea is river deposition: it explains the northern plains, khadar and bhangar differences, and the alluvial soils of major deltas.",
    "sourceFactIds": [
      "ALLUVIAL-INTEGRATED-AGRICULTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-018",
    "qlName": "Integrated alluvial-soil reasoning",
    "difficulty": "Hard",
    "stem": "Consider the following statements about alluvial soils:\nI. Khadar is newer alluvium of active floodplains.\nII. Bhangar is older alluvium and may contain kankar.\nIII. Major eastern river deltas also contain alluvial deposits.\nWhich statements are correct?",
    "answer": "I, II and III",
    "distractors": [
      "I and II only",
      "II and III only",
      "I and III only"
    ],
    "explanation": "All three statements are correct. They connect the age classes of northern alluvium with the wider occurrence of river-deposited soils in eastern deltas. The connecting idea is river deposition: it explains the northern plains, khadar and bhangar differences, and the alluvial soils of major deltas.",
    "sourceFactIds": [
      "ALLUVIAL-INTEGRATED-STATEMENTS"
    ]
  }
]);

export const GEO_SOI_001_CP002_REVIEW_BATCH_V1: readonly GeoSoi001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-SOI-001-CP002-Q${String(index + 1).padStart(3, "0")}`,
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

export function auditGeoSoi001Cp002ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoSoi001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_SOI_001_CP002_REVIEW_BATCH_V1) {
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
    if ((q.explanation.match(/[.!?](?:\\s|$)/g) ?? []).length < 2) issues.push("EXPLANATION_DEPTH:" + q.questionId);
  }

  if (GEO_SOI_001_CP002_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_SOI_001_CP002_REVIEW_BATCH_V1.length);
  for (let n = 10; n <= 18; n += 1) {
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
    questionCount: GEO_SOI_001_CP002_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
