// ══════════════════════════════════════════════════════════════
//  main.js  —  Samiksha Birthday Website
// ══════════════════════════════════════════════════════════════

// ── Music
const music = document.getElementById('bg-music');
let musicOn = false;
function toggleMusic() {
  if (musicOn) { music.pause(); document.getElementById('music-toggle').textContent = '🔇'; }
  else         { music.play().catch(()=>{}); document.getElementById('music-toggle').textContent = '🎵'; }
  musicOn = !musicOn;
}
// Auto-attempt play on first user gesture
document.addEventListener('click', function startMusic() {
  if (!musicOn) { music.volume = 0.4; music.play().then(()=>{ musicOn=true; document.getElementById('music-toggle').textContent='🎵'; }).catch(()=>{}); }
  document.removeEventListener('click', startMusic);
}, { once:false });

// ── Scene routing
function goToScene(id) {
  const current = document.querySelector('.scene.active');
  const next    = document.getElementById(id);
  if (!next || next === current) return;

  if (current) {
    current.classList.add('fade-out');
    setTimeout(() => {
      current.classList.remove('active','fade-out');
    }, 900);
  }
  setTimeout(() => {
    next.classList.add('active');
    onSceneEnter(id);
  }, current ? 500 : 0);
}

function onSceneEnter(id) {
  if (id === 'scene-opening')    initOpening();
  if (id === 'scene-stars')      initStars();
  if (id === 'scene-gift')       initGift();
  if (id === 'scene-letter')     initLetter();
  if (id === 'scene-memories')   initMemories();
  if (id === 'scene-cake')       initCake();
  if (id === 'scene-celebrate')  initCelebrate();
  if (id === 'scene-final')      initFinal();
  if (id === 'scene-secret')     initSecret();
  // Stop fireworks when leaving celebrate
  if (id !== 'scene-celebrate')  FireworksEngine.stop();
}

// ══════════════════════════════════════════════
//  SCENE 1 — OPENING
// ══════════════════════════════════════════════
function initOpening() {
  const l1 = document.getElementById('line1');
  const l2 = document.getElementById('line2');
  const l3 = document.getElementById('line3');
  const btn= document.getElementById('opening-btn');

  // Reset
  [l1,l2,l3].forEach(el => { el.style.opacity='0'; el.textContent=''; el.classList.remove('hidden'); });
  btn.classList.add('hidden');

  const lines = [
    { el:l1, text:"To the most important person in my life…",     delay:600  },
    { el:l2, text:"Happy Birthday",                                delay:3500 },
    { el:l3, text:"Samiksha 🎂💖",                                 delay:5500 },
  ];

  lines.forEach(({el, text, delay}) => {
    setTimeout(() => {
      el.style.opacity='1';
      el.style.transition='opacity 1s';
      typeWriter(el, text, 55);
    }, delay);
  });

  setTimeout(() => btn.classList.remove('hidden'), 9000);
}

function typeWriter(el, text, speed=60) {
  let i = 0;
  el.textContent = '';
  function tick() {
    if (i < text.length) {
      // handle emoji (multi-char)
      el.textContent += text[i];
      i++;
      setTimeout(tick, speed);
    }
  }
  tick();
}

// ══════════════════════════════════════════════
//  SCENE 2 — STARS
// ══════════════════════════════════════════════
function initStars() {
  // Star canvas already running from stars.js
}

function explodeStars() {
  const burst = document.getElementById('confetti-burst');
  burst.innerHTML = '';
  for (let i = 0; i < 120; i++) spawnConfetti(burst, window.innerWidth/2, window.innerHeight/2, true);
  setTimeout(() => goToScene('scene-gift'), 1800);
}

// ══════════════════════════════════════════════
//  CONFETTI HELPER
// ══════════════════════════════════════════════
const CONFETTI_COLORS = ['#ff6eb4','#c084fc','#fbbf24','#34d399','#f97316','#fff','#ff3d7f','#e879f9'];

