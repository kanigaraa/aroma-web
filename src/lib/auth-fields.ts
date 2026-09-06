export const userAdditionalFields = {
  region: {
    type: "string" as const,
    required: false,
    defaultValue: "DKI Jakarta",
  },
  notifications: {
    type: "boolean" as const,
    required: false,
    defaultValue: true,
  },
};
