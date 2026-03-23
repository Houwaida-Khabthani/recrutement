import { ChangeEvent, useState } from "react";
import {
  useGetCandidateProfileQuery,
  useUpdateCandidateProfileMutation,
  useParseCVMutation
} from "../../store/api/candidateApi";

export default function ResumeTools() {
  const { isLoading } = useGetCandidateProfileQuery();
  const [updateProfile] = useUpdateCandidateProfileMutation();
  const [parseCV] = useParseCVMutation();

  const [score, setScore] = useState<number>(0);
  const [country, setCountry] = useState("France");
  const [loading, setLoading] = useState(false);

  // 🤖 PARSE CV + UPDATE PROFILE
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);

    try {
      setLoading(true);

      const result = await parseCV(form).unwrap();

      // 🔥 update profile automatically
      await updateProfile(result).unwrap();

      setScore(85); // fake score for now

      alert("CV analysé et profil mis à jour ✅");
    } catch (err) {
      console.error(err);
      alert("Erreur parsing CV ❌");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">Outils CV</h1>
      <p className="text-gray-500">
        Optimise ton CV avec l'IA et améliore tes chances 🚀
      </p>

      {/* 📄 Upload CV */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-2">Importer votre CV</h2>

        <input type="file" onChange={handleFileChange} />

        {loading && (
          <p className="text-blue-500 mt-2">Analyse en cours...</p>
        )}
      </div>

      {/* 🤖 Score CV */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold">Score CV : {score}%</h2>

        <div className="w-full bg-gray-200 h-3 rounded mt-2">
          <div
            className="bg-green-500 h-3 rounded"
            style={{ width: `${score}%` }}
          />
        </div>

        {score > 0 && (
          <ul className="text-sm text-gray-600 mt-3">
            <li>✔ Profil enrichi automatiquement</li>
            <li>✔ CV optimisé pour le marché international</li>
          </ul>
        )}
      </div>

      {/* 🌍 Adaptation */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-2">Adapter mon CV</h2>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border p-2 rounded"
        >
          <option>France</option>
          <option>Canada</option>
          <option>Allemagne</option>
        </select>

        <button className="ml-3 bg-black text-white px-3 py-2 rounded-xl">
          Adapter
        </button>
      </div>

      {/* 📥 Export PDF */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <button className="bg-green-600 text-white px-4 py-2 rounded-xl">
          Télécharger CV (PDF)
        </button>
      </div>

      {/* 🎓 Videos Section */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">Conseils & Vidéos CV</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <iframe
              className="w-full h-48 rounded-xl"
              src="https://www.youtube.com/embed/y8YH0Qbu5h4"
              title="How to write a CV"
              allowFullScreen
            ></iframe>
            <p className="text-sm mt-2">
              Comment créer un CV professionnel
            </p>
          </div>

          <div>
            <iframe
              className="w-full h-48 rounded-xl"
              src="https://www.youtube.com/embed/J-4Fv8nq1iA"
              title="CV mistakes"
              allowFullScreen
            ></iframe>
            <p className="text-sm mt-2">
              Les erreurs à éviter dans un CV
            </p>
          </div>

          <div>
            <iframe
              className="w-full h-48 rounded-xl"
              src="https://www.youtube.com/embed/7y6h8Z8F7e0"
              title="CV Europe"
              allowFullScreen
            ></iframe>
            <p className="text-sm mt-2">
              CV pour travailler en Europe
            </p>
          </div>

          <div>
            <iframe
              className="w-full h-48 rounded-xl"
              src="https://www.youtube.com/embed/K6Y6X2xkZ9E"
              title="Recruiter tips"
              allowFullScreen
            ></iframe>
            <p className="text-sm mt-2">
              Conseils de recruteurs
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}