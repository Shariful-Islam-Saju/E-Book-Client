import baseApi from "@/redux/api/baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all reviews
    getAllReviews: builder.query({
      query: () => ({
        url: "/review",
        method: "GET",
      }),
      providesTags: ["Review"],
    }),

    // ✅ Create a review
    createReview: builder.mutation({
      query: (newReview) => ({
        url: "/review",
        method: "POST",
        body: newReview,
      }),
      invalidatesTags: ["Review"],
    }),

    // ✅ Update/Modify a review
    updateReview: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/review/${id}`,
        method: "PUT", // or PATCH if partial update
        body: updatedData,
      }),
      invalidatesTags: ["Review"],
    }),

    // ✅ Delete a review
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

// Export hooks
export const {
  useGetAllReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;

export default reviewApi;
