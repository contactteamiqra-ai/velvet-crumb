import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

// An authored softbox studio, prefiltered locally. No remote HDRI dependency.
export function createStudioEnvironment(renderer) {
  RectAreaLightUniformsLib.init();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#161410");
  const panels = [
    { p: [-3.5, 4.5, 3], size: [3.8, 5.5], color: "#fff3de", strength: 5 },
    { p: [3.5, 3, -2], size: [1.2, 4], color: "#fff7ea", strength: 6 },
    { p: [0, 5, -1], size: [4, 2.5], color: "#ffffff", strength: 3 },
    { p: [1, 1, 5], size: [3, 3], color: "#cbd6e1", strength: 0.5 },
  ];
  panels.forEach(({ p, size, color, strength }) => {
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(strength),
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(...size), material);
    plane.position.set(...p);
    plane.lookAt(0, 0.7, 0);
    scene.add(plane);
  });
  const generator = new THREE.PMREMGenerator(renderer);
  const target = generator.fromScene(scene, 0.035, 0.1, 50);
  scene.traverse((o) => {
    o.geometry?.dispose();
    o.material?.dispose();
  });
  generator.dispose();
  return target;
}
