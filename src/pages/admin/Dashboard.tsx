import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useGetStatsQuery } from "../../store/api/adminApi";

function AdminDashboard() {
  const { data: stats, isLoading, isError } = useGetStatsQuery(undefined);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header">
            <h2>Administration</h2>
            <p>Vue d'ensemble de la plateforme</p>
          </div>

          {isLoading && <p>Chargement...</p>}
          {isError && <p>Erreur lors du chargement des statistiques</p>}

          {!isLoading && stats && (
            <div className="cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" }}>
              <div className="card" style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center", background: "white" }}>
                <h4>Total Utilisateurs</h4>
                <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0" }}>{stats.totalUsers || 0}</p>
              </div>
              <div className="card" style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center", background: "white" }}>
                <h4>Offres d'Emploi</h4>
                <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0" }}>{stats.totalJobs || 0}</p>
              </div>
              <div className="card" style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center", background: "white" }}>
                <h4>Candidatures</h4>
                <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0" }}>{stats.totalApplications || 0}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
