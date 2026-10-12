import { BADGES } from '../data/badges';

export { BADGES };

export function checkBadges(state) {
  const newBadges = [];
  const currentBadges = new Set(state.badges || []);

  // 1. Line Starter: completed wonder & story
  if (!currentBadges.has('line_starter') && state.phaseComplete?.wonder && state.phaseComplete?.story) {
    newBadges.push('line_starter');
  }

  // 2. Line Builder: all 4 simulation stations completed
  if (!currentBadges.has('line_builder') && state.completedStations?.every(Boolean)) {
    newBadges.push('line_builder');
  }

  // 3. Line Legend: score >= 80 across worlds
  const totalCorrect = (state.worldScores || []).reduce((acc, s) => acc + (s || 0), 0);
  if (!currentBadges.has('line_legend') && totalCorrect >= 80) {
    newBadges.push('line_legend');
  }

  // 4. Perfect Path: 10/10 in any world
  if (!currentBadges.has('perfect_path') && (state.worldScores || []).some((s) => s >= 10)) {
    newBadges.push('perfect_path');
  }

  // 5. Streak Star: maxStreak >= 10
  if (!currentBadges.has('streak_star') && state.maxStreak >= 10) {
    newBadges.push('streak_star');
  }

  // 6. Global Explorer: all 6 phases complete
  if (
    !currentBadges.has('global_explorer') &&
    state.phaseComplete?.wonder &&
    state.phaseComplete?.story &&
    state.phaseComplete?.simulate &&
    state.phaseComplete?.practice &&
    state.phaseComplete?.reflect
  ) {
    newBadges.push('global_explorer');
  }

  // 7. Pinpoint: Station A completed without errors
  if (!currentBadges.has('pinpoint') && state.stationAPerfect) {
    newBadges.push('pinpoint');
  }

  // 8. Slope Master: 10 negative/fractional slopes answered correctly
  if (!currentBadges.has('slope_master') && state.slopeMasterCount >= 10) {
    newBadges.push('slope_master');
  }

  return newBadges;
}
