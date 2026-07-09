import type { Project } from '../../data/projects';

export interface ProjectLogoProps {
  project: Project;
  /** Sizes the logo box, e.g. "h-14 w-14" (cards) or "h-20 w-20" (modal). */
  className?: string;
  /**
   * Accessible label for the logo. Pass the project title when the logo is
   * meaningful on its own; omit to mark it decorative (e.g. when the title
   * is rendered right beside it).
   */
  label?: string;
}

/**
 * Renders a project logo in the right mode for its context:
 *
 * - `mono`  — a flat single-color SVG, recolored via a CSS mask so it
 *   follows the surrounding `currentColor` (stays visible on any
 *   background, and recolors with card hover).
 * - `dual`  — a light logo by default, swapped to a dark variant when the
 *   nearest `.group` ancestor is hovered (used by project cards).
 * - normal  — a plain raster logo.
 *
 * Shared by the project cards and the project overlay so the recoloring
 * logic lives in one place.
 */
export default function ProjectLogo({
  project,
  className = '',
  label,
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
