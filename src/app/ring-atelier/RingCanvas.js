'use client';

import { Component, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// ─── Error Boundary ───
class CanvasErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMsg: '' };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, errorMsg: error?.message || 'Unknown error' };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    width: '100%', height: '100%', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: '#000000', color: '#C5A467', fontFamily: 'sans-serif',
                    padding: '40px', textAlign: 'center'
                }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '12px' }}>
                        💎 3D Preview Unavailable
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#888', maxWidth: '300px' }}>
                        Your browser may not support WebGL 3D rendering. 
                        Please try Chrome or Edge for the best experience.
                    </p>
                    {this.state.errorMsg && (
                        <p style={{ fontSize: '0.7rem', color: '#555', marginTop: '16px', maxWidth: '350px', wordBreak: 'break-all' }}>
                            Detail: {this.state.errorMsg}
                        </p>
                    )}
                </div>
            );
        }
        return this.props.children;
    }
}

// ─── Metal materials ───
const METAL_COLORS = {
    '9kt yellow gold': { color: '#E5C483', roughness: 0.12, metalness: 1.0 },
    '14kt yellow gold': { color: '#EACD95', roughness: 0.10, metalness: 1.0 },
    '18kt yellow gold': { color: '#F3DCA2', roughness: 0.08, metalness: 1.0 },
    '9kt white gold': { color: '#EBEBEB', roughness: 0.12, metalness: 1.0 },
    '14kt white gold': { color: '#F0F0F0', roughness: 0.10, metalness: 1.0 },
    '18kt white gold': { color: '#F5F5F5', roughness: 0.08, metalness: 1.0 },
    '9kt rose gold': { color: '#D99F94', roughness: 0.12, metalness: 1.0 },
    '14kt rose gold': { color: '#E2B2A7', roughness: 0.10, metalness: 1.0 },
    '18kt rose gold': { color: '#E8BFB5', roughness: 0.08, metalness: 1.0 },
    '925 silver': { color: '#D5D5D5', roughness: 0.15, metalness: 1.0 }
};

// ─── Simple procedural gem (no transmission — works everywhere) ───
function createSimpleGem(sizeCarat) {
    const s = Math.pow(sizeCarat, 1 / 3) * 0.45;
    const segs = 16;

    // Crown (top truncated cone)
    const crown = new THREE.CylinderGeometry(s * 0.55, s, s * 0.25, segs);
    crown.translate(0, s * 0.15, 0);

    // Girdle (thin cylinder)
    const girdle = new THREE.CylinderGeometry(s, s, s * 0.05, segs);

    // Pavilion (cone pointing down)
    const pavilion = new THREE.ConeGeometry(s, s * 0.6, segs);
    pavilion.rotateX(Math.PI);
    pavilion.translate(0, -s * 0.3, 0);

    return [crown, girdle, pavilion];
}

// ─── Simple band ───
function createBand(ringSizeCode) {
    const sizeNum = parseFloat(ringSizeCode) || 7;
    const innerR = 0.8 + (sizeNum - 5) * 0.02;
    const thick = 0.11;
    const geom = new THREE.TorusGeometry(innerR + thick / 2, thick / 2, 16, 64);
    geom.rotateX(Math.PI / 2);
    return { geometry: geom, outerRadius: innerR + thick };
}

// ─── Simple prongs ───
function createProngs(sizeCarat) {
    const s = Math.pow(sizeCarat, 1 / 3) * 0.45;
    const h = s * 0.8;
    const pr = 0.018;
    const prongs = [];

    for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI * 2) / 4 + Math.PI / 4;
        const prongGeom = new THREE.CylinderGeometry(pr, pr * 0.7, h, 6);
        prongGeom.translate(Math.cos(a) * s * 0.85, h * 0.3, Math.sin(a) * s * 0.85);
        prongs.push(prongGeom);
    }

    // Collet ring
    const collet = new THREE.TorusGeometry(s * 0.8, 0.012, 8, 24);
    collet.rotateX(Math.PI / 2);
    collet.translate(0, h * 0.05, 0);
    prongs.push(collet);

    return prongs;
}

// ─── Main Ring Scene ───
function RingScene({ style, metalType, stoneShape, stoneSize, ringSize }) {
    const groupRef = useRef();

    const metalKey = metalType.toLowerCase();
    const metal = METAL_COLORS[metalKey] || METAL_COLORS['18kt yellow gold'];

    const bandData = useMemo(() => createBand(ringSize), [ringSize]);
    const gemParts = useMemo(() => createSimpleGem(stoneSize), [stoneSize]);
    const prongs = useMemo(() => createProngs(stoneSize), [stoneSize]);

    const stoneY = bandData.outerRadius - 0.01;

    // Gentle auto-rotation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Band */}
            <mesh geometry={bandData.geometry}>
                <meshStandardMaterial
                    color={metal.color}
                    roughness={metal.roughness}
                    metalness={metal.metalness}
                    envMapIntensity={1.5}
                />
            </mesh>

            {/* Prongs */}
            {prongs.map((geom, i) => (
                <mesh key={`prong-${i}`} geometry={geom} position={[0, stoneY, 0]}>
                    <meshStandardMaterial
                        color={metal.color}
                        roughness={metal.roughness}
                        metalness={metal.metalness}
                        envMapIntensity={1.5}
                    />
                </mesh>
            ))}

            {/* Diamond — simple sparkly glass look (no transmission) */}
            <group position={[0, stoneY + 0.15, 0]}>
                {gemParts.map((geom, i) => (
                    <mesh key={`gem-${i}`} geometry={geom}>
                        <meshPhysicalMaterial
                            color="#e8f4ff"
                            metalness={0.1}
                            roughness={0.0}
                            clearcoat={1.0}
                            clearcoatRoughness={0.0}
                            reflectivity={1.0}
                            envMapIntensity={3.0}
                            transparent={true}
                            opacity={0.85}
                        />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

// ─── Exported Component ───
export default function RingCanvas({ style, metalType, stoneShape, stoneSize, ringSize }) {
    // Check WebGL support before rendering
    if (typeof window !== 'undefined') {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (!gl) {
                return (
                    <div style={{
                        width: '100%', height: '100%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        background: '#000000', color: '#C5A467'
                    }}>
                        <p>Your browser does not support WebGL. Please try Chrome or Edge.</p>
                    </div>
                );
            }
        } catch (e) {
            // Silently continue — Canvas component will handle the error
        }
    }

    return (
        <CanvasErrorBoundary>
            <div style={{ width: '100%', height: '100%' }}>
                <Canvas
                    camera={{ position: [0, 1.2, 2.5], fov: 40 }}
                    gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
                    onCreated={({ gl }) => {
                        gl.toneMapping = THREE.ACESFilmicToneMapping;
                        gl.toneMappingExposure = 1.2;
                    }}
                >
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 10, 3]} intensity={1.5} />
                    <directionalLight position={[-5, 5, -5]} intensity={0.6} />
                    <pointLight position={[0, 3, 2]} intensity={0.8} />

                    <Suspense fallback={null}>
                        <RingScene
                            style={style}
                            metalType={metalType}
                            stoneShape={stoneShape}
                            stoneSize={stoneSize}
                            ringSize={ringSize}
                        />
                        <Environment preset="studio" />
                    </Suspense>

                    <OrbitControls
                        enableDamping
                        dampingFactor={0.05}
                        minDistance={1.2}
                        maxDistance={4.0}
                        maxPolarAngle={Math.PI / 2 + 0.15}
                    />
                </Canvas>
            </div>
        </CanvasErrorBoundary>
    );
}
