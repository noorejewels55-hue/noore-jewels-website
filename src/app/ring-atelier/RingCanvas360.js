'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

// ═══════════════════════════════════════════════════════════════════
// PHOTOREAL 360° — Zero-WebGL Diamond Ring Visualization Engine
// by Noore Jewels
//
// A revolutionary ring renderer using ONLY Canvas 2D + Math.
// No WebGL, no Three.js, no GPU dependency. Works on 100% of devices.
// ═══════════════════════════════════════════════════════════════════

// ─── 3D Vector Math ───────────────────────────────────────────────
const V = {
    sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }),
    add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
    scale: (v, s) => ({ x: v.x * s, y: v.y * s, z: v.z * s }),
    dot: (a, b) => a.x * b.x + a.y * b.y + a.z * b.z,
    cross: (a, b) => ({
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x,
    }),
    len: (v) => Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z),
    norm: (v) => {
        const l = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
        return { x: v.x / l, y: v.y / l, z: v.z / l };
    },
    reflect: (incident, normal) => {
        const d = 2 * V.dot(incident, normal);
        return { x: incident.x - d * normal.x, y: incident.y - d * normal.y, z: incident.z - d * normal.z };
    },
};

// ─── 3D Rotation & Projection ─────────────────────────────────────
function rotatePoint(p, rx, ry) {
    // Rotate around Y axis
    let x = p.x * Math.cos(ry) - p.z * Math.sin(ry);
    let z = p.x * Math.sin(ry) + p.z * Math.cos(ry);
    let y = p.y;
    // Rotate around X axis
    const y2 = y * Math.cos(rx) - z * Math.sin(rx);
    const z2 = y * Math.sin(rx) + z * Math.cos(rx);
    return { x, y: y2, z: z2 };
}

function project(p, w, h, fov = 4.0) {
    const scale = fov / (fov + p.z);
    return {
        x: w / 2 + p.x * scale * w * 0.38,
        y: h / 2 - p.y * scale * h * 0.38,
        scale,
    };
}

// ─── Face Normal Calculation ──────────────────────────────────────
function faceNormal(verts) {
    if (verts.length < 3) return { x: 0, y: 1, z: 0 };
    const edge1 = V.sub(verts[1], verts[0]);
    const edge2 = V.sub(verts[2], verts[0]);
    return V.norm(V.cross(edge1, edge2));
}

function faceCenter(verts) {
    const c = { x: 0, y: 0, z: 0 };
    for (const v of verts) { c.x += v.x; c.y += v.y; c.z += v.z; }
    const n = verts.length;
    return { x: c.x / n, y: c.y / n, z: c.z / n };
}

// ─── Metal Material Definitions ───────────────────────────────────
const METAL_MATERIALS = {
    '18kt yellow gold': { base: [243, 220, 162], hi: [255, 248, 225], sh: [165, 125, 45], specPow: 50 },
    '14kt yellow gold': { base: [234, 205, 149], hi: [255, 242, 215], sh: [155, 115, 38], specPow: 45 },
    '9kt yellow gold':  { base: [229, 196, 131], hi: [250, 235, 200], sh: [148, 108, 32], specPow: 40 },
    '18kt white gold':  { base: [238, 238, 242], hi: [255, 255, 255], sh: [170, 170, 185], specPow: 60 },
    '14kt white gold':  { base: [232, 232, 238], hi: [255, 255, 255], sh: [165, 165, 180], specPow: 55 },
    '9kt white gold':   { base: [226, 226, 232], hi: [250, 250, 255], sh: [160, 160, 175], specPow: 50 },
    '18kt rose gold':   { base: [232, 185, 175], hi: [255, 225, 218], sh: [162, 105, 95], specPow: 48 },
    '14kt rose gold':   { base: [226, 172, 162], hi: [250, 215, 208], sh: [155, 98, 88], specPow: 44 },
    '9kt rose gold':    { base: [217, 155, 142], hi: [245, 200, 192], sh: [145, 88, 78], specPow: 40 },
    '925 silver':       { base: [210, 210, 218], hi: [255, 255, 255], sh: [140, 140, 158], specPow: 65 },
};

