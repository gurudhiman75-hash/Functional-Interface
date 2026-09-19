import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp027ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp027ReviewSpec[] = [
  [
    3,
    "Medium",
    "Why do gametes contain half the normal chromosome number?",
    "Fertilization restores the diploid chromosome number",
    [
      "Gametes never divide",
      "Body cells contain only one chromosome set",
      "Half the chromosomes are lost after birth"
    ],
    "Each gamete contributes one chromosome set, so their fusion restores the normal diploid number.",
    [
      "GAMETE-HAPLOID-REASON"
    ]
  ],
  [
    3,
    "Medium",
    "Sperm cells are adapted for movement by having a:",
    "Flagellum or tail",
    [
      "Large food-filled vacuole",
      "Thick cellulose wall",
      "Chloroplast"
    ],
    "The sperm tail provides movement and helps the cell travel through the female reproductive tract.",
    [
      "SPERM-FLAGELLUM"
    ]
  ],
  [
    3,
    "Hard",
    "A human sperm carrying 23 chromosomes fuses with an ovum carrying 23 chromosomes. The resulting zygote contains:",
    "46 chromosomes",
    [
      "23 chromosomes",
      "69 chromosomes",
      "92 chromosomes"
    ],
    "Fertilization combines two haploid gametes, restoring the diploid human chromosome number of 46.",
    [
      "ZYGOTE-46-CHROMOSOMES"
    ]
  ],
  [
    4,
    "Easy",
    "Release of an ovum from an ovary is called:",
    "Ovulation",
    [
      "Implantation",
      "Fertilization",
      "Menstruation"
    ],
    "Ovulation is the release of a mature ovum from an ovary.",
    [
      "OVULATION-DEFINITION"
    ]
  ],
  [
    4,
    "Easy",
    "Menstruation involves shedding of the:",
    "Uterine lining",
    [
      "Ovary",
      "Fallopian tube",
      "Cervix only"
    ],
    "When pregnancy does not occur, part of the thickened endometrium is shed during menstruation.",
    [
      "MENSTRUATION-ENDOMETRIUM"
    ]
  ],
  [
    4,
    "Medium",
    "Why does the uterine lining thicken during the menstrual cycle?",
    "To prepare for possible implantation",
    [
      "To produce sperm",
      "To digest the ovum",
      "To form urine"
    ],
    "The endometrium becomes thicker and more vascular so it can support an implanted embryo.",
    [
      "ENDOMETRIUM-THICKENING"
    ]
  ],
  [
    4,
    "Medium",
    "If fertilization does not occur, hormone levels fall and the endometrium is usually:",
    "Shed during menstruation",
    [
      "Converted into an ovum",
      "Moved into the ovary",
      "Stored permanently"
    ],
    "Falling ovarian hormone levels lead to breakdown and shedding of the endometrium.",
    [
      "NO-FERTILIZATION-MENSTRUATION"
    ]
  ],
  [
    4,
    "Medium",
    "Which event normally occurs before menstruation in a typical cycle?",
    "Ovulation",
    [
      "Implantation in every cycle",
      "Birth",
      "Lactation"
    ],
    "Ovulation occurs earlier in the cycle; if pregnancy does not follow, menstruation occurs later.",
    [
      "OVULATION-BEFORE-MENSTRUATION"
    ]
  ],
  [
    4,
    "Hard",
    "A cycle occurs without ovulation. Which event cannot follow in the normal way during that cycle?",
    "Fertilization of an ovum",
    [
      "Thickening of the uterine lining",
      "Hormonal changes",
      "Menstrual bleeding"
    ],
    "Without release of an ovum, there is no egg available for fertilization even though other cycle changes may still occur.",
    [
      "ANOVULATION-FERTILIZATION"
    ]
  ],
  [
    5,
    "Easy",
    "Fertilization in humans usually occurs in the:",
    "Fallopian tube",
    [
      "Uterus",
      "Ovary",
      "Vagina"
    ],
    "The usual site of fertilization is the fallopian tube.",
    [
      "FERTILIZATION-SITE"
    ]
  ],
  [
    5,
    "Easy",
    "The cell formed immediately after fusion of sperm and ovum is the:",
    "Zygote",
    [
      "Embryo",
      "Foetus",
      "Placenta"
    ],
    "Fusion of the two gametes forms a single diploid cell called the zygote.",
    [
      "ZYGOTE-DEFINITION"
    ]
  ],
  [
    5,
    "Medium",
    "After fertilization, the zygote begins repeated cell divisions while moving toward the:",
    "Uterus",
    [
      "Kidney",
      "Ovary for permanent storage",
      "Urinary bladder"
    ],
    "The early conceptus divides as it travels through the fallopian tube toward the uterus.",
    [
      "ZYGOTE-TO-UTERUS"
    ]
  ],
  [
    5,
    "Medium",
    "Attachment of the early embryo to the uterine lining is called:",
    "Implantation",
    [
      "Ovulation",
      "Menstruation",
      "Ejaculation"
    ],
    "Implantation occurs when the developing embryo attaches to and embeds in the endometrium.",
    [
      "IMPLANTATION-DEFINITION"
    ]
  ],
  [
    5,
    "Medium",
    "Why is a thick, well-supplied endometrium useful after fertilization?",
    "It supports implantation and early development",
    [
      "It produces sperm",
      "It prevents any blood flow",
      "It stores urine"
    ],
    "A vascular endometrium provides a suitable site for implantation and supports the early embryo.",
    [
      "ENDOMETRIUM-IMPLANTATION"
    ]
  ],
  [
    5,
    "Hard",
    "Fertilization occurs normally, but the embryo cannot attach to the endometrium. Which stage has failed?",
    "Implantation",
    [
      "Ovulation",
      "Gamete formation",
      "Sperm maturation"
    ],
    "Fertilization can occur before implantation; failure to attach to the uterine lining is specifically an implantation failure.",
    [
      "IMPLANTATION-FAILURE"
    ]
  ]
] as const;
