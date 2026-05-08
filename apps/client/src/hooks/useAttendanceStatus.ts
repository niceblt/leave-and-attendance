import { AttendanceStatus } from "@/types/attendance-status.type";
import { fetcher } from "@/utils/fetchers";
import { getCookie } from "cookies-next/client";
import useSWR from "swr";

export default function useAttendanceStatus() {
  const accessToken = getCookie("access_token");
  const { data, error, isLoading } = useSWR<AttendanceStatus, Error>(
    ["/api/attendance/status", accessToken],
    fetcher,
  );
  return { ...data, isLoading };
}
