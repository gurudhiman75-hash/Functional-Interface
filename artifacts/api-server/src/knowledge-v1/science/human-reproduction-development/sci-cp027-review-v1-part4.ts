import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp027ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp027ReviewSpec[] = [
  [
    8,
    "Medium",
    "Why does puberty usually involve both physical and reproductive changes?",
    "Sex hormones act on reproductive organs and other body tissues",
    [
      "Only bones respond to hormones",
      "The nervous system stops developing",
      "All body cells become gametes"
    ],
    "Sex hormones affect reproductive maturation as well as secondary sexual characteristics in other tissues.",
    [
      "PUBERTY-MULTIPLE-CHANGES"
    ]
  ],
  [
    8,
    "Medium",
    "Which change shows that the female reproductive system has begun cyclic reproductive activity?",
    "Onset of menstruation",
    [
      "Loss of all body hair",
      "Permanent closure of the cervix",
      "Stopping growth of the uterus"
    ],
    "Menarche, the first menstruation, marks the start of menstrual cyclic activity.",
    [
      "MENARCHE"
    ]
  ],
  [
    8,
    "Hard",
    "Two adolescents of the same age begin puberty at different times. Which statement is most accurate?",
    "Normal timing varies among individuals",
    [
      "Puberty must begin on the same birthday for everyone",
      "Later puberty always means disease",
      "Puberty timing is unrelated to hormones or development"
    ],
    "The onset and pace of puberty vary naturally among healthy individuals.",
    [
      "PUBERTY-VARIATION"
    ]
  ],
  [
    9,
    "Easy",
    "Which contraceptive method also helps reduce transmission of many sexually transmitted infections?",
    "Condom",
    [
      "Copper-T only",
      "Oral contraceptive pill only",
      "Tubectomy"
    ],
    "Condoms act as a barrier and can reduce exchange of body fluids, lowering the risk of many sexually transmitted infections.",
    [
      "CONDOM-STI-BARRIER"
    ]
  ],
  [
    9,
    "Medium",
    "A Copper-T is placed inside the:",
    "Uterus",
    [
      "Ovary",
      "Fallopian tube permanently",
      "Urethra"
    ],
    "Copper-T is an intrauterine contraceptive device placed in the uterus.",
    [
      "COPPER-T-UTERUS"
    ]
  ],
  [
    9,
    "Medium",
    "Vasectomy prevents sperm from reaching semen by cutting or blocking the:",
    "Vas deferens",
    [
      "Urethra",
      "Epididymis only",
      "Prostate gland"
    ],
    "Vasectomy blocks the vas deferens so sperm do not enter the ejaculatory pathway.",
    [
      "VASECTOMY-VAS"
    ]
  ],
  [
    9,
    "Medium",
    "Tubectomy prevents normal meeting of sperm and ovum by blocking the:",
    "Fallopian tubes",
    [
      "Ovaries",
      "Uterus",
      "Vagina"
    ],
    "Tubectomy blocks the fallopian tubes, preventing sperm and ovum from meeting normally.",
    [
      "TUBECTOMY-TUBES"
    ]
  ],
  [
    9,
    "Hard",
    "Which method prevents pregnancy without altering ovulation or hormone secretion and also offers barrier protection?",
    "Condom",
    [
      "Oral contraceptive pills",
      "Hormonal implant",
      "Emergency hormonal contraception"
    ],
    "A condom is a physical barrier and does not depend on changing ovulation or hormone levels.",
    [
      "CONTRACEPTION-BARRIER-REASONING"
    ]
  ],
  [
    9,
    "Hard",
    "A man has undergone vasectomy successfully. Which function should remain normal?",
    "Testosterone production by the testes",
    [
      "Transport of sperm through the vas deferens",
      "Presence of sperm in semen",
      "Fertilization through normal intercourse"
    ],
    "Vasectomy blocks sperm transport but does not stop the testes from producing testosterone.",
    [
      "VASECTOMY-HORMONE-PRESERVED"
    ]
  ],
  [
    10,
    "Easy",
    "Which stage comes first in normal human reproduction?",
    "Formation of gametes",
    [
      "Implantation",
      "Foetal development",
      "Childbirth"
    ],
    "Gametes must be formed before fertilization, implantation and later development can occur.",
    [
      "REPRODUCTION-SEQUENCE-FIRST"
    ]
  ],
  [
    10,
    "Medium",
    "Which sequence is correct after ovulation if pregnancy occurs?",
    "Fertilization → Cleavage → Implantation → Foetal development",
    [
      "Implantation → Fertilization → Ovulation → Birth",
      "Menstruation → Implantation → Fertilization → Ovulation",
      "Foetal development → Fertilization → Implantation → Ovulation"
    ],
    "After ovulation, fertilization may occur, followed by early cell divisions, implantation and continued development.",
    [
      "REPRODUCTION-SEQUENCE"
    ]
  ],
  [
    10,
    "Medium",
    "A woman ovulates normally and fertilization occurs, but both ovaries are later removed after pregnancy is well established. Which structure has already become essential for maternal-foetal exchange?",
    "Placenta",
    [
      "Fallopian tube",
      "Cervix",
      "Vagina"
    ],
    "Once pregnancy is established, the placenta becomes the key exchange organ between mother and foetus.",
    [
      "PLACENTA-INTEGRATED"
    ]
  ],
  [
    10,
    "Medium",
    "Why does the chromosome number not double in every generation?",
    "Gametes carry half the chromosome number",
    [
      "All chromosomes are destroyed after fertilization",
      "Body cells are haploid",
      "The zygote loses half its chromosomes immediately"
    ],
    "Meiosis produces haploid gametes, so fertilization restores rather than doubles the species chromosome number.",
    [
      "CHROMOSOME-NUMBER-STABILITY"
    ]
  ],
  [
    10,
    "Hard",
    "A zygote forms normally but fails to reach the uterus because movement through the fallopian tube is disrupted. Which later event is most directly threatened?",
    "Normal implantation in the uterine lining",
    [
      "Production of sperm",
      "Puberty",
      "Milk secretion after childbirth"
    ],
    "The early embryo must reach the uterus before normal implantation can occur.",
    [
      "TUBE-TRANSPORT-IMPLANTATION"
    ]
  ],
  [
    10,
    "Hard",
    "A pregnant woman's placenta is severely damaged. Which combined function is most directly compromised?",
    "Transfer of oxygen and nutrients to the foetus and removal of foetal wastes",
    [
      "Production of ova and sperm",
      "Storage of urine and bile",
      "Control of pupil size and hearing"
    ],
    "The placenta supports exchange of respiratory gases, nutrients and metabolic wastes between maternal and foetal circulations.",
    [
      "PLACENTA-DAMAGE-INTEGRATED"
    ]
  ]
] as const;
