import type { Di005V2Stimulus } from "./pie-v2-types";

function esc(value:unknown){return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");}
function polar(cx:number,cy:number,r:number,angle:number){return {x:cx+r*Math.cos(angle),y:cy+r*Math.sin(angle)};}
export function renderDi005RingSvg(stimulus:Di005V2Stimulus){
  const width=760,height=520,cx=300,cy=270,outer=170,inner=88;
  let angle=-Math.PI/2;
  const parts:string[]=[`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(stimulus.title)}" data-ring-chart="true" data-donut-hole="true"><rect width="100%" height="100%" fill="white"/><title>${esc(stimulus.title)}</title><text x="${width/2}" y="28" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="21" font-weight="700">${esc(stimulus.title)}</text><text x="${width/2}" y="50" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13">${esc(stimulus.totalLabel)}: ${stimulus.totalValue} ${esc(stimulus.unit)}</text>`];
  stimulus.slices.forEach((slice,i)=>{
    const frac=slice.percent/100,next=angle+frac*Math.PI*2;
    const o1=polar(cx,cy,outer,angle),o2=polar(cx,cy,outer,next),i2=polar(cx,cy,inner,next),i1=polar(cx,cy,inner,angle);
    const large=frac>0.5?1:0;
    const d=`M ${o1.x} ${o1.y} A ${outer} ${outer} 0 ${large} 1 ${o2.x} ${o2.y} L ${i2.x} ${i2.y} A ${inner} ${inner} 0 ${large} 0 ${i1.x} ${i1.y} Z`;
    const mid=(angle+next)/2,label=polar(cx,cy,(outer+inner)/2,mid);
    parts.push(`<path data-ring-sector="${i}" d="${d}" fill="white" stroke="#667085" stroke-width="1.5"/>`);
    parts.push(`<text data-sector-percent="${i}" x="${label.x.toFixed(2)}" y="${label.y.toFixed(2)}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12" font-weight="700">${slice.percent}%</text>`);
    angle=next;
  });
  parts.push(`<circle data-donut-hole-shape="true" cx="${cx}" cy="${cy}" r="${inner-2}" fill="white" stroke="#d0d5dd"/>`);
  stimulus.slices.forEach((slice,i)=>{const y=145+i*44;parts.push(`<text data-legend-category="${i}" x="530" y="${y}" font-family="Inter,Arial,sans-serif" font-size="13">${esc(slice.category)} — ${slice.percent}%</text>`);});
  parts.push(`</svg>`);return parts.join("");
}
