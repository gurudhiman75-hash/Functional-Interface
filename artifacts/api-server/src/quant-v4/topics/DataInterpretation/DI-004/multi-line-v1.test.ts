import assert from "node:assert/strict";
import { DI004_MULTI_TASKS, generateDi004MultiLineSet } from "./multi-line-v1";
import { renderDi004MultiLineSvg } from "./multi-line-svg-v1";
const tasks=new Set<string>();let questions=0;
for(let i=0;i<320;i++){const seed=`DI-004-MULTI-STRESS-${i}`,set=generateDi004MultiLineSet({seed});assert.deepEqual(set,generateDi004MultiLineSet({seed}));assert.deepEqual(set.questions.map(q=>q.difficulty),["Easy","Medium","Medium","Hard","Hard"]);const svg=renderDi004MultiLineSvg(set.stimulus);assert(svg.includes('data-multi-line="true"'));assert(svg.includes('data-series-count="3"'));for(const p of set.stimulus.points){assert(svg.includes(p.period);for(const v of [p.a,p.b,p.c])assert(svg.includes(`data-value="${v}"`));}for(const q of set.questions){questions++;tasks.add(q.kind);assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);assert.equal(q.options[q.correctIndex],q.answer);assert(!/\d+\.\d+/u.test(q.answer));}}
assert.deepEqual([...tasks].sort(),[...DI004_MULTI_TASKS].sort());console.log("DI004_MULTI_LINE_V1",JSON.stringify({sets:320,questions,tasks:[...tasks].sort()}));
