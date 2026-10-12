import React, { useRef, useState } from 'react';
import { playClick } from '../../utils/audio';

export default function CoordinatePlane({
  width = 360,
  height = 360,
  range = 8,
  points = [],
  onPointMove,
  interactivePointIndex = null,
  line = null, // { m, c, isVertical, xVal }
  ghostLine = null, // { m, c, isVertical, xVal }
  refLine = null, // { m, c } e.g. for parallel/perpendicular
  showStaircase = false,
  showIntercept = false,
  readOnly = false,
}) {
  const svgRef = useRef(null);
  const [draggingIdx, setDraggingIdx] = useState(null);

  const cx = width / 2;
  const cy = height / 2;
  const scale = width / (range * 2);

  const toSvgX = (x) => cx + x * scale;
  const toSvgY = (y) => cy - y * scale;

  const toMathX = (svgX) => Math.round((svgX - cx) / scale);
  const toMathY = (svgY) => Math.round((cy - svgY) / scale);

  const handlePointerDown = (idx, e) => {
    if (readOnly || !onPointMove) return;
    e.preventDefault();
    setDraggingIdx(idx);
    playClick();
  };

  const handlePointerMove = (e) => {
    if (draggingIdx === null || !onPointMove || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (clientX == null || clientY == null) return;

    const svgX = (clientX - rect.left) * (width / rect.width);
    const svgY = (clientY - rect.top) * (height / rect.height);

    const mathX = Math.max(-range, Math.min(range, toMathX(svgX)));
    const mathY = Math.max(-range, Math.min(range, toMathY(svgY)));

    onPointMove(draggingIdx, { x: mathX, y: mathY });
  };

  const handlePointerUp = () => {
    setDraggingIdx(null);
  };

  // Render grid lines
  const gridLines = [];
  for (let i = -range; i <= range; i++) {
    if (i !== 0) {
      gridLines.push(
        <line
          key={`gx-${i}`}
          x1={toSvgX(i)}
          y1={0}
          x2={toSvgX(i)}
          y2={height}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
        />
      );
      gridLines.push(
        <line
          key={`gy-${i}`}
          x1={0}
          y1={toSvgY(i)}
          x2={width}
          y2={toSvgY(i)}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
        />
      );
    }
  }

  // Calculate endpoints for a line across the grid
  const getLineCoords = (l) => {
    if (!l) return null;
    if (l.isVertical) {
      const x = l.xVal != null ? l.xVal : 0;
      return { x1: toSvgX(x), y1: 0, x2: toSvgX(x), y2: height };
    }
    const mNum = typeof l.m === 'object' && l.m !== null ? l.m.toNumber() : Number(l.m);
    const cNum = typeof l.c === 'object' && l.c !== null ? l.c.toNumber() : Number(l.c || 0);

    const xLeft = -range - 1;
    const yLeft = mNum * xLeft + cNum;
    const xRight = range + 1;
    const yRight = mNum * xRight + cNum;

    return {
      x1: toSvgX(xLeft),
      y1: toSvgY(yLeft),
      x2: toSvgX(xRight),
      y2: toSvgY(yRight),
    };
  };

  const lineCoords = getLineCoords(line);
  const ghostCoords = getLineCoords(ghostLine);
  const refCoords = getLineCoords(refLine);

  // Line through two points if points provided and line not explicitly passed
  let twoPointLineCoords = null;
  if (!line && points.length >= 2) {
    const p1 = points[0];
    const p2 = points[1];
    if (p1.x === p2.x) {
      twoPointLineCoords = { x1: toSvgX(p1.x), y1: 0, x2: toSvgX(p1.x), y2: height };
    } else {
      const m = (p2.y - p1.y) / (p2.x - p1.x);
      const c = p1.y - m * p1.x;
      twoPointLineCoords = getLineCoords({ m, c });
    }
  }

  const p1 = points[0];
  const p2 = points[1];

  return (
    <div
      className="coordinate-plane-wrapper"
      style={{
        width,
        height,
        position: 'relative',
        userSelect: 'none',
        touchAction: 'none',
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        style={{
          borderRadius: 16,
          background: 'rgba(12, 10, 38, 0.95)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
          display: 'block',
        }}
      >
        <defs>
          <filter id="pointGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Grid */}
        {gridLines}

        {/* Main Axes */}
        <line x1={0} y1={cy} x2={width} y2={cy} stroke="rgba(255, 255, 255, 0.45)" strokeWidth="2" />
        <line x1={cx} y1={0} x2={cx} y2={height} stroke="rgba(255, 255, 255, 0.45)" strokeWidth="2" />

        {/* Axis Ticks & Numbers */}
        {[-6, -4, -2, 2, 4, 6].map((num) => (
          <React.Fragment key={`axis-num-${num}`}>
            <text
              x={toSvgX(num)}
              y={cy + 14}
              fill="rgba(255, 255, 255, 0.55)"
              fontSize="10"
              fontFamily="var(--font-body)"
              textAnchor="middle"
            >
              {num}
            </text>
            <text
              x={cx - 10}
              y={toSvgY(num) + 4}
              fill="rgba(255, 255, 255, 0.55)"
              fontSize="10"
              fontFamily="var(--font-body)"
              textAnchor="end"
            >
              {num}
            </text>
          </React.Fragment>
        ))}
        <text x={width - 12} y={cy - 6} fill="#00e5ff" fontSize="12" fontWeight="bold">x</text>
        <text x={cx + 8} y={16} fill="#00e5ff" fontSize="12" fontWeight="bold">y</text>

        {/* Ghost / Target Line (Dashed Gold) */}
        {ghostCoords && (
          <line
            x1={ghostCoords.x1}
            y1={ghostCoords.y1}
            x2={ghostCoords.x2}
            y2={ghostCoords.y2}
            stroke="#ffd54f"
            strokeWidth="3.5"
            strokeDasharray="6,6"
            strokeLinecap="round"
          />
        )}

        {/* Reference Line (e.g. for parallel / perpendicular) */}
        {refCoords && (
          <line
            x1={refCoords.x1}
            y1={refCoords.y1}
            x2={refCoords.x2}
            y2={refCoords.y2}
            stroke="#ff4081"
            strokeWidth="2.5"
            strokeDasharray="4,4"
          />
        )}

        {/* Active Primary Line */}
        {(lineCoords || twoPointLineCoords) && (
          <line
            x1={(lineCoords || twoPointLineCoords).x1}
            y1={(lineCoords || twoPointLineCoords).y1}
            x2={(lineCoords || twoPointLineCoords).x2}
            y2={(lineCoords || twoPointLineCoords).y2}
            stroke="#00e5ff"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* Rise / Run Staircase Triangle */}
        {showStaircase && p1 && p2 && p1.x !== p2.x && (
          <g>
            {/* Run line (horizontal, cyan) */}
            <line
              x1={toSvgX(p1.x)}
              y1={toSvgY(p1.y)}
              x2={toSvgX(p2.x)}
              y2={toSvgY(p1.y)}
              stroke="#00e5ff"
              strokeWidth="2.5"
              strokeDasharray="4,3"
            />
            {/* Rise line (vertical, gold) */}
            <line
              x1={toSvgX(p2.x)}
              y1={toSvgY(p1.y)}
              x2={toSvgX(p2.x)}
              y2={toSvgY(p2.y)}
              stroke="#ffd54f"
              strokeWidth="2.5"
              strokeDasharray="4,3"
            />
            {/* Run Label */}
            <text
              x={toSvgX((p1.x + p2.x) / 2)}
              y={toSvgY(p1.y) + (p2.y >= p1.y ? 15 : -8)}
              fill="#00e5ff"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              Run: {p2.x - p1.x}
            </text>
            {/* Rise Label */}
            <text
              x={toSvgX(p2.x) + 8}
              y={toSvgY((p1.y + p2.y) / 2)}
              fill="#ffd54f"
              fontSize="11"
              fontWeight="bold"
            >
              Rise: {p2.y - p1.y}
            </text>
          </g>
        )}

        {/* Y-intercept pulsing marker */}
        {showIntercept && line && (
          <g>
            <circle
              cx={cx}
              cy={toSvgY(line.c?.toNumber ? line.c.toNumber() : line.c || 0)}
              r="7"
              fill="#ffd54f"
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Draggable or static points */}
        {points.map((pt, idx) => {
          const sx = toSvgX(pt.x);
          const sy = toSvgY(pt.y);
          const isDraggable = !readOnly && (interactivePointIndex === null || interactivePointIndex === idx);

          return (
            <g
              key={`pt-${idx}`}
              onPointerDown={(e) => handlePointerDown(idx, e)}
              style={{ cursor: isDraggable ? 'grab' : 'default' }}
            >
              <circle
                cx={sx}
                cy={sy}
                r="9"
                fill={idx === 0 ? '#00e5ff' : '#ffd54f'}
                stroke="#ffffff"
                strokeWidth="2.5"
                filter="url(#pointGlow)"
              />
              <text
                x={sx + 10}
                y={sy - 8}
                fill="#ffffff"
                fontSize="12"
                fontWeight="bold"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
              >
                ({pt.x}, {pt.y})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
