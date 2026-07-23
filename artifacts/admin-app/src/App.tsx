import './App.css';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { AdminLayout } from '@/app/layout/AdminLayout';
import { ThemeProvider } from '@/app/theme/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { ContentReviewPage } from '@/pages/content/ContentReviewPage';
import { QuestionBankWorkspacePage } from '@/pages/content/QuestionBankWorkspacePage';
import { QuestionDetailPage } from '@/pages/content/QuestionDetailPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PendingWorkspacePage } from '@/pages/PendingWorkspacePage';
import { LiveDashboardPage } from '@/pages/overview/LiveDashboardPage';
import { TestDetailPage } from '@/pages/tests/TestDetailPage';
import { TestQAWorkspacePage } from '@/pages/tests/TestQAWorkspacePage';
import { TestsPage } from '@/pages/tests/TestsPage';

const QuestionStudioPage = lazy(() =>
  import('@/pages/content/QuestionStudioOperationsPage').then((module) => ({ default: module.QuestionStudioOperationsPage })),
);
const TaxonomyPage = lazy(() =>
  import('@/pages/content/TaxonomyWorkspacePage').then((module) => ({ default: module.TaxonomyWorkspacePage })),
);
const CoveragePage = lazy(() =>
  import('@/pages/content/CoveragePlannerPage').then((module) => ({ default: module.CoveragePlannerPage })),
);
const TestBuilderPage = lazy(() =>
  import('@/pages/tests/TestBuilderRecoveryPage').then((module) => ({ default: module.TestBuilderRecoveryPage })),
);
const ExamBlueprintsPage = lazy(() =>
  import('@/pages/tests/ExamBlueprintsWorkspacePage').then((module) => ({ default: module.ExamBlueprintsWorkspacePage })),
);
const TestSeriesPage = lazy(() =>
  import('@/pages/tests/TestSeriesWorkspacePage').then((module) => ({ default: module.TestSeriesWorkspacePage })),
);
const SystemHealthPage = lazy(() =>
  import('@/pages/analytics/SystemHealthWorkspacePage').then((module) => ({ default: module.SystemHealthWorkspacePage })),
);
const RequestFailuresPage = lazy(() =>
  import('@/pages/analytics/RequestFailuresPage').then((module) => ({ default: module.RequestFailuresPage })),
);
const LanguagesPage = lazy(() =>
  import('@/pages/settings/LanguagesPage').then((module) => ({ default: module.LanguagesPage })),
);
const AdminTeamPage = lazy(() =>
  import('@/pages/users/AdminTeamWorkspacePage').then((module) => ({ default: module.AdminTeamWorkspacePage })),
);
const StudentsPage = lazy(() =>
  import('@/pages/users/StudentsWorkspacePage').then((module) => ({ default: module.StudentsWorkspacePage })),
);
const StudentProfilePage = lazy(() =>
  import('@/pages/users/StudentProfileWorkspacePage').then((module) => ({ default: module.StudentProfileWorkspacePage })),
);
const RolesPermissionsPage = lazy(() =>
  import('@/pages/settings/RolesPermissionsWorkspacePage').then((module) => ({ default: module.RolesPermissionsWorkspacePage })),
);
const AuditLogsPage = lazy(() =>
  import('@/pages/settings/AuditLogsWorkspacePage').then((module) => ({ default: module.AuditLogsWorkspacePage })),
);

function RouteFallback() {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
      Loading canonical admin workspace…
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard', element: <LiveDashboardPage /> },

      { path: '/content/questions/generate', element: <QuestionStudioPage /> },
      { path: '/content/studio', element: <Navigate to="/content/questions/generate" replace /> },
      { path: '/content/questions/:id', element: <QuestionDetailPage /> },
      { path: '/content/questions', element: <QuestionBankWorkspacePage /> },
      { path: '/content/review', element: <ContentReviewPage /> },
      { path: '/content/coverage', element: <CoveragePage /> },
      { path: '/content/taxonomy', element: <TaxonomyPage /> },
      { path: '/content/sets', element: <PendingWorkspacePage /> },
      { path: '/content/media', element: <PendingWorkspacePage /> },

      { path: '/tests/builder', element: <TestBuilderPage /> },
      { path: '/tests/test-builder', element: <Navigate to="/tests/builder" replace /> },
      { path: '/tests/qa', element: <TestQAWorkspacePage /> },
      { path: '/tests/series', element: <TestSeriesPage /> },
      { path: '/tests/blueprints', element: <ExamBlueprintsPage /> },
      { path: '/tests/calendar', element: <PendingWorkspacePage /> },
      { path: '/tests/:id', element: <TestDetailPage /> },
      { path: '/tests', element: <TestsPage /> },

      { path: '/commerce/*', element: <PendingWorkspacePage /> },
      { path: '/users/students/:id', element: <StudentProfilePage /> },
      { path: '/users/students', element: <StudentsPage /> },
      { path: '/users/team', element: <AdminTeamPage /> },
      { path: '/users/*', element: <PendingWorkspacePage /> },
      { path: '/analytics/request-failures', element: <RequestFailuresPage /> },
      { path: '/analytics/system-health', element: <SystemHealthPage /> },
      { path: '/analytics/*', element: <PendingWorkspacePage /> },
      { path: '/settings/languages', element: <LanguagesPage /> },
      { path: '/settings/roles', element: <RolesPermissionsPage /> },
      { path: '/settings/audit-logs', element: <AuditLogsPage /> },
      { path: '/settings/*', element: <PendingWorkspacePage /> },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
], { basename: '/admin' });

export default function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<RouteFallback />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster />
    </ThemeProvider>
  );
}
