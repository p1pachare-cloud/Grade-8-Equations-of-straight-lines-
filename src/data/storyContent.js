export const STORY_PANELS = [
  {
    id: 1,
    title: 'The Global Squad Assembles',
    location: 'Global Online Call 🌍',
    visualType: 'worldMap',
    characters: ['John', 'Mike', 'Sarah', 'Emma', 'Liam', 'Sofia', 'Noah', 'Aisha', 'Carlos', 'Yuki'],
    dialogue:
      'John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and Yuki are friends from ten different countries. They call themselves the Straight Line Squad, and they meet online to solve puzzles about lines.',
    whisper: 'Grady boots up: "Ten explorers, one mission — lines connect our world!"',
  },
  {
    id: 2,
    title: 'Emergency: Skylark Lost Signal',
    location: 'London Weather Bureau 📡',
    visualType: 'droneSignal',
    dialogue:
      'One night, a signal arrives from Skylark, a little weather drone that has lost its way. It can only send a few numbers, so the squad must work out its flight path before the battery runs out!',
    whisper: 'Battery at 30%! Skylark flies in perfectly straight lines.',
  },
  {
    id: 3,
    title: 'Mike’s Skateboard Ramp',
    location: 'New York, USA 🇺🇸',
    visualType: 'skateboardRamp',
    dialogue:
      'Mike builds a skateboard ramp in New York. The ramp rises three metres over a run of six metres. How steep is it? Mike calls this steepness the slope.',
    whisper: 'Rise = 3, Run = 6 → Slope = 3 / 6 = 1/2.',
  },
  {
    id: 4,
    title: 'Sarah’s Taxi Journey',
    location: 'London, UK 🇬🇧',
    visualType: 'taxiFare',
    dialogue:
      'Sarah takes a taxi in London. It costs three pounds just to start, plus two pounds for every kilometre. She notices the cost grows along a perfectly straight line, and the starting cost is where the line crosses the y-axis.',
    whisper: 'Initial cost c = 3 (y-intercept); rate m = 2 per km. Cost y = 2x + 3!',
  },
  {
    id: 5,
    title: 'Parallel Tracks & Perpendicular Streets',
    location: 'Tokyo & Mumbai 🇯🇵 🇮🇳',
    visualType: 'trainAndGrid',
    dialogue:
      'Yuki sees two bullet-train tracks running side by side in Tokyo. They never meet, because they have the same slope. Priya notices that the streets in Mumbai cross at right angles, and their slopes are flipped and negative, like two and negative one half.',
    whisper: 'Parallel lines have equal slopes: m₁ = m₂. Perpendicular lines multiply to -1: m₁ × m₂ = -1.',
  },
  {
    id: 6,
    title: 'The Final Coordinates for Skylark',
    location: 'Cairo, Egypt 🇪🇬',
    visualType: 'rescuePlot',
    dialogue:
      'Aisha in Cairo has the final clue. Skylark flew from the point zero, two to the point four, ten. If we can find the equation of its path, we can find exactly where it will be next. Are you ready to help the squad?',
    whisper: 'Slope m = (10 - 2) / (4 - 0) = 2, Intercept c = 2 → y = 2x + 2! Enter the Simulation Lab to master lines!',
  },
];
