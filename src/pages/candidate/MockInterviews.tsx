import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

import {
  useGetInterviewsQuery,
  useConfirmInterviewMutation,
  useCancelInterviewMutation,
  useScheduleInterviewMutation,
} from "../../store/api/interviewApi";

const Interviews = () => {
  const { data, isLoading, error, refetch } = useGetInterviewsQuery(undefined);

  const [confirmInterview] = useConfirmInterviewMutation();
  const [cancelInterview] = useCancelInterviewMutation();
  const [scheduleInterview] = useScheduleInterviewMutation();

  const [selectedInterview, setSelectedInterview] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  if (isLoading) return <div className="content">Chargement...</div>;
  if (error) return <div className="content">Erreur lors du chargement</div>;

  const interviews = data?.data || [];

  /* ---------- ACTIONS ---------- */

  const handleConfirm = async (id: string) => {
    await confirmInterview(id).unwrap();
    refetch();
  };

  const handleCancel = async (id: string) => {
    await cancelInterview(id).unwrap();
    refetch();
  };

  const handleOpenSchedule = (id: string) => {
    setSelectedInterview(id);
    setShowCalendar(true);
  };

  const handleSchedule = async () => {
    if (!selectedInterview || !selectedDate) return;

    await scheduleInterview({
      id: selectedInterview,
      date: selectedDate,
    }).unwrap();

    setShowCalendar(false);
    setSelectedDate("");
    refetch();
  };

  /* ---------- UI ---------- */

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="content">
          {/* HEADER */}
          <div className="interview-header">
            <h2>Mes Entretiens</h2>
            <p>Gérez vos entretiens programmés et invitations</p>
          </div>

          {/* EMPTY STATE */}
          {interviews.length === 0 && (
            <div className="interview-empty">
              <div className="empty-icon">🎤</div>
              <h3>Aucun entretien disponible</h3>
              <p>Vous n'avez pas encore d'entretiens programmés.</p>
            </div>
          )}

          {/* GRID */}
          <div className="interview-grid">
            {interviews.map((interview: any) => (
              <div key={interview.id} className="interview-card">
                <h3>{interview.jobTitle}</h3>

                <p>
                  <strong>Entreprise:</strong> {interview.company}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {interview.date || "Non programmé"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status ${interview.status}`}>
                    {interview.status}
                  </span>
                </p>

                {/* ACTIONS */}
                <div className="actions">
                  <button
                    className="btn-success"
                    onClick={() => handleConfirm(interview.id)}
                  >
                    Confirmer
                  </button>

                  <button
                    className="btn-danger"
                    onClick={() => handleCancel(interview.id)}
                  >
                    Annuler
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => handleOpenSchedule(interview.id)}
                  >
                    Programmer
                  </button>

                  {interview.meetingLink && (
                    <a href={interview.meetingLink} target="_blank">
                      <button className="btn-primary">
                        Rejoindre
                      </button>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* MODAL */}
          {showCalendar && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Programmer un entretien</h3>

                <input
                  type="datetime-local"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />

                <div className="modal-actions">
                  <button className="btn-primary" onClick={handleSchedule}>
                    Confirmer
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => setShowCalendar(false)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interviews;