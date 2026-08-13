import { auditMenCp010SaturationV3, MEN_CP_010_SATURATION_EXECUTABLE_IDS } from "./saturation-v3-ledger";
import { generateMenCp010SaturationV3Probe } from "./saturation-v3";
function assert(v:unknown,m:string):asserts v{if(!v)throw new Error(m);}
const audit=auditMenCp010SaturationV3();
assert(audit.rowCount===26,`row count ${audit.rowCount}`);
assert(audit.executableCount===11,`executable count ${audit.executableCount}`);
assert(audit.retainedNewClusterCount===3,`new clusters ${audit.retainedNewClusterCount}`);
assert(audit.deferredSourceGatedCount===2,"two higher-algebra inverse rows must remain source-gated");
assert(audit.ownershipCount===3,"three neighbour ownership boundaries required");
assert(audit.unresolvedCount===0,"saturation ledger has unresolved rows");
assert(audit.permanentQlCount===0&&audit.productLocked,"Wave 03 must remain pre-allocation and locked");
let packages=0;for(const id of MEN_CP_010_SATURATION_EXECUTABLE_IDS){const positions=new Set<number>();for(let i=0;i<64;i++){const seed=`proof:${String(i).padStart(3,"0")}`,a=generateMenCp010SaturationV3Probe(id,seed),b=generateMenCp010SaturationV3Probe(id,seed);assert(a.verification.valid,`${id}/${seed} verification`);assert(a.stem===b.stem&&a.answer===b.answer&&a.correctIndex===b.correctIndex,`${id}/${seed} replay`);assert(JSON.stringify(a.options)===JSON.stringify(b.options),`${id}/${seed} options replay`);assert(a.options.length===4&&new Set(a.options.map(o=>o.value)).size===4,`${id}/${seed} unique options`);assert(a.options.filter(o=>o.isCorrect).length===1,`${id}/${seed} one correct`);positions.add(a.correctIndex);packages++;}assert(positions.size===4,`${id} answer rotation`);}
assert(packages===704,`packages ${packages}`);
const review=[] as ReturnType<typeof generateMenCp010SaturationV3Probe>[],used=new Set<string>();for(const id of MEN_CP_010_SATURATION_EXECUTABLE_IDS){for(let p=0;p<4;p++){let q:null|ReturnType<typeof generateMenCp010SaturationV3Probe>=null;for(let n=0;n<500;n++){const x=generateMenCp010SaturationV3Probe(id,`review:${p}:${String(n).padStart(3,"0")}`),key=`${id}::${x.stem}`;if(x.correctIndex===p&&!used.has(key)){q=x;used.add(key);break;}}assert(q,`${id}/${p} review`);review.push(q);}}
assert(review.length===44&&used.size===44,"44 unique review records required");const counts=[0,1,2,3].map(p=>review.filter(q=>q.correctIndex===p).length);assert(counts.every(c=>c===11),`balance ${counts.join("/")}`);
console.log(JSON.stringify({...audit,deterministicPackages:packages,reviewRecords:review.length,reviewPositions:{A:counts[0],B:counts[1],C:counts[2],D:counts[3]}},null,2));
