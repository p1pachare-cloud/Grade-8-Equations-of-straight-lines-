/**
 * Converts mathematical symbols and expressions to natural spoken English
 * per ElevenLabs audio guidelines (e.g. "y = 2x + 3" -> "y equals two x plus three")
 */

export function speakMath(text) {
  if (!text) return '';
  let s = String(text);

  // Minus signs
  s = s.replace(/−/g, ' negative ');
  s = s.replace(/-(\d+)/g, ' negative $1 ');

  // Equation parts
  s = s.replace(/\s*=\s*/g, ' equals ');
  s = s.replace(/\s*\+\s*/g, ' plus ');
  s = s.replace(/\s*-\s*/g, ' minus ');

  // Coordinates (x, y) -> "the point x, y"
  s = s.replace(/\((-?\d+),\s*(-?\d+)\)/g, 'the point $1, $2');

  // Fractions
  s = s.replace(/1\/2/g, 'one half');
  s = s.replace(/1\/3/g, 'one third');
  s = s.replace(/2\/3/g, 'two thirds');
  s = s.replace(/1\/4/g, 'one quarter');
  s = s.replace(/3\/4/g, 'three quarters');
  s = s.replace(/(\d+)\/(\d+)/g, '$1 over $2');

  // Multipliers with x
  s = s.replace(/(\d+)x/g, '$1 x');

  // Clean double spaces
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}
