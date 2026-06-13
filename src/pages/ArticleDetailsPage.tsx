import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Bookmark, BookmarkCheck, ExternalLink, Share2, Clock,
  User, Calendar, Twitter, Link2, Sparkles, Loader2
} from 'lucide-react'
import { NewsCard } from '../components/NewsCard'
import { useBookmarks, useTopHeadlines } from '../hooks'
import { formatDate, estimateReadTime, buildShareUrl, cn } from '../utils'
import type { Article, Category } from '../types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types'
import { recentService } from '../services/storage'

interface ArticleState {
  article: Article
  category?: Category
}

function AISummary({ article }: { article: Article }) {
  const [summary, setSummary] = useState<string | null>(null)
  const [keyPoints, setKeyPoints] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSummary = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a news summarizer. Given this article, produce a concise summary and 3 key takeaways.

Title: ${article.title}
Source: ${article.source.name}
Description: ${article.description || 'N/A'}
Content: ${article.content || 'N/A'}

Respond ONLY with valid JSON, no markdown fences, exactly this shape:
{"summary":"2-3 sentence summary here","points":["point 1","point 2","point 3"]}`
          }]
        })
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error((err as { error?: { message?: string } }).error?.message || `API error ${response.status}`)
      }

      const data = await response.json()
      const text = (data.content as Array<{ type: string; text?: string }>)
        ?.find((b) => b.type === 'text')?.text ?? ''

      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean) as { summary: string; points: string[] }
      setSummary(parsed.summary)
      setKeyPoints(parsed.points)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-5 border-l-4 border-l-primary-500 bg-gradient-to-br from-primary-50/50 to-white dark:from-primary-900/10 dark:to-[#1a2235]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">AI Summary</h3>
          <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400 text-xs">Claude</span>
        </div>
        {!summary && !loading && (
          <button
            onClick={generateSummary}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Generate
          </button>
        )}
        {summary && (
          <button
            onClick={() => { setSummary(null); setKeyPoints([]) }}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            Regenerate
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-4">
          <Loader2 className="w-5 h-5 text-primary-500 animate-spin flex-shrink-0" />
          <span className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Analyzing article with Claude AI…</span>
        </div>
      )}

      {error && !loading && (
        <div className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-xl p-3">
          <strong>Error:</strong> {error}
        </div>
      )}

      {summary && !loading && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{summary}</p>
          {keyPoints.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Key Takeaways</p>
              <ul className="space-y-2">
                {keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!summary && !loading && !error && (
        <p className="text-sm text-slate-400 dark:text-slate-500">
          Click <strong className="text-slate-600 dark:text-slate-300">Generate</strong> for an AI-powered summary and key takeaways from this article.
        </p>
      )}
    </div>
  )
}

export function ArticleDetailsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { article, category } = (location.state as ArticleState) || {}
  const { isBookmarked, toggle } = useBookmarks()
  const [copied, setCopied] = useState(false)

  const { data: relatedData } = useTopHeadlines({ category, pageSize: 4 })
  const relatedArticles = relatedData?.articles?.filter((a) => a.url !== article?.url).slice(0, 3) ?? []

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="font-display text-2xl text-slate-700 dark:text-slate-300 mb-4">Article not found</h2>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    )
  }

  const readTime = estimateReadTime(article.content)
  const fallbackImg = `https://picsum.photos/seed/${encodeURIComponent(article.title.slice(0, 10))}/1200/675`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(article.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to News
      </button>

      <article className="space-y-6">
        {/* Category badge */}
        {category && (
          <span className={cn('badge', CATEGORY_COLORS[category])}>
            {CATEGORY_LABELS[category]}
          </span>
        )}

        {/* Title */}
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-200 dark:border-slate-700">
          <span className="font-semibold text-primary-600 dark:text-primary-400">
            {article.source.name}
          </span>
          {article.author && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {article.author.split(',')[0]}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(article.publishedAt, false)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {readTime} min read
          </span>
        </div>

        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-video">
          <img
            src={article.urlToImage || fallbackImg}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg }}
          />
        </div>

        {/* AI Summary */}
        <AISummary article={article} />

        {/* Description */}
        {article.description && (
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {article.description}
          </p>
        )}

        {/* Content Preview */}
        {article.content && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {article.content.replace(/\[\+\d+ chars\]/, '')}
            </p>
            <div className="not-prose mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                This is a preview. Read the full article on {article.source.name}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Read Full Article
              </a>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 py-4 border-t border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => toggle(article)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              isBookmarked(article.url)
                ? 'bg-accent-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            {isBookmarked(article.url) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {isBookmarked(article.url) ? 'Saved' : 'Save Article'}
          </button>

          <a
            href={buildShareUrl('twitter', article.url, article.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 transition-all"
          >
            <Twitter className="w-4 h-4" />
            Share on X
          </a>

          <a
            href={buildShareUrl('whatsapp', article.url, article.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
          >
            <Share2 className="w-4 h-4" />
            WhatsApp
          </a>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <Link2 className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((a, i) => (
              <NewsCard
                key={`${a.url}-${i}`}
                article={a}
                category={category}
                isBookmarked={isBookmarked(a.url)}
                onToggleBookmark={(art) => { toggle(art); recentService.add(art) }}
                size="compact"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
