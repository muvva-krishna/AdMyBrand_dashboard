"use client"

import { useEffect, useState } from "react"
import { RefreshCw, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { motion } from "framer-motion"

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastRefresh: Date; // ✅ Add this line
}

export function Header({ onRefresh, isRefreshing }: HeaderProps) {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const formatLastRefresh = () => {
    if (!lastUpdated) return 'Never';
    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
    return lastUpdated.toLocaleTimeString();
  };

  const handleRefresh = () => {
    const now = new Date();
    setLastUpdated(now);
    setSecondsAgo(0);
    onRefresh();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (lastUpdated) {
        const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
        setSecondsAgo(diff);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  useEffect(() => {
    // On mount, assume initial auto-refresh
    const initialDate = new Date();
    setLastUpdated(initialDate);
    setSecondsAgo(0);
  }, []);

  const isCooldown = secondsAgo < 60;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ADmyBRAND Insights
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-Powered Analytics Dashboard
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last updated: {formatLastRefresh()}</span>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing || isCooldown}
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isCooldown ? `Refresh in ${60 - secondsAgo}s` : "Refresh Data"}
            </Button>
            <ThemeToggle />
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
