export function DessertCup({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="24" cy="20" rx="9" ry="2.4" />
      <path d="M15 20l2.6 17h12.8L33 20" />
      <path d="M18.4 32h11.2" opacity="0.55" />
      <circle cx="24" cy="14.5" r="2.2" />
      <path d="M25.4 12.6c1-2 2.6-3 4.2-3" />
    </svg>
  )
}