function getMetalMaterial(metalType) {
    const key = metalType.toLowerCase().replace(/\s+/g, ' ');
    for (const [k, v] of Object.entries(METAL_MATERIALS)) {
        if (key.includes(k) || k.includes(key)) return v;
    }
    // Fuzzy match by purity and color
    if (key.includes('yellow')) {
        if (key.includes('18')) return METAL_MATERIALS['18kt yellow gold'];
        if (key.includes('14')) return METAL_MATERIALS['14kt yellow gold'];
        return METAL_MATERIALS['9kt yellow gold'];
    }
    if (key.includes('white')) {
        if (key.includes('18')) return METAL_MATERIALS['18kt white gold'];
        if (key.includes('14')) return METAL_MATERIALS['14kt white gold'];
        return METAL_MATERIALS['9kt white gold'];
    }
    if (key.includes('rose')) {
        if (key.includes('18')) return METAL_MATERIALS['18kt rose gold'];
        if (key.includes('14')) return METAL_MATERIALS['14kt rose gold'];
        return METAL_MATERIALS['9kt rose gold'];
    }
    if (key.includes('silver')) return METAL_MATERIALS['925 silver'];
    return METAL_MATERIALS['18kt yellow gold'];
}

// ─── Girdle Outline Generator (supports all stone shapes) ─────────
function getGirdleOutline(shape, radius, segments) {
    const pts = [];
    for (let i = 0; i < segments; i++) {
        const t = (i / segments) * Math.PI * 2;
        let x, z;
        switch (shape.toLowerCase()) {
            case 'round':
                x = Math.cos(t) * radius;
                z = Math.sin(t) * radius;
                break;
            case 'princess': {
                const c = Math.cos(t), s = Math.sin(t);
                const mx = Math.max(Math.abs(c), Math.abs(s));
                x = (c / mx) * radius * 0.88;
                z = (s / mx) * radius * 0.88;
                break;
            }
            case 'oval':
                x = Math.cos(t) * radius * 1.32;
                z = Math.sin(t) * radius * 0.78;
                break;
            case 'cushion': {
                const n = 3.0;
                const c = Math.cos(t), s = Math.sin(t);
                const r = Math.pow(Math.pow(Math.abs(c), n) + Math.pow(Math.abs(s), n), -1 / n);
                x = c * r * radius * 1.05;
                z = s * r * radius * 1.05;
                break;
            }
            case 'emerald':
                x = Math.cos(t) * radius * 1.38;
                z = Math.sin(t) * radius * 0.88;
                break;
            case 'pear': {
                const factor = 1 + 0.32 * Math.sin(t);
                x = Math.cos(t) * radius * factor;
                z = Math.sin(t) * radius * 0.82;
                break;
            }
            case 'marquise':
                x = Math.cos(t) * radius * 1.55;
                z = Math.sin(t) * radius * 0.52;
                break;
            default:
                x = Math.cos(t) * radius;
                z = Math.sin(t) * radius;
        }
        pts.push({ x, z });
    }
    return pts;
}

// ─── Geometry: Torus (Ring Band) ──────────────────────────────────
function buildTorus(R, r, uSegs, vSegs, style) {
    const faces = [];
    const verts = [];

    // Generate vertex grid
    for (let i = 0; i <= uSegs; i++) {
        const u = (i / uSegs) * Math.PI * 2;
        for (let j = 0; j <= vSegs; j++) {
            const v = (j / vSegs) * Math.PI * 2;
            let x = (R + r * Math.cos(v)) * Math.cos(u);
            let y = r * Math.sin(v);
            let z = (R + r * Math.cos(v)) * Math.sin(u);

            // Twisted band: apply sinusoidal offset
            if (style && style.toLowerCase() === 'twisted band') {
                const twist = Math.sin(u * 6) * 0.022;
                y += twist;
            }

            verts.push({ x, y, z, ui: i, vi: j });
        }
    }

    // Generate quad faces
    for (let i = 0; i < uSegs; i++) {
        for (let j = 0; j < vSegs; j++) {
            const a = i * (vSegs + 1) + j;
            const b = a + 1;
            const c = (i + 1) * (vSegs + 1) + j + 1;
            const d = (i + 1) * (vSegs + 1) + j;
            faces.push({
                verts: [verts[a], verts[b], verts[c], verts[d]],
                type: 'metal',
            });
        }
    }

    return { faces, R, r };
}

