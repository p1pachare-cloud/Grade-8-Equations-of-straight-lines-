import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Box, Image as ImageIcon } from 'lucide-react';
import Mascot from '../Mascot';
import { STORY_PANELS } from '../../data/storyContent';
import { getStoryNarration } from '../../utils/narration';
import { narrate } from '../../utils/audio';

export default function StoryPhase({ onNext, audioEnabled }) {
  const [panelIndex, setPanelIndex] = useState(0);
  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' | 'model'
  const panel = STORY_PANELS[panelIndex];

  useEffect(() => {
    narrate(getStoryNarration(panelIndex), audioEnabled);
  }, [panelIndex, audioEnabled]);

  const handleNext = () => {
    if (panelIndex < STORY_PANELS.length - 1) {
      setPanelIndex((prev) => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrev = () => {
    if (panelIndex > 0) {
      setPanelIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="phase-container story-phase">
      <div className="glass-card phase-card">
        <div className="phase-header">
          <div>
            <span className="phase-tag">PHASE 2 — STORY</span>
            <h2>The Straight Line Squad</h2>
          </div>

          <div className="panel-dots">
            {STORY_PANELS.map((p, idx) => (
              <button
                key={p.id}
                className={`panel-dot ${idx === panelIndex ? 'active' : ''}`}
                onClick={() => setPanelIndex(idx)}
                title={`Panel ${idx + 1}: ${p.title}`}
              />
            ))}
          </div>
        </div>

        <div className="story-content-wrapper">
          {/* Visual Showcase Card */}
          <div className="story-visual-card">
            <div className="story-card-top-bar">
              <div className="story-location-badge">
                <MapPin size={16} />
                <span>{panel.location}</span>
              </div>

              <div className="panel-counter-badge">
                <span>Panel {panelIndex + 1} of 6</span>
              </div>
            </div>

            {/* Visual Graphic Representation */}
            <div className="visual-graphic-container">
              {panel.visualType === 'worldMap' && (
                <svg width="300" height="220" viewBox="0 0 300 220">
                  <ellipse cx="150" cy="110" rx="130" ry="85" fill="none" stroke="#283593" strokeWidth="2" strokeDasharray="5,5" />
                  <ellipse cx="150" cy="110" rx="90" ry="55" fill="none" stroke="#3f51b5" strokeWidth="1.5" />
                  {/* Glowing Character Pins */}
                  {[
                    { x: 60, y: 80, label: 'John (Toronto)' },
                    { x: 80, y: 100, label: 'Mike (New York)' },
                    { x: 140, y: 70, label: 'Sarah (London)' },
                    { x: 155, y: 85, label: 'Sofia (Madrid)' },
                    { x: 170, y: 110, label: 'Aisha (Cairo)' },
                    { x: 230, y: 90, label: 'Yuki (Tokyo)' },
                    { x: 210, y: 120, label: 'Priya (Mumbai)' },
                    { x: 160, y: 160, label: 'Noah (Nairobi)' },
                    { x: 100, y: 170, label: 'Diego (Buenos Aires)' },
                    { x: 260, y: 170, label: 'Emma (Sydney)' },
                  ].map((pin, i) => (
                    <g key={i}>
                      <circle cx={pin.x} cy={pin.y} r="5" fill="#00e5ff" />
                      <circle cx={pin.x} cy={pin.y} r="8" fill="none" stroke="#00e5ff" strokeWidth="1" strokeDasharray="2,2" />
                    </g>
                  ))}
                  <text x="150" y="115" fill="#ffd54f" textAnchor="middle" fontSize="14" fontWeight="bold">
                    The Straight Line Squad
                  </text>
                </svg>
              )}

              {panel.visualType === 'droneSignal' && (
                <svg width="300" height="220" viewBox="0 0 300 220">
                  <rect x="20" y="20" width="260" height="180" rx="12" fill="#0d0a2d" stroke="#00e5ff" strokeWidth="2" />
                  {/* Drone SVG */}
                  <circle cx="150" cy="90" r="18" fill="#ffd54f" />
                  <line x1="120" y1="80" x2="180" y2="100" stroke="#00e5ff" strokeWidth="3" />
                  <line x1="120" y1="100" x2="180" y2="80" stroke="#00e5ff" strokeWidth="3" />
                  <circle cx="120" cy="80" r="6" fill="#ff4081" />
                  <circle cx="180" cy="80" r="6" fill="#ff4081" />
                  <circle cx="120" cy="100" r="6" fill="#ff4081" />
                  <circle cx="180" cy="100" r="6" fill="#ff4081" />
                  <text x="150" y="145" fill="#ffffff" textAnchor="middle" fontSize="13" fontWeight="bold">
                    📡 Skylark Drone Beacon Signal
                  </text>
                  <text x="150" y="170" fill="#ef5350" textAnchor="middle" fontSize="12" fontWeight="bold">
                    ⚠️ Battery at 30% · Linear Flight Path
                  </text>
                </svg>
              )}

              {panel.visualType === 'skateboardRamp' && (
                <svg width="300" height="220" viewBox="0 0 300 220">
                  <polygon points="50,170 250,170 250,70" fill="rgba(0,229,255,0.15)" stroke="#00e5ff" strokeWidth="3" />
                  <line x1="50" y1="170" x2="250" y2="70" stroke="#ffd54f" strokeWidth="4" strokeLinecap="round" />
                  <text x="150" y="195" fill="#00e5ff" textAnchor="middle" fontSize="13" fontWeight="bold">
                    Run = 6 m
                  </text>
                  <text x="270" y="125" fill="#ffd54f" textAnchor="middle" fontSize="13" fontWeight="bold">
                    Rise = 3 m
                  </text>
                  <text x="130" y="110" fill="#ffffff" textAnchor="middle" fontSize="14" fontWeight="bold">
                    Slope = 3 / 6 = 1/2
                  </text>
                </svg>
              )}

              {panel.visualType === 'taxiFare' && (
                <svg width="300" height="220" viewBox="0 0 300 220">
                  <line x1="50" y1="180" x2="250" y2="180" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                  <line x1="50" y1="180" x2="50" y2="30" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                  <line x1="50" y1="140" x2="230" y2="50" stroke="#00e5ff" strokeWidth="3" />
                  <circle cx="50" cy="140" r="7" fill="#ffd54f" />
                  <text x="58" y="135" fill="#ffd54f" fontSize="12" fontWeight="bold">
                    (0, 3) Starting Fare c = £3
                  </text>
                  <text x="160" y="80" fill="#00e5ff" fontSize="13" fontWeight="bold">
                    y = 2x + 3 (+£2/km)
                  </text>
                </svg>
              )}

              {panel.visualType === 'trainAndGrid' && (
                <svg width="300" height="220" viewBox="0 0 300 220">
                  {/* Parallel Tracks */}
                  <line x1="30" y1="140" x2="130" y2="50" stroke="#00e5ff" strokeWidth="3" />
                  <line x1="50" y1="160" x2="150" y2="70" stroke="#00e5ff" strokeWidth="3" />
                  <text x="80" y="180" fill="#00e5ff" fontSize="11" fontWeight="bold">
                    Parallel: m₁ = m₂
                  </text>

                  {/* Perpendicular Intersect */}
                  <line x1="180" y1="150" x2="270" y2="60" stroke="#ffd54f" strokeWidth="3" />
                  <line x1="190" y1="60" x2="280" y2="150" stroke="#ff4081" strokeWidth="3" />
                  <rect x="227" y="100" width="10" height="10" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="230" y="180" fill="#ffd54f" fontSize="11" fontWeight="bold">
                    Perpendicular: m₁ × m₂ = −1
                  </text>
                </svg>
              )}

              {panel.visualType === 'rescuePlot' && (
                <svg width="300" height="220" viewBox="0 0 300 220">
                  <line x1="40" y1="180" x2="260" y2="180" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <line x1="40" y1="180" x2="40" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <line x1="40" y1="150" x2="220" y2="40" stroke="#00e5ff" strokeWidth="3" strokeDasharray="4,4" />
                  <circle cx="40" cy="150" r="7" fill="#ffd54f" />
                  <circle cx="160" cy="77" r="7" fill="#00e676" />
                  <text x="50" y="145" fill="#ffd54f" fontSize="12" fontWeight="bold">A (0, 2)</text>
                  <text x="170" y="75" fill="#00e676" fontSize="12" fontWeight="bold">B (4, 10)</text>
                  <text x="130" y="125" fill="#ffffff" fontSize="13" fontWeight="bold">
                    Path: y = 2x + 2
                  </text>
                </svg>
              )}
            </div>
          </div>

          {/* Story Text Card */}
          <div className="story-text-card">
            <h3 className="story-title">{panel.title}</h3>

            <div className="story-dialog-box">
              <p style={{ margin: 0 }}>{panel.dialogue}</p>
            </div>

            <div className="story-mascot-companion">
              <Mascot mood="curious" size="small" />
              <span className="mascot-whisper-text">{panel.whisper}</span>
            </div>

            <div className="story-actions-row">
              <button
                className="btn btn-secondary"
                onClick={handlePrev}
                disabled={panelIndex === 0}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>

              <button className="btn btn-primary" onClick={handleNext}>
                <span>{panelIndex === STORY_PANELS.length - 1 ? 'Enter Simulation Lab' : 'Next Panel'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
