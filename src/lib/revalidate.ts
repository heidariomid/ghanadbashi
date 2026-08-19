import { revalidatePath } from 'next/cache'

/**
 * Refresh the public routes that read products or site-settings. Wrapped so
 * seed and the Payload CLI can create docs without a Next.js cache store.
 */
export function revalidatePublicSite() {
  try {
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/order')
  } catch {
    // Non-request contexts (seed, `pnpm payload`) have no cache store.
  }
}
