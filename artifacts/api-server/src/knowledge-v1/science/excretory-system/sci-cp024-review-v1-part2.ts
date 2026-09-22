import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp024ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp024ReviewSpec[] = [
  [
    3,
    "Medium",
    "The long tubular part of a nephron is important because it:",
    "Allows selective reabsorption and secretion",
    [
      "Pumps blood into the aorta",
      "Stores urine for hours",
      "Produces bile"
    ],
    "As filtrate passes through the renal tubule, useful substances and water can be reabsorbed while some wastes are secreted. These processes determine which substances are conserved and which remain in final urine.",
    [
      "NEPHRON-TUBULE-FUNCTION"
    ]
  ],
  [
    3,
    "Medium",
    "Which part carries urine from many nephrons toward the renal pelvis?",
    "Collecting duct",
    [
      "Glomerulus",
      "Bowman's capsule",
      "Renal artery"
    ],
    "Collecting ducts receive fluid from nephrons and carry it toward the renal pelvis. Water reabsorption can continue in the collecting duct under hormonal control.",
    [
      "COLLECTING-DUCT"
    ]
  ],
  [
    3,
    "Hard",
    "A structure contains a glomerulus enclosed by a cup-shaped capsule and continues into a long tubule. It is a:",
    "Nephron",
    [
      "Alveolus",
      "Lymph node",
      "Villus"
    ],
    "A nephron consists of the renal corpuscle, which includes the glomerulus and Bowman's capsule, plus a renal tubule. This complete structure is the kidney's basic urine-forming unit.",
    [
      "NEPHRON-IDENTIFY"
    ]
  ],
  [
    4,
    "Easy",
    "Filtration of blood in a nephron begins at the:",
    "Glomerulus",
    [
      "Ureter",
      "Urinary bladder",
      "Urethra"
    ],
    "Blood filtration starts in the glomerular capillaries, where water and small solutes move into Bowman's capsule. Large cells and most plasma proteins stay in the bloodstream during normal filtration.",
    [
      "FILTRATION-GLOMERULUS"
    ]
  ],
  [
    4,
    "Easy",
    "Which of the following normally passes into the glomerular filtrate?",
    "Water",
    [
      "Red blood cells",
      "Large plasma proteins",
      "Platelets"
    ],
    "Water and small dissolved substances can cross the filtration barrier, while cells and large proteins are normally retained in blood.",
    [
      "FILTRATE-WATER"
    ]
  ],
  [
    4,
    "Medium",
    "Why are red blood cells normally absent from glomerular filtrate?",
    "They are too large to cross the filtration barrier",
    [
      "They are destroyed in the kidney",
      "They are reabsorbed before filtration",
      "They dissolve in plasma"
    ],
    "The filtration barrier allows small molecules through but prevents blood cells from entering the filtrate. Finding many red cells in urine is therefore an abnormal sign.",
    [
      "FILTRATION-RBC-RETAINED"
    ]
  ],
  [
    4,
    "Medium",
    "Glomerular filtration is driven largely by:",
    "Blood pressure in the glomerular capillaries",
    [
      "Contraction of the urinary bladder",
      "Peristalsis of the ureter",
      "Bile pressure"
    ],
    "Relatively high pressure in glomerular capillaries forces water and small solutes across the filtration membrane. The pressure must be sufficient to move fluid across the selective filtration barrier.",
    [
      "FILTRATION-PRESSURE"
    ]
  ],
  [
    4,
    "Medium",
    "Which substance should normally remain in blood rather than enter the filtrate in significant quantity?",
    "Large plasma proteins",
    [
      "Urea",
      "Water",
      "Mineral ions"
    ],
    "Large plasma proteins are generally too large to pass through the healthy glomerular filtration barrier. Their retention also helps maintain the osmotic properties of blood plasma.",
    [
      "FILTRATION-PROTEINS"
    ]
  ],
  [
    4,
    "Hard",
    "If the glomerular filtration barrier becomes abnormally leaky, which substance is most likely to appear in urine?",
    "Protein",
    [
      "Oxygen only",
      "Bile stored in the gallbladder",
      "Salivary amylase"
    ],
    "Damage to the filtration barrier can allow plasma proteins that are normally retained in blood to enter the filtrate and urine.",
    [
      "PROTEINURIA-BARRIER"
    ]
  ],
  [
    5,
    "Easy",
    "Most filtered glucose is normally:",
    "Reabsorbed into the blood",
    [
      "Excreted in urine",
      "Converted into urea in the nephron",
      "Stored in the bladder"
    ],
    "In healthy kidneys, filtered glucose is reabsorbed from the nephron tubule back into blood. Glucose normally disappears from filtrate before final urine is produced.",
    [
      "GLUCOSE-REABSORPTION"
    ]
  ],
  [
    5,
    "Easy",
    "Selective reabsorption means that the kidney:",
    "Takes useful substances back from filtrate into blood",
    [
      "Filters only red blood cells",
      "Stores all wastes in the kidney",
      "Moves urine back into arteries"
    ],
    "Selective reabsorption conserves useful substances such as glucose, amino acids, ions and much of the water. This prevents the body from losing valuable nutrients and excessive water.",
    [
      "SELECTIVE-REABSORPTION"
    ]
  ],
  [
    5,
    "Medium",
    "Why is nearly all filtered glucose reabsorbed in a healthy person?",
    "Glucose is useful as an energy source",
    [
      "Glucose is a waste product",
      "Glucose forms kidney stones",
      "Glucose cannot dissolve in water"
    ],
    "The body normally conserves glucose because cells use it as an important energy source. Losing large amounts of glucose in urine would waste both nutrient and chemical energy.",
    [
      "REABSORB-GLUCOSE-REASON"
    ]
  ],
  [
    5,
    "Medium",
    "Water reabsorption from the nephron helps the body:",
    "Maintain fluid balance",
    [
      "Produce red blood cells directly",
      "Digest proteins",
      "Store carbon dioxide"
    ],
    "Reabsorbing water prevents excessive fluid loss and helps maintain blood volume and internal water balance. The amount reabsorbed changes according to the body's hydration state.",
    [
      "WATER-REABSORPTION"
    ]
  ],
  [
    5,
    "Medium",
    "Tubular secretion helps the kidney by:",
    "Adding certain wastes and excess ions from blood into the tubule",
    [
      "Returning all urea to blood",
      "Producing digestive enzymes",
      "Moving urine into the renal artery"
    ],
    "Tubular secretion transfers selected substances from blood into the nephron tubule and helps regulate ions and remove wastes. It also contributes to acid-base regulation by controlling ions such as hydrogen and potassium.",
    [
      "TUBULAR-SECRETION"
    ]
  ],
  [
    5,
    "Hard",
    "If a useful substance is filtered at the glomerulus but later found only in trace amounts in urine, what most likely happened?",
    "It was reabsorbed from the tubule",
    [
      "It was converted into red blood cells",
      "It entered the urine through the urethra",
      "It was stored in the glomerulus"
    ],
    "A large difference between the amount filtered and the amount excreted usually indicates substantial reabsorption. The substance entered the nephron initially but was conserved before urine left the kidney.",
    [
      "REABSORPTION-REASONING"
    ]
  ]
] as const;
