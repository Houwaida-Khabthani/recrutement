import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useGetCompanyStatsQuery } from "../../store/api/companyApi";

function Dashboard() {
  const { data: stats, isLoading, isError } = useGetCompanyStatsQuery(undefined);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header">
            <h2>Tableau de bord Recruteur</h2>
            <p>Vue d'ensemble de vos recrutements</p>
          </div>

          {isLoading && <p>Chargement des statistiques...</p>}
          {isError && <p>Erreur lors du chargement des statistiques</p>}

          {!isLoading && stats && (
            <div className="cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" }}>
              <div className="card" style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center", background: "white" }}>
                <h4>Offres actives</h4>
                <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0" }}>{stats.activeJobs || 0}</p>
              </div>
              <div className="card" style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center", background: "white" }}>
                <h4>Candidatures reçues</h4>
                <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0" }}>{stats.totalApplications || 0}</p>
              </div>
              <div className="card" style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center", background: "white" }}>
                <h4>Entretiens prévus</h4>
                <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0" }}>{stats.scheduledInterviews || 0}</p>
              </div>
            </div>
          )}

          <div className="recent-activity" style={{ marginTop: "30px" }}>
            <h3>Activité récente</h3>
            <p>Chargement des activités...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
