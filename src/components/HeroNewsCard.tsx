import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, ExternalLink, Clock, AlertCircle } from 'lucide-react'
import { cn, formatDate, estimateReadTime } from '../utils'
import { recentService } from '../services/storage'
import type { Article } from '../types'

interface HeroNewsCardProps {
  article: Article
  isBookmarked: boolean
  onToggleBookmark: (article: Article) => void
}

export function HeroNewsCard({ article, isBookmarked, onToggleBookmark }: HeroNewsCardProps) {
  const [imgError, setImgError] = useState(false)
  const readTime = estimateReadTime(article.content)
  const fallbackImg = `https://picsum.photos/seed/${encodeURIComponent(article.title.slice(0, 10))}/1200/675`
  const imageSrc = (!imgError && article.urlToImage) ? article.urlToImage : fallbackImg

  const handleClick = () => recentService.add(article)
  const articleState = { article, category: 'general' }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-xl group" style={{ minHeight: 420 }}>
      {/* Background Image */}
      <img
        src={imageSrc}
        alt={article.title}
        onError={() => setImgError(true)}
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

      {/* Breaking Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="flex items-center gap-1.5 bg-accent-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          <AlertCircle className="w-3.5 h-3.5" />
          BREAKING NEWS
        </span>
        <span className="bg-black/50 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full">
          {article.source.name}
        </span>
      </div>

      {/* Actions */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => onToggleBookmark(article)}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Save article'}
          className={cn(
            'p-2 rounded-xl backdrop-blur-sm transition-all',
            isBookmarked
              ? 'bg-accent-500 text-white'
              : 'bg-black/40 text-white hover:bg-black/60'
          )}
        >
          {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center gap-3 mb-3 text-white/60 text-xs">
          <span>{formatDate(article.publishedAt, false)}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readTime} min read
          </span>
        </div>

        <Link
          to="/article"
          state={articleState}
          onClick={handleClick}
          className="block"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight hover:text-primary-300 transition-colors mb-3">
            {article.title}
          </h2>
        </Link>

        {article.description && (
          <p className="text-white/70 text-sm sm:text-base line-clamp-2 mb-4">
            {article.description}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Link
            to="/article"
            state={articleState}
            onClick={handleClick}
            className="btn-primary text-sm"
          >
            Read Full Story
          </Link>
          {article.author && (
            <span className="text-white/50 text-xs">
              By {article.author.split(',')[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
