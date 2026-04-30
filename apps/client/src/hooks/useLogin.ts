import { loginSchema } from "@/schemas/LoginSchema";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

export default function useLogin() {
  const [error, setError] = useState<{
    message: string;
    error: string;
    statusCode: number;
  }>();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "admin@email.com",
      password: "12345678",
    },
    validators: {
      onBlur: loginSchema,
      onSubmit: loginSchema,
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      const result = await fetch(`http://localhost:3000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
        cache: "no-store",
        credentials: "include",
      });

      const response = await result.json();
      if (!result.ok) {
        setError(response);
        return;
      }

      router.push("/");
    },
  });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return { form, error, handleSubmit };
}
