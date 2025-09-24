import baseApi from "@/redux/api/baseApi";
import { TLead, TRes } from "@/types";

export const leadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLead: builder.mutation({
      query: (userInfo) => ({
        url: "/lead/create",
        method: "POST",
        body: userInfo,
      }),
    }),
    getAllLead: builder.query<TRes<TLead[]>, undefined>({
      query: () => ({
        url: "/lead/all-leads",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateLeadMutation, useGetAllLeadQuery } = leadApi;
