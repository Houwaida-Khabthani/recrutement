export const UserRole = {
  ADMIN: "ADMIN",
  CANDIDAT: "CANDIDAT",
  ENTREPRISE: "ENTREPRISE",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export type Role = UserRole;
