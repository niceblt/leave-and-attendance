import { AttendanceStatus } from "@/types/attendance-status.type";
import fetcher from "@/utils/fetcher";
import { getCookie } from "cookies-next/client";
import useSWR from "swr";

export default function useAttendanceStatus() {
  const accessToken = getCookie("access_token");
  const { data, error, isLoading } = useSWR(
    ["/api/attendance/status", accessToken],
    fetcher<AttendanceStatus>,
  );
  return { ...data, isLoading };
}
