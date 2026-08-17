export function CakeStand({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 300"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="94" cy="110" r="9" />
      <circle cx="120" cy="105" r="9" />
      <circle cx="146" cy="110" r="9" />
      <ellipse cx="120" cy="120" rx="76" ry="11" />
      <path d="M120 131v70" />
      <ellipse cx="120" cy="212" rx="96" ry="13" />
      <path d="M104 225c-3 14-5 24-11 34" />
      <path d="M136 225c3 14 5 24 11 34" />
      <path d="M96 260h48" />
    </svg>
  )
}
