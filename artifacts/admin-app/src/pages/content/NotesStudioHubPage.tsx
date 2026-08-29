import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotesStudioSourcePackPage } from './NotesStudioSourcePackPage';
import { NotesStudioWorkspacePage } from './NotesStudioWorkspacePage';

export function NotesStudioHubPage() {
  return <Tabs defaultValue="authoring" className="space-y-3">
    <TabsList aria-label="Notes Studio workspace views">
      <TabsTrigger value="authoring">Authoring & sources</TabsTrigger>
      <TabsTrigger value="canonical">Canonical notes</TabsTrigger>
    </TabsList>
    <TabsContent value="authoring" className="mt-0">
      <NotesStudioSourcePackPage />
    </TabsContent>
    <TabsContent value="canonical" className="mt-0">
      <NotesStudioWorkspacePage />
    </TabsContent>
  </Tabs>;
}

export default NotesStudioHubPage;