// ─── Geometry: Twisted Band (two interleaved tori) ────────────────
function buildTwistedBand(R, r, uSegs, vSegs) {
    const faces = [];
    const thinR = r * 0.65;

    for (let band = 0; band < 2; band++) {
        const phaseOffset = band * Math.PI;
        const verts = [];

        for (let i = 0; i <= uSegs; i++) {
            const u = (i / uSegs) * Math.PI * 2;
            for (let j = 0; j <= vSegs; j++) {
                const v = (j / vSegs) * Math.PI * 2;
                const twist = Math.sin(u * 4 + phaseOffset) * 0.03;
                const x = (R + thinR * Math.cos(v)) * Math.cos(u);
                const y = thinR * Math.sin(v) + twist;
                const z = (R + thinR * Math.cos(v)) * Math.sin(u);
                verts.push({ x, y, z });
            }
        }

        for (let i = 0; i < uSegs; i++) {
            for (let j = 0; j < vSegs; j++) {
                const a = i * (vSegs + 1) + j;
                const b = a + 1;
                const c = (i + 1) * (vSegs + 1) + j + 1;
                const d = (i + 1) * (vSegs + 1) + j;
                faces.push({ verts: [verts[a], verts[b], verts[c], verts[d]], type: 'metal' });
            }
        }
    }

    return { faces, R, r };
}

// ─── Geometry: Diamond (Brilliant Cut) ────────────────────────────
function buildDiamond(shape, caratSize, offsetY) {
    const scale = Math.pow(caratSize, 1 / 3) * 0.28;
    const girdleR = scale;
    const tableR = scale * 0.52;
    const crownH = scale * 0.32;
    const pavilionH = scale * 0.58;
    const girdleSegs = 16;
    const tableSegs = 8;

    const girdle = getGirdleOutline(shape, girdleR, girdleSegs);
    const table = getGirdleOutline(shape, tableR, tableSegs);
    const culet = { x: 0, y: offsetY - pavilionH, z: 0 };
    const tableCenter = { x: 0, y: offsetY + crownH + 0.01, z: 0 };

    const faces = [];

    // Table facets (fan from center)
    for (let i = 0; i < tableSegs; i++) {
        const ni = (i + 1) % tableSegs;
        faces.push({
            verts: [
                tableCenter,
                { x: table[i].x, y: offsetY + crownH, z: table[i].z },
                { x: table[ni].x, y: offsetY + crownH, z: table[ni].z },
            ],
            type: 'diamond',
            facetType: 'table',
        });
    }

    // Crown facets (table edge to girdle)
    for (let i = 0; i < girdleSegs; i++) {
        const ni = (i + 1) % girdleSegs;
        const ti = Math.round((i / girdleSegs) * tableSegs) % tableSegs;
        const tni = Math.round((ni / girdleSegs) * tableSegs) % tableSegs;

        if (ti === tni) {
            // Star facet: 2 girdle + 1 table vertex
            faces.push({
                verts: [
                    { x: girdle[i].x, y: offsetY, z: girdle[i].z },
                    { x: girdle[ni].x, y: offsetY, z: girdle[ni].z },
                    { x: table[ti].x, y: offsetY + crownH, z: table[ti].z },
                ],
                type: 'diamond',
                facetType: 'crown',
            });
        } else {
            // Bezel facet pair: creates trapezoidal crown surface
            faces.push({
                verts: [
                    { x: girdle[i].x, y: offsetY, z: girdle[i].z },
                    { x: girdle[ni].x, y: offsetY, z: girdle[ni].z },
                    { x: table[tni].x, y: offsetY + crownH, z: table[tni].z },
                ],
                type: 'diamond',
                facetType: 'crown',
            });
            faces.push({
                verts: [
                    { x: girdle[i].x, y: offsetY, z: girdle[i].z },
                    { x: table[tni].x, y: offsetY + crownH, z: table[tni].z },
                    { x: table[ti].x, y: offsetY + crownH, z: table[ti].z },
                ],
                type: 'diamond',
                facetType: 'crown',
            });
        }
    }

    // Pavilion facets (girdle to culet)
    for (let i = 0; i < girdleSegs; i++) {
        const ni = (i + 1) % girdleSegs;
        faces.push({
            verts: [
                { x: girdle[i].x, y: offsetY, z: girdle[i].z },
                { x: girdle[ni].x, y: offsetY, z: girdle[ni].z },
                culet,
            ],
            type: 'diamond',
            facetType: 'pavilion',
        });
    }

    return faces;
}

