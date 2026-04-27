// ── stars.js ── Moving star field for Scene 2
(function() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [], shooting = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Star() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 1.5 + 0.3;
    this.alpha= Math.random();
    this.speed= Math.random() * 0.005 + 0.002;
    this.dir  = Math.random() > 0.5 ? 1 : -1;
  }
  Star.prototype.update = function() {
    this.alpha += this.speed * this.dir;
    if (this.alpha >= 1 || this.alpha <= 0) this.dir *= -1;
  };
  Star.prototype.draw = function() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  function ShootingStar() {
    this.reset();
  }
  ShootingStar.prototype.reset = function() {
    this.x    = Math.random() * W * 0.7;
    this.y    = Math.random() * H * 0.3;
    this.len  = Math.random() * 80 + 40;
    this.speed= Math.random() * 6 + 4;
    this.angle= Math.PI / 4;
    this.alpha= 1;
    this.active= false;
    this.timer = Math.random() * 300 + 100;
  };
  ShootingStar.prototype.update = function() {
    if (!this.active) {
      this.timer--;
      if (this.timer <= 0) this.active = true;
      return;
    }
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.alpha -= 0.02;
    if (this.alpha <= 0) this.reset();
  };
  ShootingStar.prototype.draw = function() {
    if (!this.active) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    const grd = ctx.createLinearGradient(
      this.x, this.y,
      this.x - Math.cos(this.angle) * this.len,
      this.y - Math.sin(this.angle) * this.len
    );
    grd.addColorStop(0, '#fff');
    grd.addColorStop(1, 'transparent');
    ctx.strokeStyle = grd;
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x - Math.cos(this.angle) * this.len,
      this.y - Math.sin(this.angle) * this.len
    );
    ctx.stroke();
    ctx.restore();
  };

  for (let i = 0; i < 200; i++) stars.push(new Star());
  for (let i = 0; i < 5;   i++) shooting.push(new ShootingStar());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => { s.update(); s.draw(); });
    shooting.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();
