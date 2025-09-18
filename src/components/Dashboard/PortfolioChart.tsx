import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useState } from "react";
import type { ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PortfolioChartProps {
  data: Array<{
    timestamp: number;
    totalValue: number;
    dayChange: number;
    dayChangePercent: number;
  }>;
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  const [timeRange, setTimeRange] = useState("1M");

  const timeRanges = [
    { label: "1D", value: "1D" },
    { label: "5D", value: "5D" },
    { label: "1M", value: "1M" },
    { label: "3M", value: "3M" },
    { label: "YTD", value: "YTD" },
  ];

  // Derive subset per time range for real interactivity
  const derivedData = (() => {
    if (!data || data.length === 0) return [];
    const byRangeCount: Record<string, number> = {
      "1D": 24,
      "5D": 5,
      "1M": 22,
      "3M": 66,
      "YTD": Math.min(data.length, 180),
    };
    const count = byRangeCount[timeRange] ?? data.length;
    return data.slice(-count);
  })();

  const chartData = {
    labels: derivedData.map(item => {
      const date = new Date(item.timestamp);
      return timeRange === "1D" 
        ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: "Portfolio Value",
        data: derivedData.map(item => item.totalValue),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "rgb(16, 185, 129)",
        pointHoverBorderColor: "white",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400, easing: "easeInOutQuad" },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            const date = new Date(derivedData[context[0].dataIndex].timestamp);
            return date.toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
          },
          label: (context: any) => {
            const value = context.parsed.y;
            const change = derivedData[context.dataIndex].dayChange;
            const changePercent = derivedData[context.dataIndex].dayChangePercent;
            return [
              `Portfolio Value: $${value.toLocaleString()}`,
              `Day Change: ${change >= 0 ? '+' : ''}$${change.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`
            ];
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        border: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
          maxTicksLimit: 6,
        },
      },
      y: {
        display: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        border: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
          callback: (value: any) => `$${(value / 1000).toFixed(0)}k`,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const currentValue = derivedData[derivedData.length - 1]?.totalValue || 0;
  const previousValue = derivedData[derivedData.length - 2]?.totalValue || currentValue;
  const change = currentValue - previousValue;
  const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="h-full bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-white">Portfolio Performance</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-white">
                  ${currentValue.toLocaleString()}
                </span>
                <span className={`text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {change >= 0 ? '+' : ''}${change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  size="sm"
                  variant={timeRange === range.value ? "default" : "ghost"}
                  className={`h-8 px-3 text-xs ${
                    timeRange === range.value
                      ? "bg-gradient-to-r from-emerald-500 to-purple-600 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setTimeRange(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-64">
            <Line key={timeRange} data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}