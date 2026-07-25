export function factorial(n:number):number{if(!Number.isInteger(n)||n<0||n>12)throw new Error(`Unsafe factorial ${n}`);let v=1;for(let i=2;i<=n;i++)v*=i;return v;}
export function hashSeed(value:string):number{let h=2166136261;for(const ch of value){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function choose<T>(values:T[],seed:string):T{return values[hashSeed(seed)%values.length]!;}
export function permutations(values:number[]):number[][]{const out:number[][]=[];const a=[...values];function visit(i:number){if(i===a.length){out.push([...a]);return;}for(let j=i;j<a.length;j++){[a[i],a[j]]=[a[j]!,a[i]!];visit(i+1);[a[i],a[j]]=[a[j]!,a[i]!];}}visit(0);return out;}
export function consecutive(row:number[],group:number[]):boolean{const positions=group.map(x=>row.indexOf(x)).sort((a,b)=>a-b);return positions.every((p,i)=>i===0||p===positions[i-1]!+1);}
