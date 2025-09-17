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
  }),
});

export const { useCreateLeadMutation } = leadApi;
