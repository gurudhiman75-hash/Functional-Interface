import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, Loader2, Plus, Search, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getQuestionPickerFacets, searchQuestionPicker, type PickerFacets, type PickerQuestion } from './api';

export interface PickedQuestionInfo {
  versionId: string;
  publicCode: string;
  stem: string;
  difficulty: string;
}

interface Props {
  examVersionId: string;
  sectionName: string;
  /** Question versions already placed in the active section, in order. */
  sectionQuestions: PickedQuestionInfo[];
  /** Every version used anywhere in the test (hidden from results). */
  allSelectedIds: string[];
  canEditQuestions: boolean;
  onAdd: (question: PickerQuestion) => void;
  onRemove: (versionId: string) => void;
  onMove: (versionId: string, direction: -1 | 1) => void;
}

const PAGE = 30;

export function QuestionPicker({
  examVersionId, sectionName, sectionQuestions, allSelectedIds, canEditQuestions, onAdd, onRemove, onMove,
}: Props) {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [hindi, setHindi] = useState(false);
  const [punjabi, setPunjabi] = useState(false);
  const [unusedOnly, setUnusedOnly] = useState(false);
  const [thisExamOnly, setThisExamOnly] = useState(false);
  const [subjectId, setSubjectId] = useState('all');
  const [topicId, setTopicId] = useState('all');
  const [qType, setQType] = useState('all');
  const [facets, setFacets] = useState<PickerFacets>({ nodes: [], questionTypes: [] });
  const [rows, setRows] = useState<PickerQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bankTotal, setBankTotal] = useState<number | null>(null);
  const [searched, setSearched] = useState(false);
  const requestId = useRef(0);
  const selectedKey = allSelectedIds.join('|');

  useEffect(() => {
    let alive = true;
    getQuestionPickerFacets().then((f) => { if (alive) setFacets(f); }).catch(() => undefined);
    return () => { alive = false; };
  }, []);

  const run = async (offset: number) => {
    const id = ++requestId.current;
    setLoading(true);
    setError('');
    try {
      const languages = [hindi ? 'hi' : '', punjabi ? 'pa' : ''].filter(Boolean);
      const result = await searchQuestionPicker({
        q: search.trim(),
        difficulties: difficulty === 'all' ? [] : [difficulty],
        languages,
        taxonomyNodeIds: topicId !== 'all' ? [topicId] : subjectId !== 'all' ? [subjectId] : [],
        questionTypes: qType === 'all' ? [] : [qType],
        usage: unusedOnly ? 'unused' : 'any',
        examVersionId: thisExamOnly ? examVersionId : undefined,
        excludeVersionIds: allSelectedIds,
        sort: 'newest',
        limit: PAGE,
        offset,
      });
      if (id !== requestId.current) return;
      setRows((current) => (offset === 0 ? result.questions : [...current, ...result.questions]));
      setTotal(result.total);
      setBankTotal(result.bankTotal ?? null);
      setSearched(true);
    } catch (caught) {
      if (id !== requestId.current) return;
      setError(caught instanceof Error ? caught.message : 'Unable to search questions.');
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  // Re-search (debounced) when filters change or a question is added/removed.
  useEffect(() => {
    const timer = window.setTimeout(() => { void run(0); }, 250);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, difficulty, subjectId, topicId, qType, hindi, punjabi, unusedOnly, thisExamOnly, examVersionId, selectedKey]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-48 flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search text or code" />
          </div>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={subjectId} onValueChange={(v) => { setSubjectId(v); setTopicId('all'); }}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {facets.nodes.filter((n) => n.nodeType === 'subject').map((n) => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={topicId} onValueChange={setTopicId}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              {facets.nodes.filter((n) => n.nodeType === 'topic' && (subjectId === 'all' || facets.nodes.find((s) => s.id === subjectId)?.name === n.parentName)).map((n) => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {facets.questionTypes.length > 1 && (
            <Select value={qType} onValueChange={setQType}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {facets.questionTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <label className="flex items-center gap-1.5"><Checkbox checked={hindi} onCheckedChange={(v) => setHindi(v === true)} /> Has Hindi</label>
          <label className="flex items-center gap-1.5"><Checkbox checked={punjabi} onCheckedChange={(v) => setPunjabi(v === true)} /> Has Punjabi</label>
          <label className="flex items-center gap-1.5"><Checkbox checked={unusedOnly} onCheckedChange={(v) => setUnusedOnly(v === true)} /> Never used</label>
          <label className="flex items-center gap-1.5"><Checkbox checked={thisExamOnly} onCheckedChange={(v) => setThisExamOnly(v === true)} /> This exam only</label>
        </div>
        <p className="text-xs text-muted-foreground">
          {loading && rows.length === 0 ? 'Searching…' : `${total} matching question${total === 1 ? '' : 's'}`}. Adding to <strong>{sectionName}</strong>.
          {!loading && !error && total < 10 && (
            <> Running short? <Link to="/content/questions/generate" target="_blank" rel="noreferrer" className="font-medium text-primary underline">Generate more questions</Link>
            {' '}(new questions must be approved and published before they show up here).</>
          )}
        </p>
        {error && <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2 text-sm text-destructive">{error}</p>}
        <div className="max-h-[560px] divide-y overflow-y-auto rounded-lg border">
          {rows.length === 0 && !loading && !error && (
            <div className="space-y-2 p-6 text-center text-sm text-muted-foreground">
              {!searched && <p>Loading questions…</p>}
              {searched && bankTotal === 0 && <p>The question bank on this server has no published or approved questions yet. Approve questions in Question Studio first.</p>}
              {searched && bankTotal !== 0 && (
                <>
                  <p>No questions match these filters{bankTotal ? ` (the bank has ${bankTotal} usable questions)` : ''}.</p>
                  <p className="text-xs">
                    Applied: {[search.trim() && `text "${search.trim()}"`, difficulty !== 'all' && difficulty, hindi && 'Hindi', punjabi && 'Punjabi', unusedOnly && 'never used', thisExamOnly && 'this exam only', allSelectedIds.length > 0 && `${allSelectedIds.length} already in test hidden`].filter(Boolean).join(', ') || 'no filters'}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => { setSearch(''); setDifficulty('all'); setSubjectId('all'); setTopicId('all'); setQType('all'); setHindi(false); setPunjabi(false); setUnusedOnly(false); setThisExamOnly(false); }}>Clear filters</Button>
                </>
              )}
            </div>
          )}
          {rows.map((question) => (
            <div key={question.versionId} className="flex items-start gap-3 p-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline">{question.publicCode}</Badge>
                  <Badge variant="outline">{question.difficulty}</Badge>
                  {question.languages.map((code) => <Badge key={code} variant="secondary">{code.toUpperCase()}</Badge>)}
                  {question.usedInTests > 0
                    ? <Badge variant="outline">used in {question.usedInTests} test{question.usedInTests === 1 ? '' : 's'}</Badge>
                    : <Badge variant="outline">new</Badge>}
                  {question.draftOnly && <Badge variant="outline">bank only</Badge>}
                  {question.taxonomy.slice(0, 2).map((node) => <Badge key={node.id} variant="secondary">{node.name}</Badge>)}
                </div>
                <p className="mt-1.5 line-clamp-3 text-sm leading-6">{question.stem}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <Button size="sm" onClick={() => onAdd(question)}><Plus className="mr-1 h-4 w-4" /> Add</Button>
                {canEditQuestions && (
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/content/questions/${question.questionId}`} target="_blank" rel="noopener noreferrer">Edit</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
          {rows.length < total && (
            <div className="p-3 text-center">
              <Button variant="outline" size="sm" disabled={loading} onClick={() => void run(rows.length)}>
                {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null} Load more
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{sectionName}</h3>
          <Badge variant="outline">{sectionQuestions.length} questions</Badge>
        </div>
        <div className="max-h-[620px] divide-y overflow-y-auto rounded-lg border">
          {sectionQuestions.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">Nothing added yet. Use Add on the left.</p>}
          {sectionQuestions.map((question, index) => (
            <div key={question.versionId} className="flex items-start gap-2 p-3">
              <span className="mt-0.5 w-6 shrink-0 text-xs text-muted-foreground">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex gap-1.5"><Badge variant="outline">{question.publicCode}</Badge><Badge variant="outline">{question.difficulty}</Badge></div>
                <p className="mt-1 line-clamp-2 text-sm">{question.stem}</p>
              </div>
              <div className="flex shrink-0 gap-0.5">
                <Button variant="ghost" size="icon" aria-label="Move up" disabled={index === 0} onClick={() => onMove(question.versionId, -1)}><ArrowUp className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" aria-label="Move down" disabled={index === sectionQuestions.length - 1} onClick={() => onMove(question.versionId, 1)}><ArrowDown className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => onRemove(question.versionId)}><X className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
