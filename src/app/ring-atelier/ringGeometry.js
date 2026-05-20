import * as THREE from 'three';

// ─── CENTER STONE GENERATION ───
// Generates beautiful faceted gemstone geometries procedurally
export function createGemGeometry(shape, sizeCarat) {
    // Calculate approximate scale based on carat weight (cube root relation to weight)
    const scale = Math.pow(sizeCarat, 1 / 3) * 0.45; // 1ct ~ 0.45 units radius
    
    let geometry;

    switch (shape.toLowerCase()) {
        case 'round': {
            // Standard round brilliant shape: crown + pavilion
            // We can construct this using a cylinder for the girdle, a cone for pavilion, and a cylinder/truncated cone for crown
            const radialSegments = 16;
            
            const girdleGeom = new THREE.CylinderGeometry(scale, scale, scale * 0.05, radialSegments);
            const pavilionGeom = new THREE.ConeGeometry(scale, scale * 0.6, radialSegments);
            pavilionGeom.translate(0, -scale * 0.3, 0); // Position below girdle
            pavilionGeom.rotateX(Math.PI); // Point down
            
            const crownGeom = new THREE.CylinderGeometry(scale * 0.55, scale, scale * 0.25, radialSegments);
            crownGeom.translate(0, scale * 0.15, 0); // Position above girdle

            // Merge geometries
            const group = new THREE.Group();
            const girdleMesh = new THREE.Mesh(girdleGeom);
            const pavilionMesh = new THREE.Mesh(pavilionGeom);
            const crownMesh = new THREE.Mesh(crownGeom);
            
            group.add(girdleMesh);
            group.add(pavilionMesh);
            group.add(crownMesh);
            
            // To return a single geometry, we can merge them or just use a grouped object
            // Group is cleaner for custom manipulation in React Three Fiber
            return { type: 'group', meshes: [girdleGeom, pavilionGeom, crownGeom] };
        }
        case 'princess': {
            // Square cut: double pyramid
            const boxGeom = new THREE.BoxGeometry(scale * 1.3, scale * 0.1, scale * 1.3);
            const pavilionGeom = new THREE.ConeGeometry(scale * 0.9, scale * 0.6, 4); // 4-sided cone
            pavilionGeom.rotateY(Math.PI / 4); // Align corners
            pavilionGeom.rotateX(Math.PI);
            pavilionGeom.translate(0, -scale * 0.35, 0);

            const crownGeom = new THREE.ConeGeometry(scale * 0.9, scale * 0.3, 4);
            crownGeom.rotateY(Math.PI / 4);
            crownGeom.translate(0, scale * 0.2, 0);

            return { type: 'group', meshes: [boxGeom, pavilionGeom, crownGeom] };
        }
        case 'oval': {
            // Oval is a scaled round brilliant
            const data = createGemGeometry('round', sizeCarat);
            return { ...data, scaleX: 1.35, scaleZ: 0.95 };
        }
        case 'cushion': {
            // Rounded square. We can take princess and round it out, or cylinder with 8 facets scaled
            const radialSegments = 8;
            const girdleGeom = new THREE.CylinderGeometry(scale * 1.1, scale * 1.1, scale * 0.08, radialSegments);
            const pavilionGeom = new THREE.ConeGeometry(scale * 1.1, scale * 0.6, radialSegments);
            pavilionGeom.translate(0, -scale * 0.34, 0);
            pavilionGeom.rotateX(Math.PI);
            
            const crownGeom = new THREE.CylinderGeometry(scale * 0.65, scale * 1.1, scale * 0.28, radialSegments);
            crownGeom.translate(0, scale * 0.18, 0);

            return { type: 'group', meshes: [girdleGeom, pavilionGeom, crownGeom], scaleX: 1.1, scaleZ: 1.1 };
        }
        case 'emerald': {
            // Rectangular step cut
            const boxGeom = new THREE.BoxGeometry(scale * 1.5, scale * 0.1, scale * 1.0);
            
            // Truncated pyramid for crown and pavilion
            const crownGeom = new THREE.BoxGeometry(scale * 1.1, scale * 0.3, scale * 0.7);
            crownGeom.translate(0, scale * 0.2, 0);

            const pavilionGeom = new THREE.ConeGeometry(scale * 0.8, scale * 0.5, 4);
            pavilionGeom.rotateY(Math.PI / 4);
            pavilionGeom.rotateX(Math.PI);
            pavilionGeom.translate(0, -scale * 0.3, 0);
            
            return { type: 'group', meshes: [boxGeom, pavilionGeom, crownGeom], scaleX: 1.1, scaleZ: 1.4 };
        }
        case 'pear': {
            // Teardrop: scale round diamond asymmetrically
            const data = createGemGeometry('round', sizeCarat);
            return { ...data, scaleX: 1.4, scaleZ: 0.9, taperY: true }; // Tapering handled in renderer
        }
        case 'marquise': {
            // Eye shape: scale round brilliant highly on X, squeeze Z
            const data = createGemGeometry('round', sizeCarat);
            return { ...data, scaleX: 1.7, scaleZ: 0.7 };
        }
        default:
            // Fallback round
            return createGemGeometry('round', sizeCarat);
    }
}

