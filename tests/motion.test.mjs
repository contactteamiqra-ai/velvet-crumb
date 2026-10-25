import test from "node:test";
import assert from "node:assert/strict";
import { cakeMotion } from "../src/cakeMotion.js";
test("scroll reversal restores the exact original pose after a complete cut", () => {
  const original = cakeMotion(0);
  for (const p of [0, 0.2, 0.52, 0.87, 1, 0.87, 0.52, 0.2, 0]) {
    const pose = cakeMotion(p);
    assert(pose.slice.every(Number.isFinite));
  }
  assert.deepEqual(cakeMotion(0), original);
  assert.deepEqual(cakeMotion(0.52), cakeMotion(0.52));
  assert.equal(cakeMotion(1).separate, 1);
  assert.equal(cakeMotion(0).separate, 0);
});
test("slice moves outwards continuously and does not inherit elapsed time", () => {
  let previous = -1;
  for (let i = 0; i <= 100; i++) {
    const pose = cakeMotion(i / 100);
    const distance = Math.hypot(pose.slice[0], pose.slice[2]);
    assert(distance >= previous);
    previous = distance;
  }
  assert.deepEqual(cakeMotion(-10), cakeMotion(0));
  assert.deepEqual(cakeMotion(10), cakeMotion(1));
});
