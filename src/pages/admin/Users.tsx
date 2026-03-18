import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useGetAllUsersQuery, useDeleteUserMutation } from "../../store/api/adminApi";
import { UserRole } from "../../types/roles";

function AdminUsers() {
  const { data: users, isLoading, isError } = useGetAllUsersQuery(undefined);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await deleteUser(id).unwrap();
        alert("Utilisateur supprimé avec succès");
      } catch (err: any) {
        alert(err.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header">
            <h2>Gestion des Utilisateurs</h2>
            <p>Liste de tous les utilisateurs inscrits</p>
          </div>

          <div className="users-table-container" style={{ marginTop: "20px", background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            {isLoading && <p>Chargement...</p>}
            {isError && <p>Erreur lors du chargement des utilisateurs</p>}
            
            {!isLoading && users && (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>ID</th>
                    <th style={{ padding: "10px" }}>Nom</th>
                    <th style={{ padding: "10px" }}>Email</th>
                    <th style={{ padding: "10px" }}>Rôle</th>
                    <th style={{ padding: "10px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "10px" }}>{user.id}</td>
                      <td style={{ padding: "10px" }}>{user.nom || user.nom_entreprise || "N/A"}</td>
                      <td style={{ padding: "10px" }}>{user.email}</td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ 
                          padding: "4px 8px", 
                          borderRadius: "4px", 
                          fontSize: "0.85rem",
                          backgroundColor: user.role === UserRole.CANDIDAT ? "#e3f2fd" : 
                                          user.role === UserRole.ENTREPRISE ? "#fff3cd" : "#d1e7dd",
                          color: user.role === UserRole.CANDIDAT ? "#0d47a1" : 
                                 user.role === UserRole.ENTREPRISE ? "#856404" : "#0f5132"
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <button 
                          onClick={() => handleDelete(user.id)}
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

export default AdminUsers;
