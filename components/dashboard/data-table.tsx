"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ChevronUp, ChevronDown, Search, TrendingUp, TrendingDown, Download, Brain } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Coin, formatCurrency, formatPercentage } from "@/lib/api"
import { generateMarketInsights, type MarketInsight } from "@/lib/groq"
import Papa from 'papaparse'

interface DataTableProps {
  data: Coin[];
  loading?: boolean;
}

type SortKey = 'rank' | 'name' | 'price' | 'change' | 'marketCap';
type SortOrder = 'asc' | 'desc';

export function DataTable({ data, loading = false }: DataTableProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('change')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [insights, setInsights] = useState<MarketInsight | null>(null)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const itemsPerPage = 10

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(coin =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
    )

    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortKey) {
        case 'rank':
          aValue = a.rank
          bValue = b.rank
          break
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'price':
          aValue = parseFloat(a.price)
          bValue = parseFloat(b.price)
          break
        case 'change':
          aValue = parseFloat(a.change)
          bValue = parseFloat(b.change)
          break
        case 'marketCap':
          aValue = parseFloat(a.marketCap)
          bValue = parseFloat(b.marketCap)
          break
        default:
          aValue = a.rank
          bValue = b.rank
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [data, search, sortKey, sortOrder])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedData, currentPage])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const handleExportCSV = () => {
    const csvData = filteredAndSortedData.map(coin => ({
      Rank: coin.rank,
      Name: coin.name,
      Symbol: coin.symbol,
      Price: coin.price,
      'Change (24h)': coin.change + '%',
      'Market Cap': coin.marketCap,
      'Volume (24h)': coin['24hVolume']
    }))

    const csv = Papa.unparse(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `cryptocurrency-market-data-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleGenerateInsights = async () => {
    setLoadingInsights(true)
    try {
      const marketInsights = await generateMarketInsights(data)
      setInsights(marketInsights)
    } catch (error) {
      console.error('Error generating insights:', error)
    } finally {
      setLoadingInsights(false)
    }
  }

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />
  }

  if (loading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-full max-w-sm" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.3 }}
      className="col-span-3"
    >
      <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Digital Asset Performance Analytics</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleGenerateInsights}
                disabled={loadingInsights}
                variant="outline"
                size="sm"
                className="transition-all duration-200 hover:scale-105"
              >
                <Brain className={`h-4 w-4 mr-2 ${loadingInsights ? 'animate-pulse' : ''}`} />
                AI Insights
              </Button>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="transition-all duration-200 hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search digital assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {insights && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border"
            >
              <h4 className="font-semibold mb-2 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI Market Analysis
              </h4>
              <p className="text-sm text-muted-foreground mb-3">{insights.summary}</p>
              <div className="flex items-center space-x-4 mb-3">
                <Badge variant={insights.marketTrend === 'bullish' ? 'default' : insights.marketTrend === 'bearish' ? 'destructive' : 'secondary'}>
                  {insights.marketTrend.toUpperCase()} TREND
                </Badge>
                <Badge variant={insights.riskLevel === 'low' ? 'default' : insights.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                  {insights.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-1">Top Performers:</h5>
                  <ul className="text-muted-foreground">
                    {insights.topPerformers.map((performer, index) => (
                      <li key={index}>• {performer}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Recommendations:</h5>
                  <ul className="text-muted-foreground">
                    {insights.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('rank')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Rank <SortIcon column="rank" />
                    </Button>
                  </th>
                  <th className="text-left py-3 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('name')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Asset <SortIcon column="name" />
                    </Button>
                  </th>
                  <th className="text-left py-3 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('price')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Current Value <SortIcon column="price" />
                    </Button>
                  </th>
                  <th className="text-left py-3 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('change')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Performance (24h) <SortIcon column="change" />
                    </Button>
                  </th>
                  <th className="text-left py-3 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('marketCap')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Market Value <SortIcon column="marketCap" />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((coin, index) => (
                  <motion.tr
                    key={coin.uuid}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <span className="font-medium">#{coin.rank}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-3">
                        <img
                          src={coin.iconUrl}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-sm text-muted-foreground">{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-medium">{formatCurrency(coin.price)}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className={`flex items-center space-x-1 ${
                        parseFloat(coin.change) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {parseFloat(coin.change) >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">{formatPercentage(coin.change)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-medium">{formatCurrency(coin.marketCap)}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}