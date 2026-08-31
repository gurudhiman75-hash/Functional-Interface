import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotesStudioApprovalLocalizationPage } from './NotesStudioApprovalLocalizationPage';
import { NotesStudioCandidateClaimsPage } from './NotesStudioCandidateClaimsPage';
import { NotesStudioCoverageGapResearchPage } from './NotesStudioCoverageGapResearchPage';
import { NotesStudioCoverageProposalPage } from './NotesStudioCoverageProposalPage';
import { NotesStudioEvidenceCoveragePage } from './NotesStudioEvidenceCoveragePage';
import { NotesStudioGapSourceRecommendationsPage } from './NotesStudioGapSourceRecommendationsPage';
import { NotesStudioOperationsPage } from './NotesStudioOperationsPage';
import { NotesStudioPlanningPage } from './NotesStudioPlanningPage';
import { NotesStudioQualityGatesPage } from './NotesStudioQualityGatesPage';
import { NotesStudioReleaseRevisionPage } from './NotesStudioReleaseRevisionPage';
import { NotesStudioSectionDraftsPage } from './NotesStudioSectionDraftsPage';
import { NotesStudioSourceCoveragePage } from './NotesStudioSourceCoveragePage';
import { NotesStudioSourceLibraryPage } from './NotesStudioSourceLibraryPage';
import { NotesStudioSourcePackPage } from './NotesStudioSourcePackPage';
import { NotesStudioSourcePackProposalPage } from './NotesStudioSourcePackProposalPage';
import { NotesStudioSourcePolicyPage } from './NotesStudioSourcePolicyPage';
import { NotesStudioWorkspacePage } from './NotesStudioWorkspacePage';

export function NotesStudioHubPage() {
  return <Tabs defaultValue="planning" className="space-y-3">
    <TabsList aria-label="Notes Studio workspace views">
      <TabsTrigger value="planning">Syllabus planning</TabsTrigger>
      <TabsTrigger value="library">Source library</TabsTrigger>
      <TabsTrigger value="authoring">Brief & sources</TabsTrigger>
      <TabsTrigger value="source-policy">Source policy</TabsTrigger>
      <TabsTrigger value="source-coverage">Source diagnostics</TabsTrigger>
      <TabsTrigger value="source-proposals">Pack proposals</TabsTrigger>
      <TabsTrigger value="candidate-claims">Candidate claims</TabsTrigger>
      <TabsTrigger value="coverage-proposals">Coverage proposals</TabsTrigger>
      <TabsTrigger value="coverage-gap-research">Coverage-gap research</TabsTrigger>
      <TabsTrigger value="gap-sources">Gap sources</TabsTrigger>
      <TabsTrigger value="evidence">Evidence & coverage</TabsTrigger>
      <TabsTrigger value="sections">Section drafts</TabsTrigger>
      <TabsTrigger value="quality">Quality gates</TabsTrigger>
      <TabsTrigger value="approval">Approval & localization</TabsTrigger>
      <TabsTrigger value="release">Release & revisions</TabsTrigger>
      <TabsTrigger value="canonical">Canonical notes</TabsTrigger>
      <TabsTrigger value="operations">Production readiness</TabsTrigger>
    </TabsList>
    <TabsContent value="planning" className="mt-0">
      <NotesStudioPlanningPage />
    </TabsContent>
    <TabsContent value="library" className="mt-0">
      <NotesStudioSourceLibraryPage />
    </TabsContent>
    <TabsContent value="authoring" className="mt-0">
      <NotesStudioSourcePackPage />
    </TabsContent>
    <TabsContent value="source-policy" className="mt-0">
      <NotesStudioSourcePolicyPage />
    </TabsContent>
    <TabsContent value="source-coverage" className="mt-0">
      <NotesStudioSourceCoveragePage />
    </TabsContent>
    <TabsContent value="source-proposals" className="mt-0">
      <NotesStudioSourcePackProposalPage />
    </TabsContent>
    <TabsContent value="candidate-claims" className="mt-0">
      <NotesStudioCandidateClaimsPage />
    </TabsContent>
    <TabsContent value="coverage-proposals" className="mt-0">
      <NotesStudioCoverageProposalPage />
    </TabsContent>
    <TabsContent value="coverage-gap-research" className="mt-0">
      <NotesStudioCoverageGapResearchPage />
    </TabsContent>
    <TabsContent value="gap-sources" className="mt-0">
      <NotesStudioGapSourceRecommendationsPage />
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
