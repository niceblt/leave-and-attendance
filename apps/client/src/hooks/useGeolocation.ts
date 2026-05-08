import { GeolocationContext } from "@/providers/GeolocationProvider";
import { useContext } from "react";

export default function useGeolocation() {
  const geolocation = useContext(GeolocationContext);
  if (geolocation === undefined) {
    throw Error("Not within providers");
  }

  const { cords, error, isLoading } = geolocation;
  return { cords, error, isLoading };
}
