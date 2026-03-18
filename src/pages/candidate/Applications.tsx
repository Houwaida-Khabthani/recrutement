import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import ApplicationCard from "../../components/cards/ApplicationCard";
import { useGetMyApplicationsQuery } from "../../store/api/applicationApi";

function Applications() {
  const { data: applications, isLoading, isError } = useGetMyApplicationsQuery(undefined);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header">
            <h2>Mes candidatures</h2>
            <p>Suivez l'état de vos demandes d'emploi</p>
          </div>

          {isLoading && <p>Chargement de vos candidatures...</p>}
          {isError && <p>Erreur lors du chargement des candidatures</p>}
          {!isLoading && (!applications || applications.length === 0) && (
            <p>Vous n'avez pas encore postulé à des offres.</p>
          )}

          <div className="applications-list" style={{ marginTop: "20px" }}>
            {applications?.map((app: any) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Applications;
