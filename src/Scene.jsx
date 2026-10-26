import React, { useLayoutEffect, useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { createStudioEnvironment } from "./studio.js";
import { cakeMotion } from "./cakeMotion.js";

function Studio() {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    const target = createStudioEnvironment(gl);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.35;
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene]);
  return (
    <>
      <color attach="background" args={["#19130f"]} />
      <fog attach="fog" args={["#19130f", 10, 22]} />
      <ambientLight intensity={0.12} />
      <spotLight
        position={[-3.8, 6, 4]}
        intensity={70}
        angle={0.65}
        penumbra={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00015}
        shadow-normalBias={0.025}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
      />
      <rectAreaLight
        position={[-3, 4, 3]}
        rotation={[-0.65, -0.5, 0]}
        width={3.5}
        height={4.5}
        intensity={2}
        color="#fff3e3"
      />
      <rectAreaLight
        position={[3, 3, -2]}
        rotation={[0, 2.2, 0]}
        width={1.5}
        height={4}
        intensity={3}
        color="#ffe5c7"
      />
      <rectAreaLight
        position={[0, 2, 5]}
        rotation={[0, 0, 0]}
        width={4}
        height={3}
        intensity={0.35}
        color="#dce5ee"
      />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.06, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#0f0c0a"
          roughness={0.88}
          metalness={0}
        />
      </mesh>
    </>
  );
}
function CuttingBlade({ blade }) {
  return <group ref={blade}>
    <group position={[.86, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.86, .30, .018]} />
        <meshStandardMaterial color="#d8dce1" metalness={1} roughness={.19} />
      </mesh>
      <mesh position={[0, -.165, 0]}>
        <boxGeometry args={[1.86, .035, .004]} />
        <meshStandardMaterial color="#f0f2f4" metalness={1} roughness={.12} />
      </mesh>
      <mesh position={[1.25, .055, 0]} castShadow>
        <boxGeometry args={[.64, .19, .11]} />
        <meshStandardMaterial color="#21150f" roughness={.35} />
      </mesh>
      {[1.08,1.4].map(x=><mesh key={x} position={[x,.055,.058]}>
        <sphereGeometry args={[.018,12,8]} />
        <meshStandardMaterial color="#d8c4a1" metalness={.85} roughness={.22} />
      </mesh>)}
    </group>
  </group>;
}
function Cake({ progress }) {
  const { scene: asset } = useLoader(
    GLTFLoader,
    "/assets/cake/atelier-cake.glb",
    (loader) => loader.setMeshoptDecoder(MeshoptDecoder),
  );
  const root = useRef(),
    body = useRef(),
    slice = useRef(),
    whole = useRef(), blade = useRef();
  const { gl } = useThree();
  useLayoutEffect(() => {
    whole.current = asset.getObjectByName("CakeWhole");
    body.current = asset.getObjectByName("CakeBody");
    slice.current = asset.getObjectByName("CakeSlice");
    if (!body.current || !slice.current)
      throw new Error("Cake asset is missing its body/slice hierarchy");
    asset.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = true;
      const materials = Array.isArray(o.material) ? o.material : [o.material];
      materials.forEach((m) => {
        m.envMapIntensity = 0.7;
        for (const key of ["map", "normalMap", "roughnessMap", "metalnessMap"])
          if (m[key])
            m[key].anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      });
    });
  }, [asset, gl]);
  useFrame(({ camera }) => {
    const m = cakeMotion(progress.current);
    root.current.rotation.y = m.rotation;
    blade.current.visible = m.knifeVisible;
    blade.current.position.y = m.knifeHeight;
    blade.current.rotation.y = m.knifeAngle;
    if (whole.current) {
      whole.current.visible = m.p < 0.39;
      body.current.visible = m.p >= 0.39;
      slice.current.visible = m.p >= 0.39;
    }
    if (slice.current) {
      slice.current.position.set(...m.slice);
      slice.current.rotation.y = m.sliceRotation;
    }
    camera.position.set(...m.camera);
    camera.lookAt(...m.target);
    // Read-only QA observation of the actual canvas pose, not a separate animation clock.
    gl.domElement.dataset.progress = m.p.toFixed(4);
    gl.domElement.dataset.slice = m.slice.map((v) => v.toFixed(4)).join(",");
  });
  return (
    <group ref={root}>
      <primitive object={asset} />
      <CuttingBlade blade={blade} />
    </group>
  );
}
function ScrollFrames({progress}) {
  const invalidate=useThree(state=>state.invalidate);
  useEffect(()=>{
    let previous=NaN;
    const tick=()=>{if(previous!==progress.current){previous=progress.current;invalidate();}};
    gsap.ticker.add(tick);invalidate();
    return()=>gsap.ticker.remove(tick);
  },[progress,invalidate]);
  return null;
}
function Resolution() {
  const { size, setDpr } = useThree();
  useLayoutEffect(
    () =>
      setDpr(Math.min(window.devicePixelRatio, size.width < 700 ? 1.25 : 1.5)),
    [size.width, setDpr],
  );
  return null;
}
export default function Scene(props) {
  return (
    <Canvas
      shadows
      frameloop="demand"
      camera={{ position: [0.1, 2.95, 8.1], fov: 37, near: 0.1, far: 60 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.AgXToneMapping,
        toneMappingExposure: 1.0,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <ScrollFrames progress={props.progress} />
      <Resolution />
      <Studio />
      <Cake {...props} />
    </Canvas>
  );
}
