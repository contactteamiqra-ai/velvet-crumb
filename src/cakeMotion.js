const clamp = (x) => Math.max(0, Math.min(1, x));
const smooth = (x) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};
// Pure absolute transforms. Never integrate dt: the same scroll position is the same frame.
export function cakeMotion(progress) {
  const p = clamp(progress),
    approach = smooth((p - 0.18) / 0.25),
    separate = smooth((p - 0.60) / 0.30);
  const settle = smooth((p - 0.90) / 0.10);
  const first = smooth((p - .26) / .09) - smooth((p - .36) / .06);
  const second = smooth((p - .45) / .08) - smooth((p - .54) / .06);
  return {
    p,
    approach,
    separate,
    knifeVisible: p > .23 && p < .61,
    knifeHeight: 2.0 - 1.78 * (first + second),
    knifeAngle: -(82 - 36 * smooth((p - .41) / .035)) * Math.PI / 180,
    rotation: -0.17 + p * 0.25,
    slice: [
      0.42 * separate,
      -0.055 * separate - 0.08 * settle,
      0.86 * separate,
    ],
    sliceRotation: -0.035 * separate,
    camera: [
      0.1 + approach * 0.28,
      3.4 - approach * 0.20,
      7.2 - approach * 0.6,
    ],
    target: [0.05, 0.49 - 0.04 * separate, 0.12 * separate],
  };
}
