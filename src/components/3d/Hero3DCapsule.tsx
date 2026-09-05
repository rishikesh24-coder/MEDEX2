import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DCapsule: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 440;
    const height = container.clientHeight || 460;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group holding entire 3D object
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Capsule Group
    const capsuleGroup = new THREE.Group();
    mainGroup.add(capsuleGroup);
    capsuleGroup.rotation.z = Math.PI / 4.2; // angled clinical presentation

    // Glass Materials
    const emeraldGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x059669,
      emissive: 0x10b981,
      emissiveIntensity: 0.25,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.75,
      thickness: 1.2,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    const amberGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.3,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.75,
      thickness: 1.2,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    const bandMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.85,
      roughness: 0.2
    });

    // 1. Redistribution Half (Cylinder + Hemisphere Dome)
    const capCylinderGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.5, 32);
    const capDomeGeo = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);

    const leftCyl = new THREE.Mesh(capCylinderGeo, emeraldGlassMat);
    leftCyl.position.y = -0.75;
    capsuleGroup.add(leftCyl);

    const leftDome = new THREE.Mesh(capDomeGeo, emeraldGlassMat);
    leftDome.rotation.x = Math.PI;
    leftDome.position.y = -1.5;
    capsuleGroup.add(leftDome);

    // 2. Biomedical Waste Half (Cylinder + Hemisphere Dome)
    const rightCyl = new THREE.Mesh(capCylinderGeo, amberGlassMat);
    rightCyl.position.y = 0.75;
    capsuleGroup.add(rightCyl);

    const rightDome = new THREE.Mesh(capDomeGeo, amberGlassMat);
    rightDome.position.y = 1.5;
    capsuleGroup.add(rightDome);

    // 3. Central Titanium Lock Ring
    const bandGeo = new THREE.TorusGeometry(1.22, 0.08, 16, 64);
    const centerBand = new THREE.Mesh(bandGeo, bandMat);
    centerBand.rotation.x = Math.PI / 2;
    capsuleGroup.add(centerBand);

    // 4. Circulating Particles Inside & Around
    // Emerald Particles (Redistribution Molecules)
    const emeraldCount = 140;
    const emeraldPositions = new Float32Array(emeraldCount * 3);
    const emeraldVelocities: number[] = [];

    for (let i = 0; i < emeraldCount; i++) {
      emeraldPositions[i * 3] = (Math.random() - 0.5) * 1.8;
      emeraldPositions[i * 3 + 1] = -0.2 - Math.random() * 2.2;
      emeraldPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
      emeraldVelocities.push((Math.random() - 0.5) * 0.02, Math.random() * 0.02 + 0.005, (Math.random() - 0.5) * 0.02);
    }

    const emeraldGeo = new THREE.BufferGeometry();
    emeraldGeo.setAttribute('position', new THREE.BufferAttribute(emeraldPositions, 3));
    const emeraldPartMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.12,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const emeraldParticles = new THREE.Points(emeraldGeo, emeraldPartMat);
    capsuleGroup.add(emeraldParticles);

    // Amber Particles (Neutralized Waste Molecules)
    const amberCount = 140;
    const amberPositions = new Float32Array(amberCount * 3);
    const amberVelocities: number[] = [];

    for (let i = 0; i < amberCount; i++) {
      amberPositions[i * 3] = (Math.random() - 0.5) * 1.8;
      amberPositions[i * 3 + 1] = 0.2 + Math.random() * 2.2;
      amberPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
      amberVelocities.push((Math.random() - 0.5) * 0.02, -Math.random() * 0.02 - 0.005, (Math.random() - 0.5) * 0.02);
    }

    const amberGeo = new THREE.BufferGeometry();
    amberGeo.setAttribute('position', new THREE.BufferAttribute(amberPositions, 3));
    const amberPartMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.12,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const amberParticles = new THREE.Points(amberGeo, amberPartMat);
    capsuleGroup.add(amberParticles);

    // Orbital Halo Ring
    const haloGeo = new THREE.RingGeometry(2.4, 2.45, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const orbitalHalo = new THREE.Mesh(haloGeo, haloMat);
    orbitalHalo.rotation.x = Math.PI / 2.3;
    mainGroup.add(orbitalHalo);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(5, 8, 7);
    scene.add(directionalLight);

    const emeraldPointLight = new THREE.PointLight(0x10b981, 4, 10);
    emeraldPointLight.position.set(-2, -2, 2);
    scene.add(emeraldPointLight);

    const amberPointLight = new THREE.PointLight(0xf59e0b, 4, 10);
    amberPointLight.position.set(2, 2, 2);
    scene.add(amberPointLight);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
      targetRotationY = mouseX * 0.75;
      targetRotationX = mouseY * 0.75;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Zero-gravity gentle floating hover
      mainGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.18;
      orbitalHalo.rotation.z = elapsedTime * 0.4;

      // Base rotation + mouse dampening
      capsuleGroup.rotation.y += 0.008;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;

      // Animate Emerald Particles
      const emPos = emeraldGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < emeraldCount; i++) {
        emPos[i * 3 + 1] += emeraldVelocities[i * 3 + 1];
        if (emPos[i * 3 + 1] > -0.2) {
          emPos[i * 3 + 1] = -2.4;
        }
      }
      emeraldGeo.attributes.position.needsUpdate = true;

      // Animate Amber Particles
      const ambPos = amberGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < amberCount; i++) {
        ambPos[i * 3 + 1] += amberVelocities[i * 3 + 1];
        if (ambPos[i * 3 + 1] < 0.2) {
          ambPos[i * 3 + 1] = 2.4;
        }
      }
      amberGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] flex items-center justify-center select-none">
      {/* Background soft ambient radial glow */}
      <div className="absolute inset-0 bg-radial from-teal-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

      {/* ThreeJS Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-10" />

      {/* Clean Minimal Two-Color Indicator */}
      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-6 z-20 pointer-events-none">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200/60 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
          <span>Surplus Redistribution</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200/60 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xs" />
          <span>Biomedical Waste</span>
        </div>
      </div>
    </div>
  );
};
