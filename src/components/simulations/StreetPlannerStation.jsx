import React, { useState } from 'react';
import { CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import CoordinatePlane from '../shared/CoordinatePlane';
import Mascot from '../Mascot';
import { formatEquation, calcYIntercept } from '../../engine/lineMath';
import { Frac } from '../../engine/frac';
import { playChime, playBuzz, playClick } from '../../utils/audio';

const STREET_CHALLENGES = [
  {
    type: 'parallel',
    refLine: { m: 2, c: -1 },
    point: { x: 2, y: 5 },
    targetM: 2,
    targetC: 1, // 5 = 2(2) + c -> c = 1
    instruction: 'Round 1: Build a parallel street to the red avenue (slope m = 2) through the landmark at (2, 5).',
  },
  {
    type: 'perpendicular',
    refLine: { m: 2, c: 1 },
    point: { x: 4, y: 1 },
    targetM: -0.5,
    targetC: 3, // 1 = -0.5(4) + c -> 1 = -2 + c -> c = 3
    instruction: 'Round 2: Build a perpendicular avenue to the red line (slope m = 2) through the point (4, 1).',
  },
  {
    type: 'classify',
    pair: { eq1: 'y = 3x + 1', eq2: 'y = -1/3x + 4' },
    correctAnswer: 'Perpendicular',
    instruction: 'Round 3: How are the lines y = 3x + 1 and y = -1/3x + 4 related?',
  },
];

export default function StreetPlannerStation({ onComplete, audioEnabled }) {
  const [beat, setBeat] = useState('learn'); // 'learn' | 'guided' | 'challenges'
  const [roundIdx, setRoundIdx] = useState(0);

  // Sliders for challenges
  const [m, setM] = useState(1);
  const [c, setC] = useState(0);

  const currentRound = STREET_CHALLENGES[roundIdx];

  const isMatched =
    currentRound.type !== 'classify' &&
    Math.abs(m - currentRound.targetM) < 0.05 &&
    Math.abs(c - currentRound.targetC) < 0.05;

  const handleNextChallenge = () => {
    if (isMatched) {
      playChime();
      if (roundIdx < STREET_CHALLENGES.length - 1) {
        setRoundIdx((prev) => prev + 1);
        setM(1);
        setC(0);
      } else {
        onComplete();
      }
    } else {
      playBuzz();
    }
  };

  const handleClassifyAnswer = (ans) => {
    playClick();
    if (ans === currentRound.correctAnswer) {
      playChime();
      onComplete();
    } else {
      playBuzz();
    }
  };

  return (
    <div className="station-workspace-card glass-card">
      <div className="station-beat-nav">
        <button
          className={`beat-tab-btn ${beat === 'learn' ? 'active' : ''}`}
          onClick={() => { playClick(); setBeat('learn'); }}
        >
          1. Parallel &amp; Perpendicular
        </button>
        <button
          className={`beat-tab-btn ${beat === 'guided' ? 'active' : ''}`}
          onClick={() => { playClick(); setBeat('guided'); }}
        >
          2. Guided City Grid
        </button>
        <button
          className={`beat-tab-btn ${beat === 'challenges' ? 'active' : ''}`}
          onClick={() => { playClick(); setBeat('challenges'); }}
        >
          3. Challenges ({roundIdx + 1}/3)
        </button>
      </div>

      {/* 1. Learn Concept */}
      {beat === 'learn' && (
        <div className="station-content-layout">
          <div className="rule-card-container">
            <h3 className="rule-card-title">🏙️ Yuki &amp; Priya: Parallel &amp; Perpendicular Streets</h3>
            <div className="rule-card-symbolic">
              Parallel: m₁ = m₂ &emsp;|&emsp; Perpendicular: m₁ × m₂ = −1
            </div>
            <p className="rule-card-explanation">
              • <strong>Parallel Lines</strong>: Have the exact same slope (m₁ = m₂). They tilt at the identical angle and never intersect, just like Tokyo’s Shinkansen bullet train tracks!
              <br /><br />
              • <strong>Perpendicular Lines</strong>: Cross at a perfect 90° right angle. Their slopes are <em>negative reciprocals</em>: flip the fraction and negate the sign!
              <br />
              Example: If line 1 has slope m = 2, a perpendicular street has slope m = <strong>−1/2</strong>.
            </p>
            <div style={{ marginTop: 20 }}>
              <button
                className="btn btn-primary"
                onClick={() => { playClick(); setBeat('guided'); }}
              >
                <span>Explore City Grid</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="simulation-canvas-column">
            <CoordinatePlane
              width={300}
              height={300}
              range={8}
              line={{ m: 2, c: 2 }}
              refLine={{ m: -0.5, c: 2 }}
              readOnly={true}
            />
            <div className="formula-panel-card" style={{ width: '100%' }}>
              <div className="formula-row highlight-row">
                <span className="formula-label">Slopes:</span>
                <span className="formula-value">m₁ = 2, m₂ = −1/2 → 2 × (−1/2) = −1 ✓</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Guided Try */}
      {beat === 'guided' && (
        <div className="station-content-layout">
          <div className="simulation-canvas-column">
            <CoordinatePlane
              width={320}
              height={320}
              range={8}
              line={{ m, c }}
              refLine={{ m: 2, c: 0 }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span className="phase-tag">Red Line is Reference Avenue (m = 2)</span>

            <div className="sim-controls-panel">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Slope (m):</span>
                  <span style={{ color: '#00e5ff', fontWeight: 800 }}>m = {m}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={m}
                  onChange={(e) => { playClick(); setM(Number(e.target.value)); }}
                  className="slider-input"
                />
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>y-intercept (c):</span>
                  <span style={{ color: '#ffd54f', fontWeight: 800 }}>c = {c}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={c}
                  onChange={(e) => { playClick(); setC(Number(e.target.value)); }}
                  className="slider-input"
                />
              </div>
            </div>

            <div className="formula-panel-card">
              <div className="formula-row">
                <span className="formula-label">Slope Comparison:</span>
                <span className="formula-value">
                  {m === 2
                    ? 'PARALLEL! (Same slope m = 2)'
                    : m === -0.5
                    ? 'PERPENDICULAR! (Negative reciprocal -1/2)'
                    : 'Intersecting at non-90°'}
                </span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => { playClick(); setBeat('challenges'); }}
            >
              <span>Ready for Street Planner Challenges!</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 3. Challenge Rounds */}
      {beat === 'challenges' && (
        <div className="station-content-layout">
          {currentRound.type !== 'classify' ? (
            <div className="simulation-canvas-column">
              <CoordinatePlane
                width={320}
                height={320}
                range={8}
                line={{ m, c }}
                refLine={currentRound.refLine}
                points={[currentRound.point]}
              />
            </div>
          ) : (
            <div className="simulation-canvas-column">
              <CoordinatePlane
                width={320}
                height={320}
                range={8}
                line={{ m: 3, c: 1 }}
                refLine={{ m: -1 / 3, c: 4 }}
                readOnly={true}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="phase-tag">Challenge {roundIdx + 1} of 3</span>
              <Mascot mood={isMatched ? 'celebrating' : 'thinking'} slope={m} size="small" />
            </div>

            <h3 style={{ color: '#ffd54f', fontFamily: 'var(--font-display)', margin: 0 }}>
              {currentRound.instruction}
            </h3>

            {currentRound.type !== 'classify' ? (
              <>
                <div className="sim-controls-panel">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Slope (m):</span>
                      <span style={{ color: '#00e5ff', fontWeight: 800 }}>m = {m}</span>
                    </div>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.5"
                      value={m}
                      onChange={(e) => { playClick(); setM(Number(e.target.value)); }}
                      className="slider-input"
                    />
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>y-intercept (c):</span>
                      <span style={{ color: '#ffd54f', fontWeight: 800 }}>c = {c}</span>
                    </div>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      step="1"
                      value={c}
                      onChange={(e) => { playClick(); setC(Number(e.target.value)); }}
                      className="slider-input"
                    />
                  </div>
                </div>

                <div className="formula-panel-card">
                  <div className="formula-row highlight-row">
                    <span className="formula-label">Your Line:</span>
                    <span className="formula-value" style={{ color: isMatched ? '#00e676' : '#00e5ff' }}>
                      {formatEquation(m, c)}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleNextChallenge}
                  disabled={!isMatched}
                >
                  {isMatched ? (
                    <>
                      <CheckCircle size={18} />
                      <span>{roundIdx < STREET_CHALLENGES.length - 1 ? 'Correct! Next Round' : 'Complete Station D! ✓'}</span>
                    </>
                  ) : (
                    <span>Adjust Sliders to Pass Through Point</span>
                  )}
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Parallel', 'Perpendicular', 'Neither'].map((opt) => (
                  <button
                    key={opt}
                    className="btn btn-secondary"
                    onClick={() => handleClassifyAnswer(opt)}
                    style={{ fontSize: '1.1rem', padding: '14px' }}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
