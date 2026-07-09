import type { Project } from '../../data/projects';

export interface ProjectLogoProps {
  project: Project;
  /** Sizes the logo box, e.g. "h-14 w-14" (cards) or "h-20 w-20" (modal). */
  className?: string;
  /** Accessible label; omit to mark the logo decorative. */
  label?: string;
  /**
   * For `dual` logos: swap to the dark variant on `.group` hover. Enable
   * on project cards (where the card flips to a light fill); disable where
   * hover should only change opacity, e.g. the overlay's project list.
   */
  swapOnGroupHover?: boolean;
}

export default function ProjectLogo({
  project,
  className = '',
  label,
  swapOnGroupHover = true,
}: ProjectLogoProps) {
  const aria = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const };

  if (project.logoMode === 'mono') {
    return (
      <span
        className={`block ${className}`}
        style={{
          backgroundColor: 'currentcolor',
          WebkitMask: `url(${project.logo}) center / contain no-repeat`,
          mask: `url(${project.logo}) center / contain no-repeat`,
        }}
        {...aria}
      />
    );
  }

  if (project.logoMode === 'dual' && project.logoHover) {
    if (!swapOnGroupHover) {
      return (
        <span className={`relative block ${className}`} {...aria}>
          <img
            src={project.logo}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </span>
      );
    }
    return (
      <span className={`relative block ${className}`}>
        <img
          src={project.logo}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 group-hover:opacity-0"
        />
        <img
          src={project.logoHover}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </span>
    );
  }

  return (
    <img
      src={project.logo}
      alt={label ?? ''}
      aria-hidden={label ? undefined : true}
      className={`object-contain ${className}`}
    />
  );
}
