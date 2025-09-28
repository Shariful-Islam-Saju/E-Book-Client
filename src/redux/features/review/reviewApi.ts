import baseApi from "@/redux/api/baseApi";
import { TRes, TReview } from "@/types";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<TRes<TReview>, FormData>({
      queryFn: async (data, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const response = await fetchWithBQ({
            url: `/review/create`,
            method: "POST",
            body: data,
          });
          if ("error" in response) return { error: response.error };
          return { data: response.data as TRes<TReview> };
        } catch (err) {
          return { error: err as any };
        }
      },
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),

    getAllReviews: builder.query<TRes<TReview[]>, void>({
      query: () => ({ url: `/review`, method: "GET" }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((review) => ({
                type: "Review" as const,
                id: review.id,
              })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
      keepUnusedDataFor: 600,
    }),

    getReviewById: builder.query<TRes<TReview>, string>({
      query: (id: string) => ({ url: `/review/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "Review", id }],
    }),

    updateReview: builder.mutation<
      TRes<TReview>,
      { id: string; data: FormData }
    >({
      queryFn: async ({ id, data }, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const response = await fetchWithBQ({
            url: `/review/${id}`,
            method: "PATCH",
            body: data,
          });
          if ("error" in response) return { error: response.error };
          return { data: response.data as TRes<TReview> };
        } catch (err) {
          return { error: err as any };
        }
      },
      invalidatesTags: (result, _error, { id }) => [
        { type: "Review", id },
        { type: "Review", id: "LIST" },
      ],
    }),

    deleteReview: builder.mutation<TRes<{ message: string }>, string>({
      query: (id: string) => ({ url: `/review/${id}`, method: "DELETE" }),
      invalidatesTags: (result, _error, id) => [
        { type: "Review", id },
        { type: "Review", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetAllReviewsQuery,
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
