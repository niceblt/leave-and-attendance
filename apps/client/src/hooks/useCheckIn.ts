import { CheckInResponse } from "@/types/check-in-response.type";
import { getCookie } from "cookies-next/client";
import { MouseEvent } from "react";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

const checkIn = async (url: string, { arg }: { arg: string }) =>
  fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${arg}`,
    },
  }).then((res) => res.json() as Promise<CheckInResponse>);

export default function useCheckIn() {
  const accessToken = getCookie("access_token");
  const { trigger } = useSWRMutation("/api/attendance/check-in", checkIn);

  const handleCheckIn = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const result = await trigger(accessToken as string);
    mutate(["/api/attendance/status", accessToken]);
  };

  return { handleCheckIn };
}
