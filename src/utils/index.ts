import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string, relative = true): string {
  try {
    const date = new Date(dateStr)
    if (relative) {
      return formatDistanceToNow(date, { addSuffix: true })
    }
    return format(date, 'MMM d, yyyy · h:mm a')
  } catch {
    return dateStr
  }
}

export function estimateReadTime(content: string | null): number {
  if (!content) return 1
  const words = content.split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export function getImageFallback(category?: string): string {
  const seeds: Record<string, string> = {
    technology: 'tech',
    business: 'business',
    sports: 'sports',
    entertainment: 'entertainment',
    health: 'health',
    science: 'science',
    general: 'news',
  }
  const seed = (category && seeds[category]) || 'news'
  return `https://picsum.photos/seed/${seed}-${Math.floor(Math.random() * 20)}/800/450`
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function generateArticleId(url: string): string {
  return btoa(url).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)
}

export function buildShareUrl(platform: 'twitter' | 'facebook' | 'whatsapp', url: string, title: string): string {
  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encoded}`
    case 'whatsapp':
      return `https://wa.me/?text=${encodedTitle}%20${encoded}`
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const CATEGORY_CHART_COLORS: Record<string, string> = {
  general: '#64748b',
  business: '#10b981',
  technology: '#3b82f6',
  sports: '#f97316',
  entertainment: '#a855f7',
  health: '#f43f5e',
  science: '#14b8a6',
}
