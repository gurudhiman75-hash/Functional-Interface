import type { ReactNode } from 'react';
import { ExternalLink, FileText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export type PreviewLine =
  | { kind: 'blank'; text: '' }
  | { kind: 'heading'; text: string; level: 1 | 2 | 3 }
  | { kind: 'bullet'; text: string }
  | { kind: 'ordered'; text: string; number: number }
  | { kind: 'quote'; text: string }
  | { kind: 'paragraph'; text: string };

export function safePreviewHttpsUrl(value: string | null | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && Boolean(url.hostname) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function parsePreviewLine(rawLine: string): PreviewLine {
  const line = rawLine.trimEnd();
  if (!line.trim()) return { kind: 'blank', text: '' };
  const heading = /^(#{1,3})\s+(.+)$/.exec(line.trim());
  if (heading) {
    return {
      kind: 'heading',
      level: heading[1].length as 1 | 2 | 3,
      text: heading[2].trim(),
    };
  }
  const bullet = /^[-*]\s+(.+)$/.exec(line.trim());
  if (bullet) return { kind: 'bullet', text: bullet[1].trim() };
  const ordered = /^(\d+)\.\s+(.+)$/.exec(line.trim());
  if (ordered) {
    return { kind: 'ordered', number: Number(ordered[1]), text: ordered[2].trim() };
  }
  const quote = /^>\s?(.*)$/.exec(line.trim());
  if (quote) return { kind: 'quote', text: quote[1].trim() };
  return { kind: 'paragraph', text: line.trim() };
}

function inlineMarkdown(text: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(pattern).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="rounded bg-muted px-1 py-0.5 text-[0.92em]">{part.slice(1, -1)}</code>;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const href = safePreviewHttpsUrl(link[2]);
      if (!href) return <span key={index}>{link[1]} <span className="text-destructive">(unsafe link blocked)</span></span>;
      return <a key={index} href={href} target="_blank" rel="noreferrer" className="font-medium text-primary underline underline-offset-2">{link[1]}</a>;
    }
    return <span key={index}>{part}</span>;
  });
}

function MarkdownPreview({ markdown }: { markdown: string }) {
  const lines = markdown.split(/\r?\n/).map(parsePreviewLine);
  if (!markdown.trim()) {
    return <p className="text-sm text-muted-foreground">No inline article content.</p>;
  }
  return <div className="space-y-3 text-sm leading-7">
    {lines.map((line, index) => {
      if (line.kind === 'blank') return <div key={index} className="h-1" aria-hidden="true" />;
      if (line.kind === 'heading') {
        const className = line.level === 1
          ? 'text-xl font-bold'
          : line.level === 2
            ? 'text-lg font-bold'
            : 'text-base font-semibold';
        return <div key={index} className={className}>{inlineMarkdown(line.text)}</div>;
      }
      if (line.kind === 'bullet') return <div key={index} className="flex gap-2"><span aria-hidden="true">•</span><p>{inlineMarkdown(line.text)}</p></div>;
      if (line.kind === 'ordered') return <div key={index} className="flex gap-2"><span className="tabular-nums">{line.number}.</span><p>{inlineMarkdown(line.text)}</p></div>;
      if (line.kind === 'quote') return <blockquote key={index} className="border-l-2 border-primary/40 pl-3 italic text-muted-foreground">{inlineMarkdown(line.text)}</blockquote>;
      return <p key={index}>{inlineMarkdown(line.text)}</p>;
    })}
  </div>;
}

export type LearningResourcePreviewModel = {
  title: string;
  summary: string;
  categoryLabel: string;
  format: string;
  languageCode: string;
  contentDate: string | null;
  expiresAt: string | null;
  bodyMarkdown: string | null;
  contentUrl: string | null;
  targetLabel: string;
};

export function LearningResourceLearnerPreview({ resource }: { resource: LearningResourcePreviewModel }) {
  const safeDocumentUrl = safePreviewHttpsUrl(resource.contentUrl);
  return <div className="mx-auto w-full max-w-3xl space-y-4" data-testid="learning-resource-learner-preview">
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{resource.categoryLabel}</Badge>
        <Badge variant="outline">{resource.format.toUpperCase()}</Badge>
        <Badge variant="outline">{resource.languageCode.toUpperCase()}</Badge>
        {resource.contentDate && <Badge variant="outline">{resource.contentDate.slice(0, 10)}</Badge>}
      </div>
      <h2 className="text-2xl font-bold tracking-tight">{resource.title.trim() || 'Untitled resource'}</h2>
      {resource.summary.trim() && <p className="text-sm leading-6 text-muted-foreground">{resource.summary.trim()}</p>}
      <p className="text-xs text-muted-foreground">For {resource.targetLabel}</p>
    </div>

    {resource.bodyMarkdown?.trim() && <Card><CardContent className="p-5"><MarkdownPreview markdown={resource.bodyMarkdown} /></CardContent></Card>}

    {resource.contentUrl && <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="font-medium">Attached document</p>
            <p className="truncate text-xs text-muted-foreground">{safeDocumentUrl ?? 'Unsafe or invalid document URL'}</p>
          </div>
        </div>
        {safeDocumentUrl
          ? <a href={safeDocumentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">Open document <ExternalLink className="h-4 w-4" /></a>
          : <Badge variant="destructive">Blocked URL</Badge>}
      </CardContent>
    </Card>}

    {resource.expiresAt && <p className="text-xs text-muted-foreground">This resource expires {new Date(resource.expiresAt).toLocaleString()}.</p>}
    <p className="text-xs text-muted-foreground">Preview is intentionally safe: raw HTML is not executed and only HTTPS links are clickable.</p>
  </div>;
}
