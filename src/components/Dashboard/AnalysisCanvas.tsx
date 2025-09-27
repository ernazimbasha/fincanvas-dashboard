import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  MousePointer, 
  Pencil, 
  Minus, 
  Square, 
  Highlighter, 
  Trash2, 
  Grid3X3, 
  RotateCcw,
  Search,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';

interface TickerNode {
  id: string;
  symbol: string;
  x: number;
  y: number;
  price: number;
  change: number;
}

interface Annotation {
  id: string;
  type: 'line' | 'trendline' | 'rectangle' | 'zone' | 'freehand';
  points: { x: number; y: number }[];
  color: string;
  selected?: boolean;
}

interface AIOverlay {
  id: string;
  type: 'highlight' | 'ma' | 'rsi';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
}

interface AnalysisCanvasProps {
  selectedSymbol?: string;
}

const MOCK_SYMBOLS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 171.62, change: -0.55 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 417.30, change: 0.30 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 901.12, change: 1.15 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -0.12 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.52, change: 1.19 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 139.17, change: -0.80 },
  { symbol: 'META', name: 'Meta Platforms', price: 484.20, change: 2.15 },
  { symbol: 'SPY', name: 'SPDR S&P 500', price: 485.30, change: 0.45 },
  { symbol: 'QQQ', name: 'Invesco QQQ', price: 421.80, change: 0.85 }
];

type Tool = 'select' | 'pencil' | 'line' | 'trendline' | 'rectangle' | 'zone' | 'eraser';

