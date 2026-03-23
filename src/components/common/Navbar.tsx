import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { UserRole } from "../../types/roles";
import { useGetNotificationsQuery } from "../../store/api/notificationApi";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const { data: notifications } = useGetNotificationsQuery(undefined, {
    skip: !user
  });

  const unreadCount =
    notifications?.filter((n: any) => !n.lu).length || 0;

  // ✅ DARK MODE STATE
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // ✅ APPLY TO HTML ROOT (FIXED)
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  function toggleTheme() {
    setDarkMode((prev) => !prev);
  }

  function handleProfileClick() {
    if (!user) return;

    if (user.role === UserRole.CANDIDAT) {
      navigate("/candidate/profile");
    } else if (user.role === UserRole.ENTREPRISE) {
      navigate("/company/profile");
    } else if (user.role === UserRole.ADMIN) {
      navigate("/admin/profile");
    }
  }

  return (
    <div className="toolbar">
      <h1>Dashboard</h1>

      <div className="navbar-right">

        {/* search */}
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
        />

        {/* notifications + theme side by side */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          {/* 🔔 notifications */}
          <div
            className="notification"
            onClick={() => navigate("/notifications")}
            style={{ cursor: "pointer", position: "relative" }}
          >
            🔔

            {unreadCount > 0 && (
              <span
                className="notif-count"
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "0.7rem"
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>

          {/* 🌙 DARK MODE BUTTON (NOW BESIDE 🔔) */}
          <button
            onClick={toggleTheme}
            style={{
              cursor: "pointer",
              border: "none",
              background: "transparent",
              fontSize: "18px"
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

        </div>

        {/* user */}
        <div
          className="user-info"
          onClick={handleProfileClick}
          style={{ cursor: "pointer" }}
        >
          <span>{user ? user.nom || user.email : "User"}</span>
        </div>

      </div>
    </div>
  );
}

export default Navbar;