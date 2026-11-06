import type { ReactNode } from "react";

export default function SiteFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="border-t border-[var(--clr-border)] bg-[var(--clr-bg)] py-[var(--space-xl)] transition-colors duration-300">
      <div className="mx-auto flex max-w-[var(--max-w)] flex-col items-center gap-[var(--space-md)] px-[var(--space-lg)] text-center sm:flex-row sm:justify-between sm:text-left">
        {children}
      </div>
    </footer>
  );
}

