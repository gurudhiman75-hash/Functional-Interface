import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp028ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp028ReviewSpec[] = [
  [
    1,
    "Easy",
    "A diet that supplies all essential nutrients in suitable amounts is called a:",
    "Balanced diet",
    [
      "Liquid diet",
      "Fasting diet",
      "Protein-only diet"
    ],
    "A balanced diet provides carbohydrates, proteins, fats, vitamins, minerals, water and fibre in appropriate proportions.",
    [
      "BALANCED-DIET"
    ]
  ],
  [
    1,
    "Easy",
    "Which nutrient group is the body's chief immediate source of energy?",
    "Carbohydrates",
    [
      "Vitamins",
      "Minerals",
      "Water"
    ],
    "Carbohydrates are the body's principal quick energy source in a normal diet.",
    [
      "CARBOHYDRATES-ENERGY"
    ]
  ],
  [
    1,
    "Medium",
    "Why can a diet be high in calories but still nutritionally poor?",
    "It may lack essential vitamins, minerals or protein",
    [
      "Calories are never obtained from food",
      "Only water provides energy",
      "A high-calorie diet always contains every nutrient"
    ],
    "Energy intake alone does not guarantee adequate micronutrients, protein or fibre.",
    [
      "CALORIES-NOT-BALANCED"
    ]
  ],
  [
    1,
    "Medium",
    "Which combination best represents the major nutrient groups needed in a balanced diet?",
    "Carbohydrates, proteins, fats, vitamins and minerals",
    [
      "Only proteins and water",
      "Only vitamins and minerals",
      "Only carbohydrates and fats"
    ],
    "A balanced diet includes macronutrients and micronutrients, along with water and dietary fibre.",
    [
      "BALANCED-NUTRIENT-GROUPS"
    ]
  ],
  [
    1,
    "Medium",
    "Which nutrient provides no energy but is still essential for normal body function?",
    "Vitamins",
    [
      "Carbohydrates",
      "Fats",
      "Proteins"
    ],
    "Vitamins do not supply calories but are required in small amounts for normal metabolism and health.",
    [
      "VITAMINS-NO-ENERGY"
    ]
  ],
  [
    1,
    "Hard",
    "A person eats enough total food but almost no fruits, vegetables or varied protein sources. Which problem can still develop?",
    "Micronutrient deficiency",
    [
      "Complete absence of calorie intake",
      "Immediate dehydration in every case",
      "Excess oxygen in blood"
    ],
    "Adequate calories can coexist with vitamin or mineral deficiencies when food variety is poor.",
    [
      "HIDDEN-HUNGER"
    ]
  ],
  [
    2,
    "Easy",
    "Which nutrient is important for growth and repair of body tissues?",
    "Proteins",
    [
      "Carbohydrates only",
      "Vitamin C only",
      "Water only"
    ],
    "Proteins provide amino acids used for growth, repair and formation of many body molecules.",
    [
      "PROTEIN-GROWTH-REPAIR"
    ]
  ],
  [
    2,
    "Easy",
    "Which nutrient provides the most energy per gram?",
    "Fat",
    [
      "Carbohydrate",
      "Protein",
      "Water"
    ],
    "Fat provides about 9 kcal per gram, more than carbohydrate or protein.",
    [
      "FAT-ENERGY-DENSE"
    ]
  ],
  [
    2,
    "Medium",
    "Carbohydrates are broken down to simple sugars that are used to:",
    "Provide energy to cells",
    [
      "Form bile only",
      "Carry oxygen directly",
      "Produce antibodies without protein"
    ],
    "Glucose from carbohydrate digestion is a major fuel for cellular respiration.",
    [
      "CARBOHYDRATE-CELL-ENERGY"
    ]
  ],
  [
    2,
    "Medium",
    "Why are proteins not regarded as the body's preferred everyday energy source?",
    "They are especially needed for structural and functional roles",
    [
      "Proteins contain no energy",
      "Proteins cannot be digested",
      "Proteins are vitamins"
    ],
    "Although proteins can provide energy, their amino acids are especially valuable for growth, repair, enzymes and other functions.",
    [
      "PROTEIN-NOT-PREFERRED-FUEL"
    ]
  ],
  [
    2,
    "Medium",
    "Stored body fat is useful because it serves as:",
    "An energy reserve and insulation",
    [
      "The only source of vitamins",
      "A replacement for water",
      "A direct carrier of oxygen"
    ],
    "Body fat stores energy and also helps insulate and protect organs.",
    [
      "FAT-RESERVE-INSULATION"
    ]
  ],
  [
    2,
    "Hard",
    "A child receives adequate calories from starch but very little protein for months. Which function is most likely affected?",
    "Normal growth and tissue repair",
    [
      "Immediate vision in dim light only",
      "Blood clotting only",
      "Water absorption in the colon only"
    ],
    "Calories alone cannot replace the amino acids needed for normal growth and tissue repair.",
    [
      "LOW-PROTEIN-GROWTH"
    ]
  ],
  [
    3,
    "Easy",
    "Vitamins are required by the body in:",
    "Small amounts",
    [
      "Kilograms per day",
      "The same amount as water",
      "Only during illness"
    ],
    "Vitamins are micronutrients needed in relatively small quantities.",
    [
      "VITAMINS-SMALL-AMOUNTS"
    ]
  ],
  [
    3,
    "Easy",
    "Which vitamins are generally water-soluble?",
    "B-complex and vitamin C",
    [
      "A, D, E and K",
      "A and D only",
      "E and K only"
    ],
    "B-complex vitamins and vitamin C dissolve in water and are grouped as water-soluble vitamins.",
    [
      "WATER-SOLUBLE-VITAMINS"
    ]
  ],
  [
    3,
    "Medium",
    "Which group contains the fat-soluble vitamins?",
    "A, D, E and K",
    [
      "B, C and D",
      "B-complex and C",
      "C and K only"
    ],
    "Vitamins A, D, E and K are fat-soluble and can be stored in body tissues to varying degrees.",
    [
      "FAT-SOLUBLE-VITAMINS"
    ]
  ]
] as const;
