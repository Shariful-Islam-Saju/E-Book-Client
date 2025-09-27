import baseApi from "@/redux/api/baseApi";
import { TGetAllLeadParams, TLead, TRes } from "@/types";



export const leadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLead: builder.mutation({
      query: (userInfo) => ({
        url: "/lead/create",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["Lead"], // invalidate cache after create
    }),
    getAllLead: builder.query<
      TRes<{ data: TLead[]; total: number }>,
      TGetAllLeadParams | void
    >({
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
      providesTags: ["Lead"], // provides cache tag
      keepUnusedDataFor: 60, // cache data for 60 seconds
    }),

    deleteLead: builder.mutation({
      query: (id) => ({
        url: `/lead/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lead"], // invalidate cache after delete
    }),
  }),
});

export const {
  useCreateLeadMutation,
  useGetAllLeadQuery,
  useDeleteLeadMutation,
} = leadApi;
