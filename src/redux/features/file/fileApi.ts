import baseApi from "@/redux/api/baseApi";
import { TRes, TEBook } from "@/types";

export const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSingleFile: builder.query<TRes<TEBook>, string>({
      query: (id: string) => ({
        url: `/file/file-id/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "File", id }], // cache by id
    }),

    getAllFiles: builder.query<TRes<TEBook[]>, void>({
      query: () => ({
        url: `/file`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((file) => ({
                type: "File" as const,
                id: file.id,
              })),
              { type: "File", id: "LIST" },
            ]
          : [{ type: "File", id: "LIST" }],
      keepUnusedDataFor: 600,
    }),

    getFileByName: builder.query<TRes<TEBook>, string>({
      query: (title: string) => ({
        url: `/file/file-name/${title}`,
        method: "GET",
      }),
      providesTags: (_result, _error, title) => [{ type: "File", id: title }],
    }),
  }),
});

export const {
  useGetSingleFileQuery,
  useGetFileByNameQuery,
  useGetAllFilesQuery,
} = fileApi;
