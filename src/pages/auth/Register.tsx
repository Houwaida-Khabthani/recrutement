import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRegisterMutation } from "../../store/api/authApi";

function Register() {
  const params = useParams();
  const urlRole = params.role;
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({});
  const [registerUser, { isLoading }] = useRegisterMutation();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!urlRole) return alert("role missing");

    if (form.password !== form.confirmPassword) {
      return alert("Les mots de passe ne correspondent pas");
    }

    // ✅ Validate required fields based on role
    if (urlRole === "CANDIDAT") {
      if (!form.nom?.trim()) {
        return alert("Le nom est obligatoire");
      }
    } else if (urlRole === "ENTREPRISE") {
      if (!form.nom_entreprise?.trim()) {
        return alert("Le nom d'entreprise est obligatoire");
      }
    }

    if (!form.email?.trim()) {
      return alert("L'email est obligatoire");
    }

    if (!form.password?.trim()) {
      return alert("Le mot de passe est obligatoire");
    }

    try {
      const payload: any = {
        ...form,
        role: urlRole,
        mot_de_passe: form.password, // ✅ FIX
      };

      delete payload.password;
      delete payload.confirmPassword;

      await registerUser(payload).unwrap();

      alert("Inscription réussie ✅");
      navigate("/login/" + urlRole);

    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || "Erreur inscription");
    }
  }

  return (
    <div className="auth-container">
      <h2>
        {urlRole === "CANDIDAT"
          ? "Inscription Candidat"
          : "Inscription Entreprise"}
      </h2>

      <form onSubmit={handleSubmit}>
        {urlRole === "CANDIDAT" && (
          <>
            <div className="form-group">
              <input name="nom" placeholder="Nom" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <select name="civilite" onChange={handleChange} required>
                <option value="">Civilité</option>
                <option value="Mr">Mr</option>
                <option value="Mme">Mme</option>
                <option value="Mlle">Mlle</option>
              </select>
            </div>

            <div className="form-group">
              <input type="date" name="date_naissance" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <input name="pays" placeholder="Pays" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <input name="adresse" placeholder="Adresse" onChange={handleChange} required />
            </div>
          </>
        )}

        {urlRole === "ENTREPRISE" && (
          <>
            <div className="form-group">
              <input name="nom_entreprise" placeholder="Nom entreprise" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <input name="secteur" placeholder="Secteur" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <input name="site_web" placeholder="Site web" onChange={handleChange} />
            </div>

            <div className="form-group">
              <input name="adresse" placeholder="Adresse" onChange={handleChange} required />
            </div>
          </>
        )}

        <div className="form-group">
          <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <input type="password" name="confirmPassword" placeholder="Confirmer mot de passe" onChange={handleChange} required />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Inscription..." : "S'inscrire"}
        </button>

        <button type="button" className="btn-secondary" onClick={() => navigate("/")}>
          Annuler
        </button>
      </form>
    </div>
  );
}

export default Register;