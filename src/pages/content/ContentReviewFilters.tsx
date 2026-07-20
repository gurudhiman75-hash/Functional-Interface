import { Bookmark, Filter, Save, Search, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DEFAULT_REVIEW_FILTERS,
  type ContentReviewFilters,
  type SavedReviewView,
} from '@/features/content-review/queue-model';

export function ContentReviewFiltersBar({
  filters,
  statuses,
  savedViews,
  viewName,
  onFiltersChange,
  onViewNameChange,
  onApplySavedView,
  onSaveView,
  onClearSavedViews,
}: {
  filters: ContentReviewFilters;
  statuses: string[];
  savedViews: SavedReviewView[];
  viewName: string;
  onFiltersChange: (filters: ContentReviewFilters) => void;
  onViewNameChange: (value: string) => void;
  onApplySavedView: (id: string) => void;
  onSaveView: () => void;
  onClearSavedViews: () => void;
}) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(240px,1fr)_180px_170px_160px_160px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
              placeholder="Search code, stem, taxonomy, exam or reviewer"
              className="pl-9"
            />
          </div>
          <FilterSelect
            value={filters.source}
            onChange={(value) => onFiltersChange({ ...filters, source: value as ContentReviewFilters['source'] })}
            options={[['all', 'All sources'], ['Question Studio', 'Question Studio'], ['Question Bank', 'Question Bank']]}
          />
          <FilterSelect
            value={filters.status}
            onChange={(value) => onFiltersChange({ ...filters, status: value })}
            options={[['all', 'All statuses'], ...statuses.map((status) => [status, status.replaceAll('_', ' ')])]}
          />
          <FilterSelect
            value={filters.assignment}
            onChange={(value) => onFiltersChange({ ...filters, assignment: value as ContentReviewFilters['assignment'] })}
            options={[['all', 'All owners'], ['mine', 'Assigned to me'], ['unassigned', 'Unassigned']]}
          />
          <FilterSelect
            value={filters.age}
            onChange={(value) => onFiltersChange({ ...filters, age: value as ContentReviewFilters['age'] })}
            options={[['all', 'Any age'], ['fresh', 'Under 24h'], ['warning', '24–72h'], ['overdue', '72h+ overdue']]}
          />
        </div>
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Checkbox
              checked={filters.openCommentsOnly}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, openCommentsOnly: checked === true })}
            />
            Open comments only
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <Select onValueChange={onApplySavedView}>
              <SelectTrigger className="w-48"><Bookmark className="mr-2 h-4 w-4" /><SelectValue placeholder="Saved views" /></SelectTrigger>
              <SelectContent>
                {savedViews.length === 0
                  ? <SelectItem value="none" disabled>No saved views</SelectItem>
                  : savedViews.map((view) => <SelectItem key={view.id} value={view.id}>{view.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input value={viewName} onChange={(event) => onViewNameChange(event.target.value)} placeholder="Name this view" className="w-44" />
            <Button variant="outline" disabled={!viewName.trim()} onClick={onSaveView}><Save className="mr-1.5 h-4 w-4" /> Save view</Button>
            {savedViews.length > 0 && (
              <Button variant="ghost" size="icon" title="Delete all saved views" onClick={onClearSavedViews}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" onClick={() => onFiltersChange(DEFAULT_REVIEW_FILTERS)}>Clear filters</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({ value, onChange, options }: {
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <div>
      <Label className="sr-only">Review filter</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue}>{optionLabel}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