function spawnConfetti(container, cx, cy, burst=false) {
  const el = document.createElement('div');
  el.className = 'confetti-piece';
  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  el.style.background = color;
  el.style.boxShadow  = `0 0 6px ${color}`;
  const shapes = ['2px','50%','0'];
  el.style.borderRadius = shapes[Math.floor(Math.random()*shapes.length)];
  el.style.width  = Math.random()*10+6+'px';
  el.style.height = Math.random()*10+6+'px';

  if (burst) {
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    const angle = Math.random() * 360;
    const dist  = Math.random() * 300 + 60;
    el.style.transform = `translate(0,0)`;
    el.style.transition = `transform ${Math.random()*0.8+0.5}s ease-out, opacity 0.5s ease ${Math.random()*0.5}s`;
    container.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(${Math.cos(angle*(Math.PI/180))*dist}px, ${Math.sin(angle*(Math.PI/180))*dist}px) rotate(${Math.random()*720}deg)`;
      el.style.opacity='0';
    });
    setTimeout(()=>el.remove(), 1600);
  } else {
    el.style.left = Math.random()*100 + 'vw';
    el.style.top  = '-12px';
    const dur  = Math.random()*3+2;
    el.style.animationDuration  = dur+'s';
    el.style.animationDelay     = Math.random()*2+'s';
    container.appendChild(el);
    setTimeout(()=>el.remove(), (dur+2)*1000);
  }
}

function rainConfetti(container, count=80) {
  for (let i = 0; i < count; i++) {
    setTimeout(()=> spawnConfetti(container), i * 30);
  }
}

// ══════════════════════════════════════════════
//  SCENE 3 — GIFT BOX
// ══════════════════════════════════════════════
let giftLayer = 0;
function initGift() {
  giftLayer = 0;
  const lid  = document.getElementById('box-lid');
  const wrap = document.getElementById('gift-wrap');
  const msgs = [1,2,3].map(i => document.getElementById('msg'+i));
  lid.classList.remove('open');
  wrap.style.display = 'block';
  msgs.forEach(m => m.classList.add('hidden'));
  document.getElementById('gift-text').textContent = 'I made something special for you…';
  // Floating ribbon confetti
  makeRibbons();
}

function makeRibbons() {
  const c = document.getElementById('ribbons');
  c.innerHTML = '';
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:absolute;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      width:${Math.random()*30+10}px;
      height:${Math.random()*6+2}px;
      background:${CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)]};
      border-radius:4px;
      opacity:0.4;
      animation:sway ${Math.random()*3+2}s ease-in-out infinite alternate;
    `;
    c.appendChild(el);
  }
}

function openBox() {
  if (giftLayer !== 0) return;
  const box = document.getElementById('gift-box');
  box.classList.add('shaking');
  setTimeout(() => {
    box.classList.remove('shaking');
    document.getElementById('box-lid').classList.add('open');
    setTimeout(() => {
      document.getElementById('gift-wrap').style.display = 'none';
      document.getElementById('msg1').classList.remove('hidden');
      giftLayer = 1;
    }, 600);
  }, 500);
}

function nextLayer(n) {
  for (let i=1; i<=3; i++) document.getElementById('msg'+i).classList.add('hidden');
  document.getElementById('msg'+n).classList.remove('hidden');
}

