
import { useEffect, useRef } from 'react';

const NetworkAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      colorIndex: number;
    }> = [];

    // Logo colors for variety - optimized for mobile performance
    const logoColors = [
      'rgba(210, 185, 153, 0.25)', // #D2B999 - medium
      'rgba(195, 162, 119, 0.2)', // #C3A277 - medium-dark
      'rgba(162, 118, 67, 0.15)', // #A27643 - dark
      'rgba(134, 97, 56, 0.1)' // #866138 - darkest
    ];

    // Reduce node count on mobile for better performance
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 30 : 50;

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
        vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
        radius: Math.random() * (isMobile ? 1.5 : 2) + 1,
        colorIndex: Math.floor(Math.random() * logoColors.length),
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = logoColors[node.colorIndex];
        ctx.fill();

        // Draw connections (reduce connection distance on mobile)
        const maxDistance = isMobile ? 80 : 100;
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - node.x;
          const dy = nodes[j].y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (maxDistance - distance) / maxDistance;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(210, 185, 153, ${opacity * (isMobile ? 0.1 : 0.15)})`;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default NetworkAnimation;
