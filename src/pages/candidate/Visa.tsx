import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useGetVisaStatusQuery, useUploadVisaDocsMutation } from "../../store/api/visaApi";

function Visa() {
  const { data: visa, isLoading } = useGetVisaStatusQuery(undefined);
  const [uploadDocs, { isLoading: isUploading }] = useUploadVisaDocsMutation();
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Veuillez choisir un fichier");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      await uploadDocs(formData).unwrap();
      alert("Document téléchargé avec succès !");
      setFile(null);
    } catch (err: any) {
      alert(err.data?.message || "Erreur lors du téléchargement");
    }
  };

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header">
            <h2>Gestion du Visa</h2>
            <p>Suivez l'état de vos documents d'immigration</p>
          </div>

          <div className="visa-status-card" style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px", marginTop: "20px" }}>
            <h4>Statut actuel</h4>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: visa?.status === "APPROVED" ? "green" : "orange" }}>
              {visa?.status || "AUCUNE DEMANDE EN COURS"}
            </p>
            {visa?.updatedAt && <p>Dernière mise à jour: {new Date(visa.updatedAt).toLocaleDateString()}</p>}
          </div>

          <div className="upload-section" style={{ marginTop: "30px", padding: "20px", border: "1px solid #eee", borderRadius: "8px" }}>
            <h4>Télécharger de nouveaux documents</h4>
            <form onSubmit={handleUpload} style={{ marginTop: "15px" }}>
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ marginBottom: "15px", display: "block" }}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isUploading || !file}
              >
                {isUploading ? "Téléchargement..." : "Télécharger le document"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Visa;
