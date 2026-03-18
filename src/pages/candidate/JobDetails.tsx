import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useGetJobByIdQuery } from "../../store/api/jobApi";
import { useApplyToJobMutation } from "../../store/api/applicationApi";
import { useState } from "react";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading, isError } = useGetJobByIdQuery(id!);

  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();

  const [message, setMessage] = useState("");

  const handleApply = async () => {
    if (!id) return;

    try {
      await applyToJob({
        jobId: id,
        data: { message },
      }).unwrap();

      alert("Candidature envoyée avec succès !");
      navigate("/candidate/applications");

    } catch (err: any) {
      alert(err?.data?.message || "Erreur lors de la candidature");
    }
  };

  if (isLoading) return <p>Chargement...</p>;
  if (isError || !job) return <p>Erreur: Offre introuvable</p>;

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="content">
          <div className="job-details-header">
            <h2>{job.title}</h2>
            <h3>{job.company?.name}</h3>
            <p>
              {job.location} | {job.contractType}
            </p>
          </div>

          <div className="job-description" style={{ marginTop: "20px" }}>
            <h4>Description du poste</h4>
            <p>{job.description}</p>
          </div>

          <div
            className="apply-section"
            style={{
              marginTop: "30px",
              padding: "20px",
              border: "1px solid #eee",
              borderRadius: "8px",
            }}
          >
            <h4>Postuler à cette offre</h4>

            <textarea
              placeholder="Votre message de motivation..."
              style={{
                width: "100%",
                height: "100px",
                marginTop: "10px",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              className="btn-primary"
              style={{ marginTop: "15px" }}
              onClick={handleApply}
              disabled={isApplying}
            >
              {isApplying ? "Envoi..." : "Envoyer ma candidature"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
