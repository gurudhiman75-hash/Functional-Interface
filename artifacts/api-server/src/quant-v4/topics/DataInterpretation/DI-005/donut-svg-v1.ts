import type { Di005V2Stimulus } from "./pie-v2-types";

const COLORS = [
  { fill:"#6c8cf5", stroke:"#4c67c8" },
  { fill:"#62c6b0", stroke:"#3d927f" },
  { fill:"#f2b66d", stroke:"#c98940" },
  { fill:"#b58de8", stroke:"#8663b9" },
  { fill:"#ef7f8f", stroke:"#c45163" },
] as const;

function esc(value:unknown){
  return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");
}
function polar(cx:number,cy:number,r:number,degrees:number){
  const radians=((degrees-90)*Math.PI)/180;
  return {x:cx+r*Math.cos(radians),y:cy+r*Math.sin(radians)};
}
function donutPath(cx:number,cy:number,outer:number,inner:number,startDeg:number,endDeg:number){
  const os=polar(cx,cy,outer,endDeg), oe=polar(cx,cy,outer,startDeg);
  const is=polar(cx,cy,inner,startDeg), ie=polar(cx,cy,inner,endDeg);
  const large=endDeg-startDeg>180?1:0;
  return [
    `M ${os.x.toFixed(2)} ${os.y.toFixed(2)}`,
    `A ${outer} ${outer} 0 ${large} 0 ${oe.x.toFixed(2)} ${oe.y.toFixed(2)}`,
    `L ${is.x.toFixed(2)} ${is.y.toFixed(2)}`,
    `A ${inner} ${inner} 0 ${large} 1 ${ie.x.toFixed(2)} ${ie.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export function renderDi005DonutSvg(model:Di005V2Stimulus){
  if(model.slices.length!==5)throw new Error("DI-005 donut renderer requires five slices.");
  if(model.slices.reduce((s,x)=>s+x.percent,0)!==100)throw new Error("DI-005 donut renderer requires 100% total.");
  if(model.slices.some(s=>s.displayPercent==="?"))throw new Error("DI-005 donut V1 requires fully visible percentages.");
  const width=940,height=520,cx=320,cy=275,outer=168,inner=82,labelR=124;
  const title=esc(model.title),total=esc(`${model.totalLabel}: ${model.totalValue} ${model.unit}`);
  const parts:string[]=[
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}" data-donut-chart="true" data-ring-chart="true" data-inner-radius="${inner}" data-outer-radius="${outer}">`,
    `<rect width="100%" height="100%" fill="white"/><title>${title}</title>`,
    `<text x="${width/2}" y="34" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="22" font-weight="700">${title}</text>`,
    `<text x="${width/2}" y="60" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13" fill="#667085">${total}</text>`,
  ];
  let start=0;
  model.slices.forEach((slice,index)=>{
    const end=start+slice.percent*3.6,color=COLORS[index%COLORS.length]!;
    parts.push(`<path data-donut-slice="true" data-slice-index="${index}" data-percent="${slice.percent}" d="${donutPath(cx,cy,outer,inner,start,end)}" fill="${color.fill}" stroke="white" stroke-width="3"/>`);
    const mid=start+(end-start)/2,p=polar(cx,cy,labelR,mid);
    parts.push(`<text data-slice-label="${index}" x="${p.x.toFixed(2)}" y="${(p.y+5).toFixed(2)}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="700">${slice.percent}%</text>`);
    start=end;
  });
  parts.push(`<circle data-donut-hole="true" cx="${cx}" cy="${cy}" r="${inner}" fill="white" stroke="#d0d5dd" stroke-width="1"/>`);
  parts.push(`<text x="${cx}" y="${cy-4}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12" fill="#667085">Total</text><text x="${cx}" y="${cy+18}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" font-weight="700">${model.totalValue}</text>`);
  const legendX=590,legendY=170;
  model.slices.forEach((slice,index)=>{
    const y=legendY+index*52,color=COLORS[index%COLORS.length]!;
    parts.push(`<rect x="${legendX}" y="${y-13}" width="18" height="18" rx="3" fill="${color.fill}" stroke="${color.stroke}"/><text x="${legendX+30}" y="${y+1}" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="600">${esc(slice.category)}</text>`);
  });
  parts.push("</svg>");
  return parts.join("");
}
