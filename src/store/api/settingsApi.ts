import { baseApi } from "./baseApi";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface User {
  id: number;
  email: string;
  nom: string;
  role: string;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET CURRENT USER
     */
    getMe: builder.query<User, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    /**
     * CHANGE PASSWORD
     */
    changePassword: builder.mutation<
      { message: string },
      ChangePasswordPayload
    >({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: data,
      }),
    }),

    /**
     * DELETE ACCOUNT
     */
    deleteAccount: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/delete-account",
        method: "DELETE",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetMeQuery,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = settingsApi;