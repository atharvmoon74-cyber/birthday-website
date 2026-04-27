// ── particles.js ── Glowing particles for Scene 1
(function() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 2.5 + 0.5;
    this.vx   = (Math.random() - 0.5) * 0.4;
    this.vy   = (Math.random() - 0.5) * 0.4;
    this.life = Math.random();
    this.maxLife = Math.random() * 0.02 + 0.003;
    this.dir  = Math.random() > 0.5 ? 1 : -1;
    const palette = ['#ff6eb4','#c084fc','#fbbf24','#fff','#ff3d7f','#e9d5ff'];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  };
  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.life += this.maxLife * this.dir;
    if (this.life >= 1 || this.life <= 0) this.dir *= -1;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };
  Particle.prototype.draw = function() {
    ctx.save();
    ctx.globalAlpha = this.life * 0.8;
    ctx.shadowBlur  = 12;
    ctx.shadowColor = this.color;
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();
