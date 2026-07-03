// Fondo animado: red de nodos sobre <canvas> (JS vanilla, sin librerías).
// - Puntos cian que se mueven lento y rebotan en los bordes.
// - Líneas violeta entre nodos cercanos (<130px), opacidad por distancia.
// - Líneas cian desde los nodos cercanos (<160px) hacia el cursor.
// - Respeta prefers-reduced-motion, pausa con la pestaña oculta y reacciona a resize.
import { useEffect, useRef } from 'react';

interface Node { x: number; y: number; vx: number; vy: number; }

const LINK_DIST = 130;   // distancia máx. para unir dos nodos
const MOUSE_DIST = 160;  // distancia máx. para unir un nodo al cursor

export default function NodeNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Accesibilidad: si el usuario pidió menos movimiento, no animamos.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let rafId = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // Densidad adaptativa según el área de pantalla, acotada a [40, 110].
      const count = Math.max(70, Math.min(310, Math.round((width * height) / 16000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      // Mover y rebotar en los bordes.
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) { n.x = 0; n.vx = -n.vx; } else if (n.x > width) { n.x = width; n.vx = -n.vx; }
        if (n.y < 0) { n.y = 0; n.vy = -n.vy; } else if (n.y > height) { n.y = height; n.vy = -n.vy; }
      }

      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        // Líneas entre nodos cercanos (violeta, se desvanece con la distancia).
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(123,92,255,${(1 - dist / LINK_DIST) * 0.5})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Línea hacia el cursor (cian) si está cerca.
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < MOUSE_DIST) {
          ctx.strokeStyle = `rgba(0,224,255,${(1 - md / MOUSE_DIST) * 0.6})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Puntos (cian).
      ctx.fillStyle = 'rgba(0,224,255,.55)';
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(step);
    };

    const start = () => { if (!rafId) rafId = requestAnimationFrame(step); };
    const stop = () => { cancelAnimationFrame(rafId); rafId = 0; };

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onVisibility = () => { if (document.hidden) stop(); else start(); };

    resize();
    start();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="node-net" aria-hidden="true" />;
}
