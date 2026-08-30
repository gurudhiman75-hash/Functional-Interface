import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

export default function CurrentAffairsMarkdown({ markdown }: { markdown: string }) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const raw = lines[index] ?? "";
    const line = raw.trim();
    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(<h3 key={index} className="mb-2 mt-8 text-lg font-semibold tracking-[-0.02em] text-slate-950">{inline(line.slice(4))}</h3>);
      index += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(<h2 key={index} className="mb-3 mt-10 border-b border-slate-100 pb-2 text-xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-2xl">{inline(line.slice(3))}</h2>);
      index += 1;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push(<h1 key={index} className="mb-4 text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl">{inline(line.slice(2))}</h1>);
      index += 1;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      let cursor = index;
      while (cursor < lines.length) {
        const candidate = (lines[cursor] ?? "").trim();
        if (!candidate.startsWith("- ")) break;
        items.push(candidate.slice(2));
        cursor += 1;
      }
      blocks.push(
        <ul key={`list-${index}`} className="my-4 space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-[15px]">
          {items.map((item, itemIndex) => <li key={itemIndex} className="list-disc pl-1 marker:text-[#7869ec]">{inline(item)}</li>)}
        </ul>,
      );
      index = cursor;
      continue;
    }

    blocks.push(<p key={index} className="my-3 text-sm leading-7 text-slate-700 sm:text-[15px]">{inline(line)}</p>);
    index += 1;
  }

  return <article className="ca-markdown">{blocks}</article>;
}
