import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { AnalysisCanvas } from '@/components/Dashboard/AnalysisCanvas';
import { ChatBot } from '@/components/Dashboard/ChatBot';

const MOCK_NEWS = [
  {
    id: 1,
    category: 'Market Analysis',
    headline: 'Tech Stocks Rally on AI Optimism',
    snippet: 'Major technology companies surge as artificial intelligence investments show promising returns...',
    fullText: 'Major technology companies surge as artificial intelligence investments show promising returns. NVIDIA leads the charge with a 3.2% gain, followed by Microsoft and Google. Analysts predict continued growth in the AI sector as companies increase their infrastructure spending. The semiconductor industry is particularly benefiting from this trend, with chip manufacturers seeing increased demand for AI-specific processors.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    category: 'Earnings',
    headline: 'Q4 Earnings Season Kicks Off Strong',
    snippet: 'Early earnings reports exceed expectations across multiple sectors, setting positive tone...',
    fullText: 'Early earnings reports exceed expectations across multiple sectors, setting positive tone for the quarter. Financial institutions report robust lending activity and improved credit quality. Consumer discretionary companies show resilience despite economic headwinds. Energy sector continues to benefit from stable oil prices and increased production efficiency.',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=225&fit=crop',
    timestamp: '4 hours ago'
  },
  {
    id: 3,
    category: 'Federal Reserve',
    headline: 'Fed Signals Cautious Approach to Rate Cuts',
    snippet: 'Central bank maintains data-dependent stance on monetary policy adjustments...',
    fullText: 'Central bank maintains data-dependent stance on monetary policy adjustments. Recent inflation data shows mixed signals, with core PCE remaining elevated while headline numbers moderate. Employment markets continue to show strength, supporting the Fed\'s measured approach. Market participants are adjusting expectations for the timing and magnitude of potential rate cuts.',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop',
    timestamp: '6 hours ago'
  },
  {
    id: 4,
    category: 'Commodities',
    headline: 'Gold Reaches New Highs Amid Uncertainty',
    snippet: 'Precious metals surge as investors seek safe-haven assets during volatile period...',
    fullText: 'Precious metals surge as investors seek safe-haven assets during volatile period. Gold prices break through key resistance levels, reaching new 52-week highs. Silver and platinum also show strong performance. Geopolitical tensions and currency fluctuations continue to drive demand for precious metals as portfolio hedges.',
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=225&fit=crop',
    timestamp: '8 hours ago'
  },
  {
    id: 5,
    category: 'Crypto',
    headline: 'Bitcoin Consolidates Above Key Support',
    snippet: 'Cryptocurrency markets show stability as institutional adoption continues to grow...',
    fullText: 'Cryptocurrency markets show stability as institutional adoption continues to grow. Bitcoin maintains support above $42,000 while Ethereum shows strength in DeFi applications. Regulatory clarity in major markets is boosting investor confidence. Corporate treasury allocations to digital assets are becoming more common among Fortune 500 companies.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop',
    timestamp: '10 hours ago'
  },
  {
    id: 6,
    category: 'International',
    headline: 'European Markets Show Resilience',
    snippet: 'European indices outperform amid strong manufacturing data and energy stability...',
    fullText: 'European indices outperform amid strong manufacturing data and energy stability. German DAX leads gains as industrial production exceeds forecasts. French CAC 40 benefits from luxury goods sector strength. Energy costs stabilize as renewable capacity increases and supply chains normalize.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    timestamp: '12 hours ago'
  }
];

export default function TechnicalAnalysis() {
  const navigate = useNavigate();
  const [expandedNews, setExpandedNews] = useState<number | null>(null);

  const toggleNewsExpansion = (id: number) => {
    setExpandedNews(expandedNews === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar + Main Layout */}
      <div className="grid grid-cols-12">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-2 border-r border-white/10 p-4 md:min-h-screen">
          <div className="text-white/80 text-sm font-semibold mb-3">Navigation</div>
          <nav className="space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-left px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              Dashboard
            </button>
            <div className="w-full px-3 py-2 rounded-md bg-white/10 text-white font-semibold">
              Technical Analysis
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 border-b border-white/10"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-white">Technical Analysis</h1>
            </div>
          </motion.div>

          {/* Canvas + Chat Panel */}
          <div className="p-6 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-6"
            >
              {/* Centered Canvas */}
              <Card className="xl:col-span-8 bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
                <CardContent className="p-6">
                  <div className="h-[65vh]">
                    <AnalysisCanvas />
                  </div>
                </CardContent>
              </Card>

              {/* AI Chat Panel */}
              <Card className="xl:col-span-4 bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
                <CardContent className="p-0">
                  <div className="h-[65vh]">
                    <ChatBot />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Market News & Analysis Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-white">Market News & Analysis</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_NEWS.map((news) => (
                  <motion.div
                    key={news.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden">
                      <div className="relative">
                        <AspectRatio ratio={16 / 9}>
                          <img
                            src={news.image}
                            alt={news.headline}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <Badge
                            className="absolute top-3 left-3 bg-emerald-500/90 text-white border-0"
                          >
                            {news.category}
                          </Badge>
                        </AspectRatio>
                      </div>

                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-semibold text-white text-sm leading-tight">
                          {news.headline}
                        </h3>

                        <motion.div
                          initial={false}
                          animate={{ height: expandedNews === news.id ? 'auto' : 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-white/70 text-xs leading-relaxed">
                            {expandedNews === news.id ? news.fullText : news.snippet}
                          </p>
                        </motion.div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-white/50 text-xs">{news.timestamp}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleNewsExpansion(news.id)}
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-xs h-7 px-2"
                          >
                            {expandedNews === news.id ? 'Show Less' : 'Read More'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}