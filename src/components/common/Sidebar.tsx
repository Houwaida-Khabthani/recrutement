import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../store/slices/authSlice";
import { UserRole } from "../../types/roles";

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="sidebar">
      <nav>

        {/* CANDIDATE MENU */}
        {user?.role === UserRole.CANDIDAT && (
          <>
            <NavLink to="/candidate/dashboard">Dashboard</NavLink>
            <NavLink to="/candidate/jobs">Emplois</NavLink>
            <NavLink to="/candidate/learning">Apprentissage</NavLink>
            <NavLink to="/candidate/resume-tools">Outils CV</NavLink>
            <NavLink to="/candidate/mock-interviews">
              Entretiens simulés
            </NavLink>
            
            <NavLink to="/candidate/settings">Paramètres</NavLink>
          </>
        )}

        {/* COMPANY MENU */}
        {user?.role === UserRole.ENTREPRISE && (
          <>
            <NavLink to="/company/dashboard">Dashboard</NavLink>
            <NavLink to="/company/profile">Profil Entreprise</NavLink>
            <NavLink to="/company/jobs">Gérer les Offres</NavLink>
            <NavLink to="/company/reports">Rapports</NavLink>
          </>
        )}

        {/* ADMIN MENU */}
        {user?.role === UserRole.ADMIN && (
          <>
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
            <NavLink to="/admin/users">Utilisateurs</NavLink>
            <NavLink to="/admin/statistics">Statistiques</NavLink>
          </>
        )}

        {/* LOGOUT */}
        <button onClick={handleLogout} className="logout-btn">
          Déconnexion
        </button>

      </nav>
    </div>
  );
};

export default Sidebar;