// ─── Geometry: Prongs ─────────────────────────────────────────────
function buildProngs(caratSize, bandOuterY, numProngs = 4) {
    const scale = Math.pow(caratSize, 1 / 3) * 0.28;
    const w = scale * 0.055;
    const prongR = scale * 0.82;
    const bottomY = bandOuterY - 0.015;
    const topY = bandOuterY + scale * 0.28;
    const faces = [];

    for (let p = 0; p < numProngs; p++) {
        const angle = (p / numProngs) * Math.PI * 2 + Math.PI / numProngs;
        const cx = Math.cos(angle) * prongR;
        const cz = Math.sin(angle) * prongR;
        const tx = -Math.sin(angle) * w;
        const tz = Math.cos(angle) * w;

        // Front & back faces of a thin prong
        const v0 = { x: cx - tx, y: bottomY, z: cz - tz };
        const v1 = { x: cx + tx, y: bottomY, z: cz + tz };
        const v2 = { x: cx + tx * 0.7, y: topY, z: cz + tz * 0.7 };
        const v3 = { x: cx - tx * 0.7, y: topY, z: cz - tz * 0.7 };

        faces.push({ verts: [v0, v1, v2, v3], type: 'metal' });
        // Back face (reverse winding)
        faces.push({ verts: [v3, v2, v1, v0], type: 'metal' });
    }

    return faces;
}

// ─── Geometry: Halo (ring of small sparkle facets) ────────────────
function buildHaloRing(caratSize, offsetY) {
    const scale = Math.pow(caratSize, 1 / 3) * 0.28;
    const haloR = scale * 1.25;
    const numStones = 14;
    const stoneR = scale * 0.08;
    const faces = [];

    for (let i = 0; i < numStones; i++) {
        const angle = (i / numStones) * Math.PI * 2;
        const cx = Math.cos(angle) * haloR;
        const cz = Math.sin(angle) * haloR;
        const cy = offsetY + scale * 0.05;

        // Tiny diamond: 4 triangles forming a miniature brilliant
        const top = { x: cx, y: cy + stoneR, z: cz };
        const bot = { x: cx, y: cy - stoneR * 0.6, z: cz };
        for (let f = 0; f < 4; f++) {
            const a1 = angle + (f / 4) * Math.PI * 2;
            const a2 = angle + ((f + 1) / 4) * Math.PI * 2;
            const p1 = { x: cx + Math.cos(a1) * stoneR * 0.7, y: cy, z: cz + Math.sin(a1) * stoneR * 0.7 };
            const p2 = { x: cx + Math.cos(a2) * stoneR * 0.7, y: cy, z: cz + Math.sin(a2) * stoneR * 0.7 };
            faces.push({ verts: [top, p1, p2], type: 'diamond', facetType: 'halo' });
            faces.push({ verts: [bot, p2, p1], type: 'diamond', facetType: 'halo' });
        }
    }

    return faces;
}

// ─── Geometry: Pavé stones along band ─────────────────────────────
function buildPaveStones(R, r, numStones) {
    const faces = [];
    const stoneR = 0.018;

    for (let i = 0; i < numStones; i++) {
        const u = (i / numStones) * Math.PI * 2;
        const cx = (R + r + stoneR * 0.5) * Math.cos(u);
        const cy = r + stoneR * 0.5;
        const cz = (R + r + stoneR * 0.5) * Math.sin(u);

        const top = { x: cx, y: cy + stoneR, z: cz };
        const bot = { x: cx, y: cy - stoneR * 0.3, z: cz };
        for (let f = 0; f < 4; f++) {
            const a1 = u + (f / 4) * Math.PI * 2;
            const a2 = u + ((f + 1) / 4) * Math.PI * 2;
            const p1 = { x: cx + Math.cos(a1) * stoneR * 0.6, y: cy, z: cz + Math.sin(a1) * stoneR * 0.6 };
            const p2 = { x: cx + Math.cos(a2) * stoneR * 0.6, y: cy, z: cz + Math.sin(a2) * stoneR * 0.6 };
            faces.push({ verts: [top, p1, p2], type: 'diamond', facetType: 'pave' });
            faces.push({ verts: [bot, p2, p1], type: 'diamond', facetType: 'pave' });
        }
    }

    return faces;
}

