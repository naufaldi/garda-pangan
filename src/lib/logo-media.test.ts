import { describe, expect, test } from 'vitest'

import { isUnloadableLogoUrl } from '#/lib/logo-media'

describe('isUnloadableLogoUrl', () => {
  test('flags jfif assets that browsers refuse to decode with nosniff', () => {
    expect(isUnloadableLogoUrl('/uploads/images_1_da23d61cd9.jfif')).toBe(true)
    expect(isUnloadableLogoUrl('https://cms.gardapangan.org/broken.jfif?v=1')).toBe(
      true,
    )
  })

  test('allows standard raster logo urls', () => {
    expect(isUnloadableLogoUrl('/uploads/images_3_5e52865be6.png')).toBe(false)
    expect(isUnloadableLogoUrl('/uploads/bbc_370c22f262.jpeg')).toBe(false)
  })
})
