import React from 'react';

const FLOATING_ITEMS = [
  { text: 'y = mx + c', top: '12%', left: '8%', delay: '0s' },
  { text: 'm = rise / run', top: '22%', left: '88%', delay: '3s' },
  { text: '(x, y)', top: '48%', left: '4%', delay: '5s' },
  { text: 'Δy / Δx', top: '65%', left: '92%', delay: '2s' },
  { text: 'y = 2x + 1', top: '80%', left: '14%', delay: '4s' },
  { text: 'm₁ × m₂ = -1', top: '85%', left: '82%', delay: '1s' },
  { text: 'Ax + By = C', top: '35%', left: '94%', delay: '6s' },
  { text: 'c = (0, c)', top: '10%', left: '72%', delay: '2.5s' },
];

export default function FloatingGeometry() {
  return (
    <div className="floating-numbers" aria-hidden="true">
      {FLOATING_ITEMS.map((item, idx) => (
        <span
          key={idx}
          className="floating-number"
          style={{
            top: item.top,
            left: item.left,
            animationDelay: item.delay,
            fontSize: '1.4rem',
            letterSpacing: '1px',
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
