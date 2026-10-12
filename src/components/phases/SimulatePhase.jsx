import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { STATIONS } from '../../data/stationContent';
import SlopeExplorerStation from '../simulations/SlopeExplorerStation';
import LineLabStation from '../simulations/LineLabStation';
import EquationBuilderStation from '../simulations/EquationBuilderStation';
import StreetPlannerStation from '../simulations/StreetPlannerStation';
import Mascot from '../Mascot';

export default function SimulatePhase({
  onNext,
  audioEnabled,
  completedStations = [false, false, false, false],
  setCompletedStations,
  onSimulationsComplete,
}) {
  const [stationIdx, setStationIdx] = useState(0);

  const handleStationComplete = (index) => {
    const updated = [...completedStations];
    updated[index] = true;
    if (setCompletedStations) setCompletedStations(updated);

    if (index < 3) {
      setStationIdx(index + 1);
    } else {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {}
      if (onSimulationsComplete) onSimulationsComplete();
    }
  };

  const allDone = completedStations.every(Boolean);

  return (
    <div className="phase-container simulate-phase-curious">
      <div className="glass-card simulate-main-card">
        {/* Phase Header */}
        <div className="simulate-phase-top-bar">
          <div className="simulate-title-group">
            <span className="phase-tag">PHASE 3 — SIMULATE</span>
            <h2 className="simulate-main-title">The Straight Line Engineering Lab</h2>
            <p className="simulate-tagline">
              Master the 4 core linear geometry discoveries! Complete all stations to unlock Practice and the Line Builder badge.
            </p>
          </div>

          {/* 4 Stations Hub Tabs */}
          <div className="simulate-stations-hub" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {STATIONS.map((st, i) => {
              const isActive = i === stationIdx;
              const isDone = completedStations[i];
              return (
                <div
                  key={st.id}
                  className={`station-hub-card ${isActive ? 'is-active-station' : ''} ${isDone ? 'is-station-done' : ''}`}
                  onClick={() => {
                    setStationIdx(i);
                  }}
                >
                  <div className="station-card-icon-row">
                    <span className="station-icon-badge">{st.icon}</span>
                    <span className="station-tag-label">{st.tag}</span>
                    {isDone && <CheckCircle size={16} className="done-check-icon" />}
                  </div>
                  <h4 className="station-hub-name">{st.name}</h4>
                  <p className="station-hub-desc">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Station Stage */}
        <div className="simulation-active-stage">
          {completedStations[stationIdx] && stationIdx < 3 && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.2) 0%, rgba(24, 20, 72, 0.9) 100%)',
                border: '1.5px solid #00e676',
                borderRadius: 16,
                padding: '14px 20px',
                marginBottom: 18,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={22} color="#00e676" />
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
                  🎉 {STATIONS[stationIdx]?.name} Complete! Ready for the next simulation?
                </span>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const nextIdx = stationIdx + 1;
                  setStationIdx(nextIdx);
                }}
                style={{
                  padding: '10px 22px',
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #00e676 0%, #00e5ff 100%)',
                  color: '#0a0a2e',
                  fontWeight: 900,
                }}
              >
                <span>Go to Next Simulation ({STATIONS[stationIdx + 1]?.name})</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {stationIdx === 0 && (
            <SlopeExplorerStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(0)}
            />
          )}

          {stationIdx === 1 && (
            <LineLabStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(1)}
            />
          )}

          {stationIdx === 2 && (
            <EquationBuilderStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(2)}
            />
          )}

          {stationIdx === 3 && (
            <StreetPlannerStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(3)}
            />
          )}
        </div>

        {/* Bottom Practice Navigation Bar */}
        <div className="simulation-bottom-bar glass-card" style={{ marginTop: 24, padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Mascot mood={allDone ? 'celebrating' : 'encouraging'} size="small" />
            <div>
              <h4 style={{ color: '#ffd54f', margin: 0 }}>
                {allDone ? 'All 4 Stations Completed! 🎓' : `Station ${stationIdx + 1} of 4: ${STATIONS[stationIdx]?.name}`}
              </h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {allDone
                  ? 'You hold the Line Builder badge! Practice Phase is ready.'
                  : `${completedStations.filter(Boolean).length}/4 Stations completed. Finish all to unlock Practice!`
                }
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {stationIdx < 3 && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  const nextIdx = stationIdx + 1;
                  setStationIdx(nextIdx);
                }}
                style={{
                  background: completedStations[stationIdx]
                    ? 'linear-gradient(135deg, #00e676 0%, #00e5ff 100%)'
                    : 'linear-gradient(135deg, #00e5ff 0%, #3f51b5 100%)',
                  color: completedStations[stationIdx] ? '#0a0a2e' : '#ffffff',
                  fontWeight: 800,
                  boxShadow: '0 4px 16px rgba(0, 229, 255, 0.4)',
                }}
              >
                <span>Go to Next Simulation ({STATIONS[stationIdx + 1]?.name})</span>
                <ArrowRight size={18} />
              </button>
            )}

            <button className="btn btn-secondary" onClick={onNext} style={{ minWidth: 170 }}>
              <span>{allDone ? 'Enter Practice Phase' : 'Skip to Practice Phase'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
