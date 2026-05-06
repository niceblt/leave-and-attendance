import useCheckOut from "@/hooks/useCheckOut";

export default function CheckOutButton({
  hasCheckedIn,
  hasCheckedOut,
}: {
  hasCheckedIn: boolean | undefined;
  hasCheckedOut: boolean | undefined;
}) {
  const { handleCheckOut } = useCheckOut();
  if (!hasCheckedIn || hasCheckedOut) {
    return (
      <button
        className="flex-1 cursor-not-allowed rounded-md bg-gray-300 py-3 font-bold text-white"
        disabled={true}
      >
        Check out
      </button>
    );
  } else {
    return (
      <button
        className="flex-1 rounded-md bg-blue-600 py-3 font-bold text-white"
        onClick={(e) => handleCheckOut(e)}
      >
        Check out
      </button>
    );
  }
}
