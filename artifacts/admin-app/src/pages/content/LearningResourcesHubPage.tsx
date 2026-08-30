import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningResourcePreviewWorkspacePage } from './LearningResourcePreviewWorkspacePage';
import { LearningResourcesWorkspacePage } from './LearningResourcesWorkspacePage';
import { StaticGkVisualAtlasWorkspacePage } from './StaticGkVisualAtlasWorkspacePage';

export function LearningResourcesHubPage() {
  return <Tabs defaultValue="manage" className="space-y-3">
    <TabsList aria-label="Learning resources workspace views">
      <TabsTrigger value="manage">Manage</TabsTrigger>
      <TabsTrigger value="preview">Preview</TabsTrigger>
      <TabsTrigger value="visual-atlas">Visual Atlas</TabsTrigger>
    </TabsList>
    <TabsContent value="manage" className="mt-0">
      <LearningResourcesWorkspacePage />
    </TabsContent>
    <TabsContent value="preview" className="mt-0">
      <LearningResourcePreviewWorkspacePage />
    </TabsContent>
    <TabsContent value="visual-atlas" className="mt-0">
      <StaticGkVisualAtlasWorkspacePage />
    </TabsContent>
  </Tabs>;
}

export default LearningResourcesHubPage;
