const clamp = (x) => Math.max(0, Math.min(1, x));
const smooth = (x) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};
// Pure absolute transforms. Never integrate dt: the same scroll position is the same frame.
export function cakeMotion(progress) {
  const p = clamp(progress),
    approach = smooth((p - 0.18) / 0.25),
    separate = smooth((p - 0.48) / 0.39);
  const settle = smooth((p - 0.86) / 0.14);
  return {
    p,
    approach,
    separate,
    rotation: -0.17 + p * 0.25,
    slice: [
      0.42 * separate,
      -0.055 * separate - 0.08 * settle,
      0.86 * separate,
    ],
    sliceRotation: -0.035 * separate,
    camera: [
      0.1 + approach * 0.28,
      2.95 - approach * 0.28,
      8.1 - approach * 0.55,
    ],
    target: [0.05, 0.73 - 0.08 * separate, 0.12 * separate],
  };
}
