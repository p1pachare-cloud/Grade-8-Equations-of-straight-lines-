import React from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import Mascot from '../Mascot';

export default function FeedbackOverlay({
  feedback, // { isCorrect: bool, xpEarned: number, explanation: string }
  onContinue,
  onRetry,
}) {
  if (!feedback) return null;
  const isCorrect = feedback.isCorrect;

  return (
    <div className="feedback-overlay-backdrop">
      <div className={`feedback-modal-card ${isCorrect ? 'correct' : 'incorrect'}`}>
        <Mascot
          mood={isCorrect ? 'celebrating' : 'thinking'}
          size="medium"
        />

        <h3 className="feedback-title">
          {isCorrect ? 'Spot On! 🎉' : 'Keep Trying! 💡'}
        </h3>

        {isCorrect && feedback.xpEarned > 0 && (
          <div className="feedback-xp-burst">
            +{feedback.xpEarned} XP Earned!
          </div>
        )}

        <p className="feedback-explanation">
          {feedback.explanation}
        </p>

        <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
          {!isCorrect && onRetry && (
            <button className="btn btn-secondary" onClick={onRetry}>
              <RotateCcw size={16} />
              <span>Try Again</span>
            </button>
          )}

          <button className="btn btn-primary" onClick={onContinue}>
            <span>Continue</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