export function AnalysisCanvas({ selectedSymbol }: AnalysisCanvasProps) {
  const canvasRef = useRef<SVGSVGElement>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [tickerNodes, setTickerNodes] = useState<TickerNode[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [aiOverlays, setAiOverlays] = useState<AIOverlay[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [showGrid, setShowGrid] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [draggedTicker, setDraggedTicker] = useState<string | null>(null);

  // Add state for moving annotations
  const [draggingAnnotationId, setDraggingAnnotationId] = useState<string | null>(null);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number } | null>(null);

  // Filter symbols based on search
  const filteredSymbols = MOCK_SYMBOLS.filter(s => 
    s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add selected symbol as initial ticker if provided
  useEffect(() => {
    if (selectedSymbol && !tickerNodes.find(n => n.symbol === selectedSymbol)) {
      const symbolData = MOCK_SYMBOLS.find(s => s.symbol === selectedSymbol);
      if (symbolData) {
        const newNode: TickerNode = {
          id: `ticker-${Date.now()}`,
          symbol: selectedSymbol,
          x: 200,
          y: 150,
          price: symbolData.price,
          change: symbolData.change
        };
        setTickerNodes([newNode]);
      }
    }
  }, [selectedSymbol]);

  // Handle drag start for tickers
  const handleDragStart = (symbol: string) => {
    setDraggedTicker(symbol);
  };

  // Add: direct add ticker by click from suggestions
  const handleAddTicker = (symbol: string) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    // Drop near center for click-add
    const x = rect.width / 2 - 60;
    const y = rect.height / 2 - 30;
    const symbolData = MOCK_SYMBOLS.find(s => s.symbol === symbol);
    if (!symbolData) return;
    const newNode: TickerNode = {
      id: `ticker-${Date.now()}`,
      symbol,
      x,
      y,
      price: symbolData.price,
      change: symbolData.change,
    };
    setTickerNodes(prev => [...prev, newNode]);
    toast.success(`Added ${symbol} to canvas`);
  };

  // Handle drop on canvas
  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTicker || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const symbolData = MOCK_SYMBOLS.find(s => s.symbol === draggedTicker);
    if (symbolData) {
      const newNode: TickerNode = {
        id: `ticker-${Date.now()}`,
        symbol: draggedTicker,
        x,
        y,
        price: symbolData.price,
        change: symbolData.change
      };
      setTickerNodes(prev => [...prev, newNode]);
      toast.success(`Added ${draggedTicker} to canvas`);
    }
    setDraggedTicker(null);
  }, [draggedTicker]);

  // Update: handleMouseDown to support selecting/moving annotations
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'select') {
      // Simple hit-test: check if click is near any annotation's bounding region
      const hitId = annotations
        .slice()
        .reverse()
        .find((ann) => {
          if (ann.points.length < 1) return false;
          const xs = ann.points.map(p => p.x);
          const ys = ann.points.map(p => p.y);
          const minX = Math.min(...xs) - 6;
          const maxX = Math.max(...xs) + 6;
          const minY = Math.min(...ys) - 6;
          const maxY = Math.max(...ys) + 6;
          return x >= minX && x <= maxX && y >= minY && y <= maxY;
        })?.id || null;

      if (hitId) {
        setSelectedAnnotation(hitId);
        setDraggingAnnotationId(hitId);
        setLastMousePos({ x, y });
      } else {
        setSelectedAnnotation(null);
      }
      return;
    }
    
    if (activeTool === 'pencil') {
      setIsDrawing(true);
      setCurrentPath([{ x, y }]);
    } else if (activeTool === 'line' || activeTool === 'trendline') {
      setCurrentPath([{ x, y }]);
      setIsDrawing(true);
    } else if (activeTool === 'rectangle' || activeTool === 'zone') {
      setCurrentPath([{ x, y }]);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Move annotation if dragging
    if (draggingAnnotationId && lastMousePos) {
      const dx = x - lastMousePos.x;
      const dy = y - lastMousePos.y;
      setAnnotations(prev =>
        prev.map(a =>
          a.id === draggingAnnotationId
            ? { ...a, points: a.points.map(p => ({ x: p.x + dx, y: p.y + dy })) }
            : a
        )
      );
      setLastMousePos({ x, y });
      return;
    }

    if (!isDrawing) return;

    if (activeTool === 'pencil') {
      setCurrentPath(prev => [...prev, { x, y }]);
    } else if (activeTool === 'line' || activeTool === 'trendline' || activeTool === 'rectangle' || activeTool === 'zone') {
      setCurrentPath(prev => [prev[0], { x, y }]);
    }
  };

  const handleMouseUp = () => {
    // Stop moving annotation
    if (draggingAnnotationId) {
      setDraggingAnnotationId(null);
      setLastMousePos(null);
      return;
    }

    if (!isDrawing || currentPath.length === 0) return;

    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}`,
      type: activeTool === 'line' ? 'line' : activeTool === 'trendline' ? 'trendline' : activeTool === 'rectangle' ? 'rectangle' : activeTool === 'zone' ? 'zone' : 'freehand',
      points: [...currentPath],
      color: activeTool === 'zone' ? '#10b98150' : '#10b981'
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    setCurrentPath([]);
    setIsDrawing(false);
    toast.success('Annotation added');
  };

  // Handle AI question
  const handleAIQuestion = () => {
    if (!aiQuestion.trim()) return;

    // Simulate AI response with overlays
    const responses = [
      "This trendline shows strong support at current levels. Volume confirmation needed.",
      "RSI indicates oversold conditions. Consider entry points near support.",
      "Moving average convergence suggests bullish momentum building.",
      "Price action near resistance. Watch for breakout with volume."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add AI overlays
    const newOverlays: AIOverlay[] = [];
    
    // Add highlight zones near annotations
    annotations.forEach(ann => {
      if (ann.type === 'trendline' || ann.type === 'line') {
        newOverlays.push({
          id: `ai-highlight-${Date.now()}`,
          type: 'highlight',
          x: Math.min(...ann.points.map(p => p.x)) - 20,
          y: Math.min(...ann.points.map(p => p.y)) - 10,
          width: Math.abs(Math.max(...ann.points.map(p => p.x)) - Math.min(...ann.points.map(p => p.x))) + 40,
          height: 20,
          text: 'AI: Support Level'
        });
      }
    });

    // Add MA and RSI for ticker nodes
    tickerNodes.forEach(node => {
      newOverlays.push({
        id: `ai-ma-${node.id}`,
        type: 'ma',
        x: node.x + 80,
        y: node.y - 10,
        text: '20MA'
      });
      newOverlays.push({
        id: `ai-rsi-${node.id}`,
        type: 'rsi',
        x: node.x + 80,
        y: node.y + 20,
        text: 'RSI: 45'
      });
    });

    setAiOverlays(prev => [...prev, ...newOverlays]);
    toast.success(randomResponse);
    setAiQuestion('');
  };

  // Clear canvas
  const clearCanvas = () => {
    setTickerNodes([]);
    setAnnotations([]);
    setAiOverlays([]);
    setSelectedAnnotation(null);
    toast.success('Canvas cleared');
  };

  // Delete selected annotation
  const deleteSelected = () => {
    if (selectedAnnotation) {
      setAnnotations(prev => prev.filter(a => a.id !== selectedAnnotation));
      setSelectedAnnotation(null);
      toast.success('Annotation deleted');
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAnnotation]);

  // Generate sparkline path
  const generateSparkline = (symbol: string) => {
    const points = Array.from({ length: 20 }, (_, i) => {
      const x = i * 3;
      const y = 15 + Math.sin(i * 0.5) * 5 + (Math.random() - 0.5) * 3;
      return `${x},${y}`;
    }).join(' ');
    return `M ${points}`;
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 shadow-lg">
      {/* Header with toolbar + AI */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Analysis Canvas</h3>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={showGrid ? "default" : "outline"}
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Clear Canvas</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to clear all annotations and tickers?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => {}}>Cancel</Button>
                  <Button variant="destructive" onClick={clearCanvas}>Clear</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 mb-4">
          <TooltipProvider>
            {[
              { tool: 'select' as Tool, icon: MousePointer, label: 'Select/Move' },
              { tool: 'pencil' as Tool, icon: Pencil, label: 'Pencil' },
              { tool: 'line' as Tool, icon: Minus, label: 'Line' },
              { tool: 'trendline' as Tool, icon: Minus, label: 'Trendline' },
              { tool: 'rectangle' as Tool, icon: Square, label: 'Rectangle' },
              { tool: 'zone' as Tool, icon: Highlighter, label: 'Zone' },
              { tool: 'eraser' as Tool, icon: Trash2, label: 'Eraser' },
            ].map(({ tool, icon: Icon, label }) => (
              <Tooltip key={tool}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant={activeTool === tool ? "default" : "outline"}
                    onClick={() => setActiveTool(tool)}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        {/* AI Question Input */}
        <div className="flex gap-2 mb-4">
          <input
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="Ask AI about your analysis..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleAIQuestion()}
          />
          <Button size="sm" onClick={handleAIQuestion}>
            <Bot className="h-4 w-4" />
          </Button>
        </div>

        {/* Stock Search Bar with autocomplete suggestions (above canvas) */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search symbols (AAPL, TSLA) or company names..."
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          {searchTerm.trim().length > 0 && filteredSymbols.length > 0 && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-56 overflow-auto">
              {filteredSymbols.map((symbol) => (
                <motion.div
                  key={symbol.symbol}
                  draggable
                  onDragStart={() => handleDragStart(symbol.symbol)}
                  onClick={() => handleAddTicker(symbol.symbol)}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div>
                    <div className="font-medium text-sm text-gray-900">{symbol.symbol}</div>
                    <div className="text-xs text-gray-500">{symbol.name}</div>
                  </div>
                  <Badge variant={symbol.change >= 0 ? "default" : "destructive"} className="text-xs">
                    {symbol.change >= 0 ? '+' : ''}{symbol.change.toFixed(2)}%
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Centered Canvas */}
      <div className="flex-1 flex items-center justify-center p-3">
        <div className="w-full h-full">
          <svg
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onDrop={handleCanvasDrop}
            onDragOver={(e) => e.preventDefault()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* Grid */}
            {showGrid && (
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                </pattern>
              </defs>
            )}
            {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

            {/* Annotations */}
            {annotations.map((annotation) => (
              <g key={annotation.id}>
                {annotation.type === 'freehand' && (
                  <motion.path
                    d={`M ${annotation.points.map(p => `${p.x},${p.y}`).join(' L ')}`}
                    fill="none"
                    stroke={annotation.color}
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => setSelectedAnnotation(annotation.id)}
                    className="cursor-pointer"
                  />
                )}
                {(annotation.type === 'line' || annotation.type === 'trendline') && annotation.points.length >= 2 && (
                  <motion.line
                    x1={annotation.points[0].x}
                    y1={annotation.points[0].y}
                    x2={annotation.points[1].x}
                    y2={annotation.points[1].y}
                    stroke={annotation.color}
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedAnnotation(annotation.id)}
                    className="cursor-pointer"
                  />
                )}
                {(annotation.type === 'rectangle' || annotation.type === 'zone') && annotation.points.length >= 2 && (
                  <motion.rect
                    x={Math.min(annotation.points[0].x, annotation.points[1].x)}
                    y={Math.min(annotation.points[0].y, annotation.points[1].y)}
                    width={Math.abs(annotation.points[1].x - annotation.points[0].x)}
                    height={Math.abs(annotation.points[1].y - annotation.points[0].y)}
                    fill={annotation.type === 'zone' ? annotation.color : 'none'}
                    stroke={annotation.color}
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedAnnotation(annotation.id)}
                    className="cursor-pointer"
                  />
                )}
                {selectedAnnotation === annotation.id && (
                  <circle
                    cx={annotation.points[0]?.x}
                    cy={annotation.points[0]?.y}
                    r="4"
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth="2"
                  />
                )}
              </g>
            ))}

            {/* Current drawing path */}
            {isDrawing && currentPath.length > 0 && (
              <g>
                {activeTool === 'pencil' && (
                  <path
                    d={`M ${currentPath.map(p => `${p.x},${p.y}`).join(' L ')}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                )}
                {(activeTool === 'line' || activeTool === 'trendline') && currentPath.length >= 2 && (
                  <line
                    x1={currentPath[0].x}
                    y1={currentPath[0].y}
                    x2={currentPath[1].x}
                    y2={currentPath[1].y}
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                )}
                {(activeTool === 'rectangle' || activeTool === 'zone') && currentPath.length >= 2 && (
                  <rect
                    x={Math.min(currentPath[0].x, currentPath[1].x)}
                    y={Math.min(currentPath[0].y, currentPath[1].y)}
                    width={Math.abs(currentPath[1].x - currentPath[0].x)}
                    height={Math.abs(currentPath[1].y - currentPath[0].y)}
                    fill={activeTool === 'zone' ? '#10b98150' : 'none'}
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                )}
              </g>
            )}

            {/* AI Overlays */}
            <AnimatePresence>
              {aiOverlays.map((overlay) => (
                <motion.g
                  key={overlay.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  {overlay.type === 'highlight' && (
                    <rect
                      x={overlay.x}
                      y={overlay.y}
                      width={overlay.width}
                      height={overlay.height}
                      fill="#fbbf2450"
                      stroke="#fbbf24"
                      strokeWidth="1"
                      rx="4"
                    />
                  )}
                  {(overlay.type === 'ma' || overlay.type === 'rsi') && (
                    <g>
                      <rect
                        x={overlay.x - 5}
                        y={overlay.y - 8}
                        width="50"
                        height="16"
                        fill="#3b82f6"
                        rx="8"
                      />
                      <text
                        x={overlay.x + 20}
                        y={overlay.y + 2}
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {overlay.text}
                      </text>
                    </g>
                  )}
                  {overlay.text && overlay.type === 'highlight' && (
                    <text
                      x={overlay.x + (overlay.width || 0) / 2}
                      y={overlay.y + (overlay.height || 0) / 2 + 4}
                      textAnchor="middle"
                      fill="#92400e"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {overlay.text}
                    </text>
                  )}
                </motion.g>
              ))}
            </AnimatePresence>

            {/* Ticker Nodes */}
            <AnimatePresence>
              {tickerNodes.map((node) => (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <foreignObject x={node.x} y={node.y} width="120" height="60">
                    <Card className="w-full h-full shadow-lg border-2 border-blue-200 hover:border-blue-300 transition-colors">
                      <CardContent className="p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-gray-900">{node.symbol}</span>
                          <Badge variant={node.change >= 0 ? "default" : "destructive"} className="text-xs">
                            {node.change >= 0 ? '+' : ''}{node.change.toFixed(2)}%
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">${node.price.toFixed(2)}</div>
                        <svg width="80" height="20" className="opacity-70">
                          <path
                            d={generateSparkline(node.symbol)}
                            fill="none"
                            stroke={node.change >= 0 ? "#10b981" : "#ef4444"}
                            strokeWidth="1.5"
                          />
                        </svg>
                      </CardContent>
                    </Card>
                  </foreignObject>
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>
        </div>
      </div>
    </div>
  );
}