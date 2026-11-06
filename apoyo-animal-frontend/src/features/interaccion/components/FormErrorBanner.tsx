"use client";

import { useEffect, useRef } from "react";

export default function FormErrorBanner({ errors }: { errors: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [errors]);

  return (
    <div
      ref={ref}
      role="alert"
      className="flex animate-banner-in items-start gap-[var(--space-sm)] rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,#dc2626_40%,var(--clr-border))] bg-[color-mix(in_srgb,#dc2626_8%,var(--clr-bg))] px-[var(--space-lg)] py-[var(--space-md)] before:mt-[0.1rem] before:shrink-0 before:text-base before:text-[#dc2626] before:content-['⚠']"
    >
      <ul className="flex list-none flex-col gap-[0.3rem]">
        {errors.map((message) => (
          <li
            key={message}
            className="text-[0.82rem] leading-[1.5] text-[color-mix(in_srgb,#dc2626_80%,var(--clr-text))] before:font-bold before:content-['·_']"
          >
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
}

