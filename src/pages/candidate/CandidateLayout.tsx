import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  BookOpen,
  Mic,
  Globe,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../store/slices/authSlice';
import { useGetCandidateProfileQuery } from '../../store/api/candidateApi';

const sidebarItems = [
  { to: '/candidate/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-400' },
  { to: '/candidate/profile',   icon: User,            label: 'My Profile', color: 'text-violet-400' },
  { to: '/candidate/jobs',      icon: Briefcase,        label: 'Browse Jobs', color: 'text-emerald-400' },
  { to: '/candidate/applications', icon: FileText,      label: 'My Applications', color: 'text-amber-400' },
  { to: '/candidate/resume-tools', icon: BookOpen,      label: 'Resume Tools', color: 'text-sky-400' },
  { to: '/candidate/mock-interviews', icon: Mic,        label: 'Mock Interviews', color: 'text-pink-400' },
  { to: '/candidate/visa',      icon: Globe,            label: 'Visa', color: 'text-indigo-400' },
  { to: '/candidate/settings',  icon: Settings,         label: 'Settings', color: 'text-slate-400' },
];

const CandidateLayout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAppSelector((state: any) => state.auth.user);
  const { data: profileData } = useGetCandidateProfileQuery(undefined, { skip: !user });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login/candidat');
  };

  const initials = user?.nom
    ? user.nom.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'C';

  const buildUploadUrl = (value?: string, folder = '') => {
    if (!value) return '';
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) return value;
    const baseUrl = (import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5000/uploads').replace(/\/$/, '');
    const cleanedValue = value.replace(/^\/+/, '');
    if (cleanedValue.startsWith('uploads/')) {
      return `${baseUrl.replace(/\/uploads$/, '')}/${cleanedValue}`;
    }
    if (cleanedValue.includes('/')) {
      return `${baseUrl}/${cleanedValue.split('/').map(encodeURIComponent).join('/')}`;
    }
    return folder ? `${baseUrl}/${folder}/${encodeURIComponent(cleanedValue)}` : `${baseUrl}/${encodeURIComponent(cleanedValue)}`;
  };

  const avatarValue = profileData?.avatar || user?.avatar || '';
  const avatarUrl = buildUploadUrl(avatarValue, 'images');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ─── SIDEBAR ─── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-black text-lg tracking-tight">TJI</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User card */}
        <div className="mx-4 mt-5 mb-3 p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.nom || 'Candidate avatar'}
                className="w-10 h-10 rounded-xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{user?.nom || 'Candidate'}</p>
              <p className="text-white/40 text-[11px] font-medium truncate">{user?.email || ''}</p>
            </div>
          </div>
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
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? item.color : 'text-white/30 group-hover:text-white/60'} transition-colors`} />
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

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 px-6 h-16 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-slate-900 font-black text-lg tracking-tight">Tunisia Job Innovate</h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hidden md:block">Candidate Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all">
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Profile avatar */}
            <button
              onClick={() => navigate('/candidate/profile')}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.nom || 'Candidate avatar'}
                  className="w-7 h-7 rounded-lg object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-[10px]">
                  {initials}
                </div>
              )}
              <span className="text-sm font-bold text-slate-700 hidden sm:block">{user?.nom?.split(' ')[0] || 'Profile'}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CandidateLayout;
