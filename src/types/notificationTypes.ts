export const NotificationType = {
  APPLICATION_STATUS: "APPLICATION_STATUS",
  NEW_JOB: "NEW_JOB",
  GENERAL: "GENERAL",
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];
