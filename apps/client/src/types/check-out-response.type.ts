export default interface CheckOutResponse {
  attendance: {
    id: string;
    checkInTime: Date;
    checkOutTime: Date;
    totalHours: number;
  };
  message: string;
}
