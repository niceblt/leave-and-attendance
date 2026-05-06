export interface User {
  id: string;
  email: string;
  role: "HR" | "ADMIN" | "USER";
  firstName: string;
  lastName: string;
}
