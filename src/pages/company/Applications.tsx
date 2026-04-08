import React, { useState } from 'react';
import { 
  useGetCompanyApplicationsQuery, 
  useUpdateApplicationStatusMutation 
} from '../../store/api/applicationApi';
import { 
  Users, 
  Clock, 
  Search,
  Filter,
  Mail,
  MapPin,
  Briefcase,
  FileText, 
  Globe,
  X,
  Phone,
  GraduationCap
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Applications: React.FC = () => {
  const { data: applications = [], isLoading, refetch } = useGetCompanyApplicationsQuery({});
  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();

  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);

  const getField = (candidate: any, ...keys: string[]) =>
    keys.find((key) => candidate?.[key]) ? candidate[keys.find((key) => candidate?.[key]) as string] : '';

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

  const normalizeUrl = (value?: string) => {
    if (!value) return '';
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `https://${value}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Syncing recruitment pipeline...</p>
      </div>
    );
  }



  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      refetch();
    } catch (err) {
      alert('Status sync failed');
    }
  };

  const openProfile = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowProfile(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACCEPTED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'REJECTED': return 'bg-red-50 text-red-600 border-red-100';
      case 'INTERVIEW': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'UNDER_REVIEW': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 p-8 pt-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
            Recruitment Board
            <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded font-black tracking-widest uppercase">REAL DATA</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-lg italic">"Manage your future talent today."</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search talent..." 
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-slate-100 focus:border-slate-900 transition-all w-72 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Pipeline Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-slate-100 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Queue Size</p>
            <p className="text-3xl font-black text-slate-900">{applications?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-slate-100 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Pending Sync</p>
            <p className="text-3xl font-black text-slate-900">
              {applications?.filter((a: any) => a.statut === 'PENDING').length || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl hover:shadow-slate-100 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Board Match Avg</p>
            <p className="text-3xl font-black text-slate-900">
              {applications?.length > 0
                ? Math.round(applications.reduce((acc: number, curr: any) => acc + (curr.matching_score || 0), 0) / applications.length)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Unified Data Board */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                <th className="px-6 py-6 font-black">Candidate Profile</th>
                <th className="px-6 py-6 font-black">Offer Details</th>
                <th className="px-6 py-6 text-center font-black">Matching Index</th>
                <th className="px-6 py-6 text-center font-black">Recruitment Flow</th>
                <th className="px-6 py-6 font-black text-right pr-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {applications?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center text-slate-300 italic font-bold">No real data found. Sync engine active.</td>
                </tr>
              ) : (
                applications?.map((app: any) => (
                  <tr key={app.id_candidature} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 font-black text-sm group-hover:scale-110 transition-transform">
                          {app.candidate_name?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base">{app.candidate_name}</p>
                          <p className="text-slate-400 text-[11px] font-bold flex items-center gap-1 uppercase tracking-tighter">
                            <MapPin className="w-3 h-3 text-blue-500" />
                            {app.candidate_location || 'REMOTE'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                         <span className="font-black text-slate-700 text-sm mb-1">{app.job_title}</span>
                         <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">POSTED {new Date(app.date_postule).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col items-center">
                        <span className={`text-xl font-black ${app.matching_score >= 80 ? 'text-indigo-600' : 'text-slate-400'}`}>
                          {app.matching_score ? `${app.matching_score}%` : '---'}
                        </span>
                        <div className="w-16 bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                           <div 
                             className={`h-full ${app.matching_score >= 80 ? 'bg-indigo-600' : 'bg-slate-400'}`}
                             style={{ width: `${app.matching_score || 0}%` }}
                           ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                       <select 
                         value={app.statut}
                         disabled={isUpdating}
                         onChange={(e) => handleStatusChange(app.id_candidature, e.target.value)}
                         className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border tracking-[2px] cursor-pointer outline-none transition-all ${getStatusStyle(app.statut)} shadow-sm hover:shadow-md active:scale-95`}
                       >
                         <option value="PENDING">PENDING</option>
                         <option value="UNDER_REVIEW">UNDER REVIEW</option>
                         <option value="INTERVIEW">INTERVIEW</option>
                         <option value="ACCEPTED">ACCEPTED</option>
                         <option value="REJECTED">REJECTED</option>
                       </select>
                    </td>
                    <td className="px-6 py-6 text-right pr-6">
                      <button 
                        onClick={() => openProfile(app)}
                        className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[3px] shadow-lg shadow-slate-200 hover:-translate-y-1 hover:shadow-slate-300 active:scale-95 transition-all"
                      >
                         VIEW PROFILE
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- CANDIDATE PROFILE MODAL --- */}
      {showProfile && selectedCandidate && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 backdrop-blur-2xl bg-white/20 animate-in fade-in duration-500">
           <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col scale-in-center animate-in zoom-in-95">
              
              {/* Cover & Close */}
              <div className="h-40 bg-gradient-to-r from-slate-900 to-indigo-900 relative">
                 <button 
                   onClick={() => setShowProfile(false)}
                   className="absolute top-6 right-6 w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                 >
                    <X className="w-6 h-6" />
                 </button>
              </div>

              {/* Profile Bar */}
              <div className="px-12 relative flex flex-col min-h-0">
                 <div className="absolute -top-16 left-12 w-32 h-32 rounded-[32px] bg-white p-2 shadow-2xl border border-slate-50">
                    {getField(selectedCandidate, 'candidate_avatar', 'avatar') ? (
                      <img
                        src={buildUploadUrl(getField(selectedCandidate, 'candidate_avatar', 'avatar'), 'images')}
                        alt={selectedCandidate.candidate_name}
                        className="w-full h-full object-cover rounded-[24px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 rounded-[24px] flex items-center justify-center text-slate-900 font-black text-3xl">
                        {selectedCandidate.candidate_name?.[0]}
                      </div>
                    )}
                 </div>

                 <div className="mt-20 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-50">
                    <div>
                       <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{selectedCandidate.candidate_name}</h2>
                       <p className="text-indigo-600 font-black text-sm uppercase tracking-widest mb-3">{selectedCandidate.candidate_specialty || 'Professional Candidate'}</p>
                       <div className="flex flex-wrap gap-4 text-slate-400 font-bold text-xs uppercase tracking-tight">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-300" /> {selectedCandidate.candidate_location || 'N/A'}</span>
                          <span className="flex items-center gap-1"><Briefcase className="w-4 h-4 text-slate-300" /> {selectedCandidate.candidate_experience || '---'} EXP</span>
                          <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4 text-slate-300" /> {selectedCandidate.candidate_education || 'GRADUATE'}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button
                          onClick={() => {
                            const cvFile = getField(selectedCandidate, 'candidate_cv_url', 'cv');
                            const cvUrl = buildUploadUrl(cvFile, 'cvs');
                            if (cvUrl) {
                              window.open(cvUrl, '_blank');
                            } else {
                              alert('No resume uploaded by this candidate.');
                            }
                          }}
                          className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all active:scale-95"
                        >
                          <FileText className="w-4 h-4" />
                          DOWNLOAD RESUME
                       </button>
                    </div>
                 </div>

                 {/* Tab Content */}
                 <div className="py-8 flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                       <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] mb-4">Professional Biography</h4>
                          <p className="text-slate-600 leading-relaxed font-medium italic text-sm p-6 bg-slate-50 rounded-3xl border border-slate-100">
                             "{selectedCandidate.candidate_bio || 'No biography provided by candidate yet.'}"
                          </p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <a href={normalizeUrl(getField(selectedCandidate, 'candidate_linkedin', 'linkedin')) || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 transition-all group">
                             <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><FaLinkedin className="w-5 h-5" /></div>
                             <span className="text-xs font-black text-slate-700 tracking-tight">LinkedIn Profile</span>
                          </a>
                          <a href={normalizeUrl(getField(selectedCandidate, 'candidate_github', 'github')) || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 transition-all group">
                             <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><FaGithub className="w-5 h-5" /></div>
                             <span className="text-xs font-black text-slate-700 tracking-tight">Github Portfolio</span>
                          </a>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-2xl shadow-slate-200">
                          <h4 className="text-[10px] text-white/40 font-black uppercase tracking-[4px] mb-4">Contact Info</h4>
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-blue-400" />
                                <span className="text-xs font-bold truncate">{selectedCandidate.candidate_email}</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold">{getField(selectedCandidate, 'candidate_phone', 'telephone') || '+216 -- --- ---'}</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4 text-indigo-400" />
                                {normalizeUrl(getField(selectedCandidate, 'candidate_portfolio', 'portfolio')) ? (
                                  <a
                                    href={normalizeUrl(getField(selectedCandidate, 'candidate_portfolio', 'portfolio'))}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-bold truncate underline underline-offset-2 hover:text-indigo-300"
                                  >
                                    {getField(selectedCandidate, 'candidate_portfolio', 'portfolio')}
                                  </a>
                                ) : (
                                  <span className="text-xs font-bold">No portfolio link</span>
                                )}
                             </div>
                          </div>
                       </div>

                       <div className="p-6 border border-slate-100 bg-slate-50/30 rounded-[32px]">
                          <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-[3px] mb-4">Aeros Internal Status</h4>
                          <div className="flex flex-col gap-3">
                             <div className="flex justify-between items-center text-xs font-black">
                                <span className="text-slate-400 uppercase">Match Confidence</span>
                                <span className="text-indigo-600">{selectedCandidate.matching_score || 0}%</span>
                             </div>
                             <div className="h-1.5 bg-white border border-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${selectedCandidate.matching_score || 0}%` }}></div>
                             </div>
                             <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Applied for {selectedCandidate.job_title}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Applications;