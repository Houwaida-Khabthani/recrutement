import { baseApi } from "./baseApi";

export const candidateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ GET PROFILE
    getCandidateProfile: builder.query({
      query: () => "/candidates/profile",
      providesTags: ["Profile"],
    }),

    // ✅ UPDATE PROFILE
    updateCandidateProfile: builder.mutation({
      query: (data) => ({
        url: "/candidates/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // ✅ GET STATS
    getCandidateStats: builder.query({
      query: () => "/candidates/stats",
    }),

    // 🔥 NEW: PARSE CV
    parseCV: builder.mutation({
      query: (formData: FormData) => ({
        url: "/ai/parse-cv",
        method: "POST",
        body: formData,
      }),
    }),

  }),
});

export const {
  useGetCandidateProfileQuery,
  useUpdateCandidateProfileMutation,
  useGetCandidateStatsQuery,
  useParseCVMutation, // 🔥 EXPORT THIS
} = candidateApi;