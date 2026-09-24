import { useId } from "react";
import { cn } from "@/lib/utils";

export interface HexagonPatternProps extends React.SVGProps<SVGSVGElement> {
  /**
   * The radius of each hexagon (center to vertex).
   * @default 40
   */
  radius?: number;
  /**
   * Spacing in pixels between adjacent hexagons.
   * The tile grows by this amount while the visual radius stays fixed,
   * so the gap is evenly distributed on all sides of each hexagon.
   * @default 0
   */
  gap?: number;
  /**
   * Offset applied to the pattern origin on the x-axis.
   * @default -1
   */
  x?: number;
  /**
   * Offset applied to the pattern origin on the y-axis.
   * @default -1
   */
  y?: number;
  /**
   * Controls the orientation of the hexagons.
   * - `"horizontal"` — flat-top hexagons tiled in a horizontal honeycomb grid.
   * - `"vertical"` — pointy-top hexagons tiled in a vertical honeycomb grid.
   * @default "horizontal"
   */
  direction?: "horizontal" | "vertical";
  /**
   * SVG stroke-dasharray applied to each hexagon outline.
   * @default "0"
   */
  strokeDasharray?: string;
  /**
   * Array of [col, row] coordinates for hexagons that should be highlighted
   * (filled) on top of the repeating pattern — mirrors the `squares` prop of
   * GridPattern.
   */
  hexagons?: Array<[col: number, row: number]>;
  strokeWidth?: number | string;
  className?: string;
  [key: string]: unknown;
}

type HexPoint = readonly [number, number];

/**
 * Rounds float coordinates to fixed precision to prevent
 * SSR / client hydration mismatches from trigonometric precision differences.
 */
function roundFloat(val: number, decimals: number = 4): number {
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(val * factor) / factor;
  return Object.is(rounded, -0) || Math.abs(rounded) < 1e-10 ? 0 : rounded;
}

function hexVertexList(
  cx: number,
  cy: number,
  r: number,
  direction: "horizontal" | "vertical"
): HexPoint[] {
  const startAngle = direction === "horizontal" ? 0 : 30;
  return Array.from({ length: 6 }, (_, i) => {
    const angle = ((startAngle + i * 60) * Math.PI) / 180;
    const px = roundFloat(cx + r * Math.cos(angle));
    const py = roundFloat(cy + r * Math.sin(angle));
    return [px, py] as const;
  });
}

function hexPoints(
  cx: number,
  cy: number,
  r: number,
  direction: "horizontal" | "vertical"
): string {
  return hexVertexList(cx, cy, r, direction)
    .map(([px, py]) => `${roundFloat(px)},${roundFloat(py)}`)
    .join(" ");
}

function edgeLexKey(a: HexPoint, b: HexPoint): string {
  const [p, q] =
    a[0] < b[0] || (a[0] === b[0] && a[1] <= b[1]) ? [a, b] : [b, a];
  return `${roundFloat(p[0])},${roundFloat(p[1])}|${roundFloat(q[0])},${roundFloat(q[1])}`;
}

function collectUniqueHexEdges(
  centers: [number, number][],
  r: number,
  direction: "horizontal" | "vertical"
): [HexPoint, HexPoint][] {
  const seen = new Set<string>();
  const edges: [HexPoint, HexPoint][] = [];
  for (const [cx, cy] of centers) {
    const verts = hexVertexList(cx, cy, r, direction);
    for (let i = 0; i < 6; i++) {
      const a = verts[i];
      const b = verts[(i + 1) % 6];
      const key = edgeLexKey(a, b);
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, b]);
      }
    }
  }
  return edges;
}

function isSolidStrokeDasharray(strokeDasharray: string): boolean {
  const t = strokeDasharray.trim();
  return t === "" || t === "none" || t === "0";
}

function getHexSpacing(
  r: number,
  direction: "horizontal" | "vertical",
  gap: number
): {
  colStep: number;
  rowStep: number;
  tileW: number;
  tileH: number;
} {
  const sqrt3 = Math.sqrt(3);

  if (direction === "horizontal") {
    const colStep = roundFloat((3 * r) / 2 + (sqrt3 * gap) / 2);
    const rowStep = roundFloat(sqrt3 * r + gap);

    return {
      colStep,
      rowStep,
      tileW: roundFloat(colStep * 2),
      tileH: rowStep,
    };
  }

  const colStep = roundFloat(sqrt3 * r + gap);
  const rowStep = roundFloat((3 * r) / 2 + (sqrt3 * gap) / 2);

  return {
    colStep,
    rowStep,
    tileW: colStep,
    tileH: roundFloat(rowStep * 2),
  };
}

