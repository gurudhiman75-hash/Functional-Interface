import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotesStudioApprovalLocalizationPage } from './NotesStudioApprovalLocalizationPage';
import { NotesStudioEvidenceCoveragePage } from './NotesStudioEvidenceCoveragePage';
import { NotesStudioOperationsPage } from './NotesStudioOperationsPage';
import { NotesStudioQualityGatesPage } from './NotesStudioQualityGatesPage';
import { NotesStudioReleaseRevisionPage } from './NotesStudioReleaseRevisionPage';
import { NotesStudioSectionDraftsPage } from './NotesStudioSectionDraftsPage';
import { NotesStudioSourcePackPage } from './NotesStudioSourcePackPage';
import { NotesStudioWorkspacePage } from './NotesStudioWorkspacePage';

export function NotesStudioHubPage() {
  return <Tabs defaultValue="authoring" className="space-y-3">
    <TabsList aria-label="Notes Studio workspace views">
      <TabsTrigger value="authoring">Brief & sources</TabsTrigger>
      <TabsTrigger value="evidence">Evidence & coverage</TabsTrigger>
      <TabsTrigger value="sections">Section drafts</TabsTrigger>
      <TabsTrigger value="quality">Quality gates</TabsTrigger>
      <TabsTrigger value="approval">Approval & localization</TabsTrigger>
      <TabsTrigger value="release">Release & revisions</TabsTrigger>
      <TabsTrigger value="canonical">Canonical notes</TabsTrigger>
      <TabsTrigger value="operations">Production readiness</TabsTrigger>
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
    <TabsContent value="quality" className="mt-0">
      <NotesStudioQualityGatesPage />
    </TabsContent>
    <TabsContent value="approval" className="mt-0">
      <NotesStudioApprovalLocalizationPage />
    </TabsContent>
    <TabsContent value="release" className="mt-0">
      <NotesStudioReleaseRevisionPage />
    </TabsContent>
    <TabsContent value="canonical" className="mt-0">
      <NotesStudioWorkspacePage />
    </TabsContent>
    <TabsContent value="operations" className="mt-0">
      <NotesStudioOperationsPage />
    </TabsContent>
  </Tabs>;
}

export default NotesStudioHubPage;