// ─── Scene Builder ────────────────────────────────────────────────
function buildScene(style, stoneShape, stoneSize, ringSize) {
    const sizeNum = parseFloat(ringSize) || 7;
    const innerR = 0.65 + (sizeNum - 5) * 0.018;
    const bandThickness = 0.085;
    const R = innerR + bandThickness / 2;
    const r = bandThickness / 2;
    const uSegs = 40;
    const vSegs = 14;

    let allFaces = [];
    const bandOuterY = R + r;
    const stoneY = bandOuterY + 0.01;

    // Build band based on style
    const styleLower = (style || '').toLowerCase();
    if (styleLower === 'twisted band') {
        const band = buildTwistedBand(R, r, uSegs, vSegs);
        allFaces = allFaces.concat(band.faces);
    } else {
        const band = buildTorus(R, r, uSegs, vSegs, style);
        allFaces = allFaces.concat(band.faces);
    }

    // Prongs
    const prongs = buildProngs(stoneSize, stoneY);
    allFaces = allFaces.concat(prongs);

    // Center diamond
    const diamond = buildDiamond(stoneShape, stoneSize, stoneY);
    allFaces = allFaces.concat(diamond);

    // Style-specific additions
    if (styleLower === 'halo') {
        const halo = buildHaloRing(stoneSize, stoneY);
        allFaces = allFaces.concat(halo);
    }

    if (styleLower === 'pavé band' || styleLower === 'pave band') {
        const pave = buildPaveStones(R, r, 20);
        allFaces = allFaces.concat(pave);
    }

    if (styleLower === 'three-stone') {
        // Two side diamonds at ±35 degrees on the band
        const sideSize = stoneSize * 0.55;
        for (const angleOffset of [-0.6, 0.6]) {
            const sx = Math.cos(angleOffset) * R * 0.9;
            const sz = Math.sin(angleOffset) * R * 0.9;
            const sideDiamond = buildDiamond(stoneShape, sideSize, stoneY * 0.92);
            // Offset the side diamond vertices
            for (const face of sideDiamond) {
                face.verts = face.verts.map(v => ({
                    x: v.x + sx,
                    y: v.y,
                    z: v.z + sz,
                }));
            }
            allFaces = allFaces.concat(sideDiamond);
            // Side prongs
            const sideP = buildProngs(sideSize, stoneY * 0.92, 3);
            for (const face of sideP) {
                face.verts = face.verts.map(v => ({
                    x: v.x + sx,
                    y: v.y,
                    z: v.z + sz,
                }));
            }
            allFaces = allFaces.concat(sideP);
        }
    }

    if (styleLower === 'cathedral') {
        // Two arch supports from band to setting
        const archScale = Math.pow(stoneSize, 1 / 3) * 0.28;
        for (const side of [-1, 1]) {
            const archFaces = [];
            const steps = 8;
            for (let i = 0; i < steps; i++) {
                const t0 = i / steps;
                const t1 = (i + 1) / steps;
                const y0 = Math.sin(t0 * Math.PI) * archScale * 0.5 + r;
                const y1 = Math.sin(t1 * Math.PI) * archScale * 0.5 + r;
                const x0 = side * (archScale * 0.4 * (1 - t0) + archScale * 0.1 * t0);
                const x1 = side * (archScale * 0.4 * (1 - t1) + archScale * 0.1 * t1);
                const w = 0.015;
                archFaces.push({
                    verts: [
                        { x: x0, y: y0, z: -w },
                        { x: x1, y: y1, z: -w },
                        { x: x1, y: y1, z: w },
                        { x: x0, y: y0, z: w },
                    ],
                    type: 'metal',
                });
            }
            allFaces = allFaces.concat(archFaces);
        }
    }

    return allFaces;
}

