import React, { useState } from 'react';
import { CheckCircle, ArrowRight, HelpCircle, Sparkles, RotateCcw } from 'lucide-react';
import CoordinatePlane from '../shared/CoordinatePlane';
import Mascot from '../Mascot';
import { calcSlope } from '../../engine/lineMath';
import { Frac } from '../../engine/frac';
import { playChime, playBuzz, playClick } from '../../utils/audio';

const ROUNDS = [
  {
    targetM: new Frac(2, 1),
    instruction: 'Drag Point B to make a line with slope m = 2 (Rise = 2 for every Run = 1).',
    initialB: { x: 3, y: 1 },
  },
  {
    targetM: new Frac(-2, 1),
    instruction: 'Drag Point B to make a downhill line with negative slope m = -2.',
    initialB: { x: 2, y: 2 },
  },
  {
    targetM: new Frac(1, 2),
    instruction: 'Drag Point B to make a gentle ramp with fractional slope m = 1/2 (Rise = 1, Run = 2).',
    initialB: { x: 2, y: 4 },
  },
];

export default function SlopeExplorerStation({ onComplete, audioEnabled }) {
  const [beat, setBeat] = useState('learn'); // 'learn' | 'guided' | 'challenges'
  const [roundIdx, setRoundIdx] = useState(0);

  // Points for guided try & challenges
  const [points, setPoints] = useState([
    { x: 0, y: 0 },
    { x: 2, y: 4 },
  ]);

  const p1 = points[0];
  const p2 = points[1];
  const currentSlope = calcSlope(p1.x, p1.y, p2.x, p2.y);
  const slopeNum = currentSlope ? currentSlope.toNumber() : 0;
  const slopeDisplay = currentSlope ? currentSlope.toString() : 'Undefined (Vertical)';

  const currentRound = ROUNDS[roundIdx];
  const isTargetMatched = currentSlope && currentRound && currentSlope.equals(currentRound.targetM);

  const handlePointMove = (idx, newPt) => {
    const updated = [...points];
    updated[idx] = newPt;
    setPoints(updated);
  };

  const handleCheckChallenge = () => {
    if (isTargetMatched) {
      playChime();
      if (roundIdx < ROUNDS.length - 1) {
        setRoundIdx((prev) => prev + 1);
        setPoints([
          { x: 0, y: 0 },
          ROUNDS[roundIdx + 1].initialB,
        ]);
      } else {
        onComplete();
      }
    } else {
      playBuzz();
    }
  };

  return (
    <div className="station-workspace-card glass-card">
      {/* Beat Navigation Tabs */}
      <div className="station-beat-nav">
        <button
          className={`beat-tab-btn ${beat === 'learn' ? 'active' : ''}`}
          onClick={() => { playClick(); setBeat('learn'); }}
        >
          1. Learn Concept
        </button>
        <button
          className={`beat-tab-btn ${beat === 'guided' ? 'active' : ''}`}
          onClick={() => { playClick(); setBeat('guided'); }}
        >
          2. Guided Try
        </button>
        <button
          className={`beat-tab-btn ${beat === 'challenges' ? 'active' : ''}`}
          onClick={() => { playClick(); setBeat('challenges'); }}
        >
          3. Challenges ({roundIdx + 1}/3)
        </button>
      </div>

      {/* 1. Learn Concept Card */}
      {beat === 'learn' && (
        <div className="station-content-layout">
          <div className="rule-card-container">
            <h3 className="rule-card-title">📐 Mike’s Skatepark Ramp: What is Slope?</h3>
            <div className="rule-card-symbolic">
              Slope (m) = Rise ÷ Run = (y₂ − y₁) ÷ (x₂ − x₁)
            </div>
            <p className="rule-card-explanation">
              <strong>Slope</strong> measures how steep a straight line is.
              <br /><br />
              • <strong>Rise</strong>: The vertical change going up (positive) or down (negative).
              <br />
              • <strong>Run</strong>: The horizontal change going across from left to right.
              <br />
              • <strong>Positive Slope (↗)</strong>: Uphill climb.
              <br />
              • <strong>Negative Slope (↘)</strong>: Downhill descent.
              <br />
              • <strong>Zero Slope (→)</strong>: Completely flat horizontal line (y = k).
              <br />
              • <strong>Undefined Slope (↑)</strong>: Vertical wall (x = h, run = 0).
            </p>
            <div style={{ marginTop: 20 }}>
              <button
                className="btn btn-primary"
                onClick={() => { playClick(); setBeat('guided'); }}
              >
                <span>Try the Guided Interactive Grid</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="simulation-canvas-column">
            <CoordinatePlane
              width={300}
              height={300}
              range={6}
              points={[{ x: 0, y: 0 }, { x: 4, y: 2 }]}
              showStaircase={true}
              readOnly={true}
            />
            <div className="formula-panel-card" style={{ width: '100%' }}>
              <div className="formula-row highlight-row">
                <span className="formula-label">Demo Ramp:</span>
                <span className="formula-value">Rise = 2, Run = 4 → Slope = 2/4 = 1/2</span>
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
              range={7}
              points={points}
              onPointMove={handlePointMove}
              interactivePointIndex={1}
              showStaircase={true}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Drag Point B (gold dot) around the grid to watch Rise, Run, and Slope change!
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="formula-panel-card">
              <div className="formula-row">
                <span className="formula-label">Point A (fixed base):</span>
                <span className="formula-value">({p1.x}, {p1.y})</span>
              </div>
              <div className="formula-row">
                <span className="formula-label">Point B (dragged):</span>
                <span className="formula-value">({p2.x}, {p2.y})</span>
              </div>
              <div className="formula-row">
                <span className="formula-label">Vertical Rise (y₂ − y₁):</span>
                <span className="formula-value">{p2.y - p1.y}</span>
              </div>
              <div className="formula-row">
                <span className="formula-label">Horizontal Run (x₂ − x₁):</span>
                <span className="formula-value">{p2.x - p1.x}</span>
              </div>
              <div className="formula-row highlight-row">
                <span className="formula-label">Calculated Slope m:</span>
                <span className="formula-value" style={{ color: '#00e5ff', fontSize: '1.2rem' }}>
                  {slopeDisplay}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Mascot mood={slopeNum > 0 ? 'happy' : slopeNum < 0 ? 'curious' : 'idle'} slope={slopeNum} size="small" />
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Notice Grady's antenna! It tilts exactly to match the slope of your line on screen.
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => { playClick(); setBeat('challenges'); }}
            >
              <span>Ready for Challenge Rounds!</span>
              <ArrowRight size={16} />
            </button>
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
              range={7}
              points={points}
              onPointMove={handlePointMove}
              interactivePointIndex={1}
              showStaircase={true}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="phase-tag">Round {roundIdx + 1} of 3</span>
              <Mascot mood={isTargetMatched ? 'celebrating' : 'thinking'} slope={slopeNum} size="small" />
            </div>

            <h3 style={{ color: '#ffd54f', fontFamily: 'var(--font-display)', margin: 0 }}>
              {currentRound.instruction}
            </h3>

            <div className="formula-panel-card">
              <div className="formula-row">
                <span className="formula-label">Target Slope:</span>
                <span className="formula-symbolic">m = {currentRound.targetM.toString()}</span>
              </div>
              <div className="formula-row highlight-row">
                <span className="formula-label">Your Current Slope:</span>
                <span className="formula-value" style={{ color: isTargetMatched ? '#00e676' : '#00e5ff' }}>
                  m = {slopeDisplay}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn btn-primary"
                onClick={handleCheckChallenge}
                disabled={!isTargetMatched}
                style={{ flex: 1 }}
              >
                {isTargetMatched ? (
                  <>
                    <CheckCircle size={18} />
                    <span>{roundIdx < ROUNDS.length - 1 ? 'Correct! Next Round' : 'Complete Station A! ✓'}</span>
                  </>
                ) : (
                  <span>Adjust Point B to Match</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
