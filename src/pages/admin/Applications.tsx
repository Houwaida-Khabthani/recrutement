import React, { useState } from 'react';
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useGetAllApplicationsQuery, useUpdateApplicationStatusMutation, useDeleteApplicationMutation } from "../../store/api/adminApi";

function AdminApplications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: applications, isLoading, isError, refetch } = useGetAllApplicationsQuery({
    search: searchTerm,
    status: statusFilter
  });
  const [updateApplicationStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();
  const [deleteApplication, { isLoading: isDeleting }] = useDeleteApplicationMutation();

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateApplicationStatus({ id, status }).unwrap();
      refetch();
      alert("Statut de la candidature mis à jour avec succès");
    } catch (err: any) {
      alert(err.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette candidature ?")) {
      try {
        await deleteApplication(id).unwrap();
        refetch();
        alert("Candidature supprimée avec succès");
      } catch (err: any) {
        alert(err.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return '#d4edda';
      case 'REJECTED': return '#f8d7da';
      case 'PENDING': return '#fff3cd';
      case 'UNDER_REVIEW': return '#cce5ff';
      default: return '#f8f9fa';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return '#155724';
      case 'REJECTED': return '#721c24';
      case 'PENDING': return '#856404';
      case 'UNDER_REVIEW': return '#004085';
      default: return '#383d41';
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header">
            <h2>Gestion des Candidatures</h2>
            <p>Gestion complète des candidatures avec recherche et mise à jour des statuts</p>
          </div>

          {/* Search and Filters */}
          <div style={{ marginTop: "20px", marginBottom: "20px", display: "flex", gap: "15px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Rechercher par nom de candidat, poste ou entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", minWidth: "300px" }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px" }}
            >
              <option value="">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="UNDER_REVIEW">En cours d'examen</option>
              <option value="ACCEPTED">Acceptée</option>
              <option value="REJECTED">Rejetée</option>
            </select>
          </div>

          {/* Applications Table */}
          <div className="applications-table-container" style={{ marginTop: "20px", background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            {isLoading && <p>Chargement...</p>}
            {isError && <p>Erreur lors du chargement des candidatures</p>}

            {!isLoading && applications && (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>ID</th>
                    <th style={{ padding: "10px" }}>Candidat</th>
                    <th style={{ padding: "10px" }}>Poste</th>
                    <th style={{ padding: "10px" }}>Entreprise</th>
                    <th style={{ padding: "10px" }}>Statut</th>
                    <th style={{ padding: "10px" }}>Date</th>
                    <th style={{ padding: "10px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application: any) => (
                    <tr key={application.id_candidature} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "10px" }}>{application.id_candidature}</td>
                      <td style={{ padding: "10px" }}>{application.candidate_name}</td>
                      <td style={{ padding: "10px" }}>{application.job_title}</td>
                      <td style={{ padding: "10px" }}>{application.company_name}</td>
                      <td style={{ padding: "10px" }}>
                        <select
                          value={application.statut}
                          onChange={(e) => handleStatusUpdate(application.id_candidature, e.target.value)}
                          disabled={isUpdating}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: getStatusColor(application.statut),
                            color: getStatusTextColor(application.statut),
                            fontWeight: "bold"
                          }}
                        >
                          <option value="PENDING">En attente</option>
                          <option value="UNDER_REVIEW">En cours d'examen</option>
                          <option value="ACCEPTED">Acceptée</option>
                          <option value="REJECTED">Rejetée</option>
                        </select>
                      </td>
                      <td style={{ padding: "10px" }}>
                        {new Date(application.date_candidature).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <button
                          onClick={() => handleDelete(application.id_candidature)}
                          disabled={isDeleting}
                          style={{
                            background: "none",
                            border: "1px solid red",
                            color: "red",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            cursor: "pointer"
                          }}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminApplications;