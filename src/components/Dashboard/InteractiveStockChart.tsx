import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React, { useMemo, useRef, useState } from "react";

type Timeframe = "D" | "W" | "M";

type Candle = {
  t: number; // timestamp
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

interface InteractiveStockChartProps {
  symbol: string;
  timeframe: Timeframe;
  onTimeframeChange?: (t: Timeframe) => void;
}

function computeSMA(data: Candle[], period: number): Array<{ t: number; v: number }> {
  const out: Array<{ t: number; v: number }> = [];
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].c;
    if (i >= period) sum -= data[i - period].c;
    if (i >= period - 1) out.push({ t: data[i].t, v: sum / period });
  }
  return out;
}

function computeRSI(data: Candle[], period = 14): Array<{ t: number; v: number }> {
  const out: Array<{ t: number; v: number }> = [];
  if (data.length < period + 1) return out;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const change = data[i].c - data[i - 1].c;
    if (change >= 0) gains += change; else losses -= change;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].c - data[i - 1].c;
    const gain = Math.max(0, change);
    const loss = Math.max(0, -change);
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / (avgLoss || 1e-9);
    const rsi = 100 - 100 / (1 + rs);
    out.push({ t: data[i].t, v: Math.max(0, Math.min(100, rsi)) });
  }
  return out;
}

function computeDailyReturns(data: Candle[]): Array<{ t: number; v: number }> {
  const out: Array<{ t: number; v: number }> = [];
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1].c;
    const ret = prev ? ((data[i].c - prev) / prev) * 100 : 0;
    out.push({ t: data[i].t, v: ret });
  }
  return out;
}

function computeVolatilityStdDev(data: Candle[], window = 20): number {
  if (data.length < window + 1) return 0;
  const rets = [];
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1].c;
    const r = prev ? (data[i].c - prev) / prev : 0;
    rets.push(r);
  }
  const tail = rets.slice(-window);
  const mean = tail.reduce((a, b) => a + b, 0) / tail.length;
  const variance = tail.reduce((a, b) => a + (b - mean) * (b - mean), 0) / tail.length;
  return Math.sqrt(variance) * Math.sqrt(252); // annualized approx
}

function computeSharpeRatio(data: Candle[], rf = 0): number {
  // simple demo: mean(returns)/std(returns), using last 60
  if (data.length < 61) return 0;
  const rets: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1].c;
    rets.push(prev ? (data[i].c - prev) / prev : 0);
  }
  const tail = rets.slice(-60);
  const mean = tail.reduce((a, b) => a + b, 0) / tail.length;
  const variance = tail.reduce((a, b) => a + (b - mean) ** 2, 0) / tail.length;
  const std = Math.sqrt(variance);
  const sharpe = std ? (mean - rf / 252) / std : 0;
  return sharpe * Math.sqrt(252);
}

function generateSeries(timeframe: Timeframe, n: number, startPrice = 170): Candle[] {
  const out: Candle[] = [];
  const now = Date.now();
  const step =
    timeframe === "D" ? 24 * 60 * 60 * 1000 :
    timeframe === "W" ? 7 * 24 * 60 * 60 * 1000 :
    30 * 24 * 60 * 60 * 1000; // month approx

  let price = startPrice;
  for (let i = n - 1; i >= 0; i--) {
    const t = now - i * step;
    const vol = timeframe === "D" ? 2.5 : timeframe === "W" ? 4 : 6;
    const o = price + (Math.random() - 0.5) * vol;
    const c = o + (Math.random() - 0.5) * (vol + 0.8);
    const h = Math.max(o, c) + Math.random() * (vol / 2 + 0.8);
    const l = Math.min(o, c) - Math.random() * (vol / 2 + 0.8);
    const v = Math.floor(Math.random() * 1_200_000) + 400_000;
    out.push({ t, o, h, l, c, v });
    price = c;
  }
  return out;
}

// Add helper to set drag data in multiple formats
const setDragData = (e: React.DragEvent, sym: string) => {
  try {
    e.dataTransfer.setData("text/symbol", sym);
    e.dataTransfer.setData("text/plain", sym); // fallback for broader browser support
    const dragEl = document.createElement("div");
    dragEl.style.width = "100px";
    dragEl.style.height = "24px";
    dragEl.style.background = "rgba(99,102,241,0.9)";
    dragEl.style.color = "white";
    dragEl.style.display = "flex";
    dragEl.style.alignItems = "center";
    dragEl.style.justifyContent = "center";
    dragEl.style.borderRadius = "6px";
    dragEl.style.fontSize = "12px";
    dragEl.style.fontWeight = "600";
    dragEl.textContent = `Chart: ${sym}`;
    document.body.appendChild(dragEl);
    e.dataTransfer.setDragImage(dragEl, 50, 12);
    setTimeout(() => document.body.removeChild(dragEl), 0);
  } catch {}
};