// ─── RING BAND GEOMETRY ───
// Generates the base ring band geometry based on style and size
export function createBandGeometry(style, ringSizeCode) {
    // Ring size maps to radius in units (scale factor)
    // Size 5 = ~15.7mm (radius 0.785), Size 10 = ~19.8mm (radius 0.99)
    const ringSizeNum = parseFloat(ringSizeCode) || 7;
    const innerRadius = 0.8 + (ringSizeNum - 5) * 0.02; // Map to ThreeJS units (around 0.8 to 1.1)
    const thickness = 0.11;
    const outerRadius = innerRadius + thickness;
    const width = 0.12;

    let geometries = [];

    switch (style.toLowerCase()) {
        case 'classic solitaire':
        case 'three-stone':
        case 'cathedral': {
            // Smooth, rounded classic band
            const geom = new THREE.TorusGeometry(innerRadius + thickness/2, thickness/2, 16, 64);
            // Rotate so it aligns upright (XZ plane)
            geom.rotateX(Math.PI / 2);
            geometries.push(geom);
            break;
        }
        case 'halo': {
            // A slightly flatter court band
            const geom = new THREE.TorusGeometry(innerRadius + thickness/2, thickness/2, 12, 64);
            geom.rotateX(Math.PI / 2);
            geometries.push(geom);
            break;
        }
        case 'pavé band': {
            // Solitaire-style band but we will place small diamonds on the top half
            const geom = new THREE.TorusGeometry(innerRadius + thickness/2, thickness/2, 16, 64);
            geom.rotateX(Math.PI / 2);
            geometries.push(geom);
            break;
        }
        case 'twisted band': {
            // Two intertwined thin bands
            const thinThickness = thickness * 0.6;
            
            const geom1 = new THREE.TorusGeometry(innerRadius + thinThickness/2, thinThickness/2, 12, 64);
            geom1.rotateX(Math.PI / 2);
            // Apply slight sinusoidal twist
            const pos = geom1.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                const angle = Math.atan2(y, x);
                pos.setZ(i, pos.getZ(i) + Math.sin(angle * 8) * 0.025);
            }
            geom1.computeVertexNormals();
            geometries.push(geom1);

            const geom2 = new THREE.TorusGeometry(innerRadius + thinThickness/2, thinThickness/2, 12, 64);
            geom2.rotateX(Math.PI / 2);
            const pos2 = geom2.attributes.position;
            for (let i = 0; i < pos2.count; i++) {
                const x = pos2.getX(i);
                const y = pos2.getY(i);
                const angle = Math.atan2(y, x);
                pos2.setZ(i, pos2.getZ(i) - Math.sin(angle * 8) * 0.025); // Inverted wave
            }
            geom2.computeVertexNormals();
            geometries.push(geom2);
            break;
        }
        default: {
            const geom = new THREE.TorusGeometry(innerRadius + thickness/2, thickness/2, 16, 64);
            geom.rotateX(Math.PI / 2);
            geometries.push(geom);
        }
    }

    return {
        geometries,
        innerRadius,
        outerRadius,
        thickness,
        width
    };
}

// ─── PRONGS & SETTINGS ───
// Generates the prongs holding the center diamond
export function createSettingGeometry(style, stoneShape, sizeCarat) {
    const scale = Math.pow(sizeCarat, 1 / 3) * 0.45;
    const height = scale * 0.8;
    const prongRadius = 0.02;

    const prongs = [];

    // Create 4 standard prongs around the stone
    const numProngs = (stoneShape.toLowerCase() === 'round' || stoneShape.toLowerCase() === 'oval') ? 4 : 4;
    for (let i = 0; i < numProngs; i++) {
        const angle = (i * 2 * Math.PI) / numProngs + (Math.PI / 4); // Offset by 45 deg to hold corners
        const px = Math.cos(angle) * (scale * 0.95);
        const pz = Math.sin(angle) * (scale * 0.95);

        const prongGeom = new THREE.CylinderGeometry(prongRadius, prongRadius * 0.7, height, 8);
        // Tilt prongs slightly outwards
        prongGeom.rotateZ(angle + Math.PI/2);
        prongGeom.rotateY(-angle);
        
        // Position them
        prongGeom.translate(px, height * 0.25, pz);
        prongs.push(prongGeom);
    }

    // A small collet/ring connecting the prongs at the bottom
    const ringGeom = new THREE.TorusGeometry(scale * 0.85, 0.015, 8, 32);
    ringGeom.rotateX(Math.PI / 2);
    ringGeom.translate(0, height * 0.05, 0);
    prongs.push(ringGeom);

    // If it's a Halo style, we add a halo ring of tiny pave diamonds and a larger collet
    if (style.toLowerCase() === 'halo') {
        const haloGeom = new THREE.TorusGeometry(scale * 1.3, scale * 0.12, 12, 32);
        haloGeom.rotateX(Math.PI / 2);
        haloGeom.translate(0, height * 0.5, 0);
        prongs.push(haloGeom);
    }

    return prongs;
}
