import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Camera, Palette, RotateCw, Copy, Layers } from 'lucide-react';

const sectionNames = ['Hero', 'Overview', 'Specs', 'Features', 'Quote', 'CTA'];

const defaultKeyframes = [
  { x: 0, z: 0, cx: 0, cy: 0.5, cz: 2, lx: 0, ly: 0, lz: 0, fov: 35, yaw: 0 },
  { x: 0.2, z: 0, cx: -0.8, cy: 0.3, cz: 1.2, lx: 0, ly: 0, lz: 0, fov: 25, yaw: 0.5 },
  { x: -0.2, z: 0, cx: 0.8, cy: 0.2, cz: 1.0, lx: 0.2, ly: 0.1, lz: 0, fov: 20, yaw: -0.4 },
  { x: 0, z: 0, cx: 0, cy: 1.5, cz: 0.5, lx: 0, ly: 0, lz: 0, fov: 30, yaw: 1.2 },
  { x: 0.1, z: 0.1, cx: -1, cy: 0.1, cz: 1.5, lx: 0, ly: 0, lz: 0, fov: 28, yaw: -0.2 },
  { x: 0, z: 0, cx: 0, cy: 0.4, cz: 2.2, lx: 0, ly: 0, lz: 0, fov: 35, yaw: 0 },
];

