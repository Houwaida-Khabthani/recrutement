import { useState } from "react";
import {
  useGetCandidateProfileQuery,
  useUpdateCandidateProfileMutation,
  useGetCandidateStatsQuery
} from "../../store/api/candidateApi";

type FormState = {
  nom: string;
  telephone: string;
  specialite: string;
  experience: string;
  bio: string;
  niveau_etude: string;
  projets: string;
  langues: string;
  competences: string;
  github: string;
  linkedin: string;
};

const Profile = () => {

  const { data, isLoading, error, refetch } = useGetCandidateProfileQuery(undefined);
  const { data: stats } = useGetCandidateStatsQuery(undefined);
  const [updateProfile] = useUpdateCandidateProfileMutation();

  const [activeTab, setActiveTab] = useState("about");
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<FormState>({
    nom: "",
    telephone: "",
    specialite: "",
    experience: "",
    bio: "",
    niveau_etude: "",
    projets: "",
    langues: "",
    competences: "",
    github: "",
    linkedin: ""
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [certificationFiles, setCertificationFiles] = useState<File[]>([]);

  const [newSkill, setNewSkill] = useState("");

  const uploadUrl =
    import.meta.env.VITE_UPLOAD_URL || "http://localhost:5000/uploads";

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur</div>;
  if (!data) return <div>Aucune donnée</div>;

  /* ---------- EDIT ---------- */

  const handleEdit = () => {
    setForm({ ...data });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm({ ...data });
    setIsEditing(false);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (cvFile) formData.append("cv", cvFile);
    if (portfolioFile) formData.append("portfolio", portfolioFile);

    // ✅ certifications upload
    if (certificationFiles.length > 0) {
      certificationFiles.forEach(file => {
        formData.append("certifications", file);
      });
    }

    await updateProfile(formData).unwrap();

    setIsEditing(false);
    setCvFile(null);
    setPortfolioFile(null);
    setCertificationFiles([]);

    refetch(); // refresh data
  };

  /* ---------- SKILLS ---------- */

  const skillsArray = data.competences
    ? data.competences.split(",").map((s: string) => s.trim())
    : [];

  const addSkill = async () => {
    if (!newSkill.trim()) return;

    const updated = [...skillsArray, newSkill.trim()];

    const formData = new FormData();
    formData.append("competences", updated.join(","));

    await updateProfile(formData);
    setNewSkill("");
  };

  const removeSkill = async (skill: string) => {
    const updated = skillsArray.filter((s: string) => s !== skill);

    const formData = new FormData();
    formData.append("competences", updated.join(","));

    await updateProfile(formData);
  };

  /* ---------- UI ---------- */

  return (
    <div className="profile-page">

      <div className="profile-header">
        <h1>{data.nom}</h1>
        <p>{data.specialite} | {data.experience} ans d'expérience</p>
      </div>

      <div className="profile-card">
        <div className="profile-info">

          <img
            className="profile-avatar"
            src={
              data.avatar
                ? `${uploadUrl}/images/${data.avatar}`
                : "/default-avatar.png"
            }
            alt="Avatar"
          />

          {!isEditing ? (
            <>
              <h2>{data.nom}</h2>
              <p>{data.email}</p>
              <p>{data.telephone}</p>

              <button onClick={handleEdit}>Modifier le profil</button>
            </>
          ) : (

            <div className="edit-form">

              <label>Nom</label>
              <input name="nom" value={form.nom} onChange={handleChange} />

              <label>Téléphone</label>
              <input name="telephone" value={form.telephone} onChange={handleChange} />

              <label>Spécialité</label>
              <input name="specialite" value={form.specialite} onChange={handleChange} />

              <label>Expérience</label>
              <input name="experience" value={form.experience} onChange={handleChange} />

              <label>Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} />

              <label>Niveau d'étude</label>
              <input name="niveau_etude" value={form.niveau_etude} onChange={handleChange} />

              <label>Projets</label>
              <input name="projets" value={form.projets} onChange={handleChange} />

              <label>Langues</label>
              <input name="langues" value={form.langues} onChange={handleChange} />

              {/* ✅ CERTIFICATIONS FILE UPLOAD */}
              <label>Certifications (files)</label>
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setCertificationFiles(
                    e.target.files ? Array.from(e.target.files) : []
                  )
                }
              />

              <label>Compétences</label>
              <input name="competences" value={form.competences} onChange={handleChange} />

              <label>GitHub</label>
              <input name="github" value={form.github} onChange={handleChange} />

              <label>LinkedIn</label>
              <input name="linkedin" value={form.linkedin} onChange={handleChange} />

              <label>CV</label>
              <input type="file" onChange={(e) => setCvFile(e.target.files?.[0] || null)} />

              <label>Portfolio</label>
              <input type="file" onChange={(e) => setPortfolioFile(e.target.files?.[0] || null)} />

              <button onClick={handleSave}>Enregistrer</button>
              <button onClick={handleCancel}>Annuler</button>

            </div>
          )}

        </div>
      </div>

      {/* ✅ STATS */}
      {!isEditing && stats && (
        <div className="stats">
          <div>Total: {stats.total}</div>
          <div>Entretien: {stats.entretien}</div>
          <div>Accepté: {stats.accepte}</div>
          <div>Refusé: {stats.refuse}</div>
        </div>
      )}

      {/* ✅ TABS */}
      {!isEditing && (
        <>
          <div className="profile-tabs">
            <button onClick={() => setActiveTab("about")}>À propos</button>
            <button onClick={() => setActiveTab("experience")}>Expérience</button>
            <button onClick={() => setActiveTab("etude")}>Études</button>
            <button onClick={() => setActiveTab("projets")}>Projets</button>
            <button onClick={() => setActiveTab("langues")}>Langues</button>
            <button onClick={() => setActiveTab("certification")}>Certifications</button>
            <button onClick={() => setActiveTab("competences")}>Compétences</button>
            <button onClick={() => setActiveTab("cv")}>CV</button>
            <button onClick={() => setActiveTab("portfolio")}>Portfolio</button>
          </div>

          <div className="profile-content">

            {activeTab === "about" && <p>{data.bio}</p>}
            {activeTab === "experience" && <p>{data.experience}</p>}
            {activeTab === "etude" && <p>{data.niveau_etude}</p>}
            {activeTab === "projets" && <p>{data.projets}</p>}
            {activeTab === "langues" && <p>{data.langues}</p>}

            {/* ✅ SHOW CERTIFICATIONS FILES */}
            {activeTab === "certification" && (
              <div>
                {data.certifications?.length > 0 ? (
                  data.certifications.map((file: string, i: number) => (
                    <div key={i}>
                      <a
                        href={`${uploadUrl}/certifications/${file}`}
                        target="_blank"
                      >
                        Voir Certification {i + 1}
                      </a>
                    </div>
                  ))
                ) : (
                  <p>Aucune certification</p>
                )}
              </div>
            )}

            {activeTab === "competences" && (
              <div>
                {skillsArray.map((s: string) => (
                  <span key={s}>
                    {s} <button onClick={() => removeSkill(s)}>x</button>
                  </span>
                ))}
                <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                <button onClick={addSkill}>Ajouter</button>
              </div>
            )}

            {activeTab === "cv" && (
              <div>
                {data.cv ? (
                  <a href={`${uploadUrl}/cvs/${data.cv}`} target="_blank">
                    Voir CV
                  </a>
                ) : (
                  <p>Aucun CV ajouté</p>
                )}
              </div>
            )}

            {activeTab === "portfolio" && (
              <div>
                {data.portfolio ? (
                  <a href={`${uploadUrl}/portfolios/${data.portfolio}`} target="_blank">
                    Voir Portfolio
                  </a>
                ) : (
                  <p>Aucun Portfolio ajouté</p>
                )}
              </div>
            )}

          </div>
        </>
      )}

    </div>
  );
};

export default Profile;