export default interface CheckInResponse {
  attendance: {
    id: string;
    checkInTime: string;
    checkInDistance: number;
    status: string;
  };
  message: string;
}
