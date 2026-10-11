import {strict as assert} from "node:assert";
import {mkdirSync, writeFileSync} from "node:fs";
import {geometryModes, solveGeometry, verifyGeometry, generateGeometryReview} from "./geometry-counting";
let mathematicalCases=0;
for(let n=4;n<=18;n++) for(let k=3;k<n;k++) for(const mode of geometryModes) {
 assert.equal(solveGeometry(mode,n,k).answer,verifyGeometry(mode,n,k),`${mode}:${n}:${k}`);
 mathematicalCases++;
}
// Book exercise parameters; the quadrilateral answer exceeds none of the 4-point subsets.
assert.equal(solveGeometry("linesWithCollinearBlock",25,7).answer,280);
assert.equal(solveGeometry("trianglesWithCollinearBlock",25,7).answer,2265);
assert.equal(solveGeometry("quadrilateralsWithCollinearBlock",25,7).answer,11985);
assert.equal(verifyGeometry("quadrilateralsWithCollinearBlock",25,7),11985);
assert.equal(solveGeometry("trianglesWithCollinearBlock",9,3).answer,83);
assert.equal(solveGeometry("triangles",9,3).answer,84);
assert.equal(solveGeometry("lines",8,3).answer,28);
assert.throws(()=>solveGeometry("triangles",8,8));
assert.throws(()=>solveGeometry("triangles",3,2));
assert.throws(()=>solveGeometry("triangles",8.5,3));
const samples=[];
for(const mode of geometryModes) for(const language of ["en","hi","pa"] as const) for(let seed=0;seed<12;seed++) {
 const q=generateGeometryReview(mode,`source-geometry:${seed}`,language);
 assert(q.valid);assert.equal(q.publiclyPublishable,false);
 assert.equal(q.options[q.correctIndex],q.answer);
 assert.deepEqual(q,generateGeometryReview(mode,`source-geometry:${seed}`,language));
 assert(!/undefined|NaN|\{\w+\}/.test(q.stem));
 samples.push(q);
}
const output=process.argv[2] ?? "dist/pnc-source-geometry-review";
mkdirSync(output,{recursive:true});
writeFileSync(`${output}/geometry-review-samples.json`,JSON.stringify({status:"PASS",mathematicalCases,generatedPackages:samples.length,samples},null,2)+"\n");
console.log(JSON.stringify({status:"PASS",mathematicalCases,generatedPackages:samples.length}));
