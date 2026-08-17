export function BirthdayCake({ className }: { className?: string }) {
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
      <ellipse cx="24" cy="26" rx="15" ry="3.4" />
      <path d="M9 26v11" />
      <path d="M39 26v11" />
      <path d="M9 37a15 3.4 0 0 0 30 0" />
      <path d="M24 24v-7" />
      <path d="M24 16.4c2.4-2.2 1.3-4.7 0-6.4-1.3 1.7-2.4 4.2 0 6.4Z" />
    </svg>
  )
}
