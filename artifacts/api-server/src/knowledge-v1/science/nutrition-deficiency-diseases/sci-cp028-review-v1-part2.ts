import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp028ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp028ReviewSpec[] = [
  [
    3,
    "Medium",
    "Vitamin A is important for normal:",
    "Vision and epithelial health",
    [
      "Blood glucose control only",
      "Urine formation only",
      "Hearing only"
    ],
    "Vitamin A supports vision, especially in dim light, and helps maintain epithelial tissues.",
    [
      "VITAMIN-A-ROLE"
    ]
  ],
  [
    3,
    "Medium",
    "Vitamin C is important for:",
    "Healthy connective tissue and wound healing",
    [
      "Producing insulin",
      "Carrying oxygen in haemoglobin",
      "Forming thyroid hormone"
    ],
    "Vitamin C supports collagen formation and normal wound healing.",
    [
      "VITAMIN-C-ROLE"
    ]
  ],
  [
    3,
    "Hard",
    "Why can deficiency of a water-soluble vitamin develop relatively quickly when intake is poor?",
    "Many water-soluble vitamins are not stored extensively in the body",
    [
      "They cannot enter the blood",
      "They are destroyed by all digestion",
      "They provide no biological function"
    ],
    "Because body stores of many water-soluble vitamins are limited, regular dietary intake is important.",
    [
      "WATER-SOLUBLE-STORAGE"
    ]
  ],
  [
    4,
    "Easy",
    "Night blindness is commonly linked with deficiency of:",
    "Vitamin A",
    [
      "Vitamin C",
      "Vitamin D",
      "Vitamin K"
    ],
    "Vitamin A is needed for normal visual function, and deficiency can impair vision in dim light.",
    [
      "VITAMIN-A-NIGHT-BLINDNESS"
    ]
  ],
  [
    4,
    "Easy",
    "Scurvy is caused by deficiency of:",
    "Vitamin C",
    [
      "Vitamin A",
      "Vitamin D",
      "Vitamin B12"
    ],
    "Severe vitamin C deficiency causes scurvy, with features such as bleeding gums and poor wound healing.",
    [
      "VITAMIN-C-SCURVY"
    ]
  ],
  [
    4,
    "Medium",
    "Rickets in children is commonly associated with deficiency of:",
    "Vitamin D",
    [
      "Vitamin C",
      "Vitamin K",
      "Vitamin B1"
    ],
    "Vitamin D deficiency reduces calcium absorption and can impair mineralization of growing bones, causing rickets.",
    [
      "VITAMIN-D-RICKETS"
    ]
  ],
  [
    4,
    "Medium",
    "Deficiency of vitamin K most directly affects:",
    "Blood clotting",
    [
      "Night vision",
      "Thyroid hormone synthesis",
      "Glucose absorption"
    ],
    "Vitamin K is required for normal synthesis of several clotting factors.",
    [
      "VITAMIN-K-CLOTTING"
    ]
  ],
  [
    4,
    "Medium",
    "Beriberi is classically linked with deficiency of:",
    "Vitamin B1 (thiamine)",
    [
      "Vitamin A",
      "Vitamin C",
      "Vitamin D"
    ],
    "Thiamine deficiency can cause beriberi, affecting nerves, muscles and the cardiovascular system.",
    [
      "B1-BERIBERI"
    ]
  ],
  [
    4,
    "Hard",
    "A child has bowed legs and poor bone mineralization despite adequate calorie intake. Which deficiency fits best?",
    "Vitamin D deficiency",
    [
      "Vitamin C excess",
      "Vitamin K excess",
      "Vitamin A excess"
    ],
    "Vitamin D deficiency in children can impair calcium absorption and bone mineralization, producing rickets.",
    [
      "RICKETS-REASONING"
    ]
  ],
  [
    5,
    "Easy",
    "Iron is required for formation of:",
    "Haemoglobin",
    [
      "Insulin",
      "Bile",
      "Thyroxine only"
    ],
    "Iron is an essential component of haemoglobin in red blood cells.",
    [
      "IRON-HAEMOGLOBIN"
    ]
  ],
  [
    5,
    "Easy",
    "Iodine is needed for synthesis of:",
    "Thyroid hormones",
    [
      "Insulin",
      "Adrenaline only",
      "Haemoglobin"
    ],
    "Iodine is required to make thyroid hormones such as thyroxine.",
    [
      "IODINE-THYROID-HORMONES"
    ]
  ],
  [
    5,
    "Medium",
    "Iron deficiency commonly causes:",
    "Anaemia",
    [
      "Goitre",
      "Rickets",
      "Scurvy"
    ],
    "Iron deficiency reduces haemoglobin formation and can lead to iron-deficiency anaemia.",
    [
      "IRON-ANAEMIA"
    ]
  ],
  [
    5,
    "Medium",
    "Iodine deficiency can lead to enlargement of the:",
    "Thyroid gland",
    [
      "Pancreas",
      "Pituitary gland",
      "Adrenal gland"
    ],
    "Low iodine intake can cause goitre, an enlargement of the thyroid gland.",
    [
      "NUTRITION-IODINE-GOITRE"
    ]
  ],
  [
    5,
    "Medium",
    "Calcium is especially important for:",
    "Bones and teeth",
    [
      "Formation of bile pigments only",
      "Night vision only",
      "Carrying carbon dioxide only"
    ],
    "Calcium is a major mineral of bones and teeth and also supports muscle and nerve function.",
    [
      "CALCIUM-BONES"
    ]
  ],
  [
    5,
    "Hard",
    "A person is tired, pale and has low haemoglobin despite adequate calorie intake. Which dietary deficiency is most likely?",
    "Iron deficiency",
    [
      "Iodine deficiency",
      "Vitamin A deficiency",
      "Calcium excess"
    ],
    "Low haemoglobin with pallor and fatigue strongly suggests inadequate iron when other causes are not considered.",
    [
      "IRON-ANAEMIA-REASONING"
    ]
  ]
] as const;
