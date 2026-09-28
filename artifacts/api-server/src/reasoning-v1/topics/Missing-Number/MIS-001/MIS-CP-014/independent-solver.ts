export interface MisCp014Group{readonly topLeft:number;readonly topRight:number;readonly bottomLeft:number;readonly bottomRight:number;}
export type MisCp014Corner='topLeft'|'topRight'|'bottomLeft'|'bottomRight';
export function independentlySumMisCp014Group(g:MisCp014Group):number{return g.topLeft+g.topRight+g.bottomLeft+g.bottomRight;}
export function independentlySolveMisCp014Missing(g:MisCp014Group,total:number,corner:MisCp014Corner):number{
  const known=(Object.entries(g) as [MisCp014Corner,number][]).filter(([k])=>k!==corner).reduce((s,[,v])=>s+v,0);
  return total-known;
}
