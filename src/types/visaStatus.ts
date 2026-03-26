export const VisaStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type VisaStatus = typeof VisaStatus[keyof typeof VisaStatus];
