import React, { useState } from 'react';
import { CheckCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import CoordinatePlane from '../shared/CoordinatePlane';
import Mascot from '../Mascot';
import { formatEquation, checkEquationEquivalence } from '../../engine/lineMath';
import { playChime, playBuzz, playClick } from '../../utils/audio';

const BUILDER_CHALLENGES = [
  {
    title: 'From Graph with Intercept',
    points: [{ x: 0, y: 1 }, { x: 2, y: 5 }],
    targetM: 2,
    targetC: 1,
    hint: 'Slope m = (5 − 1) / (2 − 0) = 2. Intercept c is at (0, 1) → c = 1.',
  },
  {
    title: 'From Slope and Point',
    points: [{ x: 3, y: 7 }],
    givenSlope: 2,
    targetM: 2,
    targetC: 1,
    hint: 'Substitute x = 3, y = 7, m = 2: 7 = 2(3) + c → 7 = 6 + c → c = 1.',
  },
  {
    title: 'From Two Coordinates',
    points: [{ x: 1, y: 3 }, { x: 4, y: 9 }],
    targetM: 2,
    targetC: 1,
    hint: 'Slope m = (9 − 3) / (4 − 1) = 6 / 3 = 2. Then 3 = 2(1) + c → c = 1.',
  },
];

export default function EquationBuilderStation({ onComplete, audioEnabled }) {
  const [beat, setBeat] = useState('learn'); // 'learn' | 'guided' | 'challenges'
  const [roundIdx, setRoundIdx] = useState(0);

  // Guided step index: 0: slope, 1: intercept, 2: full equation
  const [guidedStep, setGuidedStep] = useState(0);

  // User typed equation in challenge
  const [inputEq, setInputEq] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentChallenge = BUILDER_CHALLENGES[roundIdx];
  const targetEquation = currentChallenge
    ? formatEquation(currentChallenge.targetM, currentChallenge.targetC)
    : '';

  const handleTileClick = (token) => {
    playClick();
    setInputEq((prev) => prev + token);
    setErrorMsg('');
  };

  const handleClear = () => {
    playClick();
    setInputEq('');
    setErrorMsg('');
  };

  const handleCheckEquation = () => {
    if (!currentChallenge) return;
    const isEquiv = checkEquationEquivalence(
      inputEq,
      currentChallenge.targetM,
      currentChallenge.targetC
    );

    if (isEquiv) {
      playChime();
      setErrorMsg('');
      if (roundIdx < BUILDER_CHALLENGES.length - 1) {
        setRoundIdx((prev) => prev + 1);
        setInputEq('');
      } else {
        onComplete();
      }
    } else {
      playBuzz();
      setErrorMsg(`Not quite! Check slope or intercept. Expected form: ${targetEquation}`);
    }
  };

  return (
    <div className="station-workspace-card glass-card">
      <div className="station-beat-nav">
        <button
          className={`beat-tab-btn ${beat === 'learn' ? 'active' : ''}`}
          onClick={() => { playClick(); setBeat('learn'); }}
        >
          1. Learn Steps
        </button>
        <button
          className={`beat-tab-btn ${beat === 'guided' ? 'active' : ''}`}
          onClick={() => { playClick(); setBeat('guided'); }}
        >
          2. Guided Scaffold
        </button>
        <button
          className={`beat-tab-btn ${beat === 'challenges' ? 'active' : ''}`}
          onClick={() => { playClick(); setBeat('challenges'); }}
        >
          3. Equation Challenges ({roundIdx + 1}/3)
        </button>
      </div>

      {/* 1. Learn Steps */}
      {beat === 'learn' && (
        <div className="station-content-layout">
          <div className="rule-card-container">
            <h3 className="rule-card-title">✍️ Aisha’s Navigation: Assembling y = mx + c</h3>
            <div className="rule-card-symbolic">
              1. Find m → 2. Substitute Point → 3. Solve for c → 4. Write Equation
            </div>
            <p className="rule-card-explanation">
              To write the equation of any straight line, follow this 4-step blueprint:
              <br /><br />
              <strong>Step 1: Calculate slope (m)</strong>
              <br />
              m = (y₂ − y₁) ÷ (x₂ − x₁)
              <br /><br />
              <strong>Step 2: Substitute one point (x, y)</strong> into y = mx + c.
              <br /><br />
              <strong>Step 3: Solve the algebraic equation</strong> to find c (the y-intercept).
              <br /><br />
              <strong>Step 4: Combine them</strong> into y = mx + c!
            </p>
            <div style={{ marginTop: 20 }}>
              <button
                className="btn btn-primary"
                onClick={() => { playClick(); setBeat('guided'); }}
              >
                <span>Walk Through the Guided Scaffold</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="simulation-canvas-column">
            <CoordinatePlane
              width={300}
              height={300}
              range={8}
              points={[{ x: 0, y: 2 }, { x: 4, y: 10 }]}
              line={{ m: 2, c: 2 }}
              readOnly={true}
            />
            <div className="formula-panel-card" style={{ width: '100%' }}>
              <div className="formula-row highlight-row">
                <span className="formula-label">Skylark Trajectory:</span>
                <span className="formula-value">y = 2x + 2</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Guided Scaffold */}
      {beat === 'guided' && (
        <div className="station-content-layout">
          <div className="simulation-canvas-column">
            <CoordinatePlane
              width={320}
              height={320}
              range={8}
              points={[{ x: 1, y: 3 }, { x: 3, y: 7 }]}
              line={{ m: 2, c: 1 }}
              showStaircase={guidedStep === 0}
              showIntercept={guidedStep >= 1}
              readOnly={true}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span className="phase-tag">Guided Walkthrough · Points (1, 3) and (3, 7)</span>

            {guidedStep === 0 && (
              <div className="formula-panel-card">
                <h4 style={{ color: '#ffd54f', margin: 0 }}>Step 1: Find the Slope (m)</h4>
                <p style={{ margin: '6px 0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  m = (y₂ − y₁) / (x₂ − x₁) = (7 − 3) / (3 − 1) = 4 / 2 = <strong>2</strong>.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => { playClick(); setGuidedStep(1); }}
                >
                  <span>Got it! Step 2: Find c</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {guidedStep === 1 && (
              <div className="formula-panel-card">
                <h4 style={{ color: '#ffd54f', margin: 0 }}>Step 2 &amp; 3: Substitute Point (1, 3)</h4>
                <p style={{ margin: '6px 0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  y = mx + c → 3 = 2(1) + c → 3 = 2 + c → c = 3 − 2 = <strong>1</strong>.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => { playClick(); setGuidedStep(2); }}
                >
                  <span>Step 4: Final Equation</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {guidedStep === 2 && (
              <div className="formula-panel-card">
                <h4 style={{ color: '#00e676', margin: 0 }}>Step 4: Complete Equation!</h4>
                <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: '#00e5ff', margin: '8px 0' }}>
                  y = 2x + 1
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => { playClick(); setBeat('challenges'); }}
                >
                  <span>Proceed to Equation Challenges</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Challenge Rounds */}
      {beat === 'challenges' && (
        <div className="station-content-layout">
          <div className="simulation-canvas-column">
            <CoordinatePlane
              width={320}
              height={320}
              range={8}
              points={currentChallenge.points}
              line={{ m: currentChallenge.targetM, c: currentChallenge.targetC }}
              showIntercept={true}
              readOnly={true}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="phase-tag">Challenge {roundIdx + 1} of 3</span>
              <Mascot mood="curious" size="small" />
            </div>

            <h3 style={{ color: '#ffd54f', fontFamily: 'var(--font-display)', margin: 0 }}>
              {currentChallenge.title}
            </h3>

            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              {currentChallenge.hint}
            </p>

            {/* Display Box for Typed Equation */}
            <div className="numpad-display-box" style={{ minHeight: 52 }}>
              {inputEq || <span style={{ opacity: 0.4 }}>Assemble equation...</span>}
            </div>

            {/* Tile Tray */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['y', '=', 'x', '+', '-', '1', '2', '3', '4', '5'].map((tok) => (
                <button
                  key={tok}
                  className="chip-btn"
                  onClick={() => handleTileClick(tok)}
                  style={{ minWidth: 40, height: 40, fontSize: '1.1rem' }}
                >
                  {tok}
                </button>
              ))}
              <button
                className="chip-btn"
                onClick={handleClear}
                style={{ background: 'rgba(239, 83, 80, 0.25)', borderColor: '#ef5350' }}
              >
                Clear
              </button>
            </div>

            {errorMsg && (
              <span style={{ color: '#ef5350', fontSize: '0.85rem' }}>{errorMsg}</span>
            )}

            <button
              className="btn btn-primary"
              onClick={handleCheckEquation}
              disabled={!inputEq.trim()}
            >
              <CheckCircle size={18} />
              <span>Check Equation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