// ─── Lighting: Metallic Phong ─────────────────────────────────────
function computeMetalColor(normal, lightDir, viewDir, material, lightDir2) {
    const NdotL = Math.max(0, V.dot(normal, lightDir));
    const NdotL2 = Math.max(0, V.dot(normal, lightDir2));

    const R = V.reflect(V.scale(lightDir, -1), normal);
    const RdotV = Math.max(0, V.dot(R, viewDir));
    const specular = Math.pow(RdotV, material.specPow);

    const R2 = V.reflect(V.scale(lightDir2, -1), normal);
    const RdotV2 = Math.max(0, V.dot(R2, viewDir));
    const specular2 = Math.pow(RdotV2, material.specPow * 0.8) * 0.4;

    // Fresnel-like rim effect
    const VdotN = Math.max(0, V.dot(viewDir, normal));
    const fresnel = Math.pow(1 - VdotN, 3) * 0.35;

    const ambient = 0.18;
    const diffuse = NdotL * 0.55 + NdotL2 * 0.2;
    const spec = specular + specular2;
    const totalLight = ambient + diffuse;

    const r = Math.min(255, material.base[0] * totalLight + material.hi[0] * spec * 1.2 + material.hi[0] * fresnel);
    const g = Math.min(255, material.base[1] * totalLight + material.hi[1] * spec * 1.2 + material.hi[1] * fresnel);
    const b = Math.min(255, material.base[2] * totalLight + material.hi[2] * spec * 1.2 + material.hi[2] * fresnel);

    return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

// ─── Lighting: Diamond Fire (Chromatic Dispersion) ────────────────
function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) { r = g = b = l; } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function computeDiamondColor(normal, lightDir, viewDir, time, facetType) {
    const NdotL = Math.max(0, V.dot(normal, lightDir));
    const R = V.reflect(V.scale(lightDir, -1), normal);
    const RdotV = Math.max(0, V.dot(R, viewDir));
    const specular = Math.pow(RdotV, 25);

    // Chromatic dispersion angle — simulates different IOR for different wavelengths
    const dispersionAngle = Math.acos(Math.min(1, Math.abs(NdotL)));
    const hue = ((dispersionAngle * 200) + time * 15 + normal.x * 120 + normal.z * 80) % 360;

    // Strong sparkle: show vivid spectral color
    if (specular > 0.25) {
        const sat = 72 + specular * 28;
        const light = 58 + specular * 42;
        const [r, g, b] = hslToRgb(hue, sat, Math.min(98, light));
        return { rgb: `rgb(${r},${g},${b})`, sparkle: specular, alpha: 0.92 };
    }

    // Medium reflection: subtle color tint
    if (NdotL > 0.3) {
        const sat = 15 + NdotL * 35;
        const light = 78 + NdotL * 18;
        const [r, g, b] = hslToRgb(hue, sat, light);
        return { rgb: `rgb(${r},${g},${b})`, sparkle: 0, alpha: 0.87 };
    }

    // Base diamond body: cool blue-white
    const bodyLight = 82 + NdotL * 15;
    const [r, g, b] = hslToRgb(215, 12, bodyLight);
    return { rgb: `rgb(${r},${g},${b})`, sparkle: 0, alpha: 0.82 };
}

// ─── Sparkle Cross-Hair Effect ────────────────────────────────────
function drawSparkle(ctx, x, y, size, alpha, hue) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Six-point star
    const rays = 6;
    for (let i = 0; i < rays; i++) {
        const angle = (i / rays) * Math.PI;
        const dx = Math.cos(angle) * size;
        const dy = Math.sin(angle) * size;

        const grad = ctx.createLinearGradient(x - dx, y - dy, x + dx, y + dy);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.35, `rgba(255,255,255,${alpha * 0.3})`);
        grad.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(0.65, `rgba(255,255,255,${alpha * 0.3})`);
        grad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(x - dx, y - dy);
        ctx.lineTo(x + dx, y + dy);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    // Center glow
    const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 0.3);
    const [gr, gg, gb] = hslToRgb(hue, 50, 95);
    glow.addColorStop(0, `rgba(${gr},${gg},${gb},${alpha})`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(x - size * 0.3, y - size * 0.3, size * 0.6, size * 0.6);

    ctx.restore();
}

// ─── Ground Shadow ────────────────────────────────────────────────
function drawGroundShadow(ctx, w, h) {
    const cx = w / 2;
    const cy = h * 0.72;
    const rx = w * 0.18;
    const ry = h * 0.025;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    grad.addColorStop(0, 'rgba(0,0,0,0.35)');
    grad.addColorStop(0.7, 'rgba(0,0,0,0.1)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
}

// ─── Diamond Ambient Glow ─────────────────────────────────────────
function drawDiamondGlow(ctx, x, y, size, time) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const pulse = 0.7 + Math.sin(time * 2) * 0.3;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, size);
    glow.addColorStop(0, `rgba(200, 220, 255, ${0.12 * pulse})`);
    glow.addColorStop(0.5, `rgba(180, 200, 255, ${0.04 * pulse})`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
    ctx.restore();
}

