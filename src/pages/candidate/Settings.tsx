import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import JobCard from "../../components/cards/JobCard";
import { useGetRecommendedJobsQuery } from "../../store/api/jobApi";

function Dashboard() {
  const navigate = useNavigate();

  const { 
    data: jobs, 
    isLoading, 
    isError 
  } = useGetRecommendedJobsQuery(undefined);

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="content">
          {/* HERO */}
          <div className="hero">
            <h3>Bonjour</h3>
            <p>
              Vous avez 0 nouvelles notifications et 0 candidatures cette semaine
            </p>

            <button
              className="btn-primary"
              onClick={() => navigate("/candidate/jobs")}
            >
              Parcourir les emplois
            </button>

            <button
              className="btn-secondary"
              onClick={() => navigate("/candidate/interview")}
            >
              Passer un entretien blanc
            </button>
          </div>

          {/* STATS */}
          <div className="cards">
            <div className="card">
              <h4>Profil complété</h4>
              <p>0%</p>
            </div>

            <div className="card">
              <h4>Candidatures cette semaine</h4>
              <p>0</p>
            </div>

            <div className="card">
              <h4>Série d'apprentissage</h4>
              <p>0 jours</p>
            </div>
          </div>

          {/* JOBS SECTION */}
          <div className="jobs-section">
            <div className="jobs-header">
              <h3>Emplois recommandés</h3>
              <button
                className="btn-link"
                onClick={() => navigate("/candidate/jobs")}
              >
                Voir tout
              </button>
            </div>

            {isLoading && <p>Chargement des emplois...</p>}

            {isError && <p>Erreur lors du chargement des emplois</p>}

            {!isLoading && (!jobs || jobs.length === 0) && (
              <p>Aucun emploi disponible</p>
            )}

            <div className="jobs-grid">
              {jobs?.map((job: any) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
