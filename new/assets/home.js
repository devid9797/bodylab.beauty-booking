/* BodyLab.Beauty – новый дизайн: только главная страница (липкие услуги, стопка карточек, счётчики, отзывы) */
(function(){
  var B = window.BL, $ = B.$, $$ = B.$$, reduce = B.reduce;
  var ROOT = document.documentElement.dataset.root || '/';

  /* липкая секция «Услуги» */
  var pin = $('#uslugi');
  if(pin){
    var wins = $$('.win',pin), steps = $$('.step',pin), rail = $('#rail'), cur = -1;
    var setActive = function(i){
      if(i===cur) return; cur = i;
      wins.forEach(function(w,k){ w.classList.toggle('on',k===i); w.classList.toggle('past',k<i); });
      steps.forEach(function(s,k){ s.classList.toggle('on',k===i); });
      rail.style.setProperty('--p', wins.length>1 ? i/(wins.length-1) : 0);
      pin.classList.toggle('at-end', i === wins.length-1);
      $$('.wa-b',pin).forEach(function(b){ b.disabled = (+b.dataset.dir < 0 && i === 0) || (+b.dataset.dir > 0 && i === wins.length-1); });
    };
    B.onFrame(function(){
      var r = pin.getBoundingClientRect(), total = r.height - innerHeight;
      var p = Math.min(1,Math.max(0,-r.top/total));
      setActive(Math.min(wins.length-1, Math.floor(p*wins.length)));
    });
    /* листание карточек влево-вправо (и стрелками) – то же, что прокрутка вниз */
    function goTo(i){
      i = Math.max(0, Math.min(wins.length-1, i));
      var r = pin.getBoundingClientRect(), total = r.height - innerHeight;
      scrollTo({top: scrollY + r.top + total*(i+.5)/wins.length, behavior: reduce?'auto':'smooth'});
    }
    /* после последней карточки: кнопка «вниз» ведёт к следующему блоку */
    function nextBlock(){
      var t = $('#vizit'); if(!t) return;
      scrollTo({top: t.getBoundingClientRect().top + scrollY - 76, behavior: reduce?'auto':'smooth'});
    }
    $$('[data-pin-next]',pin).forEach(function(b){ b.addEventListener('click',nextBlock); });
    var stage = $('#stage'), tx = 0, ty = 0, tt = 0;
    stage.addEventListener('touchstart',function(e){ var t = e.touches[0]; tx = t.clientX; ty = t.clientY; tt = Date.now(); },{passive:true});
    stage.addEventListener('touchend',function(e){
      var t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
      if(Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - tt < 900) { if(dx < 0 && cur === wins.length-1) nextBlock(); else goTo(cur + (dx < 0 ? 1 : -1)); }
    },{passive:true});
    $$('.wa-b',pin).forEach(function(b){ b.addEventListener('click',function(){ goTo(cur + (+b.dataset.dir)); }); });
    steps.forEach(function(s){ s.addEventListener('click',function(){
      var i = +s.dataset.i, r = pin.getBoundingClientRect(), total = r.height - innerHeight;
      scrollTo({top: scrollY + r.top + total*(i+.5)/wins.length, behavior: reduce?'auto':'smooth'});
    });});
  }

  /* «Как проходит визит»: нижние карточки чуть уменьшаются под верхними */
  var fcards = $$('.fcard');
  if(fcards.length) B.onFrame(function(){
    fcards.forEach(function(c,i){
      var next = fcards[i+1]; if(!next) return;
      var a = c.getBoundingClientRect(), b = next.getBoundingClientRect();
      var overlap = Math.max(0,Math.min(1,(a.bottom - b.top)/a.height));
      c.style.transform = 'scale('+(1-overlap*.05)+')';
      c.style.filter = 'brightness('+(1-overlap*.04)+')';
    });
  });

  /* счётчики */
  $$('[data-count]').forEach(function(el){
    var end = +el.dataset.count, started = false;
    var co = new IntersectionObserver(function(es){
      if(es[0].isIntersecting && !started){ started = true; co.disconnect();
        if(reduce){ el.textContent = end; return; }
        var t0 = performance.now(), dur = 1600;
        (function tick(t){ var k = Math.min(1,(t-t0)/dur); k = 1-Math.pow(1-k,4); el.textContent = Math.round(end*k); if(k<1) requestAnimationFrame(tick); })(t0);
      }
    },{threshold:.6});
    el.textContent = 0; co.observe(el);
  });

  /* отзывы: крупные карточки, листание, клик – открыть крупно (лайтбокс) */
  var track = $('#rev-track');
  if(track){
    var html = '', alt = track.dataset.alt || '';
    for(var n=1;n<=10;n++) html += '<figure class="rev"><img src="'+ROOT+'images/review-'+n+'.jpg" alt="'+alt+' '+n+'" loading="lazy" width="324" height="640"></figure>';
    track.innerHTML = html;
    if(B.zoomMark) B.zoomMark(track);
    var step = function(dir){ var w = track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 18 : 300; track.scrollBy({left: dir * w * (innerWidth > 700 ? 2 : 1), behavior: reduce ? 'auto' : 'smooth'}); };
    $('#rev-prev').addEventListener('click',function(){ step(-1); });
    $('#rev-next').addEventListener('click',function(){ step(1); });
    var upd = function(){ var max = track.scrollWidth - track.clientWidth - 4; $('#rev-prev').disabled = track.scrollLeft < 4; $('#rev-next').disabled = track.scrollLeft >= max; };
    track.addEventListener('scroll',upd,{passive:true}); upd(); addEventListener('resize',upd);
  }

  /* студия и остальные фото на странице тоже открываются крупно */
  if(B.zoomMark) B.zoomMark();
})();
