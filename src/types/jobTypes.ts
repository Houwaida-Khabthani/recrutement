export const ContractType = {
  CDI: "CDI",
  CDD: "CDD",
  FREELANCE: "Freelance",
  STAGE: "Stage",
  ALTERNANCE: "Alternance",
} as const;

export type ContractType = typeof ContractType[keyof typeof ContractType];

export interface Job {
  id: string;
  title: string;
  description: string;
  companyId: string;
  location: string;
  salary?: string;
  contractType: ContractType;
  createdAt: string;
  company?: {
    nom_entreprise: string;
  };
}
