"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/src/features/common/components/Button";
import Input from "@/src/features/common/components/Input";
import { HttpError } from "@/src/features/common/http";
import { useAuth } from "../hooks/useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
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

    const nextErrors: { name?: string; email?: string; password?: string } = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || trimmedName.length < 2) {
      nextErrors.name = "El nombre debe tener al menos 2 caracteres.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "El correo electrónico es obligatorio.";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (!password || password.length < 8) {
      nextErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await register({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });
      router.push("/");
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.details) {
          setFieldErrors({
            name: error.details.name?.[0],
            email: error.details.email?.[0],
            password: error.details.password?.[0],
          });
        } else if (error.status === 409) {
          setFieldErrors({
            email: error.message,
          });
        }
        setFormError(error.message);
      } else {
        setFormError("No fue posible completar el registro. Intenta nuevamente.");
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
        id="register-name"
        label="Nombre completo"
        type="text"
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={fieldErrors.name}
      />

      <Input
        id="register-email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
      />

      <Input
        id="register-password"
        label="Contraseña (mínimo 8 caracteres)"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
      />

      <Button type="submit" disabled={isSubmitting} fullWidth>
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </Button>

      <p className="text-center text-[0.82rem] text-[var(--clr-text-secondary)]">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-[var(--clr-primary-hover)] underline underline-offset-4"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}

