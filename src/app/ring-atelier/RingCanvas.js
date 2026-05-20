'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { createGemGeometry, createBandGeometry, createSettingGeometry } from './ringGeometry';

// Metal materials configuration
const METAL_COLORS = {
    // 9KT Yellow Gold
    '9kt yellow gold': { color: '#E5C483', roughness: 0.12, metalness: 1.0 },
    // 14KT Yellow Gold
    '14kt yellow gold': { color: '#EACD95', roughness: 0.10, metalness: 1.0 },
    // 18KT Yellow Gold
    '18kt yellow gold': { color: '#F3DCA2', roughness: 0.08, metalness: 1.0 },
    // 9KT White Gold
    '9kt white gold': { color: '#EBEBEB', roughness: 0.12, metalness: 1.0 },
    // 14KT White Gold
    '14kt white gold': { color: '#F0F0F0', roughness: 0.10, metalness: 1.0 },
    // 18KT White Gold
    '18kt white gold': { color: '#F5F5F5', roughness: 0.08, metalness: 1.0 },
    // 9KT Rose Gold
    '9kt rose gold': { color: '#D99F94', roughness: 0.12, metalness: 1.0 },
    // 14KT Rose Gold
    '14kt rose gold': { color: '#E2B2A7', roughness: 0.10, metalness: 1.0 },
    // 18KT Rose Gold
    '18kt rose gold': { color: '#E8BFB5', roughness: 0.08, metalness: 1.0 },
    // 925 Silver
    '925 silver': { color: '#D5D5D5', roughness: 0.15, metalness: 1.0 }
};

