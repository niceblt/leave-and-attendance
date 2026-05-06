import { CheckOutResponse } from "@/types/check-out-response.type";
import { getCookie } from "cookies-next/client";
import { MouseEvent } from "react";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";

const checkOut = async (url: string, { arg }: { arg: string }) =>
  fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${url}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${arg}`,
    },
  }).then((res) => res.json() as Promise<CheckOutResponse>);

export default function useCheckOut() {
  const accessToken = getCookie("access_token");
  const { trigger } = useSWRMutation("/api/attendance/check-out", checkOut);

  const handleCheckOut = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const result = await trigger(accessToken as string);
    mutate(["/api/attendance/status", accessToken]);
  };
  return { handleCheckOut };
}
