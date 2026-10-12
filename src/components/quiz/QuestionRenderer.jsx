import React from 'react';
import CoordinatePlane from '../shared/CoordinatePlane';
import HintOverlay from '../shared/HintOverlay';
import Mascot from '../Mascot';
import { playClick } from '../../utils/audio';

export default function QuestionRenderer({
  question,
  onSelectAnswer,
  attemptCount = 0,
}) {
  if (!question) return null;

  const handleOptionClick = (option) => {
    playClick();
    onSelectAnswer(option);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="question-renderer-card glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="question-type-badge">
          {question.title || `Question (${question.type})`}
        </span>
        <Mascot mood={attemptCount > 0 ? 'thinking' : 'idle'} size="small" />
      </div>

      <h3 className="question-text-title">
        {question.text}
      </h3>

      {/* Visual Coordinate Graph if question provides line or points */}
      {(question.line || question.points) && (
        <div className="question-visual-scaffold">
          <CoordinatePlane
            width={300}
            height={300}
            range={8}
            points={question.points || []}
            line={question.line}
            showStaircase={question.type === 'Q2'}
            readOnly={true}
          />
        </div>
      )}

      {/* Multiple Choice Options Grid */}
      {question.options && (
        <div className="mcq-options-grid">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              className="mcq-option-btn"
              onClick={() => handleOptionClick(opt)}
            >
              <span className="option-letter">{optionLetters[idx] || '•'}</span>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Hints Overlay */}
      <HintOverlay hint={question.hint} attemptCount={attemptCount} />
    </div>
  );
}
