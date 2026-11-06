interface RadioChoiceProps<T extends string> {
  name: string;
  value: T;
  checked: boolean;
  onChange: (value: T) => void;
  title: string;
  description: string;
}

export default function RadioChoice<T extends string>({
  name,
  value,
  checked,
  onChange,
  title,
  description,
}: RadioChoiceProps<T>) {
  return (
    <label className="flex cursor-pointer items-start gap-[var(--space-sm)] rounded-[var(--radius-lg)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] p-[var(--space-md)] has-checked:border-[var(--clr-primary)] has-checked:shadow-[inset_0_0_0_1px_var(--clr-primary)]">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-1 shrink-0 accent-[var(--clr-primary)]"
      />
      <span className="flex flex-col gap-[0.2rem]">
        <strong className="text-[0.875rem] font-medium">{title}</strong>
        <small className="text-[0.75rem] leading-[1.5] text-[var(--clr-text-muted)]">
          {description}
        </small>
      </span>
    </label>
  );
}

