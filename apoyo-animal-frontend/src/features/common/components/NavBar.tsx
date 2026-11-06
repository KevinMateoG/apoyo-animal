"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { ButtonLink } from "./Button";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Ejemplares" },
  { href: "/apadrinar", label: "Apadrinar y Donar" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--clr-border)] bg-[color-mix(in_srgb,var(--clr-bg)_88%,transparent)] backdrop-blur-[12px] transition-[background-color,border-color] duration-300 ease-in-out">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-[68px] max-w-[var(--max-w)] items-center gap-[var(--space-xl)] px-[var(--space-lg)] max-[768px]:gap-[var(--space-md)] max-[640px]:h-auto max-[640px]:flex-wrap max-[640px]:justify-center max-[640px]:gap-[var(--space-sm)] max-[640px]:py-[var(--space-sm)] before:max-[640px]:order-2 before:max-[640px]:basis-full before:max-[640px]:content-['']"
      >
        <Link
          href="/"
          className="shrink-0 max-[640px]:order-1 max-[640px]:mr-auto"
        >
          <Image
            src="/logo.png"
            alt="logo de la pagina"
            width={100}
            height={100}
            className="block h-[38px] w-auto shrink-0 object-contain"
          />
        </Link>

        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-[0.9rem] [transition:color_var(--transition)] hover:text-[var(--clr-text)] max-[640px]:order-3 max-[640px]:px-[var(--space-xs)] max-[640px]:text-[0.85rem] ${
                isActive
                  ? "font-medium text-[var(--clr-primary-hover)]"
                  : "text-[var(--clr-text-muted)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        {isAuthenticated && (
          <Link
            href="/mis-apadrinamientos"
            className={`whitespace-nowrap text-[0.9rem] [transition:color_var(--transition)] hover:text-[var(--clr-text)] max-[640px]:order-3 max-[640px]:px-[var(--space-xs)] max-[640px]:text-[0.85rem] ${
              pathname === "/mis-apadrinamientos"
                ? "font-medium text-[var(--clr-primary-hover)]"
                : "text-[var(--clr-text-muted)]"
            }`}
          >
            Mis apadrinamientos
          </Link>
        )}

        {isAdmin && (
          <Link
            href="/admin"
            className={`whitespace-nowrap text-[0.9rem] [transition:color_var(--transition)] hover:text-[var(--clr-text)] max-[640px]:order-3 max-[640px]:px-[var(--space-xs)] max-[640px]:text-[0.85rem] ${
              pathname === "/admin"
                ? "font-medium text-[var(--clr-primary-hover)]"
                : "text-[var(--clr-text-muted)]"
            }`}
          >
            Administración
          </Link>
        )}

        <div className="ml-auto flex items-center gap-[var(--space-sm)] max-[640px]:order-1 max-[640px]:ml-0">
          <button
            type="button"
            onClick={toggleTheme}
            id="btn-theme"
            aria-label="Cambiar tema"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius-full)] border border-[var(--clr-border)] bg-transparent text-base leading-none text-[var(--clr-text-secondary)] [transition:background_var(--transition),border-color_var(--transition)] hover:border-[var(--clr-text-secondary)] hover:bg-[var(--clr-bg-elevated)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clr-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--clr-bg)]"
          >
            <span className="dark:hidden">☀️</span>
            <span className="hidden dark:inline">🌙</span>
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-[var(--space-xs)]">
              <span className="hidden text-[0.82rem] font-medium text-[var(--clr-text)] sm:inline">
                {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="cursor-pointer rounded-[var(--radius)] border border-[var(--clr-border)] px-3 py-1.5 text-[0.8rem] font-medium text-[var(--clr-text-secondary)] [transition:border-color_var(--transition),color_var(--transition)] hover:border-[var(--clr-text-secondary)] hover:text-[var(--clr-text)]"
              >
                Salir
              </button>
            </div>
          ) : (
            <ButtonLink href="/login">Ingresar</ButtonLink>
          )}
        </div>
      </nav>
    </header>
  );
}
