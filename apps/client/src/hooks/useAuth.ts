import { AuthContext } from "@/providers/AuthProvider";
import { useContext } from "react";

export default function useAuth() {
  const auth = useContext(AuthContext);
  if (auth === undefined) {
    throw Error("Not within providers");
  }

  const { session, isLoading } = auth;

  return { session, isLoading };
}
