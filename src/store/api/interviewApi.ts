import { baseApi } from "./baseApi";

export const interviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInterviews: builder.query({
      query: () => "/interviews",
    }),

    confirmInterview: builder.mutation({
      query: (id) => ({
        url: `/interviews/${id}/confirm`,
        method: "PATCH",
      }),
    }),

    cancelInterview: builder.mutation({
      query: (id) => ({
        url: `/interviews/${id}/cancel`,
        method: "PATCH",
      }),
    }),

    scheduleInterview: builder.mutation({
      query: ({ id, date }) => ({
        url: `/interviews/${id}/schedule`,
        method: "PATCH",
        body: { date },
      }),
    }),
  }),
});

export const {
  useGetInterviewsQuery,
  useConfirmInterviewMutation,
  useCancelInterviewMutation,
  useScheduleInterviewMutation,
} = interviewApi;