const WatchArchive: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [sceneValues, setSceneValues] = useState({
    exposure: 1.4,
    keyIntensity: 2.0,
    keyColorR: 255, keyColorG: 255, keyColorB: 255, // Neutral White light
    rimIntensity: 1.0,
    rimColorR: 255, rimColorG: 255, rimColorB: 255, 
    hdrIntensity: 1.5,
    envRotation: 1.5,
  });

  const [keyframes, setKeyframes] = useState(defaultKeyframes.map(k => ({ ...k })));

  const stateRef = useRef({
    car: null as THREE.Group | null,
    scene: null as THREE.Scene | null,
    renderer: null as THREE.WebGLRenderer | null,
    camera: null as THREE.PerspectiveCamera | null,
    keyLight: null as THREE.DirectionalLight | null,
    keyLightTarget: null as THREE.Object3D | null,
    rimLight: null as THREE.DirectionalLight | null,
    scrollY: 0,
    currentX: 0, currentZ: 0,
    currentCX: 0, currentCY: 0.5, currentCZ: 2,
    currentLX: 0, currentLY: 0, currentLZ: 0,
    currentFOV: 35,
    dragYaw: 0,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = sceneValues.exposure;
    stateRef.current.renderer = renderer;

    const scene = new THREE.Scene();
    stateRef.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.set(0, 0.5, 2);
    camera.lookAt(0, 0, 0);
    stateRef.current.camera = camera;

    // Lights
    const rimLight = new THREE.DirectionalLight(0xffffff, sceneValues.rimIntensity);
    rimLight.position.set(-2, 2, -2);
    scene.add(rimLight);
    stateRef.current.rimLight = rimLight;

    const keyLight = new THREE.DirectionalLight(0xffffff, sceneValues.keyIntensity);
    keyLight.position.set(5, 5, 5);
    const keyLightTarget = new THREE.Object3D();
    scene.add(keyLightTarget);
    keyLight.target = keyLightTarget;
    scene.add(keyLight);
    stateRef.current.keyLight = keyLight;
    stateRef.current.keyLightTarget = keyLightTarget;

    // HDR
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr', (hdrTexture) => {
      hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = hdrTexture;
      if (stateRef.current.car) {
        stateRef.current.car.traverse((child: any) => {
          if (child.isMesh && child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach(m => { if (m.envMapIntensity !== undefined) m.envMapIntensity = sceneValues.hdrIntensity; });
          }
        });
      }
    });

    // Model - Rolex as jewelry representation
     const loader = new GLTFLoader();
    loader.load('https://dl.dropboxusercontent.com/scl/fi/5rsvtvyf4xgh2ritk59jd/rolex_datejust.glb?rlkey=o8emlz6hchymyu5mph25gxz1n&st=gjulzr2f&dl=1', (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.0 / maxDim;
      
      const group = new THREE.Group();
      model.scale.setScalar(scale);
      model.position.x = -center.x * scale;
      model.position.y = -center.y * scale;
      model.position.z = -center.z * scale;
      group.add(model);

      model.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach(m => {
            if (m.envMapIntensity !== undefined) m.envMapIntensity = sceneValues.hdrIntensity;
          });
        }
      });
      
      scene.add(group);
      stateRef.current.car = group;
    });

    const handleScroll = () => {
      stateRef.current.scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const getSectionScrollData = () => {
      const parent = containerRef.current;
      if (!parent) return { sectionIdx: 0, sectionT: 0, sectionProgress: 0 };
      
      const rect = parent.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrollPos = -rect.top;
      const scrollTarget = parent.scrollHeight - windowHeight;
      const progress = Math.max(0, Math.min(scrollPos / Math.max(scrollTarget, 1), 1));
      
      const sectionCount = 6; 
      const totalSteps = sectionCount - 1;
      const sectionProgress = progress * totalSteps;
      const sectionIdx = Math.floor(sectionProgress);
      const sectionT = sectionProgress - sectionIdx;
      
      return { 
        sectionIdx: Math.min(sectionIdx, sectionCount - 1), 
        sectionT: easeOutCubic(Math.min(sectionT, 1)), 
        sectionProgress 
      };
    };

    const animate = () => {
      const { sectionIdx, sectionT } = getSectionScrollData();
      const clampedIdx = Math.min(sectionIdx, keyframes.length - 1);
      const kA = keyframes[clampedIdx];
      const kB = keyframes[Math.min(clampedIdx + 1, keyframes.length - 1)];

      const targetX = lerp(kA.x, kB.x, sectionT);
      const targetZ = lerp(kA.z, kB.z, sectionT);
      const targetCX = lerp(kA.cx, kB.cx, sectionT);
      const targetCY = lerp(kA.cy, kB.cy, sectionT);
      const targetCZ = lerp(kA.cz, kB.cz, sectionT);
      const targetLX = lerp(kA.lx, kB.lx, sectionT);
      const targetLY = lerp(kA.ly, kB.ly, sectionT);
      const targetLZ = lerp(kA.lz, kB.lz, sectionT);
      const targetFOV = lerp(kA.fov, kB.fov, sectionT);
      const targetDragYaw = lerp(kA.yaw, kB.yaw, sectionT);

      const lerpSpeed = 0.05;
      const state = stateRef.current;
      
      if (state.car) {
        state.currentX = lerp(state.currentX, targetX, lerpSpeed);
        state.currentZ = lerp(state.currentZ, targetZ, lerpSpeed);
        state.car.position.x = state.currentX;
        state.car.position.z = state.currentZ;
      }

      state.currentCX = lerp(state.currentCX, targetCX, lerpSpeed);
      state.currentCY = lerp(state.currentCY, targetCY, lerpSpeed);
      state.currentCZ = lerp(state.currentCZ, targetCZ, lerpSpeed);
      state.currentLX = lerp(state.currentLX, targetLX, lerpSpeed);
      state.currentLY = lerp(state.currentLY, targetLY, lerpSpeed);
      state.currentLZ = lerp(state.currentLZ, targetLZ, lerpSpeed);
      state.currentFOV = lerp(state.currentFOV, targetFOV, lerpSpeed);
      state.dragYaw = lerp(state.dragYaw, targetDragYaw, lerpSpeed);

      if (state.camera) {
        state.camera.fov = state.currentFOV;
        state.camera.updateProjectionMatrix();

        const lookAt = new THREE.Vector3(state.currentLX, state.currentLY, state.currentLZ);
        const baseOffset = new THREE.Vector3(state.currentCX - state.currentLX, state.currentCY - state.currentLY, state.currentCZ - state.currentLZ);
        const orbitMat = new THREE.Matrix4().makeRotationY(state.dragYaw);
        const rotatedOffset = baseOffset.clone().applyMatrix4(orbitMat);
        const finalCamPos = lookAt.clone().add(rotatedOffset);
        state.camera.position.copy(finalCamPos);
        state.camera.lookAt(lookAt);
      }

      if (state.keyLight && state.keyLightTarget) {
        state.keyLight.position.set(state.currentX + 5, 5, state.currentZ + 5);
        state.keyLightTarget.position.set(state.currentX, 0, state.currentZ);
        state.keyLightTarget.updateMatrixWorld();
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [keyframes]);

  useEffect(() => {
    const { renderer, rimLight, keyLight, scene, car } = stateRef.current;
    if (renderer) renderer.toneMappingExposure = sceneValues.exposure;
    if (rimLight) rimLight.intensity = sceneValues.rimIntensity;
    if (keyLight) {
      keyLight.intensity = sceneValues.keyIntensity;
      keyLight.color.setRGB(sceneValues.keyColorR / 255, sceneValues.keyColorG / 255, sceneValues.keyColorB / 255);
    }
    if (scene && scene.environment) {
      scene.environment.rotation = sceneValues.envRotation;
    }
    if (car) {
      car.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach(m => {
            if (m.envMapIntensity !== undefined) m.envMapIntensity = sceneValues.hdrIntensity;
          });
        }
      });
    }
  }, [sceneValues]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      setIsVisible(inView);
    };
    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
    return () => window.removeEventListener('scroll', checkVisibility);
  }, []);

  return (
    <div 
      className="relative text-white font-inter border-t border-white/5 bg-luxury-black" 
      ref={containerRef} 
      style={{ minHeight: '600vh', zIndex: 40 }}
    >
      <div 
        className={`fixed inset-0 w-full h-screen pointer-events-none z-0 transition-opacity duration-500 overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ pointerEvents: 'none' }}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_65%_at_50%_60%,transparent_30%,rgba(10,12,20,0.4)_60%,rgba(10,12,20,0.8)_90%,#0a0c14_100%)]" />
      </div>

      <div className="relative z-10 pointer-events-none">
        
        {/* HERO SECTION */}
        <section className="archive-section h-screen flex items-end p-10 md:p-24 pb-32">
          <div className="max-w-4xl pointer-events-auto">
            <h1 className="text-[clamp(64px,13vw,180px)] font-serif font-light leading-[0.88] tracking-tight">
              <span className="block text-white/40 font-luxury text-[0.4em] tracking-[0.2em] mb-4">Mastering Time</span>
              <span className="block text-white">CHRONOS</span>
              <span className="block monochrome-gradient">PRECISION</span>
            </h1>
            <div className="mt-12 flex flex-col gap-1 items-start">
              <span className="text-[11px] uppercase tracking-[0.4em] font-medium text-white font-mono">Reference № 729-032</span>
              <span className="text-[11px] uppercase tracking-[0.16em] text-white/40">Oyster Steel / Perpetual Movement / Sapphire Crystal</span>
            </div>
          </div>
        </section>

        {/* OVERVIEW */}
        <section className="archive-section min-h-screen flex items-center p-10 md:p-24">
          <div className="max-w-xl pointer-events-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-white/40" />
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/40">Engineering Excellence</span>
            </div>
            <h2 className="text-[clamp(40px,6vw,80px)] font-serif font-light leading-[0.92] tracking-tight text-white mb-10">A Legacy Reimagined</h2>
            <p className="text-sm leading-[2] text-white/40 max-w-sm mb-12 font-light uppercase tracking-wider">
              AR Watches Corp represents the pinnacle of horological wholesale. Based in Miami, our flagship boutique offers only the most distinguished timepieces for enthusiasts who demand excellence.
            </p>
            <div className="flex gap-12 mt-12 pt-12 border-t border-white/10">
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-serif text-white">72H</span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">Reserve</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-serif text-white">100M</span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">Depth</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-serif text-white">COSC</span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">Certified</span>
              </div>
            </div>
          </div>
        </section>

        {/* SPECS */}
        <section className="archive-section min-h-screen flex items-center justify-end p-10 md:p-24 text-right">
          <div className="max-w-xl pointer-events-auto">
            <div className="flex items-center gap-4 mb-8 justify-end">
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/40">Technical Specs</span>
              <div className="w-12 h-px bg-white/40" />
            </div>
            <h2 className="text-[clamp(40px,6vw,80px)] font-serif font-light leading-[0.92] tracking-tight text-white mb-10">Pure Caliber</h2>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Movement', val: 'Mechanical Self-Winding' },
                { label: 'Case', val: '41mm Oystersteel' },
                { label: 'Dial', val: 'Sunray Finish Anthracite' },
                { label: 'Bracelet', val: 'Oyster Three-Piece Link' },
                { label: 'Warranty', val: '5 Years Hub-Service' },
              ].map(spec => (
                <div key={spec.label} className="flex justify-between items-baseline border-b border-white/5 py-5 gap-12 group hover:border-white transition-colors">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-white/20">{spec.label}</span>
                  <span className="text-2xl font-serif text-white group-hover:text-silver transition-colors">{spec.val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="archive-section min-h-screen flex items-end p-10 md:p-24 pb-40">
          <div className="pointer-events-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-white/40" />
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/40">Signature Details</span>
            </div>
            <h2 className="text-[clamp(40px,6vw,80px)] font-serif font-light leading-[0.92] tracking-tight text-white mb-16">The Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 max-w-lg border border-white/10 backdrop-blur-xl">
              {[
                { id: '01', name: 'Laser Etching', desc: 'Precision numerals etched with microscopic accuracy for ultimate legibility.' },
                { id: '02', name: 'Blue Parachrom', desc: 'A hairspring that offers greater resistance to shocks and temperature variations.' },
                { id: '03', name: 'Cerachrom Bezel', desc: 'Virtually scratchproof ceramic bezel that remains unaffected by ultraviolet rays.' },
                { id: '04', name: 'Chromalight', desc: 'A blue glow that provides exceptional visibility in dark conditions.' },
              ].map(item => (
                <div key={item.id} className="bg-luxury-black/90 p-10 flex flex-col gap-3 group">
                  <span className="text-[11px] font-serif font-bold text-white tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity">{item.id}</span>
                  <h3 className="text-xl font-serif font-medium uppercase tracking-wider text-white">{item.name}</h3>
                  <p className="text-[11px] leading-[1.8] text-white/30 font-serif tracking-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUOTE */}
        <section className="archive-section min-h-screen flex flex-col items-center justify-center p-10 text-center">
          <div className="pointer-events-auto">
            <span className="text-[120px] font-serif text-white/10 leading-[0.6] mb-8 select-none">"</span>
            <p className="text-[clamp(28px,4vw,52px)] font-serif italic font-light leading-[1.1] tracking-tight text-white max-w-3xl mb-12 uppercase">
              Time is the ultimate luxury. Our mission is to help you measure it with absolute precision and grace.
            </p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-mono">
              <span className="text-accent font-bold">AR Watches Corp</span> — The Miami Standard
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="archive-section min-h-screen flex items-end p-10 md:p-24 pb-32">
          <div className="w-full pointer-events-auto text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-white/40" />
              <span className="text-[11px] font-bold tracking-[0.4em] uppercase text-white/40">Private Acquisition</span>
            </div>
            <h2 className="text-[clamp(60px,12vw,140px)] font-serif font-light leading-[0.85] tracking-tight mb-12">
              <span className="block text-white">DEFINE</span>
              <span className="block monochrome-gradient">YOUR TIME</span>
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 pt-16 border-t border-white/10">
              <button className="bg-white text-black px-12 py-6 text-[12px] font-black uppercase tracking-[0.3em] transition-all hover:bg-neutral-200 flex items-center gap-6 group shadow-2xl">
                Enquire Online
                <motion.span animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                  →
                </motion.span>
              </button>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/20 text-right leading-[2.5] font-mono">
                <p>Limited Production - GMT Edition 2026</p>
                <p>AR Watches Corp © 2026</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed top-1/2 right-0 -translate-y-1/2 z-[100] flex flex-col gap-1 pointer-events-auto">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="bg-luxury-black/90 p-3 border border-white/10 border-r-0 text-white hover:bg-white/10 transition-colors shadow-2xl"
        >
          <Settings size={18} />
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-80 bg-luxury-black/98 border-l border-white/10 z-[1000] p-10 overflow-y-auto pointer-events-auto backdrop-blur-2xl"
          >
            <div className="flex justify-between items-center mb-12 pb-4 border-b border-white/10 text-white">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-white/60">Light Controls</h3>
              <button onClick={() => setShowSettings(false)} className="text-white/20 hover:text-white transition-colors">✕</button>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-5">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block">Environment</label>
                <input 
                  type="range" min="0" max="5" step="0.1" 
                  value={sceneValues.exposure} 
                  onChange={(e) => setSceneValues({...sceneValues, exposure: parseFloat(e.target.value)})}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                />
              </div>
              <div className="space-y-5">
                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block">Brilliance</label>
                <input 
                  type="range" min="0" max="10" step="0.1" 
                  value={sceneValues.keyIntensity} 
                  onChange={(e) => setSceneValues({...sceneValues, keyIntensity: parseFloat(e.target.value)})}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 right-10 z-[50] flex items-center gap-4 opacity-10 pointer-events-none">
        <RotateCw size={14} className="animate-spin-slow text-white" />
        <span className="text-[9px] uppercase tracking-[0.3em] font-mono text-white">Realtime Precision</span>
      </div>
    </div>
  );
};

export default WatchArchive;
