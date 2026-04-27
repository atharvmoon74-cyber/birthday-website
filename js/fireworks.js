// ── fireworks.js ── Fireworks for Scene 7
window.FireworksEngine = (function() {
  let canvas, ctx, W, H, rockets = [], active = false, raf;

  function init() {
    canvas = document.getElementById('firework-canvas');
    if (!canvas) return;
    ctx    = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // ── Particle (spark)
  function Spark(x, y, color) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 1.5;
    this.x  = x; this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay  = Math.random() * 0.015 + 0.008;
    this.color  = color;
    this.r      = Math.random() * 3 + 1;
  }
  Spark.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.06; // gravity
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.alpha -= this.decay;
  };
  Spark.prototype.draw = function() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.shadowBlur  = 8;
    ctx.shadowColor = this.color;
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // ── Rocket
  function Rocket() {
    this.x  = Math.random() * W;
    this.y  = H;
    this.vy = -(Math.random() * 8 + 8);
    this.targetY = Math.random() * H * 0.5;
    const palettes = [
      ['#ff6eb4','#ff3d7f','#fbbf24'],
      ['#c084fc','#9333ea','#fff'],
      ['#fbbf24','#f97316','#fff'],
      ['#34d399','#06b6d4','#fff'],
      ['#f9a8d4','#e879f9','#fde68a'],
    ];
    this.palette = palettes[Math.floor(Math.random() * palettes.length)];
    this.sparks  = [];
    this.exploded= false;
    this.trail   = [];
  }
  Rocket.prototype.update = function() {
    if (this.exploded) {
      this.sparks = this.sparks.filter(s => s.alpha > 0);
      this.sparks.forEach(s => s.update());
      return;
    }
    this.trail.push({x:this.x, y:this.y});
    if (this.trail.length > 8) this.trail.shift();
    this.y += this.vy;
    this.vy += 0.15;
    if (this.y <= this.targetY || this.vy >= 0) this.explode();
  };
  Rocket.prototype.explode = function() {
    this.exploded = true;
    const count = Math.floor(Math.random() * 80 + 60);
    for (let i = 0; i < count; i++) {
      const c = this.palette[Math.floor(Math.random() * this.palette.length)];
      this.sparks.push(new Spark(this.x, this.y, c));
    }
  };
  Rocket.prototype.done = function() {
    return this.exploded && this.sparks.length === 0;
  };
  Rocket.prototype.draw = function() {
    if (this.exploded) {
      this.sparks.forEach(s => s.draw());
      return;
    }
    // trail
    this.trail.forEach((p, i) => {
      ctx.save();
      ctx.globalAlpha = i / this.trail.length * 0.6;
      ctx.fillStyle   = this.palette[0];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    // head
    ctx.save();
    ctx.shadowBlur  = 10;
    ctx.shadowColor = this.palette[0];
    ctx.fillStyle   = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  let launchTimer = 0;
  function loop() {
    if (!active) return;
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, W, H);

    launchTimer++;
    if (launchTimer % 40 === 0) {
      rockets.push(new Rocket());
      if (rockets.length > 20) rockets = rockets.filter(r => !r.done());
    }

    rockets.forEach(r => { r.update(); r.draw(); });
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (active) return;
    active = true;
    rockets = [];
    launchTimer = 0;
    loop();
  }
  function stop() {
    active = false;
    cancelAnimationFrame(raf);
    if (ctx) ctx.clearRect(0, 0, W, H);
  }

  return { init, start, stop };
})();
