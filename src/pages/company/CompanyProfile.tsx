import { useState, useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useGetCompanyProfileQuery, useUpdateCompanyProfileMutation } from "../../store/api/companyApi";

type CompanyFormState = {
  nom_entreprise: string;
  secteur: string;
  site_web: string;
  description: string;
  adresse: string;
  email: string; // usually read-only
};

function CompanyProfile() {
  const { data, isLoading, isError } = useGetCompanyProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateCompanyProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<CompanyFormState>({
    nom_entreprise: "",
    secteur: "",
    site_web: "",
    description: "",
    adresse: "",
    email: "",
  });
  
  const [logo, setLogo] = useState<File | null>(null);

  const uploadUrl = import.meta.env.VITE_UPLOAD_URL || "http://localhost:5000/uploads";

  useEffect(() => {
    if (data) {
      setForm({
        nom_entreprise: data.nom_entreprise || "",
        secteur: data.secteur || "",
        site_web: data.site_web || "",
        description: data.description || "",
        adresse: data.adresse || "",
        email: data.email || "",
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (logo) {
      formData.append("logo", logo);
    }

    try {
      await updateProfile(formData).unwrap();
      setIsEditing(false);
      alert("Profil mis à jour avec succès");
    } catch (err: any) {
      console.error("Update failed", err);
      alert(err.data?.message || "Erreur lors de la mise à jour");
    }
  };

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors du chargement du profil</p>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header">
            <h2>Profil de l'entreprise</h2>
          </div>

          <div className="profile-card" style={{ display: "flex", gap: "30px", padding: "20px", background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <div className="profile-left" style={{ textAlign: "center", minWidth: "200px" }}>
              <img 
                src={data?.logo ? `${uploadUrl}/${data.logo}` : "/default-company.png"} 
                alt="Logo" 
                style={{ width: "150px", height: "150px", objectFit: "contain", borderRadius: "8px", border: "1px solid #eee" }}
              />
              {isEditing && (
                <div style={{ marginTop: "10px" }}>
                  <label htmlFor="logo-upload" className="btn-secondary" style={{ cursor: "pointer", display: "inline-block", padding: "5px 10px", fontSize: "0.9rem" }}>
                    Changer le logo
                  </label>
                  <input 
                    id="logo-upload" 
                    type="file" 
                    onChange={(e) => setLogo(e.target.files?.[0] || null)} 
                    style={{ display: "none" }} 
                  />
                  {logo && <p style={{ fontSize: "0.8rem", marginTop: "5px" }}>{logo.name}</p>}
                </div>
              )}
            </div>

            <div className="profile-right" style={{ flex: 1 }}>
              {!isEditing ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <h2 style={{ marginTop: 0 }}>{data.nom_entreprise}</h2>
                    <button className="btn-primary" onClick={() => setIsEditing(true)}>Modifier</button>
                  </div>
                  <p><strong>Secteur:</strong> {data.secteur}</p>
                  <p><strong>Site web:</strong> <a href={data.site_web} target="_blank" rel="noopener noreferrer">{data.site_web}</a></p>
                  <p><strong>Email:</strong> {data.email}</p>
                  <p><strong>Adresse:</strong> {data.adresse}</p>
                  <div style={{ marginTop: "20px" }}>
                    <h4>Description</h4>
                    <p>{data.description || "Aucune description fournie."}</p>
                  </div>
                </>
              ) : (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Nom de l'entreprise</label>
                    <input name="nom_entreprise" value={form.nom_entreprise} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Secteur d'activité</label>
                    <input name="secteur" value={form.secteur} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Site web</label>
                    <input name="site_web" value={form.site_web} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Adresse</label>
                    <input name="adresse" value={form.adresse} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      name="description" 
                      value={form.description} 
                      onChange={handleChange} 
                      rows={5}
                      style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                    />
                  </div>
                  <div className="button-group" style={{ marginTop: "20px" }}>
                    <button className="btn-primary" onClick={handleSave} disabled={isUpdating}>
                      {isUpdating ? "Enregistrement..." : "Enregistrer"}
                    </button>
                    <button className="btn-secondary" onClick={() => setIsEditing(false)} style={{ marginLeft: "10px" }}>
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfile;
