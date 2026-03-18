import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRegisterMutation } from "../../store/api/authApi";

function Register() {
  const params = useParams();
  const urlRole = params.role;
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({});
  const [logo, setLogo] = useState<File | null>(null);

  const [registerUser, { isLoading }] = useRegisterMutation();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setForm({
      ...form,
      [name]: value
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setLogo(e.target.files[0]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!urlRole) {
      alert("role missing");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    if (urlRole === "ENTREPRISE" && !logo) {
      alert("Logo obligatoire pour entreprise");
      return;
    }

    try {
      const data = new FormData();

      for (const key in form) {
        data.append(key, form[key]);
      }

      data.append("role", urlRole);

      if (logo) {
        data.append("logo", logo);
      }

      await registerUser(data).unwrap();

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
                <option value="Mme">Mme</option>
                <option value="M">M</option>
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

            <div className="form-group">
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </>
        )}

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer mot de passe"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Inscription..." : "S'inscrire"}
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/")}
        >
          Annuler
        </button>

      </form>
    </div>
  );
}

export default Register;
