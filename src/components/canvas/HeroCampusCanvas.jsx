import React, { useRef, useEffect, useState } from 'react';

/**
 * 3D Isometric Interactive Smart Campus Canvas
 * Renders realistic 3D building blocks, solar arrays, battery units,
 * animated flowing energy lines, solar absorption particles, and interactive hover tooltips.
 */
export default function HeroCampusCanvas({ className = '' }) {
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle high-DPI displays
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Campus Nodes in 2.5D Isometric Space (relative coordinates 0-1)
    const nodes = [
      { id: 'grid', name: 'Utility Substation', type: 'grid', x: 0.18, y: 0.42, power: '1.5 MW Import', color: '#38bdf8' },
      { id: 'solar', name: 'Rooftop Solar Array 1.45MWp', type: 'solar', x: 0.52, y: 0.18, power: '842 kW Active', color: '#f59e0b' },
      { id: 'battery', name: 'Megapack BESS 1.2MWh', type: 'battery', x: 0.82, y: 0.38, power: '78% SOC (Charging)', color: '#10b981' },
      { id: 'eng', name: 'Academic Block A', type: 'building', x: 0.36, y: 0.65, power: '485 kW', color: '#10b981' },
      { id: 'sci', name: 'Science & Bio-Tech Labs', type: 'building', x: 0.68, y: 0.72, power: '742 kW (High Load)', color: '#ef4444' },
      { id: 'lib', name: 'Memorial Library', type: 'building', x: 0.50, y: 0.48, power: '235 kW (Optimized)', color: '#10b981' }
    ];

    // Power connections
    const links = [
      { from: 'grid', to: 'lib', color: 'rgba(56, 189, 248, 0.4)' },
      { from: 'grid', to: 'eng', color: 'rgba(56, 189, 248, 0.4)' },
      { from: 'solar', to: 'battery', color: 'rgba(245, 158, 11, 0.6)' },
      { from: 'solar', to: 'lib', color: 'rgba(245, 158, 11, 0.5)' },
      { from: 'solar', to: 'sci', color: 'rgba(245, 158, 11, 0.5)' },
      { from: 'battery', to: 'sci', color: 'rgba(16, 185, 129, 0.5)' },
      { from: 'eng', to: 'lib', color: 'rgba(16, 185, 129, 0.3)' }
    ];

    // Flowing energy packets
    const particles = Array.from({ length: 42 }, () => ({
      linkIndex: Math.floor(Math.random() * links.length),
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.005,
      size: 2 + Math.random() * 2.5
    }));

    let time = 0;

    const render = () => {
      time += 0.02;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Draw connecting transmission lines
      links.forEach((link) => {
        const source = nodes.find(n => n.id === link.from);
        const target = nodes.find(n => n.id === link.to);
        if (!source || !target) return;

        const x1 = source.x * w;
        const y1 = source.y * h;
        const x2 = target.x * w;
        const y2 = target.y * h;

        // Curved energy line
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 25;

        ctx.strokeStyle = link.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(midX, midY, x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 3. Draw moving energy particles
      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const link = links[p.linkIndex];
        const source = nodes.find(n => n.id === link.from);
        const target = nodes.find(n => n.id === link.to);
        if (!source || !target) return;

        const x1 = source.x * w;
        const y1 = source.y * h;
        const x2 = target.x * w;
        const y2 = target.y * h;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 25;

        // Quadratic Bezier interpolation
        const t = p.progress;
        const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
        const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

        // Glowing particle
        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, link.from === 'solar' ? '#f59e0b' : (link.from === 'grid' ? '#38bdf8' : '#10b981'));
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Draw 3D Isometric Buildings & Nodes
      nodes.forEach((node) => {
        const nx = node.x * w;
        const ny = node.y * h;
        const isHovered = hoveredNode?.id === node.id;

        // Base glow ring
        const pulse = Math.sin(time * 2 + node.x * 10) * 4;
        ctx.beginPath();
        ctx.arc(nx, ny, (isHovered ? 38 : 28) + pulse, 0, Math.PI * 2);
        ctx.fillStyle = node.id === 'sci' ? 'rgba(239, 68, 68, 0.15)' : (node.type === 'solar' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)');
        ctx.fill();

        // 3D Isometric box structure
        const bw = isHovered ? 46 : 38;
        const bh = isHovered ? 40 : 32;
        const isoDepth = 12;

        // Left face
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.moveTo(nx - bw / 2, ny);
        ctx.lineTo(nx, ny + bh / 3);
        ctx.lineTo(nx, ny - bh / 2 + bh / 3);
        ctx.lineTo(nx - bw / 2, ny - bh / 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.stroke();

        // Right face
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.beginPath();
        ctx.moveTo(nx, ny + bh / 3);
        ctx.lineTo(nx + bw / 2, ny);
        ctx.lineTo(nx + bw / 2, ny - bh / 2);
        ctx.lineTo(nx, ny - bh / 2 + bh / 3);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.stroke();

        // Top face (roof)
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.moveTo(nx, ny - bh / 2 - isoDepth);
        ctx.lineTo(nx + bw / 2, ny - bh / 2);
        ctx.lineTo(nx, ny - bh / 2 + bh / 3);
        ctx.lineTo(nx - bw / 2, ny - bh / 2);
        ctx.closePath();
        ctx.fill();

        // Subtle roof grid / solar panel pattern
        if (node.type === 'solar') {
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nx, ny - bh / 2 - isoDepth);
          ctx.lineTo(nx, ny - bh / 2 + bh / 3);
          ctx.stroke();
        }

        // Center beacon orb
        ctx.beginPath();
        ctx.arc(nx, ny - bh / 2 - isoDepth / 2, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, nx, ny + 32);

        ctx.font = '500 10px JetBrains Mono, monospace';
        ctx.fillStyle = node.color;
        ctx.fillText(node.power, nx, ny + 46);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse movement hover detection
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width;
      const mouseY = (e.clientY - rect.top) / rect.height;

      const found = nodes.find(n => {
        const dx = (n.x - mouseX) * rect.width;
        const dy = (n.y - mouseY) * rect.height;
        return Math.sqrt(dx * dx + dy * dy) < 45;
      });
      setHoveredNode(found || null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hoveredNode]);

  return (
    <div className={`relative w-full h-[460px] lg:h-[540px] rounded-3xl overflow-hidden glass-panel border border-slate-700/40 shadow-2xl ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair block" />
      
      {/* Live Campus Telemetry Badge Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-slate-300 font-medium">Interactive Smart Campus Microgrid</span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">60.02 Hz</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
        <span className="inline-block w-2 h-2 rounded-full bg-solar-500"></span> Solar Array
        <span className="inline-block w-2 h-2 rounded-full bg-brand-500 ml-2"></span> Storage / Campus
        <span className="inline-block w-2 h-2 rounded-full bg-electric-400 ml-2"></span> Grid Substation
      </div>
    </div>
  );
}
