"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/src/features/common/components/Button";
import Input from "@/src/features/common/components/Input";
import { HttpError } from "@/src/features/common/http";
import { useAuth } from "../hooks/useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const nextErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      nextErrors.email = "El correo electrónico es obligatorio.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (!password) {
      nextErrors.password = "La contraseña es obligatoria.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await login({ email: trimmedEmail, password });
      router.push("/");
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.details) {
          setFieldErrors({
            email: error.details.email?.[0],
            password: error.details.password?.[0],
          });
        }
        setFormError(error.message);
      } else {
        setFormError("No fue posible iniciar sesión. Intenta nuevamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-[var(--space-lg)] rounded-[var(--radius-2xl)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] p-[var(--space-xl)]"
    >
      {formError && (
        <div
          role="alert"
          className="rounded-[var(--radius)] border border-[#b91c1c]/40 bg-[#b91c1c]/10 px-4 py-3 text-[0.82rem] text-[#b91c1c]"
        >
          {formError}
        </div>
      )}

      <Input
        id="login-email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
      />

      <Input
        id="login-password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
      />

      <Button type="submit" disabled={isSubmitting} fullWidth>
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </Button>

      <p className="text-center text-[0.82rem] text-[var(--clr-text-secondary)]">
        ¿Aún no tienes una cuenta?{" "}
        <Link
          href="/registro"
          className="font-medium text-[var(--clr-primary-hover)] underline underline-offset-4"
        >
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}

