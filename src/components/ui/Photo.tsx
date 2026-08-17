import Image from 'next/image'

import type { Photo as PhotoData } from '@/data/content'

interface PhotoProps {
  photo: PhotoData
  /** Aspect ratio, radius and any extra layout classes for the frame. */
  className?: string
  sizes: string
  priority?: boolean
  imageClassName?: string
}

export function Photo({
  photo,
  className,
  sizes,
  priority = false,
  imageClassName,
}: PhotoProps) {
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${imageClassName ?? ''}`}
      />
    </div>
  )
}
