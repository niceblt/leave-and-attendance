import useCheckIn from "@/hooks/useCheckIn";
import GeolocationResponse from "@/types/geolocation.type";

export default function CheckInButton({
  hasCheckedIn,
  cords,
}: {
  hasCheckedIn: boolean | undefined;
  cords: GeolocationResponse | undefined;
}) {
  const { handleCheckIn } = useCheckIn();
  if (hasCheckedIn || !cords) {
    return (
      <button
        className="flex-1 cursor-not-allowed rounded-md bg-gray-300 py-3 font-bold text-white"
        disabled={true}
      >
        Check in
      </button>
    );
  } else {
    return (
      <button
        className="flex-1 cursor-pointer rounded-md bg-blue-600 py-3 font-bold text-white"
        onClick={(e) => handleCheckIn(e)}
      >
        Check in
      </button>
    );
  }
}
