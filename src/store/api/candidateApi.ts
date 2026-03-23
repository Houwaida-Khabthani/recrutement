import { baseApi } from "./baseApi";

export const candidateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    
    getCandidateProfile: builder.query({
      query: () => "/candidates/profile",
      providesTags: ["Profile"],
    }),

    
    updateCandidateProfile: builder.mutation({
      query: (data) => ({
        url: "/candidates/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    
    getCandidateStats: builder.query({
      query: () => "/candidates/stats",
    }),

    
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
  useParseCVMutation, 
} = candidateApi;