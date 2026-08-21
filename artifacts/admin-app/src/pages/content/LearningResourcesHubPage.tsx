import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningResourcePreviewWorkspacePage } from './LearningResourcePreviewWorkspacePage';
import { LearningResourcesWorkspacePage } from './LearningResourcesWorkspacePage';

export function LearningResourcesHubPage() {
  return <Tabs defaultValue="manage" className="space-y-3">
    <TabsList aria-label="Learning resources workspace views">
      <TabsTrigger value="manage">Manage</TabsTrigger>
      <TabsTrigger value="preview">Preview</TabsTrigger>
    </TabsList>
    <TabsContent value="manage" className="mt-0">
      <LearningResourcesWorkspacePage />
    </TabsContent>
    <TabsContent value="preview" className="mt-0">
      <LearningResourcePreviewWorkspacePage />
    </TabsContent>
  </Tabs>;
}

export default LearningResourcesHubPage;
