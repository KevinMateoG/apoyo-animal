import type { ReactNode } from "react";

type CtaProps = { children: ReactNode };

export function CtaBox({ children }: CtaProps) {
  return (
    <div className="flex flex-col gap-[var(--space-xl)] rounded-[var(--radius-2xl)] border border-[var(--clr-border)] bg-[color-mix(in_srgb,var(--clr-bg-elevated)_70%,transparent)] p-[var(--space-2xl)] text-center md:flex-row md:items-center md:justify-between md:text-left">
      {children}
    </div>
  );
}

export function CtaTitle({ children }: CtaProps) {
  return (
    <h3 className="mb-[0.35rem] font-[family-name:var(--font-serif)] text-[1.35rem] font-normal text-[var(--clr-text)]">
      {children}
    </h3>
  );
}

export function CtaDescription({ children }: CtaProps) {
  return (
    <p className="text-[0.875rem] font-light text-[var(--clr-text-secondary)]">
      {children}
    </p>
  );
}

