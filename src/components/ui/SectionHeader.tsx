export interface SectionHeaderProps {
  label: string;
  title: string;
  align?: 'left' | 'center';
}

export default function SectionHeader({
  label,
  title,
  align = 'left',
}: SectionHeaderProps) {
  const alignment =
    align === 'center'
      ? 'items-center text-center'
      : 'items-start text-left';

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      <span className="text-xs uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
      <h2 className="text-3xl sm:text-4xl font-medium leading-tight tracking-tight">
        {title}
      </h2>
      <div
        className={`mt-2 h-px w-12 bg-line-strong ${
          align === 'center' ? '' : 'self-start'
        }`}
      />
    </div>
  );
}
