import baseApi from "@/redux/api/baseApi";

export const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSingleFile: builder.query({
      query: (id: string) => ({
        url: `/file/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSingleFileQuery } = fileApi;
