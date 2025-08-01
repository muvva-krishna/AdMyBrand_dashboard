"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface LineChartProps {
  data: any[];
  title: string;
  loading?: boolean;
}

export function CryptoLineChart({ data, title, loading = false }: LineChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }}
    >
      <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Client Portfolio Performance Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
  stroke="hsl(var(--muted-foreground))"
  fontSize={12}
  tickFormatter={(value) => `$${value.toFixed(0)}`}
  domain={[
    (dataMin: number) => dataMin * 0.99, // 2% below min
    (dataMax: number) => dataMax * 1.01, // 2% above max
  ]}
/>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => [`$${parseFloat(value).toLocaleString()}`, 'Price']}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#F7931A"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: '#F7931A', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}