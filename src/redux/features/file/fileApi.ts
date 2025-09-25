import baseApi from "@/redux/api/baseApi";
import { TRes, TEBook } from "@/types";

export const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFile: builder.mutation<TRes<TEBook>, FormData>({
      queryFn: async (data, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const response = await fetchWithBQ({
            url: `/file/upload`,
            method: "POST",
            body: data,
          });
          if ("error" in response) return { error: response.error };
          return { data: response.data as TRes<TEBook> };
        } catch (err) {
          return { error: err as any };
        }
      },
      invalidatesTags: [{ type: "File", id: "LIST" }],
    }),
    getSingleFile: builder.query<TRes<TEBook>, string>({
      query: (id: string) => ({
        url: `/file/file-id/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "File", id }],
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

    // ✅ PATCH /file/:id to update file & metadata (multipart/form-data)
    updateFile: builder.mutation<TRes<TEBook>, { id: string; data: FormData }>({
      queryFn: async ({ id, data }, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          // For multipart, do NOT set 'Content-Type'; fetchWithBQ handles it automatically
          const response = await fetchWithBQ({
            url: `/file/${id}`,
            method: "PATCH",
            
            body: data,
          });

          if ("error" in response) return { error: response.error };
          return { data: response.data as TRes<TEBook> };
        } catch (err) {
          return { error: err as any };
        }
      },
      invalidatesTags: (result, _error, { id }) => [
        { type: "File", id },
        { type: "File", id: "LIST" },
      ],
    }),

    // ✅ DELETE /file/:id to remove a file
    deleteFile: builder.mutation<TRes<{ message: string }>, string>({
      query: (id: string) => ({
        url: `/file/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, _error, id) => [
        { type: "File", id },
        { type: "File", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSingleFileQuery,
  useGetFileByNameQuery,
  useGetAllFilesQuery,
  useUpdateFileMutation,
  useDeleteFileMutation,
  useCreateFileMutation, // ✅ new create hook
} = fileApi;
