import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Plateforme de Recrutement</h1>

      <nav>
        <Link to="/role/CANDIDAT">Candidat</Link> |{" "}
        <Link to="/role/ENTREPRISE">Recruteur</Link>
      </nav>

    </div>
  );
};

export default Home;
