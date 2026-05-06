"use client";
import CheckInButton from "@/components/dashboard/CheckInButton";
import CheckOutButton from "@/components/dashboard/CheckOutButton";
import StatusLabel from "@/components/dashboard/StatusLabel";
import useAttendanceStatus from "@/hooks/useAttendanceStatus";
import useAuth from "@/hooks/useAuth";
import useTime from "@/hooks/useTime";

export default function Dashboard() {
  const { session } = useAuth();
  const { hasCheckedIn, hasCheckedOut, minimumCheckInTime } =
    useAttendanceStatus();
  const { date } = useTime();
  return (
    <div className="h-full w-full bg-gray-200 px-4 pt-4">
      <h1 className="text-4xl">
        {session?.firstName} {session?.lastName}
      </h1>
      <div className="mt-6 rounded-2xl bg-white p-4 shadow-xl">
        <div className="flex flex-col gap-1">
          <StatusLabel
            hasCheckedIn={hasCheckedIn}
            hasCheckedOut={hasCheckedOut}
          ></StatusLabel>
          <p className="font-mono text-2xl">{`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`}</p>
          <p className="text-xs">Bangkok · ICT UTC+7</p>
        </div>
        <div className="mt-4 flex gap-3">
          <CheckInButton hasCheckedIn={hasCheckedIn}></CheckInButton>
          <CheckOutButton
            hasCheckedIn={hasCheckedIn}
            hasCheckedOut={hasCheckedOut}
          ></CheckOutButton>
        </div>
      </div>
    </div>
  );
}
