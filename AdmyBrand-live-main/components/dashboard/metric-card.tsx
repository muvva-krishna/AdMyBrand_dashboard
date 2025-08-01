"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { DivideIcon as LucideIcon } from "lucide-react"
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
  const [isHovered, setIsHovered] = useState(false);

  if (loading) {
    return (
      <Card className="transition-all duration-200 hover:shadow-lg">
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
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur cursor-pointer">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <motion.div 
            className="p-2 bg-primary/10 rounded-full"
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0 
            }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-4 w-4 text-primary" />
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="text-2xl font-bold"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {value}
          </motion.div>
          {change && (
            <motion.p 
              className={`text-xs mt-1 flex items-center ${
                changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
            >
              {change}
            </motion.p>
          )}
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
          {trend.length > 0 && isHovered && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              className="mt-2 h-8 flex items-end space-x-1"
            >
              {trend.slice(-8).map((value, index) => (
                <div
                  key={index}
                  className="bg-primary/20 rounded-sm flex-1"
                  style={{ height: `${Math.max(10, (value / Math.max(...trend)) * 100)}%` }}
                />
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}