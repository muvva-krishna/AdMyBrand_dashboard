'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Overview } from '@/components/overview';
import { RecentSales } from '@/components/recent-sales';
import { columns } from '@/app/columns';
import { DataTable } from '@/components/data-table';
import { getData } from '@/lib/api';
import { ChannelData, MetricsData } from '@/lib/types';

export default function DashboardPage() {
  const [channelData, setChannelData] = useState<ChannelData[]>([]);
  const [metricsData, setMetricsData] = useState<MetricsData[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [secondsSinceRefresh, setSecondsSinceRefresh] = useState(0);

  const fetchData = async () => {
    setRefreshing(true);
    const { channels, metrics, table } = await getData();
    setChannelData(channels);
    setMetricsData(metrics);
    setTableData(table);
    setLastRefresh(new Date());
    setSecondsSinceRefresh(0); // Reset seconds after refresh
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // auto-refresh every 60s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsSinceRefresh((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    await fetchData();
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Header
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
        lastRefresh={lastRefresh}
        secondsSinceRefresh={secondsSinceRefresh}
      />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          {metricsData.map((metric, index) => (
            <Card key={index} className="bg-[#1a1a1a] text-white">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid gap-4 grid-cols-1 lg:grid-cols-2"
        >
          <Card className="bg-[#1a1a1a] text-white">
            <CardContent className="p-4">
              <Overview data={channelData} />
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] text-white">
            <CardContent className="p-4">
              <RecentSales data={channelData} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-[#1a1a1a] text-white">
            <CardContent className="p-4">
              <DataTable columns={columns} data={tableData} />
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
