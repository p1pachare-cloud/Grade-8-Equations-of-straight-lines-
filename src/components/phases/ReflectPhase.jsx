import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import Mascot from '../Mascot';
import { BADGES } from '../../utils/badgeEngine';
import { getArchitectTitle } from '../../utils/scoring';
import { reflectNarration } from '../../utils/narration';
import { narrate, playChime } from '../../utils/audio';

export default function ReflectPhase({
  onRestart,
  audioEnabled,
  xp,
  worldScores = [],
  unlockedBadges = [],
}) {
  const [reflectionText, setReflectionText] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    narrate(reflectNarration(), audioEnabled);
  }, [audioEnabled]);

  const handleSaveJournal = () => {
    playChime();
    setSaved(true);
  };

  const totalCorrect = worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
  const navigatorTitle = getArchitectTitle(xp);

  return (
    <div className="phase-container reflect-phase">
      <div className="glass-card phase-card">
        <div className="phase-header">
          <div>
            <span className="phase-tag">PHASE 5 — REFLECT</span>
            <h2>Lesson Completion &amp; Linear Navigator Journal</h2>
          </div>
          <span style={{ color: '#ffd54f', fontWeight: 800 }}>
            Skylark Weather Drone Rescued! 🚁✨
          </span>
        </div>

        {/* Certificate Card */}
        <div className="completion-certificate-card glass-card">
          <div className="cert-header">
            <Mascot mood="celebrating" size="large" />
            <div>
              <span className="phase-tag" style={{ background: 'rgba(255,193,7,0.2)', color: '#ffd54f' }}>
                {navigatorTitle}
              </span>
              <h1 className="cert-title">Master Line Navigator!</h1>
              <p className="cert-subtitle">Equation of Straight Lines — Grade 8 Mathematics</p>
            </div>
          </div>

          <div className="cert-stats-row">
            <div className="cert-stat-box">
              <span className="stat-value">{xp}</span>
              <span className="stat-label">Total XP Earned</span>
            </div>
            <div className="cert-stat-box">
              <span className="stat-value">{totalCorrect}/100</span>
              <span className="stat-label">Questions Correct</span>
            </div>
            <div className="cert-stat-box">
              <span className="stat-value">{unlockedBadges.length}/{BADGES.length}</span>
              <span className="stat-label">Badges Unlocked</span>
            </div>
          </div>

          {/* Badges Panel */}
          <div className="badges-grid-container">
            <h3 style={{ fontFamily: 'var(--font-display)', color: '#ffd54f', fontSize: '1.3rem' }}>
              🏅 Linear Geometry Badges
            </h3>
            <div className="badges-flex-row">
              {BADGES.map((badge) => {
                const isUnlocked = unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`badge-chip-card ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`}
                    title={badge.description}
                  >
                    <span>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reflection Journal Prompt */}
          <div className="reflection-journal-box">
            <h3 style={{ fontFamily: 'var(--font-display)', color: '#ffd54f', fontSize: '1.25rem' }}>
              📓 Navigator's Flight Journal
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              "Pick one straight line concept you discovered today (slope as rise over run, y-intercept as starting value, y = mx + c, parallel lines having equal slopes, or perpendicular lines having negative reciprocal slopes). Explain why it works in your own words, or where you would use it in engineering, drone navigation, or architecture!"
            </p>
            <textarea
              className="journal-textarea"
              rows="4"
              placeholder="Write your reflections here..."
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button
                className="btn btn-primary"
                onClick={handleSaveJournal}
                disabled={!reflectionText.trim() || saved}
              >
                {saved ? <CheckCircle2 size={16} /> : <Sparkles size={16} />}
                <span>{saved ? 'Journal Saved! ✓' : 'Save to Journal'}</span>
              </button>
            </div>
          </div>

          {/* Restart Journey Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <button className="btn btn-secondary" onClick={onRestart}>
              <RotateCcw size={16} />
              <span>Restart Straight Line Journey</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
