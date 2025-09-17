import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
// import { logout, setuser } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include",
  prepareHeaders(headers, { getState }) {
    const token = (getState() as RootState).auth.token;
    if (token) {
      console.log("this is");

      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// const baseQueryWithRefreshToken = async (
//   args: any,
//   api: any,
//   extraOptions: any
// ) => {
//   let result = await baseQuery(args, api, extraOptions);
//   if (result.error?.status) {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
//       {
//         method: "POST",
//         credentials: "include",
//       }
//     );
//     const data = await res.json();

//     if (data?.data?.accessToken) {
//       const user = (api.getState() as RootState).auth.user;
//       api.dispatch(setuser({ user, token: data.data.accessToken }));
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       api.dispatch(logout());
//     }
//   }
//   return result;
// };

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: () => ({}),
});

export default baseApi;
