import { Manager, Tenant } from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = fetchAuthSession();
      const { idToken } = (await session).tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`)
      }
    }
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_, queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const session = fetchAuthSession();
          const { idToken } = (await session).tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;
          const endPoint = userRole === "manager"
            ? `/managers/${user.userId}`
            : `/tenants/${user.userId}`;

          const userDetailsResponse = await fetchWithBQ(endPoint)

          // if user doesn't exist, create new user
          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailsResponse?.data as Tenant | Manager,
              userRole
            }
          }
        } catch (error: any) {
          return { error: error.message || "Could not found user data" };
        }
      },
    })
  }),
});

export const { } = api;
