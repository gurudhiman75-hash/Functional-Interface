export type Eng007Difficulty="easy"|"medium"|"hard";
export type Eng007SpellingTrap="omitted-letter"|"extra-letter"|"letter-order"|"vowel-sequence"|"double-letter"|"ending-pattern"|"internal-pattern";
export interface Eng007CP007EntryV1{id:string;correct:string;misspelling:string;difficulty:Eng007Difficulty;domain:string;sourceRef:string;trap:Eng007SpellingTrap;}
const RAW=`
reference|referance|medium|exam-attested-residual|SSC-MTS-2019-08-14-S1|ending-pattern
repetition|repitition|medium|exam-attested-residual|SSC-MTS-2019-08-14-S1|ending-pattern
disturbance|disturbence|medium|exam-attested-residual|SSC-MTS-2022-07-20-S3|ending-pattern
implicate|implecate|easy|exam-attested-residual|SSC-MTS-2022-07-20-S3|internal-pattern
patience|patinece|medium|exam-attested-residual|SSC-MTS-2022-07-20-S3|letter-order
precursor|precurser|medium|exam-attested-residual|SSC-MTS-2022-07-19-S2|internal-pattern
religiosity|religiocity|hard|exam-attested-residual|SSC-MTS-2022-07-19-S2|ending-pattern
ancestors|anceistors|medium|exam-attested-residual|SSC-MTS-2022-07-19-S2|extra-letter
prepared|prepaired|easy|exam-attested-residual|SSC-MTS-2021-10-11-S2|extra-letter
tuition|tution|medium|exam-attested-residual|SSC-MTS-2019-08-22-S2|omitted-letter
livelihood|livelyhood|medium|exam-attested-residual|SSC-MTS-2022-07-25-S3|double-letter
veritable|verittable|medium|exam-attested-residual|SSC-MTS-2022-07-25-S3|extra-letter
purposefully|purposfully|medium|exam-attested-residual|SSC-MTS-2022-07-25-S3|omitted-letter
penetrate|penitrate|easy|exam-attested-residual|SSC-MTS-2022-07-25-S3|internal-pattern
irascible|iriscible|hard|exam-attested-residual|SSC-MTS-2025-2026-02-04-S3|ending-pattern
truculent|truculient|hard|exam-attested-residual|SSC-MTS-2025-2026-02-09-S2|extra-letter
melodies|meloudies|medium|exam-attested-residual|SSC-MTS-2025-2026-02-09-S2|extra-letter
awesome|awsome|easy|exam-attested-residual|SSC-MTS-2024-PYQ|omitted-letter
indulgent|indoulgent|medium|exam-attested-residual|SSC-MTS-2024-PYQ|extra-letter
attempt|atempt|easy|exam-attested-residual|SSC-CGL-2024-09-24-S2|omitted-letter
total|totsl|easy|exam-attested-residual|SSC-CGL-2024-09-13-S2|internal-pattern
marijuana|marijuena|medium|exam-attested-residual|SSC-CHSL-2024-07-02-S1|internal-pattern
fabulous|fabulus|easy|exam-attested-residual|SSC-MTS-2021-10-07-S3|omitted-letter
ambulance|ambulence|easy|exam-attested-residual|SSC-MTS-2021-10-08-S2|ending-pattern
tolerance|tolarance|medium|exam-attested-residual|SSC-MTS-2021-10-11-S3|ending-pattern
sieve|seive|medium|exam-attested-residual|SSC-MTS-2021-10-13-S3|letter-order
frown|froun|easy|exam-attested-residual|SSC-MTS-2021-10-08-S2|internal-pattern
indication|indicashun|easy|exam-attested-residual|SSC-MTS-2021-10-26-S3|ending-pattern
peasant|peasent|easy|exam-attested-residual|SSC-MTS-2021-10-08-S1|ending-pattern
gallery|gallary|easy|exam-attested-residual|SSC-MTS-2021-10-14-S2|double-letter
television|talevision|easy|exam-attested-residual|SSC-MTS-2021-10-27-S1|ending-pattern
suggestion|sugestion|easy|exam-attested-residual|SSC-MTS-2021-10-11-S1|omitted-letter
rudimentary|rudimentry|hard|exam-attested-residual|SSC-MTS-2022-07-14-S3|omitted-letter
coalesce|coalece|hard|exam-attested-residual|SSC-MTS-2022-07-14-S3|omitted-letter
reliant|relient|easy|exam-attested-residual|SSC-MTS-2022-07-14-S3|vowel-sequence
mortal|mortle|easy|exam-attested-residual|SSC-MTS-2022-07-22-S3|internal-pattern
prominent|promenant|easy|exam-attested-residual|SSC-MTS-2022-07-05-S2|ending-pattern
perfection|perfecttion|medium|exam-attested-residual|SSC-MTS-2022-07-05-S3|extra-letter
infatuation|infatuaition|medium|exam-attested-residual|SSC-MTS-2022-07-05-S3|extra-letter
fortunate|fortiunate|easy|exam-attested-residual|SSC-MTS-2022-07-05-S3|extra-letter
tendency|tendensy|easy|exam-attested-residual|SSC-MTS-2022-07-12-S2|ending-pattern
tolerate|tolreite|easy|exam-attested-residual|SSC-MTS-2022-07-18-S2|vowel-sequence
monotonous|monotanous|medium|exam-attested-residual|SSC-MTS-2022-07-11-S2|ending-pattern
strengthen|strenghten|medium|exam-attested-residual|SSC-MTS-2022-07-20-S1|letter-order
equipment|eqiupment|easy|exam-attested-residual|SSC-MTS-2022-07-20-S1|letter-order
instrumental|instrumentle|medium|exam-attested-residual|SSC-MTS-2022-07-20-S1|internal-pattern
reversal|reversel|medium|exam-attested-residual|SSC-MTS-2022-07-20-S1|internal-pattern
compatible|compatable|medium|exam-attested-residual|SSC-MTS-2025-2026-02-10-S3|ending-pattern
volatility|volatelity|medium|exam-attested-residual|SSC-MTS-2025-2026-02-04-S3|ending-pattern
ludicrous|ludicurous|hard|exam-attested-residual|SSC-MTS-2025-2026-02-06-S2|extra-letter
excessive|excesive|medium|exam-attested-residual|SSC-MTS-2025-2026-02-09-S1|omitted-letter
pernicious|pernacious|hard|exam-attested-residual|SSC-MTS-2025-2026-02-09-S1|ending-pattern
governance|governerce|medium|exam-attested-residual|SSC-MTS-2025-2026-02-09-S3|ending-pattern
`.trim();
export const ENG007_CP007_ENTRIES_V1=Object.freeze(RAW.split("\n").map((line,index)=>{const[correct,misspelling,difficulty,domain,sourceRef,trap]=line.split("|")as[string,string,Eng007Difficulty,string,string,Eng007SpellingTrap];return{id:`SPL007-${String(index+1).padStart(3,"0")}`,correct,misspelling,difficulty,domain,sourceRef,trap}as const;}));
export function eng007Cp007PoolV1(difficulty:Eng007Difficulty){return ENG007_CP007_ENTRIES_V1.filter(x=>x.difficulty===difficulty);}
