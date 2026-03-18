import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import { UserRole } from "../types/roles";

import Home from "../pages/Home";
// ... (rest of imports unchanged)
import RolePage from "../pages/RolePage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import CandidateDashboard from "../pages/candidate/Dashboard";
import CandidateProfile from "../pages/candidate/Profile";
import CandidateJobs from "../pages/candidate/Jobs";
import CandidateJobDetails from "../pages/candidate/JobDetails";
import CandidateApplications from "../pages/candidate/Applications";
import CandidateApplicationDetails from "../pages/candidate/ApplicationDetails";
import CandidateVisa from "../pages/candidate/Visa";
import ResumeTools from "../pages/candidate/ResumeTools";
{/*import Settings from "../pages/candidate/Settings";*/}

import CompanyDashboard from "../pages/company/Dashboard";
import CompanyProfile from "../pages/company/CompanyProfile";
import CompanyJobs from "../pages/company/Jobs";
import CompanyReports from "../pages/company/Reports";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminStatistics from "../pages/admin/Statistics";

import Notifications from "../pages/Notifications";
import NotFound from "../pages/errors/NotFound";
import Unauthorized from "../pages/errors/Unauthorized";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/role/:role" element={<RolePage />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/register/:role" element={<Register />} />
      <Route path="/forgot-password/:role" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes (Authenticated only) */}
      <Route element={<PrivateRoute />}>
        <Route path="/notifications" element={<Notifications />} />

        {/* Candidate Only Routes */}
        <Route element={<RoleRoute allowedRoles={[UserRole.CANDIDAT]} />}>
          <Route path="/candidate" element={<Navigate to="/candidate/dashboard" />} />
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route path="/candidate/jobs" element={<CandidateJobs />} />
          <Route path="/candidate/jobs/:id" element={<CandidateJobDetails />} />
          <Route path="/candidate/applications" element={<CandidateApplications />} />
          <Route path="/candidate/applications/:id" element={<CandidateApplicationDetails />} />
          <Route path="/candidate/visa" element={<CandidateVisa />} />
          <Route path="/candidate/resume-tools" element={<ResumeTools />} />
          {/*<Route path="/candidate/settings" element={<Settings />} />*/}
        </Route>

        {/* Company Only Routes */}
        <Route element={<RoleRoute allowedRoles={[UserRole.ENTREPRISE]} />}>
          <Route path="/company" element={<Navigate to="/company/dashboard" />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/profile" element={<CompanyProfile />} />
          <Route path="/company/jobs" element={<CompanyJobs />} />
          <Route path="/company/reports" element={<CompanyReports />} />
        </Route>

        {/* Admin Only Routes */}
        <Route element={<RoleRoute allowedRoles={[UserRole.ADMIN]} />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/statistics" element={<AdminStatistics />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
