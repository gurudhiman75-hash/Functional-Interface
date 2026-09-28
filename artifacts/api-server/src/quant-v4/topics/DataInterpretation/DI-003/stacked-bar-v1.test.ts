import assert from "node:assert/strict";
import { DI003_STACKED_TASKS, generateDi003StackedBarSet } from "./stacked-bar-v1";
import { renderDi003StackedBarSvg } from "./stacked-bar-svg-v1";
const tasks=new Set<string>();let questions=0;
for(let i=0;i<320;i++){const seed=`DI-003-STACKED-STRESS-${i}`,set=generateDi003StackedBarSet({seed});assert.deepEqual(set,generateDi003StackedBarSet({seed}));assert.deepEqual(set.questions.map(q=>q.difficulty),["Easy","Medium","Medium","Hard","Hard"]);const svg=renderDi003StackedBarSvg(set.stimulus);assert(svg.includes('data-stacked-bar="true"'));for(const p of set.stimulus.points){assert(svg.includes(p.category));for(const v of [p.a,p.b,p.c])assert(svg.includes(`data-value="${v}"`));}for(const q of set.questions){questions++;tasks.add(q.kind);assert.equal(q.options.length,5);assert.equal(new Set(q.options).size,5);assert.equal(q.options[q.correctIndex],q.answer);assert(!/\d+\.\d+/u.test(q.answer));}}
assert.deepEqual([...tasks].sort(),[...DI003_STACKED_TASKS].sort());console.log("DI003_STACKED_BAR_V1",JSON.stringify({sets:320,questions,tasks:[...tasks].sort()}));
