import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp028ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp028ReviewSpec[] = [
  [
    8,
    "Medium",
    "Why does sweating increase the need to replace water?",
    "Water is lost from the body in sweat",
    [
      "Sweat contains no water",
      "Sweating prevents kidney filtration",
      "Water cannot be absorbed by the intestine"
    ],
    "Sweat is largely water, so heavy sweating increases body-water loss.",
    [
      "SWEATING-WATER-LOSS"
    ]
  ],
  [
    8,
    "Medium",
    "Which statement about water is correct?",
    "It is essential even though it supplies no calories",
    [
      "It is a fat-soluble vitamin",
      "It is the body's chief protein",
      "It can be omitted from a balanced diet"
    ],
    "Water does not provide energy, but it is indispensable for normal physiology.",
    [
      "WATER-NO-CALORIES"
    ]
  ],
  [
    8,
    "Hard",
    "A person eats a nutrient-rich diet but loses large amounts of fluid through diarrhoea. Which immediate nutritional concern is greatest?",
    "Loss of water and electrolytes",
    [
      "Vitamin A toxicity",
      "Excess dietary fibre",
      "Excess protein storage"
    ],
    "Rapid fluid and salt loss can disturb circulation and cellular function even when food intake is otherwise adequate.",
    [
      "DIARRHOEA-WATER-ELECTROLYTES"
    ]
  ],
  [
    9,
    "Easy",
    "Citrus fruits are well-known sources of:",
    "Vitamin C",
    [
      "Vitamin D",
      "Vitamin B12 only",
      "Iodine"
    ],
    "Citrus fruits such as oranges and lemons are common dietary sources of vitamin C.",
    [
      "CITRUS-VITAMIN-C"
    ]
  ],
  [
    9,
    "Medium",
    "Which food is a rich source of protein?",
    "Pulses",
    [
      "Refined sugar",
      "Cooking salt",
      "Water"
    ],
    "Pulses are important plant sources of protein.",
    [
      "PULSES-PROTEIN"
    ]
  ],
  [
    9,
    "Medium",
    "Which food group is a common dietary source of calcium?",
    "Milk and dairy products",
    [
      "Refined sugar",
      "Vegetable oil only",
      "Table salt only"
    ],
    "Milk and dairy products are common sources of calcium.",
    [
      "DAIRY-CALCIUM"
    ]
  ],
  [
    9,
    "Medium",
    "Which food choice would best help increase dietary iron?",
    "Green leafy vegetables and pulses",
    [
      "Refined sugar and oil",
      "Plain water only",
      "Starch alone"
    ],
    "Green leafy vegetables and pulses can contribute useful dietary iron.",
    [
      "FOOD-SOURCES-IRON"
    ]
  ],
  [
    9,
    "Hard",
    "A vegetarian diet is very low in dairy foods. Which combination can help improve calcium intake?",
    "Calcium-rich greens, fortified foods and suitable pulses or seeds",
    [
      "Only sugar and refined flour",
      "Only cooking oil",
      "Only salt and water"
    ],
    "Calcium can be obtained from several non-dairy sources, including certain greens, fortified foods, pulses and seeds.",
    [
      "NONDAIRY-CALCIUM"
    ]
  ],
  [
    9,
    "Hard",
    "A person with iron deficiency eats plant-based iron sources. Which accompanying food can improve iron absorption?",
    "A vitamin-C-rich food",
    [
      "A large amount of refined sugar",
      "Only saturated fat",
      "An iodine tablet"
    ],
    "Vitamin C can improve absorption of non-haem iron from plant foods.",
    [
      "VITAMIN-C-IRON-ABSORPTION"
    ]
  ],
  [
    10,
    "Easy",
    "Which pair is correctly matched?",
    "Vitamin A — night blindness",
    [
      "Vitamin C — rickets",
      "Vitamin D — scurvy",
      "Iron — goitre"
    ],
    "Vitamin A deficiency is classically associated with night blindness.",
    [
      "MATCH-A-NIGHT-BLINDNESS"
    ]
  ],
  [
    10,
    "Medium",
    "A child eats enough calories but has poor growth because the diet is extremely low in protein. Which nutritional problem is most relevant?",
    "Protein malnutrition",
    [
      "Vitamin C excess",
      "Water intoxication",
      "Iodine excess"
    ],
    "Adequate energy cannot substitute for protein needed for tissue growth and repair.",
    [
      "PROTEIN-MALNUTRITION-INTEGRATED"
    ]
  ],
  [
    10,
    "Medium",
    "A person has both night blindness and poor dietary intake of colourful vegetables and dairy products. Which nutrient should be considered first?",
    "Vitamin A",
    [
      "Vitamin K",
      "Iodine",
      "Iron"
    ],
    "The symptom and diet pattern both point toward inadequate vitamin A.",
    [
      "VITAMIN-A-DIET-REASONING"
    ]
  ],
  [
    10,
    "Medium",
    "Why is variety important in a balanced diet?",
    "Different foods supply different nutrients",
    [
      "One food contains every nutrient in perfect proportion",
      "Variety eliminates the need for water",
      "Only vitamins require varied foods"
    ],
    "No single common food supplies all nutrients in ideal amounts, so dietary variety improves nutrient adequacy.",
    [
      "DIET-VARIETY"
    ]
  ],
  [
    10,
    "Hard",
    "A child has bowed legs but normal haemoglobin and no bleeding gums. Which deficiency is the best fit?",
    "Vitamin D deficiency",
    [
      "Iron deficiency",
      "Vitamin C deficiency",
      "Vitamin A deficiency"
    ],
    "Bowed legs in a growing child are typical of rickets due to impaired bone mineralization from vitamin D deficiency.",
    [
      "DEFICIENCY-DISCRIMINATION-RICKETS"
    ]
  ],
  [
    10,
    "Hard",
    "A person has fatigue, pallor and low haemoglobin but normal vision, normal thyroid size and healthy gums. Which deficiency best explains the pattern?",
    "Iron deficiency",
    [
      "Vitamin A deficiency",
      "Iodine deficiency",
      "Vitamin C deficiency"
    ],
    "The combination of pallor, fatigue and low haemoglobin strongly matches iron-deficiency anaemia.",
    [
      "DEFICIENCY-DISCRIMINATION-IRON"
    ]
  ]
] as const;
