import { useNavigate, Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import { useLoginMutation } from "../../store/api/authApi";
import { UserRole } from "../../types/roles";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role: urlRole } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();

      const { user, token } = res;

      dispatch(
        setCredentials({
          user,
          token,
        })
      );

      // Navigate based on role
      if (user.role === UserRole.CANDIDAT) {
        navigate("/candidate/dashboard");
      } else if (user.role === UserRole.ENTREPRISE) {
        navigate("/company/dashboard");
      } else if (user.role === UserRole.ADMIN) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error?.data?.message || "Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/")}
        >
          Annuler
        </button>

        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <Link to={`/forgot-password/${urlRole}`}>
            Mot de passe oublié ?
          </Link>
        </div>

        <div style={{ marginTop: "10px", textAlign: "center" }}>
          Pas de compte ?{" "}
          <Link to={`/register/${urlRole}`}>
            Créer un compte
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
