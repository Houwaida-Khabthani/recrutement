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

import CandidateLayout from "../pages/candidate/CandidateLayout";
import CandidateDashboard from "../pages/candidate/Dashboard";
import CandidateProfile from "../pages/candidate/Profile";
import CandidateJobs from "../pages/candidate/Jobs";
import CandidateJobDetails from "../pages/candidate/JobDetails";
import CandidateApplications from "../pages/candidate/Applications";
import CandidateApplicationDetails from "../pages/candidate/ApplicationDetails";
import CandidateVisa from "../pages/candidate/Visa";
import ResumeTools from "../pages/candidate/ResumeTools";
import Settings from "../pages/candidate/Settings";
import MockInterviews from "../pages/candidate/MockInterviews";

import CompanyDashboard from "../pages/company/Dashboard";
import CompanyProfile from "../pages/company/CompanyProfile";
import CompanySettings from "../pages/company/CompanySettings";
import CompanyJobs from "../pages/company/Jobs";
import CompanyReports from "../pages/company/Reports";
import CompanyUsers from "../pages/company/Users";
import CompanyAnalytics from "../pages/company/Analytics";
import CompanyLayout from "../pages/company/CompanyLayout";
import RecruiterProfile from "../pages/company/RecruiterProfile";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminCompanies from "../pages/admin/Companies";
import AdminApplications from "../pages/admin/Applications";
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
          <Route path="/candidate" element={<CandidateLayout />}>
            <Route index element={<CandidateDashboard />} />
            <Route path="dashboard" element={<CandidateDashboard />} />
            <Route path="profile" element={<CandidateProfile />} />
            <Route path="jobs" element={<CandidateJobs />} />
            <Route path="jobs/:id" element={<CandidateJobDetails />} />
            <Route path="applications" element={<CandidateApplications />} />
            <Route path="applications/:id" element={<CandidateApplicationDetails />} />
            <Route path="visa" element={<CandidateVisa />} />
            <Route path="resume-tools" element={<ResumeTools />} />
            <Route path="settings" element={<Settings />} />
            <Route path="mock-interviews" element={<MockInterviews />} />
          </Route>
        </Route>

        {/* Company Only Routes */}
        <Route element={<RoleRoute allowedRoles={[UserRole.ENTREPRISE]} />}>
          <Route path="/company" element={<CompanyLayout />}>
            <Route index element={<CompanyDashboard />} />
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="my-profile" element={<RecruiterProfile />} />
            <Route path="users" element={<CompanyUsers />} />
            <Route path="jobs" element={<CompanyJobs />} />
            <Route path="platform-activity" element={<CompanyReports />} />
            <Route path="analytics" element={<CompanyAnalytics />} />
            <Route path="settings" element={<CompanySettings />} />
            <Route path="profile" element={<CompanyProfile />} />
            <Route path="reports" element={<CompanyReports />} />
          </Route>
        </Route>

        {/* Admin Only Routes */}
        <Route element={<RoleRoute allowedRoles={[UserRole.ADMIN]} />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/companies" element={<AdminCompanies />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/statistics" element={<AdminStatistics />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
