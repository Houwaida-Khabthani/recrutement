import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useGetMyJobsQuery, useCreateJobMutation, useDeleteJobMutation } from "../../store/api/jobApi";

type JobFormState = {
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  contractType: string;
};

function CompanyJobs() {
  const { data: jobs, isLoading, isError } = useGetMyJobsQuery(undefined);
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [deleteJob] = useDeleteJobMutation();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<JobFormState>({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    contractType: "CDI",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob(form).unwrap();
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salary: "",
        contractType: "CDI",
      });
      alert("Offre créée avec succès !");
    } catch (err: any) {
      alert(err.data?.message || "Erreur lors de la création");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      try {
        await deleteJob(id).unwrap();
      } catch (err: any) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Gérer les offres</h2>
            <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Fermer le formulaire" : "Publier une offre"}
            </button>
          </div>

          {showForm && (
            <div className="job-form" style={{ background: "white", padding: "20px", borderRadius: "8px", marginTop: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <h3>Nouvelle Offre</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Titre du poste</label>
                  <input name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Lieu</label>
                  <input name="location" value={form.location} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Salaire (optionnel)</label>
                  <input name="salary" value={form.salary} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Type de contrat</label>
                  <select name="contractType" value={form.contractType} onChange={handleChange}>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Stage">Stage</option>
                    <option value="Alternance">Alternance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4} required />
                </div>
                <div className="form-group">
                  <label>Prérequis</label>
                  <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={3} />
                </div>
                <button type="submit" className="btn-primary" disabled={isCreating}>
                  {isCreating ? "Publication..." : "Publier l'offre"}
                </button>
              </form>
            </div>
          )}

          <div className="jobs-list" style={{ marginTop: "30px" }}>
            <h3>Vos offres publiées</h3>
            {isLoading && <p>Chargement...</p>}
            {isError && <p>Erreur chargement des offres</p>}
            {!isLoading && jobs?.length === 0 && <p>Aucune offre publiée pour le moment.</p>}

            {jobs?.map((job: any) => (
              <div key={job.id} className="job-item" style={{ background: "white", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ margin: "0 0 5px 0" }}>{job.title}</h4>
                  <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>{job.location} - {job.contractType}</p>
                  <p style={{ margin: "5px 0 0 0", fontSize: "0.8rem", color: "#888" }}>Publié le {new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  {/* Add Edit button logic later */}
                  <button className="btn-secondary" style={{ marginRight: "10px", color: "red", borderColor: "red" }} onClick={() => handleDelete(job.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyJobs;
