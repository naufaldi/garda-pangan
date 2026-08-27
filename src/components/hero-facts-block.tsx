import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '#/components/ui/carousel'
import type { CarouselApi } from '#/components/ui/carousel'
import { buildImpactMetrics } from '#/lib/impact-metrics'
import { cn } from '#/lib/utils'

import { GardaLogo } from './garda-logo'

type HeroFactsBlockProps = {
  didYouKnowSlides?: { id: number | string; content: string }[]
  didYouKnowTitle?: string | null
  portionsRescued?: string | null
  co2Reduced?: string | null
  foodLossPotential?: string | null
  foodScrap?: string | null
  impactStats?: { id: number; label: string; value: string }[]
  className?: string
  animateNumbers?: boolean
}

function renderDidYouKnowTitle(raw: string) {
  if (/\r?\n/.test(raw)) {
    const lines = raw.split(/\r?\n/)
    return lines.map((line, index) => (
      <span key={index}>
        {line}
        {index < lines.length - 1 ? <br /> : null}
      </span>
    ))
  }

  const firstSpace = raw.lastIndexOf(' ')
  if (firstSpace > 0) {
    return (
      <>
        {raw.slice(0, firstSpace)}
        <br />
        {raw.slice(firstSpace + 1)}
      </>
    )
  }

  return raw
}

function DidYouKnowCarouselInternal({
  slides,
}: {
  slides?: { id: number | string; content: string }[]
}) {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }))
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const items =
    slides && slides.length > 0
      ? slides
      : [
          {
            id: 'default',
            content:
              '“Kalau sepertiga makanan yang diproduksi di seluruh dunia terbuang sia-sia? Kerugian ekonomi yang ditimbulkan juga luar biasa besar!”',
          },
        ]

  return (
    <Carousel
      opts={{ align: 'start', loop: true }}
      plugins={[plugin.current]}
      setApi={setCarouselApi}
      className="static w-full min-w-0"
    >
      <CarouselContent>
        {items.map((slide) => (
          <CarouselItem key={slide.id} className="min-w-0">
            <p className="text-pretty break-words pb-12 text-left text-base font-medium leading-snug text-white md:pb-20 md:text-right md:text-lg md:leading-relaxed lg:text-xl">
              {slide.content}
            </p>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-0 right-0 z-20 flex justify-end gap-2 md:gap-4">
        <button
          onClick={() => carouselApi?.scrollPrev()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-garda-sun text-[#0d2b14] transition-transform hover:scale-105 md:h-14 md:w-14"
          aria-label="Previous fact"
        >
          <ChevronLeft className="size-6 stroke-2" />
        </button>
        <button
          onClick={() => carouselApi?.scrollNext()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-garda-sun text-[#0d2b14] transition-transform hover:scale-105 md:h-14 md:w-14"
          aria-label="Next fact"
        >
          <ChevronRight className="size-6 stroke-2" />
        </button>
      </div>
    </Carousel>
  )
}

function ImpactStatItem({
  metric,
  animateNumbers,
}: {
  metric: { value: string; label: string }
  animateNumbers: boolean
}) {
  const numMatch = metric.value.match(/[\d,.]+/)
  const numStr = numMatch ? numMatch[0] : ''
  const [unit, ...restLabel] = metric.label.split(' ')
  const remainingLabel = restLabel.join(' ')

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-baseline gap-1.5 text-garda-sun md:mb-2 xl:flex-nowrap">
        <span className="font-serif text-xl tracking-tighter md:text-3xl lg:text-4xl xl:text-[2.5rem]">
          {numStr && animateNumbers ? (
            <span
              className="impact-number"
              data-value={numStr.replace(/,/g, '')}
            >
              0
            </span>
          ) : (
            numStr || metric.value
          )}
        </span>
        {unit ? (
          <span className="text-[0.65rem] uppercase tracking-wider md:text-sm">
            {unit}
          </span>
        ) : null}
      </div>
      <p className="text-[0.65rem] uppercase tracking-wider text-white/90 md:text-xs lg:text-sm">
        {remainingLabel}
      </p>
    </div>
  )
}

export function HeroFactsBlock({
  didYouKnowSlides,
  didYouKnowTitle,
  portionsRescued,
  co2Reduced,
  foodLossPotential,
  foodScrap,
  impactStats,
  className,
  animateNumbers = true,
}: HeroFactsBlockProps) {
  const metrics = buildImpactMetrics({
    portionsRescued,
    co2Reduced,
    foodLossPotential,
    foodScrap,
    stats: impactStats,
  })
  const title = didYouKnowTitle ?? 'Tahukah Kamu?'

  return (
    <div
      data-testid="hero-facts-block"
      className={cn('w-full max-md:max-h-[calc(100svh-3.5rem)]', className)}
    >
      <div className="relative mx-auto mt-2 max-w-5xl md:mt-12">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-[#0d2b14] p-4 shadow-2xl md:rounded-[2rem] md:p-10">
          <div className="pointer-events-none absolute -bottom-16 -left-16 text-white/5 opacity-20">
            <svg
              width="400"
              height="400"
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M50 0 C22.4 0 0 22.4 0 50 C0 77.6 22.4 100 50 100 C77.6 100 100 77.6 100 50 C100 22.4 77.6 0 50 0 Z M50 90 C27.9 90 10 72.1 10 50 C10 27.9 27.9 10 50 10 C72.1 10 90 27.9 90 50 C90 72.1 72.1 90 50 90 Z" />
            </svg>
          </div>

          <div className="relative z-10 grid gap-3 md:grid-cols-2 md:gap-8">
            <div className="flex flex-row items-center justify-between gap-3 md:flex-col md:items-start md:justify-start md:gap-0">
              <h2
                aria-label={title}
                className="font-serif text-[clamp(1.5rem,6vw,3.5rem)] leading-[1.05] text-garda-sun"
              >
                {renderDidYouKnowTitle(title)}
              </h2>
              <GardaLogo className="pointer-events-none origin-right shrink-0 scale-90 transform opacity-30 invert brightness-0 md:mt-6 md:origin-top-left md:scale-150" />
            </div>
            <div className="ml-auto flex w-full min-w-0 max-w-md flex-col items-stretch justify-between">
              <DidYouKnowCarouselInternal slides={didYouKnowSlides} />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-[32%] z-10 w-[88px] -translate-x-1/2 sm:w-[110px] md:left-1/2 md:top-[10%] md:w-[300px]">
          <img
            src="/hero-facts.png"
            alt="Volunteer"
            loading="eager"
            decoding="async"
            className="h-auto w-full drop-shadow-2xl"
          />
        </div>

        <div className="relative z-20 mt-4 rounded-[1.5rem] bg-[#0d2b14] p-3 shadow-2xl sm:mt-8 sm:p-5 md:mt-24 md:rounded-[2rem] md:p-8">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-2 md:gap-5">
            {metrics.slice(0, 4).map((metric) => (
              <ImpactStatItem
                key={metric.label}
                metric={metric}
                animateNumbers={animateNumbers}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
