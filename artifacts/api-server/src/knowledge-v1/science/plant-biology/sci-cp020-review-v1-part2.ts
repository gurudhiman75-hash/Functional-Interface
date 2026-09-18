import type { KnowledgeV1Difficulty } from "../../types";

export type SciCp020ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];

export const PART_2: readonly SciCp020ReviewSpec[] = [
  [
    3,
    "Medium",
    "In cactus, leaves are modified into spines mainly to:",
    "Reduce water loss",
    [
      "Increase transpiration",
      "Absorb minerals from soil",
      "Transport food through phloem"
    ],
    "Cactus leaves are reduced to spines, which greatly decrease the surface area for water loss. The green stem carries out most photosynthesis.",
    [
      "LEAF-CACTUS-SPINES"
    ]
  ],
  [
    3,
    "Medium",
    "A tendril that helps a climber attach to a support is mainly an adaptation for:",
    "Climbing",
    [
      "Water absorption",
      "Seed dispersal",
      "Mineral storage"
    ],
    "Tendrils coil around nearby supports and help weak-stemmed plants climb upward. This gives leaves better access to light without requiring a thick supporting stem.",
    [
      "PLANT-TENDRIL"
    ]
  ],
  [
    3,
    "Hard",
    "A plant has spines instead of broad leaves, while its green stem performs photosynthesis. This combination is best suited for:",
    "Reducing water loss in dry conditions",
    [
      "Increasing water loss in humid forests",
      "Growing only in waterlogged soil",
      "Producing food without chlorophyll"
    ],
    "Reducing leaves to spines lowers transpiration, while the green stem retains photosynthetic ability. This is a common adaptation of plants in dry habitats.",
    [
      "PLANT-XEROPHYTE-ADAPTATION"
    ]
  ],
  [
    4,
    "Easy",
    "Which vascular tissue mainly transports water and minerals from roots to other parts of a plant?",
    "Xylem",
    [
      "Phloem",
      "Epidermis",
      "Cambium only"
    ],
    "Xylem conducts water and dissolved mineral salts mainly upward from the roots. Its vessels and tracheids form the main water-conducting pathway.",
    [
      "XYLEM-WATER"
    ]
  ],
  [
    4,
    "Easy",
    "Food prepared in leaves is transported to other plant parts mainly through:",
    "Phloem",
    [
      "Xylem",
      "Root cap",
      "Guard cells"
    ],
    "Phloem transports sugars and other organic food materials from source tissues, especially leaves, to growing or storage parts of the plant.",
    [
      "PHLOEM-FOOD"
    ]
  ],
  [
    4,
    "Medium",
    "The upward movement of water through xylem is strongly aided by:",
    "Transpiration pull",
    [
      "Pollen germination",
      "Fruit ripening",
      "Seed dormancy"
    ],
    "Evaporation of water from leaves creates a pulling force in the continuous water column of xylem. This transpiration pull helps move water upward.",
    [
      "XYLEM-TRANSPIRATION-PULL"
    ]
  ],
  [
    4,
    "Medium",
    "Why can food move both upward and downward through phloem?",
    "It moves from sources to whichever tissues need or store it",
    [
      "Phloem works only when xylem is absent",
      "Sugar always moves toward gravity",
      "Guard cells pump food in both directions"
    ],
    "Phloem translocation depends on the location of sources and sinks. Sugars may therefore move upward or downward depending on where they are produced and where they are needed.",
    [
      "PHLOEM-BIDIRECTIONAL"
    ]
  ],
  [
    4,
    "Medium",
    "Which cells are directly involved in the transport of food through phloem in flowering plants?",
    "Sieve tubes",
    [
      "Root hairs",
      "Guard cells",
      "Xylem vessels"
    ],
    "Sieve tube elements form the main conducting channels of phloem in flowering plants. They transport dissolved sugars and other organic substances.",
    [
      "PHLOEM-SIEVE-TUBES"
    ]
  ],
  [
    4,
    "Hard",
    "A ring of bark containing phloem is removed from a tree trunk without damaging the xylem. What is most likely to happen first?",
    "Food transport from leaves to roots is disrupted",
    [
      "Water transport from roots stops immediately",
      "Photosynthesis stops in all leaves at once",
      "Root hairs disappear immediately"
    ],
    "Removing a ring of bark interrupts phloem while leaving inner xylem largely intact. Sugars made in leaves cannot move normally to tissues below the removed ring.",
    [
      "PHLOEM-GIRDLING"
    ]
  ],
  [
    5,
    "Easy",
    "Tiny pores on the surface of leaves that allow gas exchange are called:",
    "Stomata",
    [
      "Lenticels only",
      "Root hairs",
      "Sieve plates"
    ],
    "Stomata are microscopic pores in the epidermis of leaves and some young stems. They allow carbon dioxide, oxygen and water vapour to move between the plant and the air.",
    [
      "STOMATA-PORES"
    ]
  ],
  [
    5,
    "Easy",
    "The opening and closing of stomata is controlled by:",
    "Guard cells",
    [
      "Root cap cells",
      "Xylem vessels",
      "Pollen grains"
    ],
    "Each stoma is surrounded by guard cells. Changes in their turgidity regulate the opening and closing of the stomatal pore.",
    [
      "GUARD-CELLS"
    ]
  ],
  [
    5,
    "Medium",
    "Loss of water vapour from the aerial parts of a plant is called:",
    "Transpiration",
    [
      "Translocation",
      "Respiration",
      "Germination"
    ],
    "Transpiration is the loss of water in the form of vapour, mainly through stomata in leaves. A smaller amount may also be lost through other aerial surfaces.",
    [
      "TRANSPIRATION-DEFINITION"
    ]
  ],
  [
    5,
    "Medium",
    "One important benefit of transpiration to a plant is that it:",
    "Helps cool leaves and supports upward water movement",
    [
      "Stops all mineral absorption",
      "Prevents any gas exchange",
      "Converts sugars directly into proteins"
    ],
    "Evaporation of water cools the leaf surface, and the resulting transpiration pull helps draw water and minerals upward through xylem.",
    [
      "TRANSPIRATION-BENEFIT"
    ]
  ],
  [
    5,
    "Medium",
    "During severe water shortage, many plants reduce water loss by:",
    "Closing their stomata",
    [
      "Opening all stomata wider",
      "Removing their xylem vessels",
      "Stopping root growth permanently"
    ],
    "Closing stomata reduces the escape of water vapour from leaves. This helps conserve water during drought or temporary water stress.",
    [
      "STOMATA-DROUGHT"
    ]
  ],
  [
    5,
    "Hard",
    "On which day would a well-watered plant generally lose water fastest by transpiration?",
    "A warm, dry and windy day",
    [
      "A cool, humid and still day",
      "A cool, saturated and still night",
      "A cold day with very high humidity"
    ],
    "High temperature increases evaporation, low humidity maintains a steep water-vapour gradient, and wind removes moist air around leaves. Together these conditions increase transpiration.",
    [
      "TRANSPIRATION-FACTORS"
    ]
  ]
] as const;
