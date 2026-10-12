import React from 'react';

const PHASE_CARDS = [
  {
    id: 'wonder',
    emoji: '🤔',
    title: 'Wonder',
    subtitle: 'Sarah’s Drone Climb Mystery!',
  },
  {
    id: 'story',
    emoji: '📖',
    title: 'Story',
    subtitle: 'The Straight Line Squad',
  },
  {
    id: 'simulate',
    emoji: '🧪',
    title: 'Simulate',
    subtitle: '4 Interactive Line Stations',
  },
  {
    id: 'practice',
    emoji: '🎮',
    title: 'Practice',
    subtitle: '100 Random Challenges',
  },
  {
    id: 'reflect',
    emoji: '📓',
    title: 'Reflect',
    subtitle: 'Badges & Slope Journal',
  },
];

export default function IntroScreen({ onStart, onSelectPhase }) {
  return (
    <div className="intro-screen-layout">
      {/* Top Grade Pill */}
      <div className="grade-badge-pill">
        <span>✨ Grade 8 Math • Linear Geometry</span>
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="hero-main-title">Global Line Riders — Straight Lines</h1>
      <h2 className="hero-subtitle">Slope, Intercepts, y = mx + c &amp; Linear Models!</h2>

      {/* Intro Description Box */}
      <div className="hero-description-box">
        <p>
          Master slope as steepness, the y-intercept as where journeys begin, and <strong>y = mx + c</strong> as the rule that predicts paths! Join the global Straight Line Squad across 10 world cities to calculate coordinates and rescue weather drone Skylark. 📈🌍
        </p>
      </div>

      {/* 5 Phase Cards Row */}
      <div className="phase-cards-row">
        {PHASE_CARDS.map((card) => (
          <div
            key={card.id}
            className="home-phase-card"
            onClick={() => (onSelectPhase ? onSelectPhase(card.id) : onStart())}
          >
            <div className="phase-card-emoji">{card.emoji}</div>
            <h3 className="phase-card-title">{card.title}</h3>
            <span className="phase-card-subtitle">{card.subtitle}</span>
          </div>
        ))}
      </div>

      {/* Main CTA Button */}
      <button className="btn-begin-journey" onClick={onStart}>
        <span className="rocket-icon">🚀</span>
        <span>Begin Your Journey!</span>
      </button>

      {/* Bottom Feature Tags */}
      <div className="bottom-feature-tags">
        <div className="feature-tag-pill">
          <span>🎯 100 Random Questions</span>
        </div>
        <div className="feature-tag-pill">
          <span>📐 4 Simulation Stations</span>
        </div>
        <div className="feature-tag-pill">
          <span>🏆 8 Badges &amp; XP Streak</span>
        </div>
      </div>
    </div>
  );
}
