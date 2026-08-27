export function isUnloadableLogoUrl(url?: string | null) {
  if (!url) {
    return true
  }

  return /\.jfif(?:$|[?#])/i.test(url)
}
