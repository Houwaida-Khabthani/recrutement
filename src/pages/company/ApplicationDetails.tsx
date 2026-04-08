import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetApplicationByIdQuery } from '../../store/api/companyApi';
import Loader from '../../components/common/Loader';

const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: app, isLoading } = useGetApplicationByIdQuery(id!);

  if (isLoading) return <Loader />;

  const candidate = app?.user;
  const job = app?.offre;

  return (
    <div className="page-content">
      <h2>Application Details</h2>
      <section>
        <h3>Candidate Info</h3>
        <p>Name: {candidate?.nom}</p>
        <p>Email: {candidate?.email}</p>
        <p>Phone: {candidate?.telephone}</p>
        <p>Education: {candidate?.niveau_etude} - {candidate?.specialite}</p>
        <p>Experience: {candidate?.experience}</p>
        <p>Portfolio: <a href={candidate?.portfolio}>{candidate?.portfolio}</a></p>
      </section>

      <section>
        <h3>Application Info</h3>
        <p>Status: {app?.statut}</p>
        <p>CV: <a href={app?.cv}>Download</a></p>
        <p>Cover Letter: <a href={app?.lettre_motivation}>Download</a></p>
        <p>Applied on: {new Date(app?.date_postule).toLocaleDateString()}</p>
        <p>Interview Date: {app?.entretien_date}</p>
        <p>Interview Location: {app?.entretien_lieu}</p>
        <p>Recruiter Score: {app?.note_recruteur}</p>
      </section>

      <section>
        <h3>Job Info</h3>
        <p>Job Title: {job?.titre}</p>
        <p>Description: {job?.description}</p>
        <p>Contract Type: {job?.type_contrat}</p>
        <p>Location: {job?.localisation}</p>
        <p>Salary: {job?.salaire}</p>
      </section>
    </div>
  );
};

export default ApplicationDetails;