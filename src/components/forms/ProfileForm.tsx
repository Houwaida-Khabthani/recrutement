import { useState, useEffect } from "react";
import { useUpdateMeMutation, useDeleteMeMutation } from "../../store/api/authApi";
import { logout } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProfileForm({ profile, setProfile }: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(profile);
  
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
  const [deleteMe, { isLoading: isDeleting }] = useDeleteMeMutation();

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await updateMe(formData).unwrap();
      setProfile(formData);
      alert("Profil mis à jour ✔️");
    } catch (error) {
      console.error("Update profile error:", error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
      try {
        await deleteMe(null).unwrap();
        alert("Compte supprimé ❗");
        dispatch(logout());
        navigate("/login/candidate"); // Or default login
      } catch (error) {
        console.error("Delete account error:", error);
        alert("Erreur lors de la suppression du compte");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nom" value={formData?.nom || ""} onChange={handleChange} placeholder="Nom" />
      <input name="telephone" value={formData?.telephone || ""} onChange={handleChange} placeholder="Téléphone" />
      <input name="pays" value={formData?.pays || ""} onChange={handleChange} placeholder="Pays" />
      <input name="adresse" value={formData?.adresse || ""} onChange={handleChange} placeholder="Adresse" />

      <select name="civilite" value={formData?.civilite || ""} onChange={handleChange}>
        <option value="">Civilité</option>
        <option value="Mr">Mr</option>
        <option value="Mme">Mme</option>
        <option value="Mlle">Mlle</option>
      </select>

      <input type="date" name="date_naissance" value={formData?.date_naissance || ""} onChange={handleChange} />
      <input name="niveau_etude" value={formData?.niveau_etude || ""} onChange={handleChange} placeholder="Niveau d'étude" />
      <input name="specialite" value={formData?.specialite || ""} onChange={handleChange} placeholder="Spécialité" />
      <input name="experience" value={formData?.experience || ""} onChange={handleChange} placeholder="Expérience" />
      <input name="cv" value={formData?.cv || ""} onChange={handleChange} placeholder="Lien CV" />

      <button type="submit" disabled={isUpdating}>
        {isUpdating ? "Enregistrement..." : "Enregistrer"}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        style={{ marginLeft: 10, color: "red" }}
        disabled={isDeleting}
      >
        {isDeleting ? "Suppression..." : "Supprimer Compte"}
      </button>
    </form>
  );
}
