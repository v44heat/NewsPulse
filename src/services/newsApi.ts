import axios from 'axios'
import type { NewsApiResponse, NewsSourcesResponse, Category, SearchFilters } from '../types'

const API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'demo'
const BASE_URL = 'https://newsapi.org/v2'

const newsApi = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY,
  },
})

export const newsService = {
  // Get top headlines
  async getTopHeadlines(params: {
    category?: Category
    country?: string
    page?: number
    pageSize?: number
    sources?: string
    q?: string
  }): Promise<NewsApiResponse> {
    const { data } = await newsApi.get<NewsApiResponse>('/top-headlines', {
      params: {
        country: params.sources ? undefined : (params.country || 'us'),
        category: params.category,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        sources: params.sources,
        q: params.q,
      },
    })
    return data
  },

  // Search everything
  async searchEverything(filters: SearchFilters & { page?: number; pageSize?: number }): Promise<NewsApiResponse> {
    const { data } = await newsApi.get<NewsApiResponse>('/everything', {
      params: {
        q: filters.query || 'news',
        from: filters.from,
        to: filters.to,
        sources: filters.sources,
        sortBy: filters.sortBy || 'publishedAt',
        page: filters.page || 1,
        pageSize: filters.pageSize || 20,
        language: 'en',
      },
    })
    return data
  },

  // Get trending topic articles
  async getTrendingTopic(keyword: string): Promise<NewsApiResponse> {
    const { data } = await newsApi.get<NewsApiResponse>('/everything', {
      params: {
        q: keyword,
        sortBy: 'popularity',
        pageSize: 5,
        language: 'en',
      },
    })
    return data
  },

  // Get news sources
  async getSources(category?: Category): Promise<NewsSourcesResponse> {
    const { data } = await newsApi.get<NewsSourcesResponse>('/sources', {
      params: {
        category,
        language: 'en',
      },
    })
    return data
  },
}

// Mock data for when API key is not set (demo mode)
export const MOCK_ARTICLES = [
  {
    source: { id: 'bbc-news', name: 'BBC News' },
    author: 'BBC News Staff',
    title: 'AI Revolution: How Artificial Intelligence is Transforming Every Industry',
    description: 'From healthcare to finance, artificial intelligence is reshaping the way businesses operate and how people live their daily lives. Experts predict this transformation will accelerate in coming years.',
    url: 'https://bbc.com',
    urlToImage: 'https://picsum.photos/seed/ai-news/800/450',
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    content: 'Artificial intelligence is transforming industries at an unprecedented pace...',
  },
  {
    source: { id: 'techcrunch', name: 'TechCrunch' },
    author: 'Sarah Chen',
    title: 'SpaceX Successfully Launches 50 New Starlink Satellites Into Orbit',
    description: 'The latest Starlink mission marks another milestone for SpaceX as the company continues to expand its global internet coverage network.',
    url: 'https://techcrunch.com',
    urlToImage: 'https://picsum.photos/seed/spacex/800/450',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    content: 'SpaceX has successfully launched another batch of Starlink satellites...',
  },
  {
    source: { id: 'reuters', name: 'Reuters' },
    author: 'John Smith',
    title: 'Global Markets Rally as Inflation Data Shows Promising Signs of Cooling',
    description: 'Stock markets around the world surged today after new economic data suggested that inflation pressures may be easing, giving central banks room to pause rate hikes.',
    url: 'https://reuters.com',
    urlToImage: 'https://picsum.photos/seed/markets/800/450',
    publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    content: 'Global financial markets experienced significant gains today...',
  },
  {
    source: { id: 'espn', name: 'ESPN' },
    author: 'Mike Johnson',
    title: 'Champions League: Stunning Last-Minute Goal Secures Historic Victory',
    description: 'In one of the most dramatic finishes in Champions League history, a last-minute goal sent the crowd into frenzy and secured a place in the final.',
    url: 'https://espn.com',
    urlToImage: 'https://picsum.photos/seed/soccer/800/450',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    content: 'The match lived up to all expectations as both teams gave everything...',
  },
  {
    source: { id: 'bloomberg', name: 'Bloomberg' },
    author: 'Emma Wilson',
    title: 'Bitcoin Surges Past $70,000 as Institutional Adoption Accelerates',
    description: 'The world\'s largest cryptocurrency reached new highs as major financial institutions announced plans to add Bitcoin to their portfolio offerings.',
    url: 'https://bloomberg.com',
    urlToImage: 'https://picsum.photos/seed/bitcoin/800/450',
    publishedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    content: 'Bitcoin has once again demonstrated its resilience by breaking through...',
  },
  {
    source: { id: 'health-us', name: 'Health Today' },
    author: 'Dr. Lisa Park',
    title: 'New Breakthrough in Cancer Treatment Shows 90% Success Rate in Trials',
    description: 'Researchers have announced a groundbreaking new immunotherapy treatment that has shown remarkable success rates in Phase 3 clinical trials for multiple cancer types.',
    url: 'https://healthtoday.com',
    urlToImage: 'https://picsum.photos/seed/medical/800/450',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    content: 'A revolutionary new cancer treatment has achieved results that exceed expectations...',
  },
  {
    source: { id: 'the-guardian', name: 'The Guardian' },
    author: 'James Brown',
    title: 'Climate Summit: World Leaders Agree to New Carbon Reduction Targets',
    description: 'At the emergency climate summit, representatives from 120 countries signed a historic agreement to accelerate carbon emission reductions and fund green energy transitions.',
    url: 'https://guardian.com',
    urlToImage: 'https://picsum.photos/seed/climate/800/450',
    publishedAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    content: 'World leaders gathered in Geneva reached a landmark agreement on climate action...',
  },
  {
    source: { id: 'variety', name: 'Variety' },
    author: 'Amy Davis',
    title: 'Oscars 2025: Complete List of Winners and Highlights from the Ceremony',
    description: 'The 97th Academy Awards delivered surprises and emotional moments as Hollywood\'s biggest night celebrated the best films and performances of the past year.',
    url: 'https://variety.com',
    urlToImage: 'https://picsum.photos/seed/oscars/800/450',
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    content: 'The Academy Awards ceremony was filled with unforgettable moments...',
  },
]