// ══════════════════════════════════════════════
//  SCENE 4 — LETTER
// ══════════════════════════════════════════════
const LETTER_LINES = [
  "To the most important person in my life… 💖",
  "",
  "Happy Birthday, my dear Samiksha 🎂✨",
  "",
  "I don't even know where to start,",
  "because no words ever feel enough",
  "when it comes to you.",
  "You are truly the most deserving girl,",
  "the cutest soul I have ever met on this earth 🌍💫",
  "",
  "Every little 'kaleshi' moment we had…",
  "honestly, I loved them so much 😂💞",
  "They're my favorite memories,",
  "because they were with you.",
  "Even your chaos has a special place in my heart.",
  "",
  "And the way you love animals 🐾…",
  "it's one of the purest things about you.",
  "So sweet, so beautiful…",
  "but also a little dangerous for me 😭😂",
  "because I feel like I get less attention sometimes.",
  "But still — that just shows how big your heart is.",
  "",
  "You are the most precious, pure soul, yaar…",
  "The happiness you've given me,",
  "the way you've always been there for me,",
  "supported me, cared for me…",
  "no one has ever done that the way you do 🥺💗",
  "",
  "Thank you… thank you so much for being in my life, Samu.",
  "For understanding me, for staying,",
  "for making everything feel lighter and better.",
  "",
  "You're not just my bestie…",
  "you're my comfort, my happiness, my safe place 🌸",
  "",
  "\"Some people come into our lives and make everything",
  "better just by being there.\"",
  "You are that person for me 💖",
  "",
  "I wish you all the happiness in the world,",
  "all the smiles, all the love,",
  "and everything your heart truly deserves 🌈✨",
  "",
  "And no matter what happens…",
  "I'll always be there for you,",
  "just like you've been there for me 🤝💫",
  "",
  "Once again… Happy Birthday, my Samiksha 🎉🎂💖",
];

function initLetter() {
  const body = document.getElementById('letter-body');
  const sign = document.getElementById('letter-sign');
  const btn  = document.getElementById('memories-btn');
  body.innerHTML = '';
  sign.classList.add('hidden');
  btn.classList.add('hidden');
  spawnHearts();

  let i = 0;
  function addLine() {
    if (i >= LETTER_LINES.length) {
      setTimeout(() => sign.classList.remove('hidden'), 400);
      setTimeout(() => btn.classList.remove('hidden'), 900);
      return;
    }
    const p = document.createElement('p');
    p.style.opacity = '0';
    p.style.transition = 'opacity 0.5s ease';
    p.style.minHeight = '1.5rem';
    p.textContent = LETTER_LINES[i] || '\u00a0';
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
    requestAnimationFrame(() => { p.style.opacity = '1'; });
    i++;
    // scroll letter into view
    const lw = document.querySelector('.letter-wrap');
    if (lw) lw.scrollTop = lw.scrollHeight;
    setTimeout(addLine, LETTER_LINES[i-1] === '' ? 300 : 220);
  }
  setTimeout(addLine, 600);
}

function spawnHearts() {
  const c = document.getElementById('hearts-float');
  c.innerHTML = '';
  const emojis = ['💖','💕','🌸','💗','💝','✨','💞'];
  function drop() {
    const el = document.createElement('div');
    el.className = 'heart-particle';
    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    el.style.left  = Math.random()*100 + 'vw';
    el.style.bottom= '0';
    el.style.animationDuration = Math.random()*5+4+'s';
    el.style.animationDelay   = '0s';
    c.appendChild(el);
    setTimeout(()=>el.remove(), 9000);
  }
  const iv = setInterval(drop, 600);
  // Store interval so we can clear when leaving
  c.dataset.iv = iv;
}

// ══════════════════════════════════════════════
//  SCENE 5 — MEMORIES
// ══════════════════════════════════════════════

// ▼▼▼ ADD YOUR PHOTOS HERE ▼▼▼
// Put image files in the images/ folder, then list them below.
// If you leave src empty (''), a placeholder emoji will show instead.
const MEMORIES = [
  { src:'images/photo1.jpg', caption:'This was my favorite moment 😭' },
  { src:'images/photo2.jpg', caption:'Still laughing at this 😂'       },
  { src:'images/photo3.jpg', caption:'Us being absolutely feral 😂💖'   },
  { src:'images/photo4.jpg', caption:'I keep this close to my heart 🥺' },
  { src:'images/photo5.jpg', caption:'You looked so pretty here 🌸'     },
  { src:'images/photo6.jpg', caption:'Forever in my memories ✨'         },
];
// ▲▲▲ ADD YOUR PHOTOS HERE ▲▲▲

const PLACEHOLDER_EMOJIS = ['📸','🌸','💖','🎀','✨','🌟'];

