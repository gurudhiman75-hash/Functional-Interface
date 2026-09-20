export type HisCoverageGapPriorityV1="CRITICAL"|"HIGH"|"MEDIUM_HIGH"|"MEDIUM";
export type HisCoverageGapV1=Readonly<{
  id:string;
  priority:HisCoverageGapPriorityV1;
  domain:string;
  currentState:string;
  anchorConcepts:readonly string[];
  proposedCp:string;
  targetQuestions:readonly [number,number];
}>;

export const HIS_001_COVERAGE_GAPS_V1:readonly HisCoverageGapV1[]=[
  {
    id:"HIS-GAP-001",
    priority:"CRITICAL",
    domain:"Medieval cultural developments",
    currentState:"No dedicated canonical checkpoint; isolated cultural facts do not provide Bhakti-Sufi-Sikh/literature/architecture/painting saturation.",
    anchorConcepts:["Bhakti","Sufi orders","Chishti","Kabir","Guru Nanak","Sikh institutions","Persian/Urdu/regional literature","medieval architecture","painting","music"],
    proposedCp:"HIS-CP-021",
    targetQuestions:[60,72],
  },
  {
    id:"HIS-GAP-002",
    priority:"CRITICAL",
    domain:"Popular resistance to Company rule",
    currentState:"Major pre/post-1857 peasant and tribal resistance families are absent from the canonical core.",
    anchorConcepts:["Sanyasi-Fakir","Rangpur","Poligar","Mappila","Bhil","Kol","Santhal","Munda","regional peasant resistance"],
    proposedCp:"HIS-CP-022",
    targetQuestions:[60,72],
  },
  {
    id:"HIS-GAP-003",
    priority:"HIGH",
    domain:"Medieval economy, society, trade and technology",
    currentState:"Political/administrative coverage is strong but economic-social coverage is fragmented.",
    anchorConcepts:["agrarian relations","landed intermediaries","craft production","karkhanas","textiles","trade routes","ports","technology","urban centres"],
    proposedCp:"HIS-CP-020",
    targetQuestions:[60,60],
  },
  {
    id:"HIS-GAP-004",
    priority:"HIGH",
    domain:"Colonial education, press and constitutional-public sphere",
    currentState:"Important education/press measures and connecting constitutional stages are missing or thin.",
    anchorConcepts:["Macaulay Minute","Wood's Despatch","Hunter Commission","Vernacular Press Act","Arms Act","Indian Councils Act 1861","Indian Councils Act 1892","education policy"],
    proposedCp:"HIS-CP-023",
    targetQuestions:[60,72],
  },
  {
    id:"HIS-GAP-005",
    priority:"HIGH",
    domain:"National-movement saturation supplement",
    currentState:"Core mass-movement sequence is strong; several recurring sessions, revolutionary nodes and transfer-of-power milestones are missing or thin.",
    anchorConcepts:["Kakori","Haripura","Tripuri","Wavell Plan","Simla Conference","Communal Award","Congress sessions","INA trials"],
    proposedCp:"HIS-CP-024",
    targetQuestions:[60,72],
  },
  {
    id:"HIS-GAP-006",
    priority:"MEDIUM_HIGH",
    domain:"Early-medieval north India",
    currentState:"Tripartite context exists but Pala/Gurjara-Pratihara and wider north-Indian depth is lower than southern dynastic depth.",
    anchorConcepts:["Palas","Gurjara-Pratiharas","Kannauj","Rajput states","regional political formations"],
    proposedCp:"HIS-CP-019",
    targetQuestions:[60,60],
  },
  {
    id:"HIS-GAP-007",
    priority:"MEDIUM_HIGH",
    domain:"Ancient intellectual/art/traveller supplements",
    currentState:"Selected literature/science/art facts exist but source/traveller and style coverage is fragmented.",
    anchorConcepts:["Fa-Hien","Xuanzang","Sushruta","Nagarjuna","schools of art","temple styles","education centres","inscriptions and texts"],
    proposedCp:"HIS-CP-018",
    targetQuestions:[60,60],
  },
  {
    id:"HIS-GAP-008",
    priority:"MEDIUM",
    domain:"Ancient transition and archaeological-culture supplements",
    currentState:"Prehistory and Harappan cores are strong; selected Chalcolithic and Magadha-transition facts remain thin.",
    anchorConcepts:["Chalcolithic cultures","Jorwe","Ahar/Malwa context","Magadha expansion","Ajatashatru","archaeological sequences"],
    proposedCp:"HIS-CP-017",
    targetQuestions:[60,60],
  },
] as const;

export const HIS_001_V2_PLANNED_MIN_QUESTIONS=
  HIS_001_COVERAGE_GAPS_V1.reduce((n,g)=>n+g.targetQuestions[0],0);

export const HIS_001_V2_PLANNED_MAX_QUESTIONS=
  HIS_001_COVERAGE_GAPS_V1.reduce((n,g)=>n+g.targetQuestions[1],0);

export const HIS_001_V1_FROZEN_QUESTIONS=954;
export const HIS_001_V2_PROJECTED_TOTAL_RANGE=Object.freeze([
  HIS_001_V1_FROZEN_QUESTIONS+HIS_001_V2_PLANNED_MIN_QUESTIONS,
  HIS_001_V1_FROZEN_QUESTIONS+HIS_001_V2_PLANNED_MAX_QUESTIONS,
] as const);
