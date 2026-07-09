/**
 * Inline text link with a trailing arrow that shifts on hover.
 * Renders an <a> by default; pass `as="button"` for a non-anchor variant.
 */
export default function ArrowLink({
  href,
  children,
  external = true,
  className = '',
  ...rest
}) {
  const classes = `group inline-flex items-center gap-2 text-fg underline-offset-4 transition-colors hover:text-muted ${className}`;

  const target = external ? '_blank' : undefined;
  const rel = external ? 'noreferrer noopener' : undefined;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        {...rest}
      >
        <span className="border-b border-transparent group-hover:border-current">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="inline-block translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      <span className="border-b border-transparent group-hover:border-current">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="inline-block translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </button>
  );
}
