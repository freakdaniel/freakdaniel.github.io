import type { CSSProperties } from 'react';
import { getTechGlyph } from '../../data/techIcons';

export interface TechChipProps {
  name: string;
  /** Optional explicit key into the icon map (overrides `name`). */
  iconKey?: string;
  /** Size variant. `sm` for cards, `md` for detail pages. */
  size?: 'sm' | 'md';
  className?: string;
}

export default function TechChip({
  name,
  iconKey,
  size = 'sm',
  className = '',
}: TechChipProps) {
  const glyph = getTechGlyph(name, iconKey);

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] gap-1.5 px-2 py-1'
      : 'text-xs gap-2 px-2.5 py-1.5';

  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';

  return (
    <li
      style={{ '--chip-name': `'${name}'` } as CSSProperties}
      className={`inline-flex items-center rounded-full border border-line-strong bg-[#111] text-fg ${sizeClasses} ${className}`}
    >
      {glyph?.kind === 'svg' ? (
        <glyph.Icon
          className={`${iconSize} shrink-0 text-fg opacity-90`}
          aria-hidden="true"
        />
      ) : glyph?.kind === 'img' ? (
        <img
          src={glyph.src}
          alt=""
          aria-hidden="true"
          className={`${iconSize} shrink-0 object-contain opacity-90`}
        />
      ) : null}
      <span className="leading-none">{name}</span>
    </li>
  );
}
