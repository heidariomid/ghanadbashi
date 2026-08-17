/**
 * Interface icons: 24×24 viewBox, 1.5 stroke, rounded caps, currentColor.
 */
interface IconProps {
  className?: string
}

const shared = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M4 8h16" />
      <path d="M4 16h10" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  )
}

