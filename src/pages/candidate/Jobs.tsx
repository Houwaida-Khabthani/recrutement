import { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchJobs } from "../../store/slices/jobSlice";

interface Job {
  id_offre: number;
  titre: string;
  description: string;
  localisation: string;
}

function Jobs() {
  const dispatch = useAppDispatch();
  const { jobs, loading } = useAppSelector((state) => state.jobs);
  const { user } = useAppSelector((state) => state.auth);

  const [page, setPage] = useState<
    "list" | "details" | "email" | "code" | "cv" | "done"
  >("list");

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [code, setCode] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // =========================
  // ✅ FAKE JOBS
  // =========================
  const fakeJobs: Job[] = [
    {
      id_offre: 1,
      titre: "Frontend React Developer",
      description: "React + Tailwind + API",
      localisation: "Tunis",
    },
    {
      id_offre: 2,
      titre: "Backend Node.js Developer",
      description: "Express + MySQL",
      localisation: "Sfax",
    },
  ];

  const displayedJobs = jobs?.length ? jobs : fakeJobs;

  // =========================
  // 📩 SEND CODE
  // =========================
  const sendCode = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("❌ Vous devez être connecté");
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/auth/send-code",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("📩 Code envoyé à " + user?.email);
      setPage("code");
    } catch (err: any) {
      alert(err.message || "❌ Erreur envoi code");
    }
  };

  // =========================
  // ✅ VERIFY CODE (FIXED)
  // =========================
  const verifyCode = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("❌ Vous devez être connecté");
        return;
      }

      if (!code || code.trim() === "") {
        alert("❗ Entrez le code");
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/auth/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // ✅ FIX
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code: code.trim(), // ✅ FIX
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("✅ Code vérifié !");
      setPage("cv");
    } catch (err: any) {
      alert(err.message || "❌ Code incorrect");
    }
  };

  // =========================
  // 📄 APPLY
  // =========================
  const submitApplication = async () => {
    if (!cvFile || !selectedJob) {
      alert("❗ Upload CV");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("❌ Vous devez être connecté");
        return;
      }

      const formData = new FormData();
      formData.append("cv", cvFile);

      const res = await fetch(
        `http://localhost:5000/api/applications/apply/${selectedJob.id_offre}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("✅ Candidature envoyée !");
      setPage("done");
    } catch (err: any) {
      alert(err.message || "❌ Erreur candidature");
    }
  };

  // =========================
  // 🔙 NAVIGATION
  // =========================
  const goBack = () => {
    if (page === "details") setPage("list");
    else if (page === "email") setPage("details");
    else if (page === "code") setPage("email");
    else if (page === "cv") setPage("code");
    else if (page === "done") setPage("list");
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="content">
          {/* LIST */}
          {page === "list" && (
            <>
              <h2>Parcourir les emplois</h2>

              {loading && <p>Chargement...</p>}

              <div className="jobs-grid">
                {displayedJobs.map((job: Job) => (
                  <div key={job.id_offre} className="card">
                    <h3>{job.titre}</h3>
                    <p>{job.localisation}</p>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setSelectedJob(job);
                          setPage("details");
                        }}
                      >
                        Détails
                      </button>

                      <button
                        className="btn-primary"
                        onClick={() => {
                          setSelectedJob(job);
                          setPage("email");
                        }}
                      >
                        Postuler
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* DETAILS */}
          {page === "details" && selectedJob && (
            <div className="card">
              <h2>{selectedJob.titre}</h2>
              <p><b>Localisation:</b> {selectedJob.localisation}</p>
              <p><b>Description:</b> {selectedJob.description}</p>

              <button className="btn-primary" onClick={() => setPage("email")}>
                Postuler
              </button>

              <button className="btn-secondary" onClick={goBack}>
                Retour
              </button>
            </div>
          )}

          {/* EMAIL */}
          {page === "email" && (
            <div className="card">
              <h3>Confirmer votre email</h3>
              <p>{user?.email}</p>

              <button className="btn-primary" onClick={sendCode}>
                Envoyer code
              </button>

              <button className="btn-secondary" onClick={goBack}>
                Retour
              </button>
            </div>
          )}

          {/* CODE */}
          {page === "code" && (
            <div className="card">
              <h3>Entrer le code</h3>

              <input
                placeholder="Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              <button className="btn-primary" onClick={verifyCode}>
                Vérifier
              </button>
            </div>
          )}

          {/* CV */}
          {page === "cv" && (
            <div className="card">
              <h3>Uploader votre CV</h3>

              <input
                type="file"
                onChange={(e) =>
                  setCvFile(e.target.files?.[0] || null)
                }
              />

              <button className="btn-primary" onClick={submitApplication}>
                Postuler
              </button>
            </div>
          )}

          {/* DONE */}
          {page === "done" && (
            <div className="card">
              <h2>🎉 Candidature envoyée !</h2>

              <button onClick={() => setPage("list")}>
                Retour aux emplois
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;