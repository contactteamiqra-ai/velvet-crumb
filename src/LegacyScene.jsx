import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
const clamp = (v) => Math.max(0, Math.min(1, v));
const ease = (v) => {
  v = clamp(v);
  return v * v * (3 - 2 * v);
};
function grain() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d");
  let seed = 37;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  ctx.fillStyle = "#482217";
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 42000; i++) {
    const r = random();
    ctx.fillStyle = r > 0.65 ? "#79472b" : r > 0.3 ? "#37180f" : "#23100b";
    ctx.beginPath();
    ctx.ellipse(
      random() * 512,
      random() * 512,
      0.3 + random() * 2.6,
      0.3 + random() * 1.7,
      random() * 6,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
function wedge(radius, height, start, length) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(Math.cos(start) * radius, Math.sin(start) * radius);
  s.absarc(0, 0, radius, start, start + length, false);
  s.lineTo(0, 0);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: height,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.018,
    bevelThickness: 0.014,
    curveSegments: 100,
  });
  g.rotateX(-Math.PI / 2);
  g.computeVertexNormals();
  return g;
}
const cutStart = -Math.PI * 0.6,
  cutAngle = Math.PI * 0.23;
function Layers({ slice = false, texture, assembly = 0 }) {
  const geo = useMemo(
    () =>
      [0.31, 0.09, 0.31, 0.09, 0.31, 0.11].map((h) =>
        wedge(
          1.65,
          h,
          slice ? cutStart : cutStart + cutAngle,
          slice ? cutAngle : Math.PI * 2 - cutAngle,
        ),
      ),
    [slice],
  );
  React.useEffect(() => () => geo.forEach((g) => g.dispose()), [geo]);
  let y = 0;
  return (
    <group>
      {geo.map((g, i) => {
        const pos = y;
        y += [0.31, 0.09, 0.31, 0.09, 0.31, 0.11][i];
        return (
          <mesh
            key={i}
            geometry={g}
            position={[0, pos + assembly * i * 0.4, 0]}
            castShadow
            receiveShadow
          >
            {i % 2 === 0 ? (
              <meshStandardMaterial
                map={texture}
                bumpMap={texture}
                bumpScale={0.065}
                roughness={0.92}
              />
            ) : (
              <meshPhysicalMaterial
                color={i === 5 ? "#281009" : "#9f6140"}
                roughness={0.27}
                clearcoat={0.7}
                clearcoatRoughness={0.22}
              />
            )}
          </mesh>
        );
      })}
    </group>
  );
}
function Curl({ a, r, index }) {
  const g = useMemo(() => {
    const points = Array.from({ length: 35 }, (_, i) => {
      const t = (i / 34) * Math.PI * 1.8;
      return new THREE.Vector3(
        Math.cos(t) * 0.13,
        t * 0.025,
        Math.sin(t) * 0.13,
      );
    });
    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      40,
      0.035,
      7,
      false,
    );
  }, []);
  React.useEffect(() => () => g.dispose(), [g]);
  return (
    <mesh
      geometry={g}
      position={[Math.cos(a) * r, 1.28 + (index % 3) * 0.035, Math.sin(a) * r]}
      rotation={[index * 0.9, a, index * 0.5]}
      castShadow
    >
      <meshPhysicalMaterial
        color={index % 4 === 0 ? "#6b361d" : "#34170e"}
        roughness={0.32}
        clearcoat={0.5}
      />
    </mesh>
  );
}
function Chocolate({ position, rotation = [0, 0, 0], scale = 1 }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow>
      <boxGeometry args={[0.33, 0.12, 0.46]} />
      <meshPhysicalMaterial color="#32150d" roughness={0.29} clearcoat={0.7} />
    </mesh>
  );
}
function World({ progress, reduced }) {
  const cake = useRef(),
    slice = useRef(),
    ingredients = useRef(),
    bowl = useRef(),
    whisk = useRef(),
    oven = useRef(),
    door = useRef(),
    box = useRef(),
    lid = useRef(),
    ribbon = useRef();
  const texture = useMemo(grain, []);
  React.useEffect(() => () => texture.dispose(), [texture]);
  const spots = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => ({
        a: i * 2.399,
        r: 1.15 + Math.sin(i * 7) * 0.24,
      })),
    [],
  );
  useFrame(({ camera, clock }) => {
    const p = progress.current;
    const cut = ease((p - 0.1) / 0.12),
      transition = ease((p - 0.24) / 0.09),
      mix = ease((p - 0.36) / 0.13),
      bake = ease((p - 0.51) / 0.12),
      finish = ease((p - 0.67) / 0.12),
      pack = ease((p - 0.8) / 0.14);
    cake.current.visible = p < 0.29 || p > 0.65;
    cake.current.position.set(
      0.3,
      -0.55 + (p > 0.65 ? (1 - finish) * 0.6 : 0),
      0,
    );
    cake.current.rotation.y =
      -0.25 +
      (reduced ? 0 : Math.sin(clock.elapsedTime * 0.12) * 0.045) +
      p * 0.6;
    cake.current.scale.setScalar(1 - transition * 0.18);
    if (p > 0.65)
      cake.current.scale.setScalar(0.8 + finish * 0.2 - pack * 0.22);
    slice.current.position.set(
      Math.cos(cutStart + cutAngle / 2) * cut * 1.45,
      -cut * 0.23 - transition * 3,
      -Math.sin(cutStart + cutAngle / 2) * cut * 1.45,
    );
    ingredients.current.visible = p > 0.25 && p < 0.51;
    ingredients.current.children.forEach((o, i) => {
      const a = i * 2.4;
      o.position.set(
        Math.cos(a) * (2.1 - mix * 1.8),
        1.3 - i * 0.28 - mix * 2.1,
        Math.sin(a) * (1.3 - mix),
      );
      o.rotation.set(p * 3 + i, p * 2, i * 0.4);
    });
    bowl.current.visible = p > 0.28 && p < 0.54;
    whisk.current.rotation.y = p * 150;
    oven.current.visible = p > 0.49 && p < 0.68;
    door.current.rotation.x =
      -ease((p - 0.51) / 0.035) * 1.5 + ease((p - 0.6) / 0.04) * 1.5;
    oven.current.scale.setScalar(0.9 + bake * 0.1);
    box.current.visible = p > 0.81;
    box.current.position.y = -1.1;
    lid.current.position.y = 2.5 - pack * 1.13;
    lid.current.rotation.z = (1 - pack) * 0.2;
    ribbon.current.scale.setScalar(ease((p - 0.91) / 0.06));
    camera.position.set(
      p < 0.26 ? 0.3 + cut * 0.3 : 0.4,
      2.4 - cut * 0.45,
      7.6 - cut * 0.95,
    );
    camera.lookAt(0, 0.2, 0);
  });
  return (
    <>
      <color attach="background" args={["#1b100d"]} />
      <fog attach="fog" args={["#1b100d", 12, 25]} />
      <ambientLight intensity={0.65} />
      <spotLight
        position={[-3, 7, 5]}
        intensity={160}
        angle={0.65}
        penumbra={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <rectAreaLight
        position={[3, 3, -2]}
        rotation={[0, 2.4, 0]}
        intensity={12}
        width={4}
        height={5}
        color="#edb47f"
      />
      <pointLight position={[-4, 1, -3]} intensity={30} color="#bd693c" />
      <group ref={cake}>
        <mesh position={[0, -0.08, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.9, 1.9, 0.1, 100]} />
          <meshStandardMaterial
            color="#9c7449"
            metalness={0.75}
            roughness={0.3}
          />
        </mesh>
        <Layers texture={texture} />
        <group ref={slice}>
          <Layers slice texture={texture} />
        </group>
        {spots
          .filter(({ a }) => {
            const angle = Math.atan2(Math.sin(a), Math.cos(a));
            return angle < cutStart || angle > cutStart + cutAngle;
          })
          .map(({ a, r }, i) => (
            <Curl key={i} a={a} r={r} index={i} />
          ))}
      </group>
      <group ref={ingredients}>
        {Array.from({ length: 8 }, (_, i) => (
          <Chocolate key={i} position={[0, 0, 0]} scale={1 + i * 0.12} />
        ))}
      </group>
      <group ref={bowl} position={[0, -0.65, 0]}>
        <mesh>
          <sphereGeometry
            args={[1.25, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            color="#9c8f7e"
            side={THREE.DoubleSide}
            metalness={0.95}
            roughness={0.23}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.45, 0]}>
          <circleGeometry args={[1.15, 64]} />
          <meshPhysicalMaterial color="#4b2114" roughness={0.2} clearcoat={1} />
        </mesh>
        <group ref={whisk} position={[0, 1.2, 0]} rotation={[0.15, 0, 0.2]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              rotation={[Math.PI / 2, (i * Math.PI) / 4, 0]}
              scale={[0.4, 0.65, 1]}
            >
              <torusGeometry args={[0.6, 0.025, 8, 40]} />
              <meshStandardMaterial
                color="#c8bba3"
                metalness={1}
                roughness={0.2}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 1.1, 16]} />
            <meshStandardMaterial
              color="#c8bba3"
              metalness={1}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>
      <group ref={oven} position={[0, -0.4, 0]}>
        <mesh>
          <boxGeometry args={[3.4, 2.6, 2]} />
          <meshStandardMaterial
            color="#312b27"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, -0.1, 1.015]}>
          <planeGeometry args={[2.8, 1.8]} />
          <meshStandardMaterial
            color="#b45c20"
            emissive="#e97e24"
            emissiveIntensity={0.5}
          />
        </mesh>
        <group ref={door} position={[0, -1, 1.08]}>
          <mesh position={[0, 0.85, 0]}>
            <boxGeometry args={[3, 1.8, 0.1]} />
            <meshPhysicalMaterial
              color="#1f1712"
              transparent
              opacity={0.65}
              roughness={0.1}
              metalness={0.4}
            />
          </mesh>
          <mesh position={[0, 1.5, 0.15]}>
            <boxGeometry args={[2, 0.08, 0.1]} />
            <meshStandardMaterial
              color="#b1a28d"
              metalness={1}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>
      <group ref={box}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[3.6, 1.1, 3.6]} />
          <meshStandardMaterial color="#6c4935" roughness={0.8} />
        </mesh>
        <mesh ref={lid}>
          <boxGeometry args={[3.75, 0.2, 3.75]} />
          <meshStandardMaterial color="#ad8a63" roughness={0.7} />
        </mesh>
        <group ref={ribbon}>
          <mesh position={[0, 1.49, 0]}>
            <boxGeometry args={[0.24, 0.02, 3.8]} />
            <meshStandardMaterial
              color="#dbc19a"
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[3.8, 0.02, 0.24]} />
            <meshStandardMaterial
              color="#dbc19a"
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>
        </group>
      </group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.14, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#241711"
          roughness={0.42}
          metalness={0.18}
        />
      </mesh>
    </>
  );
}
export default function Scene(props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0.3, 2.4, 7.6], fov: 39 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <World {...props} />
    </Canvas>
  );
}
