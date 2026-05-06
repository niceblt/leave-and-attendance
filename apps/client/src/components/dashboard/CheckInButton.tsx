import useCheckIn from "@/hooks/useCheckIn";

export default function CheckInButton({
  hasCheckedIn,
}: {
  hasCheckedIn: boolean | undefined;
}) {
  const { handleCheckIn } = useCheckIn();
  if (hasCheckedIn) {
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
