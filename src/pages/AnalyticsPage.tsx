import { BarChart2 } from 'lucide-react'
import { AnalyticsCharts } from '../components/AnalyticsCharts'
import { useTopHeadlines } from '../hooks'

export function AnalyticsPage() {
  const { data } = useTopHeadlines({ pageSize: 20 })
  const articles = data?.articles ?? []

  const stats = [
    { label: 'Total Articles', value: data?.totalResults?.toLocaleString() ?? '–', sub: 'across all sources' },
    { label: 'Active Sources', value: '71+', sub: 'news providers' },
    { label: 'Categories', value: '7', sub: 'topic areas' },
    { label: 'Updates', value: 'Live', sub: 'real-time feed' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">
          Analytics
        </h1>
      </div>
      <p className="text-slate-500 dark:text-slate-400 -mt-4">
        Insights into news distribution, trending topics, and source coverage
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-sm text-slate-400 dark:text-slate-500">{stat.label}</p>
            <p className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {stat.value}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <AnalyticsCharts articles={articles} />
    </div>
  )
}