function initMemories() {
  const grid = document.getElementById('polaroid-grid');
  grid.innerHTML = '';

  MEMORIES.forEach((m, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'polaroid';

    // Try image — fall back to emoji placeholder if src not set
    if (m.src && m.src !== '') {
      const img = document.createElement('img');
      img.src = m.src;
      img.alt = m.caption;
      img.onerror = function() {
        this.parentNode.replaceChild(makePlaceholder(idx), this);
      };
      wrap.appendChild(img);
    } else {
      wrap.appendChild(makePlaceholder(idx));
    }

    const cap = document.createElement('div');
    cap.className = 'caption';
    cap.textContent = m.caption;
    wrap.appendChild(cap);

    // Click to zoom
    wrap.addEventListener('click', () => zoomPolaroid(wrap, m, idx));
    grid.appendChild(wrap);
  });
}

function makePlaceholder(idx) {
  const d = document.createElement('div');
  d.className = 'placeholder-img';
  d.textContent = PLACEHOLDER_EMOJIS[idx % PLACEHOLDER_EMOJIS.length];
  return d;
}

let zoomOverlay = null;
function zoomPolaroid(wrap, m, idx) {
  if (zoomOverlay) { zoomOverlay.remove(); zoomOverlay=null; return; }
  const ov = document.createElement('div');
  ov.style.cssText=`
    position:fixed;inset:0;z-index:100;
    background:rgba(0,0,0,0.88);
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;
    cursor:pointer;
  `;
  if (m.src && m.src !== '') {
    const img = document.createElement('img');
    img.src = m.src;
    img.style.cssText='max-width:80vw;max-height:70vh;object-fit:contain;border:6px solid #fff;border-radius:4px;';
    ov.appendChild(img);
  } else {
    const d=document.createElement('div');
    d.style.cssText='font-size:8rem;';
    d.textContent=PLACEHOLDER_EMOJIS[idx%PLACEHOLDER_EMOJIS.length];
    ov.appendChild(d);
  }
  const p=document.createElement('p');
  p.style.cssText='font-family:"Dancing Script",cursive;font-size:1.4rem;color:#fff;text-shadow:0 0 10px #ff6eb4;';
  p.textContent=m.caption;
  ov.appendChild(p);
  ov.addEventListener('click', ()=>{ ov.remove(); zoomOverlay=null; });
  document.body.appendChild(ov);
  zoomOverlay=ov;
}

// ══════════════════════════════════════════════
//  SCENE 6 — CAKE
// ══════════════════════════════════════════════
function initCake() {
  // Re-show flames
  document.querySelectorAll('.flame').forEach(f => {
    f.classList.remove('blown');
    f.style.display='';
  });
  document.getElementById('blow-btn').disabled = false;
  document.getElementById('cake-text').textContent = 'Make a wish, Samiksha… 🌠';
}

function blowCandles() {
  const flames = document.querySelectorAll('.flame');
  flames.forEach((f, i) => {
    setTimeout(()=>{
      f.style.animation='none';
      f.style.opacity='0';
      setTimeout(()=> f.classList.add('blown'), 400);
    }, i * 200);
  });
  document.getElementById('blow-btn').disabled = true;
  document.getElementById('cake-text').textContent = '🎉 Your wish has been sent to the stars! 🌠';
  setTimeout(() => goToScene('scene-celebrate'), 2500);
}

// ══════════════════════════════════════════════
//  SCENE 7 — CELEBRATION
// ══════════════════════════════════════════════
function initCelebrate() {
  FireworksEngine.init();
  FireworksEngine.start();
  makeBalloons();
  makeTorans();
  makeSparkleRow();
  // Rain confetti too
  const burst = document.getElementById('confetti-burst');
  rainConfetti(burst, 100);
}

function makeBalloons() {
  const wrap = document.getElementById('balloons-wrap');
  wrap.innerHTML='';
  const colors=['#ff6eb4','#c084fc','#fbbf24','#34d399','#f97316','#60a5fa','#f9a8d4'];
  for (let i=0; i<20; i++) {
    const b=document.createElement('div');
    b.className='balloon';
    const c=colors[Math.floor(Math.random()*colors.length)];
    b.style.background=`radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), ${c})`;
    b.style.left=Math.random()*110-5+'%';
    b.style.bottom='-120px';
    const dur=Math.random()*6+6;
    b.style.animationDuration=dur+'s';
    b.style.animationDelay=Math.random()*4+'s';
    b.style.boxShadow=`0 0 15px ${c}`;
    wrap.appendChild(b);
  }
}

function makeTorans() {
  const wrap=document.getElementById('torans');
  wrap.innerHTML='';
  const str=document.createElement('div');
  str.className='toran-string';
  wrap.appendChild(str);
  const colors=['#ff6eb4','#fbbf24','#c084fc','#34d399','#f97316','#60a5fa'];
  for(let i=0;i<18;i++){
    const f=document.createElement('div');
    f.className='toran-flag';
    f.style.background=colors[i%colors.length];
    f.style.animationDelay=i*0.1+'s';
    wrap.appendChild(f);
  }
}

function makeSparkleRow() {
  const row=document.getElementById('sparkle-row');
  row.innerHTML='';
  ['✨','⭐','🌟','💫','✨','🌟','⭐'].forEach(s=>{
    const sp=document.createElement('span');
    sp.className='sparkle';
    sp.textContent=s;
    row.appendChild(sp);
  });
}

// ══════════════════════════════════════════════
//  SCENE 8 — FINAL
// ══════════════════════════════════════════════
function initFinal() {
  // Soft floating particles
  const canvas=document.getElementById('soft-canvas');
  if(canvas){
    const ctx=canvas.getContext('2d');
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    const pts=[];
    for(let i=0;i<60;i++){
      pts.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        r:Math.random()*2+0.5,
        a:Math.random(),
        vx:(Math.random()-0.5)*0.3,
        vy:(Math.random()-0.5)*0.3,
        d:1,
        sp:Math.random()*0.006+0.002,
        c:CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)]
      });
    }
    function drawSoft(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        p.a+=p.sp*p.d;
        if(p.a>=1||p.a<=0) p.d*=-1;
        if(p.x<0||p.x>canvas.width||p.y<0||p.y>canvas.height){
          p.x=Math.random()*canvas.width;
          p.y=Math.random()*canvas.height;
        }
        ctx.save();
        ctx.globalAlpha=p.a*0.7;
        ctx.shadowBlur=10;
        ctx.shadowColor=p.c;
        ctx.fillStyle=p.c;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(drawSoft);
    }
    drawSoft();
  }
  // Show final buttons after lines animate in
  setTimeout(()=>{
    document.getElementById('final-btns').classList.remove('hidden');
  }, 6000);
}

// ══════════════════════════════════════════════
//  SCENE 9 — SECRET
// ══════════════════════════════════════════════
function initSecret() {
  document.getElementById('env-flap').classList.remove('open');
  document.getElementById('secret-note').classList.add('hidden');
  document.getElementById('replay-final').classList.add('hidden');
}

function openEnvelope() {
  document.getElementById('env-flap').classList.add('open');
  setTimeout(()=>{
    document.getElementById('secret-note').classList.remove('hidden');
    document.getElementById('replay-final').classList.remove('hidden');
    // Rain hearts
    const c=document.querySelector('.secret-content');
    const emojis=['💖','🌸','💕','✨','💗'];
    for(let i=0;i<30;i++){
      setTimeout(()=>{
        const el=document.createElement('div');
        el.style.cssText=`
          position:fixed;
          left:${Math.random()*100}vw;
          top:100vh;
          font-size:${Math.random()*1.5+0.8}rem;
          pointer-events:none;
          z-index:100;
          animation:heart-rise ${Math.random()*4+3}s linear forwards;
        `;
        el.textContent=emojis[Math.floor(Math.random()*emojis.length)];
        document.body.appendChild(el);
        setTimeout(()=>el.remove(),8000);
      }, i*200);
    }
  }, 700);
}

// ══════════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', ()=>{
  FireworksEngine.init();
  initOpening();
});
