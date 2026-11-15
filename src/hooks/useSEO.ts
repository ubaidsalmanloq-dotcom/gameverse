import { useEffect } from 'react'
import { asset } from '@/lib/utils'

interface SEOOptions {
  title: string
  description: string
  image?: string
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export function useSEO({ title, description, image }: SEOOptions): void {
  useEffect(() => {
    document.title = title
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    if (image) {
      setMeta('meta[property="og:image"]', 'property', 'og:image', asset(image))
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', asset(image))
    }
  }, [title, description, image])
}