export function InteractiveStockChart({
  symbol,
  timeframe,
  onTimeframeChange,
}: InteractiveStockChartProps) {
  const [zoom, setZoom] = useState(1);      // 1 = full width
  const [pan, setPan] = useState(0);        // 0 = centered, -1 left, +1 right
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const dragRef = useRef<{ x: number } | null>(null);

  const data = useMemo(() => {
    const points = timeframe === "D" ? 120 : timeframe === "W" ? 156 : 120; // ~6m/3y/10y-like feel
    return generateSeries(timeframe, points, 160 + Math.random() * 20);
  }, [timeframe, symbol]);

  const sma20 = useMemo(() => computeSMA(data, 20), [data]);
  const sma50 = useMemo(() => computeSMA(data, 50), [data]);
  const rsi = useMemo(() => computeRSI(data, 14), [data]);
  const dailyReturns = useMemo(() => computeDailyReturns(data), [data]);
  const volStd = useMemo(() => computeVolatilityStdDev(data, 20), [data]);
  const sharpe = useMemo(() => computeSharpeRatio(data), [data]);

  const width = 680;
  const height = 320;
  const padding = { left: 48, right: 24, top: 16, bottom: 60 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  // Determine view window based on zoom and pan
  const total = data.length;
  const viewCount = Math.max(20, Math.floor(total / zoom));
  const center = Math.floor(total / 2) + Math.floor((total / 2) * pan * 0.8);
  const start = Math.max(0, Math.min(total - viewCount, center - Math.floor(viewCount / 2)));
  const end = start + viewCount;
  const view = data.slice(start, end);

  const prices = view.flatMap(d => [d.h, d.l]);
  const maxP = Math.max(...prices);
  const minP = Math.min(...prices);
  const rangeP = maxP - minP || 1;

  // Add price change over the current view window
  const firstClose = view[0]?.c ?? 0;
  const lastClose = view[view.length - 1]?.c ?? 0;
  const priceChangeAbs = lastClose - firstClose;
  const priceChangePct = firstClose ? (priceChangeAbs / firstClose) * 100 : 0;

  const xScale = (i: number) => padding.left + (i * innerW) / Math.max(1, view.length - 1);
  const yScale = (p: number) => padding.top + (innerH - ((p - minP) / rangeP) * innerH);

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const next = Math.min(8, Math.max(1, zoom + (e.deltaY > 0 ? -0.2 : 0.2)));
      setZoom(+next.toFixed(2));
    } else {
      // horizontal pan
      const delta = e.deltaY > 0 ? 0.06 : -0.06;
      setPan((p) => Math.max(-0.98, Math.min(0.98, p + delta)));
    }
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    setIsPanning(true);
    dragRef.current = { x: e.clientX };
  };
  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isPanning || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    dragRef.current.x = e.clientX;
    const deltaPan = -(dx / width) * 1.6;
    setPan((p) => Math.max(-0.98, Math.min(0.98, p + deltaPan)));
  };
  const onMouseUp = () => {
    setIsPanning(false);
    dragRef.current = null;
  };

  // Hover detection
  const onSVGMouseMove: React.MouseEventHandler<SVGSVGElement> = (e) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const x = e.clientX - rect.left - padding.left;
    if (x < 0 || x > innerW) {
      setHoverIndex(null);
      return;
    }
    const idx = Math.round((x / innerW) * (view.length - 1));
    setHoverIndex(Math.max(0, Math.min(view.length - 1, idx)));
  };

  const current = hoverIndex != null ? view[hoverIndex] : view[view.length - 1];
  const currIdxInFull = current ? data.findIndex(d => d.t === current.t) : -1;

  const tfButtons: Array<{ label: string; value: Timeframe }> = [
    { label: "Daily", value: "D" },
    { label: "Weekly", value: "W" },
    { label: "Monthly", value: "M" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-base">Interactive Stock Chart</CardTitle>
              <div className="flex items-center gap-2 mt-1 text-white">
                <span className="text-xl font-bold">{symbol}</span>
                {current && (
                  <>
                    <span className="text-sm text-white/70">${current.c.toFixed(2)}</span>
                    {currIdxInFull > 0 && (
                      <span className={`text-sm ${current.c - data[currIdxInFull - 1].c >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {current.c - data[currIdxInFull - 1].c >= 0 ? "+" : ""}
                        {(current.c - data[currIdxInFull - 1].c).toFixed(2)} (
                        {data[currIdxInFull - 1].c ? (((current.c - data[currIdxInFull - 1].c) / data[currIdxInFull - 1].c) * 100).toFixed(2) : "0.00"}%)
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] text-white/60 mr-1">Drag to Canvas</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-xs text-white/70 hover:text-white hover:bg-white/10"
                draggable
                onDragStart={(e) => setDragData(e, symbol)}
              >
                Drag {symbol}
              </Button>
              {tfButtons.map((t) => (
                <Button
                  key={t.value}
                  size="sm"
                  variant={timeframe === t.value ? "default" : "ghost"}
                  className={`h-8 px-2 text-xs ${
                    timeframe === t.value
                      ? "bg-gradient-to-r from-emerald-500 to-purple-600 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => onTimeframeChange?.(t.value)}
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="w-full touch-none select-none"
            onWheel={handleWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            draggable
            onDragStart={(e) => setDragData(e, symbol)}
          >
            <svg
              width={width}
              height={height}
              className="w-full h-[320px]"
              onMouseMove={onSVGMouseMove}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* axis lines */}
              <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + innerH} stroke="rgba(255,255,255,0.15)" />
              <line x1={padding.left} y1={padding.top + innerH} x2={padding.left + innerW} y2={padding.top + innerH} stroke="rgba(255,255,255,0.15)" />
              {/* grid */}
              {Array.from({ length: 4 }).map((_, i) => {
                const y = padding.top + (i * innerH) / 4;
                return <line key={i} x1={padding.left} y1={y} x2={padding.left + innerW} y2={y} stroke="rgba(255,255,255,0.08)" />;
              })}

              {/* candles */}
              {view.map((d, i) => {
                const xi = xScale(i);
                const cw = Math.max(2, innerW / view.length * 0.6);
                const openY = yScale(d.o);
                const closeY = yScale(d.c);
                const highY = yScale(d.h);
                const lowY = yScale(d.l);
                const isUp = d.c >= d.o;
                const bodyY = Math.min(openY, closeY);
                const bodyH = Math.max(1, Math.abs(closeY - openY));
                return (
                  <g key={d.t}>
                    <line x1={xi} y1={highY} x2={xi} y2={lowY} stroke={isUp ? "#10b981" : "#ef4444"} strokeWidth="1" />
                    <rect x={xi - cw / 2} y={bodyY} width={cw} height={bodyH} fill={isUp ? "#10b981" : "#ef4444"} opacity={0.85} />
                  </g>
                );
              })}

              {/* SMA overlays */}
              {([ { data: sma20, color: "#60a5fa" }, { data: sma50, color: "#f59e0b" } ] as const).map((l, idx) => {
                const seg = l.data.filter(pt => pt.t >= view[0]?.t && pt.t <= view[view.length - 1]?.t);
                if (seg.length < 2) return null;
                const path = seg
                  .map((pt) => {
                    const i = view.findIndex(v => v.t === pt.t);
                    if (i < 0) return "";
                    return `${xScale(i)},${yScale(pt.v)}`;
                  })
                  .filter(Boolean)
                  .join(" L ");
                return <path key={idx} d={`M ${path}`} fill="none" stroke={l.color} strokeWidth="1.5" opacity="0.9" />;
              })}

              {/* hover crosshair and tooltip */}
              {hoverIndex != null && view[hoverIndex] && (
                <>
                  <line
                    x1={xScale(hoverIndex)}
                    y1={padding.top}
                    x2={xScale(hoverIndex)}
                    y2={padding.top + innerH}
                    stroke="rgba(255,255,255,0.2)"
                    strokeDasharray="4 4"
                  />
                  <rect
                    x={Math.min(xScale(hoverIndex) + 8, padding.left + innerW - 160)}
                    y={padding.top + 8}
                    width="160"
                    height="92"
                    rx="8"
                    fill="rgba(17,24,39,0.9)"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <text x={Math.min(xScale(hoverIndex) + 16, padding.left + innerW - 152)} y={padding.top + 26} fill="#fff" fontSize="11">
                    Price: ${view[hoverIndex].c.toFixed(2)}
                  </text>
                  <text x={Math.min(xScale(hoverIndex) + 16, padding.left + innerW - 152)} y={padding.top + 44} fill="#a7f3d0" fontSize="11">
                    Volume: {(view[hoverIndex].v / 1_000_000).toFixed(2)}M
                  </text>
                  <text x={Math.min(xScale(hoverIndex) + 16, padding.left + innerW - 152)} y={padding.top + 62} fill="#93c5fd" fontSize="11">
                    RSI: {(() => {
                      const r = rsi.find(pt => pt.t === view[hoverIndex].t);
                      return r ? r.v.toFixed(1) : "-";
                    })()}
                  </text>
                  <text x={Math.min(xScale(hoverIndex) + 16, padding.left + innerW - 152)} y={padding.top + 80} fill="#fde68a" fontSize="11">
                    MA20 / MA50: {(() => {
                      const m20 = sma20.find(pt => pt.t === view[hoverIndex].t)?.v;
                      const m50 = sma50.find(pt => pt.t === view[hoverIndex].t)?.v;
                      return `${m20 ? m20.toFixed(1) : "-"} / ${m50 ? m50.toFixed(1) : "-"}`;
                    })()}
                  </text>
                  <text x={Math.min(xScale(hoverIndex) + 16, padding.left + innerW - 152)} y={padding.top + 98} fill="#c4b5fd" fontSize="11">
                    Daily Return: {(() => {
                      const ret = dailyReturns.find(pt => pt.t === view[hoverIndex].t)?.v;
                      return ret ? `${ret >= 0 ? "+" : ""}${ret.toFixed(2)}%` : "-";
                    })()}
                  </text>
                </>
              )}
            </svg>
          </div>

          {/* stats row */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* Price Changes (over current view window) */}
            <div className="rounded-md bg-white/5 p-2 border border-white/10">
              <div className="text-white/60">Price Change</div>
              <div className={`text-white font-medium ${priceChangeAbs >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                ${priceChangeAbs.toFixed(2)} ({priceChangePct >= 0 ? "+" : ""}{priceChangePct.toFixed(2)}%)
              </div>
            </div>

            {/* Volatility (σ, 20d annualized) */}
            <div className="rounded-md bg-white/5 p-2 border border-white/10">
              <div className="text-white/60">Volatility (σ, 20d)</div>
              <div className="text-white font-medium">{(volStd * 100).toFixed(2)}%</div>
            </div>

            {/* Moving Averages */}
            <div className="rounded-md bg-white/5 p-2 border border-white/10">
              <div className="text-white/60">MA20 / MA50</div>
              <div className="text-white font-medium">
                {(() => {
                  const latestT = view[view.length - 1]?.t;
                  const m20 = latestT ? sma20.find(pt => pt.t === latestT)?.v : undefined;
                  const m50 = latestT ? sma50.find(pt => pt.t === latestT)?.v : undefined;
                  return `${m20 ? m20.toFixed(2) : "-" } / ${m50 ? m50.toFixed(2) : "-"}`;
                })()}
              </div>
            </div>

            {/* RSI (latest) */}
            <div className="rounded-md bg-white/5 p-2 border border-white/10">
              <div className="text-white/60">RSI (14)</div>
              <div className="text-white font-medium">
                {(() => {
                  const latestT = view[view.length - 1]?.t;
                  const r = latestT ? rsi.find(pt => pt.t === latestT)?.v : undefined;
                  return r !== undefined ? r.toFixed(1) : "-";
                })()}
              </div>
            </div>

            {/* Daily Return (latest) */}
            <div className="rounded-md bg-white/5 p-2 border border-white/10">
              <div className="text-white/60">Daily Return</div>
              <div className="text-white font-medium">
                {(() => {
                  const latestT = view[view.length - 1]?.t;
                  const ret = latestT ? dailyReturns.find(pt => pt.t === latestT)?.v : undefined;
                  return ret !== undefined ? `${ret >= 0 ? "+" : ""}${ret.toFixed(2)}%` : "-";
                })()}
              </div>
            </div>

            {/* Sharpe Ratio (demo) */}
            <div className="rounded-md bg-white/5 p-2 border border-white/10">
              <div className="text-white/60">Sharpe (demo)</div>
              <div className="text-white font-medium">{sharpe.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-white/60">
              Tip: Use trackpad/mouse wheel to zoom (Cmd/Ctrl+scroll) and pan (scroll or drag).
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => { setZoom(1); setPan(0); }}>
                Reset View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}