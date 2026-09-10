import React, { useRef, useEffect } from 'react';

/**
 * Live Interactive Energy Flow Canvas
 * Renders the central energy topology:
 *   Utility Grid ──> Campus Load <── Solar Panels
 *                         │
 *                         └──> Battery Storage
 * With animated directional particles whose speed, density, and color
 * adapt to live power throughput.
 */
export default function EnergyFlowCanvas({
  gridKw = 1509.1,
  solarKw = 842.0,
  campusKw = 2351.1,
  batteryKw = 142.5,
  batteryState = 'charging',
  className = ''
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle streams for each leg
    const streams = [
      { id: 'grid_to_campus', active: gridKw > 0, speed: Math.min(0.015, 0.005 + (gridKw / 3000) * 0.01), color: '#38bdf8' },
      { id: 'solar_to_campus', active: solarKw > 0, speed: Math.min(0.015, 0.005 + (solarKw / 2000) * 0.01), color: '#f59e0b' },
      { id: 'solar_to_battery', active: batteryState === 'charging' && batteryKw > 0, speed: 0.008, color: '#10b981' },
      { id: 'battery_to_campus', active: batteryState === 'discharging' && batteryKw > 0, speed: 0.008, color: '#10b981' }
    ];

    const particles = Array.from({ length: 32 }, (_, i) => ({
      streamIndex: i % streams.length,
      progress: Math.random(),
      size: 2.5 + Math.random() * 1.5
    }));

    let t = 0;

    const render = () => {
      t += 0.02;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Node Positions (Responsive relative layout)
      const nodes = {
        grid: { x: w * 0.18, y: h * 0.5, label: 'Utility Grid', sub: `${gridKw.toLocaleString()} kW`, color: '#38bdf8', icon: '⚡' },
        solar: { x: w * 0.5, y: h * 0.18, label: 'Solar Arrays', sub: `${solarKw.toLocaleString()} kW`, color: '#f59e0b', icon: '☀️' },
        campus: { x: w * 0.5, y: h * 0.5, label: 'Campus Load', sub: `${campusKw.toLocaleString()} kW`, color: '#10b981', icon: '🏢' },
        battery: { x: w * 0.82, y: h * 0.5, label: 'BESS Storage', sub: `${batteryKw.toLocaleString()} kW (${batteryState})`, color: '#10b981', icon: '🔋' }
      };

      // Helper to draw connecting line
      const drawLine = (fromNode, toNode, color, active) => {
        ctx.strokeStyle = active ? color : 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = active ? 3 : 1;
        ctx.setLineDash(active ? [] : [4, 4]);
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
        ctx.setLineDash([]);
      };

      // Draw Lines
      drawLine(nodes.grid, nodes.campus, 'rgba(56, 189, 248, 0.4)', gridKw > 0);
      drawLine(nodes.solar, nodes.campus, 'rgba(245, 158, 11, 0.4)', solarKw > 0);
      drawLine(nodes.campus, nodes.battery, 'rgba(16, 185, 129, 0.4)', batteryKw > 0);

      // Draw Flowing Particles
      particles.forEach((p) => {
        const stream = streams[p.streamIndex];
        if (!stream.active) return;

        p.progress += stream.speed;
        if (p.progress > 1) p.progress = 0;

        let startNode, endNode;
        if (stream.id === 'grid_to_campus') {
          startNode = nodes.grid;
          endNode = nodes.campus;
        } else if (stream.id === 'solar_to_campus') {
          startNode = nodes.solar;
          endNode = nodes.campus;
        } else if (stream.id === 'solar_to_battery') {
          startNode = nodes.campus;
          endNode = nodes.battery;
        } else {
          startNode = nodes.battery;
          endNode = nodes.campus;
        }

        const px = startNode.x + (endNode.x - startNode.x) * p.progress;
        const py = startNode.y + (endNode.y - startNode.y) * p.progress;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, stream.color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Nodes
      Object.values(nodes).forEach((node) => {
        const pulse = Math.sin(t * 3) * 3;

        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, 34 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}15`;
        ctx.fill();

        // Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 28, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Icon
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.icon, node.x, node.y);

        // Labels
        ctx.font = '600 12px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(node.label, node.x, node.y + 44);

        ctx.font = '500 11px JetBrains Mono, monospace';
        ctx.fillStyle = node.color;
        ctx.fillText(node.sub, node.x, node.y + 60);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [gridKw, solarKw, campusKw, batteryKw, batteryState]);

  return (
    <div className={`relative w-full h-[320px] rounded-2xl overflow-hidden glass-panel border border-slate-800 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Live Campus Power Routing</span>
      </div>
    </div>
  );
}
