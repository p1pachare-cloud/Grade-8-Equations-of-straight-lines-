/**
 * Gamification Scoring Logic (XP, Stars, Ranks)
 */

export function calcXP(attemptNumber = 1, hintsUsed = 0, currentStreak = 0) {
  let base = 10;
  if (attemptNumber === 2) base = 7;
  else if (attemptNumber >= 3 || hintsUsed > 0) base = 5;

  let streakBonus = 0;
  if (attemptNumber === 1 && hintsUsed === 0 && currentStreak >= 5) {
    streakBonus = 5;
  }
  return base + streakBonus;
}

export function calcStars(score) {
  if (score >= 10) return 3;
  if (score >= 8) return 2;
  if (score >= 6) return 1;
  return 0;
}

export function getArchitectTitle(xp) {
  if (xp >= 1000) return 'Grand Master of Linear Geometry';
  if (xp >= 750) return 'Senior Flight Vector Engineer';
  if (xp >= 500) return 'Linear Trajectory Specialist';
  if (xp >= 250) return 'Certified Slope Explorer';
  return 'Apprentice Line Navigator';
}
