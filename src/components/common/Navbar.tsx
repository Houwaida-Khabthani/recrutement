import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { UserRole } from "../../types/roles";
import { useGetNotificationsQuery } from "../../store/api/notificationApi";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const { data: notifications } = useGetNotificationsQuery(undefined, {
    skip: !user
  });

  const unreadCount =
    notifications?.filter((n: any) => !n.lu).length || 0;

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

        {/* notifications */}
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
