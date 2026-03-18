import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useGetCompanyApplicationsQuery, useUpdateApplicationStatusMutation } from "../../store/api/applicationApi";

function CompanyApplications() {
  const { data: applications, isLoading, isError } = useGetCompanyApplicationsQuery(undefined);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();
  const [filter, setFilter] = useState("ALL");

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err: any) {
      alert(err.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const filteredApps = applications?.filter((app: any) => {
    if (filter === "ALL") return true;
    return app.status === filter;
  });

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Candidatures Reçues</h2>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px" }}
            >
              <option value="ALL">Toutes</option>
              <option value="PENDING">En attente</option>
              <option value="ACCEPTED">Acceptées</option>
              <option value="REJECTED">Refusées</option>
            </select>
          </div>

          <div className="applications-list" style={{ marginTop: "20px" }}>
            {isLoading && <p>Chargement...</p>}
            {isError && <p>Erreur lors du chargement des candidatures</p>}
            {!isLoading && (!applications || applications.length === 0) && (
              <p>Aucune candidature reçue pour le moment.</p>
            )}

            {filteredApps?.map((app: any) => (
              <div key={app.id} className="application-item" style={{ background: "white", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ margin: "0 0 5px 0" }}>{app.candidate?.nom}</h4>
                  <p style={{ margin: 0, color: "#666" }}>Poste: <strong>{app.job?.title}</strong></p>
                  <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem" }}>Message: {app.message || "Aucun message"}</p>
                  <div style={{ marginTop: "10px" }}>
                    {app.candidate?.cv && (
                      <a href={`http://localhost:5000/uploads/${app.candidate.cv}`} target="_blank" rel="noreferrer" style={{ marginRight: "10px", color: "blue", textDecoration: "underline" }}>
                        Voir CV
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "end", gap: "10px" }}>
                  <span style={{ 
                    padding: "4px 8px", 
                    borderRadius: "4px", 
                    fontSize: "0.85rem",
                    backgroundColor: app.status === "PENDING" ? "#fff3cd" : 
                                    app.status === "ACCEPTED" ? "#d1e7dd" : "#f8d7da",
                    color: app.status === "PENDING" ? "#856404" : 
                           app.status === "ACCEPTED" ? "#0f5132" : "#842029"
                  }}>
                    {app.status}
                  </span>

                  {app.status === "PENDING" && (
                    <div className="actions">
                      <button 
                        onClick={() => handleStatusChange(app.id, "ACCEPTED")}
                        disabled={isUpdating}
                        style={{ marginRight: "5px", background: "#d1e7dd", color: "#0f5132", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Accepter
                      </button>
                      <button 
                        onClick={() => handleStatusChange(app.id, "REJECTED")}
                        disabled={isUpdating}
                        style={{ background: "#f8d7da", color: "#842029", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyApplications;
