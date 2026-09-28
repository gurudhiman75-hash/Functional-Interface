import type { Di013Stimulus } from "./types";

function esc(value:unknown){return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");}
function polar(cx:number,cy:number,r:number,index:number,count:number){
  const angle=-Math.PI/2+(Math.PI*2*index)/count;
  return {x:cx+r*Math.cos(angle),y:cy+r*Math.sin(angle)};
}
export function renderDi013RadarSvg(stimulus:Di013Stimulus){
  const width=820,height=620,cx=410,cy=325,maxR=220,n=stimulus.points.length,maxTick=Math.max(...stimulus.radialTicks);
  const parts:string[]=[`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(stimulus.title)}" data-radar-chart="true" data-radial-grid-visible="true"><rect width="100%" height="100%" fill="white"/><title>${esc(stimulus.title)}</title><text x="${cx}" y="30" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="21" font-weight="700">${esc(stimulus.title)}</text>`];
  for(const tick of stimulus.radialTicks.filter(t=>t>0)){
    const r=maxR*tick/maxTick;
    const pts=Array.from({length:n},(_,i)=>{const p=polar(cx,cy,r,i,n);return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;}).join(" ");
    parts.push(`<polygon data-radial-tick="${tick}" points="${pts}" fill="none" stroke="#d9dee8" stroke-width="1"/>`);
    parts.push(`<text data-radial-label="${tick}" x="${cx+6}" y="${(cy-r+13).toFixed(2)}" font-family="Inter,Arial,sans-serif" font-size="11" fill="#667085">${tick}</text>`);
  }
  stimulus.points.forEach((point,i)=>{
    const edge=polar(cx,cy,maxR,i,n);
    const label=polar(cx,cy,maxR+38,i,n);
    parts.push(`<line x1="${cx}" y1="${cy}" x2="${edge.x.toFixed(2)}" y2="${edge.y.toFixed(2)}" stroke="#cbd2dc"/>`);
    parts.push(`<text data-axis-label="${i}" x="${label.x.toFixed(2)}" y="${label.y.toFixed(2)}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12" font-weight="600">${esc(point.category)}</text>`);
  });
  const series=(key:"seriesA"|"seriesB",id:string,stroke:string)=>{
    const pts=stimulus.points.map((point,i)=>{const p=polar(cx,cy,maxR*point[key]/maxTick,i,n);return {...p,value:point[key]};});
    parts.push(`<polygon data-series="${id}" points="${pts.map(p=>`${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ")}" fill="${stroke}" fill-opacity="0.08" stroke="${stroke}" stroke-width="2.5"/>`);
    pts.forEach((p,i)=>parts.push(`<circle data-series-point="${id}" data-category-index="${i}" data-value="${p.value}" cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="4.5" fill="white" stroke="${stroke}" stroke-width="2"/>`));
  };
  series("seriesA","SERIES_A","#4c67c8");series("seriesB","SERIES_B","#3d927f");
  parts.push(`<g data-legend="true"><line x1="270" y1="580" x2="310" y2="580" stroke="#4c67c8" stroke-width="3"/><text x="320" y="584" font-family="Inter,Arial,sans-serif" font-size="12">${esc(stimulus.seriesALabel)}</text><line x1="470" y1="580" x2="510" y2="580" stroke="#3d927f" stroke-width="3"/><text x="520" y="584" font-family="Inter,Arial,sans-serif" font-size="12">${esc(stimulus.seriesBLabel)}</text></g></svg>`);
  return parts.join("");
}
