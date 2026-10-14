/* BodyLab.Beauty – новый дизайн: общие скрипты для всех страниц.
   Каждая возможность работает только если нужные элементы есть на странице. */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s,r){return (r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  window.BL = {reduce:reduce,$:$,$$:$$};

  /* ---- 1. появление блоков при скролле ---- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.15,rootMargin:'0px 0px -6% 0px'}) : null;
  window.BL.observe = function(root){ $$('.rv,.mask,.line-grow',root).forEach(function(el){ if(el.classList.contains('in'))return; io ? io.observe(el) : el.classList.add('in'); }); };
  window.BL.observe();
  requestAnimationFrame(function(){ setTimeout(function(){ $$('.hero .rv,.hero .mask,.svc-hero .rv,.svc-hero .mask,.bk .rv').forEach(function(el){el.classList.add('in')}); },60); });

  /* ---- 2. меню ---- */
  var nav = $('#nav'), menuBtn = $('#menu-btn');
  function setMenu(open){ document.body.classList.toggle('menu-open',open); if(menuBtn) menuBtn.setAttribute('aria-expanded',open); }
  if(menuBtn){
    menuBtn.addEventListener('click',function(){ setMenu(!document.body.classList.contains('menu-open')); });
    $$('#menu a').forEach(function(a){ a.addEventListener('click',function(){ setMenu(false); }); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') setMenu(false); });
  }

  /* ---- 3. шапка: тон над тёмными секциями, прячется при скролле вниз; нижняя кнопка записи ---- */
  var darks = $$('.sec.dark'), hides = $$('[data-dock-hide]'), dock = $('#dock'), lastY = scrollY;
  function onScroll(){
    var y = scrollY, isDark = false;
    darks.forEach(function(s){ var r = s.getBoundingClientRect(); if(r.top < 40 && r.bottom > 40) isDark = true; });
    if(nav) nav.classList.toggle('dark',isDark);
    var down = y > lastY + 4, up = y < lastY - 4;
    if(nav){ if(y < 120 || up) nav.classList.remove('hide'); else if(down && !document.body.classList.contains('menu-open')) nav.classList.add('hide'); }
    if(down||up) lastY = y;
    if(dock){
      var hidden = hides.some(function(el){ var r = el.getBoundingClientRect(); return r.top < innerHeight*.5 && r.bottom > innerHeight*.5; });
      dock.classList.toggle('show', y > innerHeight*.8 && !hidden);
    }
  }

  /* ---- 4. параллакс фото ---- */
  var heroImg = $('#hero-img');
  function heroPar(){
    if(reduce || !heroImg) return;
    var y = Math.min(scrollY, innerHeight);
    heroImg.style.transform = 'translateY('+(-y*.06)+'px) scale('+(1+y*.00012)+')';
  }

  /* ---- 5. подсветка карточек за курсором ---- */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce){
    var sel = '.pcard,.box,.fcard,.opt,.win,.ocard,.gcard,.sum';
    function arm(root){ $$(sel,root).forEach(function(el){ el.classList.add('glow'); }); }
    arm();
    document.addEventListener('pointermove',function(e){
      var el = e.target.closest && e.target.closest('.glow'); if(!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx',(e.clientX-r.left)+'px'); el.style.setProperty('--my',(e.clientY-r.top)+'px');
    },{passive:true});
    window.BL.arm = arm;
  }

  /* ---- 6. аккордеон (FAQ) ---- */
  $$('.acc-q').forEach(function(q){
    q.addEventListener('click',function(){
      var item = q.parentNode, open = !item.classList.contains('open');
      item.classList.toggle('open',open); q.setAttribute('aria-expanded',open);
    });
  });

  /* ---- общий цикл на rAF ---- */
  var ticking = false, hooks = [onScroll,heroPar];
  window.BL.onFrame = function(fn){ hooks.push(fn); fn(); };
  function frame(){ ticking = false; hooks.forEach(function(f){ f(); }); }
  addEventListener('scroll',function(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } },{passive:true});
  addEventListener('resize',frame);
  frame();
})();
