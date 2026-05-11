import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
import { Settings, Save, RotateCcw, Play, Pause, AlertCircle } from 'lucide-react';
import modelConfig from '../models-config.json';

const modelData = [
  {
    "model": "rolex_datejust.glb",
    "yOffset": 0.05,
    "scaleMult": 1.2,
    "rotationOffset": 0
  },
  {
    "model": "rolex_datejust.glb",
    "yOffset": -0.05,
    "scaleMult": 1.5,
    "rotationOffset": -0.5
  },
  {
    "model": "rolex_datejust.glb",
    "yOffset": 0.1,
    "scaleMult": 1.3,
    "rotationOffset": 0.8
  }
];

const sections = [
  {
    label: "01 — The Art of Precision",
    title: "Timeless\nHeritage",
    desc: "Forged in the heart of horological mastery, our timepieces represent the pinnacle of engineering. Every gear, every spring, meticulously crafted for the modern gentleman.",
    tags: ["Mechanical", "Hand-Finished", "Calibre Elite"],
    color: "#000000",
    accent: "#ffffff"
  },
  {
    label: "02 — Vertical Integration",
    title: "Mastery\nIn-House",
    desc: "We don't just assemble; we create. From the curation of historical references to the final regulation of our movements in our Split and Milano showrooms.",
    tags: ["European Curation", "Certified Hub", "Grand Complication"],
    color: "#000000",
    accent: "#ffffff"
  },
  {
    label: "03 — Pure Elegance",
    title: "The Silent\nStatement",
    desc: "Luxury is felt, not just seen. A singular design language that transcends eras and defines the refined standard for gentlemen.",
    tags: ["Iconic Design", "Rare Materials", "Limited Series"],
    color: "#000000",
    accent: "#ffffff"
  }
];

const Showcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const pauseAutoSpinRef = useRef(false);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carGroupsRef = useRef<THREE.Group[]>([]);
  const guiRef = useRef<dat.GUI | null>(null);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    let gui: dat.GUI | null = null;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    const carGroupsRefLocal: THREE.Group[] = [];
    const init = async () => {
      carGroupsRef.current = carGroupsRefLocal;
      scene = new THREE.Scene();
      scene.background = null;

      camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);
      camera.position.set(0, 0, 7.5);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.AgXToneMapping;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.autoClear = false;

      const canvas = renderer.domElement;
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = '10';
      canvas.style.pointerEvents = 'none';
      containerRef.current?.appendChild(canvas);

      const loader = new GLTFLoader();
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment()).texture;

      // Lights
      const keyLight = new THREE.SpotLight(0xfff0e0, 8, 30, Math.PI / 4, 0.5, 1);
      keyLight.position.set(4, 3, 5);
      scene.add(keyLight);

      const fillLight = new THREE.SpotLight(0xd0e0ff, 3, 30, Math.PI / 3, 0.7, 1);
      fillLight.position.set(-5, 1, 3);
      scene.add(fillLight);

      const rimLight = new THREE.SpotLight(0xffffff, 6, 30, Math.PI / 4, 0.4, 1);
      rimLight.position.set(0, 4, -5);
      scene.add(rimLight);

      // Load models
      for (let i = 0; i < modelData.length; i++) {
        const data = modelData[i];
        
        // Resolve URL
        // @ts-ignore
        const configUrl = modelConfig.models[data.model];
        const isPlaceholderUrl = !configUrl || configUrl.includes('your-cdn-or-host');
        const modelUrl = !isPlaceholderUrl ? configUrl : `/models/${data.model}`;
        
        try {
          const gltf = await loader.loadAsync(modelUrl);
          const group = gltf.scene;
          
          // Force update of world matrices to ensure accurate bounding box
          group.updateWorldMatrix(true, true);

          // Auto-Fit Logic
          const computeVisibleBox = (obj: THREE.Object3D) => {
            const b = new THREE.Box3();
            obj.traverse((child: any) => {
              if (child.isMesh) {
                child.geometry.computeBoundingBox();
                const nodeBox = child.geometry.boundingBox.clone();
                nodeBox.applyMatrix4(child.matrixWorld);
                b.union(nodeBox);
              }
            });
            return b;
          };

          const box = computeVisibleBox(group);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          
          // Re-center the meshes *within* the group so the group rotates about their collective center
          group.traverse((child: any) => {
            if (child.isMesh) {
              // We modify the child's position relative to its current parent
              // We need to account for the child's own matrix transformation
              const inverseChildMatrix = new THREE.Matrix4().copy(child.matrixWorld).invert();
              const localCenter = center.clone().applyMatrix4(inverseChildMatrix);
              
              // This is a bit complex for deep nesting, simpler way:
              // Just offset the group itself by the center negated
            }
          });

          // Simpler centering strategy: wrap the model in a pivot group
          const pivot = new THREE.Group();
          pivot.add(group);
          group.position.set(-center.x, -center.y, -center.z);
          
          pivot.userData = { 
            originalSize: size.clone(),
            yOffset: data.yOffset || 0,
            scaleMult: data.scaleMult || 1.0, 
            rotOffset: data.rotationOffset, 
            baseRotation: Math.PI / 4 + data.rotationOffset 
          };
          pivot.rotation.y = pivot.userData.baseRotation;
          
          pivot.traverse((child: any) => {
            if (child.isMesh && child.material) {
              const mat = child.material;
              if (typeof mat.metalness === 'number') mat.metalness = Math.max(mat.metalness, 0.5);
              if (typeof mat.roughness === 'number') mat.roughness = Math.min(mat.roughness, 0.2);
            }
          });
          
          scene.add(pivot);
          carGroupsRefLocal.push(pivot);
          pivot.visible = false;
        } catch (err) {
          setLoadError("Some 3D models could not be loaded. Please check the console for details.");
          console.error(`[Showcase] ERROR: Model failed to load via URL: ${modelUrl}. 
          If you are seeing 'Unexpected token <', it means the file was not found (404) and the server returned index.html. 
          Please update src/models-config.json with a working CDN link if local files are missing.`, err);
          // Zero-content Group to prevent crashes while maintaining section count
          const dummy = new THREE.Group();
          dummy.userData = { baseRotation: 0, rotOffset: 0 };
          scene.add(dummy);
          carGroupsRefLocal.push(dummy);
        }
      }

      if (carGroupsRefLocal.length > 0) carGroupsRefLocal[0].visible = true;
      rendererRef.current = renderer;
      carGroupsRef.current = carGroupsRefLocal;

      renderer.setAnimationLoop((id) => {
        animationIdRef.current = id;
        animate();
      });
    };

    let mouseX = 0;
    let mouseY = 0;
    const updateMouse = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onWindowResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('pointermove', updateMouse);

    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;
    let autoRotation = 0;
    let lastTime = performance.now();

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const aspect = vw / vh;
      
      // Calculate Viewport units for the fixed camera
      const fovRad = (camera.fov * Math.PI) / 180;
      const vhUnits = 2 * Math.tan(fovRad / 2) * camera.position.z;
      const vwUnits = vhUnits * aspect;

      // Target Frame Percentages from User Annotation
      const targetFrame = {
        left: 0.247,
        top: 0.273,
        width: 0.562,
        height: 0.532
      };

      // Target 3D Space Coordinates (Relative to screen center)
      const targetCenterX = (targetFrame.left + targetFrame.width / 2 - 0.5) * vwUnits;
      const targetCenterY = (0.5 - (targetFrame.top + targetFrame.height / 2)) * vhUnits;
      const targetWSpace = targetFrame.width * vwUnits;
      const targetHSpace = targetFrame.height * vhUnits;

      targetRotX = -mouseY * 0.2;
      targetRotY = mouseX * 0.2;
      const lerpAlpha = 1 - Math.exp(-4 * delta);
      curRotX += (targetRotX - curRotX) * lerpAlpha;
      curRotY += (targetRotY - curRotY) * lerpAlpha;

      autoRotation += pauseAutoSpinRef.current ? 0 : 0.5 * delta;

      carGroupsRef.current.forEach((group) => {
        if (group && group.userData.originalSize) {
          const modelSize = group.userData.originalSize;
          
          // Auto Scale to fit target frame with safe margins
          const fitScale = Math.min(
            targetWSpace / modelSize.x,
            targetHSpace / modelSize.y
          ) * (group.userData.scaleMult || 1.0); 

          group.scale.setScalar(fitScale);
          group.position.x = targetCenterX;
          group.position.y = targetCenterY + (group.userData.yOffset * vhUnits) - (0.08 * vhUnits); 

          group.rotation.x = curRotX;
          group.rotation.y = (group.userData.baseRotation || 0) + curRotY + autoRotation;
        }
      });

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const S = -rect.top;
      
      // Handle visibility boundary - hide if showroom is above/below or just starting to enter
      // We also update the canvas top to match the showroom entry
      const canvas = renderer.domElement;
      
      // Strict Hero gate: If showing Hero (top of page), hide canvas
      if (rect.top > vh * 0.5) {
        canvas.style.opacity = '0';
        canvas.style.pointerEvents = 'none';
        return;
      }

      if (rect.bottom < 0 || rect.top > vh) {
        canvas.style.opacity = '0';
        return;
      }
      
      // Smoothly fade in/out near boundaries
      // Show only when showroom is partially in view
      const visibilityCutoff = 400; // px margin for aggressive hide
      if (rect.top > vh - visibilityCutoff) {
        canvas.style.opacity = '0';
      } else {
        canvas.style.opacity = '1';
        canvas.style.top = Math.max(0, rect.top) + 'px';
      }

      let topSection = Math.max(0, Math.min(Math.floor(S / vh), sections.length - 1));
      topSection = Math.min(topSection, carGroupsRef.current.length - 1);
      const frac = Math.max(0, Math.min(S / vh - topSection, 1));

      renderer.setScissorTest(false);
      renderer.clear(true, true, true);
      renderer.setScissorTest(true);

      carGroupsRef.current.forEach(mesh => { if (mesh) mesh.visible = false; });

      if (frac < 0.001 || topSection >= sections.length - 1) {
        renderer.setScissor(0, 0, vw, vh);
        renderer.setViewport(0, 0, vw, vh);
        if (carGroupsRef.current[topSection]) carGroupsRef.current[topSection].visible = true;
        renderer.render(scene, camera);
      } else {
        const topH = Math.ceil(vh * (1 - frac));
        renderer.setScissor(0, 0, vw, topH);
        renderer.setViewport(0, 0, vw, vh);
        if (carGroupsRef.current[topSection]) {
          carGroupsRef.current[topSection].visible = true;
          renderer.render(scene, camera);
          carGroupsRef.current[topSection].visible = false;
        }

        const bottomH = Math.ceil(vh * frac);
        renderer.setScissor(0, vh - bottomH, vw, bottomH);
        renderer.setViewport(0, 0, vw, vh);
        if (carGroupsRef.current[topSection + 1]) {
          carGroupsRef.current[topSection + 1].visible = true;
          renderer.render(scene, camera);
          carGroupsRef.current[topSection + 1].visible = false;
        }
      }

      renderer.setScissorTest(false);
    };

    init();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('pointermove', updateMouse);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = 0;
      }
      
      if (rendererRef.current) {
        rendererRef.current.setAnimationLoop(null);
        rendererRef.current.dispose();
        rendererRef.current.domElement?.remove();
        rendererRef.current = null;
      }
      
      destroyGUI();
    };
  }, []); // Init once on mount

  const createGUI = (carGroups: THREE.Group[]) => {
    if (guiRef.current) return;
    
    guiRef.current = new dat.GUI({ autoPlace: false, width: 380 });
    guiRef.current.domElement.style.cssText = 'position:fixed;right:20px;top:80px;z-index:1000;font-family:monospace;background:rgba(0,0,0,0.9);border-radius:12px;box-shadow:0 0 20px rgba(0,0,0,0.5);overflow:hidden;';
    document.body.appendChild(guiRef.current.domElement);

    carGroups.forEach((group, i) => {
      if (!group.userData?.baseRotation) return; // Skip invalid
      const folder = guiRef.current!.addFolder(`#${i+1} ${modelData[i].model}`, { closed: i > 0 });
      folder.add(group.userData, 'yOffset', -1, 1, 0.001).name('Y Shift (v%)');
      folder.add(group.userData, 'scaleMult', 0.1, 2, 0.001).name('Fit Multiplier');
      folder.add(group.userData, 'baseRotation', -Math.PI*2, Math.PI*2, 0.01).name('Base Rot');
      folder.add({ undo: () => {
        const d = modelData[i];
        group.userData.yOffset = d.yOffset || 0;
        // @ts-ignore
        group.userData.scaleMult = d.scaleMult || 1;
        group.userData.baseRotation = Math.PI / 4 + d.rotationOffset;
      }}, 'undo').name('↶ RESET');
    });

    const controls = {
      toggleSpin: () => { pauseAutoSpinRef.current = !pauseAutoSpinRef.current; },
      saveAll: () => {
        const data = carGroups.map((g, i) => ({
          model: modelData[i].model,
          yOffset: Number(g.userData.yOffset.toFixed(3)),
          scaleMult: Number(g.userData.scaleMult.toFixed(3)),
          rotationOffset: Number((g.userData.baseRotation - Math.PI / 4).toFixed(3))
        }));
        console.log('FINAL SETTINGS:', JSON.stringify(data, null, 2));
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        alert('All settings copied to clipboard!');
      }
    };

    guiRef.current.add(controls, 'toggleSpin').name('⏸ TOGGLE SPIN');
    guiRef.current.add(controls, 'saveAll').name('💾 SAVE ALL');
    guiRef.current.open();
  };

  const destroyGUI = () => {
    if (guiRef.current) {
      guiRef.current.destroy();
      guiRef.current = null;
    }
  };

  useEffect(() => {
    if (!carGroupsRef.current.length) return;
    if (isEditMode) {
      createGUI(carGroupsRef.current);
    } else {
      destroyGUI();
    }
    return destroyGUI;
  }, [isEditMode]);


  return (
    <div className="relative z-10 pointer-events-none" ref={containerRef}>
      {/* Edit Mode Guide Box */}
      {isEditMode && (
        <div 
          className="fixed z-50 border-2 border-dashed border-accent/40 pointer-events-none"
          style={{
            left: '24.7%',
            top: '27.3%',
            width: '56.2%',
            height: '53.2%',
          }}
        >
          <span className="absolute -top-6 left-0 bg-accent text-black text-[8px] font-bold px-2 py-0.5 rounded-sm">TARGET FRAME (AUTO-FIT)</span>
        </div>
      )}

      {/* Load Error Notification */}
      <AnimatePresence>
        {loadError && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-100 bg-red-500/10 backdrop-blur-md border border-red-500/20 px-6 py-4 rounded-sm flex items-center gap-4 text-red-500 pointer-events-auto"
          >
            <AlertCircle size={20} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest">System Warning</span>
              <span className="text-xs">{loadError}</span>
            </div>
            <button onClick={() => setLoadError(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Mode Toggle */}
      <div className="fixed top-24 right-8 z-100 pointer-events-auto">
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
            isEditMode 
              ? 'bg-accent text-luxury-black shadow-[0_0_20px_rgba(197,164,126,0.3)]' 
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isEditMode ? <Save size={14} /> : <Settings size={14} />}
          {isEditMode ? 'Exit & Sync' : 'Edit Mode'}
        </button>
      </div>

      {sections.map((section, i) => (
        <section
          key={i}
          className={`relative w-full h-screen flex items-center p-10 md:p-24 transition-colors duration-1000 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
          style={{ backgroundColor: `${section.color}0D` }}
        >
          {/* Decorative background character */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden w-full h-full flex items-center justify-center opacity-[0.03]">
            <span className="text-[60vh] font-serif font-black tracking-tighter uppercase" style={{ color: section.accent }}>
              {section.title.charAt(0)}
            </span>
          </div>

          <div className={`max-w-xl pointer-events-auto ${i % 2 === 0 ? 'text-left' : 'text-right'}`}>
            <div 
              className="text-[10px] font-bold uppercase tracking-[0.6em] mb-6 transition-colors duration-500"
              style={{ color: section.accent }}
            >
              {section.label}
            </div>
            
            <h2 className="text-5xl md:text-8xl font-serif font-bold mb-8 leading-[0.85] tracking-tighter whitespace-pre-line uppercase">
              {section.title.split('\n').map((line, idx) => (
                <span key={idx} className="block last:text-white/40">
                  {line}
                </span>
              ))}
            </h2>

            <div className={`flex flex-col gap-8 ${i % 2 === 0 ? 'items-start' : 'items-end'}`}>
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-sm font-light">
                {section.desc}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {section.tags.map((tag, j) => (
                  <span 
                    key={j} 
                    className="px-4 py-1.5 border border-white/10 rounded-full text-[9px] uppercase tracking-[0.2em] font-medium transition-all hover:bg-white/5"
                    style={{ borderColor: j === 0 ? `${section.accent}44` : undefined, color: j === 0 ? section.accent : undefined }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Subtle highlight line */}
            <div 
              className={`mt-12 h-[1px] w-24 transition-all duration-1000 ${i % 2 === 0 ? 'origin-left' : 'origin-right'}`}
              style={{ backgroundColor: section.accent }}
            />
          </div>
        </section>
      ))}
    </div>
  );
};

export default Showcase;
