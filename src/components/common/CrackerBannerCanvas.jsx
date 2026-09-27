import React, { useEffect, useRef } from 'react';

/**
 * CrackerBannerCanvas - Premium Neat & Clean Sivakasi Fireworks Animation
 * 
 * Features:
 * 1. Staggered Sky Rockets & Clean Radial Shell Bursts (Willow Gold, Emerald Green, Crimson Ruby, Electric Cyan)
 * 2. Continuous Golden Flowerpot (Anar) Fountains erupting smoothly on both sides
 * 3. Neat 4-Point Star Glints (Diamond Sparkles ✨) that shimmer crisply
 * 4. Ground Chakkar (Wheel Spinner) spiral sparks
 * 5. Interactive Click & Mouse-move Sparkler Trails
 * 6. Optimized performance with additive glowing light blending ('lighter')
 */
export const CrackerBannerCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect() || {
        width: window.innerWidth,
        height: 520,
      };
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Particle arrays
    const rockets = [];
    const particles = [];
    const fountainSparks = [];
    const starGlints = [];
    const chakkarSparks = [];
    const interactiveTrails = [];

    // Helper: random range
    const rand = (min, max) => Math.random() * (max - min) + min;

    // Elegant Sivakasi Color Themes (Neat & Clean)
    const colorThemes = [
      { name: 'Royal Gold', main: '#fbbf24', sec: '#f59e0b', light: '#fef3c7' },
      { name: 'Sivakasi Crimson', main: '#ef4444', sec: '#dc2626', light: '#fee2e2' },
      { name: 'Eco Emerald', main: '#10b981', sec: '#059669', light: '#d1fae5' },
      { name: 'Sunset Amber', main: '#f97316', sec: '#ea580c', light: '#ffedd5' },
      { name: 'Celestial Violet', main: '#a855f7', sec: '#8b5cf6', light: '#f3e8ff' },
      { name: 'Electric Spark', main: '#38bdf8', sec: '#0ea5e9', light: '#e0f2fe' },
      { name: 'Glitter Diamond', main: '#ffffff', sec: '#fef08a', light: '#ffffff' },
    ];

    // Helper: Draw crisp 4-pointed star sparkle (diamond glint)
    const drawStarGlint = (cx, cy, spikes, outerRadius, innerRadius, color, alpha) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = color;
      ctx.beginPath();
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // 1. Launch Rocket with neat smoke/spark trail
    const launchRocket = (targetX, targetY, theme) => {
      const startX = rand(width * 0.1, width * 0.9);
      const startY = height + 10;
      const destX = targetX ?? rand(width * 0.15, width * 0.85);
      const destY = targetY ?? rand(height * 0.12, height * 0.45);
      const angle = Math.atan2(destY - startY, destX - startX);
      const speed = rand(7.5, 10.5);
      const chosenTheme = theme || colorThemes[Math.floor(Math.random() * colorThemes.length)];

      rockets.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        destY,
        theme: chosenTheme,
        trail: [],
        createdAt: performance.now(),
      });
    };

    // 2. Explode Firework with crisp geometric patterns
    const burstFirework = (x, y, theme) => {
      const chosenTheme = theme || colorThemes[Math.floor(Math.random() * colorThemes.length)];
      const burstType = Math.random();

      // Ring or Willow or Palm burst
      if (burstType < 0.35) {
        // Crisp Ring Burst (Neat concentric circle)
        const ringCount = 32;
        const ringSpeed = rand(3.5, 5.5);
        for (let i = 0; i < ringCount; i++) {
          const angle = (Math.PI * 2 * i) / ringCount;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * ringSpeed,
            vy: Math.sin(angle) * ringSpeed,
            color: chosenTheme.main,
            lightColor: chosenTheme.light,
            alpha: 1,
            decay: rand(0.016, 0.024),
            size: rand(2, 3),
            gravity: 0.04,
            friction: 0.97,
            isSparkle: true,
          });
        }
      } else if (burstType < 0.7) {
        // Golden Willow / Chrysanthemum (Gracefully arching spark trails)
        const willowCount = 42;
        for (let i = 0; i < willowCount; i++) {
          const angle = rand(0, Math.PI * 2);
          const speed = rand(1.8, 6.5);
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: i % 2 === 0 ? chosenTheme.main : chosenTheme.sec,
            lightColor: '#ffffff',
            alpha: 1,
            decay: rand(0.012, 0.02),
            size: rand(1.8, 3.2),
            gravity: 0.065,
            friction: 0.965,
            isSparkle: Math.random() > 0.4,
          });
        }
      } else {
        // Double Peony Burst (Inner ring + outer stars)
        const count = 48;
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + rand(-0.1, 0.1);
          const speed = (i % 2 === 0 ? 5.2 : 3.2) * rand(0.9, 1.1);
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: i % 2 === 0 ? chosenTheme.main : chosenTheme.light,
            lightColor: '#ffffff',
            alpha: 1,
            decay: rand(0.018, 0.028),
            size: rand(1.8, 2.8),
            gravity: 0.045,
            friction: 0.97,
            isSparkle: true,
          });
        }
      }

      // Add 4-point Diamond Star Glints at center
      for (let s = 0; s < 5; s++) {
        starGlints.push({
          x: x + rand(-15, 15),
          y: y + rand(-15, 15),
          size: rand(6, 12),
          innerSize: rand(2, 4),
          color: chosenTheme.light,
          alpha: 1,
          decay: rand(0.03, 0.05),
          rotation: rand(0, Math.PI),
        });
      }
    };

    // 3. Continuous Golden Flowerpot (Anar) Fountain
    const emitAnarFountain = (originX, originY) => {
      const sparkCount = 4;
      for (let i = 0; i < sparkCount; i++) {
        const spreadAngle = rand(-0.35, 0.35) - Math.PI / 2;
        const initialSpeed = rand(7, 13);
        fountainSparks.push({
          x: originX + rand(-5, 5),
          y: originY,
          vx: Math.cos(spreadAngle) * initialSpeed * 0.4,
          vy: Math.sin(spreadAngle) * initialSpeed,
          color: Math.random() > 0.3 ? '#fbbf24' : '#ffffff',
          alpha: 1,
          decay: rand(0.022, 0.038),
          size: rand(1.5, 2.5),
          gravity: 0.26,
        });
      }
    };

    // 4. Ground Chakkar (Wheel Spinner)
    let chakkarAngle = 0;
    const emitChakkar = (cx, cy) => {
      chakkarAngle += 0.45;
      for (let i = 0; i < 3; i++) {
        const a = chakkarAngle + (i * Math.PI * 2) / 3;
        const speed = rand(3, 5.5);
        chakkarSparks.push({
          x: cx + Math.cos(a) * 12,
          y: cy + Math.sin(a) * 6,
          vx: Math.cos(a + 0.4) * speed,
          vy: Math.sin(a + 0.4) * speed * 0.6,
          color: i === 0 ? '#fbbf24' : i === 1 ? '#f97316' : '#ffffff',
          alpha: 1,
          decay: rand(0.028, 0.045),
          size: rand(1.5, 2.4),
          gravity: 0.05,
        });
      }
    };

    // 5. Pre-seed Ambient Twinkling Stars
    const ambientStars = [];
    for (let i = 0; i < 28; i++) {
      ambientStars.push({
        x: rand(0, width || 1200),
        y: rand(0, height || 500),
        size: rand(1.5, 3.5),
        alpha: rand(0.2, 0.8),
        pulseSpeed: rand(0.02, 0.05),
        phase: rand(0, Math.PI * 2),
        color: Math.random() > 0.4 ? '#fef08a' : '#fbcfe8',
      });
    }

    let lastRocketTime = performance.now();
    let nextRocketInterval = 900; // Launch frequent, neat bursts

    // Launch 2 initial bursts immediately so user sees them right away
    setTimeout(() => {
      if (width > 0 && height > 0) {
        burstFirework(width * 0.28, height * 0.25, colorThemes[0]);
        burstFirework(width * 0.72, height * 0.28, colorThemes[1]);
      }
    }, 200);

    // Main 60fps Animation Loop
    const animate = (timestamp) => {
      // Clean clear with crisp blending
      ctx.clearRect(0, 0, width, height);

      // Set additive glowing light mode for brilliant firework luminescence
      ctx.globalCompositeOperation = 'lighter';

      // A. Ambient Twinkling Stars (Clean Festive Backdrop)
      for (let i = 0; i < ambientStars.length; i++) {
        const s = ambientStars[i];
        s.phase += s.pulseSpeed;
        const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.phase));

        drawStarGlint(s.x, s.y, 4, s.size * 2, s.size * 0.6, s.color, currentAlpha);
      }

      // B. Auto Launch Rockets at lively staggered intervals
      if (timestamp - lastRocketTime > nextRocketInterval) {
        launchRocket();
        lastRocketTime = timestamp;
        nextRocketInterval = rand(850, 1600); // Continuous & engaging
      }

      // C. Golden Anar Fountains (Neat & Clean fountains at bottom corners)
      if (width > 640) {
        emitAnarFountain(width * 0.06, height - 12);
        emitAnarFountain(width * 0.94, height - 12);
      } else {
        // Mobile: central bottom fountain
        emitAnarFountain(width * 0.5, height - 10);
      }

      // D. Ground Chakkar Sparks (bottom edges on desktop)
      if (width > 800) {
        emitChakkar(width * 0.16, height - 18);
        emitChakkar(width * 0.84, height - 18);
      }

      // E. Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;

        // Sparkle trail behind rocket
        r.trail.push({ x: r.x, y: r.y, alpha: 1 });
        if (r.trail.length > 7) r.trail.shift();

        // Draw trail
        for (let t = 0; t < r.trail.length; t++) {
          const pt = r.trail[t];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, rand(1.2, 2.2), 0, Math.PI * 2);
          ctx.fillStyle = '#fbbf24';
          ctx.globalAlpha = (t / r.trail.length) * 0.8;
          ctx.fill();
        }

        // Draw rocket head
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 1;
        ctx.fill();

        // Rocket reached apex or target
        if (r.y <= r.destY || r.vy >= -1) {
          burstFirework(r.x, r.y, r.theme);
          rockets.splice(i, 1);
        }
      }

      // F. Update & Draw Burst Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);

        // Core bright spark
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Crisp star glint for sparkle particles
        if (p.isSparkle && p.alpha > 0.4 && Math.random() > 0.6) {
          drawStarGlint(p.x, p.y, 4, p.size * 2.2, p.size * 0.5, p.lightColor, p.alpha);
        }
        ctx.restore();
      }

      // G. Update & Draw Anar Fountain Sparks
      for (let i = fountainSparks.length - 1; i >= 0; i--) {
        const sp = fountainSparks[i];
        sp.vy += sp.gravity;
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= sp.decay;

        if (sp.alpha <= 0 || sp.y > height + 15) {
          fountainSparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = Math.max(0, sp.alpha);
        ctx.fill();
      }

      // H. Update & Draw Chakkar Sparks
      for (let i = chakkarSparks.length - 1; i >= 0; i--) {
        const cs = chakkarSparks[i];
        cs.vy += cs.gravity;
        cs.x += cs.vx;
        cs.y += cs.vy;
        cs.alpha -= cs.decay;

        if (cs.alpha <= 0) {
          chakkarSparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(cs.x, cs.y, cs.size, 0, Math.PI * 2);
        ctx.fillStyle = cs.color;
        ctx.globalAlpha = Math.max(0, cs.alpha);
        ctx.fill();
      }

      // I. Update & Draw 4-Point Star Glints (Diamond Sparkles)
      for (let i = starGlints.length - 1; i >= 0; i--) {
        const sg = starGlints[i];
        sg.alpha -= sg.decay;
        if (sg.alpha <= 0) {
          starGlints.splice(i, 1);
          continue;
        }
        drawStarGlint(sg.x, sg.y, 4, sg.size, sg.innerSize, sg.color, sg.alpha);
      }

      // J. Interactive Cursor Sparkler Trails
      for (let i = interactiveTrails.length - 1; i >= 0; i--) {
        const it = interactiveTrails[i];
        it.alpha -= 0.035;
        it.y += it.vy;
        it.x += it.vx;

        if (it.alpha <= 0) {
          interactiveTrails.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(it.x, it.y, it.size, 0, Math.PI * 2);
        ctx.fillStyle = it.color;
        ctx.globalAlpha = Math.max(0, it.alpha);
        ctx.fill();
      }

      // Restore composite operation
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Interactive Click: Instant multi-shot burst at user click
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      burstFirework(clickX, clickY);
      setTimeout(() => {
        burstFirework(clickX + rand(-40, 40), clickY + rand(-30, 30));
      }, 140);
    };

    // Interactive Hover/Move: Sparkler cursor sparks
    let lastMoveTime = 0;
    const handlePointerMove = (e) => {
      const now = performance.now();
      if (now - lastMoveTime < 45) return;
      lastMoveTime = now;

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      for (let k = 0; k < 2; k++) {
        interactiveTrails.push({
          x: mx + rand(-6, 6),
          y: my + rand(-6, 6),
          vx: rand(-1, 1),
          vy: rand(0.5, 2),
          size: rand(1.5, 2.5),
          color: Math.random() > 0.5 ? '#fbbf24' : '#ffffff',
          alpha: 1,
        });
      }
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('click', handleCanvasClick);
      parent.addEventListener('pointermove', handlePointerMove);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (parent) {
        parent.removeEventListener('click', handleCanvasClick);
        parent.removeEventListener('pointermove', handlePointerMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-1"
      aria-hidden="true"
    />
  );
};
