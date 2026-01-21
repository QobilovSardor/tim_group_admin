import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { ROUTES } from '@/config/constants';

// Services
import { ServicesList } from '@/pages/services/ServicesList';
import { CreateService } from '@/pages/services/CreateService';
import { EditService } from '@/pages/services/EditService';

// Reviews
import { ReviewsList } from '@/pages/reviews/ReviewsList';
import { CreateReview } from '@/pages/reviews/CreateReview';
import { EditReview } from '@/pages/reviews/EditReview';

// Distributors
import { DistributorsList } from '@/pages/distributors/DistributorsList';
import { CreateDistributor } from '@/pages/distributors/CreateDistributor';
import { EditDistributor } from '@/pages/distributors/EditDistributor';

// Projects
import { ProjectsList } from '@/pages/projects/ProjectsList';
import { CreateProject } from '@/pages/projects/CreateProject';
import { EditProject } from '@/pages/projects/EditProject';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to admin dashboard */}
        <Route path="/" element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
        <Route path="/admin" element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />

        {/* Admin Layout Routes */}
        <Route path="/admin" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />

          {/* Services Routes */}
          <Route path="our-services">
            <Route index element={<ServicesList />} />
            <Route path="new" element={<CreateService />} />
            <Route path=":id/edit" element={<EditService />} />
          </Route>

          {/* Reviews Routes */}
          <Route path="reviews">
            <Route index element={<ReviewsList />} />
            <Route path="new" element={<CreateReview />} />
            <Route path=":id/edit" element={<EditReview />} />
          </Route>

          {/* Distributors Routes */}
          <Route path="distributors">
            <Route index element={<DistributorsList />} />
            <Route path="new" element={<CreateDistributor />} />
            <Route path=":id/edit" element={<EditDistributor />} />
          </Route>

          {/* Projects Routes */}
          <Route path="our-projects">
            <Route index element={<ProjectsList />} />
            <Route path="new" element={<CreateProject />} />
            <Route path=":id/edit" element={<EditProject />} />
          </Route>
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
