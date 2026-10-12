import React from 'react';
import { Lightbulb, Info } from 'lucide-react';

export default function HintOverlay({ hint, attemptCount }) {
  if (!hint || attemptCount === 0) return null;

  return (
    <div className="hint-overlay-container">
      <div className={`hint-card glass-card hint-level-${Math.min(attemptCount, 3)}`}>
        <div className="hint-header">
          <Lightbulb size={16} color="#ffd54f" />
          <span style={{ color: '#ffd54f' }}>
            {attemptCount === 1 ? 'Concept Nudge' : attemptCount === 2 ? 'Worked Hint' : 'Full Strategy'}
          </span>
        </div>
        <p className="hint-text">
          {hint}
        </p>
      </div>
    </div>
  );
}
