import { cn } from '../utils'

interface SkeletonProps {
  className?: string
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('bg-slate-200 dark:bg-slate-700/60 rounded-lg animate-pulse', className)} />
  )
}

export function NewsCardSkeleton({ size = 'default' }: { size?: 'default' | 'compact' | 'large' }) {
  return (
    <div className="card flex flex-col">
      <Skeleton className={cn('rounded-none rounded-t-2xl', size === 'large' ? 'h-56 sm:h-64' : size === 'compact' ? 'h-36' : 'h-44')} />
      <div className="p-4 space-y-3 flex-1">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        {size !== 'compact' && (
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
          <Skeleton className="h-3 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-6 rounded-lg" />
            <Skeleton className="h-6 w-6 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 animate-pulse" style={{ minHeight: 420 }}>
      <div className="h-full flex flex-col justify-end p-6 bg-gradient-to-t from-slate-300 dark:from-slate-900 to-transparent">
        <Skeleton className="h-4 w-48 mb-3 bg-slate-300 dark:bg-slate-700" />
        <Skeleton className="h-8 w-4/5 mb-2 bg-slate-300 dark:bg-slate-700" />
        <Skeleton className="h-8 w-3/5 mb-4 bg-slate-300 dark:bg-slate-700" />
        <Skeleton className="h-3 w-full mb-2 bg-slate-300 dark:bg-slate-700" />
        <Skeleton className="h-3 w-3/4 mb-4 bg-slate-300 dark:bg-slate-700" />
        <Skeleton className="h-10 w-36 rounded-xl bg-slate-300 dark:bg-slate-700" />
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 8, size = 'default' }: { count?: number; size?: 'default' | 'compact' | 'large' }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} size={size} />
      ))}
    </div>
  )
}
