export default function StatusLabel({
  hasCheckedIn,
  hasCheckedOut,
}: {
  hasCheckedIn: boolean | undefined;
  hasCheckedOut: boolean | undefined;
}) {
  if (hasCheckedIn === true && hasCheckedOut === false) {
    return <p className="text-xs font-bold text-green-500">• Checked in</p>;
  } else if (hasCheckedIn === true && hasCheckedOut === true) {
    return <p className="text-xs font-bold text-blue-500">• Checked out</p>;
  } else {
    return <p className="text-xs font-bold text-gray-800">• Not checked in</p>;
  }
}
