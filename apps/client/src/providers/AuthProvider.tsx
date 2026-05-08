"use client";

import { User } from "@/types/user.type";
import { fetcher } from "@/utils/fetchers";
import { getCookie } from "cookies-next/client";
import { createContext, ReactNode } from "react";
import useSWR from "swr";
interface AuthContextType {
  isLoading: boolean;
  session: User | undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const accessToken = getCookie("access_token");
  const { data, error, isLoading } = useSWR<{ user: User }, Error>(
    ["/api/auth/me", accessToken],
    fetcher,
  );

  const session = data ? (data.user as User) : undefined;

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
