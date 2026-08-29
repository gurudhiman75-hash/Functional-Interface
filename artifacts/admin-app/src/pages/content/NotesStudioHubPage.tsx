import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotesStudioEvidenceCoveragePage } from './NotesStudioEvidenceCoveragePage';
import { NotesStudioSectionDraftsPage } from './NotesStudioSectionDraftsPage';
import { NotesStudioSourcePackPage } from './NotesStudioSourcePackPage';
import { NotesStudioWorkspacePage } from './NotesStudioWorkspacePage';

export function NotesStudioHubPage() {
  return <Tabs defaultValue="authoring" className="space-y-3">
    <TabsList aria-label="Notes Studio workspace views">
      <TabsTrigger value="authoring">Brief & sources</TabsTrigger>
      <TabsTrigger value="evidence">Evidence & coverage</TabsTrigger>
      <TabsTrigger value="sections">Section drafts</TabsTrigger>
      <TabsTrigger value="canonical">Canonical notes</TabsTrigger>
    </TabsList>
    <TabsContent value="authoring" className="mt-0">
      <NotesStudioSourcePackPage />
    </TabsContent>
    <TabsContent value="evidence" className="mt-0">
      <NotesStudioEvidenceCoveragePage />
    </TabsContent>
    <TabsContent value="sections" className="mt-0">
      <NotesStudioSectionDraftsPage />
    </TabsContent>
    <TabsContent value="canonical" className="mt-0">
      <NotesStudioWorkspacePage />
    </TabsContent>
  </Tabs>;
}

export default NotesStudioHubPage;