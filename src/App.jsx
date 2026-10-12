import React, { useState, useEffect, useCallback } from 'react';
import { Home, Volume2, VolumeX } from 'lucide-react';
import FloatingGeometry from './components/FloatingGeometry';
import JourneyBar from './components/JourneyBar';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import PracticePhase from './components/phases/PracticePhase';
import ReflectPhase from './components/phases/ReflectPhase';
import { checkBadges } from './utils/badgeEngine';
import { stopNarration, playClick } from './utils/audio';

const STORAGE_KEY = 'intellia_straight_lines_g8_v1';

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [worldScores, setWorldScores] = useState(Array(10).fill(null));
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [completedStations, setCompletedStations] = useState([false, false, false, false]);
  const [slopeMasterCount, setSlopeMasterCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [phaseComplete, setPhaseComplete] = useState({
    wonder: false,
    story: false,
    simulate: false,
    practice: false,
    reflect: false,
  });

  // Stop any voice narration on mount
  useEffect(() => {
    stopNarration();
  }, []);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 86400000) {
          if (parsed.phase) setPhase(parsed.phase);
          if (parsed.xp) setXp(parsed.xp);
          if (parsed.streak) setStreak(parsed.streak);
          if (parsed.maxStreak) setMaxStreak(parsed.maxStreak);
          if (parsed.worldScores) setWorldScores(parsed.worldScores);
          if (parsed.unlockedBadges) setUnlockedBadges(parsed.unlockedBadges);
          if (parsed.phaseComplete) setPhaseComplete(parsed.phaseComplete);
          if (parsed.completedStations) setCompletedStations(parsed.completedStations);
          if (parsed.slopeMasterCount) setSlopeMasterCount(parsed.slopeMasterCount);
        }
      }
    } catch (e) {
      console.warn('Session restore failed:', e);
    }
  }, []);

  // Save session state on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          phase,
          xp,
          streak,
          maxStreak,
          worldScores,
          unlockedBadges,
          phaseComplete,
          completedStations,
          slopeMasterCount,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.warn('Session save failed:', e);
    }
  }, [
    phase,
    xp,
    streak,
    maxStreak,
    worldScores,
    unlockedBadges,
    phaseComplete,
    completedStations,
    slopeMasterCount,
  ]);

  // Check and unlock badges automatically
  useEffect(() => {
    const currentState = {
      phaseComplete,
      completedStations,
      worldScores: worldScores.map((s) => s || 0),
      maxStreak,
      badges: unlockedBadges,
      stationAPerfect: completedStations[0],
      slopeMasterCount,
    };
    const newBadges = checkBadges(currentState);
    if (newBadges.length > 0) {
      setUnlockedBadges((prev) => [...prev, ...newBadges]);
    }
  }, [
    phaseComplete,
    completedStations,
    worldScores,
    maxStreak,
    slopeMasterCount,
    unlockedBadges,
  ]);

  const goHome = useCallback(() => {
    stopNarration();
    setPhase('intro');
  }, []);

  const handleNextPhase = (nextPhaseName) => {
    stopNarration();

    if (phase === 'wonder') setPhaseComplete((p) => ({ ...p, wonder: true }));
    if (phase === 'story') setPhaseComplete((p) => ({ ...p, story: true }));
    if (phase === 'simulate') setPhaseComplete((p) => ({ ...p, simulate: true }));
    if (phase === 'practice') setPhaseComplete((p) => ({ ...p, practice: true }));

    setPhase(nextPhaseName);
  };

  const toggleAudio = () => {
    playClick();
    if (audioEnabled) {
      stopNarration();
    }
    setAudioEnabled((prev) => !prev);
  };

  return (
    <div className="app-container">
      <FloatingGeometry />

      {/* Top Left Home Button */}
      {phase !== 'intro' && (
        <button className="home-btn" onClick={goHome} title="Return to Intro">
          <Home size={18} />
          <span>Home</span>
        </button>
      )}

      {/* Top Right Audio Toggle */}
      <button
        className="audio-toggle-btn"
        onClick={toggleAudio}
        title={audioEnabled ? 'Mute Narration' : 'Enable Narration'}
        aria-label="Toggle Audio Narration"
      >
        {audioEnabled ? <Volume2 size={22} color="#ffd54f" /> : <VolumeX size={22} color="#ef5350" />}
      </button>

      {/* Top Journey Bar */}
      <JourneyBar
        currentPhase={phase}
        onSelectPhase={(selectedPhase) => {
          stopNarration();
          setPhase(selectedPhase);
        }}
        completedPhases={phaseComplete}
      />

      {/* Main Content Stage */}
      <main className="main-stage">
        {phase === 'intro' && (
          <IntroScreen
            onStart={() => setPhase('wonder')}
            onSelectPhase={(targetPhase) => {
              stopNarration();
              setPhase(targetPhase);
            }}
          />
        )}

        {phase === 'wonder' && (
          <WonderPhase
            audioEnabled={audioEnabled}
            onNext={() => handleNextPhase('story')}
          />
        )}

        {phase === 'story' && (
          <StoryPhase
            audioEnabled={audioEnabled}
            onNext={() => handleNextPhase('simulate')}
          />
        )}

        {phase === 'simulate' && (
          <SimulatePhase
            audioEnabled={audioEnabled}
            onNext={() => handleNextPhase('practice')}
            completedStations={completedStations}
            setCompletedStations={setCompletedStations}
            onSimulationsComplete={() => {
              setPhaseComplete((p) => ({ ...p, simulate: true }));
            }}
          />
        )}

        {phase === 'practice' && (
          <PracticePhase
            audioEnabled={audioEnabled}
            onNext={() => handleNextPhase('reflect')}
            xp={xp}
            setXp={setXp}
            streak={streak}
            setStreak={setStreak}
            maxStreak={maxStreak}
            setMaxStreak={setMaxStreak}
            worldScores={worldScores}
            setWorldScores={setWorldScores}
            onSlopeMasterSolved={() => setSlopeMasterCount((prev) => prev + 1)}
          />
        )}

        {phase === 'reflect' && (
          <ReflectPhase
            audioEnabled={audioEnabled}
            onRestart={() => {
              stopNarration();
              setPhase('intro');
            }}
            xp={xp}
            worldScores={worldScores}
            unlockedBadges={unlockedBadges}
          />
        )}
      </main>
    </div>
  );
}
