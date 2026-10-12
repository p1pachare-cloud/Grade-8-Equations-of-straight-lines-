import React, { useState, useEffect } from 'react';
import { ArrowRight, HelpCircle } from 'lucide-react';
import Mascot from '../Mascot';
import CoordinatePlane from '../shared/CoordinatePlane';
import { wonderNarration } from '../../utils/narration';
import { narrate, playClick, playChime } from '../../utils/audio';

export default function WonderPhase({ onNext, audioEnabled }) {
  const [seconds, setSeconds] = useState(3);
  const [revealed, setRevealed] = useState(false);

  // Height formula: y = 3x + 2
  const currentHeight = 3 * seconds + 2;

  // Build points array for t=0 up to current seconds
  const dronePoints = [];
  for (let t = 0; t <= seconds; t++) {
    dronePoints.push({ x: t, y: 3 * t + 2 });
  }

  useEffect(() => {
    narrate(wonderNarration(), audioEnabled);
  }, [audioEnabled]);

  const handleReveal = () => {
    playChime();
    setRevealed(true);
  };

  return (
    <div className="phase-container wonder-phase">
      <div className="glass-card phase-card">
        <div className="phase-header">
          <div>
            <span className="phase-tag">PHASE 1 — WONDER</span>
            <h2>The Mystery of the Climbing Weather Drone</h2>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            London, United Kingdom 🇬🇧
          </span>
        </div>

        <div className="wonder-content-grid">
          {/* Visual Interactive Panel */}
          <div className="wonder-visual-panel">
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffd54f' }}>
              Sarah’s Drone Launch Pad · Rooftop at 2 Metres
            </span>

            {/* Coordinate Plane showing climbing points */}
            <CoordinatePlane
              width={300}
              height={300}
              range={10}
              points={dronePoints}
              line={{ m: 3, c: 2 }}
              showIntercept={true}
              readOnly={true}
            />

            {/* Time Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '90%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Flight Time (seconds):</span>
                <span style={{ color: '#00e5ff', fontWeight: 800 }}>{seconds} s (Height: {currentHeight} m)</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={seconds}
                onChange={(e) => {
                  playClick();
                  setSeconds(Number(e.target.value));
                }}
                className="slider-input"
              />
            </div>
          </div>

          {/* Wonder Story Hook & Question Card */}
          <div className="wonder-text-panel">
            <div className="wonder-speech-bubble">
              <p className="wonder-lead-text">
                "Sarah's weather drone takes off from a London rooftop that is <strong>two metres high</strong>. Every second, it climbs <strong>three metres</strong>."
              </p>
              <p className="wonder-question-text" style={{ color: '#ffd54f', fontSize: '1.2rem', marginTop: 10 }}>
                🤔 How high will the drone be after ten seconds? Can we predict its height without measuring every second?
              </p>
            </div>

            <div className="mystery-angle-box glass-card" style={{ padding: 18, textAlign: 'center' }}>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', display: 'block' }}>
                Drone Height at 10 Seconds:
              </span>
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#00e5ff', margin: '8px 0' }}>
                {revealed ? '32 metres!' : '? metres'}
              </div>
              {!revealed ? (
                <button className="btn btn-secondary" onClick={handleReveal} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                  <HelpCircle size={16} />
                  <span>Peek at the Linear Rule</span>
                </button>
              ) : (
                <p style={{ fontSize: '0.88rem', color: '#81c784', margin: 0 }}>
                  Equation: y = 3x + 2 → at x = 10, y = 3(10) + 2 = <strong>32 metres</strong>!
                </p>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Mascot mood={revealed ? 'happy' : 'thinking'} size="small" />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Grady: "A straight line connects starting height and climbing speed!"
                </span>
              </div>

              <button className="btn btn-primary" onClick={onNext}>
                <span>Enter The Story</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