// ─── Main Render Frame ────────────────────────────────────────────
function renderFrame(ctx, w, h, allFaces, rotX, rotY, lightX, lightY, metalMat, time) {
    // Background gradient
    const bgGrad = ctx.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, w * 0.65);
    bgGrad.addColorStop(0, '#141214');
    bgGrad.addColorStop(0.6, '#0c0b0d');
    bgGrad.addColorStop(1, '#080808');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Ground shadow
    drawGroundShadow(ctx, w, h);

    // Light directions (cursor-tracking key light + fixed fill light)
    const lightDir = V.norm({ x: lightX * 0.8, y: lightY * 0.5 + 0.7, z: 0.9 });
    const lightDir2 = V.norm({ x: -0.5, y: 0.4, z: -0.6 }); // fill
    const viewDir = V.norm({ x: 0, y: 0, z: 1 });

    // Transform all faces, compute lighting, prepare for sorting
    const renderList = [];
    const sparkles = [];

    for (const face of allFaces) {
        // Transform vertices
        const transformed = face.verts.map(v => rotatePoint(v, rotX, rotY));
        const normal = faceNormal(transformed);

        // Back-face culling (skip faces pointing away from viewer)
        if (V.dot(normal, viewDir) < -0.05) continue;

        const center = faceCenter(transformed);
        const projected = transformed.map(v => project(v, w, h));
        const centerProj = project(center, w, h);

        let color, alpha = 1;

        if (face.type === 'diamond') {
            const dc = computeDiamondColor(normal, lightDir, viewDir, time, face.facetType);
            color = dc.rgb;
            alpha = dc.alpha;
            if (dc.sparkle > 0.4) {
                const dispAngle = Math.acos(Math.min(1, Math.abs(V.dot(normal, lightDir))));
                const hue = ((dispAngle * 200) + time * 15) % 360;
                sparkles.push({
                    x: centerProj.x,
                    y: centerProj.y,
                    size: 12 + dc.sparkle * 35,
                    alpha: (dc.sparkle - 0.4) * 1.5,
                    hue,
                    z: center.z,
                });
            }
        } else {
            color = computeMetalColor(normal, lightDir, viewDir, metalMat, lightDir2);
        }

        renderList.push({
            projected,
            color,
            alpha,
            z: center.z,
            type: face.type,
        });
    }

    // Sort back-to-front (painter's algorithm)
    renderList.sort((a, b) => a.z - b.z);

    // Draw faces
    for (const item of renderList) {
        ctx.beginPath();
        ctx.moveTo(item.projected[0].x, item.projected[0].y);
        for (let i = 1; i < item.projected.length; i++) {
            ctx.lineTo(item.projected[i].x, item.projected[i].y);
        }
        ctx.closePath();

        ctx.globalAlpha = item.alpha;
        ctx.fillStyle = item.color;
        ctx.fill();

        // Subtle edge highlight for metal
        if (item.type === 'metal') {
            ctx.strokeStyle = 'rgba(255,255,255,0.04)';
            ctx.lineWidth = 0.3;
            ctx.stroke();
        }
    }

    ctx.globalAlpha = 1;

    // Draw diamond glow (find approximate diamond center)
    const diamondFaces = renderList.filter(f => f.type === 'diamond');
    if (diamondFaces.length > 0) {
        let avgX = 0, avgY = 0, count = 0;
        for (const df of diamondFaces) {
            for (const p of df.projected) {
                avgX += p.x; avgY += p.y; count++;
            }
        }
        avgX /= count; avgY /= count;
        drawDiamondGlow(ctx, avgX, avgY, w * 0.12, time);
    }

    // Draw sparkles on top
    sparkles.sort((a, b) => b.z - a.z);
    for (const sp of sparkles) {
        drawSparkle(ctx, sp.x, sp.y, sp.size, sp.alpha, sp.hue);
    }
}

