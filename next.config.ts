import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // Demo photography comes from Unsplash; swap for the client's own shots
    // (and drop this block) once real images arrive.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
}

export default withPayload(nextConfig)
