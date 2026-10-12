import React, { useState } from 'react';
import { CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import CoordinatePlane from '../shared/CoordinatePlane';
import Mascot from '../Mascot';
import { formatEquation } from '../../engine/lineMath';
import { playChime, playBuzz, playClick } from '../../utils/audio';

const GHOST_ROUNDS = [
  {
    targetM: 2,
    targetC: 3,
    instruction: 'Round 1: Match the gold dashed line by adjusting the y-intercept slider (c) only!',
    lockM: true,
  },
  {
    targetM: -1,
    targetC: 2,
    instruction: 'Round 2: The y-intercept is set at c = 2. Tilt the line with the slope slider (m) to match!',
    lockC: true,
  },
  {
    targetM: 1.5,
    targetC: -2,
    instruction: 'Round 3: Match both slope (m) and y-intercept (c) to cover the gold ghost line!',
    lockM: false,
    lockC: false,
  },
];

export default function LineLabStation({ onComplete, audioEnabled }) {
  const [beat, setBeat] = useState('learn'); // 'learn' | 'guided' | 'challenges'
  const [roundIdx, setRoundIdx] = useState(0);

  // Sliders for m and c
  const [m, setM] = useState(1);
  const [c, setC] = useState(0);

  const currentRound = GHOST_ROUNDS[roundIdx];

  const isMatched =
    currentRound &&
    Math.abs(m - currentRound.targetM) < 0.05 &&
    Math.abs(c - currentRound.targetC) < 0.05;

  const handleNextChallenge = () => {
    if (isMatched) {
      playChime();
      if (roundIdx < GHOST_ROUNDS.length - 1) {
        const next = GHOST_ROUNDS[roundIdx + 1];
        setRoundIdx((prev) => prev + 1);
        if (next.lockM) {
          setM(next.targetM);
          setC(0);
        } else if (next.lockC) {
          setC(next.targetC);
          setM(1);
        } else {
          setM(0);
          setC(0);
        }
      } else {
        onComplete();
      }
    } else {
      playBuzz();
    }
  };

  return (
    <div className="station-workspace-card glass-card">
      {/* Beat Navigation */}
      <div className="station-beat-nav">
        <button
          className={`beat-tab-btn ${beat === 'learn' ? 'active' : ''}`}
          onClick={() => { playClick(); setBeat('learn'); }}
        >
          1. Learn y = mx + c
        </button>
        <button
          className={`beat-tab-btn ${beat === 'guided' ? 'active' : ''}`}
          onClick={() => { playClick(); setBeat('guided'); }}
        >
          2. Guided Try
        </button>
        <button
          className={`beat-tab-btn ${beat === 'challenges' ? 'active' : ''}`}
          onClick={() => {
            playClick();
            setBeat('challenges');
            setM(GHOST_ROUNDS[0].targetM);
            setC(0);
          }}
        >
          3. Ghost Match ({roundIdx + 1}/3)
        </button>
      </div>

      {/* 1. Learn Card */}
      {beat === 'learn' && (
        <div className="station-content-layout">
          <div className="rule-card-container">
            <h3 className="rule-card-title">🧪 Sarah’s Taxi: The Slope-Intercept Equation</h3>
            <div className="rule-card-symbolic">
              y = m x + c
            </div>
            <p className="rule-card-explanation">
              Every straight line on the coordinate plane can be described by this simple rule:
              <br /><br />
              • <strong>m (Slope)</strong>: Controls the <em>tilt</em> or angle. Steep uphill, downhill, or flat.
              <br />
              • <strong>c (y-intercept)</strong>: The starting point where the line crosses the y-axis at (0, c).
              <br /><br />
              Sarah’s taxi has an initial base fare of £3 and increases by £2 per kilometre:
              <strong> y = 2x + 3</strong>!
            </p>
            <div style={{ marginTop: 20 }}>
              <button
                className="btn btn-primary"
                onClick={() => { playClick(); setBeat('guided'); }}
              >
                <span>Experiment with Sliders</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="simulation-canvas-column">
            <CoordinatePlane
              width={300}
              height={300}
              range={8}
              line={{ m: 2, c: 3 }}
              showIntercept={true}
              readOnly={true}
            />
            <div className="formula-panel-card" style={{ width: '100%' }}>
              <div className="formula-row highlight-row">
                <span className="formula-label">Taxi Equation:</span>
                <span className="formula-value">y = 2x + 3 · Intercept at (0, 3)</span>
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
              showIntercept={true}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Watch how m tilts the line around (0, c) and c slides the entire line up and down!
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Sliders Panel */}
            <div className="sim-controls-panel">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Slope (m):</span>
                  <span style={{ color: '#00e5ff', fontWeight: 800 }}>m = {m}</span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.5"
                  value={m}
                  onChange={(e) => { playClick(); setM(Number(e.target.value)); }}
                  className="slider-input"
                />
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>y-intercept (c):</span>
                  <span style={{ color: '#ffd54f', fontWeight: 800 }}>c = {c}</span>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={c}
                  onChange={(e) => { playClick(); setC(Number(e.target.value)); }}
                  className="slider-input"
                />
              </div>
            </div>

            <div className="formula-panel-card">
              <div className="formula-row highlight-row">
                <span className="formula-label">Current Equation:</span>
                <span className="formula-value" style={{ fontSize: '1.25rem' }}>
                  {formatEquation(m, c)}
                </span>
              </div>
              <div className="formula-row">
                <span className="formula-label">Crosses Y-Axis at:</span>
                <span className="formula-value" style={{ color: '#ffd54f' }}>(0, {c})</span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => {
                playClick();
                setBeat('challenges');
                setM(GHOST_ROUNDS[0].targetM);
                setC(0);
              }}
            >
              <span>Test Your Skills with Ghost Lines!</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 3. Ghost Line Challenges */}
      {beat === 'challenges' && (
        <div className="station-content-layout">
          <div className="simulation-canvas-column">
            <CoordinatePlane
              width={320}
              height={320}
              range={8}
              line={{ m, c }}
              ghostLine={{ m: currentRound.targetM, c: currentRound.targetC }}
              showIntercept={true}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="phase-tag">Round {roundIdx + 1} of 3</span>
              <Mascot mood={isMatched ? 'celebrating' : 'thinking'} slope={m} size="small" />
            </div>

            <h3 style={{ color: '#ffd54f', fontFamily: 'var(--font-display)', margin: 0 }}>
              {currentRound.instruction}
            </h3>

            {/* Slider Controls */}
            <div className="sim-controls-panel">
              {!currentRound.lockM && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Slope (m):</span>
                    <span style={{ color: '#00e5ff', fontWeight: 800 }}>m = {m}</span>
                  </div>
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="0.5"
                    value={m}
                    onChange={(e) => { playClick(); setM(Number(e.target.value)); }}
                    className="slider-input"
                  />
                </div>
              )}

              {!currentRound.lockC && (
                <div style={{ marginTop: currentRound.lockM ? 0 : 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>y-intercept (c):</span>
                    <span style={{ color: '#ffd54f', fontWeight: 800 }}>c = {c}</span>
                  </div>
                  <input
                    type="range"
                    min="-6"
                    max="6"
                    step="1"
                    value={c}
                    onChange={(e) => { playClick(); setC(Number(e.target.value)); }}
                    className="slider-input"
                  />
                </div>
              )}
            </div>

            <div className="formula-panel-card">
              <div className="formula-row">
                <span className="formula-label">Target Ghost Line:</span>
                <span className="formula-symbolic">
                  {formatEquation(currentRound.targetM, currentRound.targetC)}
                </span>
              </div>
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
                  <span>{roundIdx < GHOST_ROUNDS.length - 1 ? 'Ghost Matched! Next Round' : 'Complete Station B! ✓'}</span>
                </>
              ) : (
                <span>Align Sliders to Match Ghost Line</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
