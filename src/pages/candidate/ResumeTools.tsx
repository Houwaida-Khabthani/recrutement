import { useState, useEffect, ChangeEvent } from "react";
import {
  useGetCandidateProfileQuery,
  useUpdateCandidateProfileMutation,
  useParseCVMutation
} from "../../store/api/candidateApi";

type TabKey =
  | "experience"
  | "education"
  | "projects"
  | "languages"
  | "certifications"
  | "skills";

export default function ResumeTools(): JSX.Element {
  const { data: profile, isLoading } = useGetCandidateProfileQuery();
  const [updateProfile] = useUpdateCandidateProfileMutation();
  const [parseCV] = useParseCVMutation();

  const [activeTab, setActiveTab] = useState<TabKey>("experience");
  const [country, setCountry] = useState<string>("France");

  const [formData, setFormData] = useState<Record<TabKey, string[]>>({
    experience: [],
    education: [],
    projects: [],
    languages: [],
    certifications: [],
    skills: []
  });

  const [inputValue, setInputValue] = useState<string>("");

  const [jobs, setJobs] = useState<any[]>([]);

  const tabs: { id: TabKey; label: string }[] = [
    { id: "experience", label: "Expérience" },
    { id: "education", label: "Études" },
    { id: "projects", label: "Projets" },
    { id: "languages", label: "Langues" },
    { id: "certifications", label: "Certifications" },
    { id: "skills", label: "Compétences" }
  ];

  // 🔄 LOAD PROFILE INTO UI
  useEffect(() => {
    if (profile) {
      setFormData({
        experience: profile.experience || [],
        education: profile.education || [],
        projects: profile.projects || [],
        languages: profile.languages || [],
        certifications: profile.certifications || [],
        skills: profile.skills || []
      });
    }
  }, [profile]);

  // 🔥 FETCH MATCHING JOBS
  useEffect(() => {
    fetch("http://localhost:5000/api/jobs/recommended")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch(console.error);
  }, []);

  // ➕ ADD ITEM + SYNC
  const handleAdd = async (): Promise<void> => {
    if (!inputValue.trim()) return;

    const updated = {
      ...formData,
      [activeTab]: [...formData[activeTab], inputValue]
    };

    setFormData(updated);
    setInputValue("");

    try {
      await updateProfile(updated).unwrap();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // ❌ DELETE ITEM + SYNC
  const handleDelete = async (index: number): Promise<void> => {
    const updated = {
      ...formData,
      [activeTab]: formData[activeTab].filter((_, i) => i !== index)
    };

    setFormData(updated);

    try {
      await updateProfile(updated).unwrap();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // 🤖 AI CV PARSE + AUTO FILL
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);

    try {
      const result = await parseCV(form).unwrap();

      const updated = {
        experience: result.experience || [],
        education: result.education || [],
        projects: result.projects || [],
        languages: result.languages || [],
        certifications: result.certifications || [],
        skills: result.skills || []
      };

      setFormData(updated);

      await updateProfile(updated).unwrap();

      alert("CV analysé et rempli automatiquement ✅");
    } catch (err) {
      console.error(err);
      alert("Erreur parsing CV ❌");
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Outils CV</h1>

      {/* 🤖 Generate CV */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl">
          Générer mon CV avec IA
        </button>
      </div>

      {/* 🌍 Country */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <label className="mr-2">Adapter pour :</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border p-2 rounded"
        >
          <option>France</option>
          <option>Allemagne</option>
          <option>Canada</option>
        </select>
        <button className="ml-3 bg-black text-white px-3 py-2 rounded-xl">
          Adapter mon CV
        </button>
      </div>

      {/* 📑 Tabs */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <div className="flex gap-3 flex-wrap mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-xl ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-3">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ajouter ${activeTab}`}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-3 rounded"
          >
            Ajouter
          </button>
        </div>

        <ul className="space-y-2">
          {formData[activeTab].map((item, index) => (
            <li
              key={index}
              className="flex justify-between bg-gray-100 p-2 rounded"
            >
              {item}
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 📂 Upload CV */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <input type="file" onChange={handleFileChange} />
      </div>

      {/* 🎯 Matching Jobs */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-2">Matching Jobs</h2>
        <ul>
          {jobs.map((job, i) => (
            <li key={i}>
              {job.title} - {job.matchScore}%
            </li>
          ))}
        </ul>
      </div>

      {/* 📄 Export */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <button className="bg-green-600 text-white px-4 py-2 rounded-xl">
          Télécharger CV (PDF)
        </button>
      </div>
    </div>
  );
}