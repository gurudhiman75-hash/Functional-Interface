import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp021ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_3: readonly SciCp021ReviewSpec[] = [
  [
    6,
    "Easy",
    "Most chemical digestion is completed in the:",
    "Small intestine",
    [
      "Mouth",
      "Oesophagus",
      "Large intestine"
    ],
    "The small intestine receives bile, pancreatic juice and intestinal secretions, so most digestion is completed there.",
    [
      "SMALL-INTESTINE-DIGESTION"
    ]
  ],
  [
    6,
    "Easy",
    "The first part of the small intestine receives bile and pancreatic juice. It is called the:",
    "Duodenum",
    [
      "Rectum",
      "Colon",
      "Oesophagus"
    ],
    "The duodenum is the first part of the small intestine and receives secretions from the liver/gallbladder and pancreas.",
    [
      "DUODENUM-SECRETIONS"
    ]
  ],
  [
    6,
    "Medium",
    "Proteins are ultimately digested into:",
    "Amino acids",
    [
      "Fatty acids",
      "Glucose only",
      "Glycerol"
    ],
    "Digestive proteases break proteins into smaller peptides and finally amino acids, which can be absorbed.",
    [
      "PROTEIN-END-PRODUCT"
    ]
  ],
  [
    6,
    "Medium",
    "Fats are mainly digested into:",
    "Fatty acids and glycerol",
    [
      "Amino acids",
      "Glucose and fructose only",
      "Starch and glycogen"
    ],
    "Lipases digest fats into fatty acids and glycerol, which can then be absorbed through the intestinal lining.",
    [
      "FAT-END-PRODUCT"
    ]
  ],
  [
    6,
    "Medium",
    "Carbohydrates are finally converted mainly into:",
    "Simple sugars such as glucose",
    [
      "Amino acids",
      "Fatty acids only",
      "Mineral salts"
    ],
    "Digestive enzymes break complex carbohydrates into simple sugars, especially glucose, for absorption and use by cells.",
    [
      "CARBOHYDRATE-END-PRODUCT"
    ]
  ],
  [
    6,
    "Hard",
    "Why is the small intestine well suited for completing digestion?",
    "It receives several digestive secretions and provides a suitable medium for enzymes",
    [
      "It stores faeces for a long time",
      "It produces hydrochloric acid as its main secretion",
      "It has no contact with bile or pancreatic juice"
    ],
    "The small intestine receives bile, pancreatic enzymes and intestinal secretions. Its conditions support the final digestion of carbohydrates, proteins and fats.",
    [
      "SMALL-INTESTINE-COMPLETE-DIGESTION"
    ]
  ],
  [
    7,
    "Easy",
    "Most absorption of digested food occurs in the:",
    "Small intestine",
    [
      "Stomach",
      "Large intestine",
      "Oesophagus"
    ],
    "The small intestine is the main site where digested nutrients cross the intestinal wall and enter blood or lymph.",
    [
      "ABSORPTION-SMALL-INTESTINE"
    ]
  ],
  [
    7,
    "Easy",
    "Finger-like projections in the small intestine that increase absorptive surface area are called:",
    "Villi",
    [
      "Alveoli",
      "Nephrons",
      "Cilia"
    ],
    "Villi greatly increase the inner surface area of the small intestine, allowing efficient absorption of digested nutrients.",
    [
      "VILLI-SURFACE-AREA"
    ]
  ],
  [
    7,
    "Medium",
    "Glucose and amino acids absorbed from intestinal villi enter mainly into:",
    "Blood capillaries",
    [
      "The stomach cavity",
      "Salivary ducts",
      "The large intestine"
    ],
    "Villi contain a rich network of blood capillaries. Glucose and amino acids pass into these capillaries after absorption.",
    [
      "VILLI-BLOOD-CAPILLARIES"
    ]
  ],
  [
    7,
    "Medium",
    "Absorbed fats from the small intestine enter mainly into:",
    "Lacteals in the villi",
    [
      "Salivary glands",
      "Gastric pits",
      "Root-like hairs"
    ],
    "Each villus contains a lymph vessel called a lacteal. Much of the absorbed fat enters these lacteals before reaching the bloodstream.",
    [
      "VILLI-LACTEALS"
    ]
  ],
  [
    7,
    "Medium",
    "Assimilation refers to the process by which absorbed nutrients are:",
    "Used by body cells for energy, growth or repair",
    [
      "Chewed into smaller pieces",
      "Moved through the oesophagus",
      "Removed as faeces"
    ],
    "After absorption, nutrients are transported to tissues and used for energy, growth, repair or storage. This use is called assimilation.",
    [
      "ASSIMILATION-DEFINITION"
    ]
  ],
  [
    7,
    "Hard",
    "If the villi of the small intestine are severely damaged, the most direct effect will be:",
    "Reduced absorption of digested nutrients",
    [
      "Complete failure of chewing",
      "Loss of bile production by the liver",
      "No hydrochloric acid secretion in the stomach"
    ],
    "Damaged or flattened villi reduce the intestinal surface area available for absorption, so fewer digested nutrients enter the body.",
    [
      "VILLI-DAMAGE-ABSORPTION"
    ]
  ],
  [
    8,
    "Easy",
    "The large intestine mainly absorbs:",
    "Water and some salts",
    [
      "Most amino acids",
      "Most glucose",
      "Bile pigments for reuse only"
    ],
    "Much of the remaining water and some salts are absorbed in the large intestine before faeces are formed.",
    [
      "LARGE-INTESTINE-WATER"
    ]
  ],
  [
    8,
    "Easy",
    "Faeces are stored temporarily in the:",
    "Rectum",
    [
      "Stomach",
      "Duodenum",
      "Oesophagus"
    ],
    "The rectum is the terminal storage region of the large intestine where faeces remain before defecation.",
    [
      "RECTUM-STORAGE"
    ]
  ],
  [
    8,
    "Medium",
    "Removal of undigested waste from the body through the anus is called:",
    "Egestion",
    [
      "Ingestion",
      "Absorption",
      "Assimilation"
    ],
    "Egestion is the removal of undigested and unabsorbed material from the alimentary canal. It differs from excretion of metabolic wastes.",
    [
      "EGESTION-DEFINITION"
    ]
  ]
] as const;
