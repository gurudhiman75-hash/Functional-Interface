import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp024ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp024ReviewSpec[] = [
  [
    8,
    "Medium",
    "Urea moves from blood into dialysis fluid because:",
    "Its concentration is higher in the blood",
    [
      "Its concentration is higher in dialysis fluid",
      "Red blood cells pump it across",
      "The membrane blocks all small solutes"
    ],
    "Urea diffuses down its concentration gradient across the semipermeable dialysis membrane.",
    [
      "DIALYSIS-UREA-DIFFUSION"
    ]
  ],
  [
    8,
    "Medium",
    "Which blood component should remain inside the dialysis tubing or blood compartment?",
    "Red blood cells",
    [
      "Urea",
      "Excess salts",
      "Excess water"
    ],
    "The dialysis membrane permits small wastes and water to cross but retains blood cells and large proteins.",
    [
      "DIALYSIS-RBC-RETAINED"
    ]
  ],
  [
    8,
    "Hard",
    "A dialysis membrane suddenly develops pores large enough for plasma proteins to pass through. What problem could result?",
    "Loss of important proteins from the blood",
    [
      "Complete stoppage of urea removal",
      "Immediate production of urine by the machine",
      "Increase in red blood cell formation"
    ],
    "Dialysis membranes must retain large proteins. Oversized pores could allow valuable plasma proteins to escape.",
    [
      "DIALYSIS-LARGE-PORES"
    ]
  ],
  [
    9,
    "Easy",
    "Which waste gas is excreted through the lungs?",
    "Carbon dioxide",
    [
      "Urea",
      "Uric acid",
      "Bile pigment"
    ],
    "The lungs remove carbon dioxide produced during cellular respiration.",
    [
      "LUNGS-CO2-EXCRETION"
    ]
  ],
  [
    9,
    "Easy",
    "Sweat removes water, salts and small amounts of:",
    "Urea",
    [
      "Haemoglobin",
      "Starch",
      "Bile"
    ],
    "Sweat is mostly water and salts but can also contain small quantities of urea.",
    [
      "SWEAT-UREA"
    ]
  ],
  [
    9,
    "Medium",
    "The liver contributes to excretion by converting excess amino-group nitrogen into:",
    "Urea",
    [
      "Glucose only",
      "Haemoglobin",
      "Bile salts only"
    ],
    "The liver converts toxic nitrogenous breakdown products into urea, which is then carried to the kidneys.",
    [
      "LIVER-UREA-FORMATION"
    ]
  ],
  [
    9,
    "Medium",
    "Which organ removes carbon dioxide but does not form urine?",
    "Lungs",
    [
      "Kidneys",
      "Urinary bladder",
      "Ureters"
    ],
    "The lungs excrete carbon dioxide and water vapour, while urine is formed in the kidneys.",
    [
      "LUNGS-NOT-URINE"
    ]
  ],
  [
    9,
    "Medium",
    "The skin assists excretion through:",
    "Sweat glands",
    [
      "Sebaceous glands only",
      "Hair follicles only",
      "Nail beds"
    ],
    "Sweat glands release water, salts and small amounts of metabolic waste onto the skin surface.",
    [
      "SKIN-SWEAT-EXCRETION"
    ]
  ],
  [
    9,
    "Hard",
    "Which sequence correctly traces nitrogen waste from protein breakdown to its removal from the body?",
    "Amino acid breakdown → Liver forms urea → Blood carries urea → Kidneys excrete it",
    [
      "Kidneys form urea → Liver stores it → Lungs excrete it",
      "Stomach forms urea → Blood carries it → Skin stores it",
      "Liver forms glucose → Kidneys convert it to urea → Lungs remove it"
    ],
    "The liver converts nitrogenous waste from amino acid metabolism into urea, which travels in blood to the kidneys and leaves in urine.",
    [
      "NITROGEN-WASTE-PATH"
    ]
  ],
  [
    10,
    "Easy",
    "Which blood vessel carries filtered blood away from a kidney?",
    "Renal vein",
    [
      "Renal artery",
      "Ureter",
      "Urethra"
    ],
    "The renal vein carries blood away from the kidney after filtration and regulation have occurred.",
    [
      "RENAL-VEIN"
    ]
  ],
  [
    10,
    "Medium",
    "Why is the glucose concentration of renal-artery blood normally higher than that of urine?",
    "Most filtered glucose is reabsorbed",
    [
      "The bladder destroys glucose",
      "The ureter adds glucose to blood",
      "Glucose cannot enter the kidney"
    ],
    "Although glucose is filtered, healthy nephrons reabsorb nearly all of it back into blood.",
    [
      "RENAL-GLUCOSE-REASONING"
    ]
  ],
  [
    10,
    "Medium",
    "A person produces a very large volume of dilute urine. Which process may be reduced?",
    "Water reabsorption",
    [
      "Glomerular filtration of water",
      "Blood flow to the kidneys",
      "Urea formation in the liver"
    ],
    "If less water is reabsorbed from the nephron, more water remains in urine, increasing its volume and lowering concentration.",
    [
      "POLYURIA-REABSORPTION"
    ]
  ],
  [
    10,
    "Medium",
    "If glomerular filtration stops completely in both kidneys, which immediate consequence follows?",
    "Wastes remain in the blood instead of entering filtrate",
    [
      "The bladder fills faster",
      "More glucose is reabsorbed",
      "More urine reaches the ureters"
    ],
    "Without filtration, small wastes such as urea cannot enter the nephron filtrate and begin the urine-forming process.",
    [
      "NO-FILTRATION-WASTES"
    ]
  ],
  [
    10,
    "Hard",
    "A substance is small enough to be filtered, useful to the body and nearly absent from final urine. Which process best explains this?",
    "Selective reabsorption",
    [
      "Blood clotting",
      "Ventilation",
      "Peristalsis"
    ],
    "Useful small molecules may enter the filtrate but are later returned to the blood through selective reabsorption.",
    [
      "FILTERED-THEN-REABSORBED"
    ]
  ],
  [
    10,
    "Hard",
    "Blood enters the kidney containing urea and leaves with less urea, while urine contains urea. What conclusion follows?",
    "The kidney removes some urea from the blood and transfers it to urine",
    [
      "The kidney produces all urea from glucose",
      "The bladder removes urea from blood",
      "The renal vein carries urine"
    ],
    "The difference in urea concentration shows that the kidney removes part of the urea load from blood and excretes it in urine.",
    [
      "UREA-RENAL-BALANCE"
    ]
  ]
] as const;
