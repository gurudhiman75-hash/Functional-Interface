import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp027ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp027ReviewSpec[] = [
  [
    1,
    "Easy",
    "Which organ produces sperm in the male reproductive system?",
    "Testes",
    [
      "Prostate gland",
      "Seminal vesicle",
      "Urethra"
    ],
    "The testes produce sperm and also secrete testosterone.",
    [
      "MALE-TESTES-SPERM"
    ]
  ],
  [
    1,
    "Easy",
    "Sperm are stored and mature for a time in the:",
    "Epididymis",
    [
      "Prostate gland",
      "Urethra",
      "Seminal vesicle"
    ],
    "The epididymis lies along the testis and is an important site for sperm maturation and storage.",
    [
      "EPIDIDYMIS-FUNCTION"
    ]
  ],
  [
    1,
    "Medium",
    "The vas deferens carries sperm from the:",
    "Epididymis toward the urethra",
    [
      "Urethra to the testis",
      "Prostate to the kidney",
      "Seminal vesicle to the bladder"
    ],
    "The vas deferens transports sperm away from the epididymis toward the ducts that open into the urethra.",
    [
      "VAS-DEFERENS"
    ]
  ],
  [
    1,
    "Medium",
    "Why are the testes located in the scrotum outside the abdominal cavity?",
    "Sperm production requires a temperature slightly below body temperature",
    [
      "The testes must remain in direct contact with air",
      "Testosterone cannot enter the blood inside the abdomen",
      "The scrotum produces sperm itself"
    ],
    "The scrotum helps keep the testes slightly cooler than core body temperature, which supports normal sperm formation.",
    [
      "SCROTUM-TEMPERATURE"
    ]
  ],
  [
    1,
    "Medium",
    "Seminal vesicles and the prostate gland contribute to semen by adding:",
    "Fluids that nourish and support sperm",
    [
      "Red blood cells",
      "Urine",
      "Bile"
    ],
    "Accessory glands add fluid that helps nourish, protect and transport sperm.",
    [
      "SEMEN-ACCESSORY-GLANDS"
    ]
  ],
  [
    1,
    "Hard",
    "If the vas deferens on both sides is blocked while the testes remain normal, which change is expected?",
    "Sperm cannot enter the ejaculated semen normally",
    [
      "Testosterone production stops immediately",
      "Urine cannot leave the bladder",
      "The testes stop producing all cells"
    ],
    "The testes may continue producing sperm and testosterone, but blocked vas deferens prevent sperm from reaching the urethral pathway.",
    [
      "VAS-DEFERENS-BLOCKAGE"
    ]
  ],
  [
    2,
    "Easy",
    "Which organ produces ova in the female reproductive system?",
    "Ovaries",
    [
      "Uterus",
      "Fallopian tubes",
      "Cervix"
    ],
    "The ovaries produce ova and secrete hormones such as oestrogen and progesterone.",
    [
      "OVARIES-OVA"
    ]
  ],
  [
    2,
    "Easy",
    "The developing embryo normally grows inside the:",
    "Uterus",
    [
      "Ovary",
      "Vagina",
      "Fallopian tube"
    ],
    "After implantation, the embryo develops in the uterus.",
    [
      "UTERUS-DEVELOPMENT"
    ]
  ],
  [
    2,
    "Medium",
    "Which structure carries an ovum from an ovary toward the uterus?",
    "Fallopian tube",
    [
      "Cervix",
      "Vagina",
      "Urethra"
    ],
    "The fallopian tube receives the ovum after ovulation and carries it toward the uterus.",
    [
      "FALLOPIAN-TUBE-OVUM"
    ]
  ],
  [
    2,
    "Medium",
    "The lower narrow part of the uterus that opens into the vagina is the:",
    "Cervix",
    [
      "Ovary",
      "Endometrium",
      "Fimbria"
    ],
    "The cervix forms the lower part of the uterus and connects it with the vagina.",
    [
      "CERVIX-LOCATION"
    ]
  ],
  [
    2,
    "Medium",
    "The inner lining of the uterus that thickens during the menstrual cycle is the:",
    "Endometrium",
    [
      "Myometrium only",
      "Ovarian cortex",
      "Vaginal wall"
    ],
    "The endometrium thickens in preparation for possible implantation.",
    [
      "ENDOMETRIUM"
    ]
  ],
  [
    2,
    "Hard",
    "If both fallopian tubes are completely blocked, which event is most directly prevented?",
    "Normal meeting of sperm and ovum",
    [
      "Production of ova by the ovaries",
      "Menstrual shedding of the uterine lining",
      "Secretion of ovarian hormones"
    ],
    "Fertilization usually occurs in a fallopian tube, so complete blockage prevents sperm and ovum from meeting normally.",
    [
      "FALLOPIAN-BLOCK-FERTILIZATION"
    ]
  ],
  [
    3,
    "Easy",
    "The male gamete in humans is the:",
    "Sperm",
    [
      "Ovum",
      "Zygote",
      "Embryo"
    ],
    "Sperm is the male gamete and carries one set of chromosomes.",
    [
      "SPERM-MALE-GAMETE"
    ]
  ],
  [
    3,
    "Easy",
    "The female gamete in humans is the:",
    "Ovum",
    [
      "Sperm",
      "Zygote",
      "Foetus"
    ],
    "The ovum, or egg cell, is the female gamete.",
    [
      "OVUM-FEMALE-GAMETE"
    ]
  ],
  [
    3,
    "Medium",
    "Human gametes contain how many chromosomes?",
    "23",
    [
      "46",
      "22",
      "44"
    ],
    "Gametes are haploid and contain 23 chromosomes, half the number found in most body cells.",
    [
      "GAMETE-CHROMOSOME-23"
    ]
  ]
] as const;
