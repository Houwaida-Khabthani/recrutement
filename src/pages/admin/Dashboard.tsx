import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useGetStatsQuery } from "../../store/api/adminApi";

function AdminDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useGetStatsQuery(undefined);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

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
            <>
              <div className="cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" }}>
                <div className="card" style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center", background: "white", cursor: "pointer" }} onClick={() => handleNavigate('/admin/users')}>
                  <h4>Total Utilisateurs</h4>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0" }}>{stats.totalUsers || 0}</p>
                  <small style={{ color: "#666" }}>Cliquer pour gérer</small>
                </div>
                <div className="card" style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center", background: "white", cursor: "pointer" }} onClick={() => handleNavigate('/admin/companies')}>
                  <h4>Entreprises</h4>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0" }}>{stats.totalCompanies || 0}</p>
                  <small style={{ color: "#666" }}>Cliquer pour gérer</small>
                </div>
                <div className="card" style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px", textAlign: "center", background: "white", cursor: "pointer" }} onClick={() => handleNavigate('/admin/applications')}>
                  <h4>Candidatures</h4>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "10px 0" }}>{stats.totalApplications || 0}</p>
                  <small style={{ color: "#666" }}>Cliquer pour gérer</small>
                </div>
              </div>

              <div style={{ marginTop: "40px" }}>
                <h3>Gestion Rapide</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "15px", marginTop: "20px" }}>
                  <button
                    onClick={() => handleNavigate('/admin/users')}
                    style={{
                      padding: "15px",
                      background: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "bold"
                    }}
                  >
                    👥 Gérer Utilisateurs
                  </button>
                  <button
                    onClick={() => handleNavigate('/admin/companies')}
                    style={{
                      padding: "15px",
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "bold"
                    }}
                  >
                    🏢 Gérer Entreprises
                  </button>
                  <button
                    onClick={() => handleNavigate('/admin/applications')}
                    style={{
                      padding: "15px",
                      background: "#ffc107",
                      color: "black",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "bold"
                    }}
                  >
                    📋 Gérer Candidatures
                  </button>
                  <button
                    onClick={() => handleNavigate('/admin/statistics')}
                    style={{
                      padding: "15px",
                      background: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "bold"
                    }}
                  >
                    📊 Statistiques
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
