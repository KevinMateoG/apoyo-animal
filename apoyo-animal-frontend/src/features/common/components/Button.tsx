import Link from "next/link";
import type { ComponentProps } from "react";

const BASE =
  "inline-flex cursor-pointer items-center whitespace-nowrap rounded-[var(--radius-full)] bg-[var(--clr-primary)] px-5 py-[0.55rem] text-sm font-medium text-[var(--clr-primary-text)] [transition:background_var(--transition)] hover:bg-[var(--clr-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clr-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--clr-bg)] disabled:cursor-not-allowed disabled:opacity-60";

function buttonClasses(fullWidth: boolean | undefined, className: string) {
  const width = fullWidth ? "w-full justify-center" : "w-fit";
  return `${BASE} ${width} ${className}`.trim();
}

interface ButtonStyleProps {
  fullWidth?: boolean;
}

export function ButtonLink({
  fullWidth,
  className = "",
  ...props
}: ButtonStyleProps & ComponentProps<typeof Link>) {
  return <Link className={buttonClasses(fullWidth, className)} {...props} />;
}

export function Button({
  fullWidth,
  className = "",
  type = "button",
  ...props
}: ButtonStyleProps & ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={buttonClasses(fullWidth, className)}
      {...props}
    />
  );
}

