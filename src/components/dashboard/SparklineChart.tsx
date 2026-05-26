import { cn } from "@/lib/utils";

type SparklineChartProps = {
  values: number[];
  positive?: boolean;
  className?: string;
  height?: number;
};

export function SparklineChart({
  values,
  positive = true,
  className,
  height = 56,
}: SparklineChartProps) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 280;
  const padding = 4;
  const innerHeight = height - padding * 2;

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y =
      padding + innerHeight - ((value - min) / range) * innerHeight;
    return { x, y };
  });

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = [
    `0,${height}`,
    ...points.map((point) => `${point.x},${point.y}`),
    `${width},${height}`,
  ].join(" ");

  const stroke = positive ? "var(--positive)" : "var(--negative)";
  const fill = positive
    ? "color-mix(in srgb, var(--positive) 18%, transparent)"
    : "color-mix(in srgb, var(--negative) 18%, transparent)";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-14 w-full", className)}
      role="img"
      aria-label="Recent price trend"
    >
      <polygon fill={fill} points={area} />
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={polyline}
      />
    </svg>
  );
}
