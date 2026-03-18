import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import JobCard from "../../components/cards/JobCard";
import { useGetJobsQuery } from "../../store/api/jobApi";

function Jobs() {
  const { data: jobs, isLoading, isError } = useGetJobsQuery(undefined);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <div className="content">
          <div className="page-header">
            <h2>Parcourir les emplois</h2>
            <p>Trouvez votre prochaine opportunité</p>
          </div>

          {isLoading && <p>Chargement des offres...</p>}
          {isError && <p>Erreur lors du chargement des offres</p>}
          {!isLoading && (!jobs || jobs.length === 0) && (
            <p>Aucune offre d'emploi disponible pour le moment.</p>
          )}

          <div className="jobs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" }}>
            {jobs?.map((job: any) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;
