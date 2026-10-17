import type { ReactNode } from "react";

function safeHref(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function inlineNodes(text: string): ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return tokens.map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index} className="font-black text-slate-950 dark:text-foreground">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return <code key={index} className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800 dark:bg-muted dark:text-foreground">{token.slice(1, -1)}</code>;
    }
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = safeHref(link[2]);
      if (!href) return <span key={index}>{link[1]}</span>;
      const external = /^https?:/i.test(href);
      return <a key={index} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="font-bold text-[#6657e8] underline decoration-[#6657e8]/25 underline-offset-4 hover:decoration-[#6657e8]">{link[1]}</a>;
    }
    return token;
  });
}

function tableCells(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function isTableDivider(line: string): boolean {
  const cells = tableCells(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function isBlockStart(lines: string[], index: number): boolean {
  const line = lines[index]?.trim() ?? "";
  if (!line) return true;
  if (/^#{1,4}\s+/.test(line) || /^>\s?/.test(line) || /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line) || /^---+$/.test(line)) return true;
  return Boolean(lines[index + 1] && line.includes("|") && isTableDivider(lines[index + 1]));
}

export function LearningResourceMarkdown({ markdown }: { markdown: string }) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    if (/^---+$/.test(line)) {
      blocks.push(<hr key={`hr-${index}`} className="my-7 border-slate-200 dark:border-border" />);
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const classes = level === 1
        ? "mt-8 text-3xl font-black tracking-[-0.04em]"
        : level === 2
          ? "mt-8 text-2xl font-black tracking-[-0.035em]"
          : "mt-7 text-lg font-black tracking-[-0.025em]";
      const content = inlineNodes(heading[2]);
      if (level === 1) blocks.push(<h2 key={`h-${index}`} className={classes}>{content}</h2>);
      else if (level === 2) blocks.push(<h2 key={`h-${index}`} className={classes}>{content}</h2>);
      else blocks.push(<h3 key={`h-${index}`} className={classes}>{content}</h3>);
      index += 1;
      continue;
    }

    if (line.includes("|") && lines[index + 1] && isTableDivider(lines[index + 1])) {
      const header = tableCells(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].trim().includes("|") && lines[index].trim()) {
        rows.push(tableCells(lines[index]));
        index += 1;
      }
      blocks.push(
        <div key={`table-${index}`} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-border">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead className="bg-[#f3f0ff] text-slate-900 dark:bg-violet-950/30 dark:text-foreground"><tr>{header.map((cell, cellIndex) => <th key={cellIndex} className="border-b border-slate-200 px-4 py-3 font-black dark:border-border">{inlineNodes(cell)}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex} className="border-b border-slate-100 last:border-0 dark:border-border/60">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 align-top text-slate-700 dark:text-muted-foreground">{inlineNodes(cell)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      blocks.push(<ul key={`ul-${index}`} className="my-5 list-disc space-y-2 pl-6 text-[15px] leading-7 text-slate-700 marker:text-[#6657e8] dark:text-muted-foreground">{items.map((item, itemIndex) => <li key={itemIndex}>{inlineNodes(item)}</li>)}</ul>);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(<ol key={`ol-${index}`} className="my-5 list-decimal space-y-2 pl-6 text-[15px] leading-7 text-slate-700 marker:font-black marker:text-[#6657e8] dark:text-muted-foreground">{items.map((item, itemIndex) => <li key={itemIndex}>{inlineNodes(item)}</li>)}</ol>);
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quotes: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quotes.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(<blockquote key={`quote-${index}`} className="my-6 rounded-r-2xl border-l-4 border-[#6657e8] bg-[#f6f3ff] px-5 py-4 text-[15px] leading-7 text-slate-700 dark:bg-violet-950/25 dark:text-muted-foreground">{inlineNodes(quotes.join(" "))}</blockquote>);
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines, index)) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p key={`p-${index}`} className="my-4 text-[15px] leading-8 text-slate-700 dark:text-muted-foreground">{inlineNodes(paragraph.join(" "))}</p>);
  }

  return <div className="min-w-0">{blocks}</div>;
}
