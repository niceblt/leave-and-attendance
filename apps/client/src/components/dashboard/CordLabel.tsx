import GeolocationResponse from "@/types/geolocation.type";

export default function CordLabel({
  cords,
  isLoading,
}: {
  cords: GeolocationResponse | undefined;
  isLoading: boolean;
}) {
  return (
    <>
      {isLoading && <p className="text-yellow-300">Getting cordinations</p>}
      {cords && (
        <p className="text-green-400">
          • lat: {cords.lat}, lon: {cords.lon}
        </p>
      )}
    </>
  );
}
