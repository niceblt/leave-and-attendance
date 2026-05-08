"use client";

import GeolocationResponse from "@/types/geolocation.type";
import { externalFetcher } from "@/utils/fetchers";
import { createContext, ReactNode } from "react";
import useSWR from "swr";

interface GeolocationContextType {
  cords: GeolocationResponse | undefined;
  error: Error | undefined;
  isLoading: boolean;
}

export const GeolocationContext = createContext<
  GeolocationContextType | undefined
>(undefined);

export function GeolocationProvider({ children }: { children: ReactNode }) {
  const { data, error, isLoading } = useSWR<GeolocationResponse, Error>(
    "http://ip-api.com/json/?fields=lat,lon",
    externalFetcher,
  );

  const cords = data ? data : undefined;

  return (
    <GeolocationContext.Provider value={{ cords, error, isLoading }}>
      {children}
    </GeolocationContext.Provider>
  );
}
