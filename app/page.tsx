"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Users, BarChart3, Activity } from 'lucide-react'
import { Header } from '@/components/dashboard/header'
import { MetricCard } from '@/components/dashboard/metric-card'
import { CryptoLineChart } from '@/components/dashboard/charts/line-chart'
import { CryptoBarChart } from '@/components/dashboard/charts/bar-chart'
import { CryptoDonutChart } from '@/components/dashboard/charts/donut-chart'
import { DataTable } from '@/components/dashboard/data-table'
import { fetchCoins, fetchBitcoinHistory, type Coin, type GlobalStats, formatCurrency, formatPercentage } from '@/lib/api'

export default function Dashboard() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [bitcoinHistory, setBitcoinHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const [coinsResponse, bitcoinHistoryResponse] = await Promise.all([
        fetchCoins(50),
        fetchBitcoinHistory('1h')
      ])
      
      setCoins(coinsResponse.data.coins)
      setGlobalStats(coinsResponse.data.stats)
      setLastRefresh(new Date())
      
      // Process Bitcoin history data for chart
      if (bitcoinHistoryResponse.data?.history) {
        const historyData = bitcoinHistoryResponse.data.history
          .slice(0, 24) // Last 24 hours
          .reverse()
          .map((item: any, index: number) => ({
            name: `${index}h`,
            price: parseFloat(item.price),
            timestamp: item.timestamp
          }))
        setBitcoinHistory(historyData)
      }
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => loadData(true), 30000)
    
    return () => clearInterval(interval)
  }, [loadData])

  const handleRefresh = () => {
    loadData(true)
  }

  // Prepare chart data
  const lineChartData = bitcoinHistory

  const barChartData = coins.slice(0, 8).map(coin => ({
    name: coin.symbol,
    change: parseFloat(coin.change)
  }))

  const donutChartData = coins.slice(0, 6).map(coin => ({
    name: coin.symbol,
    value: parseFloat(coin.marketCap) / 1e9 // Convert to billions for better visualization
  }))

  // Calculate metrics
  const activeCoins = coins.filter(coin => parseFloat(coin['24hVolume']) > 1000000).length
  const total24hVolume = globalStats?.total24hVolume ? parseFloat(globalStats.total24hVolume) : 0
  const avgChange = coins.length > 0 ? coins.reduce((sum, coin) => sum + parseFloat(coin.change), 0) / coins.length : 0
  const positiveCoins = coins.filter(coin => parseFloat(coin.change) > 0).length
  const bitcoinPrice = coins.find(coin => coin.symbol === 'BTC')?.price || '0'
  const bitcoinChange = coins.find(coin => coin.symbol === 'BTC')?.change || '0'
  const bitcoinPriceHistory = bitcoinHistory.map(item => item.price)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header onRefresh={handleRefresh} isRefreshing={refreshing} lastRefresh={lastRefresh} />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Lead Asset Performance"
              value={formatCurrency(bitcoinPrice)}
              change={formatPercentage(bitcoinChange)}
              changeType={parseFloat(bitcoinChange) > 0 ? 'positive' : 'negative'}
              icon={Activity}
              loading={loading}
              delay={0.1}
              description="Primary digital asset tracking for client portfolios"
              trend={bitcoinPriceHistory}
            />
            <MetricCard
              title="Market Activity Volume"
              value={formatCurrency(total24hVolume)}
              change={`${positiveCoins}/${coins.length} positive`}
              changeType="positive"
              icon={BarChart3}
              loading={loading}
              delay={0.15}
              description="Total trading volume across all tracked assets"
            />
            <MetricCard
              title="Active Investment Opportunities"
              value={activeCoins.toLocaleString()}
              change={`${globalStats?.totalCoins?.toLocaleString() || '0'} total`}
              changeType="positive"
              icon={Users}
              loading={loading}
              delay={0.2}
              description="High-volume assets suitable for client campaigns"
            />
            <MetricCard
              title="Portfolio Health Score"
              value={`${((positiveCoins / coins.length) * 100).toFixed(1)}%`}
              change={formatPercentage(avgChange)}
              changeType={avgChange > 0 ? 'positive' : 'negative'}
              icon={TrendingUp}
              loading={loading}
              delay={0.25}
              description="Overall market sentiment and performance indicator"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CryptoLineChart
              data={lineChartData}
              title="Client Portfolio Performance Tracker"
              loading={loading}
            />
            <CryptoDonutChart
              data={donutChartData}
              title="Client Investment Distribution"
              loading={loading}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <CryptoBarChart
              data={barChartData}
              title="Campaign ROI Performance Metrics"
              loading={loading}
            />
            <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur rounded-lg border-0 p-6">
              <h3 className="text-lg font-semibold mb-4">Agency Performance Dashboard</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Client Assets</span>
                  <span className="font-semibold">{formatCurrency(globalStats?.totalMarketCap || '0')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active Campaigns</span>
                  <span className="font-semibold">{globalStats?.totalMarkets?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Partner Platforms</span>
                  <span className="font-semibold">{globalStats?.totalExchanges?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average ROI</span>
                  <span className={`font-semibold ${avgChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(avgChange)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="grid grid-cols-1 gap-6">
            <DataTable data={coins} loading={loading} />
          </div>
        </motion.div>
      </main>
    </div>
  )
}
