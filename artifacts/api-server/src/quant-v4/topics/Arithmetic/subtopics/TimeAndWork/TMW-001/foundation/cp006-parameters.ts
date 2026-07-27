import { add, divide, multiply, rational, subtract } from "./rational";
import { pick } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp006Context, TmwCp006Parameters, TmwCp006ProjectState, TmwCp006RegistryEntry } from "./cp006-types";

const workerContexts:readonly TmwCp006Context[]=[
  {jobPhrase:"a boundary wall",resourceSingular:"worker",resourcePlural:"workers",outputUnit:"work units",resourceTimeUnit:"worker-days"},
  {jobPhrase:"a road-repair contract",resourceSingular:"worker",resourcePlural:"workers",outputUnit:"work units",resourceTimeUnit:"worker-days"},
  {jobPhrase:"a document-verification batch",resourceSingular:"clerk",resourcePlural:"clerks",outputUnit:"applications",resourceTimeUnit:"clerk-days"},
  {jobPhrase:"a packaging order",resourceSingular:"packer",resourcePlural:"packers",outputUnit:"packages",resourceTimeUnit:"packer-days"},
  {jobPhrase:"a painting contract",resourceSingular:"painter",resourcePlural:"painters",outputUnit:"work units",resourceTimeUnit:"painter-days"},
  {jobPhrase:"an inspection assignment",resourceSingular:"inspector",resourcePlural:"inspectors",outputUnit:"units",resourceTimeUnit:"inspector-days"},
];

const machineContexts:readonly TmwCp006Context[]=[
  {jobPhrase:"a component-production order",resourceSingular:"machine",resourcePlural:"machines",outputUnit:"components",resourceTimeUnit:"machine-hours"},
  {jobPhrase:"a printing order",resourceSingular:"printer",resourcePlural:"printers",outputUnit:"copies",resourceTimeUnit:"printer-hours"},
  {jobPhrase:"a bottling target",resourceSingular:"bottling line",resourcePlural:"bottling lines",outputUnit:"bottles",resourceTimeUnit:"machine-hours"},
  {jobPhrase:"an assembly target",resourceSingular:"assembly unit",resourcePlural:"assembly units",outputUnit:"units",resourceTimeUnit:"machine-hours"},
];

const foodContext:TmwCp006Context={jobPhrase:"the available food stock",resourceSingular:"person",resourcePlural:"people",outputUnit:"person-days of food",resourceTimeUnit:"person-days"};

function state(resources:number|Rational,days:number|Rational,hours:number|Rational=1,efficiency:number|Rational=1,work:number|Rational=1):TmwCp006ProjectState{
  const r=(value:number|Rational):Rational=>typeof value==="number"?rational(value):value;
  return {resources:r(resources),days:r(days),hoursPerDay:r(hours),efficiency:r(efficiency),work:r(work)};
}

function capacity(s:TmwCp006ProjectState):Rational{return multiply(multiply(multiply(s.resources,s.days),s.hoursPerDay),s.efficiency);}
function requiredResources(a:TmwCp006ProjectState,b:TmwCp006ProjectState):Rational{return divide(multiply(capacity(a),divide(b.work,a.work)),multiply(multiply(b.days,b.hoursPerDay),b.efficiency));}
function requiredDays(a:TmwCp006ProjectState,b:TmwCp006ProjectState):Rational{return divide(multiply(capacity(a),divide(b.work,a.work)),multiply(multiply(b.resources,b.hoursPerDay),b.efficiency));}
function requiredHours(a:TmwCp006ProjectState,b:TmwCp006ProjectState):Rational{return divide(multiply(capacity(a),divide(b.work,a.work)),multiply(multiply(b.resources,b.days),b.efficiency));}
function requiredEfficiency(a:TmwCp006ProjectState,b:TmwCp006ProjectState):Rational{return divide(multiply(capacity(a),divide(b.work,a.work)),multiply(multiply(b.resources,b.days),b.hoursPerDay));}
function derivedWork(a:TmwCp006ProjectState,b:TmwCp006ProjectState):Rational{return multiply(a.work,divide(capacity(b),capacity(a)));}
function withResources(a:TmwCp006ProjectState,b:TmwCp006ProjectState):TmwCp006ProjectState{return {...b,resources:requiredResources(a,b)};}
function withDays(a:TmwCp006ProjectState,b:TmwCp006ProjectState):TmwCp006ProjectState{return {...b,days:requiredDays(a,b)};}
function withHours(a:TmwCp006ProjectState,b:TmwCp006ProjectState):TmwCp006ProjectState{return {...b,hoursPerDay:requiredHours(a,b)};}
function withEfficiency(a:TmwCp006ProjectState,b:TmwCp006ProjectState):TmwCp006ProjectState{return {...b,efficiency:requiredEfficiency(a,b)};}
function withWork(a:TmwCp006ProjectState,b:TmwCp006ProjectState):TmwCp006ProjectState{return {...b,work:derivedWork(a,b)};}
function workerContext(seed:string,salt:string):TmwCp006Context{return pick(workerContexts,seed,salt);}
function machineContext(seed:string,salt:string):TmwCp006Context{return pick(machineContexts,seed,salt);}

export function buildTmwCp006Parameters(entry:TmwCp006RegistryEntry,seed:string):TmwCp006Parameters{
  switch(entry.solveMode){
    case "findRequiredResourceCount":{
      const pair=pick([
        [state(12,20,8),state(0,15,8)],
        [state(18,16,6),state(0,9,8)],
        [state(20,15,8),state(0,20,6,rational(5,4))],
        [state(16,18,8),state(0,12,6,1,rational(3,2))],
      ] as const,seed,"cp006-count");
      return {context:workerContext(seed,"cp006-count-context"),stateA:pair[0],stateB:withResources(pair[0],pair[1])};
    }
    case "findRequiredDays":{
      const pair=pick([
        [state(18,16,8),state(24,0,6)],
        [state(20,18,8),state(24,0,10)],
        [state(16,15,6),state(12,0,8,rational(5,4))],
        [state(24,20,8),state(30,0,8,1,rational(5,4))],
      ] as const,seed,"cp006-days");
      return {context:workerContext(seed,"cp006-days-context"),stateA:pair[0],stateB:withDays(pair[0],pair[1])};
    }
    case "findRequiredDailyHours":{
      const pair=pick([
        [state(18,20,8),state(24,20,0)],
        [state(20,15,8),state(25,12,0)],
        [state(16,18,6),state(12,12,0,rational(3,2))],
        [state(24,15,8),state(20,18,0,1,rational(3,2))],
      ] as const,seed,"cp006-hours");
      return {context:workerContext(seed,"cp006-hours-context"),stateA:pair[0],stateB:withHours(pair[0],pair[1])};
    }
    case "findRelativeEfficiency":{
      const pair=pick([
        [state(20,15,8),state(16,15,8,0)],
        [state(18,20,6),state(24,12,6,0)],
        [state(16,18,8),state(20,12,8,0)],
        [state(24,16,8),state(20,12,8,0,rational(5,4))],
      ] as const,seed,"cp006-efficiency");
      return {context:workerContext(seed,"cp006-eff-context"),stateA:pair[0],stateB:withEfficiency(pair[0],pair[1])};
    }
    case "findWorkQuantity":{
      const c=machineContext(seed,"cp006-output-context");
      const pair=pick([
        [state(8,5,1,25,1000),state(10,6,1,25,0)],
        [state(6,8,1,30,1440),state(9,5,1,30,0)],
        [state(12,4,1,20,960),state(10,7,1,20,0)],
        [state(5,10,1,40,2000),state(8,8,1,40,0)],
      ] as const,seed,"cp006-output");
      return {context:c,stateA:pair[0],stateB:withWork(pair[0],pair[1])};
    }
    case "findWorkQuantityRatio":{
      const pair=pick([
        [state(12,20,8),state(15,16,8)],
        [state(18,12,6),state(16,18,6)],
        [state(20,15,8),state(24,10,10)],
        [state(16,18,8),state(12,24,6,rational(4,3))],
      ] as const,seed,"cp006-work-ratio");
      return {context:workerContext(seed,"cp006-ratio-context"),stateA:pair[0],stateB:withWork(pair[0],pair[1])};
    }
    case "findAdditionalWorkersForDeadline":{
      const pair=pick([[24,20,15],[18,24,16],[30,18,15],[20,25,20]] as const,seed,"cp006-extra");
      const a=state(pair[0],pair[1],8),b=withResources(a,state(0,pair[2],8));
      return {context:workerContext(seed,"cp006-extra-context"),stateA:a,stateB:b};
    }
    case "findWorkersRemovedForDelay":{
      const pair=pick([[30,18,27],[24,20,30],[36,15,20],[28,18,28]] as const,seed,"cp006-remove");
      const a=state(pair[0],pair[1],8),b=withResources(a,state(0,pair[2],8));
      return {context:workerContext(seed,"cp006-remove-context"),stateA:a,stateB:b};
    }
    case "findOriginalWorkforceFromChangedSchedule":{
      const pair=pick([[24,12,18],[20,15,25],[18,16,24],[28,14,21]] as const,seed,"cp006-original");
      const b=state(pair[0],pair[2],8),a=state(0,pair[1],8);
      const reconstructed={...a,resources:requiredResources(b,a)};
      return {context:workerContext(seed,"cp006-original-context"),stateA:reconstructed,stateB:b};
    }
    case "findRemainingDaysFromActualProgress":{
      const sample=pick([
        {n:20,e:8,f:rational(2,5)},
        {n:24,e:6,f:rational(1,3)},
        {n:18,e:9,f:rational(3,8)},
        {n:16,e:5,f:rational(1,4)},
      ],seed,"cp006-progress-days");
      return {context:workerContext(seed,"cp006-progress-context"),stateA:state(sample.n,1,8),stateB:state(sample.n,1,8),elapsedDays:rational(sample.e),completedFraction:sample.f};
    }
    case "findExtraWorkersFromPlannedVsActualProgress":{
      const sample=pick([
        {n:20,d:20,e:8,total:30,f:rational(4,13)},
        {n:24,d:18,e:6,total:32,f:rational(3,11)},
        {n:18,d:20,e:5,total:30,f:rational(1,6)},
        {n:16,d:15,e:5,total:25,f:rational(8,33)},
      ],seed,"cp006-progress-workers");
      return {context:workerContext(seed,"cp006-progress-workers-context"),stateA:state(sample.n,sample.d,8),stateB:state(sample.total,subtract(rational(sample.d),rational(sample.e)),8),elapsedDays:rational(sample.e),completedFraction:sample.f};
    }
    case "findPercentWorkCompletedFromResourceHours":{
      const pair=pick([
        [state(20,15,8),state(15,10,8)],
        [state(24,12,8),state(18,8,8)],
        [state(16,20,6),state(20,8,6)],
        [state(30,10,8),state(18,10,8)],
      ] as const,seed,"cp006-percent-work");
      return {context:workerContext(seed,"cp006-percent-work-context"),stateA:pair[0],stateB:pair[1]};
    }
    case "findPercentScheduleDelay":{
      const pair=pick([[24,20,20],[30,18,24],[36,15,30],[28,21,21]] as const,seed,"cp006-delay-percent");
      const a=state(pair[0],pair[1],8),b=withDays(a,state(pair[2],0,8));
      return {context:workerContext(seed,"cp006-delay-context"),stateA:a,stateB:b};
    }
    case "findOvertimeHoursForDeadline":{
      const pair=pick([[30,20,8,24],[24,18,8,18],[32,15,8,20],[28,20,7,20]] as const,seed,"cp006-overtime");
      const a=state(pair[0],pair[1],pair[2]),b=withHours(a,state(pair[3],pair[1],0));
      return {context:workerContext(seed,"cp006-overtime-context"),stateA:a,stateB:b};
    }
    case "findShiftCountForProductionTarget":{
      const sample=pick([
        {m:8,q:25,target:1200},
        {m:6,q:30,target:1080},
        {m:10,q:24,target:1440},
        {m:12,q:20,target:1680},
      ],seed,"cp006-shifts");
      return {context:machineContext(seed,"cp006-shift-context"),stateA:state(sample.m,1,1,sample.q,sample.m*sample.q),stateB:state(sample.m,sample.target/(sample.m*sample.q),1,sample.q,sample.target)};
    }
    case "findDimensionalWorkRatio":{
      const sample=pick([
        {a:[20,3],b:[30,4],labels:["length","height"]},
        {a:[24,5],b:[30,6],labels:["length","width"]},
        {a:[18,4,2],b:[24,6,2],labels:["length","height","thickness"]},
        {a:[25,6,2],b:[30,10,3],labels:["length","width","depth"]},
      ],seed,"cp006-dim-ratio");
      return {context:workerContext(seed,"cp006-dim-context"),stateA:state(1,1),stateB:state(1,1),dimensionsA:sample.a.map(rational),dimensionsB:sample.b.map(rational),dimensionLabels:sample.labels};
    }
    case "findWorkersForChangedDimensions":{
      const sample=pick([
        {n:12,d1:15,d2:15,a:[20,3],b:[30,4],labels:["length","height"]},
        {n:18,d1:20,d2:16,a:[24,5],b:[32,6],labels:["length","width"]},
        {n:16,d1:18,d2:24,a:[18,4,2],b:[24,6,2],labels:["length","height","thickness"]},
        {n:20,d1:15,d2:18,a:[25,6,2],b:[30,10,2],labels:["length","width","depth"]},
      ],seed,"cp006-dim-workers");
      const ratio=divide(sample.b.map(rational).reduce(multiply,rational(1)),sample.a.map(rational).reduce(multiply,rational(1)));
      const a=state(sample.n,sample.d1,8,1,1),b=withResources(a,state(0,sample.d2,8,1,ratio));
      return {context:workerContext(seed,"cp006-dim-workers-context"),stateA:a,stateB:b,dimensionsA:sample.a.map(rational),dimensionsB:sample.b.map(rational),dimensionLabels:sample.labels};
    }
    case "findDaysForChangedDimensions":{
      const sample=pick([
        {n1:12,n2:18,d:15,a:[20,3],b:[30,4],labels:["length","height"]},
        {n1:18,n2:24,d:20,a:[24,5],b:[32,6],labels:["length","width"]},
        {n1:16,n2:18,d:18,a:[18,4,2],b:[24,6,2],labels:["length","height","thickness"]},
        {n1:20,n2:25,d:15,a:[25,6,2],b:[30,10,2],labels:["length","width","depth"]},
      ],seed,"cp006-dim-days");
      const ratio=divide(sample.b.map(rational).reduce(multiply,rational(1)),sample.a.map(rational).reduce(multiply,rational(1)));
      const a=state(sample.n1,sample.d,8,1,1),b=withDays(a,state(sample.n2,0,8,1,ratio));
      return {context:workerContext(seed,"cp006-dim-days-context"),stateA:a,stateB:b,dimensionsA:sample.a.map(rational),dimensionsB:sample.b.map(rational),dimensionLabels:sample.labels};
    }
    case "findResourceDurationAfterPopulationChange":{
      const sample=pick([
        {p1:120,d:30,e:10,p2:100},
        {p1:150,d:24,e:8,p2:120},
        {p1:180,d:25,e:5,p2:150},
        {p1:200,d:18,e:6,p2:160},
      ],seed,"cp006-food");
      const remaining=divide(multiply(rational(sample.p1),rational(sample.d-sample.e)),rational(sample.p2));
      return {context:foodContext,stateA:state(sample.p1,sample.d),stateB:state(sample.p2,remaining),initialPopulation:rational(sample.p1),changedPopulation:rational(sample.p2),elapsedBeforePopulationChange:rational(sample.e)};
    }
    case "findCompletionTimeAfterAbsenteeism":{
      const sample=pick([
        {n:40,d:18,p:20},
        {n:50,d:16,p:20},
        {n:60,d:15,p:25},
        {n:48,d:20,p:25},
      ],seed,"cp006-absence");
      const active=multiply(rational(sample.n),subtract(rational(1),rational(sample.p,100)));
      const a=state(sample.n,sample.d,8),b=withDays(a,state(active,0,8));
      return {context:workerContext(seed,"cp006-absence-context"),stateA:a,stateB:b,absentPercent:rational(sample.p)};
    }
    case "findCompletionWithBatchWorkerAdditions":{
      const sample=pick([
        {a:6,b:2,n:6,baseN:11,baseD:6},
        {a:8,b:2,n:5,baseN:12,baseD:5},
        {a:5,b:3,n:4,baseN:19,baseD:2},
        {a:10,b:2,n:7,baseN:16,baseD:7},
      ],seed,"cp006-batch");
      return {context:workerContext(seed,"cp006-batch-context"),stateA:state(sample.baseN,sample.baseD),stateB:state(sample.a,sample.n),initialBatchResources:rational(sample.a),batchAddition:rational(sample.b),targetBatchDays:rational(sample.n)};
    }
    case "findEquivalentResourceTime":{
      const machine=pick([false,true],seed,"cp006-resource-time-kind");
      const c=machine?machineContext(seed,"cp006-resource-time-machine"):workerContext(seed,"cp006-resource-time-worker");
      const sample=pick(machine?[[8,5],[12,6],[10,8],[15,4]]:[[18,12],[24,15],[16,20],[30,9]] as readonly (readonly [number,number])[],seed,"cp006-resource-time");
      return {context:c,stateA:state(sample[0],sample[1]),stateB:state(1,1)};
    }
  }
}
