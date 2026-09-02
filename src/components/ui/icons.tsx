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

export function SunIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  )
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M15 4.5A7.5 7.5 0 1 0 19.5 15 6 6 0 0 1 15 4.5Z" />
    </svg>
  )
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  )
}

export function BagIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className}>
      <path d="M6 8h12l-.8 11.2a1.5 1.5 0 0 1-1.5 1.4H8.3a1.5 1.5 0 0 1-1.5-1.4L6 8Z" />
      <path d="M9 8V6.5A3 3 0 0 1 12 3.5 3 3 0 0 1 15 6.5V8" />
    </svg>
  )
}

