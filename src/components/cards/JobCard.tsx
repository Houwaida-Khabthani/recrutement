import { useState } from "react";
import axios from "axios";

function JobCard({ job }: any) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    try {
      setLoading(true);

      // ⚠️ Replace with real user ID (from auth later)
      const userId = 1;

      await axios.post("http://localhost:5000/api/applications", {
        id_user: userId,
        id_offre: job.id_offre,
      });

      setApplied(true);
    } catch (error) {
      console.error("Erreur candidature:", error);
      alert("Erreur lors de la candidature ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>{job.titre}</h3>

      <p style={{ color: "var(--text-light)" }}>
        📍 {job.localisation} • {job.type_contrat}
      </p>

      {/* DETAILS BUTTON */}
      <button
        className="btn-secondary"
        onClick={() => setOpen(!open)}
      >
        {open ? "Masquer" : "Voir détails"}
      </button>

      {/* APPLY BUTTON */}
      <button
        className="btn-primary"
        onClick={handleApply}
        disabled={loading || applied}
        style={{ marginTop: "10px" }}
      >
        {loading
          ? "Envoi..."
          : applied
          ? "✅ Candidature envoyée"
          : "Postuler"}
      </button>

      {/* DETAILS */}
      {open && (
        <div style={{ marginTop: "15px" }}>
          <p><strong>Description:</strong> {job.description}</p>
          <p><strong>Salaire:</strong> {job.salaire} €</p>
          <p><strong>Expérience:</strong> {job.experience}</p>
        </div>
      )}
    </div>
  );
}

export default JobCard;