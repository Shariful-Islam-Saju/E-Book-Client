import baseApi from "@/redux/api/baseApi";
import { TLead, TRes } from "@/types";

export interface GetAllLeadParams {
  search?: string;
  fromDate?: string;
  toDate?: string;
  ebookIds?: string[];
  page?: number; // Pagination
  limit?: number; // Items per page
  [key: string]: any; // Future filters
}

export const leadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLead: builder.mutation({
      query: (userInfo) => ({
        url: "/lead/create",
        method: "POST",
        body: userInfo,
      }),
    }),

    getAllLead: builder.query<TRes<TLead[]>, GetAllLeadParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                value.forEach((v) => queryParams.append(key, v));
              } else {
                queryParams.append(key, String(value));
              }
            }
          });
        }

        return {
          url: `/lead/all-leads?${queryParams.toString()}`,
          method: "GET",
        };
      },
    }),

    deleteLead: builder.mutation({
      query: (id) => ({
        url: `/lead/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateLeadMutation,
  useGetAllLeadQuery,
  useDeleteLeadMutation,
} = leadApi;
