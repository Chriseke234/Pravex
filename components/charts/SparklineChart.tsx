"use client";

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}

export function SparklineChart({ data, width = 80, height = 32, positive = true }: SparklineChartProps) {
  if (!data || data.length === 0) {
    return <div style={{ width, height }} className="bg-white/5 rounded-md" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // We map x from 0 to 100, y from 0 to 100
  // SVG coordinates: 0,0 is top-left
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  });

  const polylinePoints = points.join(' ');
  // To create a gradient fill, we need a closed path
  const fillPoints = `${points[0].split(',')[0]},100 ${polylinePoints} ${points[points.length - 1].split(',')[0]},100`;

  const color = positive ? "#34d399" : "#f87171"; // emerald-400 or red-400
  const gradientId = `sparkline-gradient-${Math.random().toString(36).substring(7)}`;

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 -10 100 120" 
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#${gradientId})`} />
      <polyline 
        points={polylinePoints} 
        fill="none" 
        stroke={color} 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
