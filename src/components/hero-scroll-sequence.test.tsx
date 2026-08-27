import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { HeroScrollSequence } from './hero-scroll-sequence'

const timelineMock = {
  to: vi.fn().mockReturnThis(),
  fromTo: vi.fn().mockReturnThis(),
  call: vi.fn().mockReturnThis(),
}

vi.mock('#/lib/gsap-client', () => ({
  ensureGsapPlugins: vi.fn(),
  gsap: {
    context: vi.fn((callback: () => void) => {
      callback()
      return { revert: vi.fn() }
    }),
    set: vi.fn(),
    timeline: vi.fn(() => timelineMock),
  },
  ScrollTrigger: {
    refresh: vi.fn(),
    isScrolling: vi.fn(() => false),
  },
}))

vi.mock('embla-carousel-react', async () => {
  const React = await import('react')

  function useEmblaCarousel() {
    const ref = React.useCallback(() => {}, [])
    const api = React.useMemo(
      () => ({
        canScrollNext: () => true,
        canScrollPrev: () => true,
        off: vi.fn(),
        on: vi.fn(),
        scrollNext: vi.fn(),
        scrollPrev: vi.fn(),
        scrollSnapList: () => [0],
        selectedScrollSnap: () => 0,
      }),
      [],
    )

    return [ref, api] as const
  }

  return {
    __esModule: true,
    default: useEmblaCarousel,
  }
})

function mockMatchMedia(reducedMotion = false) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches:
      query === '(prefers-reduced-motion: reduce)' ? reducedMotion : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('HeroScrollSequence', () => {
  test('renders hero copy, impact stats, and did-you-know inside the scroll sequence', async () => {
    mockMatchMedia(false)
    const { gsap } = await import('#/lib/gsap-client')
    render(<HeroScrollSequence />)

    expect(
      screen.getByRole('heading', {
        name: /one stop food loss & waste solution/i,
      }),
    ).toBeTruthy()
    expect(screen.getByTestId('hero-scroll-sequence')).toBeTruthy()
    expect(screen.getByTestId('hero-o-portal')).toBeTruthy()
    expect(screen.getByTestId('hero-reveal-image')).toBeTruthy()
    expect(screen.getByTestId('hero-reveal-image').getAttribute('src')).toBe(
      '/garda-hero-reference.png',
    )
    expect(screen.getByText(/of food rescued/i)).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: /tahukah kamu\?/i }),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: /scroll ke konten/i })).toBeTruthy()
    expect(gsap.timeline).toHaveBeenCalled()
  })

  test('keeps the o-portal and gsap setup when a cms title prop is provided', async () => {
    mockMatchMedia(false)
    const { gsap } = await import('#/lib/gsap-client')
    vi.mocked(gsap.timeline).mockClear()

    render(<HeroScrollSequence title="ONE STOP FOOD LOSS & WASTE SOLUTION" />)

    expect(screen.getByTestId('hero-o-portal')).toBeTruthy()
    expect(gsap.timeline).toHaveBeenCalled()
  })

  test('renders reduced-motion fallback without tall scroll wrapper', () => {
    mockMatchMedia(true)
    render(
      <HeroScrollSequence
        impactStats={[
          { id: 1, label: 'Porsi Makanan berhasil Diselamatkan', value: '825002' },
          { id: 2, label: 'orang warga Pra-Sejahtera Penerima Manfaat', value: '29294' },
          { id: 3, label: 'KG Sampah Makanan Diproses Menjadi Pakan Ternak', value: '658000' },
          { id: 4, label: 'KGCO2-ek emisi gas rumah kaca berhasil dicegah', value: '1506416' },
        ]}
      />,
    )

    expect(screen.getByTestId('hero-scroll-sequence-static')).toBeTruthy()
    expect(screen.queryByTestId('hero-scroll-sequence')).toBeNull()
    expect(screen.getByTestId('hero-facts-block')).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: /tahukah kamu\?/i }),
    ).toBeTruthy()
    expect(screen.getByAltText('Volunteer')).toBeTruthy()
    expect(screen.getByText(/makanan berhasil diselamatkan/i)).toBeTruthy()
    expect(screen.getByText(/29,294/)).toBeTruthy()
  })

  test('uses a mobile-safe facts overlay layout in the animated hero', () => {
    mockMatchMedia(false)
    render(<HeroScrollSequence />)

    const factsOverlay = screen.getByTestId('hero-facts-overlay')
    expect(factsOverlay.className).toMatch(/max-md:items-end/)
    expect(factsOverlay.className).toMatch(/max-md:overflow-y-auto/)
  })
})
