import type { ComponentProps, ReactNode } from "react";

const INPUT_BASE =
  "min-h-[2.75rem] w-full rounded-[var(--radius)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] px-[0.8rem] py-[0.65rem] text-[0.875rem] text-[var(--clr-text)]";

interface InputProps extends Omit<ComponentProps<"input">, "className"> {
  id: string;
  label: string;
  fullWidth?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  error?: string;
}

export default function Input({
  id,
  label,
  fullWidth,
  startAdornment,
  endAdornment,
  error,
  ...props
}: InputProps) {
  const hasAdornment = Boolean(startAdornment || endAdornment);
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div
      className={`flex flex-col gap-[0.35rem] ${fullWidth ? "col-span-full" : ""}`}
    >
      <label
        htmlFor={id}
        className="text-[0.8rem] font-medium text-[var(--clr-text-secondary)]"
      >
        {label}
      </label>

      {hasAdornment ? (
        <div
          className={`flex min-h-[2.75rem] items-center rounded-[var(--radius)] border bg-[var(--clr-surface-white)] px-[0.8rem] text-[var(--clr-text-muted)] ${
            error ? "border-[#b91c1c]" : "border-[var(--clr-border)]"
          }`}
        >
          {startAdornment && <span aria-hidden="true">{startAdornment}</span>}
          <input
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            className="w-full border-0 bg-transparent px-[0.45rem] py-[0.65rem] text-[0.875rem] text-[var(--clr-text)] outline-0"
            {...props}
          />
          {endAdornment && <span aria-hidden="true">{endAdornment}</span>}
        </div>
      ) : (
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`${INPUT_BASE} ${
            error ? "border-[#b91c1c]" : ""
          } focus:border-[var(--clr-primary)] focus:outline-2 focus:outline-[color-mix(in_srgb,var(--clr-primary)_35%,transparent)]`}
          {...props}
        />
      )}

      {error && (
        <p id={errorId} role="alert" className="text-[0.75rem] text-[#b91c1c]">
          {error}
        </p>
      )}
    </div>
  );
}