function getTileGeometry(
  r: number,
  direction: "horizontal" | "vertical",
  gap: number
): {
  tileW: number;
  tileH: number;
  centers: [number, number][];
} {
  if (direction === "horizontal") {
    const { colStep, rowStep, tileW, tileH } = getHexSpacing(r, direction, gap);

    const canonical: [number, number][] = [
      [roundFloat(colStep / 2), roundFloat(rowStep / 2)],
      [roundFloat((colStep * 3) / 2), roundFloat(rowStep)],
    ];

    const centers: [number, number][] = [];
    for (const [cx, cy] of canonical) {
      centers.push([roundFloat(cx), roundFloat(cy)]);
      if (cy - r < 0) centers.push([roundFloat(cx), roundFloat(cy + tileH)]);
      if (cy + r > tileH) centers.push([roundFloat(cx), roundFloat(cy - tileH)]);
      if (cx - r < 0) centers.push([roundFloat(cx + tileW), roundFloat(cy)]);
      if (cx + r > tileW) centers.push([roundFloat(cx - tileW), roundFloat(cy)]);
      if (cy - r < 0 && cx - r < 0) centers.push([roundFloat(cx + tileW), roundFloat(cy + tileH)]);
      if (cy - r < 0 && cx + r > tileW) centers.push([roundFloat(cx - tileW), roundFloat(cy + tileH)]);
      if (cy + r > tileH && cx - r < 0) centers.push([roundFloat(cx + tileW), roundFloat(cy - tileH)]);
      if (cy + r > tileH && cx + r > tileW)
        centers.push([roundFloat(cx - tileW), roundFloat(cy - tileH)]);
    }

    return { tileW, tileH, centers };
  } else {
    const { colStep, rowStep, tileW, tileH } = getHexSpacing(r, direction, gap);

    const canonical: [number, number][] = [
      [roundFloat(colStep / 2), roundFloat(rowStep / 2)],
      [roundFloat(colStep), roundFloat((rowStep * 3) / 2)],
    ];

    const centers: [number, number][] = [];
    for (const [cx, cy] of canonical) {
      centers.push([roundFloat(cx), roundFloat(cy)]);
      if (cy - r < 0) centers.push([roundFloat(cx), roundFloat(cy + tileH)]);
      if (cy + r > tileH) centers.push([roundFloat(cx), roundFloat(cy - tileH)]);
      if (cx - r < 0) centers.push([roundFloat(cx + tileW), roundFloat(cy)]);
      if (cx + r > tileW) centers.push([roundFloat(cx - tileW), roundFloat(cy)]);
      if (cy - r < 0 && cx - r < 0) centers.push([roundFloat(cx + tileW), roundFloat(cy + tileH)]);
      if (cy - r < 0 && cx + r > tileW) centers.push([roundFloat(cx - tileW), roundFloat(cy + tileH)]);
      if (cy + r > tileH && cx - r < 0) centers.push([roundFloat(cx + tileW), roundFloat(cy - tileH)]);
      if (cy + r > tileH && cx + r > tileW)
        centers.push([roundFloat(cx - tileW), roundFloat(cy - tileH)]);
    }

    return { tileW, tileH, centers };
  }
}

function hexCenter(
  col: number,
  row: number,
  r: number,
  direction: "horizontal" | "vertical",
  gap: number
): [number, number] {
  if (direction === "horizontal") {
    const { colStep, rowStep } = getHexSpacing(r, direction, gap);
    const x = roundFloat(col * colStep + colStep / 2);
    const y = roundFloat(row * rowStep + rowStep / 2 + (col % 2 !== 0 ? rowStep / 2 : 0));
    return [x, y];
  } else {
    const { colStep, rowStep } = getHexSpacing(r, direction, gap);
    const x = roundFloat(col * colStep + colStep / 2 + (row % 2 !== 0 ? colStep / 2 : 0));
    const y = roundFloat(row * rowStep + rowStep / 2);
    return [x, y];
  }
}

export function HexagonPattern({
  radius = 40,
  gap = 0,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  direction = "horizontal",
  hexagons,
  strokeWidth = 1,
  className,
  ...props
}: HexagonPatternProps) {
  const id = useId();

  const { tileW, tileH, centers } = getTileGeometry(radius, direction, gap);
  const solidStroke = isSolidStrokeDasharray(strokeDasharray);
  const dashedEdges = solidStroke
    ? null
    : collectUniqueHexEdges(centers, radius, direction);

  return (
    <svg
      aria-hidden="true"
      suppressHydrationWarning
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full stroke-neutral-300 text-neutral-300 fill-none",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={tileW}
          height={tileH}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        >
          {solidStroke
            ? centers.map(([cx, cy]) => (
                <polygon
                  className="fill-none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  key={`${roundFloat(cx)}-${roundFloat(cy)}`}
                  points={hexPoints(cx, cy, radius, direction)}
                  strokeDasharray={strokeDasharray}
                />
              ))
            : dashedEdges?.map(([a, b]) => (
                <line
                  className="fill-none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  key={edgeLexKey(a, b)}
                  x1={roundFloat(a[0])}
                  x2={roundFloat(b[0])}
                  y1={roundFloat(a[1])}
                  y2={roundFloat(b[1])}
                  strokeDasharray={strokeDasharray}
                />
              ))}
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill={`url(#${id})`} stroke="none" />

      {hexagons && hexagons.length > 0 && (
        <svg aria-hidden="true" className="overflow-visible" x={x} y={y}>
          {hexagons.map(([col, row]) => {
            const [cx, cy] = hexCenter(col, row, radius, direction, gap);
            return (
              <polygon
                key={`${col}-${row}`}
                points={hexPoints(cx, cy, radius - 1, direction)}
                strokeWidth="0"
                fill="currentColor"
                className="opacity-20"
              />
            );
          })}
        </svg>
      )}
    </svg>
  );
}

export default HexagonPattern;