// Procedural Ring Component
function ProceduralRing({ style, metalType, stoneShape, stoneSize, ringSize }) {
    const ringGroupRef = useRef();

    // 1. Band Geometry
    const bandData = useMemo(() => createBandGeometry(style, ringSize), [style, ringSize]);
    
    // 2. Center Stone Geometry
    const gemData = useMemo(() => createGemGeometry(stoneShape, stoneSize), [stoneShape, stoneSize]);
    
    // 3. Prong Setting Geometry
    const settingGeometries = useMemo(() => createSettingGeometry(style, stoneShape, stoneSize), [style, stoneShape, stoneSize]);

    // 4. Metal Material Properties
    const metalProps = useMemo(() => {
        const key = metalType.toLowerCase();
        return METAL_COLORS[key] || METAL_COLORS['18kt yellow gold'];
    }, [metalType]);

    // 5. Gem Material Properties (Physical transmission glass for diamonds)
    const gemMaterial = useMemo(() => {
        return new THREE.MeshPhysicalMaterial({
            color: '#ffffff',
            metalness: 0,
            roughness: 0,
            transmission: 1.0,      // Fully transmissive PBR
            ior: 2.417,            // Diamond refractive index
            thickness: 0.9,         // Light bending depth
            transparent: true,
            opacity: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0,
            envMapIntensity: 3.0,
            // Fallback dispersion
            attenuationColor: '#ffffff',
            attenuationDistance: 1,
        });
    }, []);

    // Rotate ring slowly over time
    useFrame((state) => {
        if (ringGroupRef.current) {
            // Very gentle auto-rotation
            ringGroupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
        }
    });

    // Center stone position on top of the ring
    const stoneY = bandData.outerRadius - 0.01;

    return (
        <group ref={ringGroupRef}>
            {/* The Metal Band */}
            {bandData.geometries.map((geom, idx) => (
                <mesh key={`band-${idx}`} geometry={geom}>
                    <meshPhysicalMaterial 
                        color={metalProps.color}
                        roughness={metalProps.roughness}
                        metalness={metalProps.metalness}
                        clearcoat={1.0}
                        clearcoatRoughness={0.05}
                        envMapIntensity={2.0}
                    />
                </mesh>
            ))}

            {/* The Setting (Prongs, bezel, halo) */}
            {settingGeometries.map((geom, idx) => (
                <mesh key={`prong-${idx}`} geometry={geom} position={[0, stoneY, 0]}>
                    <meshPhysicalMaterial 
                        color={metalProps.color}
                        roughness={metalProps.roughness}
                        metalness={metalProps.metalness}
                        clearcoat={1.0}
                        clearcoatRoughness={0.05}
                        envMapIntensity={2.0}
                    />
                </mesh>
            ))}

            {/* The Center Gemstone */}
            {gemData.type === 'group' ? (
                <group 
                    position={[0, stoneY + 0.15, 0]} 
                    scale={[
                        gemData.scaleX || 1, 
                        1, 
                        gemData.scaleZ || 1
                    ]}
                >
                    {gemData.meshes.map((geom, idx) => (
                        <mesh key={`gem-${idx}`} geometry={geom} material={gemMaterial} />
                    ))}
                </group>
            ) : (
                <mesh 
                    geometry={gemData} 
                    material={gemMaterial} 
                    position={[0, stoneY + 0.15, 0]} 
                />
            )}

            {/* Halo Side Gems (if Halo style is selected) */}
            {style.toLowerCase() === 'halo' && (
                <group position={[0, stoneY, 0]}>
                    {/* Render a circle of tiny halo diamonds */}
                    {Array.from({ length: 14 }).map((_, idx) => {
                        const scale = Math.pow(stoneSize, 1 / 3) * 0.45;
                        const radius = scale * 1.3;
                        const angle = (idx * 2 * Math.PI) / 14;
                        const x = Math.cos(angle) * radius;
                        const z = Math.sin(angle) * radius;
                        
                        const tinyGemData = createGemGeometry('round', 0.03); // Tiny 0.03ct diamond
                        return (
                            <group key={`halo-gem-${idx}`} position={[x, scale * 0.8, z]} scale={[0.12, 0.12, 0.12]}>
                                {tinyGemData.meshes.map((geom, gIdx) => (
                                    <mesh key={`halo-gem-mesh-${gIdx}`} geometry={geom} material={gemMaterial} />
                                ))}
                            </group>
                        );
                    })}
                </group>
            )}

            {/* Pavé Side Gems (if Pavé Band style is selected) */}
            {style.toLowerCase() === 'pavé band' && (
                <group>
                    {/* Render small diamonds along the top arc of the band */}
                    {Array.from({ length: 10 }).map((_, idx) => {
                        // Place gems from -45 degrees to +45 degrees along the top of the ring
                        const angle = Math.PI/2 + (idx - 4.5) * 0.12; 
                        const r = bandData.innerRadius + bandData.thickness * 0.75;
                        const x = Math.cos(angle) * r;
                        const y = Math.sin(angle) * r;
                        
                        const tinyGemData = createGemGeometry('round', 0.02);
                        return (
                            <group 
                                key={`pave-gem-${idx}`} 
                                position={[x, y, 0]} 
                                rotation={[0, 0, angle - Math.PI/2]}
                                scale={[0.1, 0.1, 0.1]}
                            >
                                {tinyGemData.meshes.map((geom, gIdx) => (
                                    <mesh key={`pave-gem-mesh-${gIdx}`} geometry={geom} material={gemMaterial} />
                                ))}
                            </group>
                        );
                    })}
                </group>
            )}

            {/* Three-Stone Flanking Gems (if Three-Stone style is selected) */}
            {style.toLowerCase() === 'three-stone' && (
                <group position={[0, stoneY + 0.1, 0]}>
                    {/* Left Stone */}
                    <group position={[-0.28, 0, 0]} scale={[0.65, 0.65, 0.65]} rotation={[0, 0, 0.2]}>
                        {createGemGeometry(stoneShape, stoneSize).meshes.map((geom, gIdx) => (
                            <mesh key={`side-gem-l-${gIdx}`} geometry={geom} material={gemMaterial} />
                        ))}
                    </group>
                    {/* Right Stone */}
                    <group position={[0.28, 0, 0]} scale={[0.65, 0.65, 0.65]} rotation={[0, 0, -0.2]}>
                        {createGemGeometry(stoneShape, stoneSize).meshes.map((geom, gIdx) => (
                            <mesh key={`side-gem-r-${gIdx}`} geometry={geom} material={gemMaterial} />
                        ))}
                    </group>
                </group>
            )}
        </group>
    );
}

// Main 3D Canvas component
export default function RingCanvas({ style, metalType, stoneShape, stoneSize, ringSize }) {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas
                shadows
                camera={{ position: [0, 1.2, 2.5], fov: 40 }}
                gl={{ antialias: true, alpha: true }}
            >
                {/* Clean Studio Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight 
                    position={[5, 10, 3]} 
                    intensity={1.2} 
                    castShadow 
                    shadow-mapSize-width={1024} 
                    shadow-mapSize-height={1024} 
                />
                <directionalLight position={[-5, 5, -5]} intensity={0.6} />
                <pointLight position={[0, 3, 2]} intensity={0.8} />

                {/* Ring Visual Instance */}
                <ProceduralRing 
                    style={style} 
                    metalType={metalType} 
                    stoneShape={stoneShape} 
                    stoneSize={stoneSize} 
                    ringSize={ringSize} 
                />

                {/* Natural Soft Shadow underneath */}
                <ContactShadows 
                    position={[0, -1.0, 0]} 
                    opacity={0.6} 
                    scale={4} 
                    blur={2} 
                    far={1.5} 
                />

                {/* Environment Reflections Map (Studio preset) */}
                <Environment preset="studio" />

                {/* Interactive Drag Orbit Controls */}
                <OrbitControls 
                    enableDamping 
                    dampingFactor={0.05}
                    minDistance={1.2}
                    maxDistance={4.0}
                    maxPolarAngle={Math.PI / 2 + 0.15} // Don't look too far from below
                />
            </Canvas>
        </div>
    );
}
