import React from 'react';
import { Star, Lock, MapPin } from 'lucide-react';
import { WORLDS } from '../../data/worlds';
import { calcStars } from '../../utils/scoring';
import { playClick } from '../../utils/audio';

export default function WorldMap({
  worldScores = [],
  currentWorld = 0,
  onSelectWorld,
}) {
  return (
    <div className="world-map-wrapper">
      <div className="world-map-header">
        <MapPin size={18} color="#00e5ff" />
        <h3>10 Global Worlds · Straight Line Exploration</h3>
      </div>

      <div className="world-scroll-container">
        {WORLDS.map((w, idx) => {
          const score = worldScores[idx];
          const stars = score != null ? calcStars(score) : 0;
          const isActive = idx === currentWorld;
          // Unlocked if first world or previous world scored >= 6
          const isUnlocked = idx === 0 || (worldScores[idx - 1] != null && worldScores[idx - 1] >= 6);

          return (
            <div
              key={w.id}
              className={`world-card-chip ${isActive ? 'active-world' : ''} ${!isUnlocked ? 'locked' : ''}`}
              onClick={() => {
                if (isUnlocked) {
                  playClick();
                  onSelectWorld(idx);
                }
              }}
              title={isUnlocked ? `World ${w.id}: ${w.name}` : `Unlock by scoring ≥ 6 in World ${w.id - 1}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="world-num-badge">World {w.id}</span>
                {!isUnlocked && <Lock size={12} color="rgba(255,255,255,0.4)" />}
              </div>

              <div className="world-landmark-title">{w.landmark}</div>
              <div className="world-country-name">{w.name}</div>

              <div className="world-stars-row">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    size={13}
                    className={s <= stars ? 'star-filled' : 'star-empty'}
                  />
                ))}
                {score != null && (
                  <span style={{ fontSize: '0.72rem', marginLeft: 6, color: 'var(--text-muted)' }}>
                    {score}/10
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
