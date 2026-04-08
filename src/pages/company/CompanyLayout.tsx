import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  BarChart,
  Building,
  Settings,
  Search,
  Bell,
  User,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { logout } from '../../store/slices/authSlice';
import { useGetRecruiterProfileQuery } from '../../store/api/companyApi';

const CompanyLayout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s: any) => s.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: recruiterProfileResp } = useGetRecruiterProfileQuery(undefined, { skip: !user });

  const sidebarItems = [
    { to: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/company/jobs', icon: Briefcase, label: 'Job Offers' },
    { to: '/company/users', icon: Users, label: 'Candidates' },
    { to: '/company/platform-activity', icon: FileText, label: 'Applications' },
    { to: '/company/analytics', icon: BarChart, label: 'Analytics' },
    { to: '/company/profile', icon: Building, label: 'Company' },
    { to: '/company/settings', icon: Settings, label: 'Settings' },
  ];

  const buildUploadUrl = (value?: string, folder = '') => {
    if (!value) return '';
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) return value;
    const baseUrl = (import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5000/uploads').replace(/\/$/, '');
    const cleanedValue = value.replace(/^\/+/, '');
    if (cleanedValue.startsWith('uploads/')) return `${baseUrl.replace(/\/uploads$/, '')}/${cleanedValue}`;
    if (cleanedValue.includes('/')) return `${baseUrl}/${cleanedValue.split('/').map(encodeURIComponent).join('/')}`;
    return folder ? `${baseUrl}/${folder}/${encodeURIComponent(cleanedValue)}` : `${baseUrl}/${encodeURIComponent(cleanedValue)}`;
  };

  const company = recruiterProfileResp?.data?.company;
  const companyName = company?.nom || user?.nom_entreprise || user?.nom || 'Recruiter';
  const logoUrl = company?.logo ? buildUploadUrl(company.logo, 'logos') : '';
  const initials = companyName.split(' ').filter(Boolean).map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || 'HR';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login/entreprise');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (candidate-like design) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-black text-lg tracking-tight">TJI</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company card */}
        <div className="mx-4 mt-5 mb-3 p-4 bg-white/5 rounded-2xl border border-white/10">
          <button onClick={() => navigate('/company/my-profile')} className="w-full flex items-center gap-3 text-left">
            {logoUrl ? (
              <img src={logoUrl} alt="Company logo" className="w-10 h-10 rounded-xl object-cover shadow-lg" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{companyName}</p>
              <p className="text-white/40 text-[11px] font-medium truncate">{user?.email || ''}</p>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <p className="text-white/20 text-[9px] font-black uppercase tracking-[3px] px-3 mb-3">Navigation</p>
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/10 shadow-lg'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-white/30 group-hover:text-white/60'} transition-colors`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/30" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 px-6 h-16 flex items-center justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="md:hidden mr-4 p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-slate-900 font-black text-lg tracking-tight">Tunisia Job Innovate</h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hidden md:block">Recruiter Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 rounded-lg hover:bg-slate-100 relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => navigate('/company/my-profile')}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Company logo"
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-[10px]">
                    {initials}
                  </div>
                )}
                <span className="text-sm font-bold text-slate-700 hidden sm:block">Profile</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default CompanyLayout;
