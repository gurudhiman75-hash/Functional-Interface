import type { KnowledgeV1Difficulty } from "../../types";

export type SciCp020ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];

export const PART_1: readonly SciCp020ReviewSpec[] = [
  [
    1,
    "Easy",
    "Which meristem is responsible for increase in the length of a root or shoot?",
    "Apical meristem",
    [
      "Lateral meristem",
      "Cork cambium",
      "Permanent tissue"
    ],
    "Apical meristems occur near root and shoot tips. Their actively dividing cells increase the length of the plant body. This primary growth lengthens young stems and roots as new cells are produced.",
    [
      "PLANT-MERISTEM-APICAL"
    ]
  ],
  [
    1,
    "Easy",
    "Which plant tissue is made of thick-walled dead cells and provides mechanical strength?",
    "Sclerenchyma",
    [
      "Parenchyma",
      "Collenchyma",
      "Meristem"
    ],
    "Sclerenchyma cells usually have thick, lignified walls and are dead at maturity. They provide strong mechanical support to plant parts.",
    [
      "PLANT-TISSUE-SCLERENCHYMA"
    ]
  ],
  [
    1,
    "Medium",
    "Parenchyma tissue commonly performs which function in plants?",
    "Storage of food and water",
    [
      "Long-distance transport of sugars only",
      "Formation of pollen grains",
      "Opening and closing of stomata"
    ],
    "Parenchyma is a simple living tissue that often stores food and water. In green parts, parenchyma containing chloroplasts can also carry out photosynthesis.",
    [
      "PLANT-TISSUE-PARENCHYMA"
    ]
  ],
  [
    1,
    "Medium",
    "Which tissue gives flexible support to young stems and leaf stalks?",
    "Collenchyma",
    [
      "Sclerenchyma",
      "Xylem vessel",
      "Phloem fibre only"
    ],
    "Collenchyma cells have unevenly thickened walls and provide support without making young plant parts rigid. This allows bending without breaking.",
    [
      "PLANT-TISSUE-COLLENCHYMA"
    ]
  ],
  [
    1,
    "Medium",
    "Increase in the girth of a woody stem is due to the activity of:",
    "Lateral meristem",
    [
      "Apical meristem",
      "Root cap",
      "Epidermis"
    ],
    "Lateral meristems such as cambium produce new tissues toward the sides. Their activity causes secondary growth and increases stem or root thickness.",
    [
      "PLANT-MERISTEM-LATERAL"
    ]
  ],
  [
    1,
    "Hard",
    "If the apical meristem at the tip of a young shoot is removed, which effect is most immediate?",
    "Further increase in shoot length is reduced",
    [
      "Water transport through xylem stops completely",
      "All leaves lose chlorophyll at once",
      "The stem can no longer increase in thickness"
    ],
    "The shoot tip contains apical meristem, which drives primary growth in length. Removing it directly reduces further elongation of that shoot.",
    [
      "PLANT-APICAL-REMOVAL"
    ]
  ],
  [
    2,
    "Easy",
    "Which part of a root absorbs most of the water and mineral salts from the soil?",
    "Root hairs",
    [
      "Root cap",
      "Root tip meristem",
      "Lateral root base"
    ],
    "Root hairs greatly increase the absorbing surface of roots. Water and dissolved mineral salts enter through these thin extensions of root epidermal cells.",
    [
      "ROOT-HAIRS-ABSORPTION"
    ]
  ],
  [
    2,
    "Easy",
    "Which type of root system is commonly found in wheat and grasses?",
    "Fibrous root system",
    [
      "Tap root system",
      "Prop root system",
      "Storage tap root only"
    ],
    "Grasses such as wheat usually have many roots of similar size arising from the base of the stem. This is a fibrous root system.",
    [
      "ROOT-FIBROUS"
    ]
  ],
  [
    2,
    "Medium",
    "The main root of a mustard plant with smaller side branches is an example of a:",
    "Tap root system",
    [
      "Fibrous root system",
      "Adventitious prop root system",
      "Pneumatophore system"
    ],
    "In a tap root system, one main primary root grows downward and gives rise to smaller lateral roots. Mustard is a common example.",
    [
      "ROOT-TAP"
    ]
  ],
  [
    2,
    "Medium",
    "Prop roots in a banyan tree help in:",
    "Supporting heavy spreading branches",
    [
      "Carrying out pollination",
      "Producing flowers underground",
      "Reducing seed germination"
    ],
    "Banyan branches produce adventitious roots that grow down into the soil. These prop roots act like supporting pillars for the wide branches.",
    [
      "ROOT-PROP-BANYAN"
    ]
  ],
  [
    2,
    "Medium",
    "Carrot stores reserve food in its modified:",
    "Root",
    [
      "Leaf",
      "Flower",
      "Fruit wall"
    ],
    "The carrot is a modified storage tap root. It becomes swollen because reserve food accumulates in the root. The swollen root stores carbohydrates that the plant can use later.",
    [
      "ROOT-STORAGE-CARROT"
    ]
  ],
  [
    2,
    "Hard",
    "A plant growing in waterlogged soil develops roots that grow upward above the soil surface. These roots help the plant to:",
    "Obtain oxygen for respiration",
    [
      "Absorb more sunlight for photosynthesis",
      "Transport sugars from leaves",
      "Increase pollination by insects"
    ],
    "Waterlogged soil contains little air. Upward-growing breathing roots, or pneumatophores, expose air passages to the atmosphere and help roots obtain oxygen.",
    [
      "ROOT-PNEUMATOPHORE"
    ]
  ],
  [
    3,
    "Easy",
    "Which plant organ is the main site of photosynthesis in most plants?",
    "Leaf",
    [
      "Root cap",
      "Flower",
      "Seed coat"
    ],
    "Leaves contain many chloroplasts and are usually broad and exposed to light. They are therefore the main photosynthetic organs of most plants.",
    [
      "LEAF-PHOTOSYNTHESIS"
    ]
  ],
  [
    3,
    "Easy",
    "The primary function of a stem is to:",
    "Support aerial parts and conduct materials",
    [
      "Absorb most soil water through root hairs",
      "Produce gametes only",
      "Carry out seed germination"
    ],
    "The stem supports leaves, flowers and fruits. Its vascular tissues also conduct water, minerals and food between roots and other plant parts.",
    [
      "STEM-FUNCTION"
    ]
  ],
  [
    3,
    "Medium",
    "Potato is regarded as a modified stem because it bears:",
    "Buds or eyes",
    [
      "Root hairs",
      "Stomata only on roots",
      "A seed coat"
    ],
    "The 'eyes' of a potato are buds capable of producing new shoots. Their presence shows that the potato tuber is a modified underground stem.",
    [
      "STEM-POTATO-TUBER"
    ]
  ]
] as const;
