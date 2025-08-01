"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: LucideIcon;
  loading?: boolean;
  delay?: number;
  description?: string;
  trend?: number[];
}

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  loading = false,
  delay = 0,
  description,
  trend = []
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (loading) {
    return (
      <Card className="h-[220px] transition-all duration-200 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-16" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="relative h-[220px] overflow-hidden transition-all duration-300 hover:shadow-2xl border border-border/30 rounded-2xl bg-white/5 backdrop-blur-md dark:bg-black/10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-10 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <motion.div
            className="p-2 rounded-full bg-primary/20 backdrop-blur-sm"
            animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 6 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-4 w-4 text-primary" />
          </motion.div>
        </CardHeader>
        <CardContent className="relative z-10 flex flex-col justify-between h-full pt-1 pb-2">
          <div>
            <motion.div
              className="text-3xl font-semibold tracking-tight"
              animate={{ scale: isHovered ? 1.03 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {value}
            </motion.div>

            {change && (
              <motion.p
                className={`text-xs mt-1 font-medium flex items-center gap-1 ${
                  changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.2 }}
              >
                {changeType === 'positive' ? '▲' : '▼'} {change}
              </motion.p>
            )}
          </div>

          <div>
            <AnimatePresence>
              {isHovered && description && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-muted-foreground mt-2"
                >
                  {description}
                </motion.p>
              )}
            </AnimatePresence>

            {trend.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0.4 }}
                exit={{ opacity: 0 }}
                className="mt-2 h-10 flex items-end gap-1"
              >
                {trend.slice(-8).map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-primary/30 rounded-md transition-all duration-200"
                    style={{
                      height: `${Math.max(10, (val / Math.max(...trend)) * 100)}%`,
                      minHeight: '4px',
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
