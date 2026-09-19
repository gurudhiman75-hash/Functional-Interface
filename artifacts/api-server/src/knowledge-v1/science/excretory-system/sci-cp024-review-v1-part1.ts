import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp024ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp024ReviewSpec[] = [
  [
    1,
    "Easy",
    "Removal of metabolic wastes from the body is called:",
    "Excretion",
    [
      "Digestion",
      "Absorption",
      "Assimilation"
    ],
    "Excretion is the removal of wastes produced by metabolism, such as urea and carbon dioxide.",
    [
      "EXCRETION-DEFINITION"
    ]
  ],
  [
    1,
    "Easy",
    "Which organ is central to the human urinary system?",
    "Kidney",
    [
      "Liver",
      "Pancreas",
      "Spleen"
    ],
    "The kidneys filter blood, regulate water and salt balance, and form urine.",
    [
      "KIDNEY-MAIN-ORGAN"
    ]
  ],
  [
    1,
    "Medium",
    "Which nitrogenous waste is present in the largest amount in normal human urine?",
    "Urea",
    [
      "Glucose",
      "Haemoglobin",
      "Bile pigment"
    ],
    "Urea is formed from the breakdown of amino acids and is the major nitrogenous waste excreted in human urine.",
    [
      "URINE-UREA"
    ]
  ],
  [
    1,
    "Medium",
    "Why must metabolic wastes be removed from the body?",
    "Their accumulation can disturb normal cell function",
    [
      "They increase oxygen transport",
      "They improve digestion",
      "They produce hormones"
    ],
    "Many metabolic wastes become harmful when they accumulate, so the body must eliminate them to maintain internal balance.",
    [
      "EXCRETION-NEED"
    ]
  ],
  [
    1,
    "Medium",
    "Which process is an example of excretion rather than egestion?",
    "Removal of urea in urine",
    [
      "Removal of undigested food through the anus",
      "Chewing food",
      "Absorption of glucose"
    ],
    "Excretion removes metabolic wastes made by cells. Egestion removes undigested material from the alimentary canal.",
    [
      "EXCRETION-VS-EGESTION"
    ]
  ],
  [
    1,
    "Hard",
    "A substance is produced during protein metabolism, carried in blood and removed by the kidneys. Which substance fits this description?",
    "Urea",
    [
      "Starch",
      "Glycogen",
      "Salivary amylase"
    ],
    "Urea is produced in the liver from nitrogen-containing breakdown products and is transported in blood to the kidneys for excretion.",
    [
      "UREA-PROTEIN-METABOLISM"
    ]
  ],
  [
    2,
    "Easy",
    "Urine travels from each kidney to the urinary bladder through a:",
    "Ureter",
    [
      "Urethra",
      "Nephron",
      "Renal artery"
    ],
    "Each ureter carries urine from a kidney to the urinary bladder.",
    [
      "URETER-FUNCTION"
    ]
  ],
  [
    2,
    "Easy",
    "Urine is stored temporarily in the:",
    "Urinary bladder",
    [
      "Kidney cortex",
      "Ureter",
      "Urethra"
    ],
    "The urinary bladder stores urine until it is expelled from the body.",
    [
      "BLADDER-STORAGE"
    ]
  ],
  [
    2,
    "Medium",
    "Urine leaves the body through the:",
    "Urethra",
    [
      "Ureter",
      "Renal vein",
      "Glomerulus"
    ],
    "The urethra carries urine from the bladder to the outside of the body.",
    [
      "URETHRA-FUNCTION"
    ]
  ],
  [
    2,
    "Medium",
    "Which sequence correctly traces the path of urine after it is formed in a kidney?",
    "Kidney → Ureter → Urinary bladder → Urethra",
    [
      "Kidney → Urethra → Ureter → Bladder",
      "Bladder → Kidney → Ureter → Urethra",
      "Kidney → Renal artery → Bladder → Urethra"
    ],
    "Urine passes from the kidney through a ureter to the bladder and then leaves through the urethra.",
    [
      "URINE-PATH"
    ]
  ],
  [
    2,
    "Medium",
    "The renal artery carries blood:",
    "To the kidney for filtration",
    [
      "From the kidney to the heart",
      "From the bladder to the kidney",
      "From the ureter to the kidney"
    ],
    "The renal artery brings blood containing wastes to the kidney.",
    [
      "RENAL-ARTERY"
    ]
  ],
  [
    2,
    "Hard",
    "If both ureters are blocked while the kidneys still form urine, what is the most direct problem?",
    "Urine cannot reach the bladder normally",
    [
      "Blood cannot enter the kidneys",
      "The bladder cannot contract at all",
      "The liver stops producing urea"
    ],
    "The ureters are the tubes that drain urine from the kidneys into the bladder. Blocking them prevents normal urine flow.",
    [
      "URETER-BLOCKAGE"
    ]
  ],
  [
    3,
    "Easy",
    "The functional unit of the kidney is the:",
    "Nephron",
    [
      "Alveolus",
      "Villus",
      "Neuron"
    ],
    "Each kidney contains many nephrons, which filter blood and process the filtrate to form urine.",
    [
      "NEPHRON-FUNCTIONAL-UNIT"
    ]
  ],
  [
    3,
    "Easy",
    "Which structure of a nephron contains a tuft of capillaries?",
    "Glomerulus",
    [
      "Loop of Henle",
      "Collecting duct",
      "Ureter"
    ],
    "The glomerulus is a knot-like network of capillaries where filtration begins.",
    [
      "GLOMERULUS-CAPILLARIES"
    ]
  ],
  [
    3,
    "Medium",
    "Bowman's capsule surrounds the:",
    "Glomerulus",
    [
      "Ureter",
      "Renal pelvis",
      "Urinary bladder"
    ],
    "Bowman's capsule cups around the glomerulus and receives the filtrate formed from blood.",
    [
      "BOWMANS-CAPSULE"
    ]
  ]
] as const;
