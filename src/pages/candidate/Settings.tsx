import {
  useGetMeQuery,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from "../../store/api/settingsApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { setTheme } from "../../store/slices/uiSlice";

// ✅ IMPORT SAME LAYOUT COMPONENTS
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

const Settings = () => {
  const { data, isLoading, isError } = useGetMeQuery(undefined);
  const [changePassword, { isLoading: isUpdating }] =
    useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeleting }] =
    useDeleteAccountMutation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    if (newPassword.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword }).unwrap();

      localStorage.removeItem("token");

      alert("Mot de passe modifié. Veuillez vous reconnecter 🔐");

      navigate("/login/candidat");
    } catch (err: any) {
      alert(err?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ?"
    );
    if (!confirmDelete) return;

    try {
      await deleteAccount().unwrap();

      localStorage.removeItem("token");

      alert("Compte supprimé ❌");

      navigate("/login/candidat");
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  if (isLoading) return <p className="loading-text">Chargement...</p>;
  if (isError) return <p>Erreur lors du chargement</p>;

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="content">
          <div className="settings-page">
            <div className="settings-container">

              <h1 style={{ textAlign: "center" }}>⚙️ Paramètres</h1>

              {/* EMAIL */}
              <div className="settings-card">
                <h3>Adresse e-mail</h3>
                <p>{data?.email}</p>
              </div>

              {/* CHANGE PASSWORD */}
              <div className="settings-card">
                <h3>🔐 Modifier le mot de passe</h3>

                <div className="form-group">
                  <label>Mot de passe actuel</label>
                  <input
                    type="password"
                    placeholder="Entrez votre mot de passe actuel"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Nouveau mot de passe</label>
                  <input
                    type="password"
                    placeholder="Entrez un nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <button
                  className="btn-primary"
                  onClick={handleChangePassword}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Mise à jour..." : "Mettre à jour"}
                </button>
              </div>

              {/* THEME */}
              <div className="settings-card">
                <h3>🎨 Thème</h3>

                <div className="form-group">
                  <label>Choisir un thème</label>
                  <select
                    value={theme}
                    onChange={(e) =>
                      dispatch(setTheme(e.target.value as "light" | "dark"))
                    }
                  >
                    <option value="light">Clair ☀️</option>
                    <option value="dark">Sombre 🌙</option>
                  </select>
                </div>
              </div>

              {/* DELETE ACCOUNT */}
              <div className="settings-card danger">
                <h3>⚠️ Zone dangereuse</h3>
                <p style={{ color: "#ef4444", marginBottom: "10px" }}>
                  Cette action est irréversible. Veuillez confirmer.
                </p>

                <button
                  className="btn-danger"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Suppression..." : "Supprimer le compte"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;