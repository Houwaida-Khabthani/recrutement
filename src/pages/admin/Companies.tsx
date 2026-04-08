import React, { useState } from 'react';
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useGetAllCompaniesQuery, useDeleteCompanyMutation, useCreateCompanyMutation, useUpdateCompanyMutation } from "../../store/api/adminApi";

function AdminCompanies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    email: '',
    secteur: '',
    id_user: ''
  });

  const { data: companies, isLoading, isError, refetch } = useGetAllCompaniesQuery({
    search: searchTerm
  });
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();
  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette entreprise ?")) {
      try {
        await deleteCompany(id).unwrap();
        refetch();
        alert("Entreprise supprimée avec succès");
      } catch (err: any) {
        alert(err.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCompany(formData).unwrap();
      setShowCreateForm(false);
      setFormData({
        nom: '',
        description: '',
        email: '',
        secteur: '',
        id_user: ''
      });
      refetch();
      alert("Entreprise créée avec succès");
    } catch (err: any) {
      alert(err.data?.message || "Erreur lors de la création");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;
    try {
      await updateCompany({ id: editingCompany.id_company, ...formData }).unwrap();
      setEditingCompany(null);
      setFormData({
        nom: '',
        description: '',
        email: '',
        secteur: '',
        id_user: ''
      });
      refetch();
      alert("Entreprise mise à jour avec succès");
    } catch (err: any) {
      alert(err.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const startEdit = (company: any) => {
    setEditingCompany(company);
    setFormData({
      nom: company.nom || '',
      description: company.description || '',
      email: company.email || '',
      secteur: company.secteur || '',
      id_user: company.id_user || ''
    });
  };

  const cancelEdit = () => {
    setEditingCompany(null);
    setShowCreateForm(false);
    setFormData({
      nom: '',
      description: '',
      email: '',
      secteur: '',
      id_user: ''
    });
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header">
            <h2>Gestion des Entreprises</h2>
            <p>CRUD complet des entreprises avec recherche</p>
          </div>

          {/* Search and Filters */}
          <div style={{ marginTop: "20px", marginBottom: "20px", display: "flex", gap: "15px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Rechercher par nom d'entreprise ou utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", minWidth: "250px" }}
            />
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                background: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              + Nouvelle Entreprise
            </button>
          </div>

          {/* Create/Edit Form */}
          {(showCreateForm || editingCompany) && (
            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              marginBottom: "20px"
            }}>
              <h3>{editingCompany ? 'Modifier Entreprise' : 'Créer Entreprise'}</h3>
              <form onSubmit={editingCompany ? handleUpdate : handleCreate}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginTop: "15px" }}>
                  <div>
                    <label>Nom de l'entreprise:</label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      required
                      style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                  </div>
                  <div>
                    <label>Email:</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                  </div>
                  <div>
                    <label>Secteur:</label>
                    <input
                      type="text"
                      value={formData.secteur}
                      onChange={(e) => setFormData({...formData, secteur: e.target.value})}
                      required
                      style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                  </div>
                  <div>
                    <label>ID Utilisateur:</label>
                    <input
                      type="number"
                      value={formData.id_user}
                      onChange={(e) => setFormData({...formData, id_user: e.target.value})}
                      required
                      style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label>Description:</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    style={{
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "10px"
                    }}
                  >
                    {editingCompany ? 'Mettre à jour' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    style={{
                      background: "#6c757d",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Companies Table */}
          <div className="companies-table-container" style={{ marginTop: "20px", background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            {isLoading && <p>Chargement...</p>}
            {isError && <p>Erreur lors du chargement des entreprises</p>}

            {!isLoading && companies && (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>ID</th>
                    <th style={{ padding: "10px" }}>Nom</th>
                    <th style={{ padding: "10px" }}>Email</th>
                    <th style={{ padding: "10px" }}>Secteur</th>
                    <th style={{ padding: "10px" }}>Utilisateur</th>
                    <th style={{ padding: "10px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company: any) => (
                    <tr key={company.id_company} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "10px" }}>{company.id_company}</td>
                      <td style={{ padding: "10px" }}>{company.nom}</td>
                      <td style={{ padding: "10px" }}>{company.email}</td>
                      <td style={{ padding: "10px" }}>{company.secteur}</td>
                      <td style={{ padding: "10px" }}>{company.user_name} ({company.email})</td>
                      <td style={{ padding: "10px" }}>
                        <button
                          onClick={() => startEdit(company)}
                          style={{
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "5px"
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(company.id_company)}
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

export default AdminCompanies;