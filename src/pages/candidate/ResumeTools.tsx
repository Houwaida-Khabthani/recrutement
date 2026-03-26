import React from "react";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */
type ResumeTool = {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  badge?: string;
};

/* ================= DATA ================= */
const tools: ResumeTool[] = [
  {
    id: "builder",
    title: "Créer un CV",
    description:
      "Créez un CV professionnel en quelques minutes avec nos templates.",
    icon: "📝",
    route: "/cv-builder",
    badge: "Populaire",
  },
  {
    id: "analyzer",
    title: "Analyser mon CV",
    description:
      "Recevez des suggestions intelligentes pour améliorer votre CV.",
    icon: "🤖",
    route: "/cv-analyzer",
  },
  {
    id: "match",
    title: "Optimiser pour une offre",
    description:
      "Comparez votre CV avec une offre et obtenez un score de compatibilité.",
    icon: "🎯",
    route: "/cv-match",
    badge: "AI",
  },
  {
    id: "cover",
    title: "Lettre de motivation",
    description:
      "Générez une lettre de motivation personnalisée rapidement.",
    icon: "📄",
    route: "/cover-letter",
  },
  {
    id: "skills",
    title: "Suggestions de compétences",
    description:
      "Découvrez les compétences les plus recherchées pour votre profil.",
    icon: "🧠",
    route: "/skills-suggestions",
  },
  {
    id: "examples",
    title: "Exemples de CV",
    description:
      "Inspirez-vous de modèles de CV adaptés à votre domaine.",
    icon: "📚",
    route: "/cv-examples",
  },
];

/* ================= CARD ================= */
const ToolCard: React.FC<{ tool: ResumeTool }> = ({ tool }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(tool.route)}
      className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between border hover:border-blue-500"
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-3xl">{tool.icon}</span>

          {tool.badge && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              {tool.badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
        <p className="text-sm text-gray-600">{tool.description}</p>
      </div>

      <button className="mt-6 text-blue-600 font-medium hover:underline">
        Utiliser →
      </button>
    </div>
  );
};

/* ================= PAGE ================= */
const ResumeTools: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Outils CV</h1>
          <p className="text-gray-600">
            Améliorez votre CV et augmentez vos chances de décrocher un emploi.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeTools;