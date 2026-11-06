import type { ReactNode } from "react";

type TextProps = { children: ReactNode };

export function SectionEyebrow({ children }: TextProps) {
  return (
    <span className="mb-[0.35rem] block text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[var(--clr-text-muted)]">
      {children}
    </span>
  );
}

export function HeroTitle({ children }: TextProps) {
  return (
    <h1 className="pb-[2%] font-[family-name:var(--font-serif)] text-[clamp(2rem,5vw,3.25rem)] font-normal leading-[1.1] tracking-[-0.03em] text-[var(--clr-text)]">
      {children}
    </h1>
  );
}

export function HeroDescription({ children }: TextProps) {
  return (
    <p className="text-[1rem] font-light leading-[1.75] text-[var(--clr-text-secondary)]">
      {children}
    </p>
  );
}

export function SectionTitle({ children }: TextProps) {
  return (
    <h2 className="mb-2 font-[family-name:var(--font-serif)] text-[clamp(1.4rem,3vw,1.9rem)] font-normal tracking-[-0.02em] text-[var(--clr-text)]">
      {children}
    </h2>
  );
}

export function SectionSubtitle({ children }: TextProps) {
  return (
    <p className="max-w-[28rem] text-[0.875rem] font-light leading-[1.6] text-[var(--clr-text-secondary)]">
      {children}
    </p>
  );
}

