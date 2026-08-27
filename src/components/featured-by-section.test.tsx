import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { FeaturedBySection } from './featured-by-section'

describe('FeaturedBySection', () => {
  const mockLogos = [
    { id: 1, url: '/tempo.png', name: 'TEMPO.CO' },
    { id: 2, url: '/cnn.png', name: 'CNN Indonesia' },
  ]

  test('renders heading and logos in a marquee with default speed', () => {
    const { container } = render(
      <FeaturedBySection title="Our Sponsors" logos={mockLogos} />
    )

    const heading = screen.getByRole('heading', { name: /our sponsors/i })
    expect(heading).toBeTruthy()

    const tempoImages = screen.getAllByAltText('TEMPO.CO')
    expect(tempoImages.length).toBeGreaterThan(0)
    expect(tempoImages[0].getAttribute('src')).toContain('tempo.png')

    const marqueeContainer = container.querySelector('.animate-marquee') as HTMLElement
    expect(marqueeContainer).toBeTruthy()
    expect(marqueeContainer.style.animationDuration).toBe('25s')
  })

  test('applies custom speed prop', () => {
    const { container } = render(
      <FeaturedBySection logos={mockLogos} speed="10s" />
    )

    const marqueeContainer = container.querySelector('.animate-marquee') as HTMLElement
    expect(marqueeContainer).toBeTruthy()
    expect(marqueeContainer.style.animationDuration).toBe('10s')
  })

  test('skips unloadable jfif logos and eagerly loads marquee images', () => {
    const logos = [
      { id: 1, url: '/tempo.png', name: 'TEMPO.CO' },
      { id: 2, url: '/broken.jfif', name: 'Broken JFIF' },
    ]

    render(<FeaturedBySection logos={logos} />)

    expect(screen.getAllByAltText('TEMPO.CO').length).toBeGreaterThan(0)
    expect(screen.queryByAltText('Broken JFIF')).toBeNull()

    const tempoImage = screen.getAllByAltText('TEMPO.CO')[0] as HTMLImageElement
    expect(tempoImage.getAttribute('loading')).toBe('eager')
  })

  test('uses compact logo cards sized for the marquee row', () => {
    render(<FeaturedBySection logos={mockLogos} />)

    const card = screen.getByTestId('featured-card-1-0')
    expect(card.className).toMatch(/h-16/)
    expect(card.querySelector('[data-slot="card-content"]')?.className).toMatch(/min-h-0/)
  })
})
