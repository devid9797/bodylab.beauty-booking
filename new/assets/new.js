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

  /* ---- страховка появления: всё, что уже в зоне видимости или выше неё, показываем,
          даже если наблюдатель пропустил элемент (быстрый скролл, переход по якорю, End/Page Down) ---- */
  function sweepReveal(){
    $$('.rv:not(.in),.mask:not(.in),.line-grow:not(.in)').forEach(function(el){
      if(el.getBoundingClientRect().top < innerHeight*0.96){ el.classList.add('in'); if(io) io.unobserve(el); }
    });
  }
  addEventListener('load',sweepReveal); addEventListener('hashchange',function(){ setTimeout(sweepReveal,50); });


  /* ---- 7. лайтбокс: любое фото на странице открывается крупно ---- */
  var LB = (function(){
    var root, imgEl, cap, count, list = [], cur = 0, lastFocus;
    var lbText = (document.documentElement.dataset.lbClose || '') ? null : null;
    function build(){
      if(root) return;
      var d = document.documentElement.dataset;
      root = document.createElement('div'); root.className = 'lb'; root.setAttribute('role','dialog'); root.setAttribute('aria-modal','true'); root.hidden = true;
      root.innerHTML = '<button class="lb-x" type="button" aria-label="'+(d.lbClose||'Close')+'"><i></i></button>'+
        '<button class="lb-n lb-prev" type="button" aria-label="'+(d.lbPrev||'Previous')+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>'+
        '<button class="lb-n lb-next" type="button" aria-label="'+(d.lbNext||'Next')+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>'+
        '<figure class="lb-f"><img alt=""><figcaption></figcaption></figure><div class="lb-c"></div>';
      document.body.appendChild(root);
      imgEl = $('img',root); cap = $('figcaption',root); count = $('.lb-c',root);
      root.addEventListener('click',function(e){ if(e.target===root || e.target.closest('.lb-x')) close(); else if(e.target.closest('.lb-prev')) step(-1); else if(e.target.closest('.lb-next')) step(1); });
      document.addEventListener('keydown',function(e){ if(root.hidden) return; if(e.key==='Escape') close(); else if(e.key==='ArrowLeft') step(-1); else if(e.key==='ArrowRight') step(1); });
      var sx = null; root.addEventListener('touchstart',function(e){ sx = e.touches[0].clientX; },{passive:true});
      root.addEventListener('touchend',function(e){ if(sx===null) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if(Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });
    }
    function show(){
      var el = list[cur]; imgEl.classList.remove('in'); void imgEl.offsetWidth;
      imgEl.src = el.currentSrc || el.src; imgEl.alt = el.alt || ''; cap.textContent = el.alt || '';
      count.textContent = list.length > 1 ? (cur+1)+' / '+list.length : '';
      root.classList.toggle('single', list.length < 2);
      imgEl.classList.add('in');
    }
    function open(el){
      build();
      var g = el.closest('[data-gallery]');
      list = g ? $$('img.zoomable',g) : [el]; cur = Math.max(0, list.indexOf(el));
      lastFocus = document.activeElement; root.hidden = false; document.documentElement.classList.add('lb-open');
      requestAnimationFrame(function(){ root.classList.add('open'); });
      show(); $('.lb-x',root).focus();
    }
    function step(n){ cur = (cur + n + list.length) % list.length; show(); }
    function close(){ root.classList.remove('open'); document.documentElement.classList.remove('lb-open'); setTimeout(function(){ root.hidden = true; imgEl.removeAttribute('src'); },350); if(lastFocus && lastFocus.focus) lastFocus.focus(); }
    function mark(scope){ $$('img',scope||document).forEach(function(i){ if(!i.closest('a,button,.nav,.menu,.dock,.lb,.nozoom')) i.classList.add('zoomable'); }); }
    document.addEventListener('click',function(e){ var i = e.target.closest && e.target.closest('img.zoomable'); if(i) open(i); });
    mark();
    return {mark:mark};
  })();
  window.BL.zoomMark = LB.mark;


  /* ---- 8. кнопка «Написать» (WhatsApp / Instagram) ---- */
  var fab = $('#fab');
  if(fab){
    var ft = $('#fab-t');
    ft.addEventListener('click',function(e){ e.stopPropagation(); var o = fab.classList.toggle('open'); ft.setAttribute('aria-expanded',o); });
    document.addEventListener('click',function(e){ if(!fab.contains(e.target)){ fab.classList.remove('open'); ft.setAttribute('aria-expanded',false); } });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ fab.classList.remove('open'); ft.setAttribute('aria-expanded',false); } });
  }


  /* ---- 9. язык: выпадающий список рядом с бургером (телефон) ---- */
  var dd = $('#lang-dd');
  if(dd){
    var lb = $('#lang-btn');
    lb.addEventListener('click',function(e){ e.stopPropagation(); var o = dd.classList.toggle('open'); lb.setAttribute('aria-expanded',o); });
    document.addEventListener('click',function(e){ if(!dd.contains(e.target)){ dd.classList.remove('open'); lb.setAttribute('aria-expanded',false); } });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ dd.classList.remove('open'); lb.setAttribute('aria-expanded',false); } });
  }

  /* ---- общий цикл на rAF ---- */
  var ticking = false, hooks = [onScroll,heroPar,sweepReveal];
  window.BL.onFrame = function(fn){ hooks.push(fn); fn(); };
  function frame(){ ticking = false; hooks.forEach(function(f){ f(); }); }
  addEventListener('scroll',function(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } },{passive:true});
  addEventListener('resize',frame);
  frame();
})();