// ═══════════════════════════════════════════════════════════════════
// REACT COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function RingCanvas360({ style, metalType, stoneShape, stoneSize, ringSize }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const stateRef = useRef({
        rotX: 0.35,
        rotY: 0,
        velX: 0,
        velY: 0.005,
        isDragging: false,
        lastX: 0,
        lastY: 0,
        lightX: 0.2,
        lightY: 0.3,
        time: 0,
    });
    const [gyroAvailable, setGyroAvailable] = useState(false);
    const [gyroEnabled, setGyroEnabled] = useState(false);
    const geometryRef = useRef(null);

    // Rebuild geometry when props change
    useEffect(() => {
        geometryRef.current = buildScene(style, stoneShape, stoneSize, ringSize);
    }, [style, stoneShape, stoneSize, ringSize]);

    // Gyroscope detection
    useEffect(() => {
        if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
            setGyroAvailable(true);
        }
    }, []);

    // Gyroscope handler
    useEffect(() => {
        if (!gyroEnabled) return;

        const handler = (e) => {
            const { beta, gamma } = e;
            if (beta === null || gamma === null) return;
            const st = stateRef.current;
            st.rotX = ((beta - 40) * Math.PI) / 180;
            st.rotY = (gamma * Math.PI) / 180;
            st.lightX = gamma / 60;
            st.lightY = -(beta - 50) / 80;
            st.isDragging = false;
            st.velX = 0;
            st.velY = 0;
        };

        window.addEventListener('deviceorientation', handler);
        return () => window.removeEventListener('deviceorientation', handler);
    }, [gyroEnabled]);

    // Request gyroscope permission
    const requestGyro = useCallback(async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const perm = await DeviceOrientationEvent.requestPermission();
                if (perm === 'granted') setGyroEnabled(true);
            } catch (e) {
                console.warn('Gyroscope permission denied');
            }
        } else {
            setGyroEnabled(!gyroEnabled);
        }
    }, [gyroEnabled]);

    // Main render loop + event handling
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        // Resize handler
        function resize() {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
        resize();

        // Mouse/Touch event handlers
        function getPos(e) {
            if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            return { x: e.clientX, y: e.clientY };
        }

        function onStart(e) {
            if (gyroEnabled) return;
            const pos = getPos(e);
            const st = stateRef.current;
            st.isDragging = true;
            st.lastX = pos.x;
            st.lastY = pos.y;
            st.velX = 0;
            st.velY = 0;
        }

        function onMove(e) {
            const st = stateRef.current;
            const rect = canvas.getBoundingClientRect();

            // Always track light position
            const pos = e.touches
                ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
                : { x: e.clientX, y: e.clientY };
            st.lightX = ((pos.x - rect.left) / rect.width) * 2 - 1;
            st.lightY = -(((pos.y - rect.top) / rect.height) * 2 - 1);

            if (st.isDragging && !gyroEnabled) {
                const dx = pos.x - st.lastX;
                const dy = pos.y - st.lastY;
                st.rotY += dx * 0.008;
                st.rotX += dy * 0.006;
                st.rotX = Math.max(-1.2, Math.min(1.2, st.rotX));
                st.velY = dx * 0.008;
                st.velX = dy * 0.006;
                st.lastX = pos.x;
                st.lastY = pos.y;
                if (e.cancelable) e.preventDefault();
            }
        }

        function onEnd() {
            stateRef.current.isDragging = false;
        }

        canvas.addEventListener('mousedown', onStart);
        canvas.addEventListener('mousemove', onMove);
        canvas.addEventListener('mouseup', onEnd);
        canvas.addEventListener('mouseleave', onEnd);
        canvas.addEventListener('touchstart', onStart, { passive: false });
        canvas.addEventListener('touchmove', onMove, { passive: false });
        canvas.addEventListener('touchend', onEnd);

        // Animation loop
        function animate() {
            const st = stateRef.current;
            const rect = container.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            st.time += 0.016;

            // Physics: apply velocity / auto-rotation
            if (!st.isDragging && !gyroEnabled) {
                st.velY *= 0.97; // friction
                st.velX *= 0.93;

                // Auto-rotate when nearly stopped
                if (Math.abs(st.velY) < 0.0008) {
                    st.velY = 0.004; // gentle auto-spin
                }

                st.rotY += st.velY;
                st.rotX += st.velX;
                st.rotX = Math.max(-1.2, Math.min(1.2, st.rotX));
            }

            // Render
            const metalMat = getMetalMaterial(metalType);
            const faces = geometryRef.current || [];

            ctx.save();
            renderFrame(ctx, w, h, faces, st.rotX, st.rotY, st.lightX, st.lightY, metalMat, st.time);
            ctx.restore();

            animId = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            cancelAnimationFrame(animId);
            resizeObserver.disconnect();
            canvas.removeEventListener('mousedown', onStart);
            canvas.removeEventListener('mousemove', onMove);
            canvas.removeEventListener('mouseup', onEnd);
            canvas.removeEventListener('mouseleave', onEnd);
            canvas.removeEventListener('touchstart', onStart);
            canvas.removeEventListener('touchmove', onMove);
            canvas.removeEventListener('touchend', onEnd);
        };
    }, [metalType, gyroEnabled]);

    return (
        <div ref={containerRef} className="ring360-container">
            <canvas ref={canvasRef} className="ring360-canvas" />

            {/* Gyroscope toggle button (mobile only) */}
            {gyroAvailable && (
                <button
                    className={`ring360-gyro-btn ${gyroEnabled ? 'active' : ''}`}
                    onClick={requestGyro}
                    title={gyroEnabled ? 'Disable gyroscope' : 'Enable gyroscope — tilt to rotate'}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <ellipse cx="12" cy="12" rx="10" ry="4" />
                        <ellipse cx="12" cy="12" rx="4" ry="10" />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    </svg>
                    <span>{gyroEnabled ? 'GYRO ON' : 'TILT MODE'}</span>
                </button>
            )}

            {/* Tech badge */}
            <div className="ring360-badge">
                <span className="ring360-badge-dot" />
                PHOTOREAL 360°
            </div>
        </div>
    );
}
