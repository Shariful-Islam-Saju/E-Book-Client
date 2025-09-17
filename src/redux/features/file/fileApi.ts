import baseApi from "@/redux/api/baseApi";
import { TRes } from "@/types";
import { TEBook } from "@/types";

export const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------- GET SINGLE FILE ----------------
    getSingleFile: builder.query<TRes<TEBook>, string>({
      query: (id: string) => ({
        url: `/file/file-id/${id}`,
        method: "GET",
      }),
    }),

    // ---------------- GET FILE BY NAME ----------------
    getFileByName: builder.query<TRes<TEBook>, string>({
      query: (title: string) => ({
        url: `/file/file-name/${title}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSingleFileQuery, useGetFileByNameQuery } = fileApi;
