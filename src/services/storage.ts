import type { BookmarkedArticle, Article } from '../types'

// Bookmarks
const BOOKMARKS_KEY = 'newspulse_bookmarks'
const RECENT_KEY = 'newspulse_recent'
const SEARCHES_KEY = 'newspulse_searches'
const THEME_KEY = 'newspulse_theme'

export const bookmarkService = {
  getAll(): BookmarkedArticle[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  add(article: Article): BookmarkedArticle {
    const bookmarks = bookmarkService.getAll()
    const id = btoa(article.url).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)
    const bookmarked: BookmarkedArticle = {
      ...article,
      id,
      bookmarkedAt: new Date().toISOString(),
    }
    const filtered = bookmarks.filter((b) => b.url !== article.url)
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([bookmarked, ...filtered]))
    return bookmarked
  },

  remove(url: string): void {
    const bookmarks = bookmarkService.getAll()
    const filtered = bookmarks.filter((b) => b.url !== url)
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered))
  },

  isBookmarked(url: string): boolean {
    return bookmarkService.getAll().some((b) => b.url === url)
  },

  toggle(article: Article): boolean {
    if (bookmarkService.isBookmarked(article.url)) {
      bookmarkService.remove(article.url)
      return false
    } else {
      bookmarkService.add(article)
      return true
    }
  },
}

export const recentService = {
  getAll(): Article[] {
    try {
      const data = localStorage.getItem(RECENT_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  add(article: Article): void {
    const recent = recentService.getAll()
    const filtered = recent.filter((a) => a.url !== article.url)
    const updated = [article, ...filtered].slice(0, 10)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  },

  clear(): void {
    localStorage.removeItem(RECENT_KEY)
  },
}

export const searchService = {
  getRecent(): string[] {
    try {
      const data = localStorage.getItem(SEARCHES_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  add(query: string): void {
    if (!query.trim()) return
    const searches = searchService.getRecent()
    const filtered = searches.filter((s) => s !== query)
    const updated = [query, ...filtered].slice(0, 8)
    localStorage.setItem(SEARCHES_KEY, JSON.stringify(updated))
  },

  remove(query: string): void {
    const searches = searchService.getRecent()
    localStorage.setItem(SEARCHES_KEY, JSON.stringify(searches.filter((s) => s !== query)))
  },

  clear(): void {
    localStorage.removeItem(SEARCHES_KEY)
  },
}

export const themeService = {
  get(): 'light' | 'dark' {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  },

  set(theme: 'light' | 'dark'): void {
    localStorage.setItem(THEME_KEY, theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  },

  toggle(): 'light' | 'dark' {
    const current = themeService.get()
    const next = current === 'dark' ? 'light' : 'dark'
    themeService.set(next)
    return next
  },
}
