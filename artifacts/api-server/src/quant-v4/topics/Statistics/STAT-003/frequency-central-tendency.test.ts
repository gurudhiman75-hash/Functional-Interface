import { STAT003_CONTRACTS, generateStat003Question } from "./frequency-central-tendency";
import { verifyStat003Question } from "./independent-verifier";
import type { Stat003ExamProfile } from "./types";
function assert(c:unknown,m:string):asserts c { if(!c) throw new Error(m); }
const profiles:readonly Stat003ExamProfile[]=["SSC_CGL_TIER_II","SSC_CGL_JSO"];
let questions=0, options=0;
for(const profile of profiles){ for(const contractId of STAT003_CONTRACTS){ const positions=new Set<number>(); const surfaces=new Set<string>(); for(let i=1;i<=100;i++){ const seed=`STAT-003-P0-${contractId}-${profile}-${i}`; const a=generateStat003Question({seed,examProfile:profile,contractId}); const b=generateStat003Question({seed,examProfile:profile,contractId}); assert(JSON.stringify(a)===JSON.stringify(b),`Non-deterministic ${seed}`); assert(a.validation.valid,`Validation failed ${seed}`); assert(verifyStat003Question(a).valid,`Verifier failed ${seed}`); assert(a.options.length===4&&new Set(a.options).size===4,`Options failed ${seed}`); positions.add(a.correctIndex); surfaces.add(a.stem.split('\n')[0]!); questions++; options+=a.options.length; } assert(positions.size===4,`${contractId}/${profile} lacks A-D answer coverage`); assert(surfaces.size>=3,`${contractId}/${profile} lacks three stem surfaces`); }}
console.log(JSON.stringify({packageId:"STAT-003",questions,options,deterministicReplayChecks:questions,independentVerificationChecks:questions,contracts:STAT003_CONTRACTS.length,profiles:profiles.length},null,2));
