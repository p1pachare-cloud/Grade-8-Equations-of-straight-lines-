import { say, ask, cheer, think, celebrate, instruct } from './audio';
import { STORY_PANELS } from '../data/storyContent';
import { STATIONS } from '../data/stationContent';

// Wonder Phase Narration
export function wonderNarration() {
  return [
    think("Sarah's drone takes off from a rooftop in London that is two metres high. Every second, it climbs three metres."),
    ask("How high will it be after ten seconds?"),
    think("Let's discover how the equation of a straight line can answer this!"),
  ];
}

// Story Phase Narration (by panel)
export function getStoryNarration(panelIndex) {
  const panel = STORY_PANELS[panelIndex];
  if (!panel) return [];
  return [say(panel.dialogue)];
}

// Station Learn Card Narration
export function stationLearnNarration(stationIndex) {
  const st = STATIONS[stationIndex];
  if (!st) return [];
  return [instruct(st.learnText)];
}

// Correct Answer Feedback Pool
const CELEBRATION_PHRASES = [
  "Amazing! You found the line equation perfectly!",
  "Brilliant work! That slope and intercept are spot on!",
  "Spot on! The Straight Line Squad moves one step closer!",
  "Sensational! That coordinate matches the path exactly!",
  "Great job! The drone's trajectory is clear!",
];

export function correctNarration() {
  const text = CELEBRATION_PHRASES[Math.floor(Math.random() * CELEBRATION_PHRASES.length)];
  return [celebrate(text)];
}

// Incorrect Answer Feedback Pool
const ENCOURAGEMENT_PHRASES = [
  "Not quite. Check your rise and run or your intercept calculation.",
  "Give it another shot! Remember, slope equals rise divided by run.",
  "Take another look! Let's examine where the line crosses the y-axis.",
];

export function incorrectNarration() {
  const text = ENCOURAGEMENT_PHRASES[Math.floor(Math.random() * ENCOURAGEMENT_PHRASES.length)];
  return [cheer(text)];
}

// Reflect Phase Narration
export function reflectNarration() {
  return [
    think("What an adventure! Can you explain, in your own words, what the slope and the y-intercept tell us about a line?"),
  ];
}
