import { useEffect, useState } from "react";

export default function useTime() {
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setDate(now);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  return { date };
}
