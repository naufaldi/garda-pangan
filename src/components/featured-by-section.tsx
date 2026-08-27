import { useState } from 'react'

import { LogoCard } from './logo-card'
import { SectionShell } from './section-shell'
import { isUnloadableLogoUrl } from '#/lib/logo-media'
import { normalizeStrapiMediaUrl } from '#/lib/strapi/client'

const featuredLogos = [
  { id: 'tempo', label: 'TEMPO.CO', variant: 'tempo' },
  { id: 'cnn', label: 'CNN Indonesia', variant: 'cnn' },
  { id: 'metro', label: 'METRO TV', variant: 'metro' },
  { id: 'forbes', label: 'Forbes Indonesia', variant: 'forbes' },
  { id: 'bbc', label: 'BBC NEWS', variant: 'bbc' },
  { id: 'trans-1', label: 'TRANS TV', variant: 'trans' },
  { id: 'reader-1', label: "Reader's Digest", variant: 'reader' },
]

type LogoItem = {
  id: string | number
  label?: string | null
  url?: string | null
  variant?: string
}

function FeaturedLogoTile({
  logo,
  index,
}: {
  logo: LogoItem
  index: number
}) {
  const src = normalizeStrapiMediaUrl(logo.url)
  const [failed, setFailed] = useState(false)

  if (!src || isUnloadableLogoUrl(src) || failed) {
    return null
  }

  return (
    <LogoCard
      compact
      data-testid={`featured-card-${logo.id}-${index}`}
      className="flex h-16 w-[120px] shrink-0 items-center justify-center rounded-sm border-transparent bg-white shadow-none"
    >
      <img
        src={src}
        alt={logo.label ?? ''}
        loading="eager"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-12 max-w-[96px] w-auto object-contain"
      />
    </LogoCard>
  )
}

type FeaturedBySectionProps = {
  title?: string | null
  logos?: { id: number; url: string; name?: string | null }[]
  speed?: string
}

export function FeaturedBySection({
  title,
  logos,
  speed = '25s',
}: FeaturedBySectionProps) {
  const sourceItems: LogoItem[] =
    logos && logos.length > 0
      ? logos.map((logo) => ({
          id: logo.id,
          url: logo.url,
          label: logo.name,
        }))
      : featuredLogos

  const items = sourceItems.filter(
    (logo) => logo.url && !isUnloadableLogoUrl(logo.url),
  )
  const track = [...items, ...items]

  return (
    <SectionShell
      id="featured-by"
      aria-labelledby="featured-by-heading"
      spacing="default"
      tone="transparent"
    >
      <div className="mx-auto flex w-full flex-col gap-10 md:gap-12">
        <div className="flex justify-center text-center">
          <h2
            id="featured-by-heading"
            className="garda-section-heading text-[clamp(2rem,5vw,3rem)] lg:text-[3.5rem]"
          >
            {title || 'Featured by'}
          </h2>
        </div>

        <div
          data-testid="featured-marquee"
          className="relative overflow-hidden"
          aria-label="Featured by media"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-(--color-bg,#0c2b1a) to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-(--color-bg,#0c2b1a) to-transparent" />

          <div
            className="flex animate-marquee gap-4"
            style={{ width: 'max-content', animationDuration: speed }}
          >
            {track.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                aria-hidden={index >= items.length}
                className="shrink-0"
              >
                <FeaturedLogoTile logo={logo} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
