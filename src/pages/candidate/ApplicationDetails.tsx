import { useParams } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useGetMyApplicationsQuery } from "../../store/api/applicationApi";

function ApplicationDetails() {
  const { id } = useParams();
  const { data: applications, isLoading, isError } = useGetMyApplicationsQuery(undefined);

  const application = applications?.find((app: any) => app.id === id);

  if (isLoading) return <p>Chargement...</p>;
  if (isError || !application) return <p>Erreur: Candidature introuvable</p>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="application-details-header">
            <h2>Détails de la candidature</h2>
            <h3>Poste: {application.job?.title}</h3>
            <p>Entreprise: {application.job?.company?.name}</p>
          </div>

          <div style={{ marginTop: "20px" }}>
            <p><strong>Statut:</strong> {application.status}</p>
            <p><strong>Postulé le:</strong> {new Date(application.createdAt).toLocaleString()}</p>
            <p><strong>Votre message:</strong> {application.message || "Aucun message fourni"}</p>
          </div>

          <div className="job-info" style={{ marginTop: "30px", padding: "20px", border: "1px solid #eee", borderRadius: "8px" }}>
            <h4>Informations sur l'offre</h4>
            <p><strong>Lieu:</strong> {application.job?.location}</p>
            <p><strong>Type de contrat:</strong> {application.job?.contractType}</p>
            <p><strong>Description:</strong></p>
            <p>{application.job?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetails;
