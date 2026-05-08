import Geolocation from "@/types/geolocation.type";
import { updater } from "@/utils/fetchers";
import { getCookie } from "cookies-next/client";
import { MouseEvent } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import useGeolocation from "./useGeolocation";

export default function useCheckIn() {
  const accessToken = getCookie("access_token");
  const { trigger, error } = useSWRMutation(
    "/api/attendance/check-in",
    updater<Geolocation>,
    { throwOnError: false },
  );
  const { cords } = useGeolocation();

  const handleCheckIn = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (cords === undefined) {
      return;
    }

    const result = await trigger({
      token: accessToken as string,
      data: cords,
    });

    if (error) {
      toast.error(error.info.error);
    }

    mutate(["/api/attendance/status", accessToken]);
  };

  return { handleCheckIn };
}
