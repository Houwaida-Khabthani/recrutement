import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../index";

const baseQuery = fetchBaseQuery({
  baseUrl:
    import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;

    // ✅ Always prioritize Redux, fallback to localStorage
    const token =
      state?.auth?.token ?? localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`); // ✅ FIXED casing
    }

    return headers;
  },
});

/**
 * 🔥 OPTIONAL BUT VERY IMPORTANT (auto logout on 401)
 */
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.warn("🔐 Token expired or invalid");

    // remove token
    localStorage.removeItem("token");

    // optional: reset redux auth state
    api.dispatch({ type: "auth/logout" });

    // optional: redirect
    window.location.href = "/login/candidat";
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth, // ✅ use enhanced version

  tagTypes: [
    "Profile",
    "Jobs",
    "Applications",
    "Notifications",
    "Users",
    "Stats",
    "Companies",
    "Visa",
  ],

  endpoints: () => ({}),
});