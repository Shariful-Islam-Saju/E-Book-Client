import baseApi from "@/redux/api/baseApi";

export const leadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLead: builder.mutation({
      query: (userInfo) => ({
        url: "/lead/create",
        method: "POST",
        body: userInfo,
      }),
    }),
    getAllLead: builder.query({
      query: () => ({
        url: "/lead/all-leads",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateLeadMutation, useGetAllLeadQuery } = leadApi;